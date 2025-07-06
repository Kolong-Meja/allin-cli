import {
  HarassmentWordsDetected,
  PathNotFoundError,
  UnableOverwriteError,
  UnidentifiedFrameworkError,
  UnidentifiedTemplateError,
} from '@/exceptions/error.js';
import {
  __detectProjectType,
  __renewProjectName,
  __renewStringsIntoTitleCase,
} from '@/utils/string.js';

import chalk from 'chalk';
import type { OptionValues } from 'commander';
import inquirer from 'inquirer';
import ora, { type Ora } from 'ora';
import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import { execa } from 'execa';
import boxen from 'boxen';
import { __basePath, __config, __userRealName } from '@/config.js';
import type {
  __BackendProjectTypeParams,
  __FrontendProjectTypeParams,
  __RunAddBakeParams,
  __RunAddDockerParams,
  __RunAddTsParams,
  __RunInstallParams,
  __RunInstallTsParams,
  __RunOtherOptionsParams,
  __RunSwitchPackageManagerParams,
  __RunSystemUpdateParams,
  __RunUpdateParams,
  __SetupDockerParams,
  __SetupUserProjectParams,
  Mixed,
} from '@/types/general.js';
import {
  BACKEND_FRAMEWORKS,
  DIRTY_WORDS,
  FRONTEND_FRAMEWORKS,
  LICENSES,
  PROJECT_TYPES,
} from '@/constants/default.js';
import {
  EXPRESS_DEPENDENCIES,
  FASTIFY_DEPENDENCIES,
  KOA_DEPENDENCIES,
  NEST_DEPENDENCIES,
  NODE_DEPENDENCIES,
} from '@/constants/packages/backend.js';
import {
  ASTRO_DEPENDENCIES,
  NEXT_DEPENDENCIES,
  SOLID_DEPENDENCIES,
  SVELTE_DEPENDENCIES,
  VANILLA_DEPENDENCIES,
  VUE_DEPENDENCIES,
} from '@/constants/packages/frontend.js';
import { TYPESCRIPT_DEPENDENCIES } from '@/constants/packages/general.js';
import {
  __containHarassmentWords,
  __pathNotExist,
  __unableToOverwriteProject,
} from '@/exceptions/trigger.js';
import { __gradientColor } from '@/utils/ascii.js';
import type { FrameworkConfig } from '@/interfaces/general.js';
import { cwd } from 'process';

export class CreateCommand {
  static #instance: CreateCommand;

  private constructor() {}

  public static get instance(): CreateCommand {
    if (!CreateCommand.#instance) {
      CreateCommand.#instance = new CreateCommand();
    }

    return CreateCommand.#instance;
  }

