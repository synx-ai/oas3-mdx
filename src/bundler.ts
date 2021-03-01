"use_strict";

/**
 * This file loads, bundles and validates an OpenAPI spec.
 *
 * Refactored from openapi-contrib/openapi3-generator, it was translated to typescript and
 * moved to extensively use Promises.
 *
 * @see  Original source
 * @link https://github.com/openapi-contrib/openapi3-generator/blob/master/lib/bundler.js
 */

import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import * as https from "https";
import * as YAML from "js-yaml";
import * as RefParser from "json-schema-ref-parser";
import * as validator from "oas-validator";

const handleHTTPResponse = (url, res, resolve, reject) => {
  if (res.statusCode >= 400) {
    return reject(`Can't get file ${url}`);
  }

  res.setEncoding("utf8");
  let rawData = "";

  res.on("data", (chunk) => {
    rawData += chunk;
  });

  res.on("end", () => {
    resolve(rawData);
  });

  res.on("error", reject);
};

const getContentFromURL = (url: string) => {
  return new Promise((resolve, reject) => {
    if (url.startsWith("http:")) {
      http
        .get(url, (res) => {
          handleHTTPResponse(url, res, resolve, reject);
        })
        .on("error", reject);
    } else if (url.startsWith("https:")) {
      https
        .get(url, (res) => {
          handleHTTPResponse(url, res, resolve, reject);
        })
        .on("error", reject);
    } else {
      reject("Protocol not supported.");
    }
  });
};

const getFileContent = (filePath: string) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, filePath), (err, content) => {
      if (err) {
        getContentFromURL(filePath)
          .catch(reject)
          .then((content) => resolve(content));
        return;
      }
      resolve(content);
    });
  });
};

const parseContent = (content: any) => {
  content = content.toString("utf8");
  try {
    return JSON.parse(content);
  } catch (e) {
    return YAML.safeLoad(content);
  }
};

const dereference = (json: any, baseDir: string): Promise<any> => {
  return RefParser.dereference(`${baseDir}/`, json, {
    dereference: {
      circular: "ignore",
    },
  });
};

const bundle = (json: any): Promise<any> => {
  return RefParser.bundle(json, {
    dereference: {
      circular: "ignore",
    },
  });
};

const bundler = (filePath: string, baseDir: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    let parsedContent;

    getFileContent(filePath)
      .then((content) => {
        try {
          parsedContent = parseContent(content);
        } catch (e) {
          reject("Can not parse the content of the OpenAPI specification file");
        }

        dereference(parsedContent, baseDir)
          .then((dereferencedJSON) => {
            bundle(dereferencedJSON)
              .then((bundledJSON) => {
                validator
                  .validate(bundledJSON, { anchors: true })
                  .then((options) => {
                    if (options.valid) {
                      resolve(bundledJSON);
                    }
                  })
                  .catch(() => {
                    reject("Invalid OpenAPI file");
                  });
              })
              .catch(() => {
                reject(
                  "Can not bundle the JSON obtained from the content of the OpenAPI specification file"
                );
              });
          })
          .catch(() => {
            reject(
              "Can not dereference the JSON obtained from the content of the OpenAPI specification file"
            );
          });
      })
      .catch(() => {
        reject("Can not load the content of the OpenAPI specification file");
      });
  });
};

export default bundler;
