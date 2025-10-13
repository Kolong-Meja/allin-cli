export const __titleCase = <T extends string>(s: T) =>
  (s.charAt(0).toLocaleUpperCase('en-US') +
    s.slice(1).toLocaleLowerCase('en-US')) as Capitalize<typeof s>;

export const __renewProjectName = <T extends string>(s: T) => {
  const trimmed = s.trim().replace(/^[^a-zA-Z0-9]+/, '');
  const result = trimmed.includes(' ')
    ? trimmed.toLocaleLowerCase('en-US').split(' ').join('-')
    : trimmed
        .split(/(?=[A-Z])|[.\-_]/)
        .filter(Boolean)
        .join('-')
        .toLocaleLowerCase('en-US');

  return result;
};

export const __detectProjectTypeFromInput = <T extends string>(s: T) => {
  const words = s
    .toLowerCase()
    .split(/(?=[A-Z])|[.\-_\s]/)
    .filter(Boolean);
  if (words.includes('backend')) return 'backend';
  if (words.includes('frontend')) return 'frontend';
  return null;
};

export const __renewStringIntoTitleCase = <T extends string>(s: T) => {
  return s
    .split(' ')
    .map((a) => __titleCase(a))
    .join(' ');
};

export const __renewStringsIntoTitleCase = <T extends string[]>(s: T) => {
  return s.map((a) => {
    return a
      .split(' ')
      .map((b) => __titleCase(b))
      .join(' ');
  });
};

export function __sanitizeProjectName(
  raw: string,
  maxLen: number = 70,
): string {
  if (!raw) return '';

  let str = raw.normalize('NFKC').trim();
  str = str.replace(/[\x00-\x1F\x7F]/g, '');
  str = str.replace(/\s+/g, '-');
  str = str.toLowerCase().slice(0, maxLen);
  str = str.replace(/[^a-z0-9_-]+/g, '');
  str = str.replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');

  return str;
}

export function __isValidProjectName(
  name: string,
  minLen: number = 1,
  maxLen: number = 70,
): boolean {
  if (!name) return false;
  if (name.length < minLen || name.length > maxLen) return false;

  return /^[a-z][a-z0-9_-]{0,69}$/.test(name);
}

export function __isLookLikePath(raw: string): boolean {
  if (!raw) return false;

  const s = raw.trim();

  if (!s) return false;

  if (s.startsWith('/') || s.startsWith('\\') || s.startsWith('~')) return true;

  if (/^[a-zA-Z]:[\\/]/.test(s)) return true;

  if (
    s.includes('/') ||
    s.includes('\\') ||
    s.includes('..') ||
    s.includes('./') ||
    s.includes('../')
  )
    return true;

  return false;
}

export function __isContainHarassmentWords(
  value: string,
  words: string[],
): boolean {
  const _isContainDirtyWord = words.some((e) => value.includes(e));

  return _isContainDirtyWord;
}
