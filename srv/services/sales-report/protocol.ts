import { ExpectedResult as SalesReportModel } from '@/models/sales-report';

import { AbstractErro } from '@/errors';

import { Either } from '@sweet-monads/either';

export interface SalesReportService {
    findByDays(days: number): Promise<Either<AbstractErro, SalesReportModel[]>>;
    findByCustomerId(customerId: string): Promise<SalesReportModel[]>;
}
