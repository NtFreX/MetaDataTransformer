import '@types/jest' // tslint:disable-line:no-import-side-effect
import { reflection, AccessModifier } from '../src/reflection';

class SimpleType { }

class IHaveOnePublicPropertyWithTypeString {
    public property: string;
}

describe('type reflection', () => {
    describe('method isType', () => {
        it('should return true when given a type as SimpleType', () => {
            const istType = reflection.isType(SimpleType);

            expect(istType).toBeTruthy();
        });

        it('should return false when given null', () => {
            const istType = reflection.isType(null);

            expect(istType).toBeFalsy();
        });
    });

    describe('method getType', () => {
        it('should throw when given no type', () => {
            const getType = () => reflection.getType(null);

            expect(getType).toThrow('The given object seems to be no type.');
        });
    });
});

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

        it('has a property called property', () => {
            const type = reflection.getType(IHaveOnePublicPropertyWithTypeString);
            const propertyDescription = type.properties.property;
        
            expect(propertyDescription).toBeTruthy();
        });

        it('has a property which is public', () => {
            const type = reflection.getType(IHaveOnePublicPropertyWithTypeString);
            const propertyDescription = type.properties.property;
        
            expect(propertyDescription.accessModifier).toBe(AccessModifier.Public);
        });

        it('has a property which is not optional', () => {
            const type = reflection.getType(IHaveOnePublicPropertyWithTypeString);
            const propertyDescription = type.properties.property;
        
            expect(propertyDescription.isOptional).toBeFalsy();
        });

        it('has a property which is not static', () => {
            const type = reflection.getType(IHaveOnePublicPropertyWithTypeString);
            const propertyDescription = type.properties.property;
        
            expect(propertyDescription.isStatic).toBeFalsy();
        });
    });
});
