import {
  __DefaultFrameworkProps,
  __DefaultFullStackFrameworkProps,
} from "../types/default.js";

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
    {
      name: "Laravel",
      templateName: "laravel-project",
      origin: "PHP",
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
    {
      name: "Svelte",
      templateName: "svelte-project",
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
    {
      name: "Vue.js + Laravel",
      templateName: "vue-laravel-project",
      detail: {
        backend: {
          name: "Laravel",
          templateName: "laravel-project",
          origin: "PHP",
        },
        frontend: {
          name: "Vue.js",
          templateName: "vue-project",
          origin: "Javascript",
        },
      },
    },
  ],
  rootPath: "src/templates/fullstack",
  type: "fullstack",
};
