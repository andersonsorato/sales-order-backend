import { Either } from '@sweet-monads/either';

import { AbstractErro } from '@/errors';
import { customers } from '@cds-models/sales';

export interface CustomerService {
    afterRead(customerList: customers): Either<AbstractErro, customers>;
}
