# OpenAPI3 to Markdown converter
[![Travis Build Status](https://img.shields.io/travis/synx-ai/oas3-mdx?logo=travis)](https://travis-ci.com/synx-ai/oas3-mdx) [![GitHub Workflow Status](https://img.shields.io/github/workflow/status/synx-ai/oas3-mdx/Node.js%20Package?label=package&logo=github)](https://github.com/synx-ai/oas3-mdx/actions/workflows/package.yml) [![npm](https://img.shields.io/npm/v/@synx-ai/oas3-mdx?logo=npm)](https://www.npmjs.com/package/@synx-ai/oas3-mdx) [![npm](https://img.shields.io/npm/dw/@synx-ai/oas3-mdx?logo=npm)](https://www.npmjs.com/package/@synx-ai/oas3-mdx) [![Coveralls](https://img.shields.io/coveralls/github/synx-ai/oas3-mdx?logo=coveralls)](https://coveralls.io/github/synx-ai/oas3-mdx)


Convert OpenAPI v3 spec into a directory of markdown files based on your spec paths. The purpose of this tool is to boost documentation generation and seamlessly integrate them into static site generators.

[**Handlebars**](https://handlebarsjs.com/) is used to provide fully configurable templating support.


## Installation

### yarn
```console
yarn add @synx-ai/oas3-mdx
```

### npm
```console
npm install @synx-ai/oas3-mdx
```


## Basic usage

### CLI
```console
Usage: oas3-mdx --specs [file] --target [target path] --templates [template path] --snippets [string with targets]

Options:
      --version   Show version number                         [boolean]
  -s, --spec      OpenAPI specification                      [required]
  -o, --target    target build path                [default: "./build"]
  -t, --templates templates path               [default: "./templates"]
  -c, --snippets  comma separated targets            [default: "shell"]
      --help      Show help
```

### JavaScript
```javascript
const convert = require('openapi2md').default;

// optional arguments are expected as an object, ie:
convert('./example/petstore.json' /*, { outPath: 'my_path' }*/);
```

### Options

| Option             | CLI argument | JavaScript parameter | Default       |
| ------------------ | ------------ | -------------------- | ------------- |
| `OpenAPI spec`     | --spec       | specFile             | _None_        |
| `Target build dir` | --target     | outPath              | `./build`     |
| `Templates dir`    | --templates  | templatesPath        | `./templates` |
| `Snippet targets`  | --snipetts   | snippetTargets       | `["shell"]`   |
| `Prettier parser`  | --parser     | prettierParser       | `mdx`         |

The tool will try to load the `--templates` relative to current working path first, then will fallback to library path.

### Valid Snippet Targets
Currently, OpenAPI Snippet supports the following targets from [HTTP Snippet](https://github.com/Kong/httpsnippet) library:

* `c_libcurl` (default)
* `csharp_restsharp` (default)
* `go_native` (default)
* `java_okhttp`
* `java_unirest` (default)
* `javascript_jquery`
* `javascript_xhr` (default)
* `node_native` (default)
* `node_request`
* `node_unirest`
* `objc_nsurlsession` (default)
* `ocaml_cohttp` (default)
* `php_curl` (default)
* `php_http1`
* `php_http2`
* `python_python3` (default)
* `python_requests`
* `ruby_native` (default)
* `shell_curl` (default)
* `shell_httpie`
* `shell_wget`
* `swift_nsurlsession` (default)

### Prettier Parser

For the parser, while `mdx` or `markdown` are suggested, you can use anything supported by [Prettier](https://prettier.io/docs/en/options.html#parser).


### Custom Tags on Schema

- `x-docgenIgnore`: at method level to ignore output generation, for example:

```js
{
  ...
  "paths": {
    "/pet": {
      "put": { // this method will be ignored
        "x-docgenIgnore": true,
        "summary": "Update an existing pet",
        ...
      }
    }
  }
}
```

### Templates

For every [**operation**](https://swagger.io/docs/specification/paths-and-operations/) in `paths`, object with all references resolved will be passed to `templates/path.hdb`, please refer to default template for an example in how to use it.

Please note that before saving, prettify will be executed to format the output, you can disable it using the `<!-- prettier-ignore-start -->` tag, example:

```html
<!-- prettier-ignore-start -->

<Tabs defaultValue="{{someVar}}" values={[
{{#each content}}
  { label: "{{@key}}", value: "{{@key}}" },
{{/each}}
]}>

<!-- prettier-ignore-end -->
```

### Using partials

In your `templatesPath` create a `dir` called `partials` every single file with `.hdb` extension within its subdirs will be loaded as partial, using the filename as partial name. Example:

A file named `partials/quote.hdb` with the following code, will create a `quote` partial.

```
>{{text}}
```

This partial can be used in your templates as follows:

```markdown
{{>quote "This text will be quoted."}}
```

### Using helpers

In your `templatesPath` create a `dir` called `helpers` every single file with `.js` extension within its subdirs will be loaded as a helper, using the filename as the helper name. Example:

A file named `partials/loud.js` with the following code, will create a `load` helper.

```javascript
// the script should export an anonymous function in order to execute
// you can use many parameters as needed
exports.default = function (text) {
  return text.toUpperCase()
}
```

This helper can be used in your templates as follows:

```markdown
{{loud "This text will be uppercased."}}
```


## Troubleshooting
- Most common errors happens due a malformed file, to validate and lint your spec for possible errors check [Speccy](https://github.com/wework/speccy).
- If your specification has multiple paths which map to the same OpenAPI path, you can should set `"x-hasEquivalentPaths": true,` on the root object, example:

```javascript
{
  "openapi": "3.0.2",
  "x-hasEquivalentPaths": true,
  "info": {
    ...
  }
  ...
}  
```

## Roadmap
- [X] Create a cli.js file to execute commands using yarn or npm
- [X] Add more configurations (ie: custom templates)
- [X] ~MDX templating support for platform that supports **React** components.~ Removed as it can be customized from current templates.
- [ ] Add schemas and general info rendering.

## Contribute
PR's are more than welcome and highly appreciated.
