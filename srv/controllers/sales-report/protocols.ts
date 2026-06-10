import { ExpectedResult as SalesReportModel } from '@/models/sales-report';

export interface SalesReportController {
    findByDays(days: number): Promise<SalesReportModel[]>;
    findByCustomerId(customerId: string): Promise<SalesReportModel[]>;
}
