import { calculatePercentageDifference } from "./calculate-percentage-difference";

describe("calculatePercentageDifference", () => {
  test.each([
    [0, 0, 0, "returns 0 when both numbers are 0"],
    [0, 10, 100, "returns 100 when one number is 0"],
    [10, 0, 100, "returns 100 when one number is 0"],
    [20, -20, 100, "returns 100 when numbers have opposite signs"],
    [-15, 15, 100, "returns 100 when numbers have opposite signs"],
    [100, 90, 10.53, "calculates correct percentage for positive numbers"],
    [50, 40, 22.22, "calculates correct percentage for positive numbers"],
    [-100, -90, 10.53, "calculates correct percentage for negative numbers"],
    [-50, -40, 22.22, "calculates correct percentage for negative numbers"],
    [-10, 10, 100, "calculates correct percentage for mixed positive and negative numbers"],
    [1, 1000000, 100, "returns 100 for very large differences"],
    [-1000000, 1, 100, "returns 100 for very large differences"],
    [0.1, 0.2, 66.67, "handles floating point numbers"],
    [1.5, 2.5, 50, "handles floating point numbers"],
    [NaN, 10, 100, "treats NaN as 0"],
    [10, NaN, 100, "treats NaN as 0"],
    [NaN, NaN, 0, "treats NaN as 0 (both NaN)"],
    [Infinity, 10, 100, "treats Infinity as 0"],
    [10, Infinity, 100, "treats Infinity as 0"],
    [Infinity, Infinity, 0, "treats Infinity as 0 (both Infinity)"],
    [-Infinity, 10, 100, "treats -Infinity as 0"],
    [10, -Infinity, 100, "treats -Infinity as 0"],
    [-Infinity, -Infinity, 0, "treats -Infinity as 0 (both -Infinity)"],
  ])("(%f, %f) = %f (%s)", (a, b, expected) => {
    expect(calculatePercentageDifference(a, b)).toBeCloseTo(expected, 2);
  });

  test("is symmetric", () => {
    const a = 10;
    const b = 20;
    expect(calculatePercentageDifference(a, b)).toBeCloseTo(calculatePercentageDifference(b, a), 5);
  });
});
