import {
  _backendFrameworks,
  _frontendFrameworks,
  _fullstackFrameworks,
  _projectTypes,
} from "../../constants/default.js";
import { _updateCommandQuestionPrompt } from "../prompts/update.js";
import { _pathNotFound } from "../../exceptions/trigger.js";
import { _basePath } from "../../config.js";
import {
  PathNotFoundError,
  UnableOverwriteError,
} from "../../exceptions/custom.js";

import { OptionValues } from "commander";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import { execa } from "execa";

export async function _updateCommand(options: OptionValues): Promise<void> {
  if (!options.all) {
    const _updatePromptQuestion = await inquirer.prompt(
      _updateCommandQuestionPrompt(options.template)
    );

    _updateOneTemplate(_updatePromptQuestion, options);
  } else {
    const _projectTypeQuestion = await inquirer.prompt([
      {
        name: "projectType",
        type: "select",
        message: "Choose project type you want to update:",
        choices: _projectTypes,
        default: "backend",
      },
    ]);

    _updateAllTemplates(_projectTypeQuestion, options);
  }
}

async function _updateOneTemplate(
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
    _pathNotFound(_dirPath);

    const _files = fs.readdirSync(_dirPath, {
      withFileTypes: true,
    });

    if (options.template === "backend" || answers.projectType === "backend") {
      spinner.start(
        `Start checking ${answers.chooseBackendFramework} project dependencies updates ✨...\n`
      );

      const _backendResource = _backendFrameworks.frameworks.filter(
        (f) => f.name === answers.chooseBackendFramework
      )[0];

      const _folder = _files.filter(
        (f) => f.name === _backendResource.templateName && f.isDirectory()
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

      const _frontendResource = _frontendFrameworks.frameworks.filter(
        (f) => f.name === answers.chooseFrontendFramework
      )[0];

      const _folder = _files.filter(
        (f) => f.name === _frontendResource.templateName && f.isDirectory()
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

      const _fullstackResource = _fullstackFrameworks.frameworks.filter(
        (f) => f.name === answers.chooseFullStackFramework
      )[0];

      const _folder = _files.filter(
        (f) => f.name === _fullstackResource.templateName && f.isDirectory()
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
    _pathNotFound(_dirPath);

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
