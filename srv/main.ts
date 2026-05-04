import * as cds from "@sap/cds";
import { Service, Request } from "@sap/cds";
import {customer, customers, product, SalesOrderHeader, SalesOrderHeaders, SalesOrderItem, SalesOrderItems} from "@cds-models/sales";
import { ResultSet } from "@sap/hana-client";
import { clear } from "node:console";

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

    service.after('READ', "customers", (results: customers) => {
        results.forEach((customer: customer) => {
            if (!customer.email?.includes('@')) {
                customer.email = `${customer.email}@gmail.com`;
            }});
     console.log(results);        
});


service.before('CREATE', "SalesOrdersHeaders", async (request: Request) => {
    const params = request.data; 
    const items: SalesOrderItems = params.items as SalesOrderItems;
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
    for(const item of params.items){
        const dbPrducts = productResults.find((product: product) => product.id === item.products_id);
        if (!dbPrducts) {
            return request.reject(404, "One or more products not found with IDs: " + products.join(", "));
        }
        if (dbPrducts.stock === 0) {
            return request.reject(400, "Product with ID " + item.products_id + " is out of stock");
        }
    }
    let totalamount = 0;
    items.forEach(item => {
        totalamount += (item.price as number) * (item.quantity as number);
        
    });
    if (totalamount > 30000 ) {
      totalamount = totalamount * 0.9; // Apply 10% discount  
    }
    request.data.totalamount = totalamount;
});
service.after('CREATE', 'SalesOrderHeaders', async (results: SalesOrderHeaders) => {
  const headersArray = Array.isArray(results) ? results : [results] as SalesOrderHeader[];

  for (const header of headersArray) {
    const items = header.items as SalesOrderItems;
    const productsData = items.map(item => ({
      id: item.products_id as string,
      quantity: item.quantity as number
    }));

    const productsIds = productsData.map(productData => productData.id);
    const productsQuery = SELECT.from('sales.Products').where({ id: productsIds });
    const products: product[] = await cds.run(productsQuery);

    for (const productData of productsData) {
      const foundProduct = products.find(product => product.id === productData.id) as product;
      foundProduct.stock = (foundProduct.stock as number) - productData.quantity;

      await cds.update('sales.Products')
        .where({ id: foundProduct.id })
        .with({ stock: foundProduct.stock });
    }
  }
});

}