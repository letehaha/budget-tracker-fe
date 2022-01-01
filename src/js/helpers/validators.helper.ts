export const amount = (value: unknown): boolean => (
  Number(value) && Number(value) > 0
);
// eslint-disable-next-line vue/max-len
export const maxDecimalPoints = (points: number | string) => (value: unknown): boolean => {
  const splittedValue = String(value).split('.');
  if (splittedValue.length < 2) {
    return true;
  }
  return splittedValue[splittedValue.length - 1].length <= Number(points);
};
export const requiredToBeTrue = (value: unknown): boolean => value === true;
export const requiredAtLeastOne = (value: unknown[]): boolean => !!value.length;

export * from '@vuelidate/validators';
