#!/usr/bin/env node

import * as path from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import convert from './index'

const red = text => `\x1b[31m${text}\x1b[0m`
const magenta = text => `\x1b[35m${text}\x1b[0m`
const yellow = text => `\x1b[33m${text}\x1b[0m`
const green = text => `\x1b[32m${text}\x1b[0m`

const argv = yargs(hideBin(process.argv))
  .usage(yellow('Usage: $0 -s [file] -o [target path] -t [template path]'))
  .options({
    'spec': {
      alias: 's',
      describe: 'OpenAPI specification',
      demandOption: true
    },
    'target': {
      alias: 'o',
      describe: 'target build path',
      default: './build'
    },
    'template': {
      alias: 't',
      describe: 'templates paths',
      default: './templates'
    }
  })
  .help()
  .argv

console.log(argv)

convert(argv.spec, argv.target)
/*
generator.generate({
  openapi: openapiFile,
  base_dir: program.basedir || baseDir || process.cwd(),
  target_dir: program.output,
  templates: program.templates ? path.resolve(process.cwd(), program.templates) : undefined,
  curl: program.curl,
  template,
  skipExistingFiles: program.skipExistingFiles,
  deleteFolders: program.deleteFolders
}).then(() => {
  console.log(green('Done! ✨'));
  console.log(yellow('Check out your shiny new API at ') + magenta(program.output) + yellow('.'));
}).catch(err => {
  console.error(red('Aaww 💩. Something went wrong:'));
  console.error(red(err.stack || err.message || inspect(err, { depth: null })));
});

process.on('unhandledRejection', (err) => console.error(err));*/
