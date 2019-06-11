#!/usr/bin/env node

import "../polyfill";
import "../container";

import { CommandLine } from "./commandline";
import { container } from "tsyringe";

const commandLine: CommandLine = container.resolve(CommandLine);
commandLine.execute(process.argv.slice(2));
