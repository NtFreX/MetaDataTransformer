import '@types/jest';
import { reflection } from 'metadatatransformer';

class IHaveOnePublicPropertyWithTypeString {
    public property: string;
}

test('Class is a type', () => {
    const istType = reflection.isType(IHaveOnePublicPropertyWithTypeString);

    expect(istType).toBeTruthy();
});
