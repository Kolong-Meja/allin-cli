import { OptionValues } from "commander";
import {
  _defaultBackendFrameworks,
  _defaultFrontendFrameworks,
  _defaultFullStackFrameworks,
  _defaultProjectTypes,
} from "../constants/default.js";
import { UnnamedDistinctQuestion } from "node_modules/inquirer/dist/esm/types.js";

type _PromptAnswersProps = {
  projectName: string;
  projectType: string;
  chooseBackendFramework: string;
  chooseFrontendFramework: string;
  chooseFullStackFramework: string;
  addDocker: boolean;
  addDockerBake: boolean;
  addTests: boolean;
};

export function _generateCreatePrompts(
  template: string
): (UnnamedDistinctQuestion<_PromptAnswersProps & object> & {
  name: string;
})[] {
  switch (template) {
    case "backend":
      return [
        {
          name: "projectName",
          type: "input",
          message: "Enter your project name:",
          default: "my-project",
        },
        {
          name: "chooseBackendFramework",
          type: "select",
          message: "Choose backend framework:",
          choices: _defaultBackendFrameworks.frameworks.filter((f) => f.name),
          default: "NestJS",
          when: () => template === "backend",
        },
        {
          name: "addDocker",
          type: "confirm",
          message: "Do you want to add Docker?",
          default: false,
        },
        {
          name: "addDockerBake",
          type: "confirm",
          message:
            "Do you want to add Docker Bake for building process of docker images?",
          default: false,
          when: (q) => q.addDocker !== false,
        },
        {
          name: "addTests",
          type: "confirm",
          message: "Do you want to add Unit & End-to-end tests?",
          default: false,
        },
      ] as (UnnamedDistinctQuestion<_PromptAnswersProps & object> & {
        name: string;
      })[];
    case "frontend":
      return [
        {
          name: "projectName",
          type: "input",
          message: "Enter your project name:",
          default: "my-project",
        },
        {
          name: "chooseFrontendFramework",
          type: "select",
          message: "Choose frontend framework:",
          choices: _defaultFrontendFrameworks.frameworks.filter((f) => f.name),
          default: "Next.js",
          when: () => template === "frontend",
        },
        {
          name: "addDocker",
          type: "confirm",
          message: "Do you want to add Docker?",
          default: false,
        },
        {
          name: "addDockerBake",
          type: "confirm",
          message:
            "Do you want to add Docker Bake for building process of docker images?",
          default: false,
          when: (q) => q.addDocker !== false,
        },
        {
          name: "addTests",
          type: "confirm",
          message: "Do you want to add Unit & End-to-end tests?",
          default: false,
        },
      ] as (UnnamedDistinctQuestion<_PromptAnswersProps & object> & {
        name: string;
      })[];
    case "fullstack":
      return [
        {
          name: "projectName",
          type: "input",
          message: "Enter your project name:",
          default: "my-project",
        },
        {
          name: "chooseFullStackFramework",
          type: "select",
          message: "Choose full stack framework:",
          choices: _defaultFullStackFrameworks.frameworks.filter((f) => f.name),
          default: "Next.js + NestJS",
          when: () => template === "fullstack",
        },
        {
          name: "addDocker",
          type: "confirm",
          message: "Do you want to add Docker?",
          default: false,
        },
        {
          name: "addDockerBake",
          type: "confirm",
          message:
            "Do you want to add Docker Bake for building process of docker images?",
          default: false,
          when: (q) => q.addDocker !== false,
        },
        {
          name: "addTests",
          type: "confirm",
          message: "Do you want to add Unit & End-to-end tests?",
          default: false,
        },
      ] as (UnnamedDistinctQuestion<_PromptAnswersProps & object> & {
        name: string;
      })[];
    default:
      return [
        {
          name: "projectName",
          type: "input",
          message: "Enter your project name:",
          default: "my-project",
        },
        {
          name: "projectType",
          type: "select",
          message: "Choose your project type:",
          choices: _defaultProjectTypes,
          default: "backend",
        },
        {
          name: "chooseBackendFramework",
          type: "select",
          message: "Choose backend framework:",
          choices: _defaultBackendFrameworks.frameworks.filter((f) => f.name),
          default: "NestJS",
          when: (q) => q.projectType === "backend",
        },
        {
          name: "chooseFrontendFramework",
          type: "select",
          message: "Choose frontend framework:",
          choices: _defaultFrontendFrameworks.frameworks.filter((f) => f.name),
          default: "Next.js",
          when: (q) => q.projectType === "frontend",
        },
        {
          name: "chooseFullStackFramework",
          type: "select",
          message: "Choose full stack framework:",
          choices: _defaultFullStackFrameworks.frameworks.filter((f) => f.name),
          default: "Next.js + NestJS",
          when: (q) => q.projectType === "fullstack",
        },
        {
          name: "addDocker",
          type: "confirm",
          message: "Do you want to add Docker?",
          default: false,
        },
        {
          name: "addDockerBake",
          type: "confirm",
          message:
            "Do you want to add Docker Bake for building process of docker images?",
          default: false,
          when: (q) => q.addDocker !== false,
        },
        {
          name: "addTests",
          type: "confirm",
          message: "Do you want to add Unit & End-to-end tests?",
          default: false,
        },
      ] as (UnnamedDistinctQuestion<_PromptAnswersProps & object> & {
        name: string;
      })[];
  }
}

