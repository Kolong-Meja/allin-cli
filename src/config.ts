import { Command } from 'commander';
import dotenv from 'dotenv';
import { execa } from 'execa';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import fse from 'fs-extra';

export const program = new Command();

export const __getUserRealName = async (): Promise<string> => {
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

export const BASE_PATH = path.resolve(__dirname, '..');
export const CACHE_BASE_PATH = path.join(BASE_PATH, '.cache');

export const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const INSTALL_TIMEOUT_MS = 1000 * 60 * 5; // 5 minutes;

// LOAD ENV
dotenv.config({ path: path.join(BASE_PATH, '.env') });

// LOAD PACKAGE.JSON
const __packageJsonFilePath = path.join(BASE_PATH, 'package.json');
const __packageJsonFile = await fse.readJSON(__packageJsonFilePath);

const __envOr = (key: string, fallback: string): string => {
  return process.env[key] ?? fallback;
};

export const __config = (() => {
  return {
    get appName() {
      return __envOr('APP_NAME', __packageJsonFile.name);
    },
    get appDesc() {
      return __envOr('APP_DESC', __packageJsonFile.description);
    },
    get creatorName() {
      return __envOr('APP_CREATOR', 'Faisal Ramadhan');
    },
    get appVersion() {
      return __envOr('APP_VERSION', __packageJsonFile.version);
    },
    get appLicense() {
      return __envOr('APP_LICENSE', `${__packageJsonFile.license} License`);
    },
    get githubLink() {
      return __envOr('APP_GITHUB_LINK', __packageJsonFile.homepage);
    },
    get npmLink() {
      return __envOr(
        'APP_NPM_LINK',
        'https://www.npmjs.com/package/@faisalrmdhn08/allin-cli',
      );
    },
    get nodeJsVersion() {
      return process.version;
    },
    get osPlatform() {
      return `${os.platform}-${os.arch}` as const;
    },
  };
})();
