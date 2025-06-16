import type {
  __LicenseProps,
  __ProjectResourcePathProps,
} from '@/types/index.js';
import {
  HarassmentWordsDetected,
  PathNotFoundError,
  UnableOverwriteError,
  UnidentifiedFrameworkError,
  UnidentifiedTemplateError,
} from '@/exceptions/error.js';
import {
  _harassmentWordsDetected,
  _pathNotFound,
  _unableOverwrite,
  _unidentifiedProject,
} from '@/exceptions/trigger.js';
import { __userrealname, _basePath } from '@/config.js';
import {
  _backendFrameworks,
  _dirtyWords,
  _frontendFrameworks,
  _licenses,
  _projectTypes,
} from '@/constants/index.js';
import { _createCommandQuestionPrompt } from '@/core/prompts/create.js';
import {
  _expressBackendPackages,
  _fastifyBackendPackages,
  _nestBackendPackages,
} from '@/constants/packages/backend.js';
import {
  __renewProjectName,
  __renewStringsIntoTitleCase,
} from '@/utils/string.js';

import chalk from 'chalk';
import type { OptionValues } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import { execa } from 'execa';
import boxen from 'boxen';
import {
  _astroFrontendPackages,
  _nextFrontendPackages,
  _svelteFrontendPackages,
  _vueFrontendPackages,
} from '@/constants/packages/frontend.js';

