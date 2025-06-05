import { Command } from "commander";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

export const _program = new Command();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const _basePath = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(_basePath, ".env") });

export const _appCreator = process.env.APP_CREATOR
  ? process.env.APP_CREATOR
  : "Faisal Ramadhan";
export const _appVersion = process.env.APP_VERSION
  ? process.env.APP_VERSION
  : "1.0.0";
export const _appLicense = process.env.APP_LICENSE
  ? process.env.APP_LICENSE
  : "GNU General Public License version 3 (GPLv3)";
