import { SalesReportModel } from '@/models/sales-report';

import { SalesReportRepository } from '@/repositories/sales-report/protocols';

export class SalesReportRepositoryStub implements SalesReportRepository {
    public async findByCustomerId(customerId: string): Promise<SalesReportModel[] | null> {
        const salesOrderId = crypto.randomUUID();
        const result: SalesReportModel[] = [
            SalesReportModel.with({
                salesOrderId,
                SalesOrderTotalAmount: 100,
                customerId,
                customerFullName: 'Valid Customer',
            }),
        ];
        return result;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async findByDays(days: number): Promise<SalesReportModel[] | null> {
        const salesOrderId = crypto.randomUUID();
        const customerId = crypto.randomUUID();
        const result: SalesReportModel[] = [
            SalesReportModel.with({
                salesOrderId,
                SalesOrderTotalAmount: 100,
                customerId,
                customerFullName: 'Valid Customer',
            }),
        ];
        return result;
    }
}
