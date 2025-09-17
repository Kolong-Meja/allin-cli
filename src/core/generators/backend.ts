import { __basePath } from '@/config.js';
import { BACKEND_FRAMEWORKS, templatesMap } from '@/constants/default.js';
import {
  EXPRESS_DEPENDENCIES,
  FASTIFY_DEPENDENCIES,
  FEATHER_DEPENDENCIES,
  KOA_DEPENDENCIES,
  NEST_DEPENDENCIES,
  NODE_DEPENDENCIES,
} from '@/constants/packages/backend.js';
import {
  PathNotFoundError,
  UnidentifiedFrameworkError,
} from '@/exceptions/error.js';
import { __unableOverwriteProject } from '@/exceptions/trigger.js';
import type { FrameworkConfig } from '@/interfaces/general.js';
import type { __BackendProjectTypeParams } from '@/types/general.js';
import { isUndefined } from '@/utils/guard.js';
import boxen from 'boxen';
import chalk from 'chalk';
import fs from 'fs';
import inquirer from 'inquirer';
import path from 'path';
import { MicroGenerator } from './micro.js';

export class BackendGenerator {
  static #instance: BackendGenerator;

  private constructor() {}

  public static get instance(): BackendGenerator {
    if (!BackendGenerator.#instance) {
      BackendGenerator.#instance = new BackendGenerator();
    }

    return BackendGenerator.#instance;
  }

  public async generate(params: __BackendProjectTypeParams) {
    const chooseBackendFrameworkQuestion = await inquirer.prompt([
      {
        name: 'backendFramework',
        type: 'list',
        message: 'Which backend framework do you want to use:',
        choices: BACKEND_FRAMEWORKS.frameworks
          .sort((i, e) =>
            i.name.toLowerCase().localeCompare(e.name.toLowerCase(), 'en-US'),
          )
          .map((f) => f.name),
        default: 'express',
        loop: false,
        when: () => isUndefined(params.optionValues.template),
      },
    ]);

    const backendFrameworkResource = isUndefined(params.optionValues.template)
      ? BACKEND_FRAMEWORKS.frameworks.find(
          (f) => f.name === chooseBackendFrameworkQuestion.backendFramework,
        )
      : BACKEND_FRAMEWORKS.frameworks.find(
          (f) => f.name === params.optionValues.template,
        );

    if (!backendFrameworkResource) {
      throw new UnidentifiedFrameworkError(
        `${chalk.bold('Unidentified framework project')}: Backend framework resource is not defined.`,
      );
    }

    const backendFrameworkTemplateFolder = params.templatesFiles.find(
      (f) =>
        f.name === backendFrameworkResource.templateName && f.isDirectory(),
    );

    if (!backendFrameworkTemplateFolder) {
      throw new PathNotFoundError(
        `${chalk.bold('Path not found')}: Backend framework folder not found.`,
      );
    }

    const backendFrameworkTemplateSrcPath = path.join(
      backendFrameworkTemplateFolder.parentPath,
      backendFrameworkTemplateFolder.name,
    );
    const backendFrameworkTemplateDesPath = path.join(
      params.projectDir,
      params.projectName ?? params.projectNameArg,
    );
    __unableOverwriteProject(
      backendFrameworkTemplateDesPath,
      params.optionValues,
    );

    const isPathExist = fs.existsSync(backendFrameworkTemplateDesPath);

    if (params.optionValues.force && !isPathExist) {
      console.warn(
        boxen(
          '-f, --force option will be not use, because project is not exist.',
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

    const selectedBackendFramework = isUndefined(params.optionValues.template)
      ? templatesMap(
          backendFrameworkTemplateSrcPath,
          backendFrameworkTemplateDesPath,
        ).get(chooseBackendFrameworkQuestion.backendFramework)
      : templatesMap(
          backendFrameworkTemplateSrcPath,
          backendFrameworkTemplateDesPath,
        ).get(params.optionValues.template);

    if (!selectedBackendFramework) {
      const errorMessage = isUndefined(params.optionValues.template)
        ? `Unsupported framework: ${chooseBackendFrameworkQuestion.backendFramework}`
        : `Unsupported framework: ${params.optionValues.template}`;

      throw new Error(errorMessage);
    }

    const microGenerator = MicroGenerator.instance;

    const setupProjectExecutor = await microGenerator.setupProject({
      spinner: params.spinner,
      projectName: params.projectName ?? params.projectNameArg,
      selectedFramework: selectedBackendFramework.actualName,
      sourcePath: selectedBackendFramework.templateSource,
      desPath: selectedBackendFramework.templateDest,
      optionValues: params.optionValues,
    });

    const tempDir = path.join(__basePath, 'templates/temp', params.projectName);

    if (params.optionValues.docker) {
      const isAddingDockerQuestion = await inquirer.prompt([
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

      if (isAddingDockerQuestion.addDocker) {
        await microGenerator.setupDocker({
          spinner: params.spinner,
          isAddingDocker: isAddingDockerQuestion.addDocker,
          isAddingBake: isAddingDockerQuestion.addDockerBake,
          selectedPackageManager: params.optionValues.packageManager,
          desPath: tempDir,
        });
      }
    }

    const selectDependenciesQuestion = await inquirer.prompt([
      {
        name: selectedBackendFramework.promptKey,
        type: 'checkbox',
        message: 'Select dependencies to include in your project:',
        choices: selectedBackendFramework.packages
          .sort((i, e) =>
            i.name.toLowerCase().localeCompare(e.name.toLowerCase(), 'en-US'),
          )
          .map((p) => p.originName),
        loop: false,
      },
    ]);

    const selectedBackendDependencies =
      selectDependenciesQuestion[selectedBackendFramework.promptKey];

    await microGenerator.setupInstallation({
      spinner: params.spinner,
      selectedDependencies: selectedBackendDependencies,
      selectedPackageManager: params.optionValues.packageManager,
      projectName: params.projectName ?? params.projectNameArg,
      desPath: tempDir,
    });

    await microGenerator.setupOthers({
      spinner: params.spinner,
      optionValues: params.optionValues,
      projectType: params.projectType,
      projectName: params.projectName ?? params.projectNameArg,
      selectedFramework: selectedBackendFramework.name,
      desPath: tempDir,
    });

    if (setupProjectExecutor) {
      await setupProjectExecutor();
    }

    console.log(
      boxen(
        `You can check the project on ${chalk.bold(
          selectedBackendFramework.templateDest,
        )}`,
        {
          title: 'Project Information',
          titleAlignment: 'center',
          padding: 1,
          margin: 1,
          borderColor: 'blue',
        },
      ),
    );
  }
}
