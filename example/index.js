const convert = require('../dist').default;
const bundler = require('../dist/bundler').default;

bundler('../example/petstore.json', './')
  .then(scheme => {
    // console.log(scheme);
  })

convert('../example/petstore.json', './build')
  .then(() => {
    console.log("Finihsed.")
  })
  .catch(err => {
    console.error(err);
  })
//console.log(convert('../example/petstore.json', './build'));
