import { Command } from "commander";
import path from "path";
import { fileURLToPath } from "url";

type __FrameworkProps = {
  name: string;
  templateName: string;
};

type __DefaultFrameworkProps = {
  uid: string;
  frameworks: __FrameworkProps[];
  rootPath: string;
  type: string;
};

export const _defaultProjectTypes: string[] = [
  "backend",
  "frontend",
  "fullstack",
];

export const _defaultBackendFrameworks: __DefaultFrameworkProps = {
  uid: "us6h8to3ts87d8na3vifzfuo",
  frameworks: [
    {
      name: "Express.js",
      templateName: "express-project",
    },
    {
      name: "NestJS",
      templateName: "nest-project",
    },
  ],
  rootPath: "src/templates/backend",
  type: "backend",
};

export const _defaultFrontendFrameworks: __DefaultFrameworkProps = {
  uid: "t8qp82chmqdgoiy7me4h5hyi",
  frameworks: [
    {
      name: "Next.js",
      templateName: "next-project",
    },
    {
      name: "Vue.js",
      templateName: "vue-project",
    },
  ],
  rootPath: "src/templates/frontend",
  type: "frontend",
};

export const _defaultFullStackFrameworks: __DefaultFrameworkProps = {
  uid: "t8qp82chmqdgoiy7me4h5hyi",
  frameworks: [
    {
      name: "Next.js + NestJS",
      templateName: "next-nest-project",
    },
    {
      name: "Vue.js + NestJS",
      templateName: "vue-nest-project",
    },
  ],
  rootPath: "src/templates/fullstack",
  type: "fullstack",
};

export const _program = new Command();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const _basePath = path.resolve(__dirname, "..", "..");

export const _currentVersion = "1.0.0";
