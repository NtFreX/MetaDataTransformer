import { reflection } from 'metadatatransformer';

interface ITest {
    id: number;
    description?: string;
    friendlyName: string;
}

export class Test implements ITest {
    public static nr: number;

    protected static value: number;
    
    public id: number;
    description?: string;   // tslint:disable-line
    friendlyName!: string;  // tslint:disable-line

    protected inner: string;

    private field: boolean;
}

console.log(reflection.isType(Test));
console.log(reflection.getType(Test));
console.log(reflection.canCast({ id: 12, friendlyName: 'test' }, Test));
console.log(reflection.canCast({ id: 12 }, Test));
console.log(reflection.canCast({ friendlyName: 'test' }, Test));
console.log(reflection.canCast({ id: 12, friendlyName: 'test', description: 'This is a test object' }, Test));
