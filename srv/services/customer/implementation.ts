import { customers } from '@cds-models/sales';

import { CustomerModel } from '@/models/customer';
import { CustomerService } from '@/services/customer/protocol';
import { AbstractErro, ServerError } from '@/errors';
import { Either, left, right } from '@sweet-monads/either';

export class CustomerServiceImpl implements CustomerService {
    public afterRead(customerList: customers): Either<AbstractErro, customers> {
        try {
            const customersS = customerList.map((customer) => {
                const customerR = CustomerModel.whit({
                    id: customer.id,
                    firstName: customer.firstName,
                    //lastName: (customer as unknown as { lastName?: string }).lastName ?? '',
                    email: customer.email,
                });
                console.log(customerR);
                return customerR.setDefaultDomain().toObject();
            });
            console.log(customersS);
            return right(customersS);
        } catch (error) {
            const erroInstance = error instanceof Error ? error : new Error(String(error));
            return left(new ServerError(erroInstance.stack as string, erroInstance.message as string));
        }
    }
}
