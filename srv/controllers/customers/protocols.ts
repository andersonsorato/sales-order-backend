import { customers } from "@cds-models/sales";

export interface CustomerController {
    afterRead(customerList: customers): customers;
}