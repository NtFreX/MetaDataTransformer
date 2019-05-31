export class Logger {
    public static isEnabled = false;

    public static log(obj?: any): void {
        if(Logger.isEnabled) {
            console.log(obj);
        }
    }
}
