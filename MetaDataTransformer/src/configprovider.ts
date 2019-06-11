import * as fs from 'fs';

import { injectable } from 'tsyringe';
import { isNullOrUndefined } from 'util';

import { IBuildOptions } from './transpiler';
import { Logger, LogLevel } from './logger';

export interface IConfigProvider { 
    get(env: string, options: IBuildOptions): IBuildOptions;
    resolveConfigFile(env: string, rootDir?: string): string;
}

@injectable()
export class ConfigProvider implements IConfigProvider {

    public constructor(private logger: Logger) { }

    public get(env: string, options: IBuildOptions): IBuildOptions {
        const fileName = this.resolveConfigFile(env, options.rootDir);
        if(fileName === null) {
            return options;
        }

        const file = fs.readFileSync(fileName, 'utf8');
        const content = JSON.parse(file);

        const newOptions: IBuildOptions = {
            ...options,
            ...content.compilerOptions,
            include: isNullOrUndefined(content.include) ? options.include : content.include
        }
        
        return newOptions;
    }

    public resolveConfigFile(env: string, rootDir?: string): string {
        //TODO: use correct file resolve machanism
        const defaultFileName = 'tsconfig.json';
        let fileName = isNullOrUndefined(env) || env === '' ? defaultFileName : `tsconfig.${env}.json`
        let fileNamePrefix = '';
        if(!isNullOrUndefined(rootDir) && rootDir != '') {
            fileNamePrefix = `${rootDir}/`;
        }
        if(!fs.existsSync(fileNamePrefix + fileName)) {
            if(fileName === defaultFileName || !fs.existsSync(fileNamePrefix + defaultFileName)) {
                this.logger.log('No configuration file found', LogLevel.Debug);
                return null;
            }
            this.logger.log(`Config file "${fileNamePrefix + fileName}" not found. Defaulting to "${fileNamePrefix + defaultFileName}"`, LogLevel.Debug);
            fileName = defaultFileName;
        }
        this.logger.log(`Config file "${fileNamePrefix + fileName}" found`);
        return fileNamePrefix + fileName;
    }
}