export async function _newCreateCommand(options: OptionValues): Promise<void> {
  const spinner = ora({
    spinner: 'dots8',
    color: 'green',
    interval: 100,
  });

  const start = performance.now();

  try {
    const _projectNameQuestion: { projectName: string } = await inquirer.prompt(
      {
        name: 'projectName',
        type: 'input',
        message: 'What project name do you want:',
        default: 'my-project',
      },
    );

    _harassmentWordsDetected(
      __renewProjectName(_projectNameQuestion.projectName),
      _dirtyWords,
    );

    const _chooseProjectTypeQuestion: {
      projectType: 'backend' | 'frontend';
    } = await inquirer.prompt([
      {
        name: 'projectType',
        type: 'list',
        message: 'What type of project do you want create:',
        choices: __renewStringsIntoTitleCase(_projectTypes),
        default: 'backend',
      },
    ]);

    const _dirPath = path.join(
      _basePath,
      'templates',
      _chooseProjectTypeQuestion.projectType.toLowerCase(),
    );
    _pathNotFound(_dirPath);

    const _files = fs.readdirSync(_dirPath, {
      withFileTypes: true,
    });
    _pathNotFound(options.dir);

    switch (_chooseProjectTypeQuestion.projectType.toLowerCase()) {
      case 'backend':
        const _chooseBackendFrameworkQuestion: {
          backendFramework: 'Express.js' | 'Fastify' | 'NestJS';
        } = await inquirer.prompt([
          {
            name: 'backendFramework',
            type: 'select',
            message: 'Which backend framework do you want to use:',
            choices: _backendFrameworks.frameworks.map((f) => f.name),
            default: 'Express.js',
          },
        ]);

        const _backendFrameworkResource = _backendFrameworks.frameworks.filter(
          (f) => f.name === _chooseBackendFrameworkQuestion.backendFramework,
        )[0];

        if (!_backendFrameworkResource) {
          throw new UnidentifiedFrameworkError(
            `${chalk.bold('Unidentified framework project')}: Backend framework resource is not defined.`,
          );
        }

        const _backendFrameworkFolder = _files.filter(
          (f) =>
            f.name === _backendFrameworkResource.templateName &&
            f.isDirectory(),
        )[0];

        if (!_backendFrameworkFolder) {
          throw new PathNotFoundError(
            `${chalk.bold('Path not found')}: Backend framework folder not found.`,
          );
        }

        const _backendFrameworkSourcePath = path.join(
          _backendFrameworkFolder.parentPath,
          _backendFrameworkFolder.name,
        );
        const _backendFrameworkDesPath = path.join(
          options.dir,
          __renewProjectName(_projectNameQuestion.projectName),
        );
        _unableOverwrite(_backendFrameworkDesPath);

        switch (_chooseBackendFrameworkQuestion.backendFramework) {
          case 'Express.js':
            const _selectExpressPackagesQuestion: {
              backendPackages: string[];
            } = await inquirer.prompt([
              {
                name: 'backendPackages',
                type: 'checkbox',
                message: 'Select npm packages to include in your project:',
                choices: _expressBackendPackages.packages.map(
                  (p) => p.originName,
                ),
                loop: false,
              },
            ]);

            const _expressAddDockerQuestion: {
              addDocker: boolean;
              addDockerBake: boolean;
            } = await inquirer.prompt([
              {
                name: 'addDocker',
                type: 'confirm',
                message:
                  'Do you want us to add docker to your project? (optional)',
                default: false,
              },
              {
                name: 'addDockerBake',
                type: 'confirm',
                message: 'Do you want us to add docker bake too? (optional)',
                default: false,
                when: (a) => a.addDocker !== false,
              },
            ]);

            if (!options.git && !options.license) {
              if (!_expressAddDockerQuestion.addDocker) {
                if (
                  _selectExpressPackagesQuestion.backendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectExpressPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );
                }
              } else {
                if (
                  _selectExpressPackagesQuestion.backendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  if (!_expressAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectExpressPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );

                  if (!_expressAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                }
              }
            } else if (options.git && !options.license) {
              if (!_expressAddDockerQuestion.addDocker) {
                if (
                  _selectExpressPackagesQuestion.backendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectExpressPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );
                }
              } else {
                if (
                  _selectExpressPackagesQuestion.backendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  if (!_expressAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectExpressPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );

                  if (!_expressAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                }
              }

              await _addGit(
                _projectNameQuestion.projectName,
                _backendFrameworkDesPath,
              );
            } else if (!options.git && options.license) {
              if (!_expressAddDockerQuestion.addDocker) {
                if (
                  _selectExpressPackagesQuestion.backendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectExpressPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );
                }
              } else {
                if (
                  _selectExpressPackagesQuestion.backendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  if (!_expressAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectExpressPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );

                  if (!_expressAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                }
              }

              await _addLicense(
                _projectNameQuestion.projectName,
                _backendFrameworkDesPath,
              );
            } else {
              if (!_expressAddDockerQuestion.addDocker) {
                if (
                  _selectExpressPackagesQuestion.backendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectExpressPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );
                }
              } else {
                if (
                  _selectExpressPackagesQuestion.backendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  if (!_expressAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectExpressPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );

                  if (!_expressAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                }
              }

              await _addGit(
                _projectNameQuestion.projectName,
                _backendFrameworkDesPath,
              );

              await _addLicense(
                _projectNameQuestion.projectName,
                _backendFrameworkDesPath,
              );
            }

            console.log(
              boxen(
                `You can check the project on ${chalk.bold(
                  _backendFrameworkDesPath,
                )}`,
                {
                  title: 'ⓘ Project Information ⓘ',
                  titleAlignment: 'center',
                  padding: 1,
                  margin: 1,
                  borderColor: 'blue',
                },
              ),
            );
            break;
          case 'Fastify':
            // GENERATING FOR FASTIFY FRAMEWORK
            const _selectFastifyPackagesQuestion: {
              backendPackages: string[];
            } = await inquirer.prompt([
              {
                name: 'backendPackages',
                type: 'checkbox',
                message: 'Select npm packages to include in your project:',
                choices: _fastifyBackendPackages.packages.map(
                  (p) => p.originName,
                ),
                loop: false,
              },
            ]);

            const _fastifyAddDockerQuestion: {
              addDocker: boolean;
              addDockerBake: boolean;
            } = await inquirer.prompt([
              {
                name: 'addDocker',
                type: 'confirm',
                message:
                  'Do you want us to add docker to your project? (optional)',
                default: false,
              },
              {
                name: 'addDockerBake',
                type: 'confirm',
                message: 'Do you want us to add docker bake too? (optional)',
                default: false,
                when: (a) => a.addDocker !== false,
              },
            ]);

            if (!options.git && !options.license) {
              if (!_fastifyAddDockerQuestion.addDocker) {
                if (
                  _selectFastifyPackagesQuestion.backendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectFastifyPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );
                }
              } else {
                if (
                  _selectFastifyPackagesQuestion.backendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  if (!_fastifyAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectFastifyPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );

                  if (!_fastifyAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                }
              }
            } else if (options.git && !options.license) {
              if (!_fastifyAddDockerQuestion.addDocker) {
                if (
                  _selectFastifyPackagesQuestion.backendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectFastifyPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );
                }
              } else {
                if (
                  _selectFastifyPackagesQuestion.backendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  if (!_fastifyAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectFastifyPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );

                  if (!_fastifyAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                }
              }

              await _addGit(
                _projectNameQuestion.projectName,
                _backendFrameworkDesPath,
              );
            } else if (!options.git && options.license) {
              if (!_fastifyAddDockerQuestion.addDocker) {
                if (
                  _selectFastifyPackagesQuestion.backendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectFastifyPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );
                }
              } else {
                if (
                  _selectFastifyPackagesQuestion.backendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  if (!_fastifyAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectFastifyPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );

                  if (!_fastifyAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                }
              }

              await _addLicense(
                _projectNameQuestion.projectName,
                _backendFrameworkDesPath,
              );
            } else {
              if (!_fastifyAddDockerQuestion.addDocker) {
                if (
                  _selectFastifyPackagesQuestion.backendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectFastifyPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );
                }
              } else {
                if (
                  _selectFastifyPackagesQuestion.backendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  if (!_fastifyAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectFastifyPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );

                  if (!_fastifyAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                }
              }

              await _addGit(
                _projectNameQuestion.projectName,
                _backendFrameworkDesPath,
              );

              await _addLicense(
                _projectNameQuestion.projectName,
                _backendFrameworkDesPath,
              );
            }

            console.log(
              boxen(
                `You can check the project on ${chalk.bold(
                  _backendFrameworkDesPath,
                )}`,
                {
                  title: 'ⓘ Project Information ⓘ',
                  titleAlignment: 'center',
                  padding: 1,
                  margin: 1,
                  borderColor: 'blue',
                },
              ),
            );
            break;
          case 'NestJS':
            // GENERATING FOR NESTJS FRAMEWORK
            const _selectNestPackagesQuestion: {
              backendPackages: string[];
            } = await inquirer.prompt([
              {
                name: 'backendPackages',
                type: 'checkbox',
                message: 'Select npm packages to include in your project:',
                choices: _nestBackendPackages.packages.map((p) => p.originName),
                loop: false,
              },
            ]);

            const _nestAddDockerQuestion: {
              addDocker: boolean;
              addDockerBake: boolean;
            } = await inquirer.prompt([
              {
                name: 'addDocker',
                type: 'confirm',
                message:
                  'Do you want us to add docker to your project? (optional)',
                default: false,
              },
              {
                name: 'addDockerBake',
                type: 'confirm',
                message: 'Do you want us to add docker bake too? (optional)',
                default: false,
                when: (a) => a.addDocker !== false,
              },
            ]);

            if (!options.git && !options.license) {
              if (!_nestAddDockerQuestion.addDocker) {
                if (_selectNestPackagesQuestion.backendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectNestPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );
                }
              } else {
                if (_selectNestPackagesQuestion.backendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  if (!_nestAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectNestPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );

                  if (!_nestAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                }
              }
            } else if (options.git && !options.license) {
              if (!_nestAddDockerQuestion.addDocker) {
                if (_selectNestPackagesQuestion.backendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectNestPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );
                }
              } else {
                if (_selectNestPackagesQuestion.backendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  if (!_nestAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectNestPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );

                  if (!_nestAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                }
              }

              await _addGit(
                _projectNameQuestion.projectName,
                _backendFrameworkDesPath,
              );
            } else if (!options.git && options.license) {
              if (!_nestAddDockerQuestion.addDocker) {
                if (_selectNestPackagesQuestion.backendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectNestPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );
                }
              } else {
                if (_selectNestPackagesQuestion.backendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  if (!_nestAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectNestPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );

                  if (!_nestAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                }
              }

              await _addLicense(
                _projectNameQuestion.projectName,
                _backendFrameworkDesPath,
              );
            } else {
              if (!_nestAddDockerQuestion.addDocker) {
                if (_selectNestPackagesQuestion.backendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectNestPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );
                }
              } else {
                if (_selectNestPackagesQuestion.backendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  if (!_nestAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseBackendFrameworkQuestion.backendFramework,
                    _backendFrameworkSourcePath,
                    _backendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectNestPackagesQuestion.backendPackages,
                    _backendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _backendFrameworkDesPath,
                  );

                  if (!_nestAddDockerQuestion.addDockerBake) {
                    await _addDocker(_backendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_backendFrameworkDesPath);
                  }
                }
              }

              await _addGit(
                _projectNameQuestion.projectName,
                _backendFrameworkDesPath,
              );

              await _addLicense(
                _projectNameQuestion.projectName,
                _backendFrameworkDesPath,
              );
            }

            console.log(
              boxen(
                `You can check the project on ${chalk.bold(
                  _backendFrameworkDesPath,
                )}`,
                {
                  title: 'ⓘ Project Information ⓘ',
                  titleAlignment: 'center',
                  padding: 1,
                  margin: 1,
                  borderColor: 'blue',
                },
              ),
            );
            break;
        }
        break;
      case 'frontend':
        // STARTING TO GENERATE FRONTEND PROJECT.
        const _chooseFrontendFrameworkQuestion: {
          frontendFramework: 'Next.js' | 'Vue.js' | 'Svelte' | 'Astro.js';
        } = await inquirer.prompt([
          {
            name: 'frontendFramework',
            type: 'select',
            message: 'Which frontend framework do you want to use:',
            choices: _frontendFrameworks.frameworks.map((f) => f.name),
            default: 'Next.js',
          },
        ]);

        const _frontendFrameworkResource =
          _frontendFrameworks.frameworks.filter(
            (f) =>
              f.name === _chooseFrontendFrameworkQuestion.frontendFramework,
          )[0];

        if (!_frontendFrameworkResource) {
          throw new UnidentifiedFrameworkError(
            `${chalk.bold('Unidentified framework project')}: Frontend framework resource is not defined.`,
          );
        }

        const _frontendFrameworkFolder = _files.filter(
          (f) =>
            f.name === _frontendFrameworkResource.templateName &&
            f.isDirectory(),
        )[0];

        if (!_frontendFrameworkFolder) {
          throw new PathNotFoundError(
            `${chalk.bold('Path not found')}: Frontend framework folder not found.`,
          );
        }

        const _frontendFrameworkSourcePath = path.join(
          _frontendFrameworkFolder.parentPath,
          _frontendFrameworkFolder.name,
        );
        const _frontendFrameworkDesPath = path.join(
          options.dir,
          __renewProjectName(_projectNameQuestion.projectName),
        );
        _unableOverwrite(_frontendFrameworkDesPath);

        switch (_chooseFrontendFrameworkQuestion.frontendFramework) {
          case 'Next.js':
            const _selectNextPackagesQuestion: {
              frontendPackages: string[];
            } = await inquirer.prompt([
              {
                name: 'frontendPackages',
                type: 'checkbox',
                message: 'Select npm packages to include in your project:',
                choices: _nextFrontendPackages.packages.map(
                  (p) => p.originName,
                ),
                loop: false,
              },
            ]);

            const _nextAddDockerQuestion: {
              addDocker: boolean;
              addDockerBake: boolean;
            } = await inquirer.prompt([
              {
                name: 'addDocker',
                type: 'confirm',
                message:
                  'Do you want us to add docker to your project? (optional)',
                default: false,
              },
              {
                name: 'addDockerBake',
                type: 'confirm',
                message: 'Do you want us to add docker bake too? (optional)',
                default: false,
                when: (a) => a.addDocker !== false,
              },
            ]);

            if (!options.git && !options.license) {
              if (!_nextAddDockerQuestion.addDocker) {
                if (_selectNextPackagesQuestion.frontendPackages.length === 0) {
                  await _generateFrontendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );
                } else {
                  await _generateFrontendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectNextPackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );
                }
              } else {
                if (_selectNextPackagesQuestion.frontendPackages.length === 0) {
                  await _generateFrontendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  if (!_nextAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                } else {
                  await _generateFrontendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectNextPackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );

                  if (!_nextAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                }
              }
            } else if (options.git && !options.license) {
              if (!_nextAddDockerQuestion.addDocker) {
                if (_selectNextPackagesQuestion.frontendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectNextPackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );
                }
              } else {
                if (_selectNextPackagesQuestion.frontendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  if (!_nextAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectNextPackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );

                  if (!_nextAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                }
              }

              await _addGit(
                _projectNameQuestion.projectName,
                _frontendFrameworkDesPath,
              );
            } else if (!options.git && options.license) {
              if (!_nextAddDockerQuestion.addDocker) {
                if (_selectNextPackagesQuestion.frontendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectNextPackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );
                }
              } else {
                if (_selectNextPackagesQuestion.frontendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  if (!_nextAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectNextPackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );

                  if (!_nextAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                }
              }

              await _addLicense(
                _projectNameQuestion.projectName,
                _frontendFrameworkDesPath,
              );
            } else {
              if (!_nextAddDockerQuestion.addDocker) {
                if (_selectNextPackagesQuestion.frontendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectNextPackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );
                }
              } else {
                if (_selectNextPackagesQuestion.frontendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  if (!_nextAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectNextPackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );

                  if (!_nextAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                }
              }

              await _addGit(
                _projectNameQuestion.projectName,
                _frontendFrameworkDesPath,
              );

              await _addLicense(
                _projectNameQuestion.projectName,
                _frontendFrameworkDesPath,
              );
            }

            console.log(
              boxen(
                `You can check the project on ${chalk.bold(
                  _frontendFrameworkDesPath,
                )}`,
                {
                  title: 'ⓘ Project Information ⓘ',
                  titleAlignment: 'center',
                  padding: 1,
                  margin: 1,
                  borderColor: 'blue',
                },
              ),
            );
            break;
          case 'Vue.js':
            const _selectVuePackagesQuestion: {
              frontendPackages: string[];
            } = await inquirer.prompt([
              {
                name: 'frontendPackages',
                type: 'checkbox',
                message: 'Select npm packages to include in your project:',
                choices: _vueFrontendPackages.packages.map((p) => p.originName),
                loop: false,
              },
            ]);

            const _vueAddDockerQuestion: {
              addDocker: boolean;
              addDockerBake: boolean;
            } = await inquirer.prompt([
              {
                name: 'addDocker',
                type: 'confirm',
                message:
                  'Do you want us to add docker to your project? (optional)',
                default: false,
              },
              {
                name: 'addDockerBake',
                type: 'confirm',
                message: 'Do you want us to add docker bake too? (optional)',
                default: false,
                when: (a) => a.addDocker !== false,
              },
            ]);

            if (!options.git && !options.license) {
              if (!_vueAddDockerQuestion.addDocker) {
                if (_selectVuePackagesQuestion.frontendPackages.length === 0) {
                  await _generateFrontendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );
                } else {
                  await _generateFrontendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectVuePackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );
                }
              } else {
                if (_selectVuePackagesQuestion.frontendPackages.length === 0) {
                  await _generateFrontendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  if (!_vueAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                } else {
                  await _generateFrontendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectVuePackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );

                  if (!_vueAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                }
              }
            } else if (options.git && !options.license) {
              if (!_vueAddDockerQuestion.addDocker) {
                if (_selectVuePackagesQuestion.frontendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectVuePackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );
                }
              } else {
                if (_selectVuePackagesQuestion.frontendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  if (!_vueAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectVuePackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );

                  if (!_vueAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                }
              }

              await _addGit(
                _projectNameQuestion.projectName,
                _frontendFrameworkDesPath,
              );
            } else if (!options.git && options.license) {
              if (!_vueAddDockerQuestion.addDocker) {
                if (_selectVuePackagesQuestion.frontendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectVuePackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );
                }
              } else {
                if (_selectVuePackagesQuestion.frontendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  if (!_vueAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectVuePackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );

                  if (!_vueAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                }
              }

              await _addLicense(
                _projectNameQuestion.projectName,
                _frontendFrameworkDesPath,
              );
            } else {
              if (!_vueAddDockerQuestion.addDocker) {
                if (_selectVuePackagesQuestion.frontendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectVuePackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );
                }
              } else {
                if (_selectVuePackagesQuestion.frontendPackages.length === 0) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  if (!_vueAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectVuePackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );

                  if (!_vueAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                }
              }

              await _addGit(
                _projectNameQuestion.projectName,
                _frontendFrameworkDesPath,
              );

              await _addLicense(
                _projectNameQuestion.projectName,
                _frontendFrameworkDesPath,
              );
            }

            console.log(
              boxen(
                `You can check the project on ${chalk.bold(
                  _frontendFrameworkDesPath,
                )}`,
                {
                  title: 'ⓘ Project Information ⓘ',
                  titleAlignment: 'center',
                  padding: 1,
                  margin: 1,
                  borderColor: 'blue',
                },
              ),
            );
            break;
          case 'Svelte':
            const _selectSveltePackagesQuestion: {
              frontendPackages: string[];
            } = await inquirer.prompt([
              {
                name: 'frontendPackages',
                type: 'checkbox',
                message: 'Select npm packages to include in your project:',
                choices: _svelteFrontendPackages.packages.map(
                  (p) => p.originName,
                ),
                loop: false,
              },
            ]);

            const _svelteAddDockerQuestion: {
              addDocker: boolean;
              addDockerBake: boolean;
            } = await inquirer.prompt([
              {
                name: 'addDocker',
                type: 'confirm',
                message:
                  'Do you want us to add docker to your project? (optional)',
                default: false,
              },
              {
                name: 'addDockerBake',
                type: 'confirm',
                message: 'Do you want us to add docker bake too? (optional)',
                default: false,
                when: (a) => a.addDocker !== false,
              },
            ]);

            if (!options.git && !options.license) {
              if (!_svelteAddDockerQuestion.addDocker) {
                if (
                  _selectSveltePackagesQuestion.frontendPackages.length === 0
                ) {
                  await _generateFrontendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );
                } else {
                  await _generateFrontendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectSveltePackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );
                }
              } else {
                if (
                  _selectSveltePackagesQuestion.frontendPackages.length === 0
                ) {
                  await _generateFrontendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  if (!_svelteAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                } else {
                  await _generateFrontendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectSveltePackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );

                  if (!_svelteAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                }
              }
            } else if (options.git && !options.license) {
              if (!_svelteAddDockerQuestion.addDocker) {
                if (
                  _selectSveltePackagesQuestion.frontendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectSveltePackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );
                }
              } else {
                if (
                  _selectSveltePackagesQuestion.frontendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  if (!_svelteAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectSveltePackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );

                  if (!_svelteAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                }
              }

              await _addGit(
                _projectNameQuestion.projectName,
                _frontendFrameworkDesPath,
              );
            } else if (!options.git && options.license) {
              if (!_svelteAddDockerQuestion.addDocker) {
                if (
                  _selectSveltePackagesQuestion.frontendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectSveltePackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );
                }
              } else {
                if (
                  _selectSveltePackagesQuestion.frontendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  if (!_svelteAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectSveltePackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );

                  if (!_svelteAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                }
              }

              await _addLicense(
                _projectNameQuestion.projectName,
                _frontendFrameworkDesPath,
              );
            } else {
              if (!_svelteAddDockerQuestion.addDocker) {
                if (
                  _selectSveltePackagesQuestion.frontendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectSveltePackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );
                }
              } else {
                if (
                  _selectSveltePackagesQuestion.frontendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  if (!_svelteAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectSveltePackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );

                  if (!_svelteAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                }
              }

              await _addGit(
                _projectNameQuestion.projectName,
                _frontendFrameworkDesPath,
              );

              await _addLicense(
                _projectNameQuestion.projectName,
                _frontendFrameworkDesPath,
              );
            }

            console.log(
              boxen(
                `You can check the project on ${chalk.bold(
                  _frontendFrameworkDesPath,
                )}`,
                {
                  title: 'ⓘ Project Information ⓘ',
                  titleAlignment: 'center',
                  padding: 1,
                  margin: 1,
                  borderColor: 'blue',
                },
              ),
            );
            break;
          case 'Astro.js':
            const _selectAstroPackagesQuestion: {
              frontendPackages: string[];
            } = await inquirer.prompt([
              {
                name: 'frontendPackages',
                type: 'checkbox',
                message: 'Select npm packages to include in your project:',
                choices: _astroFrontendPackages.packages.map(
                  (p) => p.originName,
                ),
                loop: false,
              },
            ]);

            const _astroAddDockerQuestion: {
              addDocker: boolean;
              addDockerBake: boolean;
            } = await inquirer.prompt([
              {
                name: 'addDocker',
                type: 'confirm',
                message:
                  'Do you want us to add docker to your project? (optional)',
                default: false,
              },
              {
                name: 'addDockerBake',
                type: 'confirm',
                message: 'Do you want us to add docker bake too? (optional)',
                default: false,
                when: (a) => a.addDocker !== false,
              },
            ]);

            if (!options.git && !options.license) {
              if (!_astroAddDockerQuestion.addDocker) {
                if (
                  _selectAstroPackagesQuestion.frontendPackages.length === 0
                ) {
                  await _generateFrontendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );
                } else {
                  await _generateFrontendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectAstroPackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );
                }
              } else {
                if (
                  _selectAstroPackagesQuestion.frontendPackages.length === 0
                ) {
                  await _generateFrontendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  if (!_astroAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                } else {
                  await _generateFrontendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectAstroPackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );

                  if (!_astroAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                }
              }
            } else if (options.git && !options.license) {
              if (!_astroAddDockerQuestion.addDocker) {
                if (
                  _selectAstroPackagesQuestion.frontendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectAstroPackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );
                }
              } else {
                if (
                  _selectAstroPackagesQuestion.frontendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  if (!_astroAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectAstroPackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );

                  if (!_astroAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                }
              }

              await _addGit(
                _projectNameQuestion.projectName,
                _frontendFrameworkDesPath,
              );
            } else if (!options.git && options.license) {
              if (!_astroAddDockerQuestion.addDocker) {
                if (
                  _selectAstroPackagesQuestion.frontendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectAstroPackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );
                }
              } else {
                if (
                  _selectAstroPackagesQuestion.frontendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  if (!_astroAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectAstroPackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );

                  if (!_astroAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                }
              }

              await _addLicense(
                _projectNameQuestion.projectName,
                _frontendFrameworkDesPath,
              );
            } else {
              if (!_astroAddDockerQuestion.addDocker) {
                if (
                  _selectAstroPackagesQuestion.frontendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectAstroPackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );
                }
              } else {
                if (
                  _selectAstroPackagesQuestion.frontendPackages.length === 0
                ) {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  if (!_astroAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                } else {
                  await _generateBackendProject(
                    _projectNameQuestion.projectName,
                    _chooseFrontendFrameworkQuestion.frontendFramework,
                    _frontendFrameworkSourcePath,
                    _frontendFrameworkDesPath,
                  );

                  await _runInstallingPackages(
                    _selectAstroPackagesQuestion.frontendPackages,
                    _frontendFrameworkDesPath,
                  );

                  await _runUpdatingPackages(
                    _projectNameQuestion.projectName,
                    _frontendFrameworkDesPath,
                  );

                  if (!_astroAddDockerQuestion.addDockerBake) {
                    await _addDocker(_frontendFrameworkDesPath);
                  } else {
                    await _addDockerWithBake(_frontendFrameworkDesPath);
                  }
                }
              }

              await _addGit(
                _projectNameQuestion.projectName,
                _frontendFrameworkDesPath,
              );

              await _addLicense(
                _projectNameQuestion.projectName,
                _frontendFrameworkDesPath,
              );
            }

            console.log(
              boxen(
                `You can check the project on ${chalk.bold(
                  _frontendFrameworkDesPath,
                )}`,
                {
                  title: 'ⓘ Project Information ⓘ',
                  titleAlignment: 'center',
                  padding: 1,
                  margin: 1,
                  borderColor: 'blue',
                },
              ),
            );
            break;
        }
        break;
    }

    const end = performance.now();
    spinner.succeed(`All done! ${chalk.bold((end - start).toFixed(3))} ms`);
  } catch (error: any | unknown) {
    spinner.fail('⛔️ Failed to create project...\n');

    let errorMessage =
      error instanceof Error
        ? error.message
        : `${chalk.bold('Error')}: An unknown error occurred.`;

    if (error instanceof PathNotFoundError) {
      errorMessage = error.message;
    }

    if (error instanceof UnableOverwriteError) {
      errorMessage = error.message;
    }

    if (error instanceof HarassmentWordsDetected) {
      errorMessage = error.message;
    }

    if (error.name === 'ExitPromptError') {
      errorMessage = `${chalk.bold(
        'Exit prompt error',
      )}: User forced close the prompt.`;
    }

    console.error(
      boxen(errorMessage, {
        title: `⛔️ ${error.name} ⛔️`,
        titleAlignment: 'center',
        padding: 1,
        margin: 1,
        borderColor: 'red',
      }),
    );
  } finally {
    spinner.clear();
  }
}

