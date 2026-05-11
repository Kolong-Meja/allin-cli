import { __getUserRealName, BASE_PATH, CACHE_BASE_PATH } from '@/config.js';
import { BACKEND_FRAMEWORKS, templatesMap } from '@/constants/global.js';
import {
  PathNotFoundError,
  UnidentifiedFrameworkError,
  UnidentifiedTemplateError,
} from '@/exceptions/error.js';
import { __unableOverwriteProject } from '@/exceptions/trigger.js';
import type { GeneratorBuilder } from '@/interfaces/global.js';
import type { __GenerateProjectParams } from '@/types/global.js';
import { infoBox, warnBox } from '@/utils/info-box.js';
import chalk from 'chalk';
import fse from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
import { MicroGenerator } from './micro.js';

export class BackendGenerator implements GeneratorBuilder {
  static #instance?: BackendGenerator; // Gunakan optional tipe

  public readonly microGenerator: MicroGenerator;

  private constructor(microGenerator: MicroGenerator) {
    this.microGenerator = microGenerator;
  }

  public static get instance(): BackendGenerator {
    return (BackendGenerator.#instance ??= new BackendGenerator(
      MicroGenerator.instance,
    ));
  }

  // --------------------------------------------------------------------------
  // MAIN ENTRY
  // --------------------------------------------------------------------------
  public async generate(params: __GenerateProjectParams) {
    if (
      params.isUsingCacheProject !== false &&
      params.cachedEntries.length > 0
    ) {
      await this.__generateCachedProject(params);
    } else {
      await this.__generateNonCachedProject(params);
    }
  }

  // --------------------------------------------------------------------------
  // CACHED PROJECT GENERATION
  // --------------------------------------------------------------------------
  private async __generateCachedProject(params: __GenerateProjectParams) {
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
    if (await fse.pathExists(desPath)) {
      await fse.remove(desPath);
    }

    await this.microGenerator.__loadCachedProject(
      CACHE_BASE_PATH,
      selectedEntry.name,
      params.projectType,
      desPath,
    );
  }

  // --------------------------------------------------------------------------
  // NON-CACHED PROJECT GENERATION
  // --------------------------------------------------------------------------
  private async __generateNonCachedProject(params: __GenerateProjectParams) {
    const resolvedProjectName = params.projectName ?? params.projectNameArg;

    const { backendFramework } = await inquirer.prompt([
      {
        name: 'backendFramework',
        type: 'list',
        message: 'Which backend framework do you want to use:',
        choices: BACKEND_FRAMEWORKS.frameworks
          .sort((a, b) => a.name.localeCompare(b.name, 'en-US'))
          .map((f) => f.name),
        default: 'express',
        loop: false,
        when: () => params.optionValues.template === undefined,
      },
    ]);

    const targetFrameworkName =
      params.optionValues.template ?? backendFramework;
    const backendFrameworkResource = BACKEND_FRAMEWORKS.frameworks.find(
      (f) => f.name === targetFrameworkName,
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

    // DEFINE TEMPLATES PATHS
    const srcPath = path.join(
      backendFrameworkTemplateFolder.parentPath,
      backendFrameworkTemplateFolder.name,
    );
    const destPath = path.join(params.projectDir, resolvedProjectName);

    __unableOverwriteProject(destPath, params.optionValues);

    const destPathExists = fse.existsSync(destPath);
    if (params.optionValues.force && !destPathExists) {
      warnBox(
        'Warning Information',
        '-f, --force option will not be used because project does not exist.',
      );
    }

    const selectedFramework = templatesMap(srcPath, destPath).get(
      targetFrameworkName,
    );
    if (!selectedFramework) {
      throw new Error(`Unsupported framework: ${targetFrameworkName}`);
    }

    // SETUP PROJECT BASE STRUCTURE
    const microGenerator = MicroGenerator.instance;
    const setupExecutor = await microGenerator.setupProject({
      spinner: params.spinner,
      projectName: resolvedProjectName,
      projectType: params.projectType,
      selectedFramework: selectedFramework.actualName,
      sourcePath: selectedFramework.templateSource,
      desPath: selectedFramework.templateDest,
      optionValues: params.optionValues,
    });

    const tempDir = path.join(BASE_PATH, 'templates/temp', resolvedProjectName);

    // ------------------------------------------------------------------------
    // OPTIONAL DOCKER SETUP
    // ------------------------------------------------------------------------
    if (params.optionValues.docker) {
      const { addDocker, addDockerBake } = await inquirer.prompt([
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

      if (addDocker) {
        await microGenerator.setupDocker({
          spinner: params.spinner,
          isAddingDocker: addDocker,
          isAddingBake: addDockerBake,
          selectedPackageManager: params.optionValues.packageManager,
          desPath: tempDir,
        });
      }
    }

    // ------------------------------------------------------------------------
    // DEPENDENCIES INSTALLATION
    // ------------------------------------------------------------------------
    const dependencyPrompt = await inquirer.prompt([
      {
        name: selectedFramework.promptKey,
        type: 'checkbox',
        message: 'Select dependencies to include in your project:',
        choices: selectedFramework.packages
          .sort((a, b) => a.name.localeCompare(b.name, 'en-US'))
          .map((p) => p.originName),
        loop: false,
      },
    ]);

    const selectedDeps = dependencyPrompt[selectedFramework.promptKey];

    if (selectedDeps.length < 1) {
      const userRealName = await __getUserRealName();
      const firstName = userRealName.split(' ')[0];
      infoBox(
        'Project Information',
        `To be honest, you can install the dependencies later, right ${chalk.bold(firstName)}?`,
      );
    }

    await microGenerator.setupInstallation({
      spinner: params.spinner,
      selectedDependencies: selectedDeps,
      selectedPackageManager: params.optionValues.packageManager,
      projectName: resolvedProjectName,
      desPath: tempDir,
    });

    // ------------------------------------------------------------------------
    // POST-SETUP CUSTOMIZATION
    // ------------------------------------------------------------------------
    await microGenerator.setupOthers({
      spinner: params.spinner,
      optionValues: params.optionValues,
      projectType: params.projectType,
      projectName: resolvedProjectName,
      selectedFramework: selectedFramework.name,
      desPath: tempDir,
    });

    if (setupExecutor) await setupExecutor();

    // ------------------------------------------------------------------------
    // SUMMARY INFORMATION
    // ------------------------------------------------------------------------
    infoBox(
      'Project Information',
      `You can check the project at ${chalk.bold(selectedFramework.templateDest)}`,
    );
  }
}
