#!/usr/bin/env node

import "../polyfill";  // tslint:disable-line:no-import-side-effect
import "../container"; // tslint:disable-line:no-import-side-effect

import { ICommandLine } from "./commandline";
import { container } from "tsyringe";

export const execute = (argument: string[]) => {
    const commandLine: ICommandLine = container.resolve('ICommandLine');
    commandLine.execute(argument.slice(2));
};

execute(process.argv);
