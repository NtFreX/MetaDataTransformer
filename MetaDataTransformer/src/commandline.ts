import { CommandLineParser, CommandLineFlagParameter } from '@microsoft/ts-command-line';
import { injectable } from 'tsyringe';

import { Logger } from './logger';
import { BuildAction } from './buildaction';

@injectable()
export class CommandLine extends CommandLineParser {
    private _verbose: CommandLineFlagParameter; 
   
    public constructor(private logger: Logger, buildAction: BuildAction) {
        super({
            toolDescription: 'Typescript transpiler with reflection capabilities.',
            toolFilename: 'tsca',
        });

        this.addAction(buildAction);
    }
   
    protected onDefineParameters(): void {
        this._verbose = this.defineFlagParameter({
            description: 'Show extra logging detail',
            parameterLongName: '--verbose',
            parameterShortName: '-v',
        });
    }
   
    protected onExecute(): Promise<void> {
        this.logger.isEnabled = this._verbose.value;

        return super.onExecute();
    }
}
