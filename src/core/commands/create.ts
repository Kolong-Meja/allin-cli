import { UnidentifiedProjectTypeError } from '@/exceptions/error.js';
import {
  __detectProjectTypeFromInput,
  __renewProjectName,
} from '@/utils/string.js';

import { __basePath, __config, __userRealName } from '@/config.js';
import { DIRTY_WORDS, PROJECT_TYPES } from '@/constants/default.js';
import {
  __containHarassmentWords,
  __pathNotExist,
} from '@/exceptions/trigger.js';
import type { Mixed } from '@/types/general.js';
import { __gradientColor } from '@/utils/ascii.js';
import boxen from 'boxen';
import chalk from 'chalk';
import type { OptionValues } from 'commander';
import fs from 'fs';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';
import { BackendGenerator } from '../generators/backend.js';
import { FrontendGenerator } from '../generators/frontend.js';
import { isNull, isUndefined } from '@/utils/guard.js';

export class CreateCommand {
  static #instance: CreateCommand;

  private constructor() {}

  public static get instance(): CreateCommand {
    if (!CreateCommand.#instance) {
      CreateCommand.#instance = new CreateCommand();
    }

    return CreateCommand.#instance;
  }

  public async create(
    projectName: Mixed,
    projectDir: Mixed,
    projectType: Mixed,
    options: OptionValues,
  ) {
    const spinner = ora({
      spinner: 'dots8',
      color: 'green',
      interval: 100,
    });

    const start = performance.now();

    try {
      if (projectType !== undefined && !PROJECT_TYPES.includes(projectType)) {
        throw new UnidentifiedProjectTypeError(
          `${projectType} is not found or exist. Choose between ${PROJECT_TYPES.join(', ')}`,
        );
      }

      const projectNameQuestion = await inquirer.prompt({
        name: 'projectName',
        type: 'input',
        message: "What's the name of your project?",
        default: 'allin-project',
        when: () => isUndefined(options.name) && isUndefined(projectName),
      });

      const userProjectName = !isUndefined(options.name)
        ? __renewProjectName(options.name)
        : !isUndefined(projectName)
          ? __renewProjectName(projectName)
          : __renewProjectName(projectNameQuestion.projectName);
      __containHarassmentWords(userProjectName, DIRTY_WORDS);

      const isProjectTypeDetected =
        __detectProjectTypeFromInput(userProjectName);

      if (
        isProjectTypeDetected !== null &&
        typeof projectType !== 'undefined'
      ) {
        console.warn(
          boxen(
            'The [type] argument will not be used, as the system detects the project type from the project name.',
            {
              title: 'Warning Information',
              titleAlignment: 'center',
              padding: 1,
              margin: 1,
              borderColor: 'yellow',
            },
          ),
        );
      }

      const projectTypeQuestion = await inquirer.prompt([
        {
          name: 'projectType',
          type: 'list',
          message: 'What type of project do you want create:',
          choices: PROJECT_TYPES,
          default: 'backend',
          when: () =>
            isNull(isProjectTypeDetected) &&
            isUndefined(options.backend) &&
            isUndefined(options.frontend) &&
            isUndefined(options.type) &&
            isUndefined(projectType),
        },
      ]);

      const resolveProjectType = (): string => {
        return (
          isProjectTypeDetected ??
          (options.frontend ? 'frontend' : undefined) ??
          (options.backend ? 'backend' : undefined) ??
          projectType ??
          projectTypeQuestion.projectType
        );
      };

      const userProjectType = resolveProjectType();

      switch (userProjectType) {
        case 'backend':
          const backendProjectTemplateDirPath = path.join(
            __basePath,
            'templates',
            userProjectType,
          );
          __pathNotExist(backendProjectTemplateDirPath);

          const backendProjectTemplateFiles = fs.readdirSync(
            backendProjectTemplateDirPath,
            {
              withFileTypes: true,
            },
          );
          __pathNotExist(options.dir ?? projectDir);

          const backendGenerator = BackendGenerator.instance;

          await backendGenerator.generate({
            projectNameArg: userProjectName,
            projectDirArg: projectDir,
            spinner: spinner,
            optionValues: options,
            templatesFiles: backendProjectTemplateFiles,
            projectName: userProjectName,
            projectType: userProjectType,
          });
          break;
        case 'frontend':
          const frontendProjectTemplateDirPath = path.join(
            __basePath,
            'templates',
            userProjectType,
          );
          __pathNotExist(frontendProjectTemplateDirPath);

          const frontendProjectTemplateFiles = fs.readdirSync(
            frontendProjectTemplateDirPath,
            {
              withFileTypes: true,
            },
          );
          __pathNotExist(options.dir ?? projectDir);

          const frontendGenerator = FrontendGenerator.instance;

          await frontendGenerator.generate({
            projectNameArg: projectName,
            projectDirArg: projectDir,
            spinner: spinner,
            optionValues: options,
            templatesFiles: frontendProjectTemplateFiles,
            projectName: userProjectName,
            projectType: userProjectType,
          });
          break;
      }

      const end = performance.now();
      spinner.succeed(
        `Your ${chalk.bold(userProjectName)} is already created. Executed for ${chalk.bold((end - start).toFixed(3))} ms`,
      );
    } catch (error: Mixed) {
      spinner.fail('⛔️ Failed to create project...\n');

      let errorMessage =
        error instanceof Error
          ? error.message
          : `${chalk.bold('Error')}: An unknown error occurred.`;

      if (error.name === 'ExitPromptError') {
        errorMessage = `${chalk.bold(
          'Exit prompt error',
        )}: User forced close the prompt.`;
      }

      if (error) {
        errorMessage = error.message;
      }

      console.error(
        boxen(errorMessage, {
          title: error.name,
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
