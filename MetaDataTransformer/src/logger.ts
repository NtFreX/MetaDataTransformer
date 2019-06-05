import { injectable, singleton } from "tsyringe";

export class ConsoleService {
    public log(obj?: string | number | object): void {
        console.log(obj);
    }
}

@injectable()
@singleton()
export class Logger {
    public isEnabled: boolean;

    constructor(private consoleService: ConsoleService) { }

    public log(obj?: object | string | number): void {
        if(this.isEnabled) {
            this.consoleService.log(obj);
        }
    }
}
