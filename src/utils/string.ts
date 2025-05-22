export const titleCase = <T extends string>(s: T) =>
  (s.charAt(0).toLocaleUpperCase("en-US") +
    s.slice(1).toLocaleLowerCase("en-US")) as Capitalize<typeof s>;

export const renewalProjectName = <T extends string>(s: T) => {
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

export const renewalStringIntoTitleCase = <T extends string>(s: T) => {
  return s
    .split(" ")
    .map((a) => titleCase(a))
    .join(" ");
};

export const renewalStringsIntoTitleCase = <T extends string[]>(s: T) => {
  return s.map((a) => {
    return a
      .split(" ")
      .map((b) => titleCase(b))
      .join(" ");
  });
};
