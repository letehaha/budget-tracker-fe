export function deepFreeze<T>(o: T): T {
  Object.freeze(o);

  const oIsFunction = typeof o === "function";
  const hasOwnProp = Object.prototype.hasOwnProperty;

  Object.getOwnPropertyNames(o).forEach((prop) => {
    if (
      hasOwnProp.call(o, prop) &&
      (oIsFunction ? prop !== "caller" && prop !== "callee" && prop !== "arguments" : true) &&
      o[prop] !== null &&
      (typeof o[prop] === "object" || typeof o[prop] === "function") &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop]);
    }
  });

  return o;
}
