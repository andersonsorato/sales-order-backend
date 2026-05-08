import { SalesOrderHeader, SalesOrderHeaders, SalesOrderItem } from "@cds-models/sales";
import { SalesOrderHeaderService } from "./protocols";
import { SalesOrderHeaderModel } from "../../models/sales-order-header";
import { SalesOrderItemModel } from "../../models/sales-order-item";
import { ProductRepository } from "../../repositories/product/protocols";
import { CustomerRepository } from "srv/repositories/customer/protocols";
import { ProductModel } from "srv/models/product";
import { CustomerModel } from "srv/models/customer";
import { SalesOrderLogModel } from "srv/models/sales-order-log";
import { SalesOrderLogRepositoru } from "srv/repositories/sales-order-logs/protocol";
import { User } from "@sap/cds";
import { LoggedUserModel } from "srv/models/logged-user";


export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor(
            private readonly productRepository: ProductRepository,
            private readonly salesOrderLogRepository: SalesOrderLogRepositoru,
            private readonly customerRepository: CustomerRepository
        ) { }

    public async beforeCreate(params: SalesOrderHeader): Promise<any> {      
        const products = await this.getProductsByIds(params);
        if (!products) {
            return {
                hasError: true,
                error: new Error("PRODUTO NAO ENCONTRADO")
            }
        }
        const items = this.getSalesOrderItems(params, products);
        const header = this.getSalesOrderHeader(params, items);   
     const customer = await this.getCustomerById(params);       
     if (!customer) {
        return {
            hasError: true,
            error: new Error("FORNECEDOR NAO ENCONTRADO")
        };
     }
      const validationResult = header.validateCreationPayload({customer_Id: customer.id});
     if (validationResult.isValid) {
        throw validationResult.errors as Error;
     }
     return {
         hasError: false,
         totalAmount: header.calculateTotalAmount() - header.calculateDiscount()
         };
     
}
public async afterCreate(params: SalesOrderHeader, loggedUser: User): Promise<void> {
    const headerAsArray = Array.isArray(params) ? params : [params] as SalesOrderHeader[];
    const logs: SalesOrderLogModel[] = [];
  for (const header of headerAsArray) {
        const products = await this.getProductsByIds(params) as ProductModel[];
        const items = this.getSalesOrderItems(header, products);
        const salesOrderHeader = this.getSalesOrderHeader(header, items);  
        const productData = salesOrderHeader.getProductsData();  
        for (const product of products){
            const foundProduct = productData.find(productData => productData.id === product.id)
            product.sell(foundProduct?.quantity as number)
            await this.productRepository.updateStock(product);
        }
        const user = this.getLoggedUser(loggedUser);       
        const log = SalesOrderLogModel.create({ 
            headerId: salesOrderHeader.id,
            userData: user.toStringifiedObject(),
            orderData: salesOrderHeader.toStringfieObject()
        })
        logs.push(log);
      }
      await this.salesOrderLogRepository.create(logs);
    }


    private async getProductsByIds(params: SalesOrderHeader): Promise<ProductModel[] | null> {
        const productsIds: string[] = params.items?.map((item: SalesOrderItem) => item.products_id) as string[];
        return this.productRepository.findByIds(productsIds);
    }
    private getSalesOrderItems(params: SalesOrderHeader, products: ProductModel[]): SalesOrderItemModel[] {
        return params.items?.map(item => SalesOrderItemModel.create({
                price: item.price as number,
                productId: item.products_id as string,
                quantity: item.quantity as number,
                products
        })) as SalesOrderItemModel[];
    }
    private getSalesOrderHeader(params: SalesOrderHeader, items: SalesOrderItemModel[]): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.create({
            customerId: params.customers_id as string,
            items
        });
    }
    private getCustomerById(params: SalesOrderHeader): Promise<CustomerModel | null> {
        const customerId = params.customers_id as string;
        return this.customerRepository.findById(customerId);
    }

    private getLoggedUser(loggedUser: User): LoggedUserModel{
            return LoggedUserModel.create({
            id: loggedUser.id,
            roles: loggedUser.roles as string[],
            attr: {
                id: loggedUser.attr.id as unknown as number,
                groups: loggedUser.attr.groups as unknown as string[]}
            });
    }
} 



