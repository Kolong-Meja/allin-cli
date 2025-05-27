export const _titleCase = <T extends string>(s: T) =>
  (s.charAt(0).toLocaleUpperCase("en-US") +
    s.slice(1).toLocaleLowerCase("en-US")) as Capitalize<typeof s>;

export const _renewalProjectName = <T extends string>(s: T) => {
  let result: string;

  if (s.trim().indexOf(" ") !== -1) {
    result = s.toLocaleLowerCase("en-US").split(" ").join("-");
  } else {
    result = s
      .split(/(?=[A-Z])/)
      .join("-")
      .toLocaleLowerCase("en-US");
  }

  return result;
};

export const _renewalStringIntoTitleCase = <T extends string>(s: T) => {
  return s
    .split(" ")
    .map((a) => _titleCase(a))
    .join(" ");
};

export const _renewalStringsIntoTitleCase = <T extends string[]>(s: T) => {
  return s.map((a) => {
    return a
      .split(" ")
      .map((b) => _titleCase(b))
      .join(" ");
  });
};
