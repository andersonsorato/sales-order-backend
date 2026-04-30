import * as cds from "@sap/cds";
import { Service, Request } from "@sap/cds";
import {customer, customers, product, SalesOrderItem} from "@cds-models/sales";
import { ResultSet } from "@sap/hana-client";

const { SELECT } = cds.ql;

export default (service: Service) => {
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
    if (!params.customer_id) {
        return request.reject(404, "Missing required field: customer_id");
    }
    if (!params.items || params.items.length === 0) {
        return request.reject(404, "Sales order must contain at least one item");
    }
    const customerQuery = SELECT.one.from('sales.customers').where({ ID: params.customers_id });
    const customer = await cds.run(customerQuery);
    if (!customer) {
        return request.reject(404, "custumer not found with ID: " + params.customers_id);
    }
    const products: string[] = params.items.map((item: SalesOrderItem) => item.products_id);
    const productQuery = SELECT.from('sales.products').where({ ID: { in: products } });
    const productResults = await cds.run(productQuery);
    const dbPrducts = productResults.map((product: product) => productResults.id);
    if (!products.every((products => dbPrducts.includes(products)))) {
        return request.reject(404, "One or more products not found with IDs: " + products.join(", "));
    }
    console.log(JSON.stringify(productQuery));
});
console.log("Hello world2");
}