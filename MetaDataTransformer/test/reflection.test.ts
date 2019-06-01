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
