import { Command } from 'commander';
import dotenv from 'dotenv';
import { execa } from 'execa';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import fse from 'fs-extra';

export const program = new Command();

export const __userRealName = async () => {
  const __userPlatformName = os.userInfo().username;

  const { stdout, exitCode } = await execa(
    'git',
    ['config', '--global', 'user.name'],
    {
      reject: false,
    },
  );

  return exitCode === 0 ? stdout.trim() : __userPlatformName;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const __basePath = path.resolve(__dirname, '..');

export const CACHE_BASE_PATH = path.join(__basePath, '.cache');
export const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const INSTALL_TIMEOUT_MS = 1000 * 60 * 5;

dotenv.config({ path: path.join(__basePath, '.env') });

const __packageJsonFilePath = path.join(__basePath, 'package.json');
const __packageJsonFile = await fse.readJSON(__packageJsonFilePath);

export const __config = (() => {
  return {
    get appName() {
      return process.env.APP_NAME
        ? process.env.APP_NAME
        : __packageJsonFile.name;
    },
    get appDesc() {
      return process.env.APP_DESC
        ? process.env.APP_DESC
        : __packageJsonFile.description;
    },
    get creatorName() {
      return process.env.APP_CREATOR
        ? process.env.APP_CREATOR
        : 'Faisal Ramadhan';
    },
    get appVersion() {
      return process.env.APP_VERSION
        ? process.env.APP_VERSION
        : __packageJsonFile.version;
    },
    get appLicense() {
      return process.env.APP_LICENSE
        ? process.env.APP_LICENSE
        : `${__packageJsonFile.license} License`;
    },
    get githubLink() {
      return process.env.APP_GITHUB_LINK
        ? process.env.APP_GITHUB_LINK
        : __packageJsonFile.homepage;
    },
    get npmLink() {
      return process.env.APP_NPM_LINK
        ? process.env.APP_NPM_LINK
        : 'https://www.npmjs.com/package/@faisalrmdhn08/allin-cli';
    },
    get nodeJsVersion() {
      return process.version;
    },
    get osPlatform() {
      return `${os.platform}-${os.arch}`;
    },
  };
})();
