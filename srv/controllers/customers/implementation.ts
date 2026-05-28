import { CustomerController } from './protocols';
import { CustomerService } from 'srv/services/customer/protocol';
import { customers } from '@cds-models/sales';

export class CustomerControllerImpl implements CustomerController {
    constructor(private readonly service: CustomerService) {}
    public afterRead(customerList: customers): customers {
        return this.service.afterRead(customerList);
    }
}
