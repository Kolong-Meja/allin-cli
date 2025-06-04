import fs from "fs";
import {
  PathNotFoundError,
  UnableOverwriteError,
  UnidentifiedFrameworkError,
  UnidentifiedTemplateError,
} from "./custom.js";
import chalk from "chalk";
import path from "path";

export function _isPathExist(path: string): void {
  if (!fs.existsSync(path))
    throw new PathNotFoundError(
      `⛔️ ${chalk.bold("Path not found")}: ${chalk.bold(
        path
      )} path is not exist.`
    );
  return;
}

export function _isProjectExist(basePath: string, projectName: string): void {
  const _targetPath = path.join(basePath, projectName);

  if (fs.existsSync(_targetPath) && fs.statSync(_targetPath).isDirectory())
    throw new UnableOverwriteError(
      `⛔️ ${chalk.bold("Unable to overwrite")}: ${chalk.bold(
        _targetPath
      )} is exist and cannot be overwritten.`
    );
  return;
}

export function _isTemplateModelExist(
  answer: string,
  ...templates: string[]
): void {
  if (!templates.includes(answer)) {
    throw new UnidentifiedTemplateError(
      `⛔️ ${chalk.bold("Unidentified template model")}: ${chalk.bold(
        answer
      )} template model is not found.`
    );
  }
  return;
}

export function _isFrameworkProjectExist(
  answer: string,
  ...frameworks: string[]
): void {
  if (!frameworks.includes(answer)) {
    throw new UnidentifiedFrameworkError(
      `⛔️ ${chalk.bold("Unidentified framework project")}: ${chalk.bold(
        answer
      )} framework project is not found.`
    );
  }
  return;
}
