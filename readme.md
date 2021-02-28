# OpenAPI3 to Markdown converter
[![Build Status](https://travis-ci.com/synx-ai/openapi2md.svg?branch=master)](https://travis-ci.com/synx-ai/openapi2md)

Convert OpenAPI v3 spec into a customizable directory of markdown files. The purpose of this tool is to boost documentation generation and seamlessly integrate them into static site generators.

**Handlebars** is used to provide fully configurable templating support.

## Installation

### yarn
```shell
yarn add openapi2md
```

### npm
```shell
npm install openapi2md
```

## Basic usage

### CLI
```shell
Usage: openapi2md -s [file] -o [target path] -t [template path]

Options:
      --version   Show version number                                  [boolean]
  -s, --spec      OpenAPI specification                               [required]
  -o, --target    target build path                         [default: "./build"]
  -t, --template  templates paths                       [default: "./templates"]
      --help      Show help
```

### JavaScript
```javascript
const convert = require('openapi2md').default;

convert('./example/petstore.json', './build');
```

## Roadmap
- Create a cli.js file to execute commands using yarn or npm ✅
- Add more configurations (ie: custom templates)
- MDX templating support for platform that supports **React** components.

## Contribute
PR's are more than welcome and highly appreciated.
