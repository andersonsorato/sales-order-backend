/*  const items: SalesOrderItems = params.items as SalesOrderItems;
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
    }*/