using { sales } from '../db/schema';

@requires: ['authenticated-user']
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
}