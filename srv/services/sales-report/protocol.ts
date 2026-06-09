import { ExpectedResult as SalesReportModel } from '@/models/sales-report-by-days';

export interface SalesReportService {
    findByDays(days: number): Promise<SalesReportModel[]>;
}
