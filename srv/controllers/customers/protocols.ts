import { customers } from '@cds-models/sales';

import { BaseControllerResponse } from '@/controllers/base';

export interface CustomerController {
    afterRead(customerList: customers): BaseControllerResponse;
}
