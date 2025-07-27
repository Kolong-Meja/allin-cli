import { FRONTEND_FRAMEWORKS } from '@/constants/default.js';
import {
  ASTRO_DEPENDENCIES,
  NEXT_DEPENDENCIES,
  SOLID_DEPENDENCIES,
  SVELTE_DEPENDENCIES,
  VANILLA_DEPENDENCIES,
  VUE_DEPENDENCIES,
} from '@/constants/packages/frontend.js';
import {
  PathNotFoundError,
  UnidentifiedFrameworkError,
} from '@/exceptions/error.js';
import { __unableOverwriteProject } from '@/exceptions/trigger.js';
import type { FrameworkConfig } from '@/interfaces/general.js';
import type { __FrontendProjectTypeParams } from '@/types/general.js';
import boxen from 'boxen';
import chalk from 'chalk';
import inquirer from 'inquirer';
import path from 'path';
import { MicroGenerator } from './micro.js';

export class FrontendGenerator {
  static #instance: FrontendGenerator;

  private constructor() {}

  public static get instance(): FrontendGenerator {
    if (!FrontendGenerator.#instance) {
      FrontendGenerator.#instance = new FrontendGenerator();
    }

    return FrontendGenerator.#instance;
  }

  public async generate(params: __FrontendProjectTypeParams) {
    const __frontendFrameworkSelection = await inquirer.prompt([
      {
        name: 'frontendFramework',
        type: 'list',
        message: 'Which frontend framework do you want to use:',
        choices: FRONTEND_FRAMEWORKS.frameworks
          .sort((i, e) =>
            i.name.toLowerCase().localeCompare(e.name.toLowerCase(), 'en-US'),
          )
          .map((f) => f.name),
        default: 'astro',
        loop: false,
        when: () => typeof params.optionValues.frontend === 'undefined',
      },
    ]);

    const __frontendFrameworkResource =
      typeof params.optionValues.frontend !== 'undefined'
        ? FRONTEND_FRAMEWORKS.frameworks.find(
            (f) => f.name === params.optionValues.frontend,
          )
        : FRONTEND_FRAMEWORKS.frameworks.find(
            (f) => f.name === __frontendFrameworkSelection.frontendFramework,
          );

    if (!__frontendFrameworkResource) {
      throw new UnidentifiedFrameworkError(
        `${chalk.bold('Unidentified framework project')}: Frontend framework resource is not defined.`,
      );
    }

    const _frontendFrameworkFolder = params.templatesFiles.find(
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
      params.optionValues.dir,
      params.projectName,
    );
    __unableOverwriteProject(__frontendFrameworkTemplateDesPath);

    const __frontendFrameworkMap = new Map<string, FrameworkConfig>([
      [
        'astro',
        {
          name: 'astro',
          actualName: 'Astro.js',
          packages: ASTRO_DEPENDENCIES.packages,
          promptKey: 'astroDependencies',
          templateSource: __frontendFrameworkTemplateSourcePath,
          templateDest: __frontendFrameworkTemplateDesPath,
        },
      ],
      [
        'next',
        {
          name: 'next',
          actualName: 'Next.js',
          packages: NEXT_DEPENDENCIES.packages,
          promptKey: 'nextDependencies',
          templateSource: __frontendFrameworkTemplateSourcePath,
          templateDest: __frontendFrameworkTemplateDesPath,
        },
      ],
      [
        'solid',
        {
          name: 'solid',
          actualName: 'SolidJS',
          packages: SOLID_DEPENDENCIES.packages,
          promptKey: 'solidDependencies',
          templateSource: __frontendFrameworkTemplateSourcePath,
          templateDest: __frontendFrameworkTemplateDesPath,
        },
      ],
      [
        'svelte',
        {
          name: 'svelte',
          actualName: 'Svelte',
          packages: SVELTE_DEPENDENCIES.packages,
          promptKey: 'svelteDependencies',
          templateSource: __frontendFrameworkTemplateSourcePath,
          templateDest: __frontendFrameworkTemplateDesPath,
        },
      ],
      [
        'vue',
        {
          name: 'vue',
          actualName: 'Vue.js',
          packages: VUE_DEPENDENCIES.packages,
          promptKey: 'vueDependencies',
          templateSource: __frontendFrameworkTemplateSourcePath,
          templateDest: __frontendFrameworkTemplateDesPath,
        },
      ],
      [
        'vanilla',
        {
          name: 'vanilla',
          actualName: 'VanillaJS',
          packages: VANILLA_DEPENDENCIES.packages,
          promptKey: 'vanillaDependencies',
          templateSource: __frontendFrameworkTemplateSourcePath,
          templateDest: __frontendFrameworkTemplateDesPath,
        },
      ],
    ]);

    const __selectedFrontendFramework =
      typeof params.optionValues.frontend !== 'undefined'
        ? __frontendFrameworkMap.get(params.optionValues.frontend)
        : __frontendFrameworkMap.get(
            __frontendFrameworkSelection.frontendFramework,
          );

    if (!__selectedFrontendFramework) {
      const errorMessage =
        typeof params.optionValues.frontend !== 'undefined'
          ? `Unsupported framework: ${params.optionValues.frontend}`
          : `Unsupported framework: ${__frontendFrameworkSelection.frontendFramework}`;

      throw new Error(errorMessage);
    }

    const microGenerator = MicroGenerator.instance;

    await microGenerator.setupProject({
      spinner: params.spinner,
      projectName: params.projectName,
      selectedFramework: __selectedFrontendFramework.actualName,
      sourcePath: __selectedFrontendFramework.templateSource,
      desPath: __selectedFrontendFramework.templateDest,
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
          desPath: __selectedFrontendFramework.templateDest,
        });
      }
    }

    await microGenerator.setupOthers({
      spinner: params.spinner,
      optionValues: params.optionValues,
      projectType: params.projectType,
      projectName: params.projectName,
      selectedFramework: __frontendFrameworkSelection.frontendFramework,
      desPath: __selectedFrontendFramework.templateDest,
    });

    const __dependenciesSelection = await inquirer.prompt([
      {
        name: __selectedFrontendFramework.promptKey,
        type: 'checkbox',
        message: 'Select dependencies to include in your project:',
        choices: __selectedFrontendFramework.packages
          .sort((i, e) =>
            i.name.toLowerCase().localeCompare(e.name.toLowerCase(), 'en-US'),
          )
          .map((p) => p.originName),
        loop: false,
      },
    ]);

    const __selectedDependencies =
      __dependenciesSelection[__selectedFrontendFramework.promptKey];

    await microGenerator.setupInstallation({
      spinner: params.spinner,
      selectedDependencies: __selectedDependencies,
      selectedPackageManager: params.optionValues.pm,
      projectName: params.projectName,
      desPath: __selectedFrontendFramework.templateDest,
    });

    console.log(
      boxen(
        `You can check the project on ${chalk.bold(
          __selectedFrontendFramework.templateDest,
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
