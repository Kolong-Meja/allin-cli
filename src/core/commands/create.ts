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

import { __getUserRealName, BASE_PATH, CACHE_BASE_PATH } from '@/config.js';
import {
  DIRTY_WORDS,
  PROJECT_TYPES,
  TEMPLATES_META_MAP,
} from '@/constants/global.js';
import { __pathNotFound } from '@/exceptions/trigger.js';
import type { CreateCommandBuilder } from '@/interfaces/global.js';
import type {
  __CreateProjectParams,
  __ExecuteGenerationParams,
  Mixed,
} from '@/types/global.js';
import { isUndefined } from '@/utils/guard.js';
import { errorBox, infoBox, warnBox } from '@/utils/info-box.js';
import chalk from 'chalk';
import fse from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';
import { BackendGenerator } from '../generators/backend.js';
import { FrontendGenerator } from '../generators/frontend.js';
import { MicroGenerator } from '../generators/micro.js';
import { __commitRollback, __rollback } from '@/utils/rollback.js';

export class CreateCommand implements CreateCommandBuilder {
  static #instance?: CreateCommand;

  public readonly microGenerator: MicroGenerator;

  private constructor(microGenerator: MicroGenerator) {
    this.microGenerator = microGenerator;
  }

  public static get instance(): CreateCommand {
    if (!CreateCommand.#instance) {
      CreateCommand.#instance ??= new CreateCommand(MicroGenerator.instance);
    }

    return CreateCommand.#instance;
  }

  public async create(params: __CreateProjectParams) {
    const start = performance.now();
    let spinner;
    let projectDesPath: string | undefined;

    try {
      // VALIDATE PROJECT TYPE
      if (
        params.projectType !== undefined &&
        !PROJECT_TYPES.includes(params.projectType)
      ) {
        throw new UnidentifiedProjectTypeError(
          `${params.projectType} is not found or exist. Choose between ${PROJECT_TYPES.join(', ')}`,
        );
      }

      await this.microGenerator.__ensurePackageManagerAvailable(
        params.options.packageManager,
      );

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
      if (isProjectTypeDetected != null && params.projectType !== undefined) {
        warnBox(
          'Warning Information',
          'The [type] argument will not be used, as the system detects the project type from the project name.',
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
            isProjectTypeDetected == null &&
            params.options.template === undefined &&
            params.options.type === undefined &&
            params.projectType === undefined,
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
          message: 'Where directory do you want to save your project?',
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

      const userProjectDir =
        params.options.dir ??
        params.projectDir ??
        projectDirQuestion.projectDir;
      __pathNotFound(userProjectDir);

      projectDesPath = path.join(userProjectDir, userProjectName);

      const additionalFeaturesQuestion = await inquirer.prompt([
        {
          name: 'additionalTools',
          type: 'checkbox',
          message: 'Select additional tools and features for your project:',
          choices: [
            { name: 'ESLint (Linter)', value: 'eslint', checked: false },
            { name: 'Prettier (Formatter)', value: 'prettier', checked: false },
            { name: 'Ky (HTTP client)', value: 'ky', checked: false },
            {
              name: 'Dotenv (Environment variables)',
              value: 'dotenv',
              checked: false,
            },
            {
              name: 'Docker Compose (Container orchestration)',
              value: 'docker-compose',
            },
            { name: 'None of these', value: '' },
          ],
          when: () => typeof params.options.template === 'undefined',
        },
      ]);

      const selectedTools: string[] =
        additionalFeaturesQuestion.additionalTools || [];

      // HANDLE CACHE & REUSE CONFIRMATION
      const cachedForType = await this.microGenerator.__getListCachedProjects(
        CACHE_BASE_PATH,
        userProjectType,
      );

      let reuseProject = false;
      if (cachedForType.length > 0) {
        const reuseChoicePrompt = await inquirer.prompt({
          name: 'reuseProject',
          type: 'confirm',
          message: `You've already generated ${userProjectType} projects before. Do you want to reuse one of them?`,
          default: false,
        });
        reuseProject = reuseChoicePrompt.reuseProject;
      }

      if (!reuseProject) {
        const firstName = (await __getUserRealName()).split(' ')[0];
        infoBox(
          'Project Information',
          `Alright ${chalk.bold(firstName)}, let's start fresh.`,
        );
      }

      spinner = ora({
        spinner: 'dots8',
        color: 'green',
        interval: 100,
      }).start();

      // RUN GENERATION PROCESS
      await this.__executeGeneration({
        userProjectType: userProjectType!,
        projectNameArg: params.projectName,
        spinner,
        options: params.options,
        userProjectName,
        userProjectDir,
        reuseProject: reuseProject,
        cachedForType,
        selectedTools,
      });

      await __commitRollback();

      // DONE
      const end = performance.now();
      const convertToSeconds = ((end - start) / 1000).toFixed(3);
      spinner.succeed(
        `Your ${chalk.bold(userProjectName)} is already created. Executed for ${chalk.bold(convertToSeconds)} s`,
      );
    } catch (error: Mixed) {
      if (spinner) {
        spinner.fail('Failed to create project.\n');
      }

      let errorMessage =
        error instanceof Error
          ? error.message
          : `${chalk.bold('Error')}: An unknown error occurred.`;

      const tempPath = path.join(BASE_PATH, 'templates', 'temp');
      this.__removeUnusedProject(tempPath);
      
      if (projectDesPath) {
        try {
          const restored = await __rollback(projectDesPath);
          warnBox(
            'Rollback Information',
            restored
              ? `Project creation failed — your previous content at ${chalk.bold(projectDesPath)} has been restored.`
              : `Project creation failed — the partially created ${chalk.bold(projectDesPath)} folder has been removed.`,
          );
        } catch (rollbackError: Mixed) {
          warnBox(
            'Rollback Warning',
            `Automatic rollback did not fully complete: ${rollbackError.message}`,
          );
        }
      }

      errorBox(error);
    } finally {
      if (spinner) {
        spinner.clear();
      }
    }
  }

  // --------------------------------------------------------------------------
  // HELPER METHODS
  // --------------------------------------------------------------------------
  private async __removeUnusedProject(tempPath: string) {
    const exists = await fse.pathExists(tempPath);
    if (!exists) return;

    const subFolders = await fse.readdir(tempPath, { withFileTypes: true });
    for (const folder of subFolders) {
      if (!folder.isDirectory()) continue;

      const itemPath = path.join(tempPath, folder.name);

      try {
        await fse.remove(itemPath);
      } catch (error: Mixed) {
        errorBox(error);
      }
    }
  }

  private async __executeGeneration(param: __ExecuteGenerationParams) {
    const templateDir = path.join(
      BASE_PATH,
      'templates',
      param.userProjectType,
    );
    __pathNotFound(templateDir);

    const templateFiles = await fse.readdir(templateDir, {
      withFileTypes: true,
    });

    const generator =
      param.userProjectType === 'backend'
        ? BackendGenerator.instance
        : FrontendGenerator.instance;

    await generator.generate({
      projectNameArg: param.projectNameArg,
      spinner: param.spinner,
      optionValues: param.options,
      templatesFiles: templateFiles,
      projectName: param.userProjectName,
      projectType: param.userProjectType,
      projectDir: param.userProjectDir,
      isUsingCacheProject: param.reuseProject,
      cachedEntries: param.cachedForType,
    });
  }
}
