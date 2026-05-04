import * as cds from "@sap/cds";
import { Service, Request } from "@sap/cds";
import {customer, customers, product, SalesOrderItem} from "@cds-models/sales";
import { ResultSet } from "@sap/hana-client";
import { clear } from "node:console";

const { SELECT } = cds.ql;

export default (service: Service) => {

service.before('READ', '*', (request: Request) => {
    console.log("ates de ler");
    if (!request.user.is('read only'))    
    {return request.reject(403, "Unauthorized access - read only role required");}
}
);

service.before(['WRITE',  'DELETE'], '*', (request: Request) => {
    if (!request.user.is('admin'))    
    {return request.reject(403, "Unauthorized access - admin role required");}
}
);

    service.after('READ', "customers", (results: customers) => {
        results.forEach((customer: customer) => {
            if (!customer.email?.includes('@')) {
                customer.email = `${customer.email}@gmail.com`;
            }});
     console.log(results);        
});


service.before('CREATE', "SalesOrdersHeaders", async (request: Request) => {
    const params = request.data; 
    console.log(params);
    if (!params.customers_id) {
        return request.reject(404, "Missing required field: customers_id");
    }
    if (!params.items || params.items.length === 0) {
        return request.reject(404, "Sales order must contain at least one item");
    }
    const customerQuery = SELECT.one.from('sales.customers').where({ id: params.customers_id });
    const customer = await cds.run(customerQuery);
    if (!customer) {
        return request.reject(404, "customer not found with ID: " + params.customers_id);
    }
    const products: string[] = params.items.map((item: SalesOrderItem) => item.products_id);
    const productQuery = SELECT.from('sales.products').where({ id: { in: products } });
    const productResults = await cds.run(productQuery);
    const dbPrducts = productResults.map((product: product) => product.id);
    if (!products.every((productsId => dbPrducts.includes(productsId)))) {
        return request.reject(404, "One or more products not found with IDs: " + products.join(", "));
    }
    console.log(JSON.stringify(productQuery));
});

}