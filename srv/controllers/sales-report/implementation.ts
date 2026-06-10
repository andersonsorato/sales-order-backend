import { ExpectedResult } from '@/models/sales-report';
import { SalesReportController } from './protocols';
import { SalesReportService } from '@/services/sales-report/protocol';

export class SalesReportControllerImpl implements SalesReportController {
    constructor(private readonly service: SalesReportService) {}
    public async findByDays(days: number): Promise<ExpectedResult[]> {
        return await this.service.findByDays(days);
    }
    public async findByCustomerId(customerId: string): Promise<ExpectedResult[]> {
        return await this.service.findByCustomerId(customerId);
    }
}
