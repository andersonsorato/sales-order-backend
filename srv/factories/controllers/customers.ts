import { CustomerController } from '@/controllers/customers/protocols';
import { CustomerControllerImpl } from '@/controllers/customers/implementation';
import { customerService } from '@/factories/services/customers';

const makeCustomerController = (): CustomerController => {
    return new CustomerControllerImpl(customerService);
};

export const customerController = makeCustomerController();
