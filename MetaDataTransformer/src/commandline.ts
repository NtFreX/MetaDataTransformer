import { CommandLineParser, CommandLineFlagParameter } from '@microsoft/ts-command-line';

import { Logger } from './logger';
import { BuildAction } from './buildaction';

export class CommandLine extends CommandLineParser {
    private _verbose: CommandLineFlagParameter; 
   
    public constructor() {
        super({
            toolDescription: 'Typescript transpiler with reflection capabilities.',
            toolFilename: 'tsca',
        });

        this.addAction(new BuildAction());
    }
   
    protected onDefineParameters(): void {
        this._verbose = this.defineFlagParameter({
            description: 'Show extra logging detail',
            parameterLongName: '--verbose',
            parameterShortName: '-v',
        });
    }
   
    protected onExecute(): Promise<void> {
        Logger.isEnabled = this._verbose.value;

        return super.onExecute();
    }
}
