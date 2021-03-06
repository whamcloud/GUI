import angular from "../../../angular-mock-setup.js";
import filterModule from "../../../../source/iml/filters/filters-module";

describe("Round filter", () => {
  let round;

  beforeEach(angular.mock.module(filterModule));

  beforeEach(
    angular.mock.inject($filter => {
      round = $filter("round");
    })
  );

  const tests = [
    { input: 1000.232332, expected: 1000 },
    { input: 1000.232332, places: 2, expected: 1000.23 },
    { input: 1000.235, places: 2, expected: 1000.24 },
    { input: 0.9999923231, places: 3, expected: 1 },
    { input: 1.02358888884e3, places: 3, expected: 1023.589 },
    { input: 1.02358888884e3, expected: 1024 },
    { input: 0.05 + 0.01, places: 2, expected: 0.06 },
    { input: 0.05 + 0.01, expected: 0 },
    { input: "foo", expected: "foo" },
    { input: "foo", places: 5, expected: "foo" }
  ];

  tests.forEach(function runTest(test) {
    it(getDescription(test.input, test.expected), function expectFormat() {
      const result = round(test.input, test.places);

      expect(test.expected).toEqual(result);
    });
  });

  function getDescription(input, expected) {
    return `should convert ${input} to ${expected}`;
  }
});
