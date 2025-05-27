import { PathIsExistError, PathNotExistError } from "../exceptions/custom.js";
import {
  _basePath,
  _defaultBackendFrameworks,
  _defaultFrontendFrameworks,
  _defaultFullStackFrameworks,
} from "../constants/default.js";
import fs from "fs";
import fse from "fs-extra";
import path from "path";
import { _renewalProjectName, _titleCase } from "../utils/string.js";
import ora from "ora";
import { OptionValues } from "commander";
import chalk from "chalk";

type _GenerateForProjectTypeProps = {
  sourcePath: string;
  desPath: string;
};

export function _scanPath(path: string) {
  if (!fs.existsSync(path))
    throw new PathNotExistError(
      `${path} is not exist on ${_basePath} directory.`
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
    _scanPath(_dirPath);

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
    spinner.fail("Failed to search templates...");
    console.error(error);
  } finally {
    spinner.clear();
  }
}

export function _getProjectsByName(targetPath: string, template: string): void {
  const spinner = ora({
    text: `Start searching the ${_titleCase(template)} templates...`,
    spinner: "dots",
    color: "green",
    interval: 80,
  });

  const start = performance.now();
  spinner.start();

  try {
    const _dirPath = path.join(_basePath, targetPath, template);
    _scanPath(_dirPath);

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
    let errorMessage = "⛔️ An unknown error occurred.\n";
    spinner.fail("Failed to generate...\n");

    if (error instanceof Error) {
      if (error.message.includes("Cannot copy"))
        errorMessage = `⛔️ ${chalk.bold(
          "Cannot copy template"
        )}: destination folder cannot be inside the source template.\n`;
    }

    console.error(errorMessage);
  } finally {
    spinner.clear();
  }
}

export async function _generateUseOption(options: OptionValues) {
  const spinner = ora({
    text: "Start generating...",
    spinner: "dots",
    color: "green",
    interval: 100,
  });

  const start = performance.now();
  spinner.start();
  try {
    const _dirPath = path.join(_basePath, "src/templates", options.template);
    _scanPath(_dirPath);

    const _files = fs.readdirSync(_dirPath, {
      withFileTypes: true,
    });
    const _folders = _files.filter(
      (v) => v.name === options.project && v.isDirectory()
    );

    const _sourcePath = path.join(_folders[0].parentPath, _folders[0].name);
    const _desPath = path.join(options.dir, _folders[0].name);

    await fse.copy(_sourcePath, _desPath);

    const end = performance.now();
    spinner.succeed(`All done! ${(end - start).toFixed(3)} ms`);

    console.log(`You can check the project on ${chalk.bold(_desPath)}`);
  } catch (error: unknown) {
    let errorMessage = "⛔️ An unknown error occurred.\n";
    spinner.fail("Failed to generate...\n");

    if (error instanceof Error) {
      if (error.message.includes("Cannot copy"))
        errorMessage = `⛔️ ${chalk.bold(
          "Cannot overwrite template"
        )}: destination folder cannot be inside the source template.\n`;
    }

    console.error(errorMessage);
  } finally {
    spinner.clear();
  }
}

export async function _generateCreateOption(
  answers: { [x: string]: any },
  options: OptionValues
) {
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
    _scanPath(_dirPath);

    const _files = fs.readdirSync(_dirPath, {
      withFileTypes: true,
    });

    switch (true) {
      case options.template === "backend" || answers.projectType === "backend":
        _generated = _generateForBackend(answers, _files, options.dir);

        await fse.copy(_generated.sourcePath, _generated.desPath, {
          overwrite: false,
          preserveTimestamps: true,
        });
        break;
      case options.template === "frontend" ||
        answers.projectType === "frontend":
        _generated = _generateForFrontend(answers, _files, options.dir);

        await fse.copy(_generated.sourcePath, _generated.desPath, {
          overwrite: false,
          preserveTimestamps: true,
        });
        break;
      case options.template === "fullstack" ||
        answers.projectType === "fullstack":
        _generated = _generateForFullStack(answers, _files, options.dir);

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
  } catch (error: unknown) {
    let errorMessage = "⛔️ An unknown error occurred.\n";
    spinner.fail("Failed to generate...\n");

    if (error instanceof Error) {
      if (error.message.includes("Cannot copy"))
        errorMessage = `⛔️ ${chalk.bold(
          "Cannot overwrite template"
        )}: destination folder cannot be inside the source template.\n`;
    }

    console.error(errorMessage);
  } finally {
    spinner.clear();
  }
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
