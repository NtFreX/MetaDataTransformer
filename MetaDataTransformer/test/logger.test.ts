import '@types/jest'; // tslint:disable-line:no-import-side-effect -> vscode code completion
import "reflect-metadata";
import { container } from "tsyringe";
import { Logger, ConsoleService } from './../src/logger';

describe('Logger', () => {
    describe('log', () => {
        it('should call the configured console service', () => {
            const msg = 'test';
            const consoleLogger = { log: jest.fn() };
            const logger = container
                .register(ConsoleService, { useValue: consoleLogger })
                .resolve(Logger);


            logger.isEnabled = true;
            logger.log(msg);

            expect(consoleLogger.log).toHaveBeenCalledWith(msg);
        });
    });
});