const convert = require('../dist').default;
const bundler = require('../dist/bundler').default;
const OpenAPISampler = require('openapi-sampler');

console.log(process.cwd())
/*
bundler('example/petstore.json', './')
  .then(spec => {
    //console.log(OpenAPISampler.sample(spec.components.schemas.Pet, {}, spec));
  })
  .catch(err => {
    console.error(err);
  })*/

convert('example/petstore.json', { outPath: './build', snippetTargets: ["node", "python"] })
  .then(() => {
    console.log("Finished.")
  })
  .catch(err => {
    console.error(err);
  })
