import convert from "../dist";

const fileThatExists = "./example/petstore.json";
const fileThatNotExists = "./example/fishstores.json";
const fileThatExistsButIsWrong = "./package.json";
const fileThatExistsInAnotherFormat = "./readme.md";

const urlThatExists = "https://petstore3.swagger.io/api/v3/openapi.json";
const urlThatNotExists = "https://petstore3.synx.io/api/v3/openapi.json";


describe("convert()", () => {


  it("should execute from file", () => {
    return expect(convert(fileThatExists, "./build")).resolves.toBeUndefined();
  });

  it("should reject from wrong template dir", () => {
    return expect(convert(fileThatExists, "./build", "./no-templates")).rejects.toBe("Can not find templates path");
  });

  it("should reject from file", () => {
    return expect(convert(fileThatNotExists, "./build")).rejects.toBe("Can not load the content of the OpenAPI specification file");
  });

  it("should reject from wrong file", () => {
    return expect(convert(fileThatExistsButIsWrong, "./build")).rejects.toMatch("Invalid OpenAPI file");
  });

  it("should reject from wrong file", () => {
    return expect(convert(fileThatExistsInAnotherFormat, "./build")).rejects.toMatch("Can not parse the content");
  });

  it("should execute from url", () => {
    return expect(convert(urlThatExists, "./build")).resolves.toBeUndefined();
  });

  it("should reject from url", () => {
    return expect(convert(urlThatNotExists, "./build")).rejects.toBe("Can not load the content of the OpenAPI specification file");
  });

});
