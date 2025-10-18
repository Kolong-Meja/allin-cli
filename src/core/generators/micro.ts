import {
  __basePath,
  CACHE_BASE_PATH,
  CACHE_TTL_MS,
  INSTALL_TIMEOUT_MS,
} from '@/config.js';
import { TYPESCRIPT_DEFAULT_DEPENDENCIES } from '@/constants/default.js';
import {
  BACKEND_FRAMEWORKS,
  FRONTEND_FRAMEWORKS,
  LICENSES,
} from '@/constants/global.js';
import { UnidentifiedTemplateError } from '@/exceptions/error.js';
import { __pathNotFound } from '@/exceptions/trigger.js';
import type {
  CachedEntry,
  MicroGeneratorBuilder,
} from '@/interfaces/global.js';
import type {
  __AddDockerBakeParams,
  __AddDockerParams,
  __AddEnvParams,
  __AddLicenseParams,
  __AddReadmeParams,
  __InstallDependenciesParams,
  __InstallTypescriptParams,
  __SetupDockerParams,
  __SetupInstallationParams,
  __SetupOthersParams,
  __SetupProjectParams,
  __SwitchPackageManagerParams,
  __UpdateDependenciesParams,
  __UpdatePackageMetadataParams,
  __UseTypescriptParams,
  Mixed,
} from '@/types/global.js';
import {
  hasValue,
  isBackend,
  isEmptyString,
  isUndefined,
} from '@/utils/guard.js';
import boxen from 'boxen';
import chalk from 'chalk';
import { execa } from 'execa';
import fse from 'fs-extra';
import inquirer from 'inquirer';
import type { Ora } from 'ora';
import path from 'path';

export class MicroGenerator implements MicroGeneratorBuilder {
  static #instance: MicroGenerator;

  private constructor() {}

  public static get instance(): MicroGenerator {
    if (!MicroGenerator.#instance) {
      MicroGenerator.#instance = new MicroGenerator();
    }

    return MicroGenerator.#instance;
  }

