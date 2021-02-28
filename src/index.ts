"use_strict";

import * as fs from "fs";
import * as path from "path";
import * as Handlebars from "handlebars";
import * as _ from "lodash";
import * as xml from "xml-js";

/**
 * Helper function to serialize an object to JSON
 * @param   {any}     data the object to serialize
 * @returns {string}  a JSON serialized representation of the object
 */
const buildJson = (data: any): string => {
  return JSON.stringify(data, null, 2);
};

/**
 * Helper function to serialize an object to XML
 * @param   {string}  name XML name for this node
 * @param   {any}     data the object to serialize
 * @returns {string}  a XML serialized representation of the object
 */
const buildXml = (name: string, data: any): string => {
  let options = { compact: true, spaces: 2 };
  let obj = {
    _declaration: {
      _attributes: {
        version: "1.0",
        encoding: "utf-8",
      },
    },
    [name]: data,
  };

  return xml.json2xml(JSON.stringify(obj), options);
};

/**
 * Convert openapi spec to markdown
 * @param   {string}    specFile specification file
 * @param   {string}    outPath path to write documents
 * @param   {string}    templatePath path to markdown templates
 * @returns {Promise<void>}
 */
const convert = (
  specFile: string,
  outPath: string,
  templatePath: string = "../templates/"
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // load the spec from a json into an object
      const spec = require(specFile);
      let schemas: any[] = [];
      let schemasObject: any;

      if (fs.existsSync(outPath)) {
        // ToDo: delete existing path
      }

      const propertiesComponent = (schema) => {
        let arr: any[] = [];

        if (Object.prototype.hasOwnProperty.call(schema, "type")) {
          if (schema.type.includes("object")) {
            Object.keys(schema.properties).forEach((pathKey: string) => {
              const property = (schema.properties as any)[pathKey];
              let example;

              // if property has properties is an object, recursively call this function
              if (Object.prototype.hasOwnProperty.call(property, "properties")) {
                example = Object.fromEntries(propertiesComponent(property.properties));
              }
              // if property has a reference, try to build from it
              else if (Object.prototype.hasOwnProperty.call(property, "$ref")) {
                example = Object.fromEntries(
                  propertiesComponent((spec.components.schemas as any)[property.$ref.split("/").pop()])
                );
              }
              // if an example is defined use it
              else if (Object.prototype.hasOwnProperty.call(property, "example")) {
                example = property.example;
              }
              // try to create an example
              else {
                switch (property.type) {
                  case "array": {
                    if (Object.prototype.hasOwnProperty.call(property, "items")) {
                      if (Object.prototype.hasOwnProperty.call(property.items, "$ref")) {
                        example = [
                          Object.fromEntries(
                            propertiesComponent(
                              (spec.components.schemas as any)[property.items.$ref.split("/").pop()]
                            )
                          ),
                        ];
                      } else if (Object.prototype.hasOwnProperty.call(property.items, "type")) {
                        // propertyName = property.items.xml.name;
                        example = [
                          {
                            [property.items.xml.name]: property.items.type,
                          },
                        ];
                      }
                    }

                    break;
                  }
                  case "string": {
                    if (Object.prototype.hasOwnProperty.call(property, "format")) {
                      if (property.format == "date-time") {
                        let date = new Date();
                        example = date.toISOString();
                      } else if (property.format == "date") {
                        let date = new Date();
                        example = date.toISOString().substring(0, 10);
                      }
                    }

                    if (
                      Object.prototype.hasOwnProperty.call(property, "enum") &&
                      property.enum.length > 0
                    ) {
                      example = property.enum[0];
                    }

                    break;
                  }
                  case "uid": {
                    example = Math.random()
                      .toString(36)
                      .replace(/[^a-z0-9]+/g, "")
                      .substr(0, 8);
                    break;
                  }
                  case "number": {
                    example = Math.random() * 10000;

                    break;
                  }
                  case "integer": {
                    example = Math.floor(Math.random() * 10000);

                    break;
                  }
                  case "boolean": {
                    example = true;

                    break;
                  }
                }
              }

              // unable to make an example, just use the property name
              if (example === undefined) {
                example = pathKey;
              }

              arr.push([pathKey, example]);
              // propertyName = key;
            });
          }
        }

        return arr;
      };

      Handlebars.registerHelper("schemaRef", (key, context, schemas) => {
        if (Object.prototype.hasOwnProperty.call(context, "$ref")) {
          if (key.toLowerCase().includes("json")) {
            return buildJson(schemas[context.$ref]);
          } else if (key.toLowerCase().includes("xml")) {
            return buildXml(context.$ref.split("/").pop().toLowerCase(), schemas[context.$ref]);
          }
        } else if (Object.prototype.hasOwnProperty.call(context, "type")) {
          if (context.type.includes("array")) {
            if (Object.prototype.hasOwnProperty.call(context.items, "$ref")) {
              if (key.toLowerCase().includes("json")) {
                return buildJson([schemas[context.items.$ref]]);
              } else if (key.toLowerCase().includes("xml")) {
                return buildXml(context.items.$ref.split("/").pop().toLowerCase(), [
                  schemas[context.items.$ref],
                ]);
              }
            }
          }
        } else {
          // ToDo: implement logic for schemes without $ref
        }

        return "{}";
      });

      // iterate schemas to build a sample js object
      Object.keys(spec.components.schemas).forEach((key: string) => {
        const schemaRef = (spec.components.schemas as any)[key];

        // store the schema into an array
        schemas.push([
          `#/components/schemas/${key}`,
          Object.fromEntries(propertiesComponent(schemaRef)),
        ]);
      });

      // transform the schemas array into an object
      schemasObject = Object.fromEntries(schemas);

      const pathTemplate = Handlebars.compile(
        fs.readFileSync(path.resolve(__dirname, templatePath, "path.hdb"), "utf8")
      );

      // iterate paths
      Object.keys(spec.paths).forEach((schemaKey: string) => {
        const apiPath = (spec.paths as any)[schemaKey];

        // try to create output paths
        fs.mkdirSync(`${outPath}${schemaKey}`, { recursive: true });

        Object.keys(apiPath).forEach((apiPathKey: string) => {
          const method = (apiPath as any)[apiPathKey];

          // render the path using Handlebars and save it
          fs.writeFileSync(
            `${outPath}${schemaKey}/${apiPathKey}.md`,
            pathTemplate({
              slug: _.kebabCase(`${schemaKey}-${apiPathKey}`),
              path: schemaKey,
              httpMethod: _.toUpper(apiPathKey),
              method: method,
              schemas: schemasObject,
            })
          );
        });
      });

      // all done
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export default convert;
