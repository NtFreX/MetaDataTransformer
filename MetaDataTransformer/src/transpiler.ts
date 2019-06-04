import * as ts from 'typescript';
import * as glob from 'glob';

import { metadataTransformer } from './transformer';
import { Logger } from './logger';
import { toEnumValue } from './utils';


const emptyCancellationToken: ts.CancellationToken = {
    isCancellationRequested: () => false,
    throwIfCancellationRequested: () => { },
};

const transformers: ts.CustomTransformers = {
    after: [],
    before: [metadataTransformer],
};

const emitOnlyDtsFiles = false;
const targetSourceFile: ts.SourceFile = undefined;
const writeFile: ts.WriteFileCallback = undefined;

export class BuildOptions {
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

export const build = (buildOptions: BuildOptions): ts.Program => {
    const options: ts.CompilerOptions = {
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
    
    const compilerHost = ts.createCompilerHost(options);

    const files = glob.sync(buildOptions.pattern,  { root: buildOptions.rootDir });
    Logger.log("Found files to transpile:")
    Logger.log(files);

    return ts.createProgram(files, options, compilerHost);    
};

export const emit = (program: ts.Program): ts.EmitResult => {
    return program.emit(targetSourceFile, writeFile, emptyCancellationToken, emitOnlyDtsFiles, transformers);
};
