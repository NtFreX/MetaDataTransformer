import { singleton } from "tsyringe";

export enum LogLevel {
    Info,
    Debug,
    Warn,
    Error
}

@singleton()
export class Logger {
    public isEnabled: boolean;

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
