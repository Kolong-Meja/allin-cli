import { Command } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import os from 'os';
import { execa } from 'execa';

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

dotenv.config({ path: path.join(__basePath, '.env') });

export const __config = (() => {
  return {
    get appName() {
      return process.env.APP_NAME ? process.env.APP_NAME : 'Allin';
    },
    get appDesc() {
      return process.env.APP_DESC
        ? process.env.APP_DESC
        : 'A modern full-stack CLI tool based on Typescript designed to accelerate your app development process — setup your entire stack in one seamless command.';
    },
    get creatorName() {
      return process.env.APP_CREATOR
        ? process.env.APP_CREATOR
        : 'Faisal Ramadhan';
    },
    get appVersion() {
      return process.env.APP_VERSION ? process.env.APP_VERSION : '1.0.13';
    },
    get appLicense() {
      return process.env.APP_LICENSE ? process.env.APP_LICENSE : 'MIT License';
    },
    get githubLink() {
      return process.env.APP_GITHUB_LINK
        ? process.env.APP_GITHUB_LINK
        : 'https://github.com/Kolong-Meja/allin-cli';
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
