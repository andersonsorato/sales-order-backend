import { SalesOrderHeaderService } from "srv/services/sales-order-header/protocols";
import { CreationPayloadValidationResult, SalesOrderHeaderController } from "./protocols";
import { SalesOrderHeader, SalesOrderHeaders } from "@cds-models/sales";
import { User } from "@sap/cds";

export  class SalesOrderHeaderControllerImpl implements SalesOrderHeaderController {
    constructor(
        private readonly Service: SalesOrderHeaderService
    ) { }

    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult> {
        try {            
            return                 this.Service.beforeCreate(params);
        } catch (error) {
            return {
                hasError: true,
                error: error as Error
            }
        }
    }
    public async afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void> {
        return  this.Service.afterCreate(params, loggedUser);
    }
}   