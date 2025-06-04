import { Command } from "commander";
import path from "path";
import { fileURLToPath } from "url";

type __FrameworkProps = {
  name: string;
  templateName: string;
  origin: string;
};

type __FullStackFrameworkProps = {
  name: string;
  templateName: string;
  detail: {
    backend: {
      name: string;
      templateName: string;
      origin: string;
    };
    frontend: {
      name: string;
      templateName: string;
      origin: string;
    };
  };
};

type __DefaultFrameworkProps = {
  uid: string;
  frameworks: __FrameworkProps[];
  rootPath: string;
  type: string;
};

type __DefaultFullStackFrameworkProps = {
  uid: string;
  frameworks: __FullStackFrameworkProps[];
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
      origin: "Javascript",
    },
    {
      name: "NestJS",
      templateName: "nest-project",
      origin: "Javascript",
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
      origin: "Javascript",
    },
    {
      name: "Vue.js",
      templateName: "vue-project",
      origin: "Javascript",
    },
  ],
  rootPath: "src/templates/frontend",
  type: "frontend",
};

export const _defaultFullStackFrameworks: __DefaultFullStackFrameworkProps = {
  uid: "t8qp82chmqdgoiy7me4h5hyi",
  frameworks: [
    {
      name: "Next.js + NestJS",
      templateName: "next-nest-project",
      detail: {
        backend: {
          name: "NestJS",
          templateName: "nest-backend",
          origin: "Javascript",
        },
        frontend: {
          name: "Next.js",
          templateName: "next-frontend",
          origin: "Javascript",
        },
      },
    },
    {
      name: "Vue.js + NestJS",
      templateName: "vue-nest-project",
      detail: {
        backend: {
          name: "NestJS",
          templateName: "nest-backend",
          origin: "Javascript",
        },
        frontend: {
          name: "Vue.js",
          templateName: "vue-frontend",
          origin: "Javascript",
        },
      },
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
