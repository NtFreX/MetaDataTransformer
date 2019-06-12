import '../test.setup'; // tslint:disable-line:no-import-side-effect

import { container } from 'tsyringe';

import { execute } from '../src/cli';
import { ICommandLine } from '../src/commandline';

describe('CLI', () => { 
    it('should execute of ICommandLine with all but the first two command line parameters', () => {
        const argument = [ 'nodejs', 'test.js', 'one', 'two', 'three' ];
        const commandLine: ICommandLine = { execute : jest.fn() };
        container.register('ICommandLine', { useValue: commandLine });

        execute(argument);

        expect(commandLine.execute).toHaveBeenCalledWith(argument.slice(2));
    });
});
