import convert from '../dist';

describe("convert()", () => {
  it('should execute', () => {
    expect(convert('../example/petstore.json', './build')).resolves.toBeUndefined();
  });
});
