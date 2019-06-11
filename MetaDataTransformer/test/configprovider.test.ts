import '../polyfill';

import { container } from 'tsyringe';

import { resetContainer } from '../container';
import { ConfigProvider } from '../src/configprovider';
import { IBuildOptions } from '../src/transpiler';

jest.mock('fs');
import * as fs from 'fs';

beforeEach(() => {
    resetContainer();
    jest.resetAllMocks();
});

describe('ConfigProvider', () => {
    describe('resolveConfigFile', () => {
        it('should return null when no file is found', () => {
            const configProvider = container.resolve(ConfigProvider);

            const file = configProvider.resolveConfigFile(null, null);

            expect(file).toBeNull();
        });
        it('should return null when a environment is given and no file has been found', () => {
            const configProvider = container.resolve(ConfigProvider);

            const file = configProvider.resolveConfigFile('test', null);

            expect(file).toBeNull();
        });

        it('should return tsconfig.json when no environment is given', () => {
            fs.existsSync = (file: string) => file === 'tsconfig.json';
            const configProvider = container.resolve(ConfigProvider);
            
            const file = configProvider.resolveConfigFile(null, null);

            expect(file).toEqual('tsconfig.json');
        });
        it('should return ${rootDir}/tsconfig.json when a root dir is given', () => {
            fs.existsSync = (file: string) => file === './dir/tsconfig.json';
            const configProvider = container.resolve(ConfigProvider);
            
            const file = configProvider.resolveConfigFile(null, './dir');

            expect(file).toEqual('./dir/tsconfig.json');
        });
        it('should return tsconfig.${env}.json when a environment is given', () => {
            fs.existsSync = (file: string) => file === 'tsconfig.test.json';
            const configProvider = container.resolve(ConfigProvider);
            
            const file = configProvider.resolveConfigFile('test', null);

            expect(file).toEqual('tsconfig.test.json');
        });
        it('should return tsconfig.json when a environment is given and the file could not be found', () => {
            fs.existsSync = (file: string) => file === 'tsconfig.json';
            const configProvider = container.resolve(ConfigProvider);
            
            const file = configProvider.resolveConfigFile('test', null);

            expect(file).toEqual('tsconfig.json');
        });
    });

    describe('get', () => {
        it('should return the given options when no file is found', () => {
            fs.existsSync = () => false;

            const configProvider = container.resolve(ConfigProvider);
            const consoleConfig: IBuildOptions = {  include: [ ] };

            const config = configProvider.get(null, consoleConfig);

            expect(config).toEqual(consoleConfig);
        });
        it('should return override the given options with the compilerOptions section when a file is found', () => {
            const fileConfig = { compilerOptions: { emitDecoratorMetadata: true } };

            fs.existsSync = (file: string) => file === 'tsconfig.json';
            fs.readFileSync = () => JSON.stringify(fileConfig);

            const configProvider = container.resolve(ConfigProvider);
            const consoleConfig: IBuildOptions = {  include: [ ], emitDecoratorMetadata: false };

            const config = configProvider.get(null, consoleConfig);

            expect(config.emitDecoratorMetadata).toEqual(fileConfig.compilerOptions.emitDecoratorMetadata);
        });
        it('should extend the given options with the compilerOptions section when a file is found', () => {
            const fileConfig = { compilerOptions: { emitDecoratorMetadata: true } };

            fs.existsSync = (file: string) => file === 'tsconfig.json';
            fs.readFileSync = () => JSON.stringify(fileConfig);

            const configProvider = container.resolve(ConfigProvider);
            const consoleConfig: IBuildOptions = {  include: [ ] };

            const config = configProvider.get(null, consoleConfig);

            expect(config.emitDecoratorMetadata).toEqual(fileConfig.compilerOptions.emitDecoratorMetadata);
        });
        it('should add the include option if it is found in the file', () => {
            const fileConfig = { include: [ 'test.ts' ] };

            fs.existsSync = (file: string) => file === 'tsconfig.json';
            fs.readFileSync = () => JSON.stringify(fileConfig);

            const configProvider = container.resolve(ConfigProvider);
            const consoleConfig: IBuildOptions = {  include: [ ] };

            const config = configProvider.get(null, consoleConfig);

            expect(config.include).toStrictEqual(fileConfig.include);
        })
    });
});
