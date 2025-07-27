import {
  HarassmentWordsDetected,
  PathNotFoundError,
  UnableOverwriteError,
} from '@/exceptions/error.js';
import {
  __detectProjectTypeFromInput,
  __renewProjectName,
  __renewStringsIntoTitleCase,
} from '@/utils/string.js';

import chalk from 'chalk';
import type { OptionValues } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';
import fs from 'fs';
import boxen from 'boxen';
import { __basePath, __config, __userRealName } from '@/config.js';
import type {
  __AddDockerBakeParams,
  __AddDockerParams,
  __BackendProjectTypeParams,
  __FrontendProjectTypeParams,
  __InstallDependenciesParams,
  __InstallTypescriptParams,
  __SetupDockerParams,
  __SetupInstallationParams,
  __SetupOthersParams,
  __SetupProjectParams,
  __SwitchPackageManagerParams,
  __UpdateDependenciesParams,
  __UseTypescriptParams,
  Mixed,
} from '@/types/general.js';
import { DIRTY_WORDS, PROJECT_TYPES } from '@/constants/default.js';
import {
  __containHarassmentWords,
  __pathNotExist,
  __unableOverwriteProject,
} from '@/exceptions/trigger.js';
import { __gradientColor } from '@/utils/ascii.js';
import { FrontendGenerator } from '../generators/frontend.js';
import { BackendGenerator } from '../generators/backend.js';

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
    console.log(
      boxen(
        `Hello ${chalk.bold((await __userRealName()).split(' ')[0])}, Welcome to ${__gradientColor(__config.appName)} CLI`,
        {
          title: '👾 Welcome Abort Captain! 👾',
          titleAlignment: 'center',
          padding: 1,
          margin: 1,
          borderColor: 'green',
        },
      ),
    );

    const spinner = ora({
      spinner: 'dots8',
      color: 'green',
      interval: 100,
    });

    const start = performance.now();

    try {
      const __projectNamQuestion = await inquirer.prompt({
        name: 'projectName',
        type: 'input',
        message: "What's the name of your project?",
        default: 'my-project',
      });

      const __projectName = __renewProjectName(
        __projectNamQuestion.projectName,
      );
      __containHarassmentWords(__projectName, DIRTY_WORDS);

      const __detectedProjectType = __detectProjectTypeFromInput(__projectName);

      const __projectTypeQuestion = await inquirer.prompt([
        {
          name: 'projectType',
          type: 'list',
          message: 'What type of project do you want create:',
          choices: PROJECT_TYPES,
          default: 'backend',
          when: () =>
            __detectedProjectType === null &&
            typeof options.backend === 'undefined' &&
            typeof options.frontend === 'undefined',
        },
      ]);

      let __projectType: string;

      if (__detectedProjectType) {
        __projectType = __detectedProjectType;
      } else if (options.frontend) {
        __projectType = 'frontend';
      } else if (options.backend) {
        __projectType = 'backend';
      } else {
        throw new Error(
          'Unable to detect project type. Please specify --backend or --frontend.',
        );
      }

      switch (__projectType) {
        case 'backend':
          // if (typeof options.frontend !== 'undefined') {
          //   console.warn(
          //     boxen(
          //       chalk.white(
          //         `⚠️  Ignoring '--frontend=${options.frontend}' because you're generating a backend project.`,
          //       ),
          //       {
          //         title: 'ⓘ Warning Information ⓘ',
          //         titleAlignment: 'center',
          //         padding: 1,
          //         margin: 1,
          //         borderColor: 'yellow',
          //       },
          //     ),
          //   );
          // }

          const __backendTemplatesDirPath = path.join(
            __basePath,
            'templates',
            __projectType,
          );
          __pathNotExist(__backendTemplatesDirPath);

          const __backendTemplatesFiles = fs.readdirSync(
            __backendTemplatesDirPath,
            {
              withFileTypes: true,
            },
          );
          __pathNotExist(options.dir);

          const backendGenerator = BackendGenerator.instance;

          await backendGenerator.generate({
            spinner: spinner,
            optionValues: options,
            templatesFiles: __backendTemplatesFiles,
            projectName: __projectName,
            projectType: __projectTypeQuestion.projectType,
          });
          break;
        case 'frontend':
          // if (typeof options.backend !== 'undefined') {
          //   console.warn(
          //     boxen(
          //       chalk.white(
          //         `⚠️  Ignoring '--backend=${options.backend}' because you're generating a frontend project.`,
          //       ),
          //       {
          //         title: 'ⓘ Warning Information ⓘ',
          //         titleAlignment: 'center',
          //         padding: 1,
          //         margin: 1,
          //         borderColor: 'yellow',
          //       },
          //     ),
          //   );
          // }

          const __frontendTemplatesDirPath = path.join(
            __basePath,
            'templates',
            __projectType,
          );
          __pathNotExist(__frontendTemplatesDirPath);

          const __frontendTemplatesFiles = fs.readdirSync(
            __frontendTemplatesDirPath,
            {
              withFileTypes: true,
            },
          );
          __pathNotExist(options.dir);

          const frontendGenerator = FrontendGenerator.instance;

          await frontendGenerator.generate({
            spinner: spinner,
            optionValues: options,
            templatesFiles: __frontendTemplatesFiles,
            projectName: __projectName,
            projectType: __projectTypeQuestion.projectType,
          });
          break;
      }

      const end = performance.now();
      spinner.succeed(
        `It's done ${chalk.bold(await __userRealName()).split(' ')[0]} 🎉. Your ${chalk.bold(__projectName)} is already created. Executed for ${chalk.bold((end - start).toFixed(3))} ms`,
      );
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
}
