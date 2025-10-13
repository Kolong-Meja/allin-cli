/**
 * __tests__/string-util.test.ts
 */
import { jest } from '@jest/globals';

import {
  __titleCase,
  __renewProjectName,
  __renewStringIntoTitleCase,
  __renewStringsIntoTitleCase,
  __detectProjectTypeFromInput,
  __sanitizeProjectName,
  __isValidProjectName,
  __isLookLikePath,
  __isContainHarassmentWords,
} from '@/utils/string.js';

describe('string.ts utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('__titleCase()', () => {
    it('capitalizes first letter and lowercases the rest', () => {
      expect(__titleCase('hello')).toBe('Hello');
      expect(__titleCase('WORLD')).toBe('World');
      expect(__titleCase('mIxEd')).toBe('Mixed');
    });

    it('handles single-character strings and empty string', () => {
      expect(__titleCase('a')).toBe('A');
      expect(__titleCase('Z')).toBe('Z');
      expect(__titleCase('')).toBe('');
    });
  });

  describe('__renewProjectName()', () => {
    it('converts space-separated names to kebab-case preserving multiple spaces as multiple hyphens', () => {
      expect(__renewProjectName('My App')).toBe('my-app');
      expect(__renewProjectName(' multiple   Spaces Here ')).toBe(
        'multiple---spaces-here',
      );
    });

    it('converts camelCase and PascalCase names to kebab-case by splitting before uppercase', () => {
      expect(__renewProjectName('myProjectName')).toBe('my-project-name');
      expect(__renewProjectName('MyProjectName')).toBe('my-project-name');
      expect(__renewProjectName('XMLHttpRequest')).toBe('x-m-l-http-request');
    });

    it('returns lowercase single word unchanged', () => {
      expect(__renewProjectName('app')).toBe('app');
    });

    it('trims leading/trailing whitespace before processing', () => {
      expect(__renewProjectName('  LeadingSpace')).toBe('leading-space');
      expect(__renewProjectName('TrailingSpace  ')).toBe('trailing-space');
    });

    it('removes all leading non-alphanumeric characters', () => {
      // Implementation removes any leading run of non-alnum characters
      expect(__renewProjectName('!hello')).toBe('hello');
      expect(__renewProjectName('!!hello')).toBe('hello');
    });
  });

  describe('__renewStringIntoTitleCase()', () => {
    it('title-cases each word and preserves multiple spaces', () => {
      expect(__renewStringIntoTitleCase('hello world')).toBe('Hello World');
      expect(__renewStringIntoTitleCase('MULTIPLE words HERE')).toBe(
        'Multiple Words Here',
      );
      expect(__renewStringIntoTitleCase('foo  bar')).toBe('Foo  Bar');
      expect(__renewStringIntoTitleCase('solid')).toBe('Solid');
    });
  });

  describe('__renewStringsIntoTitleCase()', () => {
    it('applies title case to each string in array', () => {
      const input = ['hello world', 'foo bar', 'MixedCase Example'];
      const expected = ['Hello World', 'Foo Bar', 'Mixedcase Example'];
      expect(__renewStringsIntoTitleCase(input)).toEqual(expected);
    });

    it('returns empty array when given empty array', () => {
      expect(__renewStringsIntoTitleCase([])).toEqual([]);
    });
  });

  describe('__detectProjectTypeFromInput()', () => {
    it('returns "backend" when the word backend exists (case-insensitive with separators)', () => {
      expect(__detectProjectTypeFromInput('backend')).toBe('backend');
      expect(__detectProjectTypeFromInput('BACKEND')).toBe('backend');
      expect(__detectProjectTypeFromInput('awesome BACKEND tool')).toBe(
        'backend',
      );
      expect(__detectProjectTypeFromInput('  backend  ')).toBe('backend');
    });

    it('returns "frontend" when the word frontend exists (case-insensitive with separators)', () => {
      expect(__detectProjectTypeFromInput('frontend')).toBe('frontend');
      expect(__detectProjectTypeFromInput('FRONTEND')).toBe('frontend');
      expect(__detectProjectTypeFromInput('the FRONTEND module')).toBe(
        'frontend',
      );
      expect(__detectProjectTypeFromInput('  frontend  ')).toBe('frontend');
    });

    it('does not detect words inside camelCase or concatenated words (per implementation)', () => {
      expect(__detectProjectTypeFromInput('MyBackendService')).toBeNull();
      expect(__detectProjectTypeFromInput('myfrontendtool')).toBeNull();
      expect(__detectProjectTypeFromInput('123backendify')).toBeNull();
      expect(__detectProjectTypeFromInput('frontenders')).toBeNull();
    });
  });

  describe('__sanitizeProjectName()', () => {
    it('normalizes, trims, converts spaces to hyphens and lowercases', () => {
      expect(__sanitizeProjectName(' My Project ')).toBe('my-project');
    });

    it('removes control chars and disallowed characters', () => {
      expect(__sanitizeProjectName('\x00Bad\u0007Name')).toBe('badname');
      // trailing non-alphanumeric characters are stripped by final regex => 'name-with'
      expect(__sanitizeProjectName('Name With !@#')).toBe('name-with');
    });

    it('respects maxLen and returns truncated result', () => {
      const long = 'A'.repeat(100);
      const sanitized = __sanitizeProjectName(long, 10);
      expect(sanitized.length).toBeLessThanOrEqual(10);
    });
  });

  describe('__isValidProjectName()', () => {
    it('validates according to regex: must start with a lowercase letter and only a-z0-9_-', () => {
      expect(__isValidProjectName('a')).toBe(true);
      expect(__isValidProjectName('a1_b-c')).toBe(true);
      expect(__isValidProjectName('1abc')).toBe(false);
      expect(__isValidProjectName('Aabc')).toBe(false);
      expect(__isValidProjectName('')).toBe(false);
    });

    it('respects minLen and maxLen params', () => {
      expect(__isValidProjectName('ab', 3)).toBe(false);
      expect(__isValidProjectName('abc', 1, 2)).toBe(false);
    });
  });

  describe('__isLookLikePath()', () => {
    it('detects UNIX/Windows/relative path patterns', () => {
      expect(__isLookLikePath('/etc/passwd')).toBe(true);
      expect(__isLookLikePath('\\windows\\path')).toBe(true);
      expect(__isLookLikePath('~/.config')).toBe(true);
      expect(__isLookLikePath('C:\\Program Files\\')).toBe(true);
      expect(__isLookLikePath('../relative/path')).toBe(true);
      expect(__isLookLikePath('./local')).toBe(true);
      expect(__isLookLikePath('simple-filename')).toBe(false);
    });
  });

  describe('__isContainHarassmentWords()', () => {
    it('is a simple includes check (case-sensitive)', () => {
      const words = ['bad', 'evil'];
      expect(__isContainHarassmentWords('this is bad', words)).toBe(true);
      expect(__isContainHarassmentWords('this is Bad', words)).toBe(false);
      expect(__isContainHarassmentWords('clean text', words)).toBe(false);
    });
  });
});
