import '@types/jest' // tslint:disable-line:no-import-side-effect
import { toEnumValue } from '../src/utils';

describe('utils', () => {
    describe('toEnumValue', () => {
        it('should return null when given null', () => {
            expect(toEnumValue(null, null)).toBe(null);
        })
    });
});