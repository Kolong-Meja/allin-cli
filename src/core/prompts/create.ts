import {
  _backendFrameworks,
  _frontendFrameworks,
  _fullstackFrameworks,
  _projectTypes,
} from "../../constants/default.js";
import { __QuestionPrompsProps } from "../../types/default.js";

import { UnnamedDistinctQuestion } from "node_modules/inquirer/dist/esm/types.js";

export function _createCommandQuestionPrompt(
  template: string
): (UnnamedDistinctQuestion<__QuestionPrompsProps & object> & {
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
          message: "Choose backend framework you want to use:",
          choices: _backendFrameworks.frameworks.filter((f) => f.name),
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
      ] as (UnnamedDistinctQuestion<__QuestionPrompsProps & object> & {
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
          message: "Choose frontend framework you want to use:",
          choices: _frontendFrameworks.frameworks.filter((f) => f.name),
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
      ] as (UnnamedDistinctQuestion<__QuestionPrompsProps & object> & {
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
          message: "Choose full stack framework you want to use:",
          choices: _fullstackFrameworks.frameworks.filter((f) => f.name),
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
      ] as (UnnamedDistinctQuestion<__QuestionPrompsProps & object> & {
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
          choices: _projectTypes,
          default: "backend",
        },
        {
          name: "chooseBackendFramework",
          type: "select",
          message: "Choose backend framework you want to use:",
          choices: _backendFrameworks.frameworks.filter((f) => f.name),
          default: "NestJS",
          when: (q) => q.projectType === "backend",
        },
        {
          name: "chooseFrontendFramework",
          type: "select",
          message: "Choose frontend framework you want to use:",
          choices: _frontendFrameworks.frameworks.filter((f) => f.name),
          default: "Next.js",
          when: (q) => q.projectType === "frontend",
        },
        {
          name: "chooseFullStackFramework",
          type: "select",
          message: "Choose full stack framework you want to use:",
          choices: _fullstackFrameworks.frameworks.filter((f) => f.name),
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
      ] as (UnnamedDistinctQuestion<__QuestionPrompsProps & object> & {
        name: string;
      })[];
  }
}
