import '@types/jest'; // tslint:disable-line:no-import-side-effect -> vscode code completion
import { Test } from './../src/main'

test('The test class exists', () => {
    expect(Test).toBeTruthy()
});
