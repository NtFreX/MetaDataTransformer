#!/usr/bin/env node

import { CommandLine } from "./commandline";

// call the command line parser
const commandLine: CommandLine = new CommandLine();
commandLine.execute(process.argv.slice(2));
