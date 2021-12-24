export const amount = value => Number(value) && Number(value) > 0;
export const maxDecimalPoints = points => value => {
  const splittedValue = String(value).split('.');
  if (splittedValue.length < 2) {
    return true;
  }
  return splittedValue[splittedValue.length - 1].length <= Number(points);
};
export const requiredToBeTrue = value => value === true;
export const requiredAtLeastOne = value => !!value.length;

export * from '@vuelidate/validators';
