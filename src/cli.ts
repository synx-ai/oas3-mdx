#!/usr/bin/env node

import * as path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import convert from "./index";

const red = (text) => `\x1b[31m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const green = (text) => `\x1b[32m${text}\x1b[0m`;

const argv = yargs(hideBin(process.argv))
  .usage(yellow("Usage: $0 --specs [file] --target [target path] --templates [template path]"))
  .option("spec", {
    alias: "s",
    describe: "OpenAPI specification",
    type: "string",
    demandOption: true,
  })
  .option("target", {
    alias: "o",
    describe: "target build path",
    type: "string",
    default: "./build",
  })
  .option("templates", {
    alias: "t",
    describe: "custom templates path",
    type: "string",
    default: "../templates",
  })
  .help().argv;

convert(
  path.resolve(process.cwd(), argv.spec),
  path.resolve(process.cwd(), argv.target),
  path.resolve(argv.templates)
)
  .then(() => {
    console.log(green("Done! ✨"));
  })
  .catch((err) => {
    console.error(red("Aaww 💩. Something went wrong:"));
    console.error(red(err || err.stack || err.message));
  });
