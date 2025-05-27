import { UnnamedDistinctQuestion } from "inquirer/dist/commonjs/types";
import { PrintAsciiProps, PromptAnswersProps } from "../types/general";
import {
  _defaultBackendFrameworks,
  _defaultFrontendFrameworks,
  _defaultFullStackFrameworks,
  _defaultProjectTypes,
} from "../constants/default";
import figlet from "figlet";
import picocolors from "picocolors";

export function _selectedPrompts(
  selectedTemplate: string
): (UnnamedDistinctQuestion<PromptAnswersProps & object> & {
  name: string;
})[] {
  switch (selectedTemplate) {
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
          choices: _defaultBackendFrameworks,
          default: "NestJS",
          when: () => selectedTemplate === "backend",
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
      ] as (UnnamedDistinctQuestion<PromptAnswersProps & object> & {
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
          choices: _defaultFrontendFrameworks,
          default: "Next.js",
          when: () => selectedTemplate === "frontend",
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
      ] as (UnnamedDistinctQuestion<PromptAnswersProps & object> & {
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
          choices: _defaultFullStackFrameworks,
          default: "Next.js + NestJS",
          when: () => selectedTemplate === "fullstack",
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
      ] as (UnnamedDistinctQuestion<PromptAnswersProps & object> & {
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
          default: "Backend",
        },
        {
          name: "chooseBackendFramework",
          type: "select",
          message: "Choose backend framework:",
          choices: _defaultBackendFrameworks,
          default: "NestJS",
          when: (q) => q.projectType === "Backend",
        },
        {
          name: "chooseFrontendFramework",
          type: "select",
          message: "Choose frontend framework:",
          choices: _defaultFrontendFrameworks,
          default: "Next.js",
          when: (q) => q.projectType === "Frontend",
        },
        {
          name: "chooseFullStackFramework",
          type: "select",
          message: "Choose full stack framework:",
          choices: _defaultFullStackFrameworks,
          default: "Next.js + NestJS",
          when: (q) => q.projectType === "Full Stack",
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
      ] as (UnnamedDistinctQuestion<PromptAnswersProps & object> & {
        name: string;
      })[];
  }
}
