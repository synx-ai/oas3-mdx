"use_strict";

import * as fs from "fs";
import * as path from "path";
import * as Handlebars from "handlebars";
import * as _ from "lodash";
import * as xml from "xml-js";
import bundler from "./bundler";

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
      bundler(specFile, "./")
        .then((spec) => {
          if (fs.existsSync(outPath)) {
            // ToDo: delete existing path
          }

          //console.log(spec);

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

          const pathTemplate = Handlebars.compile(
            fs.readFileSync(path.resolve(__dirname, templatePath, "path.hdb"), "utf8")
          );

          // iterate paths
          Object.keys(spec.paths).forEach((pathKey: string) => {
            const apiPath = (spec.paths as any)[pathKey];

            console.log(pathKey, apiPath);
            // try to create output paths
            fs.mkdirSync(`${outPath}${pathKey}`, { recursive: true });

            Object.keys(apiPath).forEach((methodKey: string) => {
              const method = (apiPath as any)[methodKey];

              // render the path using Handlebars and save it
              fs.writeFileSync(
                `${outPath}${pathKey}/${methodKey}.md`,
                pathTemplate({
                  slug: _.kebabCase(`${pathKey}-${methodKey}`),
                  path: pathKey,
                  httpMethod: _.toUpper(methodKey),
                  method: method,
                })
              );
            });
          });

          // all done
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    } catch (err) {
      reject(err);
    }
  });
};

export default convert;
