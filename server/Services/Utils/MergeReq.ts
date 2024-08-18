export function merge(
  target: Record<string, any>,
  source: Record<string, any>
) {
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
  return target;
}
