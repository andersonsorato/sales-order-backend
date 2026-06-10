import { ExpectedResult as SalesReportByDay } from '@/models/sales-report';

import { SalesReportRepository } from '@/repositories/sales-report/protocols';
import { SalesReportService } from './protocol';

export class SalesReportServiceImpl implements SalesReportService {
    constructor(private readonly repository: SalesReportRepository) {}

    public async findByDays(days: 7): Promise<SalesReportByDay[]> {
        const reportData = await this.repository.findByDays(days);
        if (!reportData) {
            return [];
        }
        return reportData?.map((data) => data.toObject());
    }
    public async findByCustomerId(customerId: string): Promise<SalesReportByDay[]> {
        const reportData = await this.repository.findByCustomerId(customerId);
        if (!reportData) {
            return [];
        }
        return reportData?.map((data) => data.toObject());
    }
}
