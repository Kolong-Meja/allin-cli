import { __ProjectResourcePathProps } from "../../types/default.js";
import {
  PathNotFoundError,
  UnableOverwriteError,
} from "../../exceptions/custom.js";
import { _pathNotFound, _unableOverwrite } from "../../exceptions/trigger.js";
import { __userrealname, _basePath } from "../../config.js";
import {
  _backendFrameworks,
  _frontendFrameworks,
  _fullstackFrameworks,
} from "../../constants/default.js";
import { _createCommandQuestionPrompt } from "../prompts/create.js";

import chalk from "chalk";
import { OptionValues } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import fs from "fs";
import fse from "fs-extra";
import { __renewProjectName } from "../../utils/string.js";

export async function _createCommand(options: OptionValues): Promise<void> {
  const _projectTemplateQuestions = await inquirer.prompt(
    _createCommandQuestionPrompt(options.template)
  );

  const spinner = ora({
    spinner: "dots11",
    color: "green",
    interval: 100,
  });

  const start = performance.now();
  spinner.start("Start generating...");

  try {
    const _dirPath = options.template
      ? path.join(_basePath, "src/templates", options.template)
      : path.join(
          _basePath,
          "src/templates",
          _projectTemplateQuestions.projectType
        );
    _pathNotFound(_dirPath);

    const _files = fs.readdirSync(_dirPath, {
      withFileTypes: true,
    });

    _pathNotFound(options.dir);

    if (!_projectTemplateQuestions.addDocker) {
      if (
        options.template === "backend" ||
        _projectTemplateQuestions.projectType === "backend"
      ) {
        spinner.start(
          `Allright ${chalk.bold(
            __userrealname.split(" ")[0]
          )}, We are start generating ${
            _projectTemplateQuestions.chooseBackendFramework
          } for you 👾...`
        );

        const _backendResource = _backendFrameworks.frameworks.filter(
          (f) => f.name === _projectTemplateQuestions.chooseBackendFramework
        )[0];

        const _backendFolder = _files.filter(
          (f) => f.name === _backendResource.templateName && f.isDirectory()
        )[0];

        const _backendSourcePath = path.join(
          _backendFolder.parentPath,
          _backendFolder.name
        );

        const _backendDesPath = path.join(
          options.dir,
          __renewProjectName(_projectTemplateQuestions.projectName)
        );

        _unableOverwrite(_backendDesPath);

        await fse.copy(_backendSourcePath, _backendDesPath);

        spinner.succeed(
          `${_projectTemplateQuestions.chooseBackendFramework} project successfully created ✅`
        );

        spinner.info(
          `You can check the project on ${chalk.bold(_backendDesPath)}`
        );
      } else if (
        options.template === "frontend" ||
        _projectTemplateQuestions.projectType === "frontend"
      ) {
        spinner.start(
          `Allright ${chalk.bold(
            __userrealname.split(" ")[0]
          )}, We are start generating ${
            _projectTemplateQuestions.chooseFrontendFramework
          } project for you  👾...`
        );

        const _frontendResource = _frontendFrameworks.frameworks.filter(
          (f) => f.name === _projectTemplateQuestions.chooseFrontendFramework
        )[0];

        const _frontendFolder = _files.filter(
          (f) => f.name === _frontendResource.templateName && f.isDirectory()
        )[0];

        const _frontendSourcePath = path.join(
          _frontendFolder.parentPath,
          _frontendFolder.name
        );

        const _frontendDesPath = path.join(
          options.dir,
          __renewProjectName(_projectTemplateQuestions.projectName)
        );

        _unableOverwrite(_frontendDesPath);

        await fse.copy(_frontendSourcePath, _frontendDesPath);

        spinner.succeed(
          `${_projectTemplateQuestions.chooseFrontendFramework} project successfully created ✅`
        );

        spinner.info(
          `You can check the project on ${chalk.bold(_frontendDesPath)}`
        );
      } else {
        spinner.start(
          `Allright ${chalk.bold(
            __userrealname.split(" ")[0]
          )}, We are start generating ${
            _projectTemplateQuestions.chooseFullStackFramework
          } project for you  👾...`
        );

        const _fullstackResource = _fullstackFrameworks.frameworks.filter(
          (f) => f.name === _projectTemplateQuestions.chooseFullStackFramework
        )[0];

        const _fullstackFolder = _files.filter(
          (f) => f.name === _fullstackResource.templateName && f.isDirectory()
        )[0];

        const _fullstackSourcePath = path.join(
          _fullstackFolder.parentPath,
          _fullstackFolder.name
        );

        const _fullstackDesPath = path.join(
          options.dir,
          __renewProjectName(_projectTemplateQuestions.projectName)
        );

        _unableOverwrite(_fullstackDesPath);

        await fse.copy(_fullstackSourcePath, _fullstackDesPath);

        spinner.succeed(
          `${_projectTemplateQuestions.chooseFullStackFramework} project successfully created ✅`
        );

        spinner.info(
          `You can check the project on ${chalk.bold(_fullstackDesPath)}`
        );
      }
    }

    // if (!_projectTemplateQuestions.addDockerBake) {
    //   const _dockerResources = _getDockerResources();

    //   if (
    //     options.template === "backend" ||
    //     _projectTemplateQuestions.projectType === "backend"
    //   ) {
    //     spinner.start(
    //       `Allright ${chalk.bold(
    //         __userrealname.split(" ")[0]
    //       )}, We are start generating ${
    //         _projectTemplateQuestions.projectType
    //       } project using ${
    //         _projectTemplateQuestions.chooseBackendFramework
    //       } 👾...`
    //     );

    //     const _backendResource = _getResourcePath(
    //       "backend",
    //       _projectTemplateQuestions,
    //       _files,
    //       options.dir
    //     );
    //     _isPathExist(options.dir);

    //     await fse.copy(_backendResource.sourcePath, _backendResource.desPath);

    //     spinner.succeed(
    //       `Create ${_projectTemplateQuestions.chooseBackendFramework} project succeed ✅`
    //     );

    //     spinner.start("Start copying docker compose 🐳...");

    //     const _dockerComposePathBackend = _getDockerComposePath(
    //       _dockerResources,
    //       _backendResource
    //     );

    //     await fse.copy(
    //       _dockerComposePathBackend.sourcePath,
    //       _dockerComposePathBackend.desPath
    //     );

    //     spinner.succeed("Adding docker compose file succeed ✅");

    //     switch (_projectTemplateQuestions.chooseBackendFramework) {
    //       case "Spring Boot":
    //         spinner.start("Start copying dockerfile 🐳...");

    //         const _javaDockerfileResourcePath = _getDockerfileResourcePath(
    //           "java",
    //           _dockerResources,
    //           _backendResource
    //         );

    //         await fse.copy(
    //           _javaDockerfileResourcePath.sourcePath,
    //           _javaDockerfileResourcePath.desPath
    //         );

    //         spinner.succeed("Adding dockerfile succeed ✅");
    //         break;
    //       case "Laravel":
    //         spinner.start("Start copying dockerfile 🐳...");

    //         const _phpDockerfileResourcePath = _getDockerfileResourcePath(
    //           "php",
    //           _dockerResources,
    //           _backendResource
    //         );

    //         await fse.copy(
    //           _phpDockerfileResourcePath.sourcePath,
    //           _phpDockerfileResourcePath.desPath
    //         );

    //         spinner.succeed("Adding dockerfile succeed ✅");
    //         break;
    //       default:
    //         spinner.start("Start copying dockerfile 🐳...");

    //         const _npmDockerfileResourcePath = _getDockerfileResourcePath(
    //           "npm",
    //           _dockerResources,
    //           _backendResource
    //         );

    //         await fse.copy(
    //           _npmDockerfileResourcePath.sourcePath,
    //           _npmDockerfileResourcePath.desPath
    //         );

    //         spinner.succeed("Adding dockerfile succeed ✅");
    //         break;
    //     }
    //   } else if (
    //     options.template === "frontend" ||
    //     _projectTemplateQuestions.projectType === "frontend"
    //   ) {
    //     spinner.start(
    //       `Allright ${chalk.bold(
    //         __userrealname.split(" ")[0]
    //       )}, We are start generating ${
    //         _projectTemplateQuestions.projectType
    //       } project using ${
    //         _projectTemplateQuestions.chooseFrontendFramework
    //       } 👾...`
    //     );

    //     const _frontendResource = _getResourcePath(
    //       "frontend",
    //       _projectTemplateQuestions,
    //       _files,
    //       options.dir
    //     );
    //     _isPathExist(options.dir);

    //     await fse.copy(_frontendResource.sourcePath, _frontendResource.desPath);

    //     spinner.succeed(
    //       `Create ${_projectTemplateQuestions.chooseFrontendFramework} project succeed ✅`
    //     );

    //     spinner.start("Start copying docker compose 🐳...");

    //     const _dockerComposePathFrontend = _getDockerComposePath(
    //       _dockerResources,
    //       _frontendResource
    //     );

    //     await fse.copy(
    //       _dockerComposePathFrontend.sourcePath,
    //       _dockerComposePathFrontend.desPath
    //     );

    //     spinner.succeed("Adding docker compose file succeed ✅");

    //     spinner.start("Start copying dockerfile 🐳...");

    //     const _npmDockerfileResourcePath = _getDockerfileResourcePath(
    //       "npm",
    //       _dockerResources,
    //       _frontendResource
    //     );

    //     await fse.copy(
    //       _npmDockerfileResourcePath.sourcePath,
    //       _npmDockerfileResourcePath.desPath
    //     );

    //     spinner.succeed("Adding dockerfile succeed ✅");
    //   } else {
    //     spinner.start(
    //       `Allright ${chalk.bold(
    //         __userrealname.split(" ")[0]
    //       )}, We are start generating ${
    //         _projectTemplateQuestions.projectType
    //       } project using ${
    //         _projectTemplateQuestions.chooseFullStackFramework
    //       } 👾...`
    //     );

    //     const _fullstackResource = _getResourcePath(
    //       "fullstack",
    //       _projectTemplateQuestions,
    //       _files,
    //       options.dir
    //     );
    //     _isPathExist(options.dir);

    //     await fse.copy(
    //       _fullstackResource.sourcePath,
    //       _fullstackResource.desPath
    //     );

    //     spinner.succeed(
    //       `Create ${_projectTemplateQuestions.chooseFullStackFramework} project succeed ✅`
    //     );

    //     spinner.start("Start copying docker compose 🐳...");

    //     const _dockerComposePathFullstack = _getDockerComposePath(
    //       _dockerResources,
    //       _fullstackResource
    //     );

    //     await fse.copy(
    //       _dockerComposePathFullstack.sourcePath,
    //       _dockerComposePathFullstack.desPath
    //     );

    //     spinner.succeed("Adding docker compose file succeed ✅");

    //     spinner.start("Start copying dockerfile 🐳...");

    //     const _dockerfileResource = _getDockerfileResourcePathForFullStack(
    //       _projectTemplateQuestions,
    //       _dockerResources,
    //       _fullstackResource
    //     ) as __ProjectResourcePathProps[];

    //     _dockerfileResource.forEach(async (v) => {
    //       await fse.copy(v.sourcePath, v.desPath);
    //     });

    //     spinner.succeed("Adding dockerfile succeed ✅");
    //   }
    // }

    // if (
    //   _projectTemplateQuestions.addDocker &&
    //   _projectTemplateQuestions.addDockerBake
    // ) {
    //   const _dockerResources = _getDockerResources();

    //   switch (true) {
    //     case options.template === "backend" ||
    //       _projectTemplateQuestions.projectType === "backend":
    //       spinner.start(
    //         `Allright ${chalk.bold(
    //           __userrealname.split(" ")[0]
    //         )}, We are start generating ${
    //           _projectTemplateQuestions.projectType
    //         } project using ${
    //           _projectTemplateQuestions.chooseBackendFramework
    //         } 👾...`
    //       );

    //       const _backendResource = _getResourcePath(
    //         "backend",
    //         _projectTemplateQuestions,
    //         _files,
    //         options.dir
    //       );
    //       _isPathExist(options.dir);

    //       await fse.copy(_backendResource.sourcePath, _backendResource.desPath);

    //       spinner.succeed(
    //         `Create ${_projectTemplateQuestions.chooseBackendFramework} project succeed ✅`
    //       );

    //       spinner.start("Start copying docker 🐳...");

    //       const _dockerComposePathBackend = _getDockerComposePath(
    //         _dockerResources,
    //         _backendResource
    //       );

    //       await fse.copy(
    //         _dockerComposePathBackend.sourcePath,
    //         _dockerComposePathBackend.desPath
    //       );

    //       spinner.succeed("Adding docker compose file succeed ✅");

    //       switch (_projectTemplateQuestions.chooseBackendFramework) {
    //         case "Spring Boot":
    //           spinner.start("Start copying dockerfile 🐳...");

    //           const _javaDockerfileResourcePath = _getDockerfileResourcePath(
    //             "java",
    //             _dockerResources,
    //             _backendResource
    //           );

    //           await fse.copy(
    //             _javaDockerfileResourcePath.sourcePath,
    //             _javaDockerfileResourcePath.desPath
    //           );

    //           spinner.succeed("Adding dockerfile succeed ✅");
    //           break;
    //         case "Laravel":
    //           spinner.start("Start copying dockerfile 🐳...");

    //           const _phpDockerfileResourcePath = _getDockerfileResourcePath(
    //             "php",
    //             _dockerResources,
    //             _backendResource
    //           );

    //           await fse.copy(
    //             _phpDockerfileResourcePath.sourcePath,
    //             _phpDockerfileResourcePath.desPath
    //           );

    //           spinner.succeed("Adding dockerfile succeed ✅");
    //           break;
    //         default:
    //           spinner.start("Start copying dockerfile 🐳...");

    //           const _npmDockerfileResourcePath = _getDockerfileResourcePath(
    //             "npm",
    //             _dockerResources,
    //             _backendResource
    //           );

    //           await fse.copy(
    //             _npmDockerfileResourcePath.sourcePath,
    //             _npmDockerfileResourcePath.desPath
    //           );

    //           spinner.succeed("Adding dockerfile succeed ✅");
    //           break;
    //       }

    //       spinner.start("Start generate docker bake 🍞...");

    //       const _dockerBakePathBackend = _getDockerBakePath(
    //         _dockerResources,
    //         _backendResource
    //       );

    //       await fse.copy(
    //         _dockerBakePathBackend.sourcePath,
    //         _dockerBakePathBackend.desPath
    //       );

    //       spinner.succeed("Adding docker bake file succeed ✅");
    //       break;
    //     case options.template === "frontend" ||
    //       _projectTemplateQuestions.projectType === "frontend":
    //       spinner.start(
    //         `Allright ${chalk.bold(
    //           __userrealname.split(" ")[0]
    //         )}, We are start generating ${
    //           _projectTemplateQuestions.projectType
    //         } project using ${
    //           _projectTemplateQuestions.chooseFrontendFramework
    //         } 👾...`
    //       );

    //       const _frontendResource = _getResourcePath(
    //         "frontend",
    //         _projectTemplateQuestions,
    //         _files,
    //         options.dir
    //       );
    //       _isPathExist(options.dir);

    //       await fse.copy(
    //         _frontendResource.sourcePath,
    //         _frontendResource.desPath
    //       );

    //       spinner.succeed(
    //         `Create ${_projectTemplateQuestions.chooseFrontendFramework} project succeed ✅`
    //       );

    //       spinner.start("Start copying docker 🐳...");

    //       const _dockerComposePathFrontend = _getDockerComposePath(
    //         _dockerResources,
    //         _frontendResource
    //       );

    //       await fse.copy(
    //         _dockerComposePathFrontend.sourcePath,
    //         _dockerComposePathFrontend.desPath
    //       );

    //       spinner.succeed("Adding docker compose file succeed ✅");

    //       spinner.start("Start copying dockerfile 🐳...");

    //       const _npmDockerfileResourcePath = _getDockerfileResourcePath(
    //         "npm",
    //         _dockerResources,
    //         _frontendResource
    //       );

    //       await fse.copy(
    //         _npmDockerfileResourcePath.sourcePath,
    //         _npmDockerfileResourcePath.desPath
    //       );

    //       spinner.succeed("Adding dockerfile succeed ✅");

    //       spinner.start("Start generate docker bake 🍞...");

    //       const _dockerBakePathFrontend = _getDockerBakePath(
    //         _dockerResources,
    //         _frontendResource
    //       );

    //       await fse.copy(
    //         _dockerBakePathFrontend.sourcePath,
    //         _dockerBakePathFrontend.desPath
    //       );

    //       spinner.succeed("Adding docker bake file succeed ✅");
    //       break;
    //     case options.template === "fullstack" ||
    //       _projectTemplateQuestions.projectType === "fullstack":
    //       spinner.start(
    //         `Allright ${chalk.bold(
    //           __userrealname.split(" ")[0]
    //         )}, We are start generating ${
    //           _projectTemplateQuestions.projectType
    //         } project using ${
    //           _projectTemplateQuestions.chooseFullStackFramework
    //         } 👾...`
    //       );

    //       const _fullstackResource = _getResourcePath(
    //         "fullstack",
    //         _projectTemplateQuestions,
    //         _files,
    //         options.dir
    //       );
    //       _isPathExist(options.dir);

    //       await fse.copy(
    //         _fullstackResource.sourcePath,
    //         _fullstackResource.desPath
    //       );

    //       spinner.succeed(
    //         `Create ${_projectTemplateQuestions.chooseFullStackFramework} project succeed ✅`
    //       );

    //       spinner.start("Start copying docker 🐳...");

    //       const _dockerComposePathFullstack = _getDockerComposePath(
    //         _dockerResources,
    //         _fullstackResource
    //       );

    //       await fse.copy(
    //         _dockerComposePathFullstack.sourcePath,
    //         _dockerComposePathFullstack.desPath
    //       );

    //       spinner.succeed("Adding docker compose file succeed ✅");

    //       spinner.start("Start copying dockerfile 🐳...");

    //       const _dockerfileResource = _getDockerfileResourcePathForFullStack(
    //         _projectTemplateQuestions,
    //         _dockerResources,
    //         _fullstackResource
    //       ) as __ProjectResourcePathProps[];

    //       _dockerfileResource.forEach(async (v) => {
    //         await fse.copy(v.sourcePath, v.desPath);
    //       });

    //       spinner.succeed("Adding dockerfile succeed ✅");

    //       spinner.start("Start generate docker bake 🍞...");

    //       const _dockerBakePathFullstack = _getDockerBakePath(
    //         _dockerResources,
    //         _fullstackResource
    //       );

    //       await fse.copy(
    //         _dockerBakePathFullstack.sourcePath,
    //         _dockerBakePathFullstack.desPath
    //       );

    //       spinner.succeed("Adding docker bake file succeed ✅");
    //       break;
    //   }
    // }

    const end = performance.now();
    spinner.succeed(`All done! ${(end - start).toFixed(3)} ms`);
  } catch (error: any) {
    spinner.fail("⛔️ Failed to generate...\n");

    let errorMessage =
      error instanceof Error ? error.message : "⛔️ An unknown error occurred.";

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

function _getDockerResources() {
  const _dockerTemplatesPath = path.join(_basePath, "src/templates/docker");
  _pathNotFound(_dockerTemplatesPath);

  const _dockerSources = fs.readdirSync(_dockerTemplatesPath, {
    withFileTypes: true,
  });

  return _dockerSources;
}

function _getDockerComposePath(
  templates: fs.Dirent<string>[],
  resource: __ProjectResourcePathProps
): __ProjectResourcePathProps {
  const _dockerComposeFile = templates.filter(
    (f) => f.name === "compose.yml"
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
    (f) => f.name === "docker-bake.hcl"
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

  switch (answers.chooseFullStackFramework) {
    case "Next.js + NestJS":
      let _nextNestDockerfileResourcePath: __ProjectResourcePathProps[] = [];

      for (const f of _fullstackFolders) {
        const _desPath = path.join(resource.desPath, "www");
        const _projectPath = path.join(_desPath, f.name);

        const _nodeDockerfile = dockerfiles.filter(
          (f) => f.name === "node.template.Dockerfile"
        )[0];

        const _nodeDockerfileSourcePath = path.join(
          _nodeDockerfile.parentPath,
          _nodeDockerfile.name
        );

        const _nodeDockerfileDesPath = path.join(
          _projectPath,
          _nodeDockerfile.name
        );

        _nextNestDockerfileResourcePath.push({
          sourcePath: _nodeDockerfileSourcePath,
          desPath: _nodeDockerfileDesPath,
        });
      }
      return _nextNestDockerfileResourcePath;
    case "Next.js + Express.js":
      let _nextExpressDockerfileResourcePath: __ProjectResourcePathProps[] = [];

      for (const f of _fullstackFolders) {
        const _desPath = path.join(resource.desPath, "www");
        const _projectPath = path.join(_desPath, f.name);

        const _nodeDockerfile = dockerfiles.filter(
          (f) => f.name === "node.template.Dockerfile"
        )[0];

        const _nodeDockerfileSourcePath = path.join(
          _nodeDockerfile.parentPath,
          _nodeDockerfile.name
        );

        const _nodeDockerfileDesPath = path.join(
          _projectPath,
          _nodeDockerfile.name
        );

        _nextExpressDockerfileResourcePath.push({
          sourcePath: _nodeDockerfileSourcePath,
          desPath: _nodeDockerfileDesPath,
        });
      }
      return _nextExpressDockerfileResourcePath;
    case "Vue.js + NestJS":
      let _vueNestDockerfileResourcePath: __ProjectResourcePathProps[] = [];

      for (const f of _fullstackFolders) {
        const _desPath = path.join(resource.desPath, "www");
        const _projectPath = path.join(_desPath, f.name);

        const _nodeDockerfile = dockerfiles.filter(
          (f) => f.name === "node.template.Dockerfile"
        )[0];

        const _nodeDockerfileSourcePath = path.join(
          _nodeDockerfile.parentPath,
          _nodeDockerfile.name
        );

        const _nodeDockerfileDesPath = path.join(
          _projectPath,
          _nodeDockerfile.name
        );

        _vueNestDockerfileResourcePath.push({
          sourcePath: _nodeDockerfileSourcePath,
          desPath: _nodeDockerfileDesPath,
        });
      }
      return _vueNestDockerfileResourcePath;
    case "Vue.js + Laravel":
      let _vueLaravelDockerfileResourcePath: __ProjectResourcePathProps[] = [];

      for (const f of _fullstackFolders) {
        if (f.name !== "laravel-backend") {
          const _desPath = path.join(resource.desPath, "www");
          const _projectPath = path.join(_desPath, f.name);

          const _phpDockerfile = dockerfiles.filter(
            (f) => f.name === "node.template.Dockerfile"
          )[0];

          const _phpDockerfileSourcePath = path.join(
            _phpDockerfile.parentPath,
            _phpDockerfile.name
          );

          const _phpDockerfileDesPath = path.join(
            _projectPath,
            _phpDockerfile.name
          );

          _vueLaravelDockerfileResourcePath.push({
            sourcePath: _phpDockerfileSourcePath,
            desPath: _phpDockerfileDesPath,
          });
        } else {
          const _desPath = path.join(resource.desPath, "www");
          const _projectPath = path.join(_desPath, f.name);

          const _vueDockerfile = dockerfiles.filter(
            (f) => f.name === "php.template.Dockerfile"
          )[0];

          const _vueDockerfileSourcePath = path.join(
            _vueDockerfile.parentPath,
            _vueDockerfile.name
          );

          const _vueDockerfileDesPath = path.join(
            _projectPath,
            _vueDockerfile.name
          );

          _vueLaravelDockerfileResourcePath.push({
            sourcePath: _vueDockerfileSourcePath,
            desPath: _vueDockerfileDesPath,
          });
        }
      }
      return _vueLaravelDockerfileResourcePath;
  }
}

function _getDockerfileResourcePath(
  origin: "npm" | "pnpm" | "java" | "php",
  dockerfiles: fs.Dirent<string>[],
  resource: __ProjectResourcePathProps
): __ProjectResourcePathProps {
  switch (origin) {
    case "npm":
      const _npmDockerfile = dockerfiles.filter(
        (f) => f.name === "node.Dockerfile"
      )[0];

      const _npmDockerfileSourcePath = path.join(
        _npmDockerfile.parentPath,
        _npmDockerfile.name
      );

      const _npmDockerfileDesPath = path.join(
        resource.desPath,
        _npmDockerfile.name
      );

      return {
        sourcePath: _npmDockerfileSourcePath,
        desPath: _npmDockerfileDesPath,
      };
    case "pnpm":
      const _pnpmDockerfile = dockerfiles.filter(
        (f) => f.name === "node.Dockerfile"
      )[0];

      const _pnpmDockerfileSourcePath = path.join(
        _pnpmDockerfile.parentPath,
        _pnpmDockerfile.name
      );

      const _pnpmDockerfileDesPath = path.join(
        resource.desPath,
        _pnpmDockerfile.name
      );

      return {
        sourcePath: _pnpmDockerfileSourcePath,
        desPath: _pnpmDockerfileDesPath,
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
