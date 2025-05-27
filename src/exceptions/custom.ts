export class PathNotExistError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "PathNotExistError";
  }
}

export class PathIsExistError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "PathIsExistError";
  }
}
