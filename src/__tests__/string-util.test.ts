/**
 * __tests__/string-util.test.ts
 */
import { jest } from '@jest/globals';

import {
  __titleCase,
  __renewProjectName,
  __renewStringIntoTitleCase,
  __renewStringsIntoTitleCase,
} from '@/utils/string.js';

describe('String Util Functions', () => {
  describe('__titleCase()', () => {
    it('capitalizes the first letter and lowercases the rest', () => {
      expect(__titleCase('hello')).toBe('Hello');
      expect(__titleCase('WORLD')).toBe('World');
      expect(__titleCase('mIxEd')).toBe('Mixed');
    });

    it('handles single-character strings', () => {
      expect(__titleCase('a')).toBe('A');
      expect(__titleCase('Z')).toBe('Z');
    });

    it('returns empty string when given an empty string', () => {
      expect(__titleCase('')).toBe('');
    });
  });

  describe('__renewProjectName()', () => {
    it('converts space-separated names to kebab-case lowercase', () => {
      expect(__renewProjectName('My App')).toBe('my-app');
      expect(__renewProjectName(' multiple   Spaces Here ')).toBe(
        'multiple---spaces-here',
      );
    });

    it('converts camelCase and PascalCase names to kebab-case', () => {
      expect(__renewProjectName('myProjectName')).toBe('my-project-name');
      expect(__renewProjectName('MyProjectName')).toBe('my-project-name');
      expect(__renewProjectName('XMLHttpRequest')).toBe('x-m-l-http-request');
    });

    it('returns lowercase single word unchanged (no spaces, no uppercase splits)', () => {
      expect(__renewProjectName('app')).toBe('app');
    });

    it('trims leading/trailing whitespace before processing', () => {
      expect(__renewProjectName('  LeadingSpace')).toBe('leading-space');
      expect(__renewProjectName('TrailingSpace  ')).toBe('trailing-space');
    });
  });

  describe('__renewStringIntoTitleCase()', () => {
    it('title-cases each word in a single string', () => {
      expect(__renewStringIntoTitleCase('hello world')).toBe('Hello World');
      expect(__renewStringIntoTitleCase('MULTIPLE words HERE')).toBe(
        'Multiple Words Here',
      );
    });

    it('handles single-word inputs', () => {
      expect(__renewStringIntoTitleCase('solid')).toBe('Solid');
    });

    it('preserves multiple spaces as separators', () => {
      expect(__renewStringIntoTitleCase('foo  bar')).toBe('Foo  Bar');
    });
  });

  describe('__renewStringsIntoTitleCase()', () => {
    it('applies title case to each string in an array', () => {
      const input = ['hello world', 'foo bar', 'MixedCase Example'];
      const expected = ['Hello World', 'Foo Bar', 'Mixedcase Example'];
      expect(__renewStringsIntoTitleCase(input)).toEqual(expected);
    });

    it('returns an empty array when given an empty array', () => {
      expect(__renewStringsIntoTitleCase([])).toEqual([]);
    });
  });
});
