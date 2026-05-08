import { SalesOrderLogModel } from "srv/models/sales-order-log";
import { SalesOrderLogRepositoru } from "./protocol";
import cds from '@sap/cds';

export class SalesOrderLogRepositoryImpl implements SalesOrderLogRepositoru{
    public async create(logs: SalesOrderLogModel[]): Promise<void> {
        const logObjects = logs.map(log => log.toObject());
        await cds.create('sales.SalesOrderLog').entries(logObjects);
    }
}