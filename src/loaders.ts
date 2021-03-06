"use strict";

import * as fs from "fs";
import * as path from "path";
import * as Handlebars from "handlebars";

const walkSync = (partialsPath: string, filelist: string[] = []): string[] => {
  fs.readdirSync(partialsPath).forEach((file) => {
    filelist = fs.statSync(path.join(partialsPath, file)).isDirectory()
      ? walkSync(path.join(partialsPath, file), filelist)
      : filelist.concat(path.join(partialsPath, file));
  });
  return filelist;
};

const loaders = {
  loadPartials: (partialsPath: string) => {
    if (fs.existsSync(partialsPath)) {
      const filelist = walkSync(partialsPath);
      if (filelist.length > 0) {
        Object.values(filelist).forEach((filename) => {
          const matches = /^([^.]+).hbs$/.exec(path.basename(filename));
          if (!matches) {
            return;
          }
          const name = matches[1];
          const template = fs.readFileSync(filename, "utf8");
          Handlebars.registerPartial(name, template);
        });
      }
    }
  },
  loadHelpers: (helpersPath: string) => {
    if (fs.existsSync(helpersPath)) {
      const filelist = walkSync(helpersPath);
      if (filelist.length > 0) {
        Object.values(filelist).forEach((filename) => {
          const matches = /^([^.]+).js$/.exec(path.basename(filename));
          if (!matches) {
            return;
          }
          const name = matches[1];
          const helper = require(filename).default;
          Handlebars.registerHelper(name, helper);
        });
      }
    }
  },
};

export default loaders;
