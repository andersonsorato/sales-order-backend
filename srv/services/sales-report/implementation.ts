import { ExpectedResult as SalesReportByDay } from '@/models/sales-report';

import { SalesReportRepository } from '@/repositories/sales-report/protocols';
import { SalesReportService } from './protocol';
import { AbstractErro, NotFoundError, ServerError } from '@/errors';
import { Either, left, right } from '@sweet-monads/either';

export class SalesReportServiceImpl implements SalesReportService {
    constructor(private readonly repository: SalesReportRepository) {}

    public async findByDays(days = 7): Promise<Either<AbstractErro, SalesReportByDay[]>> {
        try {
            const reportData = await this.repository.findByDays(days);
            if (!reportData) {
                return left(new NotFoundError('Nenhum dado encontrado'));
            }
            const mappedata = reportData?.map((data) => data.toObject());
            return right(mappedata);
        } catch (error) {
            const errorInstance = error instanceof Error ? error : new Error(String(error));
            return left(new ServerError(errorInstance.stack as string, errorInstance.message));
        }
    }
    public async findByCustomerId(customerId: string): Promise<SalesReportByDay[]> {
        const reportData = await this.repository.findByCustomerId(customerId);
        if (!reportData) {
            return [];
        }
        return reportData?.map((data) => data.toObject());
    }
}
