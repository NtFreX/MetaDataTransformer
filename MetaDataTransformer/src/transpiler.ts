import * as ts from 'typescript';
import * as glob from 'glob';

import { injectable, inject } from 'tsyringe';

import { metadataTransformer } from './transformer';
import { ILogger, LogLevel } from './logger';
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
        @inject('ILogger') private logger: ILogger) { }

    public build(environment: string, buildOptions: IBuildOptions): ts.Program {
        const realBuildOptions = this.configProvider.get(environment, buildOptions);

        const options: ts.CompilerOptions = {
            emitDecoratorMetadata: realBuildOptions.emitDecoratorMetadata,
            experimentalDecorators: realBuildOptions.experimentalDecorators,
            inlineSourceMap: realBuildOptions.inlineSourceMap,
            mapRoot: realBuildOptions.mapRoot,
            module: toEnumValue(ts.ModuleKind, realBuildOptions.module),
            moduleResolution: this.getModuleResolution(realBuildOptions.moduleResolution),
            outDir: realBuildOptions.outDir,
            outFile: realBuildOptions.outFile,
            rootDir: realBuildOptions.rootDir,
            sourceMap: realBuildOptions.sourceMap,
            sourceRoot: realBuildOptions.sourceRoot,
            target: toEnumValue(ts.ScriptTarget, realBuildOptions.target),
            typeRoots: realBuildOptions.typeRoots,
            types: realBuildOptions.types,  
        };

        this.logger.log(`BuildOptions: '${JSON.stringify(options)}'`);
        
        const compilerHost = ts.createCompilerHost(options);
    
        const include = isNullOrUndefined(realBuildOptions.include) ? [] : realBuildOptions.include;
        const files = include
            .map(pattern => glob.sync(pattern, { root: realBuildOptions.rootDir }))
            .reduce((a, b) => a.concat(b));
        
        this.logger.log("Found files to transpile:")
        this.logger.log(files);
    
        return ts.createProgram(files, options, compilerHost);    
    }
    
    public emit(program: ts.Program): ts.EmitResult {
        const result = program.emit(
            targetSourceFile, 
            writeFile, 
            emptyCancellationToken, 
            emitOnlyDtsFiles, 
            transformers);

        if(result.emitSkipped) {
            this.logger.log('Emit has been skiped');
        } else {
            this.logger.log('Emited files:')
            this.logger.log(result.emittedFiles);
        }

        const allDiagnostics = ts
            .getPreEmitDiagnostics(program)
            .concat(result.diagnostics);

        allDiagnostics.forEach(diagnostic => {
            switch(diagnostic.category) {
                case ts.DiagnosticCategory.Error:
                    this.logger.log(this.toDiagnosticMessage(diagnostic), LogLevel.Error);
                    break;
                case ts.DiagnosticCategory.Warning:
                    this.logger.log(this.toDiagnosticMessage(diagnostic), LogLevel.Warn);
                    break;
                default:
                    this.logger.log(this.toDiagnosticMessage(diagnostic), LogLevel.Debug);
                    break;
            }
        });

        return result;
    }

    private toDiagnosticMessage(diagnostic: ts.Diagnostic): string {
        if (!isNullOrUndefined(diagnostic.file)) {
            const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`;
        }

        return  `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`;
    }

    private getModuleResolution(moduleResolution?: string): ts.ModuleResolutionKind {
        if(isNullOrUndefined(moduleResolution) || moduleResolution.toLowerCase() === 'classic') {
            return ts.ModuleResolutionKind.Classic;
        }
        if(moduleResolution.toLowerCase() === 'node') {
            return ts.ModuleResolutionKind.NodeJs;
        }

        throw `Unknown module resolution ${moduleResolution}`;
    }
}
