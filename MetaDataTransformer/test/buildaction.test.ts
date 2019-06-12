import '../test.setup'; // tslint:disable-line:no-import-side-effect TODO: solve with config?

import { container } from 'tsyringe';

import { ITranspiler } from '../src/transpiler';
import { CommandLine } from '../src/commandline';

describe('BuildAction', () => { 
    describe('execute', () => {
        it('should call the build method of the transpiler with undefined as the default environment', () => {
            const build = jest.fn();
            const transpiler: ITranspiler = { build: build, emit: jest.fn() };
            const commandLine = container
                .register('ITranspiler', { useValue: transpiler })
                .resolve(CommandLine);
            
            // act
            commandLine.execute([ 'build' ]);

            // assert
            expect(build.mock.calls[0][0]).toBe(undefined);
        });
    });
});
