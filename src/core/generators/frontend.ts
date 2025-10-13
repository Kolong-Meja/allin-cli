import { __basePath, __userRealName, CACHE_BASE_PATH } from '@/config.js';
import { FRONTEND_FRAMEWORKS, templatesMap } from '@/constants/global.js';
import {
  PathNotFoundError,
  UnidentifiedFrameworkError,
  UnidentifiedTemplateError,
} from '@/exceptions/error.js';
import { __unableOverwriteProject } from '@/exceptions/trigger.js';
import type { GeneratorBuilder } from '@/interfaces/global.js';
import type { __GenerateProjectParams } from '@/types/global.js';
import { isUndefined } from '@/utils/guard.js';
import boxen from 'boxen';
import chalk from 'chalk';
import fs from 'fs';
import fse from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
import { MicroGenerator } from './micro.js';

export class FrontendGenerator implements GeneratorBuilder {
  static #instance: FrontendGenerator;

  public readonly microGenerator: MicroGenerator;

  private constructor(microGenerator: MicroGenerator) {
    this.microGenerator = microGenerator;
  }

  public static get instance(): FrontendGenerator {
    if (!FrontendGenerator.#instance) {
      FrontendGenerator.#instance = new FrontendGenerator(
        MicroGenerator.instance,
      );
    }

    return FrontendGenerator.#instance;
  }

  public async generate(params: __GenerateProjectParams) {
    if (params.isUsingCacheProject !== false) {
      const cacheProjectChoices = params.cachedEntries.map((c) => c.name);
      const chosenProject = await inquirer.prompt({
        name: 'selectedCachedProject',
        type: 'list',
        message: 'Choose a cached project to reuse',
        choices: cacheProjectChoices,
      });

      const selectedEntry = params.cachedEntries.find(
        (c) => c.name === chosenProject.selectedCachedProject,
      );

      if (!selectedEntry) {
        throw new UnidentifiedTemplateError(
          `${chalk.bold('Unidentified template')}: ${chalk.bold(chosenProject.selectedCachedProject)} file template is not defined.`,
        );
      }

      const desPath = path.join(params.projectDir, params.projectName);
      const isPathExist = fs.existsSync(desPath);

      if (isPathExist) {
        await fse.remove(desPath);
      }

      await this.microGenerator.__loadProjectFromCache(
        CACHE_BASE_PATH,
        selectedEntry.name,
        params.projectType,
        desPath,
      );
    } else {
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
          when: () => isUndefined(params.optionValues.template),
        },
      ]);

      const frontendFrameworkResource = isUndefined(
        params.optionValues.template,
      )
        ? FRONTEND_FRAMEWORKS.frameworks.find(
            (f) => f.name === chooseFrontendFrameworkQuestion.frontendFramework,
          )
        : FRONTEND_FRAMEWORKS.frameworks.find(
            (f) => f.name === params.optionValues.template,
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
        params.projectDir,
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

      const selectedFrontendFramework = isUndefined(
        params.optionValues.template,
      )
        ? templatesMap(
            frontendFrameworkTemplateSrcPath,
            frontendFrameworkTemplateDesPath,
          ).get(chooseFrontendFrameworkQuestion.frontendFramework)
        : templatesMap(
            frontendFrameworkTemplateSrcPath,
            frontendFrameworkTemplateDesPath,
          ).get(params.optionValues.template);

      if (!selectedFrontendFramework) {
        const errorMessage = isUndefined(params.optionValues.template)
          ? `Unsupported framework: ${chooseFrontendFrameworkQuestion.frontendFramework}`
          : `Unsupported framework: ${params.optionValues.template}`;

        throw new Error(errorMessage);
      }

      const microGenerator = MicroGenerator.instance;

      const setupProjectExecutor = await microGenerator.setupProject({
        spinner: params.spinner,
        projectName: params.projectName ?? params.projectNameArg,
        projectType: params.projectType,
        selectedFramework: selectedFrontendFramework.actualName,
        sourcePath: selectedFrontendFramework.templateSource,
        desPath: selectedFrontendFramework.templateDest,
        optionValues: params.optionValues,
      });

      const tempDir = path.join(
        __basePath,
        'templates/temp',
        params.projectName,
      );

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

      if (selectedFrontendDependencies < 1) {
        console.log(
          boxen(
            `To be honest, you can install the dependencies later, right ${chalk.bold((await __userRealName()).split(' ')[0])}?`,
            {
              padding: 1,
              margin: 1,
              borderColor: 'blue',
            },
          ),
        );
      }

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
}
