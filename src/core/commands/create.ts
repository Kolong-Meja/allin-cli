import {
  UnidentifiedProjectTypeError,
  UnidentifiedTemplateError,
} from '@/exceptions/error.js';
import {
  __detectProjectTypeFromInput,
  __isContainHarassmentWords,
  __isLookLikePath,
  __isValidProjectName,
  __renewProjectName,
  __sanitizeProjectName,
} from '@/utils/string.js';

import { __basePath } from '@/config.js';
import {
  DIRTY_WORDS,
  PROJECT_TYPES,
  TEMPLATES_META_MAP,
} from '@/constants/global.js';
import { __pathNotFound } from '@/exceptions/trigger.js';
import type { CreateCommandBuilder } from '@/interfaces/global.js';
import type { __CreateProjectParams, Mixed } from '@/types/global.js';
import { isNull, isUndefined } from '@/utils/guard.js';
import boxen from 'boxen';
import chalk from 'chalk';
import fs from 'fs';
import fse from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';
import { BackendGenerator } from '../generators/backend.js';
import { FrontendGenerator } from '../generators/frontend.js';

export class CreateCommand implements CreateCommandBuilder {
  static #instance: CreateCommand;

  private constructor() {}

  public static get instance(): CreateCommand {
    if (!CreateCommand.#instance) {
      CreateCommand.#instance = new CreateCommand();
    }

    return CreateCommand.#instance;
  }

  public async create(params: __CreateProjectParams) {
    const spinner = ora({
      spinner: 'dots8',
      color: 'green',
      interval: 100,
    });

    const start = performance.now();

    try {
      if (
        !isUndefined(params.projectType) &&
        !PROJECT_TYPES.includes(params.projectType)
      ) {
        throw new UnidentifiedProjectTypeError(
          `${params.projectType} is not found or exist. Choose between ${PROJECT_TYPES.join(', ')}`,
        );
      }

      const projectNameQuestion = await inquirer.prompt({
        name: 'projectName',
        type: 'input',
        message: "What's the name of your project?",
        default: 'allin-project',
        when: () =>
          isUndefined(params.options.name) && isUndefined(params.projectName),
        validate: (input: string) => {
          if (__isLookLikePath(input)) {
            return 'Project name must not be a path or contain path separators.';
          }

          const sanitizedStr = __sanitizeProjectName(input);

          if (!__isValidProjectName(sanitizedStr)) {
            return 'Project name invalid. Use letters, digits, hyphen or underscore, start with a letter.';
          }

          if (__isContainHarassmentWords(sanitizedStr, DIRTY_WORDS)) {
            return 'Please choose a different project name (contains disallowed words).';
          }

          return true;
        },
      });

      const resolveProjectName = (): string => {
        return (
          params.options.name ??
          params.projectName ??
          projectNameQuestion.projectName
        );
      };

      const userProjectName = __renewProjectName(resolveProjectName());

      const isProjectTypeDetected =
        __detectProjectTypeFromInput(userProjectName);

      if (!isNull(isProjectTypeDetected) && !isUndefined(params.projectType)) {
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
            isUndefined(params.options.template) &&
            isUndefined(params.options.type) &&
            isUndefined(params.projectType),
        },
      ]);

      const resolveProjectType = (): string => {
        if (isProjectTypeDetected) return isProjectTypeDetected;

        if (params.options.template) {
          const selectedTemplate = TEMPLATES_META_MAP.get(
            params.options.template,
          );

          if (!selectedTemplate) {
            throw new UnidentifiedTemplateError(
              `${chalk.bold('Unidentified template model')}: ${chalk.bold(
                params.options.template,
              )} template model is not found.`,
            );
          }

          return selectedTemplate.category;
        }

        return params.projectType ?? projectTypeQuestion.projectType;
      };

      const userProjectType = resolveProjectType();

      const projectDirQuestion = await inquirer.prompt([
        {
          name: 'projectDir',
          type: 'input',
          message: 'Where do you want to save your project?',
          default: process.cwd(),
          when: () =>
            isUndefined(params.options.dir) && isUndefined(params.projectDir),
          validate: (input: string) => {
            if (!__isLookLikePath(input)) {
              return 'Project name must be a path or contain path separators.';
            }

            return true;
          },
        },
      ]);

      const resolveProjectDir = (): string => {
        return (
          (params.options.dir ? params.options.dir : undefined) ??
          params.projectDir ??
          projectDirQuestion.projectDir
        );
      };

      const userProjectDir = resolveProjectDir();
      __pathNotFound(userProjectDir);

      switch (userProjectType) {
        case 'backend':
          const backendProjectTemplateDirPath = path.join(
            __basePath,
            'templates',
            userProjectType,
          );
          __pathNotFound(backendProjectTemplateDirPath);

          const backendProjectTemplateFiles = fs.readdirSync(
            backendProjectTemplateDirPath,
            {
              withFileTypes: true,
            },
          );
          const backendGenerator = BackendGenerator.instance;

          await backendGenerator.generate({
            projectNameArg: userProjectName,
            spinner: spinner,
            optionValues: params.options,
            templatesFiles: backendProjectTemplateFiles,
            projectName: userProjectName,
            projectType: userProjectType,
            projectDir: userProjectDir,
          });
          break;
        case 'frontend':
          const frontendProjectTemplateDirPath = path.join(
            __basePath,
            'templates',
            userProjectType,
          );
          __pathNotFound(frontendProjectTemplateDirPath);

          const frontendProjectTemplateFiles = fs.readdirSync(
            frontendProjectTemplateDirPath,
            {
              withFileTypes: true,
            },
          );
          const frontendGenerator = FrontendGenerator.instance;

          await frontendGenerator.generate({
            projectNameArg: params.projectName,
            spinner: spinner,
            optionValues: params.options,
            templatesFiles: frontendProjectTemplateFiles,
            projectName: userProjectName,
            projectType: userProjectType,
            projectDir: userProjectDir,
          });
          break;
      }

      const end = performance.now();
      spinner.succeed(
        `Your ${chalk.bold(userProjectName)} is already created. Executed for ${chalk.bold((end - start).toFixed(3))} ms`,
      );
    } catch (error: Mixed) {
      spinner.fail('Failed to create project.\n');

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

      const tempPath = path.join(__basePath, 'templates', 'temp');
      this.__removeUnusedProject(tempPath);

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

  private async __removeUnusedProject(tempPath: string) {
    const tempSubFolders = await fse.readdir(tempPath, { withFileTypes: true });

    for (const folder of tempSubFolders) {
      if (!folder.isDirectory()) continue;
      const itemPath = path.join(tempPath, folder.name);

      try {
        await fse.remove(itemPath);
      } catch (error: Mixed) {
        console.error(
          boxen(error.message, {
            title: error.name,
            titleAlignment: 'center',
            padding: 1,
            margin: 1,
            borderColor: 'red',
          }),
        );
      }
    }
  }
}
