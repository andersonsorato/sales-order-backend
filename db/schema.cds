using { managed } from '@sap/cds/common';
namespace sales;
entity SalesOrderHeaders: managed {
    key id : UUID;  
    customers : Association to customers;
    totalamount : Decimal(15,2);  
    items : composition of many SalesOrderItems on items.hearder = $self;
}

entity
SalesOrderItems: managed {
    key id : UUID;      
    hearder : Association to SalesOrderHeaders;  
    products : Association to products;
    product : String;  
    quantity : Integer;  
    price : Decimal(15,2);  
}

entity customers: managed {
    key id : UUID;  
    firstName : String;  
    email : String;  
}

entity products: managed {
    key id : UUID;  
    name : String;  
    price : Decimal(15,2);  
}