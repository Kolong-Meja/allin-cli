import {
  HarassmentWordsDetected,
  PathNotFoundError,
  UnableOverwriteError,
  UnidentifiedFrameworkError,
  UnidentifiedTemplateError,
} from '@/exceptions/error.js';
import {
  __renewProjectName,
  __renewStringsIntoTitleCase,
} from '@/utils/string.js';

import chalk from 'chalk';
import type { OptionValues } from 'commander';
import inquirer from 'inquirer';
import ora, { type Ora } from 'ora';
import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import { execa } from 'execa';
import boxen from 'boxen';
import { __basePath, __userRealName } from '@/config.js';
import type { Mixed } from '@/types/general.js';
import {
  BACKEND_FRAMEWORKS,
  DIRTY_WORDS,
  FRONTEND_FRAMEWORKS,
  LICENSES,
  PROJECT_TYPES,
} from '@/constants/default.js';
import {
  EXPRESS_DEPENDENCIES,
  FASTIFY_DEPENDENCIES,
  NEST_DEPENDENCIES,
  NODE_DEPENDENCIES,
} from '@/constants/packages/backend.js';
import {
  ASTRO_DEPENDENCIES,
  NEXT_DEPENDENCIES,
  SOLID_DEPENDENCIES,
  SVELTE_DEPENDENCIES,
  VANILLA_DEPENDENCIES,
  VUE_DEPENDENCIES,
} from '@/constants/packages/frontend.js';
import { TYPESCRIPT_DEPENDENCIES } from '@/constants/packages/typescript.js';
import {
  __containHarassmentWords,
  __pathNotExist,
  __unableToOverwriteProject,
} from '@/exceptions/trigger.js';

export class CreateCommand {
  static #instance: CreateCommand;

  private constructor() {}

  public static get instance(): CreateCommand {
    if (!CreateCommand.#instance) {
      CreateCommand.#instance = new CreateCommand();
    }

    return CreateCommand.#instance;
  }

  public async create(options: OptionValues) {
    const spinner = ora({
      spinner: 'dots8',
      color: 'green',
      interval: 100,
    });

    const start = performance.now();

    try {
      const __projectNamQuestion: { projectName: string } =
        await inquirer.prompt({
          name: 'projectName',
          type: 'input',
          message: 'What project name do you want:',
          default: 'my-project',
        });
      __containHarassmentWords(
        __renewProjectName(__projectNamQuestion.projectName),
        DIRTY_WORDS,
      );

      const __projectTypeQuestion: {
        projectType: 'backend' | 'frontend';
      } = await inquirer.prompt([
        {
          name: 'projectType',
          type: 'list',
          message: 'What type of project do you want create:',
          choices: __renewStringsIntoTitleCase(PROJECT_TYPES),
          default: 'backend',
        },
      ]);

      const __templatesDirPath = path.join(
        __basePath,
        'templates',
        __projectTypeQuestion.projectType.toLowerCase(),
      );
      __pathNotExist(__templatesDirPath);

      const __templatesFiles = fs.readdirSync(__templatesDirPath, {
        withFileTypes: true,
      });
      __pathNotExist(options.dir);

      switch (__projectTypeQuestion.projectType.toLowerCase()) {
        case 'backend':
          await this.__backendProjectType(
            spinner,
            options,
            __templatesFiles,
            __projectNamQuestion.projectName,
            __projectTypeQuestion.projectType,
          );
          break;
        case 'frontend':
          await this.__frontendProjectType(
            spinner,
            options,
            __templatesFiles,
            __projectNamQuestion.projectName,
            __projectTypeQuestion.projectType,
          );
          break;
      }

      const end = performance.now();
      spinner.succeed(`All done! ${chalk.bold((end - start).toFixed(3))} ms`);
    } catch (error: Mixed) {
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

  private async __backendProjectType(
    spinner: Ora,
    options: OptionValues,
    templatesFiles: fs.Dirent<string>[],
    projectName: string,
    projectType: string,
  ) {
    const __backendFrameworkQuestion = await inquirer.prompt([
      {
        name: 'backendFramework',
        type: 'select',
        message: 'Which backend framework do you want to use:',
        choices: BACKEND_FRAMEWORKS.frameworks
          .sort((i, e) =>
            i.name.toLowerCase().localeCompare(e.name.toLowerCase(), 'en-US'),
          )
          .map((f) => f.name),
        default: 'Express.js',
      },
    ]);

    const __backendFrameworkResource = BACKEND_FRAMEWORKS.frameworks.find(
      (f) => f.name === __backendFrameworkQuestion.backendFramework,
    );

    if (!__backendFrameworkResource) {
      throw new UnidentifiedFrameworkError(
        `${chalk.bold('Unidentified framework project')}: Backend framework resource is not defined.`,
      );
    }

    const __backendFrameworkTemplateFolder = templatesFiles.find(
      (f) =>
        f.name === __backendFrameworkResource.templateName && f.isDirectory(),
    );

    if (!__backendFrameworkTemplateFolder) {
      throw new PathNotFoundError(
        `${chalk.bold('Path not found')}: Backend framework folder not found.`,
      );
    }

    const __backendFrameworkTemplateSourcePath = path.join(
      __backendFrameworkTemplateFolder.parentPath,
      __backendFrameworkTemplateFolder.name,
    );
    const __backendFrameworkTemplateDesPath = path.join(
      options.dir,
      __renewProjectName(projectName),
    );
    __unableToOverwriteProject(__backendFrameworkTemplateDesPath);

    switch (__backendFrameworkQuestion.backendFramework) {
      case 'Express.js':
        const __expressDependeciesSelection: {
          expressDependencies: string[];
        } = await inquirer.prompt([
          {
            name: 'expressDependencies',
            type: 'checkbox',
            message: 'Select npm packages to include in your project:',
            choices: EXPRESS_DEPENDENCIES.packages
              .sort((i, e) =>
                i.name
                  .toLowerCase()
                  .localeCompare(e.name.toLowerCase(), 'en-US'),
              )
              .map((p) => p.originName),
            loop: false,
          },
        ]);

        const __expressDockerQuestion: {
          addDocker: boolean;
          addDockerBake: boolean;
        } = await inquirer.prompt([
          {
            name: 'addDocker',
            type: 'confirm',
            message: 'Do you want us to add docker to your project? (optional)',
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

        await this.__generateProject(
          spinner,
          projectName,
          __backendFrameworkQuestion.backendFramework,
          __backendFrameworkTemplateSourcePath,
          __backendFrameworkTemplateDesPath,
        );

        await this.__generateInstallAndUpdateDependencies(
          spinner,
          __expressDependeciesSelection.expressDependencies,
          __backendFrameworkTemplateDesPath,
          projectName,
        );

        if (__expressDockerQuestion.addDocker) {
          await this.__setupDocker(
            spinner,
            __expressDockerQuestion.addDocker,
            __expressDockerQuestion.addDockerBake,
            __backendFrameworkTemplateDesPath,
          );
        }

        if (options.git) {
          await this.__runAddGit(
            spinner,
            projectName,
            __backendFrameworkTemplateDesPath,
          );
        }

        if (options.license) {
          await this.__runAddLicense(
            spinner,
            projectName,
            __backendFrameworkTemplateDesPath,
          );
        }

        if (options.ts) {
          await this.__runAddTypescript(
            spinner,
            projectType.toLowerCase(),
            __backendFrameworkQuestion.backendFramework,
            projectName,
            __backendFrameworkTemplateDesPath,
          );
        }

        console.log(
          boxen(
            `You can check the project on ${chalk.bold(
              __backendFrameworkTemplateDesPath,
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
        const __fastifyDependenciesSelection: {
          backendPackages: string[];
        } = await inquirer.prompt([
          {
            name: 'backendPackages',
            type: 'checkbox',
            message: 'Select npm packages to include in your project:',
            choices: FASTIFY_DEPENDENCIES.packages
              .sort((i, e) =>
                i.name
                  .toLowerCase()
                  .localeCompare(e.name.toLowerCase(), 'en-US'),
              )
              .map((p) => p.originName),
            loop: false,
          },
        ]);

        const __fastifyDockerQuestion: {
          addDocker: boolean;
          addDockerBake: boolean;
        } = await inquirer.prompt([
          {
            name: 'addDocker',
            type: 'confirm',
            message: 'Do you want us to add docker to your project? (optional)',
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

        await this.__generateProject(
          spinner,
          projectName,
          __backendFrameworkQuestion.backendFramework,
          __backendFrameworkTemplateSourcePath,
          __backendFrameworkTemplateDesPath,
        );

        await this.__generateInstallAndUpdateDependencies(
          spinner,
          __fastifyDependenciesSelection.backendPackages,
          __backendFrameworkTemplateDesPath,
          projectName,
        );

        if (__fastifyDockerQuestion.addDocker) {
          await this.__setupDocker(
            spinner,
            __fastifyDockerQuestion.addDocker,
            __fastifyDockerQuestion.addDockerBake,
            __backendFrameworkTemplateDesPath,
          );
        }

        if (options.git) {
          await this.__runAddGit(
            spinner,
            projectName,
            __backendFrameworkTemplateDesPath,
          );
        }

        if (options.license) {
          await this.__runAddLicense(
            spinner,
            projectName,
            __backendFrameworkTemplateDesPath,
          );
        }

        if (options.ts) {
          await this.__runAddTypescript(
            spinner,
            projectType.toLowerCase(),
            __backendFrameworkQuestion.backendFramework,
            projectName,
            __backendFrameworkTemplateDesPath,
          );
        }

        console.log(
          boxen(
            `You can check the project on ${chalk.bold(
              __backendFrameworkTemplateDesPath,
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
        const __nestDependenciesSelection: {
          nestDependencies: string[];
        } = await inquirer.prompt([
          {
            name: 'nestDependencies',
            type: 'checkbox',
            message: 'Select npm packages to include in your project:',
            choices: NEST_DEPENDENCIES.packages
              .sort((i, e) =>
                i.name
                  .toLowerCase()
                  .localeCompare(e.name.toLowerCase(), 'en-US'),
              )
              .map((p) => p.originName),
            loop: false,
          },
        ]);

        const __nestDockerQuestion: {
          addDocker: boolean;
          addDockerBake: boolean;
        } = await inquirer.prompt([
          {
            name: 'addDocker',
            type: 'confirm',
            message: 'Do you want us to add docker to your project? (optional)',
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

        await this.__generateProject(
          spinner,
          projectName,
          __backendFrameworkQuestion.backendFramework,
          __backendFrameworkTemplateSourcePath,
          __backendFrameworkTemplateDesPath,
        );

        await this.__generateInstallAndUpdateDependencies(
          spinner,
          __nestDependenciesSelection.nestDependencies,
          __backendFrameworkTemplateDesPath,
          projectName,
        );

        if (!__nestDockerQuestion.addDocker) {
          await this.__setupDocker(
            spinner,
            __nestDockerQuestion.addDocker,
            __nestDockerQuestion.addDockerBake,
            __backendFrameworkTemplateDesPath,
          );
        }

        if (options.git) {
          await this.__runAddGit(
            spinner,
            projectName,
            __backendFrameworkTemplateDesPath,
          );
        }

        if (options.license) {
          await this.__runAddLicense(
            spinner,
            projectName,
            __backendFrameworkTemplateDesPath,
          );
        }

        if (options.ts) {
          await this.__runAddTypescript(
            spinner,
            projectType.toLowerCase(),
            __backendFrameworkQuestion.backendFramework,
            projectName,
            __backendFrameworkTemplateDesPath,
          );
        }

        console.log(
          boxen(
            `You can check the project on ${chalk.bold(
              __backendFrameworkTemplateDesPath,
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
      case 'Node.js':
        const __nodeDependenciesSelection: {
          nestDependencies: string[];
        } = await inquirer.prompt([
          {
            name: 'nestDependencies',
            type: 'checkbox',
            message: 'Select npm packages to include in your project:',
            choices: NODE_DEPENDENCIES.packages
              .sort((i, e) =>
                i.name
                  .toLowerCase()
                  .localeCompare(e.name.toLowerCase(), 'en-US'),
              )
              .map((p) => p.originName),
            loop: false,
          },
        ]);

        const __nodeDockerQuestion: {
          addDocker: boolean;
          addDockerBake: boolean;
        } = await inquirer.prompt([
          {
            name: 'addDocker',
            type: 'confirm',
            message: 'Do you want us to add docker to your project? (optional)',
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

        await this.__generateProject(
          spinner,
          projectName,
          __backendFrameworkQuestion.backendFramework,
          __backendFrameworkTemplateSourcePath,
          __backendFrameworkTemplateDesPath,
        );

        await this.__generateInstallAndUpdateDependencies(
          spinner,
          __nodeDependenciesSelection.nestDependencies,
          __backendFrameworkTemplateDesPath,
          projectName,
        );

        if (!__nodeDockerQuestion.addDocker) {
          await this.__setupDocker(
            spinner,
            __nodeDockerQuestion.addDocker,
            __nodeDockerQuestion.addDockerBake,
            __backendFrameworkTemplateDesPath,
          );
        }

        if (options.git) {
          await this.__runAddGit(
            spinner,
            projectName,
            __backendFrameworkTemplateDesPath,
          );
        }

        if (options.license) {
          await this.__runAddLicense(
            spinner,
            projectName,
            __backendFrameworkTemplateDesPath,
          );
        }

        if (options.ts) {
          await this.__runAddTypescript(
            spinner,
            projectType.toLowerCase(),
            __backendFrameworkQuestion.backendFramework,
            projectName,
            __backendFrameworkTemplateDesPath,
          );
        }

        console.log(
          boxen(
            `You can check the project on ${chalk.bold(
              __backendFrameworkTemplateDesPath,
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
  }

  private async __frontendProjectType(
    spinner: Ora,
    options: OptionValues,
    templatesFiles: fs.Dirent<string>[],
    projectName: string,
    projectType: string,
  ) {
    const __frontendFrameworkQuestion = await inquirer.prompt([
      {
        name: 'frontendFramework',
        type: 'select',
        message: 'Which frontend framework do you want to use:',
        choices: FRONTEND_FRAMEWORKS.frameworks
          .sort((i, e) =>
            i.name.toLowerCase().localeCompare(e.name.toLowerCase(), 'en-US'),
          )
          .map((f) => f.name),
        default: 'Next.js',
      },
    ]);

    const __frontendFrameworkResource = FRONTEND_FRAMEWORKS.frameworks.find(
      (f) => f.name === __frontendFrameworkQuestion.frontendFramework,
    );

    if (!__frontendFrameworkResource) {
      throw new UnidentifiedFrameworkError(
        `${chalk.bold('Unidentified framework project')}: Frontend framework resource is not defined.`,
      );
    }

    const _frontendFrameworkFolder = templatesFiles.find(
      (f) =>
        f.name === __frontendFrameworkResource.templateName && f.isDirectory(),
    );

    if (!_frontendFrameworkFolder) {
      throw new PathNotFoundError(
        `${chalk.bold('Path not found')}: Frontend framework folder not found.`,
      );
    }

    const __frontendFrameworkTemplateSourcePath = path.join(
      _frontendFrameworkFolder.parentPath,
      _frontendFrameworkFolder.name,
    );
    const __frontendFrameworkTemplateDesPath = path.join(
      options.dir,
      __renewProjectName(projectName),
    );
    __unableToOverwriteProject(__frontendFrameworkTemplateDesPath);

    switch (__frontendFrameworkQuestion.frontendFramework) {
      case 'Astro.js':
        const __astroDependenciesSelection: {
          astroDependencies: string[];
        } = await inquirer.prompt([
          {
            name: 'astroDependencies',
            type: 'checkbox',
            message: 'Select npm packages to include in your project:',
            choices: ASTRO_DEPENDENCIES.packages
              .sort((i, e) =>
                i.name
                  .toLowerCase()
                  .localeCompare(e.name.toLowerCase(), 'en-US'),
              )
              .map((p) => p.originName),
            loop: false,
          },
        ]);

        const __astroDockerQuestion: {
          addDocker: boolean;
          addDockerBake: boolean;
        } = await inquirer.prompt([
          {
            name: 'addDocker',
            type: 'confirm',
            message: 'Do you want us to add docker to your project? (optional)',
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

        await this.__generateProject(
          spinner,
          projectName,
          __frontendFrameworkQuestion.frontendFramework,
          __frontendFrameworkTemplateSourcePath,
          __frontendFrameworkTemplateDesPath,
        );

        await this.__generateInstallAndUpdateDependencies(
          spinner,
          __astroDependenciesSelection.astroDependencies,
          __frontendFrameworkTemplateDesPath,
          projectName,
        );

        if (__astroDockerQuestion.addDocker) {
          await this.__setupDocker(
            spinner,
            __astroDockerQuestion.addDocker,
            __astroDockerQuestion.addDockerBake,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.git) {
          await this.__runAddGit(
            spinner,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.license) {
          await this.__runAddLicense(
            spinner,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.ts) {
          await this.__runAddTypescript(
            spinner,
            projectType.toLowerCase(),
            __frontendFrameworkQuestion.frontendFramework,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        console.log(
          boxen(
            `You can check the project on ${chalk.bold(
              __frontendFrameworkTemplateDesPath,
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
      case 'Next.js':
        const __nextDependenciesSelection: {
          nextDependencies: string[];
        } = await inquirer.prompt([
          {
            name: 'nextDependencies',
            type: 'checkbox',
            message: 'Select npm packages to include in your project:',
            choices: NEXT_DEPENDENCIES.packages
              .sort((i, e) =>
                i.name
                  .toLowerCase()
                  .localeCompare(e.name.toLowerCase(), 'en-US'),
              )
              .map((p) => p.originName),
            loop: false,
          },
        ]);

        const __nextDockerQuestion: {
          addDocker: boolean;
          addDockerBake: boolean;
        } = await inquirer.prompt([
          {
            name: 'addDocker',
            type: 'confirm',
            message: 'Do you want us to add docker to your project? (optional)',
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

        await this.__generateProject(
          spinner,
          projectName,
          __frontendFrameworkQuestion.frontendFramework,
          __frontendFrameworkTemplateSourcePath,
          __frontendFrameworkTemplateDesPath,
        );

        await this.__generateInstallAndUpdateDependencies(
          spinner,
          __nextDependenciesSelection.nextDependencies,
          __frontendFrameworkTemplateDesPath,
          projectName,
        );

        await this.__setupDocker(
          spinner,
          __nextDockerQuestion.addDocker,
          __nextDockerQuestion.addDockerBake,
          __frontendFrameworkTemplateDesPath,
        );
        if (__nextDockerQuestion.addDocker) {
        }

        if (options.git) {
          await this.__runAddGit(
            spinner,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.license) {
          await this.__runAddLicense(
            spinner,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.ts) {
          await this.__runAddTypescript(
            spinner,
            projectType.toLowerCase(),
            __frontendFrameworkQuestion.frontendFramework,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        console.log(
          boxen(
            `You can check the project on ${chalk.bold(
              __frontendFrameworkTemplateDesPath,
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
      case 'SolidJS':
        const __solidDependenciesSelection: {
          solidDependencies: string[];
        } = await inquirer.prompt([
          {
            name: 'solidDependencies',
            type: 'checkbox',
            message: 'Select npm packages to include in your project:',
            choices: SOLID_DEPENDENCIES.packages
              .sort((i, e) =>
                i.name
                  .toLowerCase()
                  .localeCompare(e.name.toLowerCase(), 'en-US'),
              )
              .map((p) => p.originName),
            loop: false,
          },
        ]);

        const __solidDockerQuestion: {
          addDocker: boolean;
          addDockerBake: boolean;
        } = await inquirer.prompt([
          {
            name: 'addDocker',
            type: 'confirm',
            message: 'Do you want us to add docker to your project? (optional)',
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

        await this.__generateProject(
          spinner,
          projectName,
          __frontendFrameworkQuestion.frontendFramework,
          __frontendFrameworkTemplateSourcePath,
          __frontendFrameworkTemplateDesPath,
        );

        await this.__generateInstallAndUpdateDependencies(
          spinner,
          __solidDependenciesSelection.solidDependencies,
          __frontendFrameworkTemplateDesPath,
          projectName,
        );

        if (__solidDockerQuestion.addDocker) {
          await this.__setupDocker(
            spinner,
            __solidDockerQuestion.addDocker,
            __solidDockerQuestion.addDockerBake,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.git) {
          await this.__runAddGit(
            spinner,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.license) {
          await this.__runAddLicense(
            spinner,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.ts) {
          await this.__runAddTypescript(
            spinner,
            projectType.toLowerCase(),
            __frontendFrameworkQuestion.frontendFramework,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        console.log(
          boxen(
            `You can check the project on ${chalk.bold(
              __frontendFrameworkTemplateDesPath,
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
        const __svelteDependenciesSelection: {
          svelteDependencies: string[];
        } = await inquirer.prompt([
          {
            name: 'svelteDependencies',
            type: 'checkbox',
            message: 'Select npm packages to include in your project:',
            choices: SVELTE_DEPENDENCIES.packages
              .sort((i, e) =>
                i.name
                  .toLowerCase()
                  .localeCompare(e.name.toLowerCase(), 'en-US'),
              )
              .map((p) => p.originName),
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
            message: 'Do you want us to add docker to your project? (optional)',
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

        await this.__generateProject(
          spinner,
          projectName,
          __frontendFrameworkQuestion.frontendFramework,
          __frontendFrameworkTemplateSourcePath,
          __frontendFrameworkTemplateDesPath,
        );

        await this.__generateInstallAndUpdateDependencies(
          spinner,
          __svelteDependenciesSelection.svelteDependencies,
          __frontendFrameworkTemplateDesPath,
          projectName,
        );

        if (_svelteAddDockerQuestion.addDocker) {
          await this.__setupDocker(
            spinner,
            _svelteAddDockerQuestion.addDocker,
            _svelteAddDockerQuestion.addDockerBake,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.git) {
          await this.__runAddGit(
            spinner,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.license) {
          await this.__runAddLicense(
            spinner,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.ts) {
          await this.__runAddTypescript(
            spinner,
            projectType.toLowerCase(),
            __frontendFrameworkQuestion.frontendFramework,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        console.log(
          boxen(
            `You can check the project on ${chalk.bold(
              __frontendFrameworkTemplateDesPath,
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
        const __vueDependenciesSelection: {
          vueDependencies: string[];
        } = await inquirer.prompt([
          {
            name: 'vueDependencies',
            type: 'checkbox',
            message: 'Select npm packages to include in your project:',
            choices: VUE_DEPENDENCIES.packages
              .sort((i, e) =>
                i.name
                  .toLowerCase()
                  .localeCompare(e.name.toLowerCase(), 'en-US'),
              )
              .map((p) => p.originName),
            loop: false,
          },
        ]);

        const __vueDockerQuestion: {
          addDocker: boolean;
          addDockerBake: boolean;
        } = await inquirer.prompt([
          {
            name: 'addDocker',
            type: 'confirm',
            message: 'Do you want us to add docker to your project? (optional)',
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

        await this.__generateProject(
          spinner,
          projectName,
          __frontendFrameworkQuestion.frontendFramework,
          __frontendFrameworkTemplateSourcePath,
          __frontendFrameworkTemplateDesPath,
        );

        await this.__generateInstallAndUpdateDependencies(
          spinner,
          __vueDependenciesSelection.vueDependencies,
          __frontendFrameworkTemplateDesPath,
          projectName,
        );

        if (__vueDockerQuestion.addDocker) {
          await this.__setupDocker(
            spinner,
            __vueDockerQuestion.addDocker,
            __vueDockerQuestion.addDockerBake,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.git) {
          await this.__runAddGit(
            spinner,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.license) {
          await this.__runAddLicense(
            spinner,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.ts) {
          await this.__runAddTypescript(
            spinner,
            projectType.toLowerCase(),
            __frontendFrameworkQuestion.frontendFramework,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        console.log(
          boxen(
            `You can check the project on ${chalk.bold(
              __frontendFrameworkTemplateDesPath,
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
      case 'VanillaJS':
        const __vanillaDependenciesSelection: {
          vanillaDependencies: string[];
        } = await inquirer.prompt([
          {
            name: 'vanillaDependencies',
            type: 'checkbox',
            message: 'Select npm packages to include in your project:',
            choices: VANILLA_DEPENDENCIES.packages
              .sort((i, e) =>
                i.name
                  .toLowerCase()
                  .localeCompare(e.name.toLowerCase(), 'en-US'),
              )
              .map((p) => p.originName),
            loop: false,
          },
        ]);

        const __vanillaDockerQuestion: {
          addDocker: boolean;
          addDockerBake: boolean;
        } = await inquirer.prompt([
          {
            name: 'addDocker',
            type: 'confirm',
            message: 'Do you want us to add docker to your project? (optional)',
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

        await this.__generateProject(
          spinner,
          projectName,
          __frontendFrameworkQuestion.frontendFramework,
          __frontendFrameworkTemplateSourcePath,
          __frontendFrameworkTemplateDesPath,
        );

        await this.__generateInstallAndUpdateDependencies(
          spinner,
          __vanillaDependenciesSelection.vanillaDependencies,
          __frontendFrameworkTemplateDesPath,
          projectName,
        );

        if (__vanillaDockerQuestion.addDocker) {
          await this.__setupDocker(
            spinner,
            __vanillaDockerQuestion.addDocker,
            __vanillaDockerQuestion.addDockerBake,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.git) {
          await this.__runAddGit(
            spinner,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.license) {
          await this.__runAddLicense(
            spinner,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        if (options.ts) {
          await this.__runAddTypescript(
            spinner,
            projectType.toLowerCase(),
            __frontendFrameworkQuestion.frontendFramework,
            projectName,
            __frontendFrameworkTemplateDesPath,
          );
        }

        console.log(
          boxen(
            `You can check the project on ${chalk.bold(
              __frontendFrameworkTemplateDesPath,
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
  }

  private async __generateProject(
    spinner: Ora,
    projectName: string,
    framework: string,
    sourcePath: string,
    desPath: string,
  ) {
    spinner.start(
      `Allright ${chalk.bold(
        (await __userRealName()).split(' ')[0],
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

  private __getDockerResources() {
    const __dockerTemplatesPath = path.join(__basePath, 'templates/docker');
    __pathNotExist(__dockerTemplatesPath);

    const __dockerSources = fs.readdirSync(__dockerTemplatesPath, {
      withFileTypes: true,
    });

    return __dockerSources;
  }

  private __getDockersPaths(
    filename: string,
    templates: fs.Dirent<string>[],
    desPath: string,
  ) {
    const __dockerFile = templates.find((f) => f.name === filename);

    if (!__dockerFile) {
      throw new UnidentifiedTemplateError(
        `${chalk.bold('Unidentified template')}: ${chalk.bold(filename)} file template is not defined.`,
      );
    }

    const __dockerFileSourcePath = path.join(
      __dockerFile.parentPath,
      __dockerFile.name,
    );
    const __dockerFileDesPath = path.join(desPath, __dockerFile.name);

    return {
      sourcePath: __dockerFileSourcePath,
      desPath: __dockerFileDesPath,
    };
  }

  private async __runAddDocker(spinner: Ora, desPath: string) {
    spinner.start('Start adding docker compose file 🐳...');

    const __resources = this.__getDockerResources();

    const __dockerComposeSources = this.__getDockersPaths(
      'compose.yml',
      __resources,
      desPath,
    );

    await fse.copy(
      __dockerComposeSources.sourcePath,
      __dockerComposeSources.desPath,
    );

    spinner.succeed('Adding docker compose file succeed ✅');

    spinner.start('Start adding dockerfile 🐳...');

    const __dockerfileSources = this.__getDockersPaths(
      'npm.Dockerfile',
      __resources,
      desPath,
    );

    await fse.copy(__dockerfileSources.sourcePath, __dockerfileSources.desPath);

    spinner.succeed('Adding dockerfile succeed ✅');
  }

  private async __runAddDockerWithBake(spinner: Ora, desPath: string) {
    spinner.start('Start adding docker compose file 🐳...');

    const __resources = this.__getDockerResources();

    const __dockerComposePaths = this.__getDockersPaths(
      'compose.yml',
      __resources,
      desPath,
    );

    await fse.copy(
      __dockerComposePaths.sourcePath,
      __dockerComposePaths.desPath,
    );

    spinner.succeed('Adding docker compose file succeed ✅');

    spinner.start('Start adding dockerfile 🐳...');

    const __dockerfilePaths = this.__getDockersPaths(
      'npm.Dockerfile',
      __resources,
      desPath,
    );

    await fse.copy(__dockerfilePaths.sourcePath, __dockerfilePaths.desPath);

    spinner.succeed('Adding dockerfile succeed ✅');

    spinner.start('Start adding docker bake file 🍞...');

    const __dockerBakePaths = this.__getDockersPaths(
      'docker-bake.hcl',
      __resources,
      desPath,
    );

    await fse.copy(__dockerBakePaths.sourcePath, __dockerBakePaths.desPath);

    spinner.succeed('Adding docker bake file succeed ✅');
  }

  private async __runAddGit(
    spinner: Ora,
    projectName: string,
    desPath: string,
  ) {
    const __initializeGitQuestion = await inquirer.prompt({
      name: 'addGit',
      type: 'confirm',
      message: `Do you want us to run ${chalk.bold('git init')}? (optional)`,
      default: false,
    });

    if (!__initializeGitQuestion.addGit) {
      spinner.warn(
        `${chalk.yellow(
          `It's okay ${chalk.bold(
            (await __userRealName()).split(' ')[0],
          )}, you can run ${chalk.bold('git init')} later by yourself.`,
        )}`,
      );
      return;
    }

    spinner.start(
      `Allright ${chalk.bold(
        (await __userRealName()).split(' ')[0],
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

  private async __runAddLicense(
    spinner: Ora,
    projectName: string,
    desPath: string,
  ) {
    const __licenseQuestion = await inquirer.prompt({
      name: 'addLicense',
      type: 'confirm',
      message: `Do you want us to add ${chalk.bold(
        'LICENSE',
      )} file into your project? (optional)`,
      default: false,
    });

    if (!__licenseQuestion.addLicense) {
      spinner.warn(
        `${chalk.yellow(
          `It's okay ${chalk.bold(
            (await __userRealName()).split(' ')[0],
          )}, you can add ${chalk.bold('LICENSE')} file manually.`,
        )}`,
      );
      return;
    }

    const __licenseSelection: {
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
      choices: LICENSES.licenses
        .sort((i, e) =>
          i.name.toLowerCase().localeCompare(e.name.toLowerCase(), 'en-US'),
        )
        .map((l) => l.name),
      default: 'MIT License',
    });

    spinner.start(
      `Start adding ${chalk.bold(
        __licenseSelection.license,
      )} file into ${chalk.bold(projectName)} 🧾...`,
    );

    const __licenseFile = LICENSES.licenses.find(
      (l) => l.name === __licenseSelection.license,
    );

    if (!__licenseFile) {
      throw new UnidentifiedTemplateError(
        `${chalk.bold('Unidentified template')}: ${chalk.bold(__licenseSelection.license)} file template is not defined.`,
      );
    }

    const _apacheLicenseSourcePath = path.join(__basePath, __licenseFile.path);

    await fse.copy(_apacheLicenseSourcePath, desPath);

    spinner.succeed(
      `Adding ${chalk.bold(
        __licenseSelection.license,
      )} file on ${chalk.bold(projectName)} succeed ✅`,
    );
  }

  private async __runAddTypescript(
    spinner: Ora,
    projectType: string,
    framework: string,
    projectName: string,
    desPath: string,
  ) {
    const __frameworkList =
      projectType !== 'backend'
        ? FRONTEND_FRAMEWORKS.frameworks
        : BACKEND_FRAMEWORKS.frameworks;

    const __frameworkFile = __frameworkList.find((f) => f.name === framework);

    if (!__frameworkFile) {
      throw new UnidentifiedTemplateError(
        `${chalk.bold('Unidentified template')}: ${chalk.bold(framework)} file template is not defined.`,
      );
    }

    const _frameworkPath = path.join(__basePath, __frameworkFile.path);

    const _frameworkFiles = fs.readdirSync(_frameworkPath, {
      withFileTypes: true,
    });

    const __tsConfigFile = _frameworkFiles.find(
      (f) => f.name === 'tsconfig.json',
    );

    if (__tsConfigFile !== undefined) {
      spinner.warn(
        `${chalk.yellow(`${chalk.bold('tsconfig.json')} is exist on ${chalk.bold(projectName)}, means that ${chalk.bold('Typescript')} already installed.`)}`,
      );
      return;
    }

    const __typescriptFileQuestion = await inquirer.prompt({
      name: 'addTypescript',
      type: 'confirm',
      message: `Do you want us to add ${chalk.bold(
        'Typescript',
      )} into your project? (optional)`,
      default: false,
    });

    if (!__typescriptFileQuestion.addTypescript) {
      spinner.warn(
        `${chalk.yellow(
          `It's okay ${chalk.bold(
            (await __userRealName()).split(' ')[0],
          )}, you can add ${chalk.bold('Typescript')} manually.`,
        )}`,
      );
      return;
    }

    spinner.start(
      `Allright ${chalk.bold(
        (await __userRealName()).split(' ')[0],
      )}, We are adding ${chalk.bold('Typescript')} on ${chalk.bold(
        projectName,
      )}, please wait...`,
    );

    if (projectType !== 'backend') {
      await this.__generateFrontendTsDependencies(spinner, framework, desPath);
    } else {
      await this.__generateBackendTsDependencies(spinner, framework, desPath);
    }

    const __initializeTypescriptQuestion = await inquirer.prompt({
      name: 'addTsConfig',
      type: 'confirm',
      message: `Do you want us to initialize ${chalk.bold(
        'Typescript',
      )} in your project? (optional)`,
      default: false,
    });

    if (!__initializeTypescriptQuestion.addTsConfig) {
      spinner.warn(
        `${chalk.yellow(
          `It's okay ${chalk.bold(
            (await __userRealName()).split(' ')[0],
          )}, you can initialize ${chalk.bold('Typescript')} by yourself later.`,
        )}`,
      );
      return;
    }

    spinner.start(`Start initialize ${chalk.bold('Typescript')} package...`);

    await execa('npx', ['tsc', '--init'], {
      cwd: desPath,
    });

    spinner.succeed(`Initializing ${chalk.bold('Typescript')} succeed ✅`);

    spinner.start(`Start renaming .js files to .ts`);

    const renamePairs: [string, string][] =
      projectType === 'backend'
        ? [[path.join(desPath, 'index.js'), path.join(desPath, 'index.ts')]]
        : [
            [
              path.join(desPath, 'src', 'main.js'),
              path.join(desPath, 'src', 'main.ts'),
            ],
            [
              path.join(desPath, 'src', 'counter.js'),
              path.join(desPath, 'src', 'counter.ts'),
            ],
          ];

    for (const [__sourcePath, __desPath] of renamePairs) {
      if (fs.existsSync(__sourcePath)) {
        spinner.start(
          `Renaming ${chalk.bold(__sourcePath)} to ${chalk.bold(__desPath)}...`,
        );

        fs.renameSync(__sourcePath, __desPath);

        spinner.succeed(
          `Renamed ${chalk.bold(__sourcePath)} → ${chalk.bold(__desPath)} ✅`,
        );
      }
    }

    spinner.succeed(`All file renames complete for ${projectName} ✅`);

    spinner.succeed(
      `Adding ${chalk.bold('Typescript')} on ${projectName} succeed ✅`,
    );
  }

  private async __generateBackendTsDependencies(
    spinner: Ora,
    framework: string,
    desPath: string,
  ) {
    if (framework === 'Express.js') {
      for (const p of TYPESCRIPT_DEPENDENCIES.backend['Express.js']) {
        spinner.start(`Start installing ${chalk.bold(p)} package...`);

        await execa('npm', ['install', '-D', `${p}`], {
          cwd: desPath,
        });

        spinner.succeed(`Installing ${chalk.bold(p)} package succeed ✅`);
      }
    }

    if (framework === 'Fastify') {
      for (const p of TYPESCRIPT_DEPENDENCIES.backend['Fastify']) {
        spinner.start(`Start installing ${chalk.bold(p)} package...`);

        await execa('npm', ['install', '-D', `${p}`], {
          cwd: desPath,
        });

        spinner.succeed(`Installing ${chalk.bold(p)} package succeed ✅`);
      }
    }

    if (framework === 'NestJS') {
      for (const p of TYPESCRIPT_DEPENDENCIES.backend['NestJS']) {
        spinner.start(`Start installing ${chalk.bold(p)} package...`);

        await execa('npm', ['install', '-D', `${p}`], {
          cwd: desPath,
        });

        spinner.succeed(`Installing ${chalk.bold(p)} package succeed ✅`);
      }
    }

    if (framework === 'Node.js') {
      for (const p of TYPESCRIPT_DEPENDENCIES.backend['Node.js']) {
        spinner.start(`Start installing ${chalk.bold(p)} package...`);

        await execa('npm', ['install', '-D', `${p}`], {
          cwd: desPath,
        });

        spinner.succeed(`Installing ${chalk.bold(p)} package succeed ✅`);
      }
    }
  }

  private async __generateFrontendTsDependencies(
    spinner: Ora,
    framework: string,
    desPath: string,
  ) {
    if (framework === 'Next.js') {
      for (const p of TYPESCRIPT_DEPENDENCIES.frontend['Next.js']) {
        spinner.start(`Start installing ${chalk.bold(p)} package...`);

        await execa('npm', ['install', '-D', `${p}`], {
          cwd: desPath,
        });

        spinner.succeed(`Installing ${chalk.bold(p)} package succeed ✅`);
      }
    }

    if (framework === 'Vue.js') {
      for (const p of TYPESCRIPT_DEPENDENCIES.frontend['Vue.js']) {
        spinner.start(`Start installing ${chalk.bold(p)} package...`);

        await execa('npm', ['install', '-D', `${p}`], {
          cwd: desPath,
        });

        spinner.succeed(`Installing ${chalk.bold(p)} package succeed ✅`);
      }
    }

    if (framework === 'Svelte') {
      for (const p of TYPESCRIPT_DEPENDENCIES.frontend['Svelte']) {
        spinner.start(`Start installing ${chalk.bold(p)} package...`);

        await execa('npm', ['install', '-D', `${p}`], {
          cwd: desPath,
        });

        spinner.succeed(`Installing ${chalk.bold(p)} package succeed ✅`);
      }
    }

    if (framework === 'SolidJS') {
      for (const p of TYPESCRIPT_DEPENDENCIES.frontend['SolidJS']) {
        spinner.start(`Start installing ${chalk.bold(p)} package...`);

        await execa('npm', ['install', '-D', `${p}`], {
          cwd: desPath,
        });

        spinner.succeed(`Installing ${chalk.bold(p)} package succeed ✅`);
      }
    }

    if (framework === 'VanillaJS') {
      for (const p of TYPESCRIPT_DEPENDENCIES.frontend['VanillaJS']) {
        spinner.start(`Start installing ${chalk.bold(p)} package...`);

        await execa('npm', ['install', '-D', `${p}`], {
          cwd: desPath,
        });

        spinner.succeed(`Installing ${chalk.bold(p)} package succeed ✅`);
      }
    }
  }

  private async __runInstallDependencies(
    spinner: Ora,
    packages: string[],
    desPath: string,
  ) {
    spinner.start(
      `Allright ${chalk.bold(
        (await __userRealName()).split(' ')[0],
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

  private async __runUpdateDependencies(
    spinner: Ora,
    projectName: string,
    desPath: string,
  ) {
    const __updateDependenciesQuestion = await inquirer.prompt({
      name: 'updatePackages',
      type: 'confirm',
      message: `Do you want us to run ${chalk.bold('npm update')}? (optional)`,
      default: false,
    });

    if (!__updateDependenciesQuestion.updatePackages) {
      spinner.warn(
        `${chalk.yellow(
          `It's okay ${chalk.bold(
            (await __userRealName()).split(' ')[0],
          )}, you can update the packages later by yourself.`,
        )}`,
      );
      return;
    }

    spinner.start(
      `Allright ${chalk.bold(
        (await __userRealName()).split(' ')[0],
      )}, We are start updating your ${chalk.bold(
        projectName,
      )} packages, please wait...`,
    );

    await execa('npm', ['update'], {
      cwd: desPath,
    });

    spinner.succeed(`Updating ${projectName}  packages succeed ✅`);
  }

  private async __generateInstallAndUpdateDependencies(
    spinner: Ora,
    packages: string[],
    desPath: string,
    projectName: string,
  ) {
    if (packages.length < 1) {
      return;
    }

    await this.__runInstallDependencies(spinner, packages, desPath);

    await this.__runUpdateDependencies(spinner, projectName, desPath);
  }

  private async __setupDocker(
    spinner: Ora,
    addDocker: boolean,
    addDockerBake: boolean,
    desPath: string,
  ) {
    if (!addDocker) return;

    if (!addDockerBake) await this.__runAddDocker(spinner, desPath);
    else await this.__runAddDockerWithBake(spinner, desPath);
  }
}
