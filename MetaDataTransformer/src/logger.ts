export class Logger {
    public static isEnabled: boolean;

    public static log(obj?: object | string | number): void {
        if(Logger.isEnabled) {
            console.log(obj);
        }
    }
}
