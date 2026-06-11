using { sales } from '../schema';

namespace db.types.bulkCreateSalesOrders; 

    type Payload {
        customerId: sales.customers:id;
        items: array of ItemsPayload;
    }
type ItemsPayload {
    productId: sales.products:id;
    quantity: sales.SalesOrderItems:quantity;
    price: sales.SalesOrderItems:price;
}

type ExpectedResult {
    success: Boolean;
}