async function _generateBackendProject(
  projectName: string,
  framework: string,
  sourcePath: string,
  desPath: string,
): Promise<void> {
  const spinner = ora({
    spinner: 'dots8',
    color: 'green',
    interval: 100,
  });

  spinner.start(
    `Allright ${chalk.bold(
      __userrealname.split(' ')[0],
    )}, We are start generating ${chalk.bold(projectName)} using ${chalk.bold(
      framework,
    )} for you, please wait...`,
  );

  await fse.copy(sourcePath, desPath);

  spinner.succeed(
    `${chalk.bold(projectName)} using ${chalk.bold(
      framework,
    )} framework successfully created ✅`,
  );
}

async function _generateFrontendProject(
  projectName: string,
  framework: string,
  sourcePath: string,
  desPath: string,
) {
  const spinner = ora({
    spinner: 'dots8',
    color: 'green',
    interval: 100,
  });

  spinner.start(
    `Allright ${chalk.bold(
      __userrealname.split(' ')[0],
    )}, We are start generating ${chalk.bold(projectName)} using ${chalk.bold(
      framework,
    )} for you, please wait...`,
  );

  await fse.copy(sourcePath, desPath);

  spinner.succeed(
    `${chalk.bold(projectName)} using ${chalk.bold(
      framework,
    )} framework successfully created ✅`,
  );
}

async function _runInstallingPackages(
  packages: string[],
  desPath: string,
): Promise<void> {
  const spinner = ora({
    spinner: 'dots8',
    color: 'green',
    interval: 100,
  });

  spinner.start(
    `Allright ${chalk.bold(
      __userrealname.split(' ')[0],
    )}, We are start installing ${chalk.bold(
      packages.join(', '),
    )} packages for you 👾...`,
  );

  for (const p of packages) {
    spinner.start(`Start installing ${chalk.bold(p)} package...`);

    await execa('npm', ['install', '--save', p], {
      cwd: desPath,
    });

    spinner.succeed(`Installing ${chalk.bold(p)} package succeed ✅`);
  }

  spinner.succeed(`Installing all packages succeed ✅`);
}

async function _runUpdatingPackages(projectName: string, desPath: string) {
  const spinner = ora({
    spinner: 'dots8',
    color: 'green',
    interval: 100,
  });

  const _updatePackagesQuestion = await inquirer.prompt({
    name: 'updatePackages',
    type: 'confirm',
    message: `Do you want us to run ${chalk.bold('npm update')}? (optional)`,
    default: false,
  });

  if (!_updatePackagesQuestion.updatePackages) {
    spinner.warn(
      `${chalk.yellow(
        `It's okay ${chalk.bold(
          __userrealname.split(' ')[0],
        )}, you can update the packages later by yourself.`,
      )}`,
    );
  } else {
    spinner.start(
      `Allright ${chalk.bold(
        __userrealname.split(' ')[0],
      )}, We are start updating your ${chalk.bold(
        projectName,
      )} packages, please wait...`,
    );

    await execa('npm', ['update'], {
      cwd: desPath,
    });

    spinner.succeed(`Updating ${projectName}  packages succeed ✅`);
  }
}

async function _addDocker(desPath: string): Promise<void> {
  const spinner = ora({
    spinner: 'dots8',
    color: 'green',
    interval: 100,
  });

  spinner.start('Start adding docker compose file 🐳...');

  const _dockerResources = _getDockerResources();

  const _dockerComposePathBackend = _getDockerComposePath(
    _dockerResources,
    desPath,
  );

  await fse.copy(
    _dockerComposePathBackend.sourcePath,
    _dockerComposePathBackend.desPath,
  );

  spinner.succeed('Adding docker compose file succeed ✅');

  spinner.start('Start adding dockerfile 🐳...');

  const _dockerfilePath = _getDockerfilePath(
    'npm.Dockerfile',
    _dockerResources,
    desPath,
  );

  await fse.copy(_dockerfilePath.sourcePath, _dockerfilePath.desPath);

  spinner.succeed('Adding dockerfile succeed ✅');
}

async function _addDockerWithBake(desPath: string): Promise<void> {
  const spinner = ora({
    spinner: 'dots8',
    color: 'green',
    interval: 100,
  });

  spinner.start('Start adding docker compose file 🐳...');

  const _dockerResources = _getDockerResources();

  const _dockerComposePathBackend = _getDockerComposePath(
    _dockerResources,
    desPath,
  );

  await fse.copy(
    _dockerComposePathBackend.sourcePath,
    _dockerComposePathBackend.desPath,
  );

  spinner.succeed('Adding docker compose file succeed ✅');

  spinner.start('Start adding dockerfile 🐳...');

  const _dockerfilePath = _getDockerfilePath(
    'npm.Dockerfile',
    _dockerResources,
    desPath,
  );

  await fse.copy(_dockerfilePath.sourcePath, _dockerfilePath.desPath);

  spinner.succeed('Adding dockerfile succeed ✅');

  spinner.start('Start adding docker bake file 🍞...');

  const _dockerBakePathBackend = _getDockerBakePath(_dockerResources, desPath);

  await fse.copy(
    _dockerBakePathBackend.sourcePath,
    _dockerBakePathBackend.desPath,
  );

  spinner.succeed('Adding docker bake file succeed ✅');
}

async function _addGit(projectName: string, desPath: string): Promise<void> {
  const spinner = ora({
    spinner: 'dots8',
    color: 'green',
    interval: 100,
  });

  const _initiliazeGitQuestion = await inquirer.prompt({
    name: 'addGit',
    type: 'confirm',
    message: `Do you want us to run ${chalk.bold('git init')}? (optional)`,
    default: false,
  });

  if (!_initiliazeGitQuestion.addGit) {
    spinner.warn(
      `${chalk.yellow(
        `It's okay ${chalk.bold(
          __userrealname.split(' ')[0],
        )}, you can run ${chalk.bold('git init')} later by yourself.`,
      )}`,
    );
  } else {
    spinner.start(
      `Allright ${chalk.bold(
        __userrealname.split(' ')[0],
      )}, We are start running ${chalk.bold('git init')} on ${chalk.bold(
        projectName,
      )}, please wait...`,
    );

    await execa('git', ['init'], {
      cwd: desPath,
    });

    spinner.succeed(
      `Running ${chalk.bold('git init')} on ${projectName} succeed ✅`,
    );
  }
}

async function _addLicense(projectName: string, desPath: string) {
  const spinner = ora({
    spinner: 'dots8',
    color: 'green',
    interval: 100,
  });

  const _addLicenseQuestion = await inquirer.prompt({
    name: 'addGit',
    type: 'confirm',
    message: `Do you want us to add ${chalk.bold(
      'LICENSE',
    )} file into your project? (optional)`,
    default: false,
  });

  if (!_addLicenseQuestion.addGit) {
    spinner.warn(
      `${chalk.yellow(
        `It's okay ${chalk.bold(
          __userrealname.split(' ')[0],
        )}, you can add ${chalk.bold('LICENSE')} file manually.`,
      )}`,
    );
  } else {
    const _chooseLicenseQuestion: {
      license:
        | 'Apache 2.0 License'
        | 'BSD 2-Clause License'
        | 'BSD 3-Clause License'
        | 'GNU General Public License v3.0'
        | 'ISC License'
        | 'GNU Lesser General Public License v3.0'
        | 'MIT License'
        | 'Unlicense';
    } = await inquirer.prompt({
      name: 'license',
      type: 'select',
      message: 'Which license do you want to use:',
      choices: _licenses.licenses.map((l) => l.name),
      default: 'MIT License',
    });

    spinner.start(
      `Start adding ${chalk.bold(
        _chooseLicenseQuestion.license,
      )} file into ${chalk.bold(projectName)} 🧾...`,
    );

    switch (_chooseLicenseQuestion.license) {
      case 'Apache 2.0 License':
        const _apacheLicense = _licenses.licenses.find(
          (l) => l.name === _chooseLicenseQuestion.license,
        ) as __LicenseProps;

        const _apacheLicenseSourcePath = path.join(
          _basePath,
          _apacheLicense.path,
        );

        await fse.copy(_apacheLicenseSourcePath, desPath);

        break;
      case 'BSD 2-Clause License':
        const _bsd2License = _licenses.licenses.find(
          (l) => l.name === _chooseLicenseQuestion.license,
        ) as __LicenseProps;

        const _bsd2LicenseSourcePath = path.join(_basePath, _bsd2License.path);

        await fse.copy(_bsd2LicenseSourcePath, desPath);

        break;
      case 'BSD 3-Clause License':
        const _bsd3License = _licenses.licenses.find(
          (l) => l.name === _chooseLicenseQuestion.license,
        ) as __LicenseProps;

        const _bsd3LicenseSourcePath = path.join(_basePath, _bsd3License.path);

        await fse.copy(_bsd3LicenseSourcePath, desPath);

        break;
      case 'GNU General Public License v3.0':
        const _gpl3License = _licenses.licenses.find(
          (l) => l.name === _chooseLicenseQuestion.license,
        ) as __LicenseProps;

        const _gpl3LicenseSourcePath = path.join(_basePath, _gpl3License.path);

        await fse.copy(_gpl3LicenseSourcePath, desPath);

        break;
      case 'GNU Lesser General Public License v3.0':
        const _lgpl3License = _licenses.licenses.find(
          (l) => l.name === _chooseLicenseQuestion.license,
        ) as __LicenseProps;

        const _lgpl3LicenseSourcePath = path.join(
          _basePath,
          _lgpl3License.path,
        );

        await fse.copy(_lgpl3LicenseSourcePath, desPath);

        break;
      case 'ISC License':
        const _iscLicense = _licenses.licenses.find(
          (l) => l.name === _chooseLicenseQuestion.license,
        ) as __LicenseProps;

        const _iscLicenseSourcePath = path.join(_basePath, _iscLicense.path);

        await fse.copy(_iscLicenseSourcePath, desPath);

        break;
      case 'MIT License':
        const _mitLicense = _licenses.licenses.find(
          (l) => l.name === _chooseLicenseQuestion.license,
        ) as __LicenseProps;

        const _mitLicenseSourcePath = path.join(_basePath, _mitLicense.path);

        await fse.copy(_mitLicenseSourcePath, desPath);

        break;
      case 'Unlicense':
        const unlicenseLicense = _licenses.licenses.find(
          (l) => l.name === _chooseLicenseQuestion.license,
        ) as __LicenseProps;

        const unlicenseLicenseSourcePath = path.join(
          _basePath,
          unlicenseLicense.path,
        );

        await fse.copy(unlicenseLicenseSourcePath, desPath);

        break;
    }

    spinner.succeed(
      `Adding ${chalk.bold(
        _chooseLicenseQuestion.license,
      )} file on ${chalk.bold(projectName)} succeed ✅`,
    );
  }
}

