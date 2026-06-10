using { sales } from '../schema';

namespace db.types.salesReport;

type Params {
    days: Integer;
}

type ExpectedResult{
    salesOrderId: sales.SalesOrderHeaders:id;
    salesOrderTotalAmount: sales.SalesOrderHeaders:totalamount;
    customerId: sales.customers:id;
    customerFullName: String(120);
}
