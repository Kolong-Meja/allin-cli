export const __titleCase = <T extends string>(s: T) =>
  (s.charAt(0).toLocaleUpperCase('en-US') +
    s.slice(1).toLocaleLowerCase('en-US')) as Capitalize<typeof s>;

export const __renewProjectName = <T extends string>(s: T) => {
  const trimmed = s.trim().replace(/^[^a-zA-Z0-9]/, '');
  const result = trimmed.includes(' ')
    ? trimmed.toLocaleLowerCase('en-US').split(' ').join('-')
    : trimmed
        .split(/(?=[A-Z])|[.\-_]/)
        .filter(Boolean)
        .join('-')
        .toLocaleLowerCase('en-US');

  return result;
};

export const __detectProjectType = <T extends string>(s: T) => {
  const result = s.match(/\b(backend|frontend)\b/i);
  if (!result) return null;
  return result[0].toLowerCase();
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
