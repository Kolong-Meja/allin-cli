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
import { isUndefined } from '@/utils/guard.js';
import { __basePath } from '@/config.js';
import fs from 'fs';

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
    const chooseFrontendFrameworkQuestion = await inquirer.prompt([
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
        when: () => isUndefined(params.optionValues.frontend),
      },
    ]);

    const frontendFrameworkResource = isUndefined(params.optionValues.frontend)
      ? FRONTEND_FRAMEWORKS.frameworks.find(
          (f) =>
            f.actualName === chooseFrontendFrameworkQuestion.frontendFramework,
        )
      : FRONTEND_FRAMEWORKS.frameworks.find(
          (f) => f.name === params.optionValues.frontend,
        );

    if (!frontendFrameworkResource) {
      throw new UnidentifiedFrameworkError(
        `${chalk.bold('Unidentified framework project')}: Frontend framework resource is not defined.`,
      );
    }

    const frontendFrameworkFolder = params.templatesFiles.find(
      (f) =>
        f.name === frontendFrameworkResource.templateName && f.isDirectory(),
    );

    if (!frontendFrameworkFolder) {
      throw new PathNotFoundError(
        `${chalk.bold('Path not found')}: Frontend framework folder not found.`,
      );
    }

    const frontendFrameworkTemplateSrcPath = path.join(
      frontendFrameworkFolder.parentPath,
      frontendFrameworkFolder.name,
    );
    const frontendFrameworkTemplateDesPath = path.join(
      params.optionValues.dir ?? params.projectDirArg,
      params.projectName ?? params.projectNameArg,
    );
    __unableOverwriteProject(
      frontendFrameworkTemplateDesPath,
      params.optionValues,
    );

    const isPathExist = fs.existsSync(frontendFrameworkTemplateDesPath);

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

    const frontendFrameworkMap = new Map<string, FrameworkConfig>([
      [
        'astro',
        {
          name: 'astro',
          actualName: 'Astro.js',
          packages: ASTRO_DEPENDENCIES.packages,
          promptKey: 'astroDependencies',
          templateSource: frontendFrameworkTemplateSrcPath,
          templateDest: frontendFrameworkTemplateDesPath,
        },
      ],
      [
        'next',
        {
          name: 'next',
          actualName: 'Next.js',
          packages: NEXT_DEPENDENCIES.packages,
          promptKey: 'nextDependencies',
          templateSource: frontendFrameworkTemplateSrcPath,
          templateDest: frontendFrameworkTemplateDesPath,
        },
      ],
      [
        'solid',
        {
          name: 'solid',
          actualName: 'SolidJS',
          packages: SOLID_DEPENDENCIES.packages,
          promptKey: 'solidDependencies',
          templateSource: frontendFrameworkTemplateSrcPath,
          templateDest: frontendFrameworkTemplateDesPath,
        },
      ],
      [
        'svelte',
        {
          name: 'svelte',
          actualName: 'Svelte',
          packages: SVELTE_DEPENDENCIES.packages,
          promptKey: 'svelteDependencies',
          templateSource: frontendFrameworkTemplateSrcPath,
          templateDest: frontendFrameworkTemplateDesPath,
        },
      ],
      [
        'vue',
        {
          name: 'vue',
          actualName: 'Vue.js',
          packages: VUE_DEPENDENCIES.packages,
          promptKey: 'vueDependencies',
          templateSource: frontendFrameworkTemplateSrcPath,
          templateDest: frontendFrameworkTemplateDesPath,
        },
      ],
      [
        'vanilla',
        {
          name: 'vanilla',
          actualName: 'VanillaJS',
          packages: VANILLA_DEPENDENCIES.packages,
          promptKey: 'vanillaDependencies',
          templateSource: frontendFrameworkTemplateSrcPath,
          templateDest: frontendFrameworkTemplateDesPath,
        },
      ],
    ]);

    const selectedFrontendFramework = isUndefined(params.optionValues.frontend)
      ? frontendFrameworkMap.get(
          chooseFrontendFrameworkQuestion.frontendFramework,
        )
      : frontendFrameworkMap.get(params.optionValues.frontend);

    if (!selectedFrontendFramework) {
      const errorMessage = isUndefined(params.optionValues.frontend)
        ? `Unsupported framework: ${chooseFrontendFrameworkQuestion.frontendFramework}`
        : `Unsupported framework: ${params.optionValues.frontend}`;

      throw new Error(errorMessage);
    }

    const microGenerator = MicroGenerator.instance;

    const setupProjectExecutor = await microGenerator.setupProject({
      spinner: params.spinner,
      projectName: params.projectName ?? params.projectNameArg,
      selectedFramework: selectedFrontendFramework.actualName,
      sourcePath: selectedFrontendFramework.templateSource,
      desPath: selectedFrontendFramework.templateDest,
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
        name: selectedFrontendFramework.promptKey,
        type: 'checkbox',
        message: 'Select dependencies to include in your project:',
        choices: selectedFrontendFramework.packages
          .sort((i, e) =>
            i.name.toLowerCase().localeCompare(e.name.toLowerCase(), 'en-US'),
          )
          .map((p) => p.originName),
        loop: false,
      },
    ]);

    const selectedFrontendDependencies =
      selectDependenciesQuestion[selectedFrontendFramework.promptKey];

    await microGenerator.setupInstallation({
      spinner: params.spinner,
      selectedDependencies: selectedFrontendDependencies,
      selectedPackageManager: params.optionValues.packageManager,
      projectName: params.projectName ?? params.projectNameArg,
      desPath: tempDir,
    });

    await microGenerator.setupOthers({
      spinner: params.spinner,
      optionValues: params.optionValues,
      projectType: params.projectType,
      projectName: params.projectName ?? params.projectNameArg,
      selectedFramework: selectedFrontendFramework.name,
      desPath: tempDir,
    });

    if (setupProjectExecutor) {
      await setupProjectExecutor();
    }

    console.log(
      boxen(
        `You can check the project on ${chalk.bold(
          selectedFrontendFramework.templateDest,
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
