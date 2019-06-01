import { reflection } from '../src/reflection';

declare const describe: Function;
declare const it: Function;
declare const expect: Function;
/// <reference types="jest" />

class IHaveOnePublicPropertyWithTypeString {
    public property: string;
}

describe('reflection of', () => {
    describe('a class named "IHaveOnePublicPropertyWithTypeString"', () => {
        it('is a type', () => {
            const istType = reflection.isType(IHaveOnePublicPropertyWithTypeString);

            expect(istType).toBeTruthy();
        });

        it('has one property', () => {
            const type = reflection.getType(IHaveOnePublicPropertyWithTypeString);
            const propertyNames = Object.keys(type.properties);
        
            expect(propertyNames.length).toBe(1);
        });
    });
});
