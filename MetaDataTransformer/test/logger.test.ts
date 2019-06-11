import '../polyfill';
import { resetContainer } from '../container';

import '@types/jest'; // tslint:disable-line:no-import-side-effect -> vscode code completion

import { container } from "tsyringe";

import { Logger, LogLevel } from './../src/logger';

beforeEach(() => {
    resetContainer();
});

describe('Logger', () => {
    describe('log', () => {
        it('should call the console info method with the given message', () => {
            const msg = 'test';
            const spy = spyOn(console, 'info');
            const logger = container.resolve(Logger);

            logger.isEnabled = true;
            logger.log(msg);

            expect(spy).toHaveBeenCalledWith(msg);
        });

        it('should call the console info when given info as log level', () => {
            const spy = spyOn(console, 'info');
            const logger = container.resolve(Logger);

            logger.isEnabled = true;
            logger.log('', LogLevel.Info);

            expect(spy).toHaveBeenCalled();
        });

        it('should call the console debug when given debug as log level', () => {
            const spy = spyOn(console, 'debug');
            const logger = container.resolve(Logger);

            logger.isEnabled = true;
            logger.log('', LogLevel.Debug);

            expect(spy).toHaveBeenCalled();
        });

        it('should call the console warn when given warn as log level', () => {
            const spy = spyOn(console, 'warn');
            const logger = container.resolve(Logger);

            logger.isEnabled = true;
            logger.log('', LogLevel.Warn);

            expect(spy).toHaveBeenCalled();
        });

        it('should call the console error when given error as log level', () => {
            const spy = spyOn(console, 'error');
            const logger = container.resolve(Logger);

            logger.isEnabled = true;
            logger.log('', LogLevel.Error);

            expect(spy).toHaveBeenCalled();
        });
    });
});