import { BaseControllerResponse } from '@/controllers/base';
import { ExpectedResult } from '@models/db/types/SalesReportByDays';

export interface SalesReportController {
    findByDays(days: number): Promise<BaseControllerResponse>;
    findByCustomerId(customerId: string): Promise<ExpectedResult[]>;
}
