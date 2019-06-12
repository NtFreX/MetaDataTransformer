import '../test.setup'; // tslint:disable-line:no-import-side-effect

import { container } from "tsyringe";

import { LogLevel, ILogger } from './../src/logger';

describe('Logger', () => {
    describe('log', () => {
        it('should call the console info method with the given message', () => {
            const msg = 'test';
            const spy = spyOn(console, 'info');
            const logger: ILogger = container.resolve('ILogger');

            logger.setIsEnabled(true);
            logger.log(msg);

            expect(spy).toHaveBeenCalledWith(msg);
        });

        it('should call the console info when given info as log level', () => {
            const spy = spyOn(console, 'info');
            const logger: ILogger = container.resolve('ILogger');

            logger.setIsEnabled(true);
            logger.log('', LogLevel.Info);

            expect(spy).toHaveBeenCalled();
        });

        it('should call the console debug when given debug as log level', () => {
            const spy = spyOn(console, 'debug');
            const logger: ILogger = container.resolve('ILogger');

            logger.setIsEnabled(true);
            logger.log('', LogLevel.Debug);

            expect(spy).toHaveBeenCalled();
        });

        it('should call the console warn when given warn as log level', () => {
            const spy = spyOn(console, 'warn');
            const logger: ILogger = container.resolve('ILogger');

            logger.setIsEnabled(true);
            logger.log('', LogLevel.Warn);

            expect(spy).toHaveBeenCalled();
        });

        it('should call the console error when given error as log level', () => {
            const spy = spyOn(console, 'error');
            const logger: ILogger = container.resolve('ILogger');

            logger.setIsEnabled(true);
            logger.log('', LogLevel.Error);

            expect(spy).toHaveBeenCalled();
        });
    });
});
