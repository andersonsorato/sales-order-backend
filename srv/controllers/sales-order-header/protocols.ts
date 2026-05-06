import { SalesOrderHeader } from "@cds-models/sales";
import { SalesOrderHeaderService } from "srv/services/sales-order-header/protocols";


export type CreationPayloadValidationResult = {
    hasError: boolean;
    totalAmount?: number;
    error?: Error;
}

export interface SalesOrderHeaderController {  

    beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult>;

}    
