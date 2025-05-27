import { Command } from "commander";

const _defaultProjectTypes: string[] = ["Backend", "Frontend", "Full Stack"];
const _defaultBackendFrameworks: string[] = ["NestJS", "Express.js"];
const _defaultFrontendFrameworks: string[] = ["Next.js", "Vue.js"];
const _defaultFullStackFrameworks: string[] = [
  "Vue.js + NestJS",
  "Sveltekit",
  "Next.js",
];
const _program = new Command();
const _basePath = process.cwd();

export {
  _defaultProjectTypes,
  _defaultBackendFrameworks,
  _defaultFrontendFrameworks,
  _defaultFullStackFrameworks,
  _program,
  _basePath,
};
