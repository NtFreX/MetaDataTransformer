import { isNullOrUndefined } from "util";

export const toEnumValue = (type: { [id: number]: string }, value: string): number => {
    if(isNullOrUndefined(value) || value == "") {
        return null;
    } 
    
    return type[value];
};
