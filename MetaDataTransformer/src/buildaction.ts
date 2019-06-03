import * as ts from 'typescript';

import { 
    CommandLineStringParameter, 
    CommandLineAction, 
    CommandLineChoiceParameter, 
    CommandLineFlagParameter, 
    CommandLineStringListParameter} from '@microsoft/ts-command-line';

import { build, emit, BuildOptions } from "./transpiler";
import { Logger } from './logger';

export class BuildAction extends CommandLineAction {
    private _inlineSourceMap: CommandLineFlagParameter;
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
    private _types: CommandLineStringListParameter;

    public constructor() {
      super({
        actionName: 'build',
        documentation: 'Transpiles the given typescript files',
        summary: 'Transpiles the given typescript files',
      });
    }
   
    protected onExecute(): Promise<void> {
        var start = new Date();
        const options: BuildOptions = 
        {
            inlineSourceMap: this._inlineSourceMap.value,
            mapRoot: this._mapRoot.value,
            module: this._module.value,
            moduleResolution: this._moduleResolution.value,
            outDir: this._outDir.value,
            outFile: this._outFile.value,
            pattern: this._pattern.value,
            rootDir: this._rootDir.value,
            sourceMap: this._sourceMap.value,
            sourceRoot: this._sourceRoot.value,
            target: this._target.value,
            types: [ ...this._types.values ],
        };

        Logger.log(`BuildOptions: '${options}'`);

        const program = build(options);
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
        
        var end = new Date().getTime() - start.getTime();
        console.info("Execution time: %dms", end);

        return Promise.resolve();
    }
   
    protected onDefineParameters(): void {     
        this._inlineSourceMap = this.defineFlagParameter({
            description: 'Should create inline source maps',
            parameterLongName: '--inline-source-map',            
            required: false,
        });
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
            alternatives: [ 'None', 'CommonJS', 'AMD', 'UMD', 'System', 'ES2015', 'ESNext' ],
            defaultValue: 'None',
            description: 'The module',
            parameterLongName: '--module',
            required: false,
        });
        this._moduleResolution = this.defineChoiceParameter({
            alternatives: [ 'Classic', 'NodeJs' ],
            defaultValue: 'Classic',
            description: 'The module',
            parameterLongName: '--module-resolution',
            required: false,
        });
        this._target = this.defineChoiceParameter({
            alternatives: [ 'ES3', 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ESNext', 'JSON', 'Latest' ],
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
        this._types = this.defineStringListParameter({
            argumentName: 'TYPES',
            description: 'The types',
            parameterLongName: '--types',
            required: false,
        });
    }
}
