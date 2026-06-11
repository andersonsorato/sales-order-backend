import { User } from '@sap/cds';

import {
    Payload as BulkCreateSalesOrderPayload,
    ExpectedResult as BulkCreateSalesOrderResult,
} from '@models/db/types/BulkCreateSalesOrder';
import { SalesOrderHeader, SalesOrderHeaders } from '@cds-models/sales';

import { SalesOrderHeaderService } from '@/services/sales-order-header/protocols';
import {
    CreationPayloadValidationResult,
    SalesOrderHeaderController,
} from '@/controllers/sales-order-header/protocols';

export class SalesOrderHeaderControllerImpl implements SalesOrderHeaderController {
    constructor(private readonly Service: SalesOrderHeaderService) {}

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult> {
        try {
            return this.Service.beforeCreate(params);
        } catch (error) {
            return {
                hasError: true,
                error: error as Error,
            };
        }
    }
    public async afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void> {
        return this.Service.afterCreate(params, loggedUser);
    }

    public async bulkCreate(
        params: BulkCreateSalesOrderPayload[],
        loggedUser: User,
    ): Promise<BulkCreateSalesOrderResult[]> {
        return this.Service.bulkCreate(params, loggedUser);
    }
}
