import {
  _defaultBackendFrameworks,
  _defaultFrontendFrameworks,
  _defaultFullStackFrameworks,
  _defaultProjectTypes,
} from "../constants/default.js";
import {
  PathNotFoundError,
  UnableOverwriteError,
} from "../exceptions/custom.js";
import {
  _getProjectTemplates,
  _getProjectTemplatesByName,
} from "../generators/files.js";
import { _isPathExist, _isProjectExist } from "../exceptions/trigger.js";
import {
  __DockerResourcesProps,
  __FrameworkProps,
  __ProjectResourcePathProps,
} from "../types/default.js";
import { _renewalProjectName } from "../utils/string.js";
import chalk from "chalk";
import { OptionValues } from "commander";
import fs, { Dirent } from "fs";
import fse from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import {
  _generateCreatePrompts,
  _generateUpdatePrompts,
  _generateUsePrompts,
} from "./prompt.js";
import { execa } from "execa";
import { _basePath } from "../config.js";

export async function _listCommand(options: OptionValues): Promise<void> {
  let _answers: { [x: string]: any } = {};

  if (options.all) {
    _getProjectTemplates("src/templates");
    return;
  }

  if (options.template) {
    if (options.template !== "") {
      _getProjectTemplatesByName("src/templates", options.template);
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
    _getProjectTemplatesByName("src/templates", _answers.projectType);
    return;
  }
}

export async function _useCommand(options: OptionValues): Promise<void> {
  let _desPath: string = "";

  const _projectTemplateQuestions = await inquirer.prompt(
    _generateUsePrompts(options.template)
  );

  const spinner = ora({
    spinner: "dots",
    color: "green",
    interval: 100,
  });

  const start = performance.now();

  try {
    const _dirPath = options.template
      ? path.join(_basePath, "src/templates", options.template)
      : path.join(
          _basePath,
          "src/templates",
          _projectTemplateQuestions.projectType
        );
    _isPathExist(_dirPath);

    const _files = fs.readdirSync(_dirPath, {
      withFileTypes: true,
    });

    switch (true) {
      case options.template === "backend" ||
        _projectTemplateQuestions.projectType === "backend":
        spinner.start(
          `Start generating backend project using ${_projectTemplateQuestions.chooseBackendFramework} 👾...`
        );

        const _backendResource = _getFolders(
          "backend",
          _projectTemplateQuestions,
          _files
        );

        const _backendSourcePath = path.join(
          _backendResource.folder.parentPath,
          _backendResource.folder.name
        );

        const _backendDesPath = path.join(
          options.dir,
          _backendResource.folder.name
        );
        _isPathExist(options.dir);
        _isProjectExist(options.dir, _backendResource.folder.name);

        _desPath = _backendDesPath;

        await fse.copy(_backendSourcePath, _backendDesPath);

        spinner.succeed(
          `Generating ${_projectTemplateQuestions.chooseBackendFramework} project succeed ✅`
        );
        break;
      case options.template === "frontend" ||
        _projectTemplateQuestions.projectType === "frontend":
        spinner.start(
          `Start generating frontend project using ${_projectTemplateQuestions.chooseFrontendFramework} 👾...`
        );

        const _frontendResource = _getFolders(
          "frontend",
          _projectTemplateQuestions,
          _files
        );

        const _frontendSourcePath = path.join(
          _frontendResource.folder.parentPath,
          _frontendResource.folder.name
        );

        const _frontendDesPath = path.join(
          options.dir,
          _frontendResource.folder.name
        );
        _isPathExist(options.dir);
        _isProjectExist(options.dir, _frontendResource.folder.name);

        _desPath = _frontendDesPath;

        await fse.copy(_frontendSourcePath, _frontendDesPath);

        spinner.succeed(
          `Generating ${_projectTemplateQuestions.chooseFrontendFramework} project succeed ✅`
        );
        break;
      case options.template === "fullstack" ||
        _projectTemplateQuestions.projectType === "fullstack":
        spinner.start(
          `Start generating fullstack project using ${_projectTemplateQuestions.chooseFullStackFramework} 👾...`
        );

        const _fullstackResource = _getFolders(
          "fullstack",
          _projectTemplateQuestions,
          _files
        );

        const _fullstackSourcePath = path.join(
          _fullstackResource.folder.parentPath,
          _fullstackResource.folder.name
        );

        const _fullstackDesPath = path.join(
          options.dir,
          _fullstackResource.folder.name
        );
        _isPathExist(options.dir);
        _isProjectExist(options.dir, _fullstackResource.folder.name);

        _desPath = _fullstackDesPath;

        await fse.copy(_fullstackSourcePath, _fullstackDesPath);

        spinner.succeed(
          `Generating ${_projectTemplateQuestions.chooseFullStackFramework} project succeed ✅`
        );
        break;
    }

    const end = performance.now();
    spinner.succeed(`All done! ${(end - start).toFixed(3)} ms`);
    spinner.info(`You can check the project on ${chalk.bold(_desPath)}`);
  } catch (error: any) {
    let errorMessage =
      error instanceof Error ? error.message : "⛔️ An unknown error occurred.";
    spinner.fail("Failed to generate...\n");

    if (error instanceof PathNotFoundError) {
      errorMessage = error.message;
    }

    if (error instanceof UnableOverwriteError) {
      errorMessage = error.message;
    }

    console.error(errorMessage);
  } finally {
    spinner.clear();
  }
}

export async function _createCommand(options: OptionValues): Promise<void> {
  let _resource: __ProjectResourcePathProps = { sourcePath: "", desPath: "" };
  let _dockerResource: __ProjectResourcePathProps = {
    sourcePath: "",
    desPath: "",
  };
  let _dockerBakeResource: __ProjectResourcePathProps = {
    sourcePath: "",
    desPath: "",
  };

  const _projectTemplateQuestions = await inquirer.prompt(
    _generateCreatePrompts(options.template)
  );

  const spinner = ora({
    spinner: "dots9",
    color: "green",
    interval: 100,
  });

  const start = performance.now();

  try {
    const _dirPath = options.template
      ? path.join(_basePath, "src/templates", options.template)
      : path.join(
          _basePath,
          "src/templates",
          _projectTemplateQuestions.projectType
        );
    _isPathExist(_dirPath);

    const _files = fs.readdirSync(_dirPath, {
      withFileTypes: true,
    });

    if (!_projectTemplateQuestions.addDocker) {
      switch (true) {
        case options.template === "backend" ||
          _projectTemplateQuestions.projectType === "backend":
          spinner.start(
            `Start generating backend project using ${_projectTemplateQuestions.chooseBackendFramework} 👾...`
          );

          const _backendResource = _getResourcePath(
            "backend",
            _projectTemplateQuestions,
            _files,
            options.dir
          );
          _isPathExist(options.dir);
          _isProjectExist(options.dir, _projectTemplateQuestions.projectName);

          _resource = _backendResource;

          await fse.copy(_backendResource.sourcePath, _backendResource.desPath);

          spinner.succeed(
            `Create ${_projectTemplateQuestions.chooseBackendFramework} project succeed ✅`
          );
          break;
        case options.template === "frontend" ||
          _projectTemplateQuestions.projectType === "frontend":
          spinner.start(
            `Start generating frontend project using ${_projectTemplateQuestions.chooseFrontendFramework} 👾...`
          );

          const _frontendResource = _getResourcePath(
            "frontend",
            _projectTemplateQuestions,
            _files,
            options.dir
          );
          _isPathExist(options.dir);
          _isProjectExist(options.dir, _projectTemplateQuestions.projectName);

          _resource = _frontendResource;

          await fse.copy(
            _frontendResource.sourcePath,
            _frontendResource.desPath
          );

          spinner.succeed(
            `Create ${_projectTemplateQuestions.chooseBackendFramework} project succeed ✅`
          );
          break;
        case options.template === "fullstack" ||
          _projectTemplateQuestions.projectType === "fullstack":
          spinner.start(
            `Start generating fullstack project using ${_projectTemplateQuestions.chooseFullStackFramework} 👾...`
          );

          const _fullstackResource = _getResourcePath(
            "fullstack",
            _projectTemplateQuestions,
            _files,
            options.dir
          );
          _isPathExist(options.dir);
          _isProjectExist(options.dir, _projectTemplateQuestions.projectName);

          _resource = _fullstackResource;

          await fse.copy(
            _fullstackResource.sourcePath,
            _fullstackResource.desPath
          );

          spinner.succeed(
            `Create ${_projectTemplateQuestions.chooseBackendFramework} project succeed ✅`
          );
          break;
      }
    }

    if (!_projectTemplateQuestions.addDockerBake) {
      const _dockerResources = _getDockerResources();

      switch (true) {
        case options.template === "backend" ||
          _projectTemplateQuestions.projectType === "backend":
          spinner.start(
            `Start generating ${_projectTemplateQuestions.projectType} project using ${_projectTemplateQuestions.chooseBackendFramework} 👾...`
          );

          const _backendResource = _getResourcePath(
            "backend",
            _projectTemplateQuestions,
            _files,
            options.dir
          );
          _isPathExist(options.dir);
          _isProjectExist(options.dir, _projectTemplateQuestions.projectName);

          _resource = _backendResource;

          await fse.copy(_backendResource.sourcePath, _backendResource.desPath);

          spinner.succeed(
            `Create ${_projectTemplateQuestions.chooseBackendFramework} project succeed ✅`
          );

          spinner.start("Start copying docker compose 🐳...");

          _dockerResource = _getDockerComposePath(
            _dockerResources.templates,
            _backendResource
          );

          await fse.copy(_dockerResource.sourcePath, _dockerResource.desPath);

          spinner.succeed("Adding docker compose file succeed ✅");

          switch (_projectTemplateQuestions.chooseBackendFramework) {
            case "Spring Boot":
              spinner.start("Start copying dockerfile 🐳...");

              const _javaDockerfileResourcePath = _getDockerfileResourcePath(
                "java",
                _dockerResources.dockerfiles,
                _backendResource
              );

              await fse.copy(
                _javaDockerfileResourcePath.sourcePath,
                _javaDockerfileResourcePath.desPath
              );

              spinner.succeed("Adding dockerfile succeed ✅");
              break;
            case "Laravel":
              spinner.start("Start copying dockerfile 🐳...");

              const _phpDockerfileResourcePath = _getDockerfileResourcePath(
                "php",
                _dockerResources.dockerfiles,
                _backendResource
              );

              await fse.copy(
                _phpDockerfileResourcePath.sourcePath,
                _phpDockerfileResourcePath.desPath
              );

              spinner.succeed("Adding dockerfile succeed ✅");
              break;
            default:
              spinner.start("Start copying dockerfile 🐳...");

              const _nodeDockerfileResourcePath = _getDockerfileResourcePath(
                "node",
                _dockerResources.dockerfiles,
                _backendResource
              );

              await fse.copy(
                _nodeDockerfileResourcePath.sourcePath,
                _nodeDockerfileResourcePath.desPath
              );

              spinner.succeed("Adding dockerfile succeed ✅");
              break;
          }
          break;
        case options.template === "frontend" ||
          _projectTemplateQuestions.projectType === "frontend":
          spinner.start(
            `Start generating ${_projectTemplateQuestions.projectType} project using ${_projectTemplateQuestions.chooseFrontendFramework} 👾...`
          );

          const _frontendResource = _getResourcePath(
            "frontend",
            _projectTemplateQuestions,
            _files,
            options.dir
          );
          _isPathExist(options.dir);
          _isProjectExist(options.dir, _projectTemplateQuestions.projectName);

          _resource = _frontendResource;

          await fse.copy(
            _frontendResource.sourcePath,
            _frontendResource.desPath
          );

          spinner.succeed(
            `Create ${_projectTemplateQuestions.chooseFrontendFramework} project succeed ✅`
          );

          spinner.start("Start copying docker compose 🐳...");

          _dockerResource = _getDockerComposePath(
            _dockerResources.templates,
            _frontendResource
          );

          await fse.copy(_dockerResource.sourcePath, _dockerResource.desPath);

          spinner.succeed("Adding docker compose file succeed ✅");

          spinner.start("Start copying dockerfile 🐳...");

          const _nodeDockerfileResourcePath = _getDockerfileResourcePath(
            "node",
            _dockerResources.dockerfiles,
            _frontendResource
          );

          await fse.copy(
            _nodeDockerfileResourcePath.sourcePath,
            _nodeDockerfileResourcePath.desPath
          );

          spinner.succeed("Adding dockerfile succeed ✅");
          break;
        case options.template === "fullstack" ||
          _projectTemplateQuestions.projectType === "fullstack":
          spinner.start(
            `Start generating ${_projectTemplateQuestions.projectType} project using ${_projectTemplateQuestions.chooseFullStackFramework} 👾...`
          );

          const _fullstackResource = _getResourcePath(
            "fullstack",
            _projectTemplateQuestions,
            _files,
            options.dir
          );
          _isPathExist(options.dir);
          _isProjectExist(options.dir, _projectTemplateQuestions.projectName);

          _resource = _fullstackResource;

          await fse.copy(
            _fullstackResource.sourcePath,
            _fullstackResource.desPath
          );

          spinner.succeed(
            `Create ${_projectTemplateQuestions.chooseFullStackFramework} project succeed ✅`
          );

          spinner.start("Start copying docker compose 🐳...");

          _dockerResource = _getDockerComposePath(
            _dockerResources.templates,
            _fullstackResource
          );

          await fse.copy(_dockerResource.sourcePath, _dockerResource.desPath);

          spinner.succeed("Adding docker compose file succeed ✅");

          spinner.start("Start copying dockerfile 🐳...");

          const _dockerfileResource = _getDockerfileResourcePathForFullStack(
            _projectTemplateQuestions,
            _dockerResources.dockerfiles,
            _fullstackResource
          );

          _dockerfileResource.forEach(async (v) => {
            await fse.copy(v.sourcePath, v.desPath);
          });

          spinner.succeed("Adding dockerfile succeed ✅");
          break;
      }
    }

    if (
      _projectTemplateQuestions.addDocker &&
      _projectTemplateQuestions.addDockerBake
    ) {
      const _dockerResources = _getDockerResources();

      switch (true) {
        case options.template === "backend" ||
          _projectTemplateQuestions.projectType === "backend":
          spinner.start(
            `Start generating ${_projectTemplateQuestions.projectType} project using ${_projectTemplateQuestions.chooseBackendFramework} 👾...`
          );

          const _backendResource = _getResourcePath(
            "backend",
            _projectTemplateQuestions,
            _files,
            options.dir
          );
          _isPathExist(options.dir);
          _isProjectExist(options.dir, _projectTemplateQuestions.projectName);

          _resource = _backendResource;

          await fse.copy(_backendResource.sourcePath, _backendResource.desPath);

          spinner.succeed(
            `Create ${_projectTemplateQuestions.chooseBackendFramework} project succeed ✅`
          );

          spinner.start("Start copying docker 🐳...");

          _dockerResource = _getDockerComposePath(
            _dockerResources.templates,
            _backendResource
          );

          await fse.copy(_dockerResource.sourcePath, _dockerResource.desPath);

          spinner.succeed("Adding docker compose file succeed ✅");

          switch (_projectTemplateQuestions.chooseBackendFramework) {
            case "Spring Boot":
              spinner.start("Start copying dockerfile 🐳...");

              const _javaDockerfileResourcePath = _getDockerfileResourcePath(
                "java",
                _dockerResources.dockerfiles,
                _backendResource
              );

              await fse.copy(
                _javaDockerfileResourcePath.sourcePath,
                _javaDockerfileResourcePath.desPath
              );

              spinner.succeed("Adding dockerfile succeed ✅");
              break;
            case "Laravel":
              spinner.start("Start copying dockerfile 🐳...");

              const _phpDockerfileResourcePath = _getDockerfileResourcePath(
                "php",
                _dockerResources.dockerfiles,
                _backendResource
              );

              await fse.copy(
                _phpDockerfileResourcePath.sourcePath,
                _phpDockerfileResourcePath.desPath
              );

              spinner.succeed("Adding dockerfile succeed ✅");
              break;
            default:
              spinner.start("Start copying dockerfile 🐳...");

              const _nodeDockerfileResourcePath = _getDockerfileResourcePath(
                "node",
                _dockerResources.dockerfiles,
                _backendResource
              );

              await fse.copy(
                _nodeDockerfileResourcePath.sourcePath,
                _nodeDockerfileResourcePath.desPath
              );

              spinner.succeed("Adding dockerfile succeed ✅");
              break;
          }

          spinner.start("Start generate docker bake 🍞...");

          _dockerBakeResource = _getDockerBakePath(
            _dockerResources.templates,
            _backendResource
          );

          await fse.copy(
            _dockerBakeResource.sourcePath,
            _dockerBakeResource.desPath
          );

          spinner.succeed("Adding docker bake file succeed ✅");
          break;
        case options.template === "frontend" ||
          _projectTemplateQuestions.projectType === "frontend":
          spinner.start(
            `Start generating ${_projectTemplateQuestions.projectType} project using ${_projectTemplateQuestions.chooseFrontendFramework} 👾...`
          );

          const _frontendResource = _getResourcePath(
            "frontend",
            _projectTemplateQuestions,
            _files,
            options.dir
          );
          _isPathExist(options.dir);
          _isProjectExist(options.dir, _projectTemplateQuestions.projectName);

          _resource = _frontendResource;

          await fse.copy(
            _frontendResource.sourcePath,
            _frontendResource.desPath
          );

          spinner.succeed(
            `Create ${_projectTemplateQuestions.chooseFrontendFramework} project succeed ✅`
          );

          spinner.start("Start copying docker 🐳...");

          _dockerResource = _getDockerComposePath(
            _dockerResources.templates,
            _frontendResource
          );

          await fse.copy(_dockerResource.sourcePath, _dockerResource.desPath);

          spinner.succeed("Adding docker compose file succeed ✅");

          spinner.start("Start copying dockerfile 🐳...");

          const _nodeDockerfileResourcePath = _getDockerfileResourcePath(
            "node",
            _dockerResources.dockerfiles,
            _frontendResource
          );

          await fse.copy(
            _nodeDockerfileResourcePath.sourcePath,
            _nodeDockerfileResourcePath.desPath
          );

          spinner.succeed("Adding dockerfile succeed ✅");

          spinner.start("Start generate docker bake 🍞...");

          _dockerBakeResource = _getDockerBakePath(
            _dockerResources.templates,
            _frontendResource
          );

          await fse.copy(
            _dockerBakeResource.sourcePath,
            _dockerBakeResource.desPath
          );

          spinner.succeed("Adding docker bake file succeed ✅");
          break;
        case options.template === "fullstack" ||
          _projectTemplateQuestions.projectType === "fullstack":
          spinner.start(
            `Start generating ${_projectTemplateQuestions.projectType} project using ${_projectTemplateQuestions.chooseFullStackFramework} 👾...`
          );

          const _fullstackResource = _getResourcePath(
            "fullstack",
            _projectTemplateQuestions,
            _files,
            options.dir
          );
          _isPathExist(options.dir);
          _isProjectExist(options.dir, _projectTemplateQuestions.projectName);

          _resource = _fullstackResource;

          await fse.copy(
            _fullstackResource.sourcePath,
            _fullstackResource.desPath
          );

          spinner.succeed(
            `Create ${_projectTemplateQuestions.chooseFullStackFramework} project succeed ✅`
          );

          spinner.start("Start copying docker 🐳...");

          _dockerResource = _getDockerComposePath(
            _dockerResources.templates,
            _fullstackResource
          );

          await fse.copy(_dockerResource.sourcePath, _dockerResource.desPath);

          spinner.succeed("Adding docker compose file succeed ✅");

          spinner.start("Start copying dockerfile 🐳...");

          const _dockerfileResource = _getDockerfileResourcePathForFullStack(
            _projectTemplateQuestions,
            _dockerResources.dockerfiles,
            _fullstackResource
          );

          _dockerfileResource.forEach(async (v) => {
            await fse.copy(v.sourcePath, v.desPath);
          });

          spinner.succeed("Adding dockerfile succeed ✅");

          spinner.start("Start generate docker bake 🍞...");

          _dockerBakeResource = _getDockerBakePath(
            _dockerResources.templates,
            _fullstackResource
          );

          await fse.copy(
            _dockerBakeResource.sourcePath,
            _dockerBakeResource.desPath
          );

          spinner.succeed("Adding docker bake file succeed ✅");
          break;
      }
    }

    const end = performance.now();
    spinner.succeed(`All done! ${(end - start).toFixed(3)} ms`);
    spinner.info(
      `You can check the project on ${chalk.bold(_resource.desPath)}`
    );
  } catch (error: any) {
    let errorMessage =
      error instanceof Error ? error.message : "⛔️ An unknown error occurred.";
    spinner.fail("⛔️ Failed to generate...\n");

    if (error instanceof PathNotFoundError) {
      errorMessage = error.message;
    }

    if (error instanceof UnableOverwriteError) {
      errorMessage = error.message;
    }

    console.error(errorMessage);
  } finally {
    spinner.clear();
  }
}

export async function _updateCommand(options: OptionValues): Promise<void> {
  if (!options.all) {
    const _answers = await inquirer.prompt(
      _generateUpdatePrompts(options.template)
    );

    _checkAndUpdate(_answers, options);
  } else {
    const _answers = await inquirer.prompt([
      {
        name: "projectType",
        type: "select",
        message: "Choose project type you want to update:",
        choices: _defaultProjectTypes,
        default: "backend",
      },
    ]);

    _updateAllTemplates(_answers, options);
  }
}

async function _checkAndUpdate(
  answers: { [x: string]: any },
  options: OptionValues
) {
  const spinner = ora({
    text: `Start updating project template dependencies ✨...`,
    spinner: "dots9",
    color: "green",
    interval: 100,
  });

  const start = performance.now();

  try {
    const _dirPath = options.template
      ? path.join(_basePath, "src/templates", options.template)
      : path.join(_basePath, "src/templates", answers.projectType);
    _isPathExist(_dirPath);

    const _files = fs.readdirSync(_dirPath, {
      withFileTypes: true,
    });

    if (options.template === "backend" || answers.projectType === "backend") {
      spinner.start(
        `Start checking ${answers.chooseBackendFramework} project dependencies updates ✨...\n`
      );

      const _getBackendFrameworkResource =
        _defaultBackendFrameworks.frameworks.filter(
          (f) => f.name === answers.chooseBackendFramework
        )[0];

      const _folder = _files.filter(
        (f) =>
          f.name === _getBackendFrameworkResource.templateName &&
          f.isDirectory()
      )[0];

      if (answers.chooseBackendFramework !== "NestJS") {
        const _sourcePath = path.join(_folder.parentPath, _folder.name);

        const _tableStdout = await _checkPackageUpdatesInfo(
          _sourcePath,
          "npm",
          "table"
        );
        const _jsonStdout = await _checkPackageUpdatesInfo(
          _sourcePath,
          "npm",
          "json"
        );

        const _outdatedPackages = JSON.parse(_jsonStdout);

        if (Object.keys(_outdatedPackages).length < 1) {
          spinner.info(
            `${answers.chooseBackendFramework} project dependencies already in current or latest version ✨...\n`
          );
        } else {
          console.log(`${_tableStdout}\n`);

          spinner.stop();

          const _updateOptionAnswers = await inquirer.prompt([
            {
              name: "updatePackage",
              type: "confirm",
              message: "Do you want to update the project dependencies?",
              default: false,
            },
          ]);

          if (!_updateOptionAnswers.updatePackage) {
            spinner.warn(
              chalk.yellow(
                `Well, it's okay if you don't wanna update the dependencies, but still, you should update the dependencies so that you can avoid any several issues on any further.`
              )
            );
          } else {
            spinner.start(
              `Updating ${answers.chooseBackendFramework} project dependencies ✨...\n`
            );

            await execa("npm", ["update"], {
              cwd: _sourcePath,
            });

            spinner.succeed(
              `Updating ${answers.chooseBackendFramework} project template dependencies succeed ✅`
            );
          }
        }
      } else {
        const _sourcePath = path.join(_folder.parentPath, _folder.name);

        const _tableStdout = await _checkPackageUpdatesInfo(
          _sourcePath,
          "pnpm",
          "table"
        );
        const _jsonStdout = await _checkPackageUpdatesInfo(
          _sourcePath,
          "pnpm",
          "json"
        );

        const _outdatedPackages = JSON.parse(_jsonStdout);

        if (Object.keys(_outdatedPackages).length < 1) {
          spinner.info(
            `${answers.chooseBackendFramework} project dependencies already in current or latest version ✨...\n`
          );
        } else {
          console.log(`${_tableStdout}\n`);

          spinner.stop();

          const _updateOptionAnswers = await inquirer.prompt([
            {
              name: "updatePackage",
              type: "confirm",
              message: "Do you want to update the project dependencies?",
              default: false,
            },
          ]);

          if (!_updateOptionAnswers.updatePackage) {
            spinner.warn(
              chalk.yellow(
                `Well, it's okay if you don't wanna update the dependencies, but still, you should update the dependencies so that you can avoid any several issues on any further.`
              )
            );
          } else {
            spinner.start(
              `Updating ${answers.chooseBackendFramework} project dependencies ✨...\n`
            );

            await execa("pnpm", ["update"], {
              cwd: _sourcePath,
            });

            spinner.succeed(
              `Updating ${answers.chooseBackendFramework} project template dependencies succeed ✅`
            );
          }
        }
      }
    }

    if (options.template === "frontend" || answers.projectType === "frontend") {
      spinner.start(
        `Start checking ${answers.chooseFrontendFramework} project dependencies updates ✨...\n`
      );

      const _getFrontendFrameworkResource =
        _defaultFrontendFrameworks.frameworks.filter(
          (f) => f.name === answers.chooseFrontendFramework
        )[0];

      const _folder = _files.filter(
        (f) =>
          f.name === _getFrontendFrameworkResource.templateName &&
          f.isDirectory()
      )[0];

      if (answers.chooseFrontendFramework !== "Vue.js") {
        const _sourcePath = path.join(_folder.parentPath, _folder.name);

        const _tableStdout = await _checkPackageUpdatesInfo(
          _sourcePath,
          "npm",
          "table"
        );
        const _jsonStdout = await _checkPackageUpdatesInfo(
          _sourcePath,
          "npm",
          "json"
        );

        const _outdatedPackages = JSON.parse(_jsonStdout);

        if (Object.keys(_outdatedPackages).length < 1) {
          spinner.info(
            `${answers.chooseFrontendFramework} project dependencies already in current or latest version ✨...\n`
          );
        } else {
          console.log(`${_tableStdout}\n`);

          spinner.stop();

          const _updateOptionAnswers = await inquirer.prompt([
            {
              name: "updatePackage",
              type: "confirm",
              message: "Do you want to update the project dependencies?",
              default: false,
            },
          ]);

          if (!_updateOptionAnswers.updatePackage) {
            spinner.warn(
              chalk.yellow(
                `Well, it's okay if you don't wanna update the dependencies, but still, you should update the dependencies so that you can avoid any several issues on any further.`
              )
            );
          } else {
            spinner.start(
              `Updating ${answers.chooseFrontendFramework} project dependencies ✨...\n`
            );

            await execa("npm", ["update"], {
              cwd: _sourcePath,
            });

            spinner.succeed(
              `Updating ${answers.chooseFrontendFramework} project template dependencies succeed ✅`
            );
          }
        }
      } else {
        const _sourcePath = path.join(_folder.parentPath, _folder.name);

        const _tableStdout = await _checkPackageUpdatesInfo(
          _sourcePath,
          "pnpm",
          "table"
        );
        const _jsonStdout = await _checkPackageUpdatesInfo(
          _sourcePath,
          "pnpm",
          "json"
        );

        const _outdatedPackages = JSON.parse(_jsonStdout);

        if (Object.keys(_outdatedPackages).length < 1) {
          spinner.info(
            `${answers.chooseFrontendFramework} project dependencies already in current or latest version ✨...\n`
          );
        } else {
          console.log(`${_tableStdout}\n`);

          spinner.stop();

          const _updateOptionAnswers = await inquirer.prompt([
            {
              name: "updatePackage",
              type: "confirm",
              message: "Do you want to update the project dependencies?",
              default: false,
            },
          ]);

          if (!_updateOptionAnswers.updatePackage) {
            spinner.warn(
              chalk.yellow(
                `Well, it's okay if you don't wanna update the dependencies, but still, you should update the dependencies so that you can avoid any several issues on any further.`
              )
            );
          } else {
            spinner.start(
              `Updating ${answers.chooseFrontendFramework} project dependencies ✨...\n`
            );

            await execa("pnpm", ["update"], {
              cwd: _sourcePath,
            });

            spinner.succeed(
              `Updating ${answers.chooseFrontendFramework} project template dependencies succeed ✅`
            );
          }
        }
      }
    }

    if (
      options.template === "fullstack" ||
      answers.projectType === "fullstack"
    ) {
      let _projectTemplates: string[] = [];

      spinner.start(
        `Start checking ${answers.chooseFullStackFramework} project dependencies updates ✨...\n`
      );

      const _getFullStackFrameworkResource =
        _defaultFullStackFrameworks.frameworks.filter(
          (f) => f.name === answers.chooseFullStackFramework
        )[0];

      const _folder = _files.filter(
        (f) =>
          f.name === _getFullStackFrameworkResource.templateName &&
          f.isDirectory()
      )[0];

      const _fullstackProjectPath = path.join(
        _folder.parentPath,
        _folder.name,
        "www"
      );

      const _fullstackProjectFolders = fs.readdirSync(_fullstackProjectPath, {
        withFileTypes: true,
      });

      _fullstackProjectFolders.forEach((f) => {
        _projectTemplates.push(f.name);
      });

      if (answers.chooseFullStackFramework !== "Next.js + NestJS") {
        spinner.stop();

        const _selectProjectTemplateQuestion = await inquirer.prompt([
          {
            name: "selectProjectTemplate",
            type: "select",
            message: "Which one project template do you want to update?",
            choices: _projectTemplates,
            default: _projectTemplates[0],
          },
        ]);

        if (
          _selectProjectTemplateQuestion.selectProjectTemplate !==
          "nest-backend"
        ) {
          spinner.start(
            `Start searching ${chalk.bold(
              _selectProjectTemplateQuestion.selectProjectTemplate
            )} project dependencies that need to be updated 🔍...\n`
          );

          const _vueFrontendProject = _fullstackProjectFolders.filter(
            (v) => v.name === "vue-frontend" && v.isDirectory()
          )[0];

          const _vueFrontendSourcePath = path.join(
            _vueFrontendProject.parentPath,
            _vueFrontendProject.name
          );

          const _vueFrontendTableStdou = await _checkPackageUpdatesInfo(
            _vueFrontendSourcePath,
            "pnpm",
            "table"
          );

          const _vueFrontendJsonStdou = await _checkPackageUpdatesInfo(
            _vueFrontendSourcePath,
            "pnpm",
            "json"
          );

          const _vueFrontendOutdatedPackages = JSON.parse(
            _vueFrontendJsonStdou
          );

          if (Object.keys(_vueFrontendOutdatedPackages).length < 1) {
            spinner.info(
              `${chalk.bold(
                _vueFrontendProject.name
              )} project dependencies already in current or latest version ✨...\n`
            );
          } else {
            console.log(`${_vueFrontendTableStdou}\n`);

            spinner.stop();

            const _confirmUpdateQuestion = await inquirer.prompt([
              {
                name: "updatePackage",
                type: "confirm",
                message: `Do you want to update ${chalk.bold(
                  _vueFrontendProject.name
                )} project dependencies?`,
                default: false,
              },
            ]);

            if (!_confirmUpdateQuestion.updatePackage) {
              spinner.warn(
                chalk.yellow(
                  `Well, it's okay if you don't wanna update the dependencies, but still, you should update the dependencies so that you can avoid any several issues on any further.`
                )
              );
            } else {
              spinner.start(
                `Updating ${chalk.bold(
                  _vueFrontendProject.name
                )} project dependencies ✨...\n`
              );

              await execa("pnpm", ["update"], {
                cwd: _vueFrontendSourcePath,
              });

              spinner.succeed(
                `Updating ${chalk.bold(
                  _vueFrontendProject.name
                )} project template dependencies succeed ✅`
              );
            }
          }
        } else {
          spinner.start(
            `Start updating ${chalk.bold(
              _selectProjectTemplateQuestion.selectProjectTemplate
            )} project dependencies that need to be updated 🔍...\n`
          );

          const _nestBackendProject = _fullstackProjectFolders.filter(
            (v) => v.name === "nest-backend" && v.isDirectory()
          )[0];

          const _nestBackendSourcePath = path.join(
            _nestBackendProject.parentPath,
            _nestBackendProject.name
          );

          const _nestBackendTableStdout = await _checkPackageUpdatesInfo(
            _nestBackendSourcePath,
            "pnpm",
            "table"
          );

          const _nestBackendJsonStdout = await _checkPackageUpdatesInfo(
            _nestBackendSourcePath,
            "pnpm",
            "json"
          );

          const _nestBackendOutdatedPackages = JSON.parse(
            _nestBackendJsonStdout
          );

          if (Object.keys(_nestBackendOutdatedPackages).length < 1) {
            spinner.info(
              `${chalk.bold(
                _nestBackendProject.name
              )} project dependencies already in current or latest version ✨...\n`
            );
          } else {
            console.log(`${_nestBackendTableStdout}\n`);

            spinner.stop();

            const _confirmUpdateQuestion = await inquirer.prompt([
              {
                name: "updatePackage",
                type: "confirm",
                message: `Do you want to update ${chalk.bold(
                  _nestBackendProject.name
                )} project dependencies?`,
                default: false,
              },
            ]);

            if (!_confirmUpdateQuestion.updatePackage) {
              spinner.warn(
                chalk.yellow(
                  `Well, it's okay if you don't wanna update the dependencies, but still, you should update the dependencies so that you can avoid any several issues on any further.`
                )
              );
            } else {
              spinner.start(
                `Updating ${chalk.bold(
                  _nestBackendProject.name
                )} project dependencies ✨...\n`
              );

              await execa("pnpm", ["update"], {
                cwd: _nestBackendSourcePath,
              });

              spinner.succeed(
                `Updating ${chalk.bold(
                  _nestBackendProject.name
                )} project template dependencies succeed ✅`
              );
            }
          }
        }
      } else {
        spinner.stop();

        const _selectProjectTemplateQuestion = await inquirer.prompt([
          {
            name: "selectProjectTemplate",
            type: "select",
            message: "Which one project template do you want to update?",
            choices: _projectTemplates,
            default: _projectTemplates[0],
          },
        ]);

        if (
          _selectProjectTemplateQuestion.selectProjectTemplate !==
          "nest-backend"
        ) {
          spinner.start(
            `Start searching ${chalk.bold(
              _selectProjectTemplateQuestion.selectProjectTemplate
            )} project dependencies that need to be updated 🔍...\n`
          );

          const _nextFrontendProject = _fullstackProjectFolders.filter(
            (v) => v.name === "next-frontend" && v.isDirectory()
          )[0];

          const _nextFrontendSourcePath = path.join(
            _nextFrontendProject.parentPath,
            _nextFrontendProject.name
          );

          const _nextFrontendTableStdout = await _checkPackageUpdatesInfo(
            _nextFrontendSourcePath,
            "npm",
            "table"
          );

          const _nextFrontendJsonStdout = await _checkPackageUpdatesInfo(
            _nextFrontendSourcePath,
            "npm",
            "json"
          );

          const _nextFrontendOutdatedPackages = JSON.parse(
            _nextFrontendJsonStdout
          );

          if (Object.keys(_nextFrontendOutdatedPackages).length < 1) {
            spinner.info(
              `${chalk.bold(
                _nextFrontendProject.name
              )} project dependencies already in current or latest version ✨...\n`
            );
          } else {
            console.log(`${_nextFrontendTableStdout}\n`);

            spinner.stop();

            const _confirmUpdateQuestion = await inquirer.prompt([
              {
                name: "updatePackage",
                type: "confirm",
                message: `Do you want to update ${chalk.bold(
                  _nextFrontendProject.name
                )} project dependencies?`,
                default: false,
              },
            ]);

            if (!_confirmUpdateQuestion.updatePackage) {
              spinner.warn(
                chalk.yellow(
                  `Well, it's okay if you don't wanna update the dependencies, but still, you should update the dependencies so that you can avoid any several issues on any further.`
                )
              );
            } else {
              spinner.start(
                `Updating ${chalk.bold(
                  _nextFrontendProject.name
                )} project dependencies ✨...\n`
              );

              await execa("npm", ["update"], {
                cwd: _nextFrontendSourcePath,
              });

              spinner.succeed(
                `Updating ${chalk.bold(
                  _nextFrontendProject.name
                )} project template dependencies succeed ✅`
              );
            }
          }
        } else {
          spinner.start(
            `Start updating ${chalk.bold(
              _selectProjectTemplateQuestion.selectProjectTemplate
            )} project dependencies that need to be updated 🔍...\n`
          );

          const _nestBackendProject = _fullstackProjectFolders.filter(
            (v) => v.name === "nest-backend" && v.isDirectory()
          )[0];

          const _nestBackendSourcePath = path.join(
            _nestBackendProject.parentPath,
            _nestBackendProject.name
          );

          const _nestBackendTableStdout = await _checkPackageUpdatesInfo(
            _nestBackendSourcePath,
            "pnpm",
            "table"
          );

          const _nestBackendJsonStdout = await _checkPackageUpdatesInfo(
            _nestBackendSourcePath,
            "pnpm",
            "json"
          );

          const _nestBackendOutdatedPackages = JSON.parse(
            _nestBackendJsonStdout
          );

          if (Object.keys(_nestBackendOutdatedPackages).length < 1) {
            spinner.info(
              `${chalk.bold(
                _nestBackendProject.name
              )} project dependencies already in current or latest version ✨...\n`
            );
          } else {
            console.log(`${_nestBackendTableStdout}\n`);

            spinner.stop();

            const _confirmUpdateQuestion = await inquirer.prompt([
              {
                name: "updatePackage",
                type: "confirm",
                message: `Do you want to update ${chalk.bold(
                  _nestBackendProject.name
                )} project dependencies?`,
                default: false,
              },
            ]);

            if (!_confirmUpdateQuestion.updatePackage) {
              spinner.warn(
                chalk.yellow(
                  `Well, it's okay if you don't wanna update the dependencies, but still, you should update the dependencies so that you can avoid any several issues on any further.`
                )
              );
            } else {
              spinner.start(
                `Updating ${chalk.bold(
                  _nestBackendProject.name
                )} project dependencies ✨...\n`
              );

              await execa("pnpm", ["update"], {
                cwd: _nestBackendSourcePath,
              });

              spinner.succeed(
                `Updating ${chalk.bold(
                  _nestBackendProject.name
                )} project template dependencies succeed ✅`
              );
            }
          }
        }
      }
    }

    const end = performance.now();
    spinner.succeed(`✅ All done! ${(end - start).toFixed(3)} ms`);
  } catch (error) {
    let errorMessage =
      error instanceof Error ? error.message : "⛔️ An unknown error occurred.";
    spinner.fail("⛔️ Failed to generate...\n");

    if (error instanceof PathNotFoundError) {
      errorMessage = error.message;
    }

    if (error instanceof UnableOverwriteError) {
      errorMessage = error.message;
    }

    console.error(errorMessage);
  } finally {
    spinner.clear();
  }
}

async function _updateAllTemplates(
  answers: { [x: string]: any },
  options: OptionValues
) {
  const spinner = ora({
    text: "Start updating project templates dependencies ✨...",
    spinner: "dots9",
    color: "green",
    interval: 100,
  });

  const start = performance.now();

  try {
    const _dirPath = options.template
      ? path.join(_basePath, "src/templates", options.template)
      : path.join(_basePath, "src/templates", answers.projectType);
    _isPathExist(_dirPath);

    const _files = fs.readdirSync(_dirPath, {
      withFileTypes: true,
    });

    if (options.template === "backend" || answers.projectType === "backend") {
      spinner.start(
        `Start updating all project ${
          options.template ? options.template : answers.projectType
        } templates dependencies ✨...`
      );

      for (const f of _files) {
        if (f.name !== "nest-project") {
          spinner.start(
            `Start updating ${f.name} project templates dependencies ✨...`
          );

          const _sourcePath = path.join(f.parentPath, f.name);

          await execa("npm", ["update"], {
            cwd: _sourcePath,
          });

          spinner.succeed(
            `Updating ${f.name} project template dependencies succeed ✅`
          );
        } else {
          spinner.start(
            `Start updating ${f.name} project templates dependencies ✨...`
          );

          const _sourcePath = path.join(f.parentPath, f.name);

          await execa("pnpm", ["update"], {
            cwd: _sourcePath,
          });

          spinner.succeed(
            `Updating ${f.name} project template dependencies succeed ✅`
          );
        }
      }
    }

    if (options.template === "frontend" || answers.projectType === "frontend") {
      spinner.start(
        `Start updating all project ${
          options.template ? options.template : answers.projectType
        } templates dependencies ✨...`
      );

      for (const f of _files) {
        if (f.name !== "vue-project") {
          spinner.start(
            `Start updating ${f.name} project templates dependencies ✨...`
          );

          const _sourcePath = path.join(f.parentPath, f.name);

          await execa("npm", ["update"], {
            cwd: _sourcePath,
          });

          spinner.succeed(
            `Updating ${f.name} project template dependencies succeed ✅`
          );
        } else {
          spinner.start(
            `Start updating ${f.name} project templates dependencies ✨...`
          );

          const _sourcePath = path.join(f.parentPath, f.name);

          await execa("pnpm", ["update"], {
            cwd: _sourcePath,
          });

          spinner.succeed(
            `Updating ${f.name} project template dependencies succeed ✅`
          );
        }
      }
    }

    if (
      options.template === "fullstack" ||
      answers.projectType === "fullstack"
    ) {
      spinner.start(
        `Start updating all project ${
          options.template ? options.template : answers.projectType
        } templates dependencies ✨...`
      );

      for (const f of _files) {
        const _fullstackProjectPath = path.join(f.parentPath, f.name, "www");
        if (f.name !== "next-nest-project") {
          const _fullstackProjectFolders = fs.readdirSync(
            _fullstackProjectPath,
            {
              withFileTypes: true,
            }
          );

          for (const g of _fullstackProjectFolders) {
            spinner.start(
              `Start updating ${g.name} project templates dependencies ✨...`
            );

            const _sourcePath = path.join(g.parentPath, g.name);

            await execa("pnpm", ["update"], {
              cwd: _sourcePath,
            });

            spinner.succeed(
              `Updating ${g.name} project template dependencies succeed ✅`
            );
          }
        } else {
          const _fullstackProjectFolders = fs.readdirSync(
            _fullstackProjectPath,
            {
              withFileTypes: true,
            }
          );

          for (const g of _fullstackProjectFolders) {
            if (g.name !== "nest-backend") {
              spinner.start(
                `Start updating ${g.name} project templates dependencies ✨...`
              );

              const _sourcePath = path.join(g.parentPath, g.name);

              await execa("npm", ["update"], {
                cwd: _sourcePath,
              });

              spinner.succeed(
                `Updating ${g.name} project template dependencies succeed ✅`
              );
            } else {
              spinner.start(
                `Start updating ${g.name} project templates dependencies ✨...`
              );

              const _sourcePath = path.join(g.parentPath, g.name);

              await execa("pnpm", ["update"], {
                cwd: _sourcePath,
              });

              spinner.succeed(
                `Updating ${g.name} project template dependencies succeed ✅`
              );
            }
          }
        }
      }
    }

    const end = performance.now();
    spinner.succeed(`✅ All done! ${(end - start).toFixed(3)} ms`);
  } catch (error) {
    let errorMessage =
      error instanceof Error ? error.message : "⛔️ An unknown error occurred.";
    spinner.fail("⛔️ Failed to generate...\n");

    if (error instanceof PathNotFoundError) {
      errorMessage = error.message;
    }

    if (error instanceof UnableOverwriteError) {
      errorMessage = error.message;
    }

    console.error(errorMessage);
  } finally {
    spinner.clear();
  }
}

async function _checkPackageUpdatesInfo(
  targetPath: string,
  packageManager: "npm" | "pnpm",
  format: "json" | "table"
) {
  if (packageManager !== "npm") {
    if (format !== "json") {
      const { stdout } = await execa("pnpm", ["outdated", "--table"], {
        cwd: targetPath,
        reject: false,
      });

      return stdout;
    } else {
      const { stdout } = await execa("pnpm", ["outdated", "--json"], {
        cwd: targetPath,
        reject: false,
      });

      return stdout;
    }
  } else {
    if (format !== "json") {
      const { stdout } = await execa("npm", ["outdated", "--table"], {
        cwd: targetPath,
        reject: false,
      });

      return stdout;
    } else {
      const { stdout } = await execa("npm", ["outdated", "--json"], {
        cwd: targetPath,
        reject: false,
      });

      return stdout;
    }
  }
}

function _getFolders(
  type: "backend" | "frontend" | "fullstack",
  answers: { [x: string]: any },
  files: fs.Dirent<string>[]
) {
  let _folder: fs.Dirent<string>;

  switch (type) {
    case "backend":
      const _backendResource = _defaultBackendFrameworks.frameworks.filter(
        (f) => f.name === answers.chooseBackendFramework
      )[0];
      _folder = files.filter(
        (f) => f.name === _backendResource.templateName && f.isDirectory()
      )[0];

      return {
        folder: _folder,
      };
    case "frontend":
      const _frontendResource = _defaultFrontendFrameworks.frameworks.filter(
        (f) => f.name === answers.chooseFrontendFramework
      )[0];
      _folder = files.filter(
        (f) => f.name === _frontendResource.templateName && f.isDirectory()
      )[0];

      return {
        folder: _folder,
      };
    case "fullstack":
      const _fullstackResource = _defaultFullStackFrameworks.frameworks.filter(
        (f) => f.name === answers.chooseFullStackFramework
      )[0];
      _folder = files.filter(
        (f) => f.name === _fullstackResource.templateName && f.isDirectory()
      )[0];

      return {
        folder: _folder,
      };
  }
}

function _getResourcePath(
  type: "backend" | "frontend" | "fullstack",
  answers: { [x: string]: any },
  files: fs.Dirent<string>[],
  dir: string
): __ProjectResourcePathProps {
  switch (type) {
    case "backend":
      const _backendResource = _defaultBackendFrameworks.frameworks.filter(
        (f) => f.name === answers.chooseBackendFramework
      )[0];

      const _backendFolder = files.filter(
        (f) => f.name === _backendResource.templateName && f.isDirectory()
      )[0];

      const _backendSourcePath = path.join(
        _backendFolder.parentPath,
        _backendFolder.name
      );

      const _backendDesPath = path.join(
        dir,
        _renewalProjectName(answers.projectName)
      );

      return {
        sourcePath: _backendSourcePath,
        desPath: _backendDesPath,
      };
    case "frontend":
      const _frontendResource = _defaultFrontendFrameworks.frameworks.filter(
        (f) => f.name === answers.chooseFrontendFramework
      )[0];

      const _frontendFolder = files.filter(
        (f) => f.name === _frontendResource.templateName && f.isDirectory()
      )[0];

      const _frontendSourcePath = path.join(
        _frontendFolder.parentPath,
        _frontendFolder.name
      );

      const _frontendDesPath = path.join(
        dir,
        _renewalProjectName(answers.projectName)
      );

      return {
        sourcePath: _frontendSourcePath,
        desPath: _frontendDesPath,
      };
    case "fullstack":
      const _fullstackResource = _defaultFullStackFrameworks.frameworks.filter(
        (f) => f.name === answers.chooseFullStackFramework
      )[0];

      const _fullstackFolder = files.filter(
        (f) => f.name === _fullstackResource.templateName && f.isDirectory()
      )[0];

      const _fullstackSourcePath = path.join(
        _fullstackFolder.parentPath,
        _fullstackFolder.name
      );

      const _fullstackDesPath = path.join(
        dir,
        _renewalProjectName(answers.projectName)
      );

      return {
        sourcePath: _fullstackSourcePath,
        desPath: _fullstackDesPath,
      };
  }
}

function _getDockerResources(): __DockerResourcesProps {
  const _templatesPath = path.join(_basePath, "src/templates");
  _isPathExist(_templatesPath);

  const _templates = fs.readdirSync(_templatesPath, {
    withFileTypes: true,
  });

  const _dockerfilesPath = path.join(_basePath, "src/templates/dockerfiles");
  _isPathExist(_dockerfilesPath);

  const _dockerfiles = fs.readdirSync(_dockerfilesPath, {
    withFileTypes: true,
  });

  return {
    templates: _templates,
    dockerfiles: _dockerfiles,
  };
}

function _getDockerComposePath(
  templates: fs.Dirent<string>[],
  resource: __ProjectResourcePathProps
): __ProjectResourcePathProps {
  const _dockerComposeFile = templates.filter(
    (f) => f.name === "compose.template.yml"
  )[0];

  const _dockerComposeSourcePath = path.join(
    _dockerComposeFile.parentPath,
    _dockerComposeFile.name
  );
  const _dockerComposeDesPath = path.join(
    resource.desPath,
    _dockerComposeFile.name
  );

  return {
    sourcePath: _dockerComposeSourcePath,
    desPath: _dockerComposeDesPath,
  };
}

function _getDockerBakePath(
  templates: fs.Dirent<string>[],
  resource: __ProjectResourcePathProps
): __ProjectResourcePathProps {
  const _dockerBakeFile = templates.filter(
    (f) => f.name === "docker-bake.template.hcl"
  )[0];

  const _dockerBakeSourcePath = path.join(
    _dockerBakeFile.parentPath,
    _dockerBakeFile.name
  );
  const _dockerBakeDesPath = path.join(resource.desPath, _dockerBakeFile.name);

  return {
    sourcePath: _dockerBakeSourcePath,
    desPath: _dockerBakeDesPath,
  };
}

function _getDockerfileResourcePathForFullStack(
  answers: { [x: string]: any },
  dockerfiles: fs.Dirent<string>[],
  resource: __ProjectResourcePathProps
) {
  const _fullstackSourcePath = path.join(resource.sourcePath, "www");

  const _fullstackFolders = fs
    .readdirSync(_fullstackSourcePath, {
      withFileTypes: true,
    })
    .filter((f) => f.isDirectory());

  let _nodeDockerfileResourcePath: __ProjectResourcePathProps[] = [];
  let _nodeDockerfileSourcePath: string = "";
  let _nodeDockerfileDesPath: string = "";

  for (const f of _fullstackFolders) {
    const _desPath = path.join(resource.desPath, "www");
    const _projectPath = path.join(_desPath, f.name);

    const _nodeDockerfile = dockerfiles.filter(
      (f) => f.name === "node.template.Dockerfile"
    )[0];

    _nodeDockerfileSourcePath = path.join(
      _nodeDockerfile.parentPath,
      _nodeDockerfile.name
    );

    _nodeDockerfileDesPath = path.join(_projectPath, _nodeDockerfile.name);

    _nodeDockerfileResourcePath.push({
      sourcePath: _nodeDockerfileSourcePath,
      desPath: _nodeDockerfileDesPath,
    });
  }

  return _nodeDockerfileResourcePath;
}

function _getDockerfileResourcePath(
  origin: "node" | "java" | "php",
  dockerfiles: fs.Dirent<string>[],
  resource: __ProjectResourcePathProps
): __ProjectResourcePathProps {
  switch (origin) {
    case "node":
      const _nodeDockerfile = dockerfiles.filter(
        (f) => f.name === "node.template.Dockerfile"
      )[0];

      const _nodeDockerfileSourcePath = path.join(
        _nodeDockerfile.parentPath,
        _nodeDockerfile.name
      );

      const _nodeDockerfileDesPath = path.join(
        resource.desPath,
        _nodeDockerfile.name
      );

      return {
        sourcePath: _nodeDockerfileSourcePath,
        desPath: _nodeDockerfileDesPath,
      };
    case "java":
      const _javaDockerfile = dockerfiles.filter(
        (f) => f.name === "java.template.Dockerfile"
      )[0];

      const _javaDockerfileSourcePath = path.join(
        _javaDockerfile.parentPath,
        _javaDockerfile.name
      );
      const _javaDockerfileDesPath = path.join(
        resource.desPath,
        _javaDockerfile.name
      );

      return {
        sourcePath: _javaDockerfileSourcePath,
        desPath: _javaDockerfileDesPath,
      };
    case "php":
      const _phpDockerfile = dockerfiles.filter(
        (f) => f.name === "php.template.Dockerfile"
      )[0];

      const _phpDockerfileSourcePath = path.join(
        _phpDockerfile.parentPath,
        _phpDockerfile.name
      );
      const _phpDockerfileDesPath = path.join(
        resource.desPath,
        _phpDockerfile.name
      );

      return {
        sourcePath: _phpDockerfileSourcePath,
        desPath: _phpDockerfileDesPath,
      };
  }
}
