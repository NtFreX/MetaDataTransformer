//import '@types/jest'; // tslint:disable-line:no-import-side-effect -> vscode code completion TODO: problem seems resolved (only sometimes) => delete build step and imports
import '../polyfill'; // TODO: autoimport for tests?
import { resetContainer } from '../container';

import { container } from 'tsyringe';

import { ITranspiler } from '../src/transpiler';
import { BuildAction } from '../src/buildaction';
import { CommandLine } from '../src/commandline';

beforeEach(() => {
    resetContainer();
});

describe('BuildAction', () => { 
    describe('execute', () => {
        it('should call the build method of the transpiler with undefined as the default environment', () => {
            const build = jest.fn();
            const transpiler: ITranspiler = { build: build, emit: jest.fn() };
            const buildAction = container
                .register('ITranspiler', { useValue: transpiler })
                .resolve(BuildAction);

            container.registerInstance(BuildAction, buildAction).resolve(CommandLine);

            // act
            buildAction._execute();

            // assert
            expect(build.mock.calls[0][0]).toBe(undefined);
        });
    });
});
