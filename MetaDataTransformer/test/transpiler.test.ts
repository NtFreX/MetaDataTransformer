import '@types/jest'; // tslint:disable-line:no-import-side-effect -> vscode code completion
import "reflect-metadata";
import { container } from "tsyringe";

import { transformers, emptyCancellationToken, Transpiler, ITypescriptService, IGlobService, BuildOptions } from '../src/transpiler';
import { metadataTransformer } from '../src/transformer';
import { Logger } from '../src/logger';

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
        it('should call ts.createCompilerHost', () => {
            const typescriptService: ITypescriptService = { createCompilerHost: jest.fn(), createProgram: jest.fn() };
            const globService: IGlobService = { sync: jest.fn() };
            const buildOptions: BuildOptions = { pattern: '' };
            const logger = container.resolve(Logger);
            const transpiler = new Transpiler(logger, typescriptService, globService);

            transpiler.build(buildOptions);

            expect(typescriptService.createCompilerHost).toHaveBeenCalledTimes(1);
        });

        it('should call ts.createProgram', () => {
            const typescriptService: ITypescriptService = { createCompilerHost: jest.fn(), createProgram: jest.fn() };
            const globService: IGlobService = { sync: jest.fn() };
            const buildOptions: BuildOptions = { pattern: '' };
            const logger = container.resolve(Logger);
            const transpiler = new Transpiler(logger, typescriptService, globService);

            transpiler.build(buildOptions);

            expect(typescriptService.createProgram).toHaveBeenCalledTimes(1);
        });

        it('should call glob.sync with given pattern', () => {
            const typescriptService: ITypescriptService = { createCompilerHost: jest.fn(), createProgram: jest.fn() };
            const globService: IGlobService = { sync: jest.fn() };
            const pattern = '/src/**/*.ts';
            const buildOptions: BuildOptions = { pattern: pattern };
            const logger = container.resolve(Logger);
            const transpiler = new Transpiler(logger, typescriptService, globService);

            transpiler.build(buildOptions);

            expect(globService.sync).toHaveBeenCalledWith(pattern, { root: undefined });
        });
    });
});