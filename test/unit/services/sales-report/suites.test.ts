import { SalesReportRepository } from '@/repositories/sales-report/protocols';
import { SalesReportService } from '@/services/sales-report/protocol';
import { SalesReportServiceImpl } from '@/services/sales-report/implementation';
import { ServerError } from '@/errors';

import { describe, expect, it, vi } from 'vitest';

import { SalesReportRepositoryStub } from './stubs';

type sutTypes = {
    sut: SalesReportService;
    salesReportRepository: SalesReportRepository;
};

const makeSut = (): sutTypes => {
    const salesReportRepository = new SalesReportRepositoryStub();
    return {
        sut: new SalesReportServiceImpl(salesReportRepository),
        salesReportRepository,
    };
};

// eslint-disable-next-line max-lines-per-function
describe('SalesReportService test cases', () => {
    // eslint-disable-next-line max-lines-per-function
    describe('method findByDays test cases', () => {
        it('should throw if SalesReportRepository throws', async () => {
            const { sut, salesReportRepository } = makeSut();
            vi.spyOn(salesReportRepository, 'findByDays').mockRejectedValueOnce(() => {
                throw new ServerError('Fake error');
            });
            const result = await sut.findByDays();
            expect(result.value).toBeInstanceOf(ServerError);
            expect(result.isLeft()).toBeTruthy();
            const error = result.value as ServerError;
            expect(error.code).toBe(500);
            //expect(error.message).toBe('internalServerError');
        });
        it('should return NotFoundError if no records were found for the provide parameters', async () => {
            const { sut, salesReportRepository } = makeSut();
            vi.spyOn(salesReportRepository, 'findByDays').mockReturnValueOnce(Promise.resolve(null));
            const result = await sut.findByDays();
            expect(result.isLeft()).toBeTruthy();
        });
        /*it('should return salereport if everething worked as epected', async () => {
            const { sut } = makeSut();
            const result = await sut.findByDays();
            expect(result.isRight()).toBeTruthy();
            expect(result.value).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        salesOrderTotalAmount: 100,
                        customerFullName: 'Valid Customer',
                    }),
                ]),
            );
        });*/
    });
    describe('method findByCustomerId test cases', () => {
        it('Should return ServerError if SalesReportRepository throws', async () => {
            const { sut, salesReportRepository } = makeSut();
            vi.spyOn(salesReportRepository, 'findByCustomerId').mockRejectedValueOnce(() => {
                throw new ServerError('fake error');
            });
            const customerId = crypto.randomUUID;
            const result = await sut.findByCustomerId(customerId.toString());
            expect(result.isLeft()).toBeTruthy();
            expect(result.value).toBeInstanceOf(ServerError);
            const error = result.value as ServerError;
            expect(error.code).toBe(500);
        });
    });
});
