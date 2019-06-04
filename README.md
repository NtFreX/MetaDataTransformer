# MetaDataTransformer

A typescript transpiler wrapper with reflection capabilities

[![Build Status](https://travis-ci.com/NtFreX/MetaDataTransformer.svg?branch=master)](https://travis-ci.com/NtFreX/MetaDataTransformer)
[![Build Status](https://dev.azure.com/ntfrex/MetaDataTransformer/_apis/build/status/NtFreX.MetaDataTransformer?branchName=master)](https://dev.azure.com/ntfrex/MetaDataTransformer/_build/latest?definitionId=1&branchName=master)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=NtFreX/MetaDataTransformer)](https://dependabot.com)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ea59fba98f0d45288ed1a13d11c24049)](https://www.codacy.com/app/ntfrex/MetaDataTransformer?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=NtFreX/MetaDataTransformer&amp;utm_campaign=Badge_Grade)
[![Coverage Status](https://coveralls.io/repos/github/NtFreX/MetaDataTransformer/badge.svg?branch=master)](https://coveralls.io/github/NtFreX/MetaDataTransformer?branch=master)

## Important notice

This project is not stable and there are no plans to support the same features as the typescript cli. Maybe when the typescript team has decided on if, how and when they will support easy transformers pluggability I will tear the transformer out of this project and provide it standalone.

## Prerequisites

*   node js

## How to run

*   Open the path "MetaDataTransformer/MetaDataTransformerUsage" in a command line terminal
*   Run `npm run pack`
*   Open "MetaDataTransformer/MetaDataTransformerUsage/test.html" in a browser and take a look at the console output

## CLI

```console
usage: tsca [-h] [-v] <command> ...

Typescript transpiler with reflection capabilities.

Positional arguments:
  <command>
    build        Transpiles the given typescript files

Optional arguments:
  -h, --help     Show this help message and exit.
  -v, --verbose  Show extra logging detail
  
usage: tsca build [-h] [--inline-source-map] --pattern PATTERN
                  [--out-dir OUTDIR] [--out-file OUTFILE] [--root-dir ROOTDIR]
                  [--module {None,CommonJS,AMD,UMD,System,ES2015,ESNext}]
                  [--module-resolution {Classic,NodeJs}]
                  [--target {ES3,ES5,ES2015,ES2016,ES2017,ES2018,ESNext,JSON,Latest}]
                  [--source-map] [--source-root SOURCEROOT]
                  [--map-root MAPROOT] [--types TYPES]
                  [--type-roots TYPEROOTS]
```

## Reflection API

```ts
export interface ITypeDeclaration {
    properties: {
        [id: string]: IPropertyDeclaration;
    };
}
export interface IPropertyDeclaration {
    isOptional: boolean;
    isStatic: boolean;
    accessModifier: AccessModifier;
}
export declare enum AccessModifier {
    Public = 0,
    Protected = 1,
    Private = 2
}
export interface IType<T> extends Function {
    new (...args: (object | string | number | boolean)[]): T;
}
export declare const reflection: {
    canCast: <T>(obj: object, type: IType<T>) => boolean;
    getType: <T>(type: IType<T>) => ITypeDeclaration;
    isType: <T>(type: IType<T>) => boolean;
};
```

## Reflection API usage

```ts
import { reflection } from 'metadatatransformer';

class Test {
  ...
}

if(reflection.isType(Test)) {
  reflection.getType(Test);
  reflection.canCast({ }, Test);
}
```
