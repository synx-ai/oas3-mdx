'use_strict'

import * as fs from 'fs'
import * as path from 'path'
import * as Handlebars from 'handlebars'
import * as _ from 'lodash'

const convert = (specFile: string, outPath: string) => {
  const spec = require(specFile)

  if (fs.existsSync(outPath)) {
    //ToDo: delete existing path
  }

  console.log(spec.components.schemas)

  Object.keys(spec.components.schemas).forEach((key: string) => {
    const schema = (spec.components.schemas as any)[key]

    console.log(`${key}\n\n`, schema)
  })

  const pathTemplate = Handlebars.compile(fs.readFileSync(`${__dirname}/../templates/path.hdb`, 'utf8'))

  Object.keys(spec.paths).forEach((schemaKey: string) => {
    const apiPath = (spec.paths as any)[schemaKey]

    fs.mkdirSync(`${outPath}${schemaKey}`, { recursive: true })
    console.log(`${schemaKey}`)

    Object.keys(apiPath).forEach((apiPathKey: string) => {
      const method = (apiPath as any)[apiPathKey]


      fs.writeFileSync(
        `${outPath}${schemaKey}/${apiPathKey}.md`,
        pathTemplate({
          slug: _.kebabCase(`${schemaKey}-${apiPathKey}`),
          path: schemaKey,
          httpMethod: _.toUpper(apiPathKey),
          method: method
        })
      )

      console.log(`\t${apiPathKey}`)
    })
  })

  return true
}

export default convert
