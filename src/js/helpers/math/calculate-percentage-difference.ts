export function calculatePercentageDifference(_a: number, _b: number): number {
  const a = Number.isNaN(_a) || !Number.isFinite(_a) ? 0 : _a;
  const b = Number.isNaN(_b) || !Number.isFinite(_b) ? 0 : _b;

  // If both numbers are zero, there's no difference
  if (a === 0 && b === 0) {
    return 0;
  }

  // If one number is zero and the other isn't, it's a 100% difference
  if (a === 0 || b === 0) {
    return 100;
  }

  // If the numbers have opposite signs
  if ((a > 0 && b < 0) || (a < 0 && b > 0)) {
    return 100;
  }

  const difference = Math.abs(a - b);
  const average = (Math.abs(a) + Math.abs(b)) / 2;

  return Math.min(100, (difference / average) * 100);
}
