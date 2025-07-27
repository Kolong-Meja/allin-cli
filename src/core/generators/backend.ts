import { BACKEND_FRAMEWORKS } from '@/constants/default.js';
import {
  EXPRESS_DEPENDENCIES,
  FASTIFY_DEPENDENCIES,
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
    const __backendFrameworkQuestion = await inquirer.prompt([
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
        when: () => typeof params.optionValues.backend === 'undefined',
      },
    ]);

    const __backendFrameworkResource =
      typeof params.optionValues.backend !== 'undefined'
        ? BACKEND_FRAMEWORKS.frameworks.find(
            (f) => f.name === params.optionValues.backend,
          )
        : BACKEND_FRAMEWORKS.frameworks.find(
            (f) => f.name === __backendFrameworkQuestion.backendFramework,
          );

    if (!__backendFrameworkResource) {
      throw new UnidentifiedFrameworkError(
        `${chalk.bold('Unidentified framework project')}: Backend framework resource is not defined.`,
      );
    }

    const __backendFrameworkTemplateFolder = params.templatesFiles.find(
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
      params.optionValues.dir,
      params.projectName,
    );
    __unableOverwriteProject(__backendFrameworkTemplateDesPath);

    const __backendFrameworkMap = new Map<string, FrameworkConfig>([
      [
        'express',
        {
          name: 'express',
          actualName: 'Express.js',
          packages: EXPRESS_DEPENDENCIES.packages,
          promptKey: 'expressDependencies',
          templateSource: __backendFrameworkTemplateSourcePath,
          templateDest: __backendFrameworkTemplateDesPath,
        },
      ],
      [
        'fastify',
        {
          name: 'fastify',
          actualName: 'Fastify',
          packages: FASTIFY_DEPENDENCIES.packages,
          promptKey: 'fastifyDependencies',
          templateSource: __backendFrameworkTemplateSourcePath,
          templateDest: __backendFrameworkTemplateDesPath,
        },
      ],
      [
        'nest',
        {
          name: 'nest',
          actualName: 'NestJS',
          packages: NEST_DEPENDENCIES.packages,
          promptKey: 'nestDependencies',
          templateSource: __backendFrameworkTemplateSourcePath,
          templateDest: __backendFrameworkTemplateDesPath,
        },
      ],
      [
        'node',
        {
          name: 'node',
          actualName: 'Node.js',
          packages: NODE_DEPENDENCIES.packages,
          promptKey: 'nodeDependencies',
          templateSource: __backendFrameworkTemplateSourcePath,
          templateDest: __backendFrameworkTemplateDesPath,
        },
      ],
      [
        'koa',
        {
          name: 'koa',
          actualName: 'Koa',
          packages: KOA_DEPENDENCIES.packages,
          promptKey: 'koaDependencies',
          templateSource: __backendFrameworkTemplateSourcePath,
          templateDest: __backendFrameworkTemplateDesPath,
        },
      ],
    ]);

    const __selectedBackendFramework =
      typeof params.optionValues.backend !== 'undefined'
        ? __backendFrameworkMap.get(params.optionValues.backend)
        : __backendFrameworkMap.get(
            __backendFrameworkQuestion.backendFramework,
          );

    if (!__selectedBackendFramework) {
      const errorMessage =
        typeof params.optionValues.backend !== 'undefined'
          ? `Unsupported framework: ${params.optionValues.backend}`
          : `Unsupported framework: ${__backendFrameworkQuestion.backendFramework}`;

      throw new Error(errorMessage);
    }

    const microGenerator = MicroGenerator.instance;

    await microGenerator.setupProject({
      spinner: params.spinner,
      projectName: params.projectName,
      selectedFramework: __selectedBackendFramework.actualName,
      sourcePath: __selectedBackendFramework.templateSource,
      desPath: __selectedBackendFramework.templateDest,
    });

    if (params.optionValues.docker) {
      const __dockerQuestion = await inquirer.prompt([
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

      if (__dockerQuestion.addDocker) {
        await microGenerator.setupDocker({
          spinner: params.spinner,
          isAddingDocker: __dockerQuestion.addDocker,
          isAddingBake: __dockerQuestion.addDockerBake,
          selectedPackageManager: params.optionValues.pm,
          desPath: __selectedBackendFramework.templateDest,
        });
      }
    }

    await microGenerator.setupOthers({
      spinner: params.spinner,
      optionValues: params.optionValues,
      projectType: params.projectType,
      projectName: params.projectName,
      selectedFramework: __backendFrameworkQuestion.backendFramework,
      desPath: __selectedBackendFramework.templateDest,
    });

    const __dependenciesSelection = await inquirer.prompt([
      {
        name: __selectedBackendFramework.promptKey,
        type: 'checkbox',
        message: 'Select dependencies to include in your project:',
        choices: __selectedBackendFramework.packages
          .sort((i, e) =>
            i.name.toLowerCase().localeCompare(e.name.toLowerCase(), 'en-US'),
          )
          .map((p) => p.originName),
        loop: false,
      },
    ]);

    const __selectedDependencies =
      __dependenciesSelection[__selectedBackendFramework.promptKey];

    await microGenerator.setupInstallation({
      spinner: params.spinner,
      selectedDependencies: __selectedDependencies,
      selectedPackageManager: params.optionValues.pm,
      projectName: params.projectName,
      desPath: __selectedBackendFramework.templateDest,
    });

    console.log(
      boxen(
        `You can check the project on ${chalk.bold(
          __selectedBackendFramework.templateDest,
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
  }
}
