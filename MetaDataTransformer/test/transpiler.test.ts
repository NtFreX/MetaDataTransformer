import '../test.setup'; // tslint:disable-line:no-import-side-effect

import { container } from "tsyringe";

import { transformers, emptyCancellationToken, Transpiler, IBuildOptions } from '../src/transpiler';
import { metadataTransformer } from '../src/transformer';
import { IConfigProvider } from '../src/configprovider';

jest.mock('typescript');
jest.mock('glob');
jest.mock('fs');

import * as typescript from 'typescript';
import * as glob from 'glob';

describe('transpiler', () => {
    describe('transformers configuration', () => {
        it('should have no after transpilation transformer', () => {
            expect(transformers.after.length).toBe(0);
        });

        it('should have one before transpilation transformer', () => {
            expect(transformers.before.length).toBe(1);
        });

        it('should have the metadatatransformer as before transpilation transformer', () => {
            expect(transformers.before[0]).toBe(metadataTransformer);
        });
    });

    describe('emptyCancellationToken', () => {
        describe('isCancellationRequested', () => {
            it('should return false', () => {
                expect(emptyCancellationToken.isCancellationRequested()).toBeFalsy();
            });
        });
        
        describe('throwIfCancellationRequested', () => {
            it('should not throw', () => {
                expect(emptyCancellationToken.throwIfCancellationRequested).not.toThrow();
            });
        });
    });

    describe('build', () => {
        beforeEach(() => {
            const configProvider: IConfigProvider = { 
                get: jest.fn((_: string, options: IBuildOptions): IBuildOptions => options), 
                resolveConfigFile: jest.fn(),
            };
            
            container.register('IConfigProvider', { useValue: configProvider });
        });

        it('should call ts.createCompilerHost', () => {
            const buildOptions: IBuildOptions = { include: [ '' ] };
            const transpiler = container.resolve(Transpiler);

            transpiler.build(null, buildOptions);

            expect(typescript.createCompilerHost).toHaveBeenCalledTimes(1);
        });

        it('should call ts.createProgram', () => {
            const buildOptions: IBuildOptions = { include: [ '' ] };
            const transpiler = container.resolve(Transpiler);

            transpiler.build(null, buildOptions);
            
            expect(typescript.createProgram).toHaveBeenCalledTimes(1);
        });

        it('should call glob.sync with given pattern', () => {
            const pattern = '/src/**///*.ts';
            const buildOptions: IBuildOptions = { include: [ pattern ] };
            const transpiler = container.resolve(Transpiler);

            transpiler.build(null, buildOptions);

            expect(glob.sync).toHaveBeenCalledWith(pattern, { root: undefined });
        });
    });
});
