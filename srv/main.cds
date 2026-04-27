using { sales } from '../db/schema';

service SalesOrderService {
    entity SalesOrdersHeaders as projection on sales.SalesOrderHeaders ;
}