import { Command } from "commander";
import path from "path";
import { fileURLToPath } from "url";

export const _program = new Command();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const _basePath = path.resolve(__dirname, "..");
export const _currentVersion = "1.0.0";
