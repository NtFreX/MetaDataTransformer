import { singleton } from "tsyringe";

export enum LogLevel {
    Info,
    Debug,
    Warn,
    Error,
}

export interface ILogger {
    setIsEnabled(value: boolean): void;
    log(obj?: object | string | number, level?: LogLevel): void;
}

@singleton()
export class Logger implements ILogger {
    private isEnabled: boolean;
    
    public setIsEnabled(value: boolean): void { this.isEnabled = value; }

    public log(obj?: object | string | number, level: LogLevel = LogLevel.Info): void {
        if(!this.isEnabled) {
            return;
        }

        if(level === LogLevel.Info) {
            console.info(obj);
        } else if(level === LogLevel.Debug) {
            console.debug(obj);
        } else if(level === LogLevel.Warn) {
            console.warn(obj);
        } else if(level === LogLevel.Error) {
            console.error(obj);
        }
        else {
            throw 'Unknown loglevel';
        }
    }
}
