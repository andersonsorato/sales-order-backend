import { SalesOrderHeader, SalesOrderItem } from "@cds-models/sales";
import { SalesOrderHeaderService } from "./protocols";
import { SalesOrderHeaderModel } from "../../models/sales-order-header";
import { SalesOrderItemModel } from "../../models/sales-order-item";
import { ProductRepository } from "../../repositories/product/protocols";
import { CustomerRepository } from "srv/repositories/customer/protocols";


export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor(
            private readonly productRepository: ProductRepository,
            private readonly customerRepository: CustomerRepository
        ) { }

    public async beforeCreate(params: SalesOrderHeader): Promise<any> {
        const productsIds = params.items?.map((item: SalesOrderItem) => item.products_id);
        const products = await this.productRepository.findByIds(productsIds);
        if (!products) {
            throw new Error("Products not found");
        }
      const items = params.items?.map(item => SalesOrderItemModel.create({
        price: item.price as number,
        productId: item.products_id as string,
        quantity: item.quantity as number,
        products: products as any   
     })) as SalesOrderItemModel[];
     const header = SalesOrderHeaderModel.create({
        customerId: params.customers_id as string,
        items 
     });  
     const costumerId = params.customers_id as string;
     const customer = await this.customerRepository.findById(costumerId) ;    
     const validationResult = header.validateCreationPayload({customer_Id: costumerId});
     if (validationResult.isValid) {
        throw validationResult.errors as Error;
     }
     if (!customer) {
        throw new Error("Customer not found");
     }
     return {
         hasError: false,
         totalAmount: header.calculateTotalAmount() - header.calculateDiscount()
         };
     
}
}
