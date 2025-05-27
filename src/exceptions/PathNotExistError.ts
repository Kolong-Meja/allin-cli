export class PathNotExistError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "PathNotExistError";
  }
}
