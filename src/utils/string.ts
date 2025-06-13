export const __titleCase = <T extends string>(s: T) =>
  (s.charAt(0).toLocaleUpperCase('en-US') +
    s.slice(1).toLocaleLowerCase('en-US')) as Capitalize<typeof s>;

export const __renewProjectName = <T extends string>(s: T) => {
  let result: string;

  if (s.trim().indexOf(' ') !== -1) {
    result = s.toLocaleLowerCase('en-US').split(' ').join('-');
  } else {
    result = s
      .split(/(?=[A-Z])/)
      .join('-')
      .toLocaleLowerCase('en-US');
  }

  return result;
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
