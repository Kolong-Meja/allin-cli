import {
  BASE_PATH,
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
import { errorBox, warnBox } from '@/utils/info-box.js';
import chalk from 'chalk';
import { execa, type Options } from 'execa';
import fse from 'fs-extra';
import inquirer from 'inquirer';
import type { Ora } from 'ora';
import path from 'path';

export class MicroGenerator implements MicroGeneratorBuilder {
  static #instance?: MicroGenerator;

  #templateCache = new Map<string, string[]>();

  private constructor() {}

  public static get instance(): MicroGenerator {
    if (!MicroGenerator.#instance) {
      MicroGenerator.#instance ??= new MicroGenerator();
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
      BASE_PATH,
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
        errorBox(error);
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

  // --------------------------------------------------------------------------
  // CACHE / LISTING
  // --------------------------------------------------------------------------
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
          errorBox(error);
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
      errorBox(error);
      process.exit(0);
    });

    await fse.copy(entryPath, desPath);
  }

  // --------------------------------------------------------------------------
  // DOCKER / BAKE
  // --------------------------------------------------------------------------
  private async __addDocker(params: __AddDockerParams) {
    const dockerComposePaths = this.__getDockerPaths(
      'compose.yml',
      params.desPath,
    );

    await this.__copyWithSpinner(
      params.spinner,
      'docker compose file',
      dockerComposePaths.sourcePath,
      dockerComposePaths.desPath,
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

    await this.__copyWithSpinner(
      params.spinner,
      'dockerfile',
      dockerFilePaths.sourcePath,
      dockerFilePaths.desPath,
    );
  }

  private async __addDockerBake(params: __AddDockerBakeParams) {
    const composePaths = this.__getDockerPaths('compose.yml', params.desPath);

    await this.__copyWithSpinner(
      params.spinner,
      'docker compose file',
      composePaths.sourcePath,
      composePaths.desPath,
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

    await this.__copyWithSpinner(
      params.spinner,
      'dockerfile',
      dockerFilePaths.sourcePath,
      dockerFilePaths.desPath,
    );

    const dockerBakePaths = this.__getDockerPaths(
      'docker-bake.hcl',
      params.desPath,
    );

    await this.__copyWithSpinner(
      params.spinner,
      'docker bake file',
      dockerBakePaths.sourcePath,
      dockerBakePaths.desPath,
    );
  }

  // --------------------------------------------------------------------------
  // GIT / LICENSE / README / ENV
  // --------------------------------------------------------------------------
  private async __addGit(spinner: Ora, desPath: string) {
    const initializeGitQuestion = await inquirer.prompt({
      name: 'addGit',
      type: 'confirm',
      message: `Do you want us to run git init?`,
      default: false,
    });

    if (!initializeGitQuestion.addGit) {
      warnBox(
        'Warning Information',
        `You can run ${chalk.bold('git init')} later.`,
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

    const licenseSrcPath = path.join(BASE_PATH, licenseFile.path);

    await fse.copy(licenseSrcPath, params.desPath);

    params.spinner.succeed(
      `Adding ${chalk.bold(
        licenseFile.actualName,
      )} file on ${chalk.bold(params.projectName)} succeed.`,
    );
  }

  private async __addReadme(params: __AddReadmeParams) {
    const backendReadme = this.__getReadmePaths(
      'BACKEND_README.md',
      params.desPath,
    );
    const frontendReadme = this.__getReadmePaths(
      'FRONTEND_README.md',
      params.desPath,
    );

    const readmeSourcePath =
      params.projectType !== 'backend'
        ? frontendReadme.sourcePath
        : backendReadme.sourcePath;

    const readmeTargetPath = path.join(params.desPath, 'README.md');

    await this.__copyWithSpinner(
      params.spinner,
      'readme',
      readmeSourcePath,
      readmeTargetPath,
    );
  }

  private async __addEnv(params: __AddEnvParams) {
    const backendEnvPaths = this.__getEnvPaths('.env.backend', params.desPath);
    const frontendEnvPaths = this.__getEnvPaths(
      '.env.frontend',
      params.desPath,
    );

    const envSourcePath =
      params.projectType !== 'backend'
        ? frontendEnvPaths.sourcePath
        : backendEnvPaths.sourcePath;

    const envTargetPath = path.join(params.desPath, '.env');

    await this.__copyWithSpinner(
      params.spinner,
      '.env',
      envSourcePath,
      envTargetPath,
    );
  }

  // --------------------------------------------------------------------------
  // PACKAGE MANAGER / TYPESCRIPT
  // --------------------------------------------------------------------------
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

    const executeChangingPmCommand = this.__choosePackageManagerCommand(
      params.selectedPackageManager,
      true,
    );

    await this.executePackageManager(executeChangingPmCommand, ['install'], {
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

    const frameworkPath = path.join(BASE_PATH, frameworkFile.path);

    const frameworkFiles = fse.readdirSync(frameworkPath, {
      withFileTypes: true,
    });

    const tsConfigFile = frameworkFiles.find((f) => f.name === 'tsconfig.json');

    if (!isUndefined(tsConfigFile)) {
      warnBox(
        'Warning Information',
        `${chalk.bold('tsconfig.json')} is exist on ${chalk.bold(params.projectName)}, means that ${chalk.bold('Typescript')} already installed.`,
      );
    }

    await this.__installTypescript({
      spinner: params.spinner,
      projectType: params.projectType,
      selectedFramework: params.selectedframework,
      selectedPackageManager: params.selectedPackageManager,
      desPath: params.desPath,
    });

    const executeConditioningPmCommand = this.__choosePackageManagerCommand(
      params.selectedPackageManager,
      false,
    );

    const initializeTsQuestion = await inquirer.prompt({
      name: 'addTsConfig',
      type: 'confirm',
      message: `Do you want us to execute
        ${executeConditioningPmCommand} tsc --init in your project? (optional)`,
      default: false,
    });

    if (!initializeTsQuestion.addTsConfig) {
      warnBox(
        'Warning Information',
        `You can initialize ${chalk.bold('Typescript')} later.`,
      );
    }

    params.spinner.start(
      `Initializing ${chalk.bold('Typescript')} into ${chalk.bold(params.projectName)}, please wait for a moment.`,
    );

    await this.executePackageManager(
      executeConditioningPmCommand,
      ['tsc', '--init'],
      {
        cwd: params.desPath,
      },
    );

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

  // --------------------------------------------------------------------------
  // INSTALLATIONS / CONFIGS
  // --------------------------------------------------------------------------
  private async __installTypescript(params: __InstallTypescriptParams) {
    const executeInstallBasedOnPm = this.__choosePackageManagerCommand(
      params.selectedPackageManager,
      true,
    );
    const deps =
      TYPESCRIPT_DEFAULT_DEPENDENCIES[params.projectType][
        params.selectedFramework
      ] ?? [];

    for (const p of deps) {
      params.spinner.start(`Start installing ${chalk.bold(p)} package.`);

      if (params.selectedPackageManager === 'npm') {
        await this.executePackageManager(
          executeInstallBasedOnPm,
          ['install', '-D', p],
          {
            cwd: params.desPath,
            timeout: INSTALL_TIMEOUT_MS,
            killSignal: 'SIGTERM',
            stdio: 'pipe',
          },
        );
      } else {
        await this.executePackageManager(
          executeInstallBasedOnPm,
          ['add', '-D', p],
          {
            cwd: params.desPath,
            timeout: INSTALL_TIMEOUT_MS,
            killSignal: 'SIGTERM',
            stdio: 'pipe',
          },
        );
      }

      params.spinner.succeed(`Installing ${chalk.bold(p)} package succeed.`);
    }
  }

  private async __installDependencies(params: __InstallDependenciesParams) {
    const executeInstallBasedOnPm = this.__choosePackageManagerCommand(
      params.selectedPackageManager,
      true,
    );

    params.spinner.start(
      `Installing ${chalk.bold(params.selectedDependencies.join(', '))}, please wait for a moment.`,
    );

    await this.executePackageManager(
      executeInstallBasedOnPm,
      ['install', '--save', ...params.selectedDependencies],
      {
        cwd: params.desPath,
        timeout: INSTALL_TIMEOUT_MS,
        killSignal: 'SIGTERM',
        stdio: 'pipe',
      },
    );

    const isPrettierSelected = params.selectedDependencies.includes('prettier');
    const isEsLintSelected = params.selectedDependencies.includes('eslint');
    const isWinstonSelected = params.selectedDependencies.includes('winston');

    if (isPrettierSelected) {
      await this.__installPrettier(params);
    }

    if (isEsLintSelected) {
      await this.__installEsLint(params);
    }

    if (isWinstonSelected) {
      await this.__installWinston(params);
    }

    params.spinner.succeed(`Installing all dependencies succeed.`);
  }

  private async __installPrettier(params: __InstallDependenciesParams) {
    const prettierTemplatesPath = path.join(
      BASE_PATH,
      'templates/addons/config',
    );
    const { sourcePath } = this.__findTemplate(
      prettierTemplatesPath,
      '.prettierrc',
    );
    const prettierFileDesPath = path.join(params.desPath, '.prettierrc');

    params.spinner.start(`Initializing ${chalk.bold('.prettierrc')} file.`);

    await fse.copy(sourcePath, prettierFileDesPath);

    params.spinner.succeed(
      `Adding ${chalk.bold('.prettierrc')} configuration completed.`,
    );
  }

  private async __installEsLint(params: __InstallDependenciesParams) {
    const executeInstallBasedOnPm = this.__choosePackageManagerCommand(
      params.selectedPackageManager,
      false,
    );

    const initializeEsLintQuestion = await inquirer.prompt({
      name: 'addESLintConfig',
      type: 'confirm',
      message: `Do you want us to execute ${`${executeInstallBasedOnPm}`} eslint --init in your project? (optional)`,
      default: false,
    });

    if (!initializeEsLintQuestion.addESLintConfig) {
      warnBox(
        'Warning Information',
        `You can execute ${chalk.bold(`${executeInstallBasedOnPm} eslint --init`)} later.`,
      );
    }

    await execa(`${executeInstallBasedOnPm}`, ['@eslint/create-config'], {
      cwd: params.desPath,
      stdio: 'inherit',
    });
  }

  private async __installWinston(params: __InstallDependenciesParams) {
    params.spinner.start('Configuring Winston logger...');

    const isUsingTypeScript = fse.existsSync(
      path.join(params.desPath, 'tsconfig.json'),
    );

    const snipperSrcPath = path.join(
      BASE_PATH,
      'templates',
      'addons',
      'config',
      'winston',
      isUsingTypeScript ? 'logger.ts' : 'logger.js',
    );

    const projectSrcDir = path.join(params.desPath, 'src');
    const loggerTargetFile = path.join(
      projectSrcDir,
      isUsingTypeScript ? 'logger.ts' : 'logger.js',
    );

    fse.ensureDirSync(projectSrcDir);

    // READ SNIPPET.
    let fileContent = fse.readFileSync(snipperSrcPath, 'utf-8');

    // REMOVE LEADING "//" EACH LINE
    const uncommented = fileContent
      .split('\n')
      .map((line) => line.replace(/^\/\/\s?/, ''))
      .join('\n');

    fse.writeFileSync(loggerTargetFile, uncommented, 'utf-8');

    params.spinner.succeed('Winston successfully configured!');
  }

  private async __updateDependencies(params: __UpdateDependenciesParams) {
    const updateDependenciesQuestion = await inquirer.prompt({
      name: 'updatePackages',
      type: 'confirm',
      message: `Do you want us to run ${params.selectedPackageManager} update? (optional)`,
      default: false,
    });

    if (!updateDependenciesQuestion.updatePackages) {
      warnBox('Warning Information', 'You can update the dependencies later.');
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

  // ------------------------------------------------------------------------
  // CACHE HELPERS
  // ------------------------------------------------------------------------
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

  private __findTemplate(basePath: string, filename: string) {
    __pathNotFound(basePath);

    const names = this.readDirCached(basePath);
    const found = names.find((name) => name === filename);

    if (!found) {
      throw new UnidentifiedTemplateError(
        `${chalk.bold('Unidentified template')}: ${chalk.bold(
          filename,
        )} file template is not defined.`,
      );
    }

    return {
      sourcePath: path.join(basePath, found),
      name: found,
    };
  }

  private async __copyWithSpinner(
    spinner: Ora,
    label: string,
    sourcePath: string,
    targetPath: string,
  ) {
    spinner.start(
      `Copying ${chalk.bold(label)} into ${chalk.bold(targetPath)}...`,
    );
    await fse.copy(sourcePath, targetPath);
    spinner.succeed(`Copying ${chalk.bold(label)} succeed.`);
  }

  private __choosePackageManagerCommand(
    packageManager: string,
    forInstall: boolean = true,
  ): readonly [string, string[]] {
    if (forInstall) {
      return packageManager === 'npm'
        ? (['npm', []] as const)
        : packageManager === 'pnpm'
          ? (['pnpm', []] as const)
          : (['bun', []] as const);
    }

    return packageManager === 'npm'
      ? (['npx', []] as const)
      : packageManager === 'pnpm'
        ? (['pnpm', ['dlx']] as const)
        : (['bunx', []] as const);
  }

  // ------------------------------------------------------------------------
  // TEMPLATE PATH GETTERS
  // ------------------------------------------------------------------------
  private __getDockerPaths(filename: string, desPath: string) {
    const dockerTemplatesPath = path.join(BASE_PATH, 'templates/addons/docker');
    const { sourcePath } = this.__findTemplate(dockerTemplatesPath, filename);

    return {
      sourcePath,
      desPath: path.join(desPath, filename),
    };
  }

  private __getReadmePaths(filename: string, desPath: string) {
    const readmeTemplatesPath = path.join(BASE_PATH, 'templates/addons/others');
    const { sourcePath } = this.__findTemplate(readmeTemplatesPath, filename);

    return {
      sourcePath,
      desPath: path.join(desPath, filename),
    };
  }

  private __getEnvPaths(filename: string, desPath: string) {
    const envTemplatesPath = path.join(BASE_PATH, 'templates/addons/config');
    const { sourcePath } = this.__findTemplate(envTemplatesPath, filename);

    return {
      sourcePath,
      desPath: path.join(desPath, filename),
    };
  }

  // ------------------------------------------------------------------------
  // MICRO HELPERS
  // ------------------------------------------------------------------------
  private readDirCached(dir: string): string[] {
    const cached = this.#templateCache.get(dir);

    if (cached) return cached;

    const entries = fse.readdirSync(dir);
    this.#templateCache.set(dir, entries);

    return entries;
  }

  private executePackageManager(
    command: readonly [string, string[]],
    args: string[],
    options: Options,
  ) {
    const [cmd, prefixArgs] = command;
    return execa(cmd, [...prefixArgs, ...args], options);
  }
}
