#!/usr/bin/env node

import * as path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import convert from "./index";

const red = (text) => `\x1b[31m${text}\x1b[0m`;
const magenta = (text) => `\x1b[35m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const green = (text) => `\x1b[32m${text}\x1b[0m`;

const argv = yargs(hideBin(process.argv))
  .usage(yellow("Usage: $0 -s [file] -o [target path] -t [template path]"))
  .options({
    spec: {
      alias: "s",
      describe: "OpenAPI specification",
      type: "string",
      demandOption: true,
    },
    target: {
      alias: "o",
      describe: "target build path",
      type: "string",
      default: "./build",
    },
    template: {
      alias: "t",
      describe: "templates paths",
      type: "string",
      default: "./templates",
    },
  })
  .help().argv;

convert(
  path.resolve(process.cwd(), argv.spec),
  path.resolve(process.cwd(), argv.target)
)
  .then(() => {
    console.log(green("Done! ✨"));
  })
  .catch((err) => {
    console.error(red("Aaww 💩. Something went wrong:"));
    console.error(red(err.stack || err.message));
  });
