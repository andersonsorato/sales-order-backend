import { User } from '@sap/cds';

import { CustomerModel } from '@/models/customer';
import { CustomerRepository } from '@/repositories/customer/protocols';
import { LoggedUserModel } from '@/models/logged-user';
import { ProductModel } from '@/models/product';
import { ProductRepository } from '@/repositories/product/protocols';
import { SalesOrderHeaderModel } from '@/models/sales-order-header';
import { SalesOrderHeaderRepository } from '@/repositories/sales-order-header/protocols';
import { SalesOrderItemModel } from '@/models/sales-order-item';
import { SalesOrderLogModel } from '@/models/sales-order-log';
import { SalesOrderLogRepositoru } from '@/repositories/sales-order-logs/protocol';
import {
    Payload as BulkCreateSalesOrderPayload,
    ExpectedResult as BulkCreateSalesOrderResult,
} from '@models/db/types/BulkCreateSalesOrder';
import { CreationPayloadValidationResult, SalesOrderHeaderService } from '@/services/sales-order-header/protocols';
import { SalesOrderHeader, SalesOrderHeaders, SalesOrderItem } from '@cds-models/sales';

export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor(
        private readonly productRepository: ProductRepository,
        private readonly salesOrderLogRepository: SalesOrderLogRepositoru,
        private readonly customerRepository: CustomerRepository,
        private readonly salesOrderHeaderRepository: SalesOrderHeaderRepository,
    ) {}

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult> {
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
            throw validationResult.errors as Error;
        }
        return {
            hasError: false,
            totalAmount: header.calculateTotalAmount() - header.calculateDiscount(),
        };
    }
    public async afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void> {
        const headerAsArray = Array.isArray(params) ? params : ([params] as SalesOrderHeader[]);
        const logs: SalesOrderLogModel[] = [];
        for (const header of headerAsArray) {
            const products = (await this.getProductsForHeader(header)) as ProductModel[];
            if (!products) {
                throw new Error('PRODUTO NAO ENCONTRADO');
            }
            const items = this.getSalesOrderItems(header, products);
            const salesOrderHeader = this.getSalesOrderHeader(header, items);
            const productData = salesOrderHeader.getProductsData();
            for (const product of products) {
                const foundProduct = productData.find((productData) => productData.id === product.id);
                product.sell(foundProduct?.quantity as number);
                await this.productRepository.updateStock(product);
            }
            const user = this.getLoggedUser(loggedUser);
            const log = SalesOrderLogModel.create({
                headerId: salesOrderHeader.id,
                userData: user.toStringifiedObject(),
                orderData: salesOrderHeader.toStringfieObject(),
            });
            logs.push(log);
        }
        await this.salesOrderLogRepository.create(logs);
    }

    public async bulkCreate(
        params: BulkCreateSalesOrderPayload[],
        loggedUser: User,
    ): Promise<BulkCreateSalesOrderResult[]> {
        const preparedOrders = await this.prepareBulkOrders(params);
        const headers = preparedOrders.map(({ header }) => header);
        await this.salesOrderHeaderRepository.bulkCreate(headers);
        await this.updateBulkOrderStocks(preparedOrders);
        await this.createBulkOrderLogs(preparedOrders, loggedUser);
        return headers.map(() => ({ success: true }));
    }

    private async getProductsByIds(params: SalesOrderHeader | SalesOrderHeaders): Promise<ProductModel[] | null> {
        const headers = Array.isArray(params) ? params : [params];
        const productsIds = headers.flatMap(
            (header) => header.items?.map((item: SalesOrderItem) => item.products_id) ?? [],
        );
        const uniqueIds = Array.from(new Set(productsIds.filter(Boolean))) as string[];
        return this.productRepository.findByIds(uniqueIds);
    }

    private async getProductsForHeader(header: SalesOrderHeader): Promise<ProductModel[] | null> {
        const productsFromItems = header.items?.flatMap((item) => item.products ?? []) ?? [];
        const embeddedProducts = Array.from(
            new Map(productsFromItems.map((product) => [product.id, product] as const)).values(),
        );
        if (embeddedProducts.length > 0) {
            return embeddedProducts;
        }

        return this.getProductsByIds(header);
    }
    private getSalesOrderItems(params: SalesOrderHeader, products: ProductModel[]): SalesOrderItemModel[] {
        return params.items?.map((item) =>
            SalesOrderItemModel.create({
                price: item.price as number,
                productId: item.products_id as string,
                quantity: item.quantity as number,
                products,
            }),
        ) as SalesOrderItemModel[];
    }
    private getSalesOrderHeader(params: SalesOrderHeader, items: SalesOrderItemModel[]): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.create({
            customerId: params.customers_id as string,
            items,
        });
    }
    private getCustomerById(params: SalesOrderHeader): Promise<CustomerModel | null> {
        const customerId = params.customers_id as string;
        return this.customerRepository.findById(customerId);
    }

    private async getBulkProductsByIds(params: BulkCreateSalesOrderPayload): Promise<ProductModel[] | null> {
        const uniqueIds = Array.from(
            new Set(params.items?.map((item) => item.productId).filter(Boolean) ?? []),
        ) as string[];
        return this.productRepository.findByIds(uniqueIds);
    }

    private getBulkSalesOrderItems(
        params: BulkCreateSalesOrderPayload,
        products: ProductModel[],
    ): SalesOrderItemModel[] {
        return params.items?.map((item) =>
            SalesOrderItemModel.create({
                price: item.price,
                productId: item.productId,
                quantity: item.quantity,
                products,
            }),
        ) as SalesOrderItemModel[];
    }

    private getBulkSalesOrderHeader(
        params: BulkCreateSalesOrderPayload,
        items: SalesOrderItemModel[],
    ): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.create({
            customerId: params.customerId,
            items,
        });
    }

    private getBulkCustomerById(params: BulkCreateSalesOrderPayload): Promise<CustomerModel | null> {
        return this.customerRepository.findById(params.customerId);
    }

    private async prepareBulkOrders(
        params: BulkCreateSalesOrderPayload[],
    ): Promise<Array<{ header: SalesOrderHeaderModel; products: ProductModel[] }>> {
        const preparedOrders: Array<{ header: SalesOrderHeaderModel; products: ProductModel[] }> = [];
        for (const payload of params) {
            preparedOrders.push(await this.prepareBulkOrder(payload));
        }
        return preparedOrders;
    }

    private async prepareBulkOrder(
        payload: BulkCreateSalesOrderPayload,
    ): Promise<{ header: SalesOrderHeaderModel; products: ProductModel[] }> {
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
            throw validationResult.errors as Error;
        }

        return { header, products };
    }

    private async updateBulkOrderStocks(
        preparedOrders: Array<{ header: SalesOrderHeaderModel; products: ProductModel[] }>,
    ): Promise<void> {
        for (const { header, products } of preparedOrders) {
            const productData = header.getProductsData();
            for (const product of products) {
                const foundProduct = productData.find((productData) => productData.id === product.id);
                product.sell(foundProduct?.quantity as number);
                await this.productRepository.updateStock(product);
            }
        }
    }

    private async createBulkOrderLogs(
        preparedOrders: Array<{ header: SalesOrderHeaderModel; products: ProductModel[] }>,
        loggedUser: User,
    ): Promise<void> {
        const user = this.getLoggedUser(loggedUser);
        const logs = preparedOrders.map(({ header }) =>
            SalesOrderLogModel.create({
                headerId: header.id,
                userData: user.toStringifiedObject(),
                orderData: header.toStringfieObject(),
            }),
        );
        await this.salesOrderLogRepository.create(logs);
    }
    public async cloneSalesOrder(id: string, loggedUser: User): Promise<CreationPayloadValidationResult> {
        const header = await this.salesOrderHeaderRepository.findCompleteSalesOrderById(id);
        if (!header) {
            return {
                hasError: true,
                error: new Error('Pedido nao encontrado'),
            };
        }
        const validationResult = header.validateCreationPayload({ customer_Id: header.customerId });
        if (validationResult.isValid) {
            throw validationResult.errors as Error;
        }
        await this.salesOrderHeaderRepository.bulkCreate([header]);
        const headerAsParams = {
            customers_id: header.customerId,
            items: header.items,
        } as SalesOrderHeader;
        await this.afterCreate([headerAsParams], loggedUser);
        return this.serializeBulkCreateResult([header]);
    }

    private serializeBulkCreateResult(headers: SalesOrderHeaderModel[]): CreationPayloadValidationResult {
        return {
            hasError: false,
            totalAmount: headers.reduce(
                (acc, header) => acc + (header.calculateTotalAmount() - header.calculateDiscount()),
                0,
            ),
        };
    }

    private getLoggedUser(loggedUser: User): LoggedUserModel {
        return LoggedUserModel.create({
            id: loggedUser.id,
            roles: loggedUser.roles as string[],
            attr: {
                id: loggedUser.attr.id as unknown as number,
                groups: loggedUser.attr.groups as unknown as string[],
            },
        });
    }
}
