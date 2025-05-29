export class PathNotFoundError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "PathNotFoundError";
    Object.setPrototypeOf(this, PathNotFoundError.prototype);
  }
}

export class UnableOverwriteError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "UnableOverwriteError";
    Object.setPrototypeOf(this, UnableOverwriteError.prototype);
  }
}

export class UnidentifiedTemplateError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "UnidentifiedTemplateError";
    Object.setPrototypeOf(this, UnidentifiedTemplateError.prototype);
  }
}

export class UnidentifiedFrameworkError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "UnidentifiedFrameworkError";
    Object.setPrototypeOf(this, UnidentifiedFrameworkError.prototype);
  }
}
