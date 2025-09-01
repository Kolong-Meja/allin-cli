import { BACKEND_FRAMEWORKS } from '@/constants/default.js';
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
import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import { MicroGenerator } from './micro.js';
import boxen from 'boxen';
import { isUndefined } from '@/utils/guard.js';
import { __basePath } from '@/config.js';
import fs from 'fs';

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
        when: () => isUndefined(params.optionValues.backend),
      },
    ]);

    const backendFrameworkResource = isUndefined(params.optionValues.backend)
      ? BACKEND_FRAMEWORKS.frameworks.find(
          (f) => f.name === chooseBackendFrameworkQuestion.backendFramework,
        )
      : BACKEND_FRAMEWORKS.frameworks.find(
          (f) => f.name === params.optionValues.backend,
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
      params.optionValues.dir ?? params.projectDirArg,
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

    const backendFrameworkMap = new Map<string, FrameworkConfig>([
      [
        'express',
        {
          name: 'express',
          actualName: 'Express.js',
          packages: EXPRESS_DEPENDENCIES.packages,
          promptKey: 'expressDependencies',
          templateSource: backendFrameworkTemplateSrcPath,
          templateDest: backendFrameworkTemplateDesPath,
        },
      ],
      [
        'fastify',
        {
          name: 'fastify',
          actualName: 'Fastify',
          packages: FASTIFY_DEPENDENCIES.packages,
          promptKey: 'fastifyDependencies',
          templateSource: backendFrameworkTemplateSrcPath,
          templateDest: backendFrameworkTemplateDesPath,
        },
      ],
      [
        'feather',
        {
          name: 'feather',
          actualName: 'FeatherJS',
          packages: FEATHER_DEPENDENCIES.packages,
          promptKey: 'featherDependencies',
          templateSource: backendFrameworkTemplateSrcPath,
          templateDest: backendFrameworkTemplateDesPath,
        },
      ],
      [
        'nest',
        {
          name: 'nest',
          actualName: 'NestJS',
          packages: NEST_DEPENDENCIES.packages,
          promptKey: 'nestDependencies',
          templateSource: backendFrameworkTemplateSrcPath,
          templateDest: backendFrameworkTemplateDesPath,
        },
      ],
      [
        'node',
        {
          name: 'node',
          actualName: 'Node.js',
          packages: NODE_DEPENDENCIES.packages,
          promptKey: 'nodeDependencies',
          templateSource: backendFrameworkTemplateSrcPath,
          templateDest: backendFrameworkTemplateDesPath,
        },
      ],
      [
        'koa',
        {
          name: 'koa',
          actualName: 'Koa',
          packages: KOA_DEPENDENCIES.packages,
          promptKey: 'koaDependencies',
          templateSource: backendFrameworkTemplateSrcPath,
          templateDest: backendFrameworkTemplateDesPath,
        },
      ],
    ]);

    const selectedBackendFramework = isUndefined(params.optionValues.backend)
      ? backendFrameworkMap.get(chooseBackendFrameworkQuestion.backendFramework)
      : backendFrameworkMap.get(params.optionValues.backend);

    if (!selectedBackendFramework) {
      const errorMessage = isUndefined(params.optionValues.backend)
        ? `Unsupported framework: ${chooseBackendFrameworkQuestion.backendFramework}`
        : `Unsupported framework: ${params.optionValues.backend}`;

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
