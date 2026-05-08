import * as cds from "@sap/cds";
import { Service, Request } from "@sap/cds";
import {customer, customers, product, products, SalesOrderHeader, SalesOrderHeaders, SalesOrderItem, SalesOrderItems} from "@cds-models/sales";
import { clear, log } from "node:console";
import { customerController } from "./factories/controllers/customers";
import { salesOrderHeaderController } from "./factories/controllers/sales-order-header";
import { FullRequestParams } from "./protocols";

const { SELECT } = cds.ql;

export default (service: Service) => {


service.before(['READ', 'WRITE',  'DELETE'], '*', (request: Request) => {
    if (!request.user.is('admin'))    
    {return request.reject(403, "Unauthorized access - admin role required" + ( request.user as String ))}
}

);

service.before('READ', '*', (request: Request) => {
  
    if (request.user.is('read only') && !request.user.is('admin'))    
    {return request.reject(403, "Unauthorized access - read only role required" + ( request.user as String ));}
}
);

    service.after('READ', "customers", (customerList: customers, request) => {
      //request.results = customerController.afterRead(customerList);
      (request as unknown as FullRequestParams<customers>).result = customerController.afterRead(customerList);
        //results.forEach((customer: customer) => {
           //if (!customer.email?.includes('@')) {
             //   customer.email = `${customer.email}@gmail.com`;
           //}});
     //console.log(results);        
});


service.before('CREATE', "SalesOrdersHeaders", async (request: Request) => {
  
    const result = await salesOrderHeaderController.beforeCreate(request.data);
    if (result.hasError) {
        return request.reject(400, result.error?.message || "Error processing sales order header");
    }
   
    request.data.totalamount = result.totalAmount;
});

service.after('CREATE', 'SalesOrdersHeaders', async (salesOrderHeaders: SalesOrderHeaders, request: Request) => {  
 await salesOrderHeaderController.afterCreate(salesOrderHeaders, request.user);
 console.log(request.user);
});

}