import { isNullOrUndefined } from "util";

export enum AccessModifier {
    Public,
    Protected,
    Private,
}

export interface ITypeDeclaration {
    properties: { [id: string]: IPropertyDeclaration }
}

export interface IPropertyDeclaration {
    isOptional: boolean;
    isStatic: boolean;
    accessModifier: AccessModifier;
}

export interface IType<T> extends Function {
    new (...args: (object | string | number | boolean)[]): T;
}
interface ICompleteType<T> extends IType<T> {
    getDeclartion: () => ITypeDeclaration;
}

export const reflection = {
    canCast: <T>(obj: object, type: IType<T>): boolean => {
        const declartion = reflection.getType(type);
        
        for(const propertyName in declartion.properties) {
            const property = declartion.properties[propertyName];
            if(!property.isOptional && !Object.keys(obj).some(key => key === propertyName)) {
                return false;
            }
        }
    
        return true;    
    },
    getType: <T>(type: IType<T>): ITypeDeclaration => {
        if(reflection.isType(type)) {
            const completeType = type as ICompleteType<T>;
            return completeType.getDeclartion();
        }
        throw 'The given object seems to be no type.';
    },
    isType: <T>(type: IType<T>): boolean => {
        const completeType = type as ICompleteType<T>;
        const fnc = !isNullOrUndefined(completeType) ? completeType.getDeclartion : null;
        return !isNullOrUndefined(fnc) && typeof fnc === 'function';
    },
};
