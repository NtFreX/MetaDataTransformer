import { container } from "tsyringe";

import { ConfigProvider } from "./src/configprovider";
import { Transpiler } from "./src/transpiler";
import { CommandLine } from "./src/commandline";
import { Logger } from "./src/logger";

const setupContainer = () => {
    container
        .register('IConfigProvider', { useClass: ConfigProvider })
        .register('ITranspiler', { useClass: Transpiler })
        .register('ICommandLine', { useClass: CommandLine })
        .register('ILogger', { useClass: Logger });
};
export const resetContainer = () => {
    container.reset();
    setupContainer();
};

setupContainer();
