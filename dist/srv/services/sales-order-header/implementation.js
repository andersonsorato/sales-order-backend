"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesOrderHeaderServiceImpl = void 0;
const logged_user_1 = require("@/models/logged-user");
const sales_order_header_1 = require("@/models/sales-order-header");
const sales_order_item_1 = require("@/models/sales-order-item");
const sales_order_log_1 = require("@/models/sales-order-log");
class SalesOrderHeaderServiceImpl {
    constructor(productRepository, salesOrderLogRepository, customerRepository) {
        this.productRepository = productRepository;
        this.salesOrderLogRepository = salesOrderLogRepository;
        this.customerRepository = customerRepository;
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
            const products = (await this.getProductsByIds(params));
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
    async getProductsByIds(params) {
        const headers = Array.isArray(params) ? params : [params];
        const productsIds = headers.flatMap((header) => header.items?.map((item) => item.products_id) ?? []);
        const uniqueIds = Array.from(new Set(productsIds.filter(Boolean)));
        return this.productRepository.findByIds(uniqueIds);
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