  public async setupProject(params: __SetupProjectParams) {
    await this.__checkCacheReady(CACHE_BASE_PATH, CACHE_TTL_MS);

    const isPathExist = fse.existsSync(params.desPath);

    if (params.optionValues.force && isPathExist) {
      const forceOverwriteProjectConfirmation = await inquirer.prompt({
        name: 'forceOverwrite',
        type: 'confirm',
        message: `Are you sure to overwrite ${params.desPath} project?`,
        default: false,
        when: () => isPathExist,
      });

      if (forceOverwriteProjectConfirmation.forceOverwrite) {
        await fse.remove(params.desPath);
      } else {
        process.exit(0);
      }
    }

    const tempDir = path.join(
      __basePath,
      'templates',
      'temp',
      params.projectName,
    );
    await fse.ensureDir(tempDir);
    await fse.copy(params.sourcePath, tempDir);

    return async () => {
      await fse.copy(tempDir, params.desPath);
      await fse.remove(tempDir);

      try {
        await this.__storeCachedProject(
          CACHE_BASE_PATH,
          CACHE_TTL_MS,
          params.projectType,
          params.desPath,
          params.projectName,
        );
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
    };
  }

  public async setupDocker(params: __SetupDockerParams) {
    if (!params.isAddingDocker) return;

    if (!params.isAddingBake)
      await this.__addDocker({
        spinner: params.spinner,
        desPath: params.desPath,
        selectedPackageManager: params.selectedPackageManager,
      });
    else
      await this.__addDockerBake({
        spinner: params.spinner,
        desPath: params.desPath,
        selectedPackageManager: params.selectedPackageManager,
      });
  }

  public async setupOthers(params: __SetupOthersParams) {
    if (params.optionValues.git) {
      await this.__addGit(params.spinner, params.desPath);
    }

    if (
      params.optionValues.packageManager &&
      !isEmptyString(params.optionValues.packageManager)
    ) {
      await this.__switchPackageManager({
        spinner: params.spinner,
        selectedPackageManager: params.optionValues.packageManager,
        projectName: params.projectName,
        desPath: params.desPath,
      });
    }

    if (params.optionValues.typescript) {
      await this.__useTypescript({
        spinner: params.spinner,
        projectType: params.projectType,
        projectName: params.projectName,
        selectedframework: params.selectedFramework,
        selectedPackageManager: params.optionValues.packageManager,
        desPath: params.desPath,
      });
    }

    if (
      hasValue(params.optionValues.author) ||
      hasValue(params.optionValues.description) ||
      hasValue(params.optionValues.version)
    ) {
      await this.__updatePackageMetadata({
        spinner: params.spinner,
        optionValues: params.optionValues,
        projectName: params.projectName,
        desPath: params.desPath,
      });
    }

    await this.__addLicense({
      spinner: params.spinner,
      optionValues: params.optionValues,
      projectName: params.projectName,
      desPath: params.desPath,
    });

    if (params.optionValues.readme) {
      await this.__addReadme({
        spinner: params.spinner,
        optionValues: params.optionValues,
        projectName: params.projectName,
        projectType: params.projectType,
        desPath: params.desPath,
      });
    }

    if (params.optionValues.env) {
      await this.__addEnv({
        spinner: params.spinner,
        optionValues: params.optionValues,
        projectName: params.projectName,
        projectType: params.projectType,
        desPath: params.desPath,
      });
    }
  }

  public async setupInstallation(params: __SetupInstallationParams) {
    if (params.selectedDependencies.length < 1) {
      return;
    }

    await this.__installDependencies({
      spinner: params.spinner,
      selectedDependencies: params.selectedDependencies,
      selectedPackageManager: params.selectedPackageManager,
      desPath: params.desPath,
    });

    await this.__updateDependencies({
      spinner: params.spinner,
      selectedPackageManager: params.selectedPackageManager,
      projectName: params.projectName,
      desPath: params.desPath,
    });
  }

  private async __addDocker(params: __AddDockerParams) {
    const dockerComposeSrc = this.__getDockerPaths(
      'compose.yml',
      params.desPath,
    );

    params.spinner.start(
      `Copying ${chalk.bold('docker compose file')} into ${chalk.bold(params.desPath)}, please wait for a moment.`,
    );

    await fse.copy(dockerComposeSrc.sourcePath, dockerComposeSrc.desPath);

    params.spinner.succeed(
      `Copying ${chalk.bold('docker compose file')} succeed.`,
    );

    const dockerFileBasedOnPm =
      params.selectedPackageManager === 'npm'
        ? 'npm.Dockerfile'
        : params.selectedPackageManager === 'pnpm'
          ? 'pnpm.Dockerfile'
          : 'bun.Dockerfile';

    const dockerFileSrc = this.__getDockerPaths(
      dockerFileBasedOnPm,
      params.desPath,
    );

    params.spinner.start(
      `Copying ${chalk.bold('dockerfile')} into ${chalk.bold(params.desPath)}, please wait for a moment.`,
    );

    await fse.copy(dockerFileSrc.sourcePath, dockerFileSrc.desPath);

    params.spinner.succeed(`Copying ${chalk.bold('dockerfile')} succeed.`);
  }

  private async __addDockerBake(params: __AddDockerBakeParams) {
    const dockerComposePaths = this.__getDockerPaths(
      'compose.yml',
      params.desPath,
    );

    params.spinner.start(
      `Copying ${chalk.bold('docker compose file')} into ${chalk.bold(params.desPath)}, please wait for a moment.`,
    );

    await fse.copy(dockerComposePaths.sourcePath, dockerComposePaths.desPath);

    params.spinner.succeed(
      `Copying ${chalk.bold('docker compose file')} succeed.`,
    );

    const dockerFileBasedOnPm =
      params.selectedPackageManager === 'npm'
        ? 'npm.Dockerfile'
        : params.selectedPackageManager === 'pnpm'
          ? 'pnpm.Dockerfile'
          : 'bun.Dockerfile';

    const dockerFilePaths = this.__getDockerPaths(
      dockerFileBasedOnPm,
      params.desPath,
    );

    params.spinner.start(
      `Copying ${chalk.bold('docker compose file')} into ${chalk.bold(params.desPath)}, please wait for a moment.`,
    );

    await fse.copy(dockerFilePaths.sourcePath, dockerFilePaths.desPath);

    params.spinner.succeed(`Copying ${chalk.bold('dockerfile')} succeed.`);

    const dockerBakePaths = this.__getDockerPaths(
      'docker-bake.hcl',
      params.desPath,
    );

    params.spinner.start(
      `Copying ${chalk.bold('docker bake file')} into ${chalk.bold(params.desPath)}, please wait for a moment.`,
    );

    await fse.copy(dockerBakePaths.sourcePath, dockerBakePaths.desPath);

    params.spinner.succeed(
      `Copying ${chalk.bold('docker bake file')} succeed.`,
    );
  }

  private async __addGit(spinner: Ora, desPath: string) {
    const initializeGitQuestion = await inquirer.prompt({
      name: 'addGit',
      type: 'confirm',
      message: `Do you want us to run git init?`,
      default: false,
    });

    if (!initializeGitQuestion.addGit) {
      console.warn(
        boxen(`You can run ${chalk.bold('git init')} later.`, {
          title: 'Warning Information',
          titleAlignment: 'center',
          padding: 1,
          margin: 1,
          borderColor: 'yellow',
        }),
      );
    }

    spinner.start(`Initializing Git repository, please wait for a moment.`);

    await execa('git', ['init'], {
      cwd: desPath,
    });

    spinner.succeed(`Git repository successfully initialized.`);
  }

  private async __addLicense(params: __AddLicenseParams) {
    const licenseSelection = await inquirer.prompt({
      name: 'license',
      type: 'list',
      message: 'Which license do you want to use:',
      choices: LICENSES.licenses
        .sort((i, e) =>
          i.name.toLowerCase().localeCompare(e.name.toLowerCase(), 'en-US'),
        )
        .map((l) => l.actualName),
      default: 'MIT License',
      loop: false,
      when: () => isUndefined(params.optionValues.license),
    });

    const licenseFile = isUndefined(params.optionValues.license)
      ? LICENSES.licenses.find((l) => l.actualName === licenseSelection.license)
      : LICENSES.licenses.find((l) => l.name === params.optionValues.license);

    if (!licenseFile) {
      throw new UnidentifiedTemplateError(
        `${chalk.bold('Unidentified template')}: ${chalk.bold(licenseSelection.license)} file template is not defined.`,
      );
    }

    params.spinner.start(
      `Start adding ${chalk.bold(
        licenseFile.actualName,
      )} file into ${chalk.bold(params.projectName)}.`,
    );

    const licenseSrcPath = path.join(__basePath, licenseFile.path);

    await fse.copy(licenseSrcPath, params.desPath);

    params.spinner.succeed(
      `Adding ${chalk.bold(
        licenseFile.actualName,
      )} file on ${chalk.bold(params.projectName)} succeed.`,
    );
  }

  private async __addReadme(params: __AddReadmeParams) {
    const backendReadmePaths = this.__getReadmePaths(
      'BACKEND_README.md',
      params.desPath,
    );
    const frontendReadmePaths = this.__getReadmePaths(
      'FRONTEND_README.md',
      params.desPath,
    );

    params.spinner.start(
      `Copying ${chalk.bold('readme')} file into ${chalk.bold(params.desPath)}, please wait for a moment.`,
    );

    const readmeSourcePath =
      params.projectType !== 'backend'
        ? frontendReadmePaths.sourcePath
        : backendReadmePaths.sourcePath;

    const readmeTargetPath = path.join(params.desPath, 'README.md');

    await fse.copy(readmeSourcePath, readmeTargetPath);

    params.spinner.succeed(`Copying ${chalk.bold('readme')} file succeed.`);
  }

  private async __addEnv(params: __AddEnvParams) {
    const backendEnvPaths = this.__getEnvPaths('.env.backend', params.desPath);
    const frontendEnvPaths = this.__getEnvPaths(
      '.env.frontend',
      params.desPath,
    );

    params.spinner.start(
      `Copying ${chalk.bold('.env')} file into ${chalk.bold(params.desPath)}, please wait for a moment.`,
    );

    const envSourcePath =
      params.projectType !== 'backend'
        ? frontendEnvPaths.sourcePath
        : backendEnvPaths.sourcePath;

    const envTargetPath = path.join(params.desPath, '.env');

    await fse.copy(envSourcePath, envTargetPath);

    params.spinner.succeed(`Copying ${chalk.bold('.env')} file succeed.`);
  }

  private async __switchPackageManager(params: __SwitchPackageManagerParams) {
    const __lockFiles = [
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'bun.lock',
    ];

    for (const file of __lockFiles) {
      const lockFilePath = path.join(params.desPath, file);

      if (await fse.exists(lockFilePath)) {
        await fse.remove(lockFilePath);
      }
    }

    const nodeModulePath = path.join(params.desPath, 'node_modules');

    if (await fse.exists(nodeModulePath)) {
      await fse.remove(nodeModulePath);
    }

    const executeChangingPmCommand =
      params.selectedPackageManager === 'npm'
        ? 'npm'
        : params.selectedPackageManager === 'pnpm'
          ? 'pnpm'
          : 'bun';

    await execa(executeChangingPmCommand, ['install'], {
      cwd: params.desPath,
      timeout: INSTALL_TIMEOUT_MS,
      killSignal: 'SIGTERM',
      stdio: 'pipe',
    });
  }

  private async __useTypescript(params: __UseTypescriptParams) {
    const frameworks =
      params.projectType !== 'backend'
        ? FRONTEND_FRAMEWORKS.frameworks
        : BACKEND_FRAMEWORKS.frameworks;

    const frameworkFile = frameworks.find(
      (f) => f.name === params.selectedframework,
    );

    if (!frameworkFile) {
      throw new UnidentifiedTemplateError(
        `${chalk.bold('Unidentified template')}: ${chalk.bold(params.selectedframework)} file template is not defined.`,
      );
    }

    const frameworkPath = path.join(__basePath, frameworkFile.path);

    const frameworkFiles = fse.readdirSync(frameworkPath, {
      withFileTypes: true,
    });

    const tsConfigFile = frameworkFiles.find((f) => f.name === 'tsconfig.json');

    if (!isUndefined(tsConfigFile)) {
      console.warn(
        boxen(
          `${chalk.bold('tsconfig.json')} is exist on ${chalk.bold(params.projectName)}, means that ${chalk.bold('Typescript')} already installed.`,
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

    await this.__installTypescript({
      spinner: params.spinner,
      projectType: params.projectType,
      selectedFramework: params.selectedframework,
      selectedPackageManager: params.selectedPackageManager,
      desPath: params.desPath,
    });

    const executeConditioningPmCommand =
      params.selectedPackageManager === 'npm'
        ? 'npx'
        : params.selectedPackageManager === 'pnpm'
          ? 'pnpm'
          : 'bunx';

    const initializeTsQuestion = await inquirer.prompt({
      name: 'addTsConfig',
      type: 'confirm',
      message: `Do you want us to execute ${chalk.bold(
        `${executeConditioningPmCommand} tsc --init`,
      )} in your project? (optional)`,
      default: false,
    });

    if (!initializeTsQuestion.addTsConfig) {
      console.warn(
        boxen(`You can initialize ${chalk.bold('Typescript')} later.`, {
          title: 'Warning Information',
          titleAlignment: 'center',
          padding: 1,
          margin: 1,
          borderColor: 'yellow',
        }),
      );
    }

    params.spinner.start(
      `Initializing ${chalk.bold('Typescript')} into ${chalk.bold(params.projectName)}, please wait for a moment.`,
    );

    await execa(executeConditioningPmCommand, ['tsc', '--init'], {
      cwd: params.desPath,
    });

    params.spinner.succeed(`Initializing ${chalk.bold('Typescript')} succeed.`);

    params.spinner.start(`Start renaming .js files to .ts`);

    const renamePairs: [string, string][] = isBackend(params.projectType)
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
      if (fse.existsSync(__sourcePath)) {
        params.spinner.start(
          `Renaming ${chalk.bold(__sourcePath)} to ${chalk.bold(__desPath)}.`,
        );

        fse.renameSync(__sourcePath, __desPath);

        params.spinner.succeed(
          `Renamed ${chalk.bold(__sourcePath)} → ${chalk.bold(__desPath)}.`,
        );
      }
    }

    params.spinner.succeed(
      `All file renames complete for ${chalk.bold(params.projectName)}.`,
    );
  }

  private __getDockerPaths(filename: string, desPath: string) {
    const dockerTemplatesPath = path.join(
      __basePath,
      'templates/addons/docker',
    );
    __pathNotFound(dockerTemplatesPath);

    const dockerTemplates = fse.readdirSync(dockerTemplatesPath, {
      withFileTypes: true,
    });

    const dockerFile = dockerTemplates.find((f) => f.name === filename);

    if (!dockerFile) {
      throw new UnidentifiedTemplateError(
        `${chalk.bold('Unidentified template')}: ${chalk.bold(filename)} file template is not defined.`,
      );
    }

    const dockerFileSrcPath = path.join(dockerFile.parentPath, dockerFile.name);
    const dockerFileDesPath = path.join(desPath, dockerFile.name);

    return {
      sourcePath: dockerFileSrcPath,
      desPath: dockerFileDesPath,
    };
  }

  private __getReadmePaths(filename: string, desPath: string) {
    const readmeTemplatesPath = path.join(
      __basePath,
      'templates/addons/others',
    );
    __pathNotFound(readmeTemplatesPath);

    const readmeTemplates = fse.readdirSync(readmeTemplatesPath, {
      withFileTypes: true,
    });

    const readmeFile = readmeTemplates.find((f) => f.name === filename);

    if (!readmeFile) {
      throw new UnidentifiedTemplateError(
        `${chalk.bold('Unidentified template')}: ${chalk.bold(filename)} file template is not defined.`,
      );
    }

    const readmeFileSrcPath = path.join(readmeFile.parentPath, readmeFile.name);
    const readmeFileDesPath = path.join(desPath, readmeFile.name);

    return {
      sourcePath: readmeFileSrcPath,
      desPath: readmeFileDesPath,
    };
  }

  private __getEnvPaths(filename: string, desPath: string) {
    const envTemplatesPath = path.join(__basePath, 'templates/addons/config');
    __pathNotFound(envTemplatesPath);

    const envTemplates = fse.readdirSync(envTemplatesPath, {
      withFileTypes: true,
    });

    const envFile = envTemplates.find((f) => f.name === filename);

    if (!envFile) {
      throw new UnidentifiedTemplateError(
        `${chalk.bold('Unidentified template')}: ${chalk.bold(filename)} file template is not defined.`,
      );
    }

    const envFileSrcPath = path.join(envFile.parentPath, envFile.name);
    const envFileDesPath = path.join(desPath, envFile.name);

    return {
      sourcePath: envFileSrcPath,
      desPath: envFileDesPath,
    };
  }

  private async __installTypescript(params: __InstallTypescriptParams) {
    const executeInstallBasedOnPm =
      params.selectedPackageManager === 'npm'
        ? 'npm'
        : params.selectedPackageManager === 'pnpm'
          ? 'pnpm'
          : 'bun';

    for (const p of TYPESCRIPT_DEFAULT_DEPENDENCIES[params.projectType][
      params.selectedFramework
    ]) {
      params.spinner.start(`Start installing ${chalk.bold(p)} package.`);

      if (params.selectedPackageManager === 'npm') {
        await execa(executeInstallBasedOnPm, ['install', '-D', p], {
          cwd: params.desPath,
          timeout: INSTALL_TIMEOUT_MS,
          killSignal: 'SIGTERM',
          stdio: 'pipe',
        });
      } else {
        await execa(executeInstallBasedOnPm, ['add', '-D', p], {
          cwd: params.desPath,
          timeout: INSTALL_TIMEOUT_MS,
          killSignal: 'SIGTERM',
          stdio: 'pipe',
        });
      }

      params.spinner.succeed(`Installing ${chalk.bold(p)} package succeed.`);
    }
  }

  private async __installDependencies(params: __InstallDependenciesParams) {
    const executeInstallBasedOnPm =
      params.selectedPackageManager === 'npm'
        ? 'npm'
        : params.selectedPackageManager === 'pnpm'
          ? 'pnpm'
          : 'bun';

    params.spinner.start(
      `Installing ${chalk.bold(params.selectedDependencies.join(', '))}, please wait for a moment.`,
    );

    for (const p of params.selectedDependencies) {
      params.spinner.start(`Start installing ${chalk.bold(p)} dependency`);

      await execa(executeInstallBasedOnPm, ['install', '--save', p], {
        cwd: params.desPath,
        timeout: INSTALL_TIMEOUT_MS,
        killSignal: 'SIGTERM',
        stdio: 'pipe',
      });

      params.spinner.succeed(`Installing ${chalk.bold(p)} dependency succeed`);
    }

    const isPrettierSelected = params.selectedDependencies.includes('prettier');
    const isEsLintSelected = params.selectedDependencies.includes('eslint');

    if (isPrettierSelected) {
      const prettierTemplatesPath = path.join(
        __basePath,
        'templates/addons/config',
      );
      __pathNotFound(prettierTemplatesPath);

      const dockerTemplates = fse.readdirSync(prettierTemplatesPath, {
        withFileTypes: true,
      });

      const prettierFile = dockerTemplates.find(
        (f) => f.name === '.prettierrc',
      );

      if (!prettierFile) {
        throw new UnidentifiedTemplateError(
          `${chalk.bold('Unidentified template')}: ${chalk.bold('.prettierrc')} file template is not defined.`,
        );
      }

      const prettierFileSrcPath = path.join(
        prettierFile.parentPath,
        prettierFile.name,
      );
      const prettierFileDesPath = path.join(params.desPath, prettierFile.name);

      params.spinner.start(`Initializing ${chalk.bold('.prettierrc')} file.`);

      await fse.copy(prettierFileSrcPath, prettierFileDesPath);

      params.spinner.succeed(
        `Adding ${chalk.bold('.prettierrc')} configuration completed.`,
      );
    }

    if (isEsLintSelected) {
      const executeInstallBasedOnPm = {
        npm: 'npx',
        pnpm: 'pnpx',
        bun: 'bunx',
      }[params.selectedPackageManager];

      const initializeEsLintQuestion = await inquirer.prompt({
        name: 'addESLintConfig',
        type: 'confirm',
        message: `Do you want us to execute ${chalk.bold(
          `${executeInstallBasedOnPm} eslint --init`,
        )} in your project? (optional)`,
        default: false,
      });

      if (!initializeEsLintQuestion.addESLintConfig) {
        console.warn(
          boxen(
            `You can execute ${chalk.bold(`${executeInstallBasedOnPm} eslint --init`)} later.`,
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

      await execa(`${executeInstallBasedOnPm}`, ['@eslint/create-config'], {
        cwd: params.desPath,
        stdio: 'inherit',
      });
    }

    params.spinner.succeed(`Installing all dependencies succeed.`);
  }

  private async __updateDependencies(params: __UpdateDependenciesParams) {
    const updateDependenciesQuestion = await inquirer.prompt({
      name: 'updatePackages',
      type: 'confirm',
      message: `Do you want us to run ${chalk.bold(`${params.selectedPackageManager} update`)}? (optional)`,
      default: false,
    });

    if (!updateDependenciesQuestion.updatePackages) {
      console.warn(
        boxen('You can update the dependencies later.', {
          title: 'Warning Information',
          titleAlignment: 'center',
          padding: 1,
          margin: 1,
          borderColor: 'yellow',
        }),
      );
    }

    params.spinner.start(
      `Updating ${chalk.bold(
        params.projectName,
      )} dependencies, please wait for a moment.`,
    );

    await execa(`${params.selectedPackageManager}`, ['update'], {
      cwd: params.desPath,
    });

    params.spinner.succeed(
      `Updating ${chalk.bold(params.projectName)} dependencies succeed.`,
    );
  }

  private async __updatePackageMetadata(params: __UpdatePackageMetadataParams) {
    params.spinner.start(
      `Updating ${chalk.bold(
        params.projectName,
      )} package metadata, please wait for a moment.`,
    );

    const packageJsonFilePath = path.join(params.desPath, 'package.json');
    const packageJsonFile = await fse.readJSON(packageJsonFilePath);
    packageJsonFile.author = params.optionValues.author;
    packageJsonFile.description = params.optionValues.description;
    packageJsonFile.version = params.optionValues.version;

    await fse.writeJSON(packageJsonFilePath, packageJsonFile, { spaces: 2 });

    params.spinner.succeed(
      `Updating ${chalk.bold(params.projectName)} package metadata succeed.`,
    );
  }

  private async __checkCacheReady(
    cacheBasePath: string,
    cacheTtlMs: number,
  ): Promise<void> {
    await fse.ensureDir(cacheBasePath);
    await this.__clearCache(cacheBasePath, cacheTtlMs);
  }

  private async __clearCache(
    cacheBasePath: string,
    cacheTtlMs: number,
  ): Promise<void> {
    const isPathExist = await fse.pathExists(cacheBasePath);

    if (!isPathExist) {
      await fse.ensureDir(cacheBasePath);
    }

    const types = await fse.readdir(cacheBasePath);
    const now = Date.now();

    for (const type of types) {
      const typeDir = path.join(cacheBasePath, type);
      const statType = await fse.stat(typeDir).catch(() => null);

      if (!statType || !statType.isDirectory()) continue;

      const entries = await fse.readdir(typeDir);

      for (const name of entries) {
        const entryPath = path.join(typeDir, name);

        try {
          const statEntry = await fse.stat(entryPath);
          const age = now - statEntry.birthtimeMs;

          if (age > cacheTtlMs) {
            await fse.remove(entryPath);
          }
        } catch (error: Mixed) {
          continue;
        }
      }
    }
  }

  private async __storeCachedProject(
    cacheBasePath: string,
    cacheTtlMs: number,
    projectType: string,
    srcPath: string,
    nameBase: string,
  ): Promise<string> {
    await this.__checkCacheReady(cacheBasePath, cacheTtlMs);

    const typeDir = path.join(cacheBasePath, projectType);
    await fse.ensureDir(typeDir);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeBase = nameBase.replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
    const cacheFolderName = `${safeBase}-${timestamp}`;
    const desPath = path.join(typeDir, cacheFolderName);

    await fse.copy(srcPath, desPath);
    return desPath;
  }

  public async __getListCachedProjects(
    cacheBasePath: string,
    projectType: string,
  ): Promise<CachedEntry[]> {
    const isPathExist = await fse.pathExists(cacheBasePath);

    if (!isPathExist) {
      await fse.ensureDir(cacheBasePath);
    }

    if (!projectType) return [];

    const typeDir = path.join(cacheBasePath, projectType);
    await fse.ensureDir(typeDir);

    const names = await fse.readdir(typeDir);
    const result = await Promise.all(
      names.map(async (name) => {
        if (!name) return null;

        const projectPath = path.join(typeDir, name);

        try {
          const stat = await fse.stat(projectPath);

          return {
            name: name,
            path: projectPath,
            createdMs: stat.birthtimeMs,
          } as CachedEntry;
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
      }),
    );

    return result.filter((x): x is CachedEntry => x !== null);
  }

  public async __loadCachedProject(
    cacheBasePath: string,
    cacheName: string,
    projectType: string,
    desPath: string,
  ): Promise<void> {
    const entryPath = path.join(cacheBasePath, projectType, cacheName);

    await fse.ensureDir(entryPath).catch((error: Mixed) => {
      console.error(
        boxen(error.message, {
          title: error.name,
          titleAlignment: 'center',
          padding: 1,
          margin: 1,
          borderColor: 'red',
        }),
      );

      process.exit(0);
    });

    await fse.copy(entryPath, desPath);
  }
}
