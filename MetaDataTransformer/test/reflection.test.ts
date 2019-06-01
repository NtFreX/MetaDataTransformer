import { reflection } from '../src/reflection';

declare const test: Function;
declare const expect: Function;
/// <reference types="jest" />

class IHaveOnePublicPropertyWithTypeString {
    public property: string;
}

test('Class is a type', () => {
    const istType = reflection.isType(IHaveOnePublicPropertyWithTypeString);

    expect(istType).toBeTruthy();
});

test('Class has one property', () => {
    const type = reflection.getType(IHaveOnePublicPropertyWithTypeString);
    const propertyNames = Object.keys(type.properties);

    expect(propertyNames.length).toBe(1);
});