export function _generateUsePrompts(template: string): (UnnamedDistinctQuestion<
  _PromptAnswersProps & object
> & {
  name: string;
})[] {
  switch (template) {
    case "backend":
      return [
        {
          name: "chooseBackendFramework",
          type: "select",
          message: "Choose backend framework:",
          choices: _defaultBackendFrameworks.frameworks.filter((f) => f.name),
          default: "NestJS",
        },
      ] as unknown as (UnnamedDistinctQuestion<_PromptAnswersProps & object> & {
        name: string;
      })[];
    case "frontend":
      return [
        {
          name: "chooseFrontendFramework",
          type: "select",
          message: "Choose frontend framework:",
          choices: _defaultFrontendFrameworks.frameworks.filter((f) => f.name),
          default: "Next.js",
        },
      ] as unknown as (UnnamedDistinctQuestion<_PromptAnswersProps & object> & {
        name: string;
      })[];
    case "fullstack":
      return [
        {
          name: "chooseFullStackFramework",
          type: "select",
          message: "Choose full stack framework:",
          choices: _defaultFullStackFrameworks.frameworks.filter((f) => f.name),
          default: "Next.js + NestJS",
        },
      ] as unknown as (UnnamedDistinctQuestion<_PromptAnswersProps & object> & {
        name: string;
      })[];
    default:
      return [
        {
          name: "projectType",
          type: "select",
          message: "Choose your project type:",
          choices: _defaultProjectTypes,
          default: "backend",
        },
        {
          name: "chooseBackendFramework",
          type: "select",
          message: "Choose backend framework:",
          choices: _defaultBackendFrameworks.frameworks.filter((f) => f.name),
          default: "NestJS",
          when: (q) => q.projectType === "backend",
        },
        {
          name: "chooseFrontendFramework",
          type: "select",
          message: "Choose frontend framework:",
          choices: _defaultFrontendFrameworks.frameworks.filter((f) => f.name),
          default: "Next.js",
          when: (q) => q.projectType === "frontend",
        },
        {
          name: "chooseFullStackFramework",
          type: "select",
          message: "Choose full stack framework:",
          choices: _defaultFullStackFrameworks.frameworks.filter((f) => f.name),
          default: "Next.js + NestJS",
          when: (q) => q.projectType === "fullstack",
        },
      ] as (UnnamedDistinctQuestion<_PromptAnswersProps & object> & {
        name: string;
      })[];
  }
}
