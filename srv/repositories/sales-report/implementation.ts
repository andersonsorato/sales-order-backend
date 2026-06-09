import cds from '@sap/cds';

import { ExpectedResult as SalesReportByDays } from '@/models/sales-report-by-days';

import { SalesReportModel } from '@/models/sales-report-by-days';
import { SalesReportRepository } from './protocols';

const { SELECT } = cds.ql;

export class SalesReportRepositoryImpl implements SalesReportRepository {
    public async findByDays(days: number): Promise<SalesReportModel[] | null> {
        const today = new Date().toISOString();
        const subtractedDays = new Date();
        subtractedDays.setDate(subtractedDays.getDate() - days);
        const subtractedDaysISOString = subtractedDays.toISOString();
        console.log('Today:', today);
        console.log(`Subtracted ${days} days:`, subtractedDaysISOString);
        const sql = SELECT.from('sales.SalesOrderHeaders')
            .columns(
                'id as salesOrderId',
                'totalamount as SalesOrderTotalAmount',
                'customers_id as customerId',
                // eslint-disable-next-line quotes
                `customers.firstName || ' ' || 'nao adicionei' as customerFullName`,
            )
            .where({ createdAt: { between: subtractedDaysISOString, and: today } });
        const salesReports = await cds.run(sql);
        if (salesReports.length === 0) {
            return null;
        }
        return salesReports.map(
            (_salesReport: SalesReportByDays) =>
                new SalesReportModel({
                    salesOrderId: _salesReport.salesOrderId as string,
                    SalesOrderTotalAmount: _salesReport.SalesOrderTotalAmount as number,
                    customerId: _salesReport.customerId as string,
                    customerFullName: _salesReport.customerFullName as string,
                }),
        );
    }
}
