/**
 * __tests__/guard.test.ts
 */
import { isBackend, isFrontend, isNull, isUndefined } from '@/utils/guard.js';
import { jest } from '@jest/globals';

describe('Testing guard.ts util functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Testing isUndefined() function.', () => {
    it('should return true for undefined', () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    it('should return false for non-undefined values', () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined(0)).toBe(false);
      expect(isUndefined('')).toBe(false);
      expect(isUndefined('frontend')).toBe(false);
    });
  });

  describe('Testing isNull() function.', () => {
    it('should return true for null', () => {
      expect(isNull(null)).toBe(true);
    });

    it('should return false for non-null values', () => {
      expect(isNull(undefined)).toBe(false);
      expect(isNull(0)).toBe(false);
      expect(isNull('')).toBe(false);
      expect(isNull('backend')).toBe(false);
    });
  });

  describe('Testing isFrontend() function.', () => {
    it('should return true when value is "frontend"', () => {
      expect(isFrontend('frontend')).toBe(true);
    });

    it('should return false for other values', () => {
      expect(isFrontend('backend')).toBe(false);
      expect(isFrontend('')).toBe(false);
      expect(isFrontend(null)).toBe(false);
      expect(isFrontend(undefined)).toBe(false);
    });
  });

  describe('Testing isBackend() function.', () => {
    it('should return true when value is "backend"', () => {
      expect(isBackend('backend')).toBe(true);
    });

    it('should return false for other values', () => {
      expect(isBackend('frontend')).toBe(false);
      expect(isBackend('')).toBe(false);
      expect(isBackend(null)).toBe(false);
      expect(isBackend(undefined)).toBe(false);
    });
  });
});
