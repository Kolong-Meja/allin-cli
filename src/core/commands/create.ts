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

import { BASE_PATH, __getUserRealName, CACHE_BASE_PATH } from '@/config.js';
import {
  DIRTY_WORDS,
  PROJECT_TYPES,
  TEMPLATES_META_MAP,
} from '@/constants/global.js';
import { __pathNotFound } from '@/exceptions/trigger.js';
import type { CachedEntry, CreateCommandBuilder } from '@/interfaces/global.js';
import type { __CreateProjectParams, Mixed } from '@/types/global.js';
import { isNull, isUndefined } from '@/utils/guard.js';
import boxen from 'boxen';
import chalk from 'chalk';
import fse from 'fs-extra';
import inquirer from 'inquirer';
import ora, { type Ora } from 'ora';
import path from 'path';
import { BackendGenerator } from '../generators/backend.js';
import { FrontendGenerator } from '../generators/frontend.js';
import { MicroGenerator } from '../generators/micro.js';
import type { OptionValues } from 'commander';

export class CreateCommand implements CreateCommandBuilder {
  static #instance: CreateCommand;

  public readonly microGenerator: MicroGenerator;

  private constructor(microGenerator: MicroGenerator) {
    this.microGenerator = microGenerator;
  }

  public static get instance(): CreateCommand {
    if (!CreateCommand.#instance) {
      CreateCommand.#instance = new CreateCommand(MicroGenerator.instance);
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
      // VALIDATE PROJECT TYPE
      if (
        !isUndefined(params.projectType) &&
        !PROJECT_TYPES.includes(params.projectType)
      ) {
        throw new UnidentifiedProjectTypeError(
          `${params.projectType} is not found or exist. Choose between ${PROJECT_TYPES.join(', ')}`,
        );
      }

      // PROMPT PROJECT NAME
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

      // WARN IF PROJECT TYPE MANUALLY SET BUT AUTO DETECTED
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

      // PROMPT PROJECT TYPE IF NOT PROVIDED
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

      // PROMPT PROJECT DIRECTORY
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

      const resolveProjectDir = (): string =>
        params.options.dir ??
        params.projectDir ??
        projectDirQuestion.projectDir;

      const userProjectDir = resolveProjectDir();
      __pathNotFound(userProjectDir);

      // HANDLE CACHE & REUSE CONFIRMATION
      const cachedForType = await this.microGenerator.__getListCachedProjects(
        CACHE_BASE_PATH,
        userProjectType,
      );

      const reuseChoicePrompt = await inquirer.prompt({
        name: 'reuseProject',
        type: 'confirm',
        message: `You've already generated ${userProjectType} projects before. Do you want to reuse one of them?`,
        default: false,
        when: () => cachedForType.length > 0,
      });

      if (
        !reuseChoicePrompt.reuseProject &&
        typeof reuseChoicePrompt.reuseProject !== 'undefined'
      ) {
        console.log(
          boxen(
            `Allright ${chalk.bold((await __getUserRealName()).split(' ')[0])}, thanks for the confirmation.`,
            {
              padding: 1,
              margin: 1,
              borderColor: 'blue',
            },
          ),
        );
      }

      // RUN GENERATION PROCESS
      switch (userProjectType) {
        case 'backend':
          await this.__runBackendProjectGeneratingProcess(
            userProjectType,
            params.projectName,
            spinner,
            params.options,
            userProjectName,
            userProjectDir,
            reuseChoicePrompt.reuseProject,
            cachedForType,
          );
          break;
        case 'frontend':
          await this.__runFrontendProjectGeneratingProcess(
            userProjectType,
            params.projectName,
            spinner,
            params.options,
            userProjectName,
            userProjectDir,
            reuseChoicePrompt.reuseProject,
            cachedForType,
          );
          break;
      }

      // DONE
      const end = performance.now();
      const convertToSeconds = ((end - start) / 1000).toFixed(3);
      spinner.succeed(
        `Your ${chalk.bold(userProjectName)} is already created. Executed for ${chalk.bold(convertToSeconds)} s`,
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

      const tempPath = path.join(BASE_PATH, 'templates', 'temp');
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

  // --------------------------------------------------------------------------
  // HELPER METHODS
  // --------------------------------------------------------------------------
  private async __removeUnusedProject(tempPath: string) {
    const exists = await fse.pathExists(tempPath);
    if (!exists) await fse.ensureDir(tempPath);

    const subFolders = await fse.readdir(tempPath, { withFileTypes: true });
    for (const folder of subFolders) {
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

  private async __runBackendProjectGeneratingProcess(
    projectType: string,
    projectNameArg: string,
    spinner: Ora,
    options: OptionValues,
    projectName: string,
    projectDir: string,
    isReuseProject: boolean,
    cachedForType: CachedEntry[],
  ) {
    const templateDir = path.join(BASE_PATH, 'templates', projectType);
    __pathNotFound(templateDir);

    const templateFiles = fse.readdirSync(templateDir, { withFileTypes: true });
    const backendGenerator = BackendGenerator.instance;

    await backendGenerator.generate({
      projectNameArg: projectNameArg,
      spinner: spinner,
      optionValues: options,
      templatesFiles: templateFiles,
      projectName: projectName,
      projectType: projectType,
      projectDir: projectDir,
      isUsingCacheProject: isReuseProject,
      cachedEntries: cachedForType,
    });
  }

  private async __runFrontendProjectGeneratingProcess(
    projectType: string,
    projectNameArg: string,
    spinner: Ora,
    options: OptionValues,
    projectName: string,
    projectDir: string,
    isReuseProject: boolean,
    cachedForType: CachedEntry[],
  ) {
    const templateDir = path.join(BASE_PATH, 'templates', projectType);
    __pathNotFound(templateDir);

    const templateFiles = fse.readdirSync(templateDir, { withFileTypes: true });
    const frontendGenerator = FrontendGenerator.instance;

    await frontendGenerator.generate({
      projectNameArg: projectNameArg,
      spinner: spinner,
      optionValues: options,
      templatesFiles: templateFiles,
      projectName: projectName,
      projectType: projectType,
      projectDir: projectDir,
      isUsingCacheProject: isReuseProject,
      cachedEntries: cachedForType,
    });
  }
}
