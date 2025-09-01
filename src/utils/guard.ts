import type { Mixed } from '@/types/general.js';

export function isUndefined(val: Mixed): val is undefined {
  return typeof val === 'undefined';
}

export function isNull(val: Mixed): val is null {
  return val === null;
}
