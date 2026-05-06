import { SalesOrderHeader } from "@cds-models/sales";

export type CreationPayloadValidationResult = {
    hasError: boolean;
    totalAmount?: number;
    error?: Error;
}

export interface SalesOrderHeaderService {
  beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResult>;
}