import { describe, expect, it } from 'vitest';

import { customers } from '@models/sales';

import { CustomerService, CustomerServiceImpl } from '@/services/customer';

type SutTypes = {
    sut: CustomerService;
};

const makeSut = (): SutTypes => {
    return {
        sut: new CustomerServiceImpl(),
    };
};

const id = crypto.randomUUID();

const getCustomersWithoutEmail = (): customers => [
    {
        id,
        firstName: 'cuka',
        email: '',
    },
];

const getCustomersFullEmail = (): customers => [
    {
        id,
        firstName: 'anderson',
        email: 'anderson@copacol.com.br',
    },
];

const getCustomersWithlEmailWithoutAt = (): customers => [
    {
        id,
        firstName: 'joaozinho',
        email: 'jaozinhosilva',
    },
];

describe('CostumerServiceImpl test cases', () => {
    it('should test if afterRead works even if the custumer array is empty', () => {
        const { sut } = makeSut();
        const customers = [];
        const result = sut.afterRead(customers);
        const expectedResult = [];
        expect(result.value).toEqual(expectedResult);
    });
    it('should test if afterRead works even if the email is undefined', () => {
        const { sut } = makeSut();
        const customers = getCustomersWithoutEmail();
        const expectedResult: customers = [{ id, firstName: 'cuka', email: '' }];
        const result = sut.afterRead(customers);
        expect(result.value).toEqual(expectedResult);
    });
    it('should test if afterRead does not changes the email id a full email is provide', () => {
        const { sut } = makeSut();
        const customers = getCustomersFullEmail();
        const expectedResult: customers = [{ id, firstName: 'anderson', email: 'anderson@copacol.com.br' }];
        const result = sut.afterRead(customers);
        expect(result.value).toEqual(expectedResult);
    });
    it('should test if afterRead changes the email if an email without at is provided', () => {
        const { sut } = makeSut();
        const customers = getCustomersWithlEmailWithoutAt();
        const expectedResult: customers = [{ id, firstName: 'joaozinho', email: 'jaozinhosilva@defaultdomain.com' }];
        const result = sut.afterRead(customers);
        expect(result.value).toEqual(expectedResult);
    });
});
