using { managed } from '@sap/cds/common';

namespace sales;

entity SalesOrderHeaders: managed {
    key id : UUID;  
    customers : Association to customers;
    status: association to SalesOrderStatuses;
    totalamount : Decimal(15,2);  
    items : composition of many SalesOrderItems on items.hearder = $self;
}

entity SalesOrderItems: managed {
    key id : UUID;      
    hearder : Association to SalesOrderHeaders;  
    products : Association to products;
    product : String;  
    quantity : Integer;  
    price : Decimal(15,2);  
}

entity SalesOrderLog: managed {
    key id : UUID;      
    header : association to SalesOrderHeaders; 
    userData: LargeString;
    orderData: LargeString;     
}

entity SalesOrderStatuses {
    key id: String enum {
        COMPLETED = 'COMPLETED';
        PENDING = 'PENDING';
        REJECTED = 'REJECTED';
    };
    description: localized String;
}

entity customers: managed {
    key id : UUID;  
    firstName : String;  
    email : String;
    salesOrders : association to many SalesOrderHeaders on salesOrders.customers = $self;  
}

entity products: managed {
    key id : UUID;  
    name : String;  
    price : Decimal(15,2);  
    stock : Integer;
}