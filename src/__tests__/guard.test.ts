/**
 * __tests__/guard.test.ts
 */
import { jest } from '@jest/globals';
import {
  isBackend,
  isFrontend,
  isNull,
  isUndefined,
  hasValue,
} from '@/utils/guard.js';

describe('Testing guard.ts util functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isUndefined()', () => {
    it('returns true for undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    it('returns false for non-undefined values', () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
      expect(isUndefined('')).toBe(false);
      expect(isUndefined('frontend')).toBe(false);
    });
  });

  describe('isNull()', () => {
    it('returns true for null', () => {
      expect(isNull(null)).toBe(true);
    });

    it('returns false for non-null values', () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);
      expect(isNull('')).toBe(false);
      expect(isNull('backend')).toBe(false);
    });
  });

  describe('hasValue()', () => {
    it('returns true for non-empty strings after trim', () => {
      expect(hasValue('a')).toBe(true);
      expect(hasValue('  a  ')).toBe(true);
      expect(hasValue('0')).toBe(true);
    });

    it('returns false for empty, whitespace-only, non-string or undefined/null', () => {
      expect(hasValue('')).toBe(false);
      expect(hasValue('   ')).toBe(false);
      expect(hasValue(undefined)).toBe(false);
      expect(hasValue(null as any)).toBe(false);
      expect(hasValue(0 as any)).toBe(false);
    });
  });

  describe('isFrontend()', () => {
    it('returns true when value is exactly "frontend"', () => {
      expect(isFrontend('frontend')).toBe(true);
    });

    it('returns false for other values (case-sensitive and type-strict)', () => {
      expect(isFrontend('Frontend')).toBe(false);
      expect(isFrontend('backend')).toBe(false);
      expect(isFrontend('')).toBe(false);
      expect(isFrontend(null as any)).toBe(false);
      expect(isFrontend(undefined)).toBe(false);
    });
  });

  describe('isBackend()', () => {
    it('returns true when value is exactly "backend"', () => {
      expect(isBackend('backend')).toBe(true);
    });

    it('returns false for other values (case-sensitive and type-strict)', () => {
      expect(isBackend('Backend')).toBe(false);
      expect(isBackend('frontend')).toBe(false);
      expect(isBackend('')).toBe(false);
      expect(isBackend(null as any)).toBe(false);
      expect(isBackend(undefined)).toBe(false);
    });
  });
});
