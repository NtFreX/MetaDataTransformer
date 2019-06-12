import '../test.setup'; // tslint:disable-line:no-import-side-effect

import { container } from 'tsyringe';

import { ConfigProvider } from '../src/configprovider';
import { IBuildOptions } from '../src/transpiler';
import { MockFileStream } from './mocks/filestream';

/*export const mockWithType = <T>(module: string, mockModule: string, mockType: string): T => {
    jest.doMock(module, () => {
        const mock = require(mockModule);
        return new mock[mockType]();
    });
    return jest.requireMock(module) as T;
};

const fs = mockWithType<MockFileStream>('fs', './mocks/filestream', 'MockFileStream');*/

jest.mock('fs', () => {
    const mock = require('./mocks/filestream'); // tslint:disable-line:no-require-imports
    return new mock.MockFileStream();
});
const fs: MockFileStream = jest.requireMock('fs');

describe('ConfigProvider', () => {
    describe('resolveConfigFile', () => {
        it('should return null when no file is found', () => {
            fs.__setMockFiles([ ]);

            const configProvider = container.resolve(ConfigProvider);

            const file = configProvider.resolveConfigFile(null, null);

            expect(file).toBeNull();
        });
        it('should return null when a environment is given and no file has been found', () => {
            fs.__setMockFiles([ ]);

            const configProvider = container.resolve(ConfigProvider);

            const file = configProvider.resolveConfigFile('test', null);

            expect(file).toBeNull();
        });

        it('should return tsconfig.json when no environment is given', () => {
            fs.__setMockFiles([{ name: 'tsconfig.json', content: '' }]);

            const configProvider = container.resolve(ConfigProvider);
            
            const file = configProvider.resolveConfigFile(null, null);

            expect(file).toEqual('tsconfig.json');
        });
        it('should return ${rootDir}/tsconfig.json when a root dir is given', () => {
            fs.__setMockFiles([{ name: './dir/tsconfig.json', content: '' }]);

            const configProvider = container.resolve(ConfigProvider);
            
            const file = configProvider.resolveConfigFile(null, './dir');

            expect(file).toEqual('./dir/tsconfig.json');
        });
        it('should return tsconfig.${env}.json when a environment is given', () => {
            fs.__setMockFiles([{ name: 'tsconfig.test.json', content: '' }]);
            
            const configProvider = container.resolve(ConfigProvider);
            
            const file = configProvider.resolveConfigFile('test', null);

            expect(file).toEqual('tsconfig.test.json');
        });
        it('should return tsconfig.json when a environment is given and the file could not be found', () => {
            fs.__setMockFiles([{ name: 'tsconfig.json', content: '' }]);
            
            const configProvider = container.resolve(ConfigProvider);
            
            const file = configProvider.resolveConfigFile('test', null);

            expect(file).toEqual('tsconfig.json');
        });
    });

    describe('get', () => {
        it('should return the given options when no file is found', () => {
            fs.__setMockFiles([]);

            const configProvider = container.resolve(ConfigProvider);
            const consoleConfig: IBuildOptions = {  include: [ ] };

            const config = configProvider.get(null, consoleConfig);

            expect(config).toEqual(consoleConfig);
        });
        it('should return override the given options with the compilerOptions section when a file is found', () => {
            const fileConfig = { compilerOptions: { emitDecoratorMetadata: true } };

            fs.__setMockFiles([{ name: 'tsconfig.json', content: JSON.stringify(fileConfig) }]);

            const configProvider = container.resolve(ConfigProvider);
            const consoleConfig: IBuildOptions = {  include: [ ], emitDecoratorMetadata: false };

            const config = configProvider.get(null, consoleConfig);

            expect(config.emitDecoratorMetadata).toEqual(fileConfig.compilerOptions.emitDecoratorMetadata);
        });
        it('should extend the given options with the compilerOptions section when a file is found', () => {
            const fileConfig = { compilerOptions: { emitDecoratorMetadata: true } };

            fs.__setMockFiles([{ name: 'tsconfig.json', content: JSON.stringify(fileConfig) }]);

            const configProvider = container.resolve(ConfigProvider);
            const consoleConfig: IBuildOptions = {  include: [ ] };

            const config = configProvider.get(null, consoleConfig);

            expect(config.emitDecoratorMetadata).toEqual(fileConfig.compilerOptions.emitDecoratorMetadata);
        });
        it('should add the include option if it is found in the file', () => {
            const fileConfig = { include: [ 'test.ts' ] };

            fs.__setMockFiles([{ name: 'tsconfig.json', content: JSON.stringify(fileConfig) }]);

            const configProvider = container.resolve(ConfigProvider);
            const consoleConfig: IBuildOptions = {  include: [ ] };

            const config = configProvider.get(null, consoleConfig);

            expect(config.include).toStrictEqual(fileConfig.include);
        })
    });
});
