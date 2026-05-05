import { customers } from "@cds-models/sales";

export interface CustomerService{
    afterRead(customerList: customers): customers;
}