import {
  PathNotFoundError,
  UnableOverwriteError,
} from "../exceptions/custom.js";
import {
  _basePath,
  _defaultBackendFrameworks,
  _defaultFrontendFrameworks,
  _defaultFullStackFrameworks,
  _defaultProjectTypes,
} from "../constants/default.js";
import fs, { Dirent } from "fs";
import fse from "fs-extra";
import path from "path";
import { _renewalProjectName, _titleCase } from "../utils/string.js";
import ora from "ora";
import { OptionValues } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";

type _GenerateForProjectTypeProps = {
  sourcePath: string;
  desPath: string;
};

export function _isPathExist(path: string): void {
  if (!fs.existsSync(path))
    throw new PathNotFoundError(`${path} is not exist.`);
  return;
}

export function _isProjectExist(basePath: string, projectName: string): void {
  const _targetPath = path.join(basePath, projectName);

  if (fs.existsSync(_targetPath) && fs.statSync(_targetPath).isDirectory())
    throw new UnableOverwriteError(
      `Project is exist ${_targetPath}, and cannot be overwritten.`
    );
  return;
}

export function _getProjects(targetPath: string): void {
  const spinner = ora({
    text: "Start searching the templates...",
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
    spinner.succeed(`All done! ${(end - start).toFixed(3)} ms`);
  } catch (error: any) {
    let errorMessage =
      error instanceof Error ? error.message : "⛔️ An unknown error occurred.";
    spinner.fail("Failed to generate...\n");

    if (error instanceof PathNotFoundError) {
      errorMessage = `⛔️ ${chalk.bold(
        "Path not found"
      )}: destination folder are not exist.\n`;
    }

    console.error(errorMessage);
  } finally {
    spinner.clear();
  }
}

export function _getProjectsByName(targetPath: string, template: string): void {
  const spinner = ora({
    text: `Start searching the ${_titleCase(template)} templates...`,
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
    spinner.succeed(`All done! ${(end - start).toFixed(3)} ms`);
  } catch (error: unknown) {
    let errorMessage =
      error instanceof Error ? error.message : "⛔️ An unknown error occurred.";
    spinner.fail("Failed to generate...\n");

    if (error instanceof PathNotFoundError) {
      errorMessage = `⛔️ ${chalk.bold(
        "Path not found"
      )}: destination folder are not exist.\n`;
    }

    console.error(errorMessage);
  } finally {
    spinner.clear();
  }
}

export async function _generateListCommand(
  options: OptionValues
): Promise<void> {
  let _answers: { [x: string]: any } | undefined;

  if (options.template && options.all) {
    _getProjects("src/templates");
    return;
  }

  if (options.all) {
    _getProjects("src/templates");
    return;
  }

  if (options.template) {
    if (options.template !== "") {
      _getProjectsByName("src/templates", options.template);
      return;
    }
  } else {
    _answers = await inquirer.prompt([
      {
        name: "projectType",
        type: "select",
        message: "Choose project type:",
        choices: _defaultProjectTypes,
        default: "backend",
      },
    ]);
    _getProjectsByName("src/templates", _answers.projectType);
    return;
  }
}

export async function _generateUseCommand(
  answers: { [x: string]: any },
  options: OptionValues
): Promise<void> {
  let _generated: { folders: Dirent<string>[] } | undefined;
  let _sourcePath: string | undefined;
  let _desPath: string | undefined;

  const spinner = ora({
    text: "Start generating...",
    spinner: "dots",
    color: "green",
    interval: 100,
  });

  const start = performance.now();
  spinner.start();
  try {
    const _dirPath = options.template
      ? path.join(_basePath, "src/templates", options.template)
      : path.join(_basePath, "src/templates", answers.projectType);
    _isPathExist(_dirPath);

    const _files = fs.readdirSync(_dirPath, {
      withFileTypes: true,
    });

    switch (true) {
      case options.template === "backend" || answers.projectType === "backend":
        _generated = _generateForBackendUse(answers, _files);

        _sourcePath = path.join(
          _generated.folders[0].parentPath,
          _generated.folders[0].name
        );
        _desPath = path.join(options.dir, _generated.folders[0].name);
        _isPathExist(options.dir);
        _isProjectExist(options.dir, _generated.folders[0].name);

        await fse.copy(_sourcePath, _desPath);
        break;
      case options.template === "frontend" ||
        answers.projectType === "frontend":
        _generated = _generateForFrontendUse(answers, _files);

        _sourcePath = path.join(
          _generated.folders[0].parentPath,
          _generated.folders[0].name
        );
        _desPath = path.join(options.dir, _generated.folders[0].name);
        _isPathExist(options.dir);
        _isProjectExist(options.dir, _generated.folders[0].name);

        await fse.copy(_sourcePath, _desPath);
        break;
      case options.template === "fullstack" ||
        answers.projectType === "fullstack":
        _generated = _generateForFullStackUse(answers, _files);

        _sourcePath = path.join(
          _generated.folders[0].parentPath,
          _generated.folders[0].name
        );
        _desPath = path.join(options.dir, _generated.folders[0].name);
        _isPathExist(options.dir);
        _isProjectExist(options.dir, _generated.folders[0].name);

        await fse.copy(_sourcePath, _desPath);
        break;
    }

    const end = performance.now();
    spinner.succeed(`All done! ${(end - start).toFixed(3)} ms`);

    console.log(`You can check the project on ${chalk.bold(_desPath)}`);
  } catch (error: any) {
    let errorMessage =
      error instanceof Error ? error.message : "⛔️ An unknown error occurred.";
    spinner.fail("Failed to generate...\n");

    if (error instanceof PathNotFoundError) {
      errorMessage = `⛔️ ${chalk.bold(
        "Path not found"
      )}: destination folder are not exist.\n`;
    }

    if (error instanceof UnableOverwriteError) {
      errorMessage = `⛔️ ${chalk.bold(
        "Unable to overwrite"
      )}: project is exist and cannot be overwritten.\n`;
    }

    console.error(errorMessage);
  } finally {
    spinner.clear();
  }
}

export async function _generateCreateCommand(
  answers: { [x: string]: any },
  options: OptionValues
): Promise<void> {
  let _generated: _GenerateForProjectTypeProps | undefined;

  const spinner = ora({
    text: "Start generating...",
    spinner: "dots",
    color: "green",
    interval: 100,
  });

  const start = performance.now();
  spinner.start();

  try {
    const _dirPath = options.template
      ? path.join(_basePath, "src/templates", options.template)
      : path.join(_basePath, "src/templates", answers.projectType);
    _isPathExist(_dirPath);

    const _files = fs.readdirSync(_dirPath, {
      withFileTypes: true,
    });

    switch (true) {
      case options.template === "backend" || answers.projectType === "backend":
        _generated = _generateForBackend(answers, _files, options.dir);
        _isPathExist(options.dir);
        _isProjectExist(options.dir, answers.projectName);

        await fse.copy(_generated.sourcePath, _generated.desPath);
        break;
      case options.template === "frontend" ||
        answers.projectType === "frontend":
        _generated = _generateForFrontend(answers, _files, options.dir);
        _isPathExist(options.dir);
        _isProjectExist(options.dir, answers.projectName);

        await fse.copy(_generated.sourcePath, _generated.desPath, {
          overwrite: false,
          preserveTimestamps: true,
        });
        break;
      case options.template === "fullstack" ||
        answers.projectType === "fullstack":
        _generated = _generateForFullStack(answers, _files, options.dir);
        _isPathExist(options.dir);
        _isProjectExist(options.dir, answers.projectName);

        await fse.copy(_generated.sourcePath, _generated.desPath, {
          overwrite: false,
          preserveTimestamps: true,
        });
        break;
    }

    const end = performance.now();
    spinner.succeed(`All done! ${(end - start).toFixed(3)} ms`);

    console.log(
      `You can check the project on ${chalk.bold(_generated?.desPath)}`
    );
  } catch (error: any) {
    let errorMessage =
      error instanceof Error ? error.message : "⛔️ An unknown error occurred.";
    spinner.fail("Failed to generate...\n");

    if (error instanceof PathNotFoundError) {
      errorMessage = `⛔️ ${chalk.bold(
        "Path not found"
      )}: destination folder are not exist.\n`;
    }

    if (error instanceof UnableOverwriteError) {
      errorMessage = `⛔️ ${chalk.bold(
        "Unable to overwrite"
      )}: project is exist and cannot be overwritten.\n`;
    }

    console.error(errorMessage);
  } finally {
    spinner.clear();
  }
}

function _generateForBackendUse(
  answers: { [x: string]: any },
  files: fs.Dirent<string>[]
) {
  const _getResources = _defaultBackendFrameworks.frameworks.filter(
    (f) => f.name === answers.chooseBackendFramework
  );
  const _folders = files.filter(
    (f) => f.name === _getResources[0].templateName && f.isDirectory()
  );

  return {
    folders: _folders,
  };
}

function _generateForFrontendUse(
  answers: { [x: string]: any },
  files: fs.Dirent<string>[]
) {
  const _getResources = _defaultFrontendFrameworks.frameworks.filter(
    (f) => f.name === answers.chooseFrontendFramework
  );
  const _folders = files.filter(
    (f) => f.name === _getResources[0].templateName && f.isDirectory()
  );

  return {
    folders: _folders,
  };
}

function _generateForFullStackUse(
  answers: { [x: string]: any },
  files: fs.Dirent<string>[]
) {
  const _getResources = _defaultFullStackFrameworks.frameworks.filter(
    (f) => f.name === answers.chooseFullStackFramework
  );
  const _folders = files.filter(
    (f) => f.name === _getResources[0].templateName && f.isDirectory()
  );

  return {
    folders: _folders,
  };
}

function _generateForBackend(
  answers: { [x: string]: any },
  files: fs.Dirent<string>[],
  dir: string
): _GenerateForProjectTypeProps {
  const _getResources = _defaultBackendFrameworks.frameworks.filter(
    (f) => f.name === answers.chooseBackendFramework
  );
  const _folders = files.filter(
    (f) => f.name === _getResources[0].templateName && f.isDirectory()
  );

  const _sourcePath = path.join(_folders[0].parentPath, _folders[0].name);
  const _desPath = path.join(dir, _renewalProjectName(answers.projectName));

  return {
    sourcePath: _sourcePath,
    desPath: _desPath,
  };
}

function _generateForFrontend(
  answers: { [x: string]: any },
  files: fs.Dirent<string>[],
  dir: string
): _GenerateForProjectTypeProps {
  const _getResources = _defaultFrontendFrameworks.frameworks.filter(
    (f) => f.name === answers.chooseFrontendFramework
  );
  const _folders = files.filter(
    (f) => f.name === _getResources[0].templateName && f.isDirectory()
  );

  const _sourcePath = path.join(_folders[0].parentPath, _folders[0].name);
  const _desPath = path.join(dir, _renewalProjectName(answers.projectName));

  return {
    sourcePath: _sourcePath,
    desPath: _desPath,
  };
}

function _generateForFullStack(
  answers: { [x: string]: any },
  files: fs.Dirent<string>[],
  dir: string
): _GenerateForProjectTypeProps {
  const _getResources = _defaultFullStackFrameworks.frameworks.filter(
    (f) => f.name === answers.chooseFullStackFramework
  );
  const _folders = files.filter(
    (f) => f.name === _getResources[0].templateName && f.isDirectory()
  );

  const _sourcePath = path.join(_folders[0].parentPath, _folders[0].name);
  const _desPath = path.join(dir, _renewalProjectName(answers.projectName));

  return {
    sourcePath: _sourcePath,
    desPath: _desPath,
  };
}
