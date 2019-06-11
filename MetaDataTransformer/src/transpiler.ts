import * as ts from 'typescript';
import * as glob from 'glob';

import { injectable, inject } from 'tsyringe';

import { metadataTransformer } from './transformer';
import { Logger } from './logger';
import { toEnumValue } from './utils';
import { IConfigProvider } from './configprovider';
import { isNullOrUndefined } from 'util';

export const emptyCancellationToken: ts.CancellationToken = {
    isCancellationRequested: () => false,
    throwIfCancellationRequested: () => { },
};

export const transformers: ts.CustomTransformers = {
    after: [],
    before: [metadataTransformer],
};

const emitOnlyDtsFiles = false;
const targetSourceFile: ts.SourceFile = undefined;
const writeFile: ts.WriteFileCallback = undefined;

export interface IBuildOptions {
    emitDecoratorMetadata?: boolean;
    experimentalDecorators?: boolean;
    inlineSourceMap?: boolean;
    include: string[];
    outDir?: string;
    outFile?: string;
    rootDir?: string;
    module?: string;
    moduleResolution?: string;
    target?: string;
    sourceMap?: boolean;
    sourceRoot?: string;
    mapRoot?: string;
    types?: string[];
    typeRoots?: string[];
}

export interface ITranspiler {
    build(environment: string, buildOptions: IBuildOptions): ts.Program;
    emit(program: ts.Program): ts.EmitResult;
}

@injectable()
export class Transpiler implements ITranspiler {
    public constructor(
        @inject('IConfigProvider') private configProvider: IConfigProvider,
        private logger: Logger) { }

    private getModuleResolution(moduleResolution?: string) {
        if(isNullOrUndefined(moduleResolution) || moduleResolution.toLowerCase() === 'classic') {
            return ts.ModuleResolutionKind.Classic;
        }
        if(moduleResolution.toLowerCase() === 'node') {
            return ts.ModuleResolutionKind.NodeJs;
        }

        throw `Unknown module resolution ${moduleResolution}`;
    }

    public build(environment: string, buildOptions: IBuildOptions): ts.Program {
        buildOptions = this.configProvider.get(environment, buildOptions);

        const options: ts.CompilerOptions = {
            emitDecoratorMetadata: buildOptions.emitDecoratorMetadata,
            experimentalDecorators: buildOptions.experimentalDecorators,
            inlineSourceMap: buildOptions.inlineSourceMap,
            mapRoot: buildOptions.mapRoot,
            module: toEnumValue(ts.ModuleKind, buildOptions.module),
            moduleResolution: this.getModuleResolution(buildOptions.moduleResolution),
            outDir: buildOptions.outDir,
            outFile: buildOptions.outFile,
            rootDir: buildOptions.rootDir,
            sourceMap: buildOptions.sourceMap,
            sourceRoot: buildOptions.sourceRoot,
            target: toEnumValue(ts.ScriptTarget, buildOptions.target),
            typeRoots: buildOptions.typeRoots,
            types: buildOptions.types,  
        };

        this.logger.log(`BuildOptions: '${JSON.stringify(options)}'`);
        
        const compilerHost = ts.createCompilerHost(options);
    
        const include = isNullOrUndefined(buildOptions.include) ? [] : buildOptions.include;
        const files = include
            .map(pattern => glob.sync(pattern, { root: buildOptions.rootDir }))
            .reduce((a, b) => a.concat(b));
        
        this.logger.log("Found files to transpile:")
        this.logger.log(files);
    
        return ts.createProgram(files, options, compilerHost);    
    }
    
    public emit(program: ts.Program): ts.EmitResult {
        const result = program.emit(targetSourceFile, writeFile, emptyCancellationToken, emitOnlyDtsFiles, transformers);
        if(result.emitSkipped) {
            this.logger.log('Emit has been skiped');
        } else {
            this.logger.log('Emited files:')
            this.logger.log(result.emittedFiles);
        }

        let allDiagnostics = ts
            .getPreEmitDiagnostics(program)
            .concat(result.diagnostics);

            allDiagnostics.forEach(diagnostic => {
                if (diagnostic.file) {
                    let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
                      diagnostic.start!
                    );
                    let message = ts.flattenDiagnosticMessageText(
                      diagnostic.messageText,
                      "\n"
                    );
                    console.log(
                      `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
                    );
                  } else {
                    console.log(
                      `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`
                    );
                  }
            /*switch(diagnostic.category) {
                case ts.DiagnosticCategory.Error:
                    this.logger.log(diagnostic.messageText, LogLevel.Error);
                    break;
                    case ts.DiagnosticCategory.Warning:
                        this.logger.log(diagnostic.messageText, LogLevel.Warn);
                        break;
                    default:
                        this.logger.log(diagnostic.messageText, LogLevel.Debug);
                        break;
            }*/
        });

        return result;
    }    
}
