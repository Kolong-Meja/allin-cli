export function isUndefined(val: unknown): val is undefined {
  return typeof val === 'undefined';
}

export function isNull(val: unknown): val is null {
  return val === null;
}

export function hasValue(val?: string) {
  return typeof val === 'string' && val.trim().length > 0;
}

export function isFrontend(val: unknown): val is 'frontend' {
  return val === 'frontend';
}

export function isBackend(val: unknown): val is 'backend' {
  return val === 'backend';
}
