import * as ts from 'typescript';

import { metadataTransformer } from './transformer';
import { Logger } from './logger';
import { toEnumValue } from './utils';


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

export class BuildOptions {
    public emitDecoratorMetadata?: boolean;
    public experimentalDecorators?: boolean;
    public inlineSourceMap?: boolean;
    public pattern: string;
    public outDir?: string;
    public outFile?: string;
    public rootDir?: string;
    public module?: string;
    public moduleResolution?: string;
    public target?: string;
    public sourceMap?: boolean;
    public sourceRoot?: string;
    public mapRoot?: string;
    public types?: string[];
    public typeRoots?: string[];
}

export interface ITypescriptService {
    createCompilerHost(options: ts.CompilerOptions): ts.CompilerHost;
    createProgram(files: string[], options: ts.CompilerOptions, host: ts.CompilerHost): ts.Program;
}

export interface IGlobServiceOptions {
    root?: string;
}

export interface IGlobService {
    sync(pattern: string, options?: IGlobServiceOptions): string[];
}

export class Transpiler {
    constructor(private logger: Logger, private typescriptService: ITypescriptService, private globService: IGlobService) { }

    public build(buildOptions: BuildOptions): ts.Program {
        const options: ts.CompilerOptions = {
            emitDecoratorMetadata: buildOptions.emitDecoratorMetadata,
            experimentalDecorators: buildOptions.experimentalDecorators,
            inlineSourceMap: buildOptions.inlineSourceMap,
            mapRoot: buildOptions.mapRoot,
            module: toEnumValue(ts.ModuleKind, buildOptions.module),
            moduleResolution: toEnumValue(ts.ModuleResolutionKind, buildOptions.moduleResolution),
            outDir: buildOptions.outDir,
            outFile: buildOptions.outFile,
            rootDir: buildOptions.rootDir,
            sourceMap: buildOptions.sourceMap,
            sourceRoot: buildOptions.sourceRoot,
            target: toEnumValue(ts.ScriptTarget, buildOptions.target),
            typeRoots: buildOptions.typeRoots,
            types: buildOptions.types,
            
        };
        
        const compilerHost = this.typescriptService.createCompilerHost(options);
    
        const files = this.globService.sync(buildOptions.pattern, { root: buildOptions.rootDir });
        this.logger.log("Found files to transpile:")
        this.logger.log(files);
    
        return this.typescriptService.createProgram(files, options, compilerHost);    
    }
    
    public emit(program: ts.Program): ts.EmitResult {
        return program.emit(targetSourceFile, writeFile, emptyCancellationToken, emitOnlyDtsFiles, transformers);
    }    
}
