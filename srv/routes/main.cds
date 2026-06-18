using { sales } from '../../db/schema';
using {
    db.types.salesReport as salesReport,
    db.types.bulkCreateSalesOrders.Payload as BulkCreateSalesOrderPayload,
    db.types.bulkCreateSalesOrders.ExpectedResult as BulkCreateSalesOrderExpectedResult,
} from '../../db/types';


@requires: ['authenticated-user']
@path: '/sales-order'
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
    entity SalesOrdersHeaders as projection on sales.SalesOrderHeaders actions {
        @restrict: [
        {
            grant: '*',
            to: 'admin'
        }
    ]
        action cloneSalesOrder() returns BulkCreateSalesOrderPayload;    
    }   
    entity customers as projection on sales.customers actions{ 
            @restrict:[
                {
                    grant: ['READ'],
                    TO: 'authenticated-user'
                }
            ]
        function getSalesReportByCustomerId() returns array of salesReport.ExpectedResult; };   
   /* @restrict:[ 
        {
        grant: ['READ'],
        TO: 'read only'
        },
        {
            grant: ['READ', 'WRITE', 'DELETE'],
            TO: 'admin'
         }
        ] */  
    entity products as projection on sales.products;
    entity SalesOrderLog as projection on sales.SalesOrderLog;
    entity SalesOrderStatuses as projection on sales.SalesOrderStatuses;
}

// functions
extend service SalesOrderService with {
function getSalesReportByDays(days: salesReport.Params: days ) returns array of salesReport.ExpectedResult;
}

//Actions
extend service SalesOrderService with {
    action bulkCreateSalesOrders(payload: array of BulkCreateSalesOrderPayload) returns array of BulkCreateSalesOrderExpectedResult;    
}