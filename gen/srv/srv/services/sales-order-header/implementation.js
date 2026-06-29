"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderHeaderServiceImpl = void 0;
const logged_user_1 = require("@/models/logged-user");
const sales_order_header_1 = require("@/models/sales-order-header");
const sales_order_item_1 = require("@/models/sales-order-item");
const sales_order_log_1 = require("@/models/sales-order-log");
class SalesOrderHeaderServiceImpl {
    constructor(productRepository, salesOrderLogRepository, customerRepository, salesOrderHeaderRepository) {
        this.productRepository = productRepository;
        this.salesOrderLogRepository = salesOrderLogRepository;
        this.customerRepository = customerRepository;
        this.salesOrderHeaderRepository = salesOrderHeaderRepository;
    }
    async beforeCreate(params) {
        const products = await this.getProductsByIds(params);
        if (!products) {
            return {
                hasError: true,
                error: new Error('PRODUTO NAO ENCONTRADO'),
            };
        }
        const items = this.getSalesOrderItems(params, products);
        const header = this.getSalesOrderHeader(params, items);
        const customer = await this.getCustomerById(params);
        if (!customer) {
            return {
                hasError: true,
                error: new Error('FORNECEDOR NAO ENCONTRADO'),
            };
        }
        const validationResult = header.validateCreationPayload({ customer_Id: customer.id });
        if (validationResult.isValid) {
            throw validationResult.errors;
        }
        return {
            hasError: false,
            totalAmount: header.calculateTotalAmount() - header.calculateDiscount(),
        };
    }
    async afterCreate(params, loggedUser) {
        const headerAsArray = Array.isArray(params) ? params : [params];
        const logs = [];
        for (const header of headerAsArray) {
            const products = (await this.getProductsForHeader(header));
            if (!products) {
                throw new Error('PRODUTO NAO ENCONTRADO');
            }
            const items = this.getSalesOrderItems(header, products);
            const salesOrderHeader = this.getSalesOrderHeader(header, items);
            const productData = salesOrderHeader.getProductsData();
            for (const product of products) {
                const foundProduct = productData.find((productData) => productData.id === product.id);
                product.sell(foundProduct?.quantity);
                await this.productRepository.updateStock(product);
            }
            const user = this.getLoggedUser(loggedUser);
            const log = sales_order_log_1.SalesOrderLogModel.create({
                headerId: salesOrderHeader.id,
                userData: user.toStringifiedObject(),
                orderData: salesOrderHeader.toStringfieObject(),
            });
            logs.push(log);
        }
        await this.salesOrderLogRepository.create(logs);
    }
    async bulkCreate(params, loggedUser) {
        const preparedOrders = await this.prepareBulkOrders(params);
        const headers = preparedOrders.map(({ header }) => header);
        await this.salesOrderHeaderRepository.bulkCreate(headers);
        await this.updateBulkOrderStocks(preparedOrders);
        await this.createBulkOrderLogs(preparedOrders, loggedUser);
        return headers.map(() => ({ success: true }));
    }
    async getProductsByIds(params) {
        const headers = Array.isArray(params) ? params : [params];
        const productsIds = headers.flatMap((header) => header.items?.map((item) => item.products_id) ?? []);
        const uniqueIds = Array.from(new Set(productsIds.filter(Boolean)));
        return this.productRepository.findByIds(uniqueIds);
    }
    async getProductsForHeader(header) {
        const productsFromItems = header.items?.flatMap((item) => item.products ?? []) ?? [];
        const embeddedProducts = Array.from(new Map(productsFromItems.map((product) => [product.id, product])).values());
        if (embeddedProducts.length > 0) {
            return embeddedProducts;
        }
        return this.getProductsByIds(header);
    }
    getSalesOrderItems(params, products) {
        return params.items?.map((item) => sales_order_item_1.SalesOrderItemModel.create({
            price: item.price,
            productId: item.products_id,
            quantity: item.quantity,
            products,
        }));
    }
    getSalesOrderHeader(params, items) {
        return sales_order_header_1.SalesOrderHeaderModel.create({
            customerId: params.customers_id,
            items,
        });
    }
    getCustomerById(params) {
        const customerId = params.customers_id;
        return this.customerRepository.findById(customerId);
    }
    async getBulkProductsByIds(params) {
        const uniqueIds = Array.from(new Set(params.items?.map((item) => item.productId).filter(Boolean) ?? []));
        return this.productRepository.findByIds(uniqueIds);
    }
    getBulkSalesOrderItems(params, products) {
        return params.items?.map((item) => sales_order_item_1.SalesOrderItemModel.create({
            price: item.price,
            productId: item.productId,
            quantity: item.quantity,
            products,
        }));
    }
    getBulkSalesOrderHeader(params, items) {
        return sales_order_header_1.SalesOrderHeaderModel.create({
            customerId: params.customerId,
            items,
        });
    }
    getBulkCustomerById(params) {
        return this.customerRepository.findById(params.customerId);
    }
    async prepareBulkOrders(params) {
        const preparedOrders = [];
        for (const payload of params) {
            preparedOrders.push(await this.prepareBulkOrder(payload));
        }
        return preparedOrders;
    }
    async prepareBulkOrder(payload) {
        const products = await this.getBulkProductsByIds(payload);
        if (!products) {
            throw new Error('PRODUTO NAO ENCONTRADO');
        }
        const items = this.getBulkSalesOrderItems(payload, products);
        const header = this.getBulkSalesOrderHeader(payload, items);
        const customer = await this.getBulkCustomerById(payload);
        if (!customer) {
            throw new Error('FORNECEDOR NAO ENCONTRADO');
        }
        const validationResult = header.validateCreationPayload({ customer_Id: customer.id });
        if (validationResult.isValid) {
            throw validationResult.errors;
        }
        return { header, products };
    }
    async updateBulkOrderStocks(preparedOrders) {
        for (const { header, products } of preparedOrders) {
            const productData = header.getProductsData();
            for (const product of products) {
                const foundProduct = productData.find((productData) => productData.id === product.id);
                product.sell(foundProduct?.quantity);
                await this.productRepository.updateStock(product);
            }
        }
    }
    async createBulkOrderLogs(preparedOrders, loggedUser) {
        const user = this.getLoggedUser(loggedUser);
        const logs = preparedOrders.map(({ header }) => sales_order_log_1.SalesOrderLogModel.create({
            headerId: header.id,
            userData: user.toStringifiedObject(),
            orderData: header.toStringfieObject(),
        }));
        await this.salesOrderLogRepository.create(logs);
    }
    async cloneSalesOrder(id, loggedUser) {
        const header = await this.salesOrderHeaderRepository.findCompleteSalesOrderById(id);
        if (!header) {
            return {
                hasError: true,
                error: new Error('Pedido nao encontrado'),
            };
        }
        const validationResult = header.validateCreationPayload({ customer_Id: header.customerId });
        if (validationResult.isValid) {
            throw validationResult.errors;
        }
        await this.salesOrderHeaderRepository.bulkCreate([header]);
        const headerAsParams = {
            customers_id: header.customerId,
            items: header.items,
        };
        await this.afterCreate([headerAsParams], loggedUser);
        return this.serializeBulkCreateResult([header]);
    }
    serializeBulkCreateResult(headers) {
        return {
            hasError: false,
            totalAmount: headers.reduce((acc, header) => acc + (header.calculateTotalAmount() - header.calculateDiscount()), 0),
        };
    }
    getLoggedUser(loggedUser) {
        return logged_user_1.LoggedUserModel.create({
            id: loggedUser.id,
            roles: loggedUser.roles,
            attr: {
                id: loggedUser.attr.id,
                groups: loggedUser.attr.groups,
            },
        });
    }
}
exports.SalesOrderHeaderServiceImpl = SalesOrderHeaderServiceImpl;
//# sourceMappingURL=implementation.js.map