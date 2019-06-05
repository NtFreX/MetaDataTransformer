import * as ts from 'typescript';
import * as glob from 'glob';

import { 
    CommandLineStringParameter, 
    CommandLineAction, 
    CommandLineChoiceParameter, 
    CommandLineFlagParameter, 
    CommandLineStringListParameter} from '@microsoft/ts-command-line';

import { injectable } from 'tsyringe';

import { Transpiler, BuildOptions } from "./transpiler";
import { Logger } from './logger';

@injectable()
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
    private _typeRoots: CommandLineStringListParameter;
    private _emitDecoratorMetadata: CommandLineFlagParameter;
    private _experimentalDecorators: CommandLineFlagParameter;

    private transpiler: Transpiler;

    public constructor(private logger: Logger) {
      super({
        actionName: 'build',
        documentation: 'Transpiles the given typescript files',
        summary: 'Transpiles the given typescript files',
      });

      this.transpiler = new Transpiler(logger, ts, glob);
    }
   
    protected onExecute(): Promise<void> {
        const start = new Date();
        const options: BuildOptions = 
        {
            emitDecoratorMetadata: this._emitDecoratorMetadata.value,
            experimentalDecorators: this._experimentalDecorators.value,
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
            typeRoots: [ ...this._typeRoots.values ],
            types: [ ...this._types.values ],
        };

        this.logger.log(`BuildOptions: '${JSON.stringify(options)}'`);

        const program = this.transpiler.build(options);
        const result = this.transpiler.emit(program);

        if(result.emitSkipped) {
            this.logger.log('Emit has been skiped');
        } else {
            this.logger.log('Emited files:')
            this.logger.log(result.emittedFiles);
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
        
        const end = new Date().getTime() - start.getTime();
        console.info("Execution time: %dms", end);

        return Promise.resolve();
    }
   
    protected onDefineParameters(): void {     
        this._emitDecoratorMetadata = this.defineFlagParameter({
            description: 'Should emit decorator metadata',
            parameterLongName: '--emit-decorator-metadata',
            required: false,
        });
        this._experimentalDecorators = this.defineFlagParameter({
            description: 'Should allow experimental decorators',
            parameterLongName: '--experimental-decorators',
            required: false,
        });
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
        this._typeRoots = this.defineStringListParameter({
            argumentName: 'TYPEROOTS',
            description: 'The type roots',
            parameterLongName: '--type-roots',
            required: false,
        });
    }
}
