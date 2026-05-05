import { customers } from "@cds-models/sales";
import { CustomerController } from "./protocols";
import { CustomerService } from "srv/services/customer/protocol";

export class CustomerControllerImpl implements CustomerController {
    constructor(private readonly service: CustomerService) {}
    public afterRead(customerList: customers): customers {
        return this.service.afterRead(customerList);
    }
}   