import { CustomerControllerImpl } from "srv/controllers/customers/implementation";
import { CustomerController } from "srv/controllers/customers/protocols";
import { customerService  } from "../services/customers";

const makeCustomerController = (): CustomerController => {    
    return new CustomerControllerImpl(customerService);
}

export const customerController = makeCustomerController();