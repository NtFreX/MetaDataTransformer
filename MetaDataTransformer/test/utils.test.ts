import { toEnumValue } from '../src/utils';

describe('utils', () => {
    describe('toEnumValue', () => {
        enum SimpleEnum {
            One,
            Two,
            Three = 10,
        }

        it('should return null when given null', () => {
            expect(toEnumValue(null, null)).toBe(null);
        });
        
        it('should return null when given an empty string', () => {
            expect(toEnumValue(null, '')).toBe(null);
        });

        it('should return null when given undefined', () => {
            expect(toEnumValue(null, undefined)).toBe(null);
        });

        it.each
        `
            name        | result
            ${'One'}    | ${0}
            ${'Two'}    | ${1}
            ${'Three'}  | ${10}
        `('should return $result when given $name', ({name, result}) => {
            expect(toEnumValue(SimpleEnum, name)).toBe(result);
        });
    });
});