function _getLicenseResources() {
  const _licenseTemplatesPath = path.join(_basePath, 'templates/licenses');
  _pathNotFound(_licenseTemplatesPath);

  const _licenseSources = fs.readdirSync(_licenseTemplatesPath, {
    withFileTypes: true,
  });

  return _licenseSources;
}

function _getDockerResources() {
  const _dockerTemplatesPath = path.join(_basePath, 'templates/docker');
  _pathNotFound(_dockerTemplatesPath);

  const _dockerSources = fs.readdirSync(_dockerTemplatesPath, {
    withFileTypes: true,
  });

  return _dockerSources;
}

function _getDockerComposePath(
  templates: fs.Dirent<string>[],
  desPath: string,
): { sourcePath: string; desPath: string } {
  const _dockerComposeFile = templates.filter(
    (f) => f.name === 'compose.yml',
  )[0];

  if (!_dockerComposeFile) {
    throw new UnidentifiedTemplateError(
      `${chalk.bold('Unidentified template')}: Docker compose file template is not defined.`,
    );
  }

  const _dockerComposeSourcePath = path.join(
    _dockerComposeFile.parentPath,
    _dockerComposeFile.name,
  );
  const _dockerComposeDesPath = path.join(desPath, _dockerComposeFile.name);

  return {
    sourcePath: _dockerComposeSourcePath,
    desPath: _dockerComposeDesPath,
  };
}

