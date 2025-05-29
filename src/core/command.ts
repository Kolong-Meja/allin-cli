import {
  _basePath,
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
  _getProjects,
  _getProjectsByName,
  _isPathExist,
  _isProjectExist,
} from "../generators/files.js";
import { _DockerResources, _ProjectResourcePath } from "../types/default.js";
import { _renewalProjectName } from "../utils/string.js";
import chalk from "chalk";
import { OptionValues } from "commander";
import fs, { Dir, Dirent } from "fs";
import fse from "fs-extra";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";

export async function _listCommand(options: OptionValues): Promise<void> {
  let _answers: { [x: string]: any } = {};

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

export async function _useCommand(
  answers: { [x: string]: any },
  options: OptionValues
): Promise<void> {
  let _resource: { folder: Dirent<string> } = { folder: new Dirent<string>() };
  let _sourcePath: string = "";
  let _desPath: string = "";

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
        _resource = _getBackendFolder(answers, _files);

        _sourcePath = path.join(
          _resource.folder.parentPath,
          _resource.folder.name
        );
        _desPath = path.join(options.dir, _resource.folder.name);
        _isPathExist(options.dir);
        _isProjectExist(options.dir, _resource.folder.name);

        await fse.copy(_sourcePath, _desPath);
        break;
      case options.template === "frontend" ||
        answers.projectType === "frontend":
        _resource = _getFrontendFolder(answers, _files);

        _sourcePath = path.join(
          _resource.folder.parentPath,
          _resource.folder.name
        );
        _desPath = path.join(options.dir, _resource.folder.name);
        _isPathExist(options.dir);
        _isProjectExist(options.dir, _resource.folder.name);

        await fse.copy(_sourcePath, _desPath);
        break;
      case options.template === "fullstack" ||
        answers.projectType === "fullstack":
        _resource = _getFullStackFolder(answers, _files);

        _sourcePath = path.join(
          _resource.folder.parentPath,
          _resource.folder.name
        );
        _desPath = path.join(options.dir, _resource.folder.name);
        _isPathExist(options.dir);
        _isProjectExist(options.dir, _resource.folder.name);

        await fse.copy(_sourcePath, _desPath);
        break;
    }

    const end = performance.now();
    spinner.succeed(`✅ All done! ${(end - start).toFixed(3)} ms`);

    console.log(`You can check the project on ${chalk.bold(_desPath)}`);
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

export async function _createCommand(
  answers: { [x: string]: any },
  options: OptionValues
): Promise<void> {
  let _resource: _ProjectResourcePath = { sourcePath: "", desPath: "" };
  let _dockerResource: _ProjectResourcePath = { sourcePath: "", desPath: "" };
  let _dockerBakeResource: _ProjectResourcePath = {
    sourcePath: "",
    desPath: "",
  };

  const spinner = ora({
    text: "Start generating ✨...",
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

    if (!answers.addDocker && !answers.addDockerBake) {
      switch (true) {
        case options.template === "backend" ||
          answers.projectType === "backend":
          spinner.start(
            `Start generating ${answers.projectType} project using ${answers.chooseBackendFramework} 👾...`
          );

          _resource = _getBackendResourcePath(answers, _files, options.dir);
          _isPathExist(options.dir);
          _isProjectExist(options.dir, answers.projectName);

          await fse.copy(_resource.sourcePath, _resource.desPath);

          spinner.succeed(
            `Create ${answers.chooseBackendFramework} project succeed.`
          );
          break;
        case options.template === "frontend" ||
          answers.projectType === "frontend":
          spinner.start(
            `Start generating ${answers.projectType} project using ${answers.chooseFrontendFramework} 👾...`
          );

          _resource = _getFrontendResourcePath(answers, _files, options.dir);
          _isPathExist(options.dir);
          _isProjectExist(options.dir, answers.projectName);

          await fse.copy(_resource.sourcePath, _resource.desPath);

          spinner.succeed(
            `Create ${answers.chooseBackendFramework} project succeed.`
          );
          break;
        case options.template === "fullstack" ||
          answers.projectType === "fullstack":
          spinner.start(
            `Start generating ${answers.projectType} project using ${answers.chooseFullStackFramework} 👾...`
          );

          _resource = _getFullStackResourcePath(answers, _files, options.dir);
          _isPathExist(options.dir);
          _isProjectExist(options.dir, answers.projectName);

          await fse.copy(_resource.sourcePath, _resource.desPath);

          spinner.succeed(
            `Create ${answers.chooseBackendFramework} project succeed.`
          );
          break;
      }
    }

    if (answers.addDocker && !answers.addDockerBake) {
      const _dockerResources = _getDockerResources();

      switch (true) {
        case options.template === "backend" ||
          answers.projectType === "backend":
          spinner.start(
            `Start generating ${answers.projectType} project using ${answers.chooseBackendFramework} 👾...`
          );

          _resource = _getBackendResourcePath(answers, _files, options.dir);
          _isPathExist(options.dir);
          _isProjectExist(options.dir, answers.projectName);

          await fse.copy(_resource.sourcePath, _resource.desPath);

          spinner.succeed(
            `Create ${answers.chooseBackendFramework} project succeed.`
          );

          spinner.start("Start copying docker 🐳...");

          _dockerResource = _getDockerComposePath(
            _dockerResources.templates,
            _resource
          );

          await fse.copy(_dockerResource.sourcePath, _dockerResource.desPath);

          spinner.succeed("Adding docker compose file succeed ✅...");

          if (
            answers.chooseBackendFramework !== "Spring Boot" ||
            answers.chooseBackendFramework !== "Laravel"
          ) {
            const _nodeDockerfileResourcePath =
              _getNodeDockerfileResourcePathForBackend(
                answers,
                _dockerResources.dockerfiles,
                _resource
              );

            await fse.copy(
              _nodeDockerfileResourcePath.sourcePath,
              _nodeDockerfileResourcePath.desPath
            );

            spinner.succeed("Adding dockerfile succeed ✅...");
          }

          if (answers.chooseBackendFramework === "Spring Boot") {
            const _javaDockerfileResourcePath = _getJavaDockerfileResourcePath(
              _dockerResources.dockerfiles,
              _resource
            );

            await fse.copy(
              _javaDockerfileResourcePath.sourcePath,
              _javaDockerfileResourcePath.desPath
            );

            spinner.succeed("Adding dockerfile succeed ✅...");
          }

          if (answers.chooseBackendFramework === "Laravel") {
            const _phpDockerfileResourcePath = _getPhpDockerfileResourcePath(
              _dockerResources.dockerfiles,
              _resource
            );

            await fse.copy(
              _phpDockerfileResourcePath.sourcePath,
              _phpDockerfileResourcePath.desPath
            );

            spinner.succeed("Adding dockerfile succeed ✅...");
          }
          break;
        case options.template === "frontend" ||
          answers.projectType === "frontend":
          spinner.start(
            `Start generating ${answers.projectType} project using ${answers.chooseFrontendFramework} 👾...`
          );

          _resource = _getFrontendResourcePath(answers, _files, options.dir);
          _isPathExist(options.dir);
          _isProjectExist(options.dir, answers.projectName);

          await fse.copy(_resource.sourcePath, _resource.desPath);

          spinner.succeed(
            `Create ${answers.chooseFrontendFramework} project succeed.`
          );

          spinner.start("Start copying docker 🐳...");

          _dockerResource = _getDockerComposePath(
            _dockerResources.templates,
            _resource
          );

          await fse.copy(_dockerResource.sourcePath, _dockerResource.desPath);

          spinner.succeed("Adding docker compose file succeed ✅...");

          const _nodeDockerfileResourcePath =
            _getNodeDockerfileResourcePathForFrontend(
              answers,
              _dockerResources.dockerfiles,
              _resource
            );

          await fse.copy(
            _nodeDockerfileResourcePath.sourcePath,
            _nodeDockerfileResourcePath.desPath
          );

          spinner.succeed("Adding dockerfile succeed ✅...");
          break;
        case options.template === "fullstack" ||
          answers.projectType === "fullstack":
          spinner.start(
            `Start generating ${answers.projectType} project using ${answers.chooseFullStackFramework} 👾...`
          );

          _resource = _getFullStackResourcePath(answers, _files, options.dir);
          _isPathExist(options.dir);
          _isProjectExist(options.dir, answers.projectName);

          await fse.copy(_resource.sourcePath, _resource.desPath);

          spinner.succeed(
            `Create ${answers.chooseFullStackFramework} project succeed.`
          );

          spinner.start("Start copying docker 🐳...");

          _dockerResource = _getDockerComposePath(
            _dockerResources.templates,
            _resource
          );

          await fse.copy(_dockerResource.sourcePath, _dockerResource.desPath);

          spinner.succeed("Adding docker compose file succeed ✅...");

          const _dockerfileResource =
            _getNodeDockerfileResourcePathForFullStack(
              answers,
              _dockerResources.dockerfiles,
              _resource
            );

          _dockerfileResource.forEach(async (v) => {
            await fse.copy(v.sourcePath, v.desPath);
          });

          spinner.succeed("Adding dockerfile succeed ✅...");
      }
    }

    if (answers.addDocker && answers.addDockerBake) {
      const _dockerResources = _getDockerResources();

      switch (true) {
        case options.template === "backend" ||
          answers.projectType === "backend":
          spinner.start(
            `Start generating ${answers.projectType} project using ${answers.chooseBackendFramework} 👾...`
          );

          _resource = _getBackendResourcePath(answers, _files, options.dir);
          _isPathExist(options.dir);
          _isProjectExist(options.dir, answers.projectName);

          await fse.copy(_resource.sourcePath, _resource.desPath);

          spinner.succeed(
            `Create ${answers.chooseBackendFramework} project succeed.`
          );

          spinner.start("Start copying docker 🐳...");

          _dockerResource = _getDockerComposePath(
            _dockerResources.templates,
            _resource
          );

          await fse.copy(_dockerResource.sourcePath, _dockerResource.desPath);

          spinner.succeed("Adding docker compose file succeed ✅...");

          if (
            answers.chooseBackendFramework !== "Spring Boot" ||
            answers.chooseBackendFramework !== "Laravel"
          ) {
            const _dockerfileResource =
              _getNodeDockerfileResourcePathForBackend(
                answers,
                _dockerResources.dockerfiles,
                _resource
              );

            await fse.copy(
              _dockerfileResource.sourcePath,
              _dockerfileResource.desPath
            );

            spinner.succeed("Adding dockerfile succeed ✅...");
          }

          if (answers.chooseBackendFramework === "Spring Boot") {
            const _javaDockerfileResourcePath = _getJavaDockerfileResourcePath(
              _dockerResources.dockerfiles,
              _resource
            );

            await fse.copy(
              _javaDockerfileResourcePath.sourcePath,
              _javaDockerfileResourcePath.desPath
            );

            spinner.succeed("Adding dockerfile succeed ✅...");
          }

          if (answers.chooseBackendFramework === "Laravel") {
            const _phpDockerfileResourcePath = _getPhpDockerfileResourcePath(
              _dockerResources.dockerfiles,
              _resource
            );

            await fse.copy(
              _phpDockerfileResourcePath.sourcePath,
              _phpDockerfileResourcePath.desPath
            );

            spinner.succeed("Adding dockerfile succeed ✅...");
          }

          spinner.start("Start generate docker bake 🍞...");

          _dockerBakeResource = _getDockerBakePath(
            _dockerResources.templates,
            _resource
          );

          await fse.copy(
            _dockerBakeResource.sourcePath,
            _dockerBakeResource.desPath
          );

          spinner.succeed("Adding dockerfile succeed ✅...");
          break;
        case options.template === "frontend" ||
          answers.projectType === "frontend":
          spinner.start(
            `Start generating ${answers.projectType} project using ${answers.chooseFrontendFramework} 👾...`
          );

          _resource = _getFrontendResourcePath(answers, _files, options.dir);
          _isPathExist(options.dir);
          _isProjectExist(options.dir, answers.projectName);

          await fse.copy(_resource.sourcePath, _resource.desPath);

          spinner.succeed(
            `Create ${answers.chooseFrontendFramework} project succeed.`
          );

          spinner.start("Start copying docker 🐳...");

          _dockerResource = _getDockerComposePath(
            _dockerResources.templates,
            _resource
          );

          await fse.copy(_dockerResource.sourcePath, _dockerResource.desPath);

          spinner.succeed("Adding docker compose file succeed ✅...");

          const _nodeDockerfileResourcePath =
            _getNodeDockerfileResourcePathForFrontend(
              answers,
              _dockerResources.dockerfiles,
              _resource
            );

          await fse.copy(
            _nodeDockerfileResourcePath.sourcePath,
            _nodeDockerfileResourcePath.desPath
          );

          spinner.succeed("Adding dockerfile succeed ✅...");

          spinner.start("Start generate docker bake 🍞...");

          _dockerBakeResource = _getDockerBakePath(
            _dockerResources.templates,
            _resource
          );

          await fse.copy(
            _dockerBakeResource.sourcePath,
            _dockerBakeResource.desPath
          );

          spinner.succeed("Adding dockerfile succeed ✅...");
          break;
        case options.template === "fullstack" ||
          answers.projectType === "fullstack":
          spinner.start(
            `Start generating ${answers.projectType} project using ${answers.chooseFullStackFramework} 👾...`
          );

          _resource = _getFullStackResourcePath(answers, _files, options.dir);
          _isPathExist(options.dir);
          _isProjectExist(options.dir, answers.projectName);

          await fse.copy(_resource.sourcePath, _resource.desPath);

          spinner.succeed(
            `Create ${answers.chooseFullStackFramework} project succeed.`
          );

          spinner.start("Start copying docker 🐳...");

          _dockerResource = _getDockerComposePath(
            _dockerResources.templates,
            _resource
          );

          await fse.copy(_dockerResource.sourcePath, _dockerResource.desPath);

          spinner.succeed("Adding docker compose file succeed ✅...");

          const _dockerfileResource =
            _getNodeDockerfileResourcePathForFullStack(
              answers,
              _dockerResources.dockerfiles,
              _resource
            );

          _dockerfileResource.forEach(async (v) => {
            await fse.copy(v.sourcePath, v.desPath);
          });

          spinner.succeed("Adding dockerfile succeed ✅...");

          spinner.start("Start generate docker bake 🍞...");

          _dockerBakeResource = _getDockerBakePath(
            _dockerResources.templates,
            _resource
          );

          await fse.copy(
            _dockerBakeResource.sourcePath,
            _dockerBakeResource.desPath
          );
      }
    }

    const end = performance.now();
    spinner.succeed(`✅ All done! ${(end - start).toFixed(3)} ms`);

    console.log(
      `You can check the project on ${chalk.bold(_resource?.desPath)}`
    );
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

function _getBackendFolder(
  answers: { [x: string]: any },
  files: fs.Dirent<string>[]
) {
  const _getResource = _defaultBackendFrameworks.frameworks.filter(
    (f) => f.name === answers.chooseBackendFramework
  )[0];
  const _folder = files.filter(
    (f) => f.name === _getResource.templateName && f.isDirectory()
  )[0];

  return {
    folder: _folder,
  };
}

function _getFrontendFolder(
  answers: { [x: string]: any },
  files: fs.Dirent<string>[]
) {
  const _getResource = _defaultFrontendFrameworks.frameworks.filter(
    (f) => f.name === answers.chooseFrontendFramework
  )[0];
  const _folders = files.filter(
    (f) => f.name === _getResource.templateName && f.isDirectory()
  )[0];

  return {
    folder: _folders,
  };
}

function _getFullStackFolder(
  answers: { [x: string]: any },
  files: fs.Dirent<string>[]
) {
  const _getResource = _defaultFullStackFrameworks.frameworks.filter(
    (f) => f.name === answers.chooseFullStackFramework
  )[0];
  const _folders = files.filter(
    (f) => f.name === _getResource.templateName && f.isDirectory()
  )[0];

  return {
    folder: _folders,
  };
}

function _getBackendResourcePath(
  answers: { [x: string]: any },
  files: fs.Dirent<string>[],
  dir: string
): _ProjectResourcePath {
  const _getResource = _defaultBackendFrameworks.frameworks.filter(
    (f) => f.name === answers.chooseBackendFramework
  )[0];
  const _folder = files.filter(
    (f) => f.name === _getResource.templateName && f.isDirectory()
  )[0];

  const _sourcePath = path.join(_folder.parentPath, _folder.name);
  const _desPath = path.join(dir, _renewalProjectName(answers.projectName));

  return {
    sourcePath: _sourcePath,
    desPath: _desPath,
  };
}

function _getFrontendResourcePath(
  answers: { [x: string]: any },
  files: fs.Dirent<string>[],
  dir: string
): _ProjectResourcePath {
  const _getResource = _defaultFrontendFrameworks.frameworks.filter(
    (f) => f.name === answers.chooseFrontendFramework
  )[0];
  const _folder = files.filter(
    (f) => f.name === _getResource.templateName && f.isDirectory()
  )[0];

  const _sourcePath = path.join(_folder.parentPath, _folder.name);
  const _desPath = path.join(dir, _renewalProjectName(answers.projectName));

  return {
    sourcePath: _sourcePath,
    desPath: _desPath,
  };
}

function _getFullStackResourcePath(
  answers: { [x: string]: any },
  files: fs.Dirent<string>[],
  dir: string
): _ProjectResourcePath {
  const _getResource = _defaultFullStackFrameworks.frameworks.filter(
    (f) => f.name === answers.chooseFullStackFramework
  )[0];
  const _folder = files.filter(
    (f) => f.name === _getResource.templateName && f.isDirectory()
  )[0];

  const _sourcePath = path.join(_folder.parentPath, _folder.name);
  const _desPath = path.join(dir, _renewalProjectName(answers.projectName));

  return {
    sourcePath: _sourcePath,
    desPath: _desPath,
  };
}

function _getDockerResources(): _DockerResources {
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
  resource: _ProjectResourcePath
): _ProjectResourcePath {
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
  resource: _ProjectResourcePath
): _ProjectResourcePath {
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

function _getNodeDockerfileResourcePathForBackend(
  answers: { [x: string]: any },
  dockerfiles: fs.Dirent<string>[],
  resource: _ProjectResourcePath
): _ProjectResourcePath {
  let _dockerfileSourcePath: string = "";
  let _dockerfileDesPath: string = "";
  let _nodeDockerfile: fs.Dirent<string> = new Dirent<string>();

  switch (answers.chooseBackendFramework) {
    case "NestJS":
      _nodeDockerfile = dockerfiles.filter(
        (f) => f.name === "node-pnpm.template.Dockerfile"
      )[0];

      _dockerfileSourcePath = path.join(
        _nodeDockerfile.parentPath,
        _nodeDockerfile.name
      );

      _dockerfileDesPath = path.join(resource.desPath, _nodeDockerfile.name);
      break;
    case "Express.js":
      _nodeDockerfile = dockerfiles.filter(
        (f) => f.name === "node.template.Dockerfile"
      )[0];

      _dockerfileSourcePath = path.join(
        _nodeDockerfile.parentPath,
        _nodeDockerfile.name
      );

      _dockerfileDesPath = path.join(resource.desPath, _nodeDockerfile.name);
      break;
    default:
      _nodeDockerfile = dockerfiles.filter(
        (f) => f.name === "node.template.Dockerfile"
      )[0];

      _dockerfileSourcePath = path.join(
        _nodeDockerfile.parentPath,
        _nodeDockerfile.name
      );

      _dockerfileDesPath = path.join(resource.desPath, _nodeDockerfile.name);
      break;
  }

  return {
    sourcePath: _dockerfileSourcePath,
    desPath: _dockerfileDesPath,
  };
}

function _getNodeDockerfileResourcePathForFrontend(
  answers: { [x: string]: any },
  dockerfiles: fs.Dirent<string>[],
  resource: _ProjectResourcePath
): _ProjectResourcePath {
  let _dockerfileSourcePath: string = "";
  let _dockerfileDesPath: string = "";
  let _nodeDockerfile: fs.Dirent<string> = new Dirent<string>();

  switch (answers.chooseFrontendFramework) {
    case "Next.js":
      _nodeDockerfile = dockerfiles.filter(
        (f) => f.name === "node.template.Dockerfile"
      )[0];

      _dockerfileSourcePath = path.join(
        _nodeDockerfile.parentPath,
        _nodeDockerfile.name
      );

      _dockerfileDesPath = path.join(resource.desPath, _nodeDockerfile.name);
      break;
    case "Vue.js":
      _nodeDockerfile = dockerfiles.filter(
        (f) => f.name === "node-pnpm.template.Dockerfile"
      )[0];

      _dockerfileSourcePath = path.join(
        _nodeDockerfile.parentPath,
        _nodeDockerfile.name
      );

      _dockerfileDesPath = path.join(resource.desPath, _nodeDockerfile.name);
      break;
    default:
      _nodeDockerfile = dockerfiles.filter(
        (f) => f.name === "node.template.Dockerfile"
      )[0];

      _dockerfileSourcePath = path.join(
        _nodeDockerfile.parentPath,
        _nodeDockerfile.name
      );

      _dockerfileDesPath = path.join(resource.desPath, _nodeDockerfile.name);
      break;
  }

  return {
    sourcePath: _dockerfileSourcePath,
    desPath: _dockerfileDesPath,
  };
}

function _getNodeDockerfileResourcePathForFullStack(
  answers: { [x: string]: any },
  dockerfiles: fs.Dirent<string>[],
  resource: _ProjectResourcePath
) {
  let _dockerfileFullStackResourcePath: Array<_ProjectResourcePath> = [];
  let _dockerfileSourcePath: string = "";
  let _dockerfileDesPath: string = "";

  const _fullStackPath = path.join(resource.sourcePath, "www");
  const _fullStackFiles = fs
    .readdirSync(_fullStackPath, {
      withFileTypes: true,
    })
    .filter((f) => f.isDirectory());

  if (answers.chooseFullStackFramework === "Next.js + NestJS") {
    _fullStackFiles.forEach((f) => {
      switch (f.name) {
        case "next-frontend":
          const _nextResourceDesPath = path.join(resource.desPath, "www");
          const _nextFrontendPath = path.join(_nextResourceDesPath, f.name);

          const _nextDockerfile = dockerfiles.filter(
            (f) => f.name === "node.template.Dockerfile"
          )[0];

          _dockerfileSourcePath = path.join(
            _nextDockerfile.parentPath,
            _nextDockerfile.name
          );

          _dockerfileDesPath = path.join(
            _nextFrontendPath,
            _nextDockerfile.name
          );

          _dockerfileFullStackResourcePath.push({
            sourcePath: _dockerfileSourcePath,
            desPath: _dockerfileDesPath,
          });
          break;
        case "nest-backend":
          const _nestResourceDesPath = path.join(resource.desPath, "www");
          const _nestBackendPath = path.join(_nestResourceDesPath, f.name);

          const _nestDockerfile = dockerfiles.filter(
            (f) => f.name === "node-pnpm.template.Dockerfile"
          )[0];

          _dockerfileSourcePath = path.join(
            _nestDockerfile.parentPath,
            _nestDockerfile.name
          );

          _dockerfileDesPath = path.join(
            _nestBackendPath,
            _nestDockerfile.name
          );

          _dockerfileFullStackResourcePath.push({
            sourcePath: _dockerfileSourcePath,
            desPath: _dockerfileDesPath,
          });
          break;
      }
    });
  }

  if (answers.chooseFullStackFramework === "Vue.js + NestJS") {
    _fullStackFiles.forEach((f) => {
      switch (f.name) {
        case "vue-frontend":
          const _vueResourceDesPath = path.join(resource.desPath, "www");
          const _vueFrontendPath = path.join(_vueResourceDesPath, f.name);

          const _vueDockerfile = dockerfiles.filter(
            (f) => f.name === "node-pnpm.template.Dockerfile"
          )[0];

          _dockerfileSourcePath = path.join(
            _vueDockerfile.parentPath,
            _vueDockerfile.name
          );

          _dockerfileDesPath = path.join(_vueFrontendPath, _vueDockerfile.name);

          _dockerfileFullStackResourcePath.push({
            sourcePath: _dockerfileSourcePath,
            desPath: _dockerfileDesPath,
          });
          break;
        case "nest-backend":
          const _nestResourceDesPath = path.join(resource.desPath, "www");
          const _nestBackendPath = path.join(_nestResourceDesPath, f.name);

          const _nestDockerfile = dockerfiles.filter(
            (f) => f.name === "node-pnpm.template.Dockerfile"
          )[0];

          _dockerfileSourcePath = path.join(
            _nestDockerfile.parentPath,
            _nestDockerfile.name
          );

          _dockerfileDesPath = path.join(
            _nestBackendPath,
            _nestDockerfile.name
          );

          _dockerfileFullStackResourcePath.push({
            sourcePath: _dockerfileSourcePath,
            desPath: _dockerfileDesPath,
          });
          break;
      }
    });
  }

  return _dockerfileFullStackResourcePath;
}

function _getJavaDockerfileResourcePath(
  dockerfiles: fs.Dirent<string>[],
  resource: _ProjectResourcePath
): _ProjectResourcePath {
  const _javaDockerfile = dockerfiles.filter(
    (f) => f.name === "java.template.Dockerfile"
  )[0];

  const _dockerfileSourcePath = path.join(
    _javaDockerfile.parentPath,
    _javaDockerfile.name
  );
  const _dockerfileDesPath = path.join(resource.desPath, _javaDockerfile.name);

  return {
    sourcePath: _dockerfileSourcePath,
    desPath: _dockerfileDesPath,
  };
}

function _getPhpDockerfileResourcePath(
  dockerfiles: fs.Dirent<string>[],
  resource: _ProjectResourcePath
): _ProjectResourcePath {
  const _phpDockerfile = dockerfiles.filter(
    (f) => f.name === "php.template.Dockerfile"
  )[0];

  const _dockerfileSourcePath = path.join(
    _phpDockerfile.parentPath,
    _phpDockerfile.name
  );
  const _dockerfileDesPath = path.join(resource.desPath, _phpDockerfile.name);

  return {
    sourcePath: _dockerfileSourcePath,
    desPath: _dockerfileDesPath,
  };
}
