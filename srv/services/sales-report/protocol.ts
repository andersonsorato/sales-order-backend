import { ExpectedResult as SalesReportModel } from '@/models/sales-report';

export interface SalesReportService {
    findByDays(days: number): Promise<SalesReportModel[]>;
    findByCustomerId(customerId: string): Promise<SalesReportModel[]>;
}
