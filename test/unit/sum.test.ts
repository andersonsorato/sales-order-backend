import { describe, expect, it } from 'vitest';

describe('Sum test cases', () => {
    it('should sum two number and return its result', () => {
        const sum = 1 + 1;
        const expectedResult = 2;
        expect(sum).toBe(expectedResult);
    });
});
