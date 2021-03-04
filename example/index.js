const convert = require("../dist").default;

// converts to markdown using default template
convert("example/specs/simple.yaml", {
  outPath: "./example/build/md",
  snippetTargets: ["node"],
  prettierParser: "markdown",
})
  .then(() => {
    console.log(`File 'example/specs/simple.yaml' converted to markdown.`);
  })
  .catch((err) => {
    console.error(err);
  });

// converts to mdx using default template
convert("example/specs/simple.yaml", {
  outPath: "./example/build/mdx",
  snippetTargets: ["shell", "python"],
  templatesPath: "example/templates/mdx",
  prettierParser: "markdown",
})
  .then(() => {
    console.log(`File 'example/specs/simple.yaml' converted to mdx.`);
  })
  .catch((err) => {
    console.error(err);
  });

// converts a complex file
convert("example/specs/petstore.json", {
  outPath: "./build",
  snippetTargets: ["node", "python"]
})
  .then(() => {
    console.log("Finished.");
  })
  .catch((err) => {
    console.error(err);
  });