  public async create(options: OptionValues) {
    console.log(
      boxen(
        `Hello ${chalk.bold((await __userRealName()).split(' ')[0])}, Welcome to ${__gradientColor(__config.appName)} CLI`,
        {
          title: '👾 Welcome Abort Captain! 👾',
          titleAlignment: 'center',
          padding: 1,
          margin: 1,
          borderColor: 'green',
        },
      ),
    );

    const spinner = ora({
      spinner: 'dots8',
      color: 'green',
      interval: 100,
    });

    const start = performance.now();

    try {
      const __projectNamQuestion = await inquirer.prompt({
        name: 'projectName',
        type: 'input',
        message: "What's the name of your project?",
        default: 'my-project',
      });

      const __projectName = __renewProjectName(
        __projectNamQuestion.projectName,
      );
      __containHarassmentWords(__projectName, DIRTY_WORDS);

      const __hasProjectType = __detectProjectType(__projectName);

      const __projectTypeQuestion = await inquirer.prompt([
        {
          name: 'projectType',
          type: 'list',
          message: 'What type of project do you want create:',
          choices: __renewStringsIntoTitleCase(PROJECT_TYPES),
          default: 'backend',
          when: () => __hasProjectType === undefined,
        },
      ]);

      const __projectType =
        __hasProjectType ?? __projectTypeQuestion.projectType.toLowerCase();

      const __templatesDirPath = path.join(
        __basePath,
        'templates',
        __projectType.toLowerCase(),
      );
      __pathNotExist(__templatesDirPath);

      const __templatesFiles = fs.readdirSync(__templatesDirPath, {
        withFileTypes: true,
      });
      __pathNotExist(options.dir);

      switch (__projectType) {
        case 'backend':
          await this.__backendProjectType({
            spinner: spinner,
            optionValues: options,
            templatesFiles: __templatesFiles,
            projectName: __projectName,
            projectType: __projectTypeQuestion.projectType,
          });
          break;
        case 'frontend':
          await this.__frontendProjectType({
            spinner: spinner,
            optionValues: options,
            templatesFiles: __templatesFiles,
            projectName: __projectName,
            projectType: __projectTypeQuestion.projectType,
          });
          break;
      }

      const end = performance.now();
      spinner.succeed(
        `It's done ${chalk.bold(await __userRealName()).split(' ')[0]} 🎉. Your ${chalk.bold(__projectName)} is already created. Executed for ${chalk.bold((end - start).toFixed(3))} ms`,
      );
    } catch (error: Mixed) {
      spinner.fail('⛔️ Failed to create project...\n');

      let errorMessage =
        error instanceof Error
          ? error.message
          : `${chalk.bold('Error')}: An unknown error occurred.`;

      if (error instanceof PathNotFoundError) {
        errorMessage = error.message;
      }

      if (error instanceof UnableOverwriteError) {
        errorMessage = error.message;
      }

      if (error instanceof HarassmentWordsDetected) {
        errorMessage = error.message;
      }

      if (error.name === 'ExitPromptError') {
        errorMessage = `${chalk.bold(
          'Exit prompt error',
        )}: User forced close the prompt.`;
      }

      console.error(
        boxen(errorMessage, {
          title: `⛔️ ${error.name} ⛔️`,
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

  private async __backendProjectType(params: __BackendProjectTypeParams) {
    const __backendFrameworkQuestion = await inquirer.prompt([
      {
        name: 'backendFramework',
        type: 'select',
        message: 'Which backend framework do you want to use:',
        choices: BACKEND_FRAMEWORKS.frameworks
          .sort((i, e) =>
            i.name.toLowerCase().localeCompare(e.name.toLowerCase(), 'en-US'),
          )
          .map((f) => f.name),
        default: 'Express.js',
      },
    ]);

    const __backendFrameworkResource = BACKEND_FRAMEWORKS.frameworks.find(
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
    __unableToOverwriteProject(__backendFrameworkTemplateDesPath);

    const __backendFrameworkMap = new Map<string, FrameworkConfig>([
      [
        'Express.js',
        {
          name: 'Express.js',
          packages: EXPRESS_DEPENDENCIES.packages,
          promptKey: 'expressDependencies',
          templateSource: __backendFrameworkTemplateSourcePath,
          templateDest: __backendFrameworkTemplateDesPath,
        },
      ],
      [
        'Fastify',
        {
          name: 'Fastify',
          packages: FASTIFY_DEPENDENCIES.packages,
          promptKey: 'fastifyDependencies',
          templateSource: __backendFrameworkTemplateSourcePath,
          templateDest: __backendFrameworkTemplateDesPath,
        },
      ],
      [
        'NestJS',
        {
          name: 'NestJS',
          packages: NEST_DEPENDENCIES.packages,
          promptKey: 'nestDependencies',
          templateSource: __backendFrameworkTemplateSourcePath,
          templateDest: __backendFrameworkTemplateDesPath,
        },
      ],
      [
        'Node.js',
        {
          name: 'Node.js',
          packages: NODE_DEPENDENCIES.packages,
          promptKey: 'nodeDependencies',
          templateSource: __backendFrameworkTemplateSourcePath,
          templateDest: __backendFrameworkTemplateDesPath,
        },
      ],
      [
        'Koa',
        {
          name: 'Koa',
          packages: KOA_DEPENDENCIES.packages,
          promptKey: 'koaDependencies',
          templateSource: __backendFrameworkTemplateSourcePath,
          templateDest: __backendFrameworkTemplateDesPath,
        },
      ],
    ]);

    const __selectedBackendFramework = __backendFrameworkMap.get(
      __backendFrameworkQuestion.backendFramework,
    );

    if (!__selectedBackendFramework)
      throw new Error(
        `Unsupported framework: ${__backendFrameworkQuestion.backendFramework}`,
      );

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

    await this.__setupUserProject({
      spinner: params.spinner,
      projectName: params.projectName,
      selectedFramework: __backendFrameworkQuestion.backendFramework,
      sourcePath: __selectedBackendFramework.templateSource,
      desPath: __selectedBackendFramework.templateDest,
    });

    if (__dockerQuestion.addDocker) {
      await this.__setupDocker({
        spinner: params.spinner,
        isAddingDocker: __dockerQuestion.addDocker,
        isAddingBake: __dockerQuestion.addDockerBake,
        selectedPackageManager: params.optionValues.pm,
        desPath: __selectedBackendFramework.templateDest,
      });
    }

    await this.__runOtherOptions({
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

    await this.__runSystemUpdate({
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

  private async __frontendProjectType(params: __FrontendProjectTypeParams) {
    const __frontendFrameworkSelection = await inquirer.prompt([
      {
        name: 'frontendFramework',
        type: 'select',
        message: 'Which frontend framework do you want to use:',
        choices: FRONTEND_FRAMEWORKS.frameworks
          .sort((i, e) =>
            i.name.toLowerCase().localeCompare(e.name.toLowerCase(), 'en-US'),
          )
          .map((f) => f.name),
        default: 'Astro.js',
      },
    ]);

    const __frontendFrameworkResource = FRONTEND_FRAMEWORKS.frameworks.find(
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
    __unableToOverwriteProject(__frontendFrameworkTemplateDesPath);

    const __frontendFrameworkMap = new Map<string, FrameworkConfig>([
      [
        'Astro.js',
        {
          name: 'Astro.js',
          packages: ASTRO_DEPENDENCIES.packages,
          promptKey: 'astroDependencies',
          templateSource: __frontendFrameworkTemplateSourcePath,
          templateDest: __frontendFrameworkTemplateDesPath,
        },
      ],
      [
        'Next.js',
        {
          name: 'Next.js',
          packages: NEXT_DEPENDENCIES.packages,
          promptKey: 'nextDependencies',
          templateSource: __frontendFrameworkTemplateSourcePath,
          templateDest: __frontendFrameworkTemplateDesPath,
        },
      ],
      [
        'SolidJS',
        {
          name: 'SolidJS',
          packages: SOLID_DEPENDENCIES.packages,
          promptKey: 'solidDependencies',
          templateSource: __frontendFrameworkTemplateSourcePath,
          templateDest: __frontendFrameworkTemplateDesPath,
        },
      ],
      [
        'Svelte',
        {
          name: 'Svelte',
          packages: SVELTE_DEPENDENCIES.packages,
          promptKey: 'svelteDependencies',
          templateSource: __frontendFrameworkTemplateSourcePath,
          templateDest: __frontendFrameworkTemplateDesPath,
        },
      ],
      [
        'Vue.js',
        {
          name: 'Vue.js',
          packages: VUE_DEPENDENCIES.packages,
          promptKey: 'vueDependencies',
          templateSource: __frontendFrameworkTemplateSourcePath,
          templateDest: __frontendFrameworkTemplateDesPath,
        },
      ],
      [
        'VanillaJS',
        {
          name: 'VanillaJS',
          packages: VANILLA_DEPENDENCIES.packages,
          promptKey: 'vanillaDependencies',
          templateSource: __frontendFrameworkTemplateSourcePath,
          templateDest: __frontendFrameworkTemplateDesPath,
        },
      ],
    ]);

    const __selectedFrontendFramework = __frontendFrameworkMap.get(
      __frontendFrameworkSelection.frontendFramework,
    );

    if (!__selectedFrontendFramework)
      throw new Error(
        `Unsupported framework: ${__frontendFrameworkSelection.frontendFramework}`,
      );

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

    await this.__setupUserProject({
      spinner: params.spinner,
      projectName: params.projectName,
      selectedFramework: __frontendFrameworkSelection.frontendFramework,
      sourcePath: __selectedFrontendFramework.templateSource,
      desPath: __selectedFrontendFramework.templateDest,
    });

    if (__dockerQuestion.addDocker) {
      await this.__setupDocker({
        spinner: params.spinner,
        isAddingDocker: __dockerQuestion.addDocker,
        isAddingBake: __dockerQuestion.addDockerBake,
        selectedPackageManager: params.optionValues.pm,
        desPath: __selectedFrontendFramework.templateDest,
      });
    }

    await this.__runOtherOptions({
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

    await this.__runSystemUpdate({
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

  private async __setupUserProject(params: __SetupUserProjectParams) {
    params.spinner.start(
      `Creating project skeleton 💀 ${chalk.bold(params.projectName)} with ${chalk.bold(
        params.selectedFramework,
      )}, please wait for a moment...`,
    );

    await fse.copy(params.sourcePath, params.desPath, {
      overwrite: true,
    });

    params.spinner.succeed(
      `${chalk.bold(params.projectName)} created succesfully ✅`,
    );
  }

  private __getDockerPaths(filename: string, desPath: string) {
    const __dockerTemplatesPath = path.join(__basePath, 'templates/docker');
    __pathNotExist(__dockerTemplatesPath);

    const __templates = fs.readdirSync(__dockerTemplatesPath, {
      withFileTypes: true,
    });

    const __dockerFile = __templates.find((f) => f.name === filename);

    if (!__dockerFile) {
      throw new UnidentifiedTemplateError(
        `${chalk.bold('Unidentified template')}: ${chalk.bold(filename)} file template is not defined.`,
      );
    }

    const __dockerFileSourcePath = path.join(
      __dockerFile.parentPath,
      __dockerFile.name,
    );
    const __dockerFileDesPath = path.join(desPath, __dockerFile.name);

    return {
      sourcePath: __dockerFileSourcePath,
      desPath: __dockerFileDesPath,
    };
  }

  private async __runAddDocker(params: __RunAddDockerParams) {
    const __dockerComposeSources = this.__getDockerPaths(
      'compose.yml',
      params.desPath,
    );

    params.spinner.start(
      `Copying ${chalk.bold('docker compose file')} 🐳 into ${chalk.bold(params.desPath)}, please wait for a moment...`,
    );

    await fse.copy(
      __dockerComposeSources.sourcePath,
      __dockerComposeSources.desPath,
    );

    params.spinner.succeed(
      `Copying ${chalk.bold('docker compose file')} succeed ✅`,
    );

    const __dockerfileBaseOnePackageManager =
      params.selectedPackageManager === 'npm'
        ? 'npm.Dockerfile'
        : 'pnpm.Dockerfile';

    const __dockerfileSources = this.__getDockerPaths(
      __dockerfileBaseOnePackageManager,
      params.desPath,
    );

    params.spinner.start(
      `Copying ${chalk.bold('dockerfile')} 🐳 into ${chalk.bold(params.desPath)}, please wait for a moment...`,
    );

    await fse.copy(__dockerfileSources.sourcePath, __dockerfileSources.desPath);

    params.spinner.succeed(`Copying ${chalk.bold('dockerfile')} succeed ✅`);
  }

  private async __runAddBake(params: __RunAddBakeParams) {
    const __dockerComposePaths = this.__getDockerPaths(
      'compose.yml',
      params.desPath,
    );

    params.spinner.start(
      `Copying ${chalk.bold('docker compose file')} 🐳 into ${chalk.bold(params.desPath)}, please wait for a moment...`,
    );

    await fse.copy(
      __dockerComposePaths.sourcePath,
      __dockerComposePaths.desPath,
    );

    params.spinner.succeed(
      `Copying ${chalk.bold('docker compose file')} succeed ✅`,
    );

    const __dockerfileBaseOnePackageManager =
      params.selectedPackageManager === 'npm'
        ? 'npm.Dockerfile'
        : 'pnpm.Dockerfile';

    const __dockerfilePaths = this.__getDockerPaths(
      __dockerfileBaseOnePackageManager,
      params.desPath,
    );

    params.spinner.start(
      `Copying ${chalk.bold('docker compose file')} 🐳 into ${chalk.bold(params.desPath)}, please wait for a moment...`,
    );

    await fse.copy(__dockerfilePaths.sourcePath, __dockerfilePaths.desPath);

    params.spinner.succeed(`Copying ${chalk.bold('dockerfile')} succeed ✅`);

    const __dockerBakePaths = this.__getDockerPaths(
      'docker-bake.hcl',
      params.desPath,
    );

    params.spinner.start(
      `Copying ${chalk.bold('docker bake file')} 🍞 into ${chalk.bold(params.desPath)}, please wait for a moment...`,
    );

    await fse.copy(__dockerBakePaths.sourcePath, __dockerBakePaths.desPath);

    params.spinner.succeed(
      `Copying ${chalk.bold('docker bake file')} succeed ✅`,
    );
  }

  private async __setupDocker(params: __SetupDockerParams) {
    if (!params.isAddingDocker) return;

    if (!params.isAddingBake)
      await this.__runAddDocker({
        spinner: params.spinner,
        desPath: params.desPath,
        selectedPackageManager: params.selectedPackageManager,
      });
    else
      await this.__runAddBake({
        spinner: params.spinner,
        desPath: params.desPath,
        selectedPackageManager: params.selectedPackageManager,
      });
  }

  private async __runAddGit(spinner: Ora, desPath: string) {
    const __initializeGitQuestion = await inquirer.prompt({
      name: 'addGit',
      type: 'confirm',
      message: `Do you want us to run ${chalk.bold('git init')}? (optional)`,
      default: false,
    });

    if (!__initializeGitQuestion.addGit) {
      console.warn(
        boxen(
          `${chalk.white(
            `${chalk.bold(
              (await __userRealName()).split(' ')[0],
            )}, you can run ${chalk.bold('git init')} later.`,
          )}`,
          {
            title: 'ⓘ Warning Information ⓘ',
            titleAlignment: 'center',
            padding: 1,
            margin: 1,
            borderColor: 'yellow',
          },
        ),
      );
      return;
    }

    spinner.start(
      `Initializing Git repository 📖, please wait for a moment...`,
    );

    await execa('git', ['init'], {
      cwd: desPath,
    });

    spinner.succeed(`Git repository successfully initialized ✅`);
  }

  private async __runAddLicense(
    spinner: Ora,
    projectName: string,
    desPath: string,
  ) {
    const __licenseQuestion = await inquirer.prompt({
      name: 'addLicense',
      type: 'confirm',
      message: `Do you want us to add ${chalk.bold(
        'LICENSE',
      )} file into your project? (optional)`,
      default: false,
    });

    if (!__licenseQuestion.addLicense) {
      console.warn(
        boxen(
          `${chalk.white(
            `It's okay ${chalk.bold(
              (await __userRealName()).split(' ')[0],
            )}, you can add ${chalk.bold('LICENSE')} later.`,
          )}`,
          {
            title: 'ⓘ Warning Information ⓘ',
            titleAlignment: 'center',
            padding: 1,
            margin: 1,
            borderColor: 'yellow',
          },
        ),
      );
      return;
    }

    const __licenseSelection: {
      license:
        | 'Apache 2.0 License'
        | 'BSD 2-Clause License'
        | 'BSD 3-Clause License'
        | 'GNU General Public License v3.0'
        | 'ISC License'
        | 'GNU Lesser General Public License v3.0'
        | 'MIT License'
        | 'Unlicense';
    } = await inquirer.prompt({
      name: 'license',
      type: 'select',
      message: 'Which license do you want to use:',
      choices: LICENSES.licenses
        .sort((i, e) =>
          i.name.toLowerCase().localeCompare(e.name.toLowerCase(), 'en-US'),
        )
        .map((l) => l.name),
      default: 'MIT License',
    });

    spinner.start(
      `Start adding ${chalk.bold(
        __licenseSelection.license,
      )} file into ${chalk.bold(projectName)} 🧾...`,
    );

    const __licenseFile = LICENSES.licenses.find(
      (l) => l.name === __licenseSelection.license,
    );

    if (!__licenseFile) {
      throw new UnidentifiedTemplateError(
        `${chalk.bold('Unidentified template')}: ${chalk.bold(__licenseSelection.license)} file template is not defined.`,
      );
    }

    const __licenseSourcePath = path.join(__basePath, __licenseFile.path);

    await fse.copy(__licenseSourcePath, desPath);

    spinner.succeed(
      `Adding ${chalk.bold(
        __licenseSelection.license,
      )} file on ${chalk.bold(projectName)} succeed ✅`,
    );
  }

  private async __runAddTypescript(params: __RunAddTsParams) {
    const __frameworkList =
      params.projectType !== 'backend'
        ? FRONTEND_FRAMEWORKS.frameworks
        : BACKEND_FRAMEWORKS.frameworks;

    const __frameworkFile = __frameworkList.find(
      (f) => f.name === params.selectedframework,
    );

    if (!__frameworkFile) {
      throw new UnidentifiedTemplateError(
        `${chalk.bold('Unidentified template')}: ${chalk.bold(params.selectedframework)} file template is not defined.`,
      );
    }

    const _frameworkPath = path.join(__basePath, __frameworkFile.path);

    const _frameworkFiles = fs.readdirSync(_frameworkPath, {
      withFileTypes: true,
    });

    const __tsConfigFile = _frameworkFiles.find(
      (f) => f.name === 'tsconfig.json',
    );

    if (__tsConfigFile !== undefined) {
      console.warn(
        boxen(
          `${chalk.white(`${chalk.bold('tsconfig.json')} is exist on ${chalk.bold(params.projectName)}, means that ${chalk.bold('Typescript')} already installed.`)}`,
          {
            title: 'ⓘ Warning Information ⓘ',
            titleAlignment: 'center',
            padding: 1,
            margin: 1,
            borderColor: 'yellow',
          },
        ),
      );
      return;
    }

    await this.__runInstallTs({
      spinner: params.spinner,
      projectType: params.projectType,
      selectedFramework: params.selectedframework,
      selectedPackageManager: params.selectedPackageManager,
      desPath: params.desPath,
    });

    const __executeCommand =
      params.selectedPackageManager === 'npm' ? 'npx' : 'pnpm';

    const __initializeTypescriptQuestion = await inquirer.prompt({
      name: 'addTsConfig',
      type: 'confirm',
      message: `Do you want us to execute ${chalk.bold(
        `${__executeCommand} tsc --init`,
      )} in your project? (optional)`,
      default: false,
    });

    if (!__initializeTypescriptQuestion.addTsConfig) {
      console.warn(
        boxen(
          `${chalk.white(
            `${chalk.bold(
              (await __userRealName()).split(' ')[0],
            )}, you can initialize ${chalk.bold('Typescript')} later.`,
          )}`,
          {
            title: 'ⓘ Warning Information ⓘ',
            titleAlignment: 'center',
            padding: 1,
            margin: 1,
            borderColor: 'yellow',
          },
        ),
      );
      return;
    }

    params.spinner.start(
      `Initializing ${chalk.bold('Typescript')} into ${chalk.bold(params.projectName)}, please wait for a moment...`,
    );

    await execa(__executeCommand, ['tsc', '--init'], {
      cwd: params.desPath,
    });

    params.spinner.succeed(
      `Initializing ${chalk.bold('Typescript')} succeed ✅`,
    );

    params.spinner.start(`Start renaming .js files to .ts`);

    const renamePairs: [string, string][] =
      params.projectType === 'backend'
        ? [
            [
              path.join(params.desPath, 'index.js'),
              path.join(params.desPath, 'index.ts'),
            ],
          ]
        : [
            [
              path.join(params.desPath, 'src', 'main.js'),
              path.join(params.desPath, 'src', 'main.ts'),
            ],
            [
              path.join(params.desPath, 'src', 'counter.js'),
              path.join(params.desPath, 'src', 'counter.ts'),
            ],
          ];

    for (const [__sourcePath, __desPath] of renamePairs) {
      if (fs.existsSync(__sourcePath)) {
        params.spinner.start(
          `Renaming ${chalk.bold(__sourcePath)} to ${chalk.bold(__desPath)}...`,
        );

        fs.renameSync(__sourcePath, __desPath);

        params.spinner.succeed(
          `Renamed ${chalk.bold(__sourcePath)} → ${chalk.bold(__desPath)} ✅`,
        );
      }
    }

    params.spinner.succeed(
      `All file renames complete for ${chalk.bold(params.projectName)} ✅`,
    );
  }

  private async __runSwitchPackageManager(
    params: __RunSwitchPackageManagerParams,
  ) {
    const __lockFiles = [
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'bun.lock',
    ];

    for (const file of __lockFiles) {
      const __fullPath = path.join(params.desPath, file);

      if (await fse.exists(__fullPath)) {
        await fse.remove(__fullPath);
      }
    }

    const __nodeModulesPath = path.join(params.desPath, 'node_modules');

    if (await fse.exists(__nodeModulesPath)) {
      await fse.remove(__nodeModulesPath);
    }

    const __executeCommand =
      params.selectedPackageManager === 'npm' ? 'npm' : 'pnpm';

    await execa(__executeCommand, ['install'], {
      cwd: params.desPath,
      stdio: 'inherit',
    });
  }

  private async __runInstallTs(params: __RunInstallTsParams) {
    const __executeCommand =
      params.selectedPackageManager === 'npm' ? 'npm' : 'pnpm';

    for (const p of TYPESCRIPT_DEPENDENCIES[params.projectType][
      params.selectedFramework
    ]) {
      params.spinner.start(`Start installing ${chalk.bold(p)} package...`);

      if (params.selectedPackageManager === 'npm') {
        await execa(__executeCommand, ['install', '-D', p], {
          cwd: params.desPath,
        });
      } else {
        await execa(__executeCommand, ['add', '-D', p], {
          cwd: params.desPath,
        });
      }

      params.spinner.succeed(`Installing ${chalk.bold(p)} package succeed ✅`);
    }
  }

  private async __runInstall(params: __RunInstallParams) {
    const __executeCommand =
      params.selectedPackageManager === 'npm' ? 'npm' : 'pnpm';

    params.spinner.start(
      `Installing ${chalk.bold(params.selectedDependencies.join(', '))}, please wait for a moment...`,
    );

    for (const p of params.selectedDependencies) {
      params.spinner.start(`Start installing ${chalk.bold(p)} dependency...`);

      await execa(__executeCommand, ['install', '--save', p], {
        cwd: params.desPath,
      });

      params.spinner.succeed(
        `Installing ${chalk.bold(p)} dependency succeed ✅`,
      );
    }

    const __isPrettierSelected =
      params.selectedDependencies.includes('prettier');
    const __isEsLintSelected = params.selectedDependencies.includes('eslint');

    if (__isPrettierSelected) {
      const __prettierrcTemplatesPath = path.join(
        __basePath,
        'templates/configs',
      );
      __pathNotExist(__prettierrcTemplatesPath);

      const __templates = fs.readdirSync(__prettierrcTemplatesPath, {
        withFileTypes: true,
      });

      const __prettierrcFile = __templates.find(
        (f) => f.name === '.prettierrc',
      );

      if (!__prettierrcFile) {
        throw new UnidentifiedTemplateError(
          `${chalk.bold('Unidentified template')}: ${chalk.bold('.prettierrc')} file template is not defined.`,
        );
      }

      const __prettierrcFileSourcePath = path.join(
        __prettierrcFile.parentPath,
        __prettierrcFile.name,
      );
      const __prettierrcFileDesPath = path.join(
        params.desPath,
        __prettierrcFile.name,
      );

      params.spinner.start(`Initializing ${chalk.bold('.prettierrc')} file...`);

      await fse.copy(__prettierrcFileSourcePath, __prettierrcFileDesPath);

      params.spinner.succeed(
        `Adding ${chalk.bold('.prettierrc')} configuration completed ✅`,
      );
    }

    if (__isEsLintSelected) {
      const __executeCommand =
        params.selectedPackageManager === 'npm' ? 'npx' : 'pnpx';

      const __initializeESLintQuestion = await inquirer.prompt({
        name: 'addESLintConfig',
        type: 'confirm',
        message: `Do you want us to execute ${chalk.bold(
          `${__executeCommand} eslint --init`,
        )} in your project? (optional)`,
        default: false,
      });

      if (!__initializeESLintQuestion.addESLintConfig) {
        console.warn(
          boxen(
            `${chalk.white(
              `${chalk.bold(
                (await __userRealName()).split(' ')[0],
              )}, you can execute ${chalk.bold(`${__executeCommand} eslint --init`)} later.`,
            )}`,
            {
              title: 'ⓘ Warning Information ⓘ',
              titleAlignment: 'center',
              padding: 1,
              margin: 1,
              borderColor: 'yellow',
            },
          ),
        );
        return;
      }

      await execa(`${__executeCommand}`, ['eslint', '--init'], {
        cwd: params.desPath,
        stdio: 'inherit',
      });
    }

    params.spinner.succeed(`Installing all dependencies succeed ✅`);
  }

  private async __runUpdate(params: __RunUpdateParams) {
    const __updateDependenciesQuestion = await inquirer.prompt({
      name: 'updatePackages',
      type: 'confirm',
      message: `Do you want us to run ${chalk.bold(`${params.selectedPackageManager} update`)}? (optional)`,
      default: false,
    });

    if (!__updateDependenciesQuestion.updatePackages) {
      console.warn(
        boxen(
          `${chalk.white(
            `${chalk.bold(
              (await __userRealName()).split(' ')[0],
            )}, you can update the dependencies later.`,
          )}`,
          {
            title: 'ⓘ Warning Information ⓘ',
            titleAlignment: 'center',
            padding: 1,
            margin: 1,
            borderColor: 'yellow',
          },
        ),
      );
      return;
    }

    params.spinner.start(
      `Updating ${chalk.bold(
        params.projectName,
      )} dependencies, please wait for a moment 🌎...`,
    );

    await execa(`${params.selectedPackageManager}`, ['update'], {
      cwd: params.desPath,
    });

    params.spinner.succeed(
      `Updating ${chalk.bold(params.projectName)} dependencies succeed ✅`,
    );
  }

  private async __runSystemUpdate(params: __RunSystemUpdateParams) {
    if (params.selectedDependencies.length < 1) {
      return;
    }

    await this.__runInstall({
      spinner: params.spinner,
      selectedDependencies: params.selectedDependencies,
      selectedPackageManager: params.selectedPackageManager,
      desPath: params.desPath,
    });
    await this.__runUpdate({
      spinner: params.spinner,
      selectedPackageManager: params.selectedPackageManager,
      projectName: params.projectName,
      desPath: params.desPath,
    });
  }

  private async __runOtherOptions(params: __RunOtherOptionsParams) {
    if (params.optionValues.git) {
      await this.__runAddGit(params.spinner, params.desPath);
    }

    if (params.optionValues.li) {
      await this.__runAddLicense(
        params.spinner,
        params.projectName,
        params.desPath,
      );
    }

    if (params.optionValues.pm && params.optionValues.pm !== '') {
      await this.__runSwitchPackageManager({
        spinner: params.spinner,
        selectedPackageManager: params.optionValues.pm,
        projectName: params.projectName,
        desPath: params.desPath,
      });
    }

    if (params.optionValues.ts) {
      await this.__runAddTypescript({
        spinner: params.spinner,
        projectType: params.projectType.toLowerCase(),
        projectName: params.projectName,
        selectedframework: params.selectedFramework,
        selectedPackageManager: params.optionValues.pm,
        desPath: params.desPath,
      });
    }
  }
}
