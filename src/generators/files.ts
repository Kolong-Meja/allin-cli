import {
  PathNotFoundError,
  UnableOverwriteError,
  UnidentifiedTemplateError,
} from "../exceptions/custom.js";
import {
  _basePath,
  _defaultBackendFrameworks,
  _defaultFrontendFrameworks,
  _defaultFullStackFrameworks,
  _defaultProjectTypes,
} from "../constants/default.js";
import fs from "fs";
import path from "path";
import { _renewalProjectName, _titleCase } from "../utils/string.js";
import ora from "ora";
import chalk from "chalk";

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
    throw new UnidentifiedTemplateError(
      `⛔️ ${chalk.bold("Unidentified framework project")}: ${chalk.bold(
        answer
      )} framework project is not found.`
    );
  }
  return;
}

export function _getProjects(targetPath: string): void {
  const spinner = ora({
    text: "Start searching the templates 🔎...",
    spinner: "dots",
    color: "green",
    interval: 100,
  });

  const start = performance.now();
  spinner.start();

  try {
    const _dirPath = path.join(_basePath, targetPath);
    _isPathExist(_dirPath);

    const _files = fs.readdirSync(_dirPath, {
      withFileTypes: true,
    });
    const _mainFolders = _files.filter((v) => v.isDirectory());

    for (const f of _mainFolders) {
      console.group(`\n${_titleCase(f.name)} Projects ↘️`);

      const _targetSubPath = path.join(_dirPath, f.name);
      const _subFiles = fs.readdirSync(_targetSubPath, {
        withFileTypes: true,
      });
      const _mainSubFolders = _subFiles.filter((w) => w.isDirectory());

      console.table(_mainSubFolders.flatMap((f) => f.name));
      console.groupEnd();
    }

    const end = performance.now();
    spinner.succeed(`✅ All done! ${(end - start).toFixed(3)} ms`);
  } catch (error: any) {
    let errorMessage =
      error instanceof Error ? error.message : "⛔️ An unknown error occurred.";
    spinner.fail("⛔️ Failed to generate...\n");

    if (error instanceof PathNotFoundError) {
      errorMessage = error.message;
    }

    console.error(errorMessage);
  } finally {
    spinner.clear();
  }
}

export function _getProjectsByName(targetPath: string, template: string): void {
  const spinner = ora({
    text: `Start searching the ${_titleCase(template)} templates 🔎...`,
    spinner: "dots",
    color: "green",
    interval: 100,
  });

  const start = performance.now();
  spinner.start();

  try {
    const _dirPath = path.join(_basePath, targetPath, template);
    _isPathExist(_dirPath);

    const _files = fs.readdirSync(_dirPath, {
      withFileTypes: true,
    });
    const _mainFolders = _files.filter((v) => v.isDirectory());

    console.group(`\n${_titleCase(template)} Templates ↘️`);
    console.table(_mainFolders.flatMap((f) => f.name));
    console.groupEnd();

    const end = performance.now();
    spinner.succeed(`✅ All done! ${(end - start).toFixed(3)} ms`);
  } catch (error: unknown) {
    let errorMessage =
      error instanceof Error ? error.message : "⛔️ An unknown error occurred.";
    spinner.fail("⛔️ Failed to generate...\n");

    if (error instanceof PathNotFoundError) {
      errorMessage = error.message;
    }

    console.error(errorMessage);
  } finally {
    spinner.clear();
  }
}
