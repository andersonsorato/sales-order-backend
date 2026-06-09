import { SalesReportModel } from '@/models/sales-report-by-days';

export interface SalesReportRepository {
    findByDays(days: number): Promise<SalesReportModel[] | null>;
}
