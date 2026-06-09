using { sales } from '../../db/schema';
using { db.types.salesreportbydays } from '../../db/types';


@requires: ['authenticated-user']

// entitys
service SalesOrderService {
    @restrict:[ 
        {
        grant: ['READ'],
        TO: 'read only'
        },
        {
            grant: ['READ', 'WRITE', 'DELETE'],
            TO: 'admin'
         }
        ]    
    entity SalesOrdersHeaders as projection on sales.SalesOrderHeaders ;   
    @restrict:[ 
        {
        grant: ['READ'],
        TO: 'read only'
        },
        {
            grant: ['READ', 'WRITE', 'DELETE'],
            TO: 'admin'
         }
        ]   
    entity customers as projection on sales.customers;   
    @restrict:[ 
        {
        grant: ['READ'],
        TO: 'read only'
        },
        {
            grant: ['READ', 'WRITE', 'DELETE'],
            TO: 'admin'
         }
        ]   
    entity products as projection on sales.products;
    entity SalesOrderLog as projection on sales.SalesOrderLog;
    entity SalesOrderStatuses as projection on sales.SalesOrderStatuses;
}

// functions
extend service SalesOrderService with {
function getSalesReportByDays(days: salesreportbydays.Params: days ) returns array of salesreportbydays.ExpectedResult;
}