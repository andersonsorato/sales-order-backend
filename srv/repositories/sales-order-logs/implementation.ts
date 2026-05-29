import { SalesOrderLogModel } from '@/models/sales-order-log';
import { SalesOrderLogRepositoru } from '@/repositories/sales-order-logs/protocol';
import cds from '@sap/cds';

export class SalesOrderLogRepositoryImpl implements SalesOrderLogRepositoru {
    public async create(logs: SalesOrderLogModel[]): Promise<void> {
        const logObjects = logs.map((log) => log.toObject());
        await cds.create('sales.SalesOrderLog').entries(logObjects);
    }
}
