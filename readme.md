# OpenAPI3 to Markdown converter
[![Travis Build Status](https://img.shields.io/travis/synx-ai/openapi2md?logo=travis)](https://travis-ci.com/synx-ai/openapi2md) [![GitHub Workflow Status](https://img.shields.io/github/workflow/status/synx-ai/openapi2md/Node.js%20Package?label=package&logo=github)](https://github.com/synx-ai/openapi2md/actions/workflows/package.yml) [![npm](https://img.shields.io/npm/v/@synx-ai/openapi2md?logo=npm)](https://www.npmjs.com/package/@synx-ai/openapi2md) [![npm](https://img.shields.io/npm/dw/@synx-ai/openapi2md?logo=npm)](https://www.npmjs.com/package/@synx-ai/openapi2md) [![Coveralls](https://img.shields.io/coveralls/github/synx-ai/openapi2md?logo=coveralls)](https://coveralls.io/github/synx-ai/openapi2md)


Convert OpenAPI v3 spec into a directory of markdown files based on your spec paths. The purpose of this tool is to boost documentation generation and seamlessly integrate them into static site generators.

[**Handlebars**](https://handlebarsjs.com/) is used to provide fully configurable templating support.


## Installation

### yarn
```console
yarn add @synx-ai/openapi2md
```

### npm
```console
npm install @synx-ai/openapi2md
```


## Basic usage

### Options

| Option             | CLI argument | JavaScript parameter | Default       |
| ------------------ | ------------ | -------------------- | ------------- |
| `OpenAPI spec`     | --spec       | specFile             | _None_        |
| `Target build dir` | --target     | outPath              | `./build`     |
| `Templates dir`    | --templates  | templatePath         | `./templates` |

The tool will try to load the `--templates` relative to current working path first, then will fallback to library path.

### CLI
```console
Usage: openapi2md --specs [file] --target [target path] --templates [template path]

Options:
      --version   Show version number                         [boolean]
  -s, --spec      OpenAPI specification                      [required]
  -o, --target    target build path                [default: "./build"]
  -t, --template  templates paths              [default: "./templates"]
      --help      Show help
```

### JavaScript
```javascript
const convert = require('openapi2md').default;

convert('./example/petstore.json', './build');
```

### Templates

For every [**operation**](https://swagger.io/docs/specification/paths-and-operations/) in `paths`, object with all references resolved will be passed to `templates/path.hdb`, please refer to default template for an example in how to use it.

Please note that before saving, prettify will be executed to format the output, you can disable it using the `<!-- prettier-ignore-start -->` tag, exmaple:

```html
<!-- prettier-ignore-start -->

<Tabs defaultValue="{{someVar}}" values={[
{{#each content}}
  { label: "{{@key}}", value: "{{@key}}" },
{{/each}}
]}>

<!-- prettier-ignore-end -->
```

## Roadmap
- [X] Create a cli.js file to execute commands using yarn or npm
- [X] Add more configurations (ie: custom templates)
- [X] ~MDX templating support for platform that supports **React** components.~ Removed as it can be customized from current templates.
- [ ] Add schemas and general info rendering.

## Contribute
PR's are more than welcome and highly appreciated.
