import { __basePath, __userRealName } from '@/config.js';
import { __pathNotExist } from '@/exceptions/trigger.js';
import type {
  __AddDockerBakeParams,
  __AddDockerParams,
  __AddLicenseParams,
  __InstallDependenciesParams,
  __InstallTypescriptParams,
  __SetupDockerParams,
  __SetupInstallationParams,
  __SetupOthersParams,
  __SetupProjectParams,
  __SwitchPackageManagerParams,
  __UpdateDependenciesParams,
  __UseTypescriptParams,
} from '@/types/general.js';
import chalk from 'chalk';
import fse from 'fs-extra';
import fs from 'fs';
import path from 'path';
import { UnidentifiedTemplateError } from '@/exceptions/error.js';
import type { Ora } from 'ora';
import { execa } from 'execa';
import boxen from 'boxen';
import inquirer from 'inquirer';
import {
  BACKEND_FRAMEWORKS,
  FRONTEND_FRAMEWORKS,
  LICENSES,
} from '@/constants/default.js';
import { TYPESCRIPT_DEPENDENCIES } from '@/constants/packages/general.js';
import type { MicroGeneratorBuilder } from '@/interfaces/general.js';

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
    await fse.copy(params.sourcePath, params.desPath, {
      overwrite: true,
    });
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

    if (params.optionValues.pm && params.optionValues.pm !== '') {
      await this.__switchPackageManager({
        spinner: params.spinner,
        selectedPackageManager: params.optionValues.pm,
        projectName: params.projectName,
        desPath: params.desPath,
      });
    }

    if (params.optionValues.typescript) {
      await this.__useTypescript({
        spinner: params.spinner,
        projectType: params.projectType.toLowerCase(),
        projectName: params.projectName,
        selectedframework: params.selectedFramework,
        selectedPackageManager: params.optionValues.pm,
        desPath: params.desPath,
      });
    }

    await this.__addLicense({
      spinner: params.spinner,
      optionValues: params.optionValues,
      projectName: params.projectName,
      desPath: params.desPath,
    });
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

  private async __addDockerBake(params: __AddDockerBakeParams) {
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

  private async __addGit(spinner: Ora, desPath: string) {
    const __initializeGitQuestion = await inquirer.prompt({
      name: 'addGit',
      type: 'confirm',
      message: `Do you want us to run ${chalk.bold('git init')}? (optional)`,
      default: false,
    });

    if (!__initializeGitQuestion.addGit) {
      console.warn(
        boxen(
          chalk.white(
            `⚠️  ${chalk.bold(
              (await __userRealName()).split(' ')[0],
            )}, you can run ${chalk.bold('git init')} later.`,
          ),
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

  private async __addLicense(params: __AddLicenseParams) {
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
      type: 'list',
      message: 'Which license do you want to use:',
      choices: LICENSES.licenses
        .sort((i, e) =>
          i.name.toLowerCase().localeCompare(e.name.toLowerCase(), 'en-US'),
        )
        .map((l) => l.actualName),
      default: 'MIT License',
      loop: false,
      when: () => typeof params.optionValues.license === 'undefined',
    });

    const __licenseFile =
      typeof params.optionValues.license !== 'undefined'
        ? LICENSES.licenses.find((l) => l.name === params.optionValues.license)
        : LICENSES.licenses.find(
            (l) => l.actualName === __licenseSelection.license,
          );

    if (!__licenseFile) {
      throw new UnidentifiedTemplateError(
        `${chalk.bold('Unidentified template')}: ${chalk.bold(__licenseSelection.license)} file template is not defined.`,
      );
    }

    params.spinner.start(
      `Start adding ${chalk.bold(
        __licenseFile.actualName,
      )} file into ${chalk.bold(params.projectName)} 🧾...`,
    );

    const __licenseSourcePath = path.join(__basePath, __licenseFile.path);

    await fse.copy(__licenseSourcePath, params.desPath);

    params.spinner.succeed(
      `Adding ${chalk.bold(
        __licenseFile.actualName,
      )} file on ${chalk.bold(params.projectName)} succeed ✅`,
    );
  }

  private async __switchPackageManager(params: __SwitchPackageManagerParams) {
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

  private async __useTypescript(params: __UseTypescriptParams) {
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
          chalk.white(
            `⚠️  ${chalk.bold('tsconfig.json')} is exist on ${chalk.bold(params.projectName)}, means that ${chalk.bold('Typescript')} already installed.`,
          ),
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

    await this.__installTypescript({
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
          chalk.white(
            `⚠️  ${chalk.bold(
              (await __userRealName()).split(' ')[0],
            )}, you can initialize ${chalk.bold('Typescript')} later.`,
          ),
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

  private async __installTypescript(params: __InstallTypescriptParams) {
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

  private async __installDependencies(params: __InstallDependenciesParams) {
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
            chalk.white(
              `⚠️  ${chalk.bold(
                (await __userRealName()).split(' ')[0],
              )}, you can execute ${chalk.bold(`${__executeCommand} eslint --init`)} later.`,
            ),
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

  private async __updateDependencies(params: __UpdateDependenciesParams) {
    const __updateDependenciesQuestion = await inquirer.prompt({
      name: 'updatePackages',
      type: 'confirm',
      message: `Do you want us to run ${chalk.bold(`${params.selectedPackageManager} update`)}? (optional)`,
      default: false,
    });

    if (!__updateDependenciesQuestion.updatePackages) {
      console.warn(
        boxen(
          chalk.white(
            `⚠️  ${chalk.bold(
              (await __userRealName()).split(' ')[0],
            )}, you can update the dependencies later.`,
          ),
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
}
