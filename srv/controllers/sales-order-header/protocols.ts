import { User } from '@sap/cds';

import {
    Payload as BulkCreateSalesOrderPayload,
    ExpectedResult as BulkCreateSalesOrderResult,
} from '@models/db/types/BulkCreateSalesOrder';
import { SalesOrderHeader, SalesOrderHeaders } from '@cds-models/sales';

import {} from '@/services/sales-order-header/protocols';

export type CreationPayloadValidationResult = {
    hasError: boolean;
    totalAmount?: number;
    error?: Error;
};

export interface SalesOrderHeaderController {
    beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult>;
    afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void>;
    bulkCreate(params: BulkCreateSalesOrderPayload[], loggedUser: User): Promise<BulkCreateSalesOrderResult[]>;
    cloneSalesOrder(id: string, loggedUser: User): Promise<CreationPayloadValidationResult>;
}