function _getDockerBakePath(
  templates: fs.Dirent<string>[],
  desPath: string,
): { sourcePath: string; desPath: string } {
  const _dockerBakeFile = templates.filter(
    (f) => f.name === 'docker-bake.hcl',
  )[0];

  if (!_dockerBakeFile) {
    throw new UnidentifiedTemplateError(
      `${chalk.bold('Unidentified template')}: Docker bake file template is not defined.`,
    );
  }

  const _dockerBakeSourcePath = path.join(
    _dockerBakeFile.parentPath,
    _dockerBakeFile.name,
  );
  const _dockerBakeDesPath = path.join(desPath, _dockerBakeFile.name);

  return {
    sourcePath: _dockerBakeSourcePath,
    desPath: _dockerBakeDesPath,
  };
}

function _getDockerfilePath(
  filename: string,
  dockerfiles: fs.Dirent<string>[],
  desPath: string,
): { sourcePath: string; desPath: string } {
  const _dockerfile = dockerfiles.filter((f) => f.name === filename)[0];

  if (!_dockerfile) {
    throw new UnidentifiedTemplateError(
      `${chalk.bold('Unidentified template')}: Dockerfile template is not defined.`,
    );
  }

  const _dockerfileSourcePath = path.join(
    _dockerfile.parentPath,
    _dockerfile.name,
  );

  const _dockerfileDesPath = path.join(desPath, _dockerfile.name);

  return {
    sourcePath: _dockerfileSourcePath,
    desPath: _dockerfileDesPath,
  };
}
