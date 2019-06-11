import { CommandLineParser, CommandLineFlagParameter } from '@microsoft/ts-command-line';
import { injectable, inject } from 'tsyringe';

import { ILogger } from './logger';
import { BuildAction } from './buildaction';

export interface ICommandLine {
    execute(argument: string[]): void;
}

@injectable()
export class CommandLine extends CommandLineParser {
    private _verbose: CommandLineFlagParameter; 
   
    public constructor(
        @inject('ILogger') private logger: ILogger, 
        buildAction: BuildAction) {
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
        this.logger.setIsEnabled(this._verbose.value);

        return super.onExecute();
    }
}
