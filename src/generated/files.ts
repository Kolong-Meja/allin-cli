import { PathNotExistError } from "../exceptions/PathNotExistError";
import { _basePath } from "../constants/default";
import fs from "fs";

export function _scanPath(path: string) {
  if (!fs.existsSync(path))
    throw new PathNotExistError(
      `${path} is not exist on ${_basePath} directory.`
    );
  return;
}
