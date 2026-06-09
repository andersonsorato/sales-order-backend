import { ExpectedResult as SalesReportModel } from '@/models/sales-report-by-days';

export interface SalesReportController {
    findByDays(days: number): Promise<SalesReportModel[]>;
}
