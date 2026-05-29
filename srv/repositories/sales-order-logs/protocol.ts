import { SalesOrderLogModel } from '@/models/sales-order-log';

export interface SalesOrderLogRepositoru {
    create(logs: SalesOrderLogModel[]): Promise<void>;
}
