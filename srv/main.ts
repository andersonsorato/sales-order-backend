import cds, { Service, Request, SELECT } from "@sap/cds";
import {customer, customers, SalesOrderItem} from "@cds-models/sales";
import { ResultSet } from "@sap/hana-client";

export default (service: Service) => {
    service.after('READ', "customers", (results: customers) => {
        results.forEach((customer: customer) => {
            if (!customer.email?.includes('@')) {
                customer.email = `${customer.email}@gmail.com`;
            }});
     console.log(results);        
});
service.before('CREATE', "salesOrdersHeader", async (request: Request) => {
    const params = request.data; 
    if (!params.customers_id) {
        return request.reject(404, "Missing required field: customers_id");
    }
    if (!params.items || params.items.length === 0) {
        return request.reject(404, "Sales order must contain at least one item");
    }
    const customerQuery = SELECT.one.from('sales.customers').where({ ID: params.customers_id });
    const customer = await cds.run(customerQuery);
    if (!customer) {
        return request.reject(404, "custumer not found with ID: " + params.customers_id);
    }
    const products = params.items.map((item: SalesOrderItem) => item.products_id);
    const productQuery = SELECT.from('sales.products').where({ ID: products });
    
    console.log(JSON.stringify(productQuery));
});

}