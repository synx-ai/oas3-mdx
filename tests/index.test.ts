import convert from '../dist';

test('Load library', () => {
  expect(convert('../example/petstore.json', './build')).toBe(true);
});
