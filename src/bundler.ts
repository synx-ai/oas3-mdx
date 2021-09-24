"use strict";

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
import * as http from "http";
import * as https from "https";
import * as YAML from "js-yaml";
import * as RefParser from "json-schema-ref-parser";
import * as validator from "oas-validator";

/**
 * Callbak to handle an url response
 * @param   {string} url      the spec url
 * @returns {any}             the retreived content
 */
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

/**
 * Retreive spec content from an url
 * @param   {string} url      the spec url
 * @returns {any}             the retreived content
 */
const getContentFromURL = (url: string) => {
  return new Promise((resolve, reject) => {
    if (url.startsWith("http")) {
      let protocol = url.startsWith("https:") ? https : http;

      protocol
        .get(url, (res) => {
          handleHTTPResponse(url, res, resolve, reject);
        })
        .on("error", reject);
    } else {
      reject("Protocol not supported.");
    }
  });
};

/**
 * Retreive spec content from a file or url
 * @param   {string} filePath the spec path or url
 * @returns {any}             the retreived content
 */
const getFileContent = (filePath: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // try to load from a local dir
    fs.readFile(filePath, (err, content) => {
      if (err) {
        // on error, try to load from url
        getContentFromURL(filePath)
          .then((content) => {
            resolve(content);
          })
          .catch(reject);
        return;
      }

      // return content
      resolve(content);
    });
  });
};

/**
 * Parses a JSON or YAML formated spec
 * @param   {any}   content the spec content
 * @returns {any}           the spec as an object
 */
const parseContent = (content: any) => {
  content = content.toString("utf8");
  try {
    return JSON.parse(content);
  } catch (e) {
    return YAML.load(content);
  }
};

/**
 * Dereference schemas from the spec
 * @param   {any}    json    the json to dereference
 * @param   {string} baseDir baseDir for references
 * @returns {Promise<any>}   a promise of an object representing the dereferenced spec
 */
const dereference = (json: any, baseDir: string): Promise<any> => {
  return RefParser.dereference(`${baseDir}/`, json, {
    dereference: {
      circular: "ignore",
    },
  });
};

/**
 * Bundle the final spec
 * @param   {any}    json   the json to bundle
 * @returns {Promise<any>}  a promise of an object representing the bundled spec
 */
const bundle = (json: any): Promise<any> => {
  return RefParser.bundle(json, {
    dereference: {
      circular: "ignore",
    },
  });
};

/**
 * Load, transform and bundle an OpenAPI spec file
 * @param   {string}    filePath specification file
 * @param   {string}    baseDir base path for the API
 * @returns {Promise<any>}  a promise of an object representing the spec
 */
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
                  .catch((err) => {
                    reject("Invalid OpenAPI file: " + err.message);
                  });
              })
              .catch(() => {
                reject("Can not bundle the JSON obtained from the content of the OpenAPI specification file");
              });
          })
          .catch(() => {
            reject("Can not dereference the JSON obtained from the content of the OpenAPI specification file");
          });
      })
      .catch(() => {
        reject("Can not load the content of the OpenAPI specification file");
      });
  });
};

export default bundler;
