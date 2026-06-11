import { SalesOrderHeaderModel } from '@/models/sales-order-header';
import { SalesOrderHeaderRepository } from '@/repositories/sales-order-header/protocols';
import cds from '@sap/cds';

export class SalesOrderheaderRepositoryImpl implements SalesOrderHeaderRepository {
    public async bulkCreate(headers: SalesOrderHeaderModel[]): Promise<void> {
        const headerObjects = headers.map((header) => header.toCreateonObject());
        await cds.create('sales.SalesOrderHeaders').entries(headerObjects);
    }
}
