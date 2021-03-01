const convert = require('../dist').default;
const bundler = require('../dist/bundler').default;
const OpenAPISampler = require('openapi-sampler');

bundler('../example/petstore.json', './')
  .then(spec => {
    console.log(OpenAPISampler.sample(spec.components.schemas.Pet, {}, spec));
  })
  .catch(err => {
    console.error(err);
  })

convert('../example/petstore.json', './build')
  .then(() => {
    console.log("Finihsed.")
  })
  .catch(err => {
    console.error(err);
  })
