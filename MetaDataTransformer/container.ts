import { container } from "tsyringe";

import { ConfigProvider } from "./src/configprovider";
import { Transpiler } from "./src/transpiler";

const setupContainer = () => {
    container
        .register('IConfigProvider', { useClass: ConfigProvider })
        .register('ITranspiler', { useClass: Transpiler });
};
export const resetContainer = () => {
    container.reset();
    setupContainer();
};

setupContainer();
