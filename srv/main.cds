using { sales } from '../db/schema';

service SalesOrderService {
    entity SalesOrdersHeaders as projection on sales.SalesOrderHeaders ;
    entity customers as projection on sales.customers;
    entity products as projection on sales.products;
}