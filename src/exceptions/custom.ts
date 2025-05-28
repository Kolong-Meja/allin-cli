export class PathNotFoundError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "PathNotFoundError";
    Object.setPrototypeOf(this, PathNotFoundError.prototype);
  }
}

export class UnableOverwriteError extends TypeError {
  constructor(message: string | undefined) {
    super(message);
    this.name = "UnableOverwriteError";
    Object.setPrototypeOf(this, UnableOverwriteError.prototype);
  }
}
