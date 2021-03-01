# OpenAPI3 to Markdown converter
[![Travis Build Status](https://img.shields.io/travis/synx-ai/openapi2md?logo=travis)](https://travis-ci.com/synx-ai/openapi2md) [![GitHub Workflow Status](https://img.shields.io/github/workflow/status/synx-ai/openapi2md/Node.js%20Package?label=package&logo=github)](https://github.com/synx-ai/openapi2md/actions/workflows/package.yml) [![npm](https://img.shields.io/npm/v/@synx-ai/openapi2md?logo=npm)](https://www.npmjs.com/package/@synx-ai/openapi2md) [![npm](https://img.shields.io/npm/dw/@synx-ai/openapi2md?logo=npm)](https://www.npmjs.com/package/@synx-ai/openapi2md) [!![Coveralls](https://img.shields.io/coveralls/github/synx-ai/openapi2md?logo=coveralls)](https://coveralls.io/github/synx-ai/openapi2md)

Convert OpenAPI v3 spec into a customizable directory of markdown files. The purpose of this tool is to boost documentation generation and seamlessly integrate them into static site generators.

**Handlebars** is used to provide fully configurable templating support.


## Installation

### yarn
```console
yarn add openapi2md
```

### npm
```console
npm install openapi2md
```


## Basic usage

### CLI
```console
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
- [X] Create a cli.js file to execute commands using yarn or npm
- [X] Add more configurations (ie: custom templates)
- [ ] MDX templating support for platform that supports **React** components.


## Contribute
PR's are more than welcome and highly appreciated.
