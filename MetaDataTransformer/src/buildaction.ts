import * as ts from 'typescript';

import { CommandLineStringParameter, CommandLineAction, CommandLineChoiceParameter, CommandLineFlagParameter } from '@microsoft/ts-command-line';

import { build, emit } from "./transpiler";
import { Logger } from './logger';

export class BuildAction extends CommandLineAction {
    private _pattern: CommandLineStringParameter;
    private _outDir: CommandLineStringParameter;
    private _outFile: CommandLineStringParameter;
    private _rootDir: CommandLineStringParameter;
    private _module: CommandLineChoiceParameter;
    private _moduleResolution: CommandLineChoiceParameter;
    private _target: CommandLineChoiceParameter;
    private _sourceMap: CommandLineFlagParameter;
    private _sourceRoot: CommandLineStringParameter;
    private _mapRoot: CommandLineStringParameter;

    public constructor() {
      super({
        actionName: 'build',
        documentation: 'Transpiles the given typescript files',
        summary: 'Transpiles the given typescript files',
      });
    }
   
    protected onExecute(): Promise<void> {
        Logger.log(`Pattern: '${this._pattern.value}'`);
        Logger.log(`RootDir: '${this._rootDir.value}'`);
        Logger.log(`OutDir: '${this._outDir.value}'`);
        Logger.log(`OutFile: '${this._outFile.value}'`);
        Logger.log(`Module: '${this._module.value}'`);
        Logger.log(`ModuleResolution: '${this._moduleResolution.value}'`);
        Logger.log(`Target: '${this._target.value}'`);
        Logger.log(`SourceMap: '${this._sourceMap.value}'`);
        Logger.log(`SourceRoot: ${this._sourceRoot.value}`)
        Logger.log(`MapRoot: ${this._mapRoot.value}`);

        const program = build(
            this._pattern.value, 
            this._outDir.value, 
            this._outFile.value, 
            this._rootDir.value, 
            this._module.value, 
            this._moduleResolution.value,
            this._target.value,
            this._sourceMap.value,
            this._sourceRoot.value,
            this._mapRoot.value);
        const result = emit(program);

        if(result.emitSkipped) {
            Logger.log('Emit has been skiped');
        } else {
            Logger.log('Emited files:')
            Logger.log(result.emittedFiles);
        }

        result.diagnostics.forEach(diagnostic => {
            switch(diagnostic.category) {
                case ts.DiagnosticCategory.Error:
                    console.error(diagnostic.messageText);
                    break;
                    case ts.DiagnosticCategory.Warning:
                        console.warn(diagnostic.messageText);
                        break;
                    default:
                        console.log(diagnostic.messageText);
                        break;
            }
        });

        return Promise.resolve();
    }
   
    protected onDefineParameters(): void {     
        this._pattern = this.defineStringParameter({
            argumentName: "PATTERN",
            description: 'The pattern which is used to locate the files to transpile',
            parameterLongName: '--pattern',            
            required: true,
        });
        this._outDir = this.defineStringParameter({
            argumentName: "OUTDIR",
            description: 'The output directory',
            parameterLongName: '--out-dir',
            required: false,
        });
        this._outFile = this.defineStringParameter({
            argumentName: "OUTFILE",
            description: 'The output file',
            parameterLongName: '--out-file',
            required: false,
        });
        this._rootDir = this.defineStringParameter({
            argumentName: "ROOTDIR",
            description: 'The root directory',
            parameterLongName: '--root-dir',
            required: false,
        });
        this._module = this.defineChoiceParameter({
            alternatives: [ 'None', 'CommonJS', 'AMD', 'UMD', 'System', 'ES2015', 'ESNext', ],
            defaultValue: 'None',
            description: 'The module',
            required: false,
            parameterLongName: '--module',
        });
        this._moduleResolution = this.defineChoiceParameter({
            alternatives: [ 'Classic', 'NodeJs' ],
            defaultValue: 'Classic',
            description: 'The module',
            parameterLongName: '--module-resolution',
            required: false
        });
        this._target = this.defineChoiceParameter({
            alternatives: [ 'ES3', 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ESNext', 'JSON', 'Latest', ],
            defaultValue: 'ES5',
            description: 'The target',
            parameterLongName: '--target',
            required: false,
        });
        this._sourceMap = this.defineFlagParameter({
            description: 'Should create source maps',
            parameterLongName: '--source-map',            
            required: false,
        });
        this._sourceRoot = this.defineStringParameter({ 
            argumentName: "SOURCEROOT",
            description: 'The source root',
            parameterLongName: '--source-root',            
            required: false,
        });
        this._mapRoot = this.defineStringParameter({ 
            argumentName: "MAPROOT",
            description: 'The map root',
            parameterLongName: '--map-root',            
            required: false,
        });
    }
}
