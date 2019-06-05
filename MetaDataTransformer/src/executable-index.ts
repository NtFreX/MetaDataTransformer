#!/usr/bin/env node

import "reflect-metadata"

import { CommandLine } from "./commandline";
import { container } from "tsyringe";

// call the command line parser
const commandLine: CommandLine = container.resolve(CommandLine);
commandLine.execute(process.argv.slice(2));
