import { reflection } from 'metadatatransformer';

interface ITest {
    id: number;
    description?: string;
    friendlyName: string;
}

class Test implements ITest {
    public static nr: number;

    protected static value: number;
    
    public id: number;
    description?: string;
    friendlyName!: string;

    protected inner: string;

    private field: boolean;
}

if(reflection.isType(Test)) {
    console.log(reflection.getTypeDeclaration(Test));
    console.log(reflection.isObjectValid({ id: 12, friendlyName: 'test' }, Test));
    console.log(reflection.isObjectValid({ id: 12 }, Test));
    console.log(reflection.isObjectValid({ friendlyName: 'test' }, Test));
    console.log(reflection.isObjectValid({ id: 12, friendlyName: 'test', description: 'This is a test object' }, Test));
}
