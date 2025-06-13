import { Command } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import os from 'os';
import { execa } from 'execa';

export const _program = new Command();

export const __username = os.userInfo().username;
const { stdout } = await execa('git', ['config', '--global', 'user.name']);
export const __userrealname = stdout;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const _basePath = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(_basePath, '.env') });

export const _appName = process.env.APP_NAME ? process.env.APP_NAME : 'Allin';
export const _appDesc = process.env.APP_DESC
  ? process.env.APP_DESC
  : 'A modern full-stack CLI tool based on Typescript designed to accelerate your app development process — setup your entire stack in one seamless command.';
export const _appCreator = process.env.APP_CREATOR
  ? process.env.APP_CREATOR
  : 'Faisal Ramadhan';
export const _appVersion = process.env.APP_VERSION
  ? process.env.APP_VERSION
  : '1.0.0';
export const _appLicense = process.env.APP_LICENSE
  ? process.env.APP_LICENSE
  : 'GNU General Public License version 3 (GPLv3)';
export const _appGithubLink = process.env.APP_GITHUB_LINK
  ? process.env.APP_GITHUB_LINK
  : 'https://github.com/Kolong-Meja/allin-cli';

export const __nodeJsVersion = process.version;
export const _os = `${os.platform}-${os.arch}`;
