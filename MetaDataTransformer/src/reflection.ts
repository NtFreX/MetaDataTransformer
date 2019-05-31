import { isNullOrUndefined } from "util";

export enum AccessModifier {
    Public,
    Protected,
    Private,
}

export interface IClassDeclaration {
    properties: { [id: string]: IPropertyDeclaration }
}

export interface IPropertyDeclaration {
    isOptional: boolean;
    isStatic: boolean;
    accessModifier: AccessModifier;
}

export interface IType<T> extends Function {
    new (...args: any[]): T;
}
interface ICompleteType<T> extends IType<T> {
    getDeclartion: () => IClassDeclaration;
}

export const reflection = {
    getTypeDeclaration: <T>(type: IType<T>): IClassDeclaration => {
        if(reflection.isType(type)) {
            const completeType = type as ICompleteType<T>;
            return completeType.getDeclartion();
        }
        throw 'The given object seems to be no type.';
    },
    isObjectValid: <T>(obj: object, type: IType<T>): boolean => {
        const declartion = reflection.getTypeDeclaration(type);
        
        for(const propertyName in declartion.properties) {
            const property = declartion.properties[propertyName];
            if(!property.isOptional && !Object.keys(obj).some(key => key === propertyName)) {
                return false;
            }
        }
    
        return true;    
    },
    isType: <T>(type: IType<T>): boolean => {
        const completeType = type as ICompleteType<T>;
        const fnc = !isNullOrUndefined(completeType) ? completeType.getDeclartion : null;
        return !isNullOrUndefined(fnc) && typeof fnc === 'function';
    },
};
