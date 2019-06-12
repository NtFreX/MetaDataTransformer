import '../test.setup'; // tslint:disable-line:no-import-side-effect

import { container } from 'tsyringe';

import { CommandLine } from '../src/commandline';
import { ITranspiler } from '../src/transpiler';
import { ILogger } from '../src/logger';

describe('CommandLine', () => { 
    describe('execute', () => {
        it('should disable the logger by default', () => {
            const transpiler: ITranspiler = { build: jest.fn(), emit: jest.fn() };
            const logger: ILogger = { log: jest.fn(), setIsEnabled: jest.fn() };
            const commandLine = container
                .register('ILogger', { useValue: logger })
                .register('ITranspiler', { useValue: transpiler })
                .resolve(CommandLine);

            // act
            commandLine.execute([ 'build' ]);

            // assert
            expect(logger.setIsEnabled).toHaveBeenCalledWith(false);
        });
    });
});
