import {
  _backendFrameworks,
  _frontendFrameworks,
  _fullstackFrameworks,
  _projectTypes,
} from "../../constants/default.js";
import { __QuestionPrompsProps } from "../../types/default.js";

import { UnnamedDistinctQuestion } from "node_modules/inquirer/dist/esm/types.js";

export function _updateCommandQuestionPrompt(
  template: string
): (UnnamedDistinctQuestion<__QuestionPrompsProps & object> & {
  name: string;
})[] {
  switch (template) {
    case "backend":
      return [
        {
          name: "chooseBackendFramework",
          type: "select",
          message: "Choose the backend project template you want to update:",
          choices: _backendFrameworks.frameworks.filter((f) => f.name),
          default: "NestJS",
        },
      ] as unknown as (UnnamedDistinctQuestion<
        __QuestionPrompsProps & object
      > & {
        name: string;
      })[];
    case "frontend":
      return [
        {
          name: "chooseFrontendFramework",
          type: "select",
          message: "Choose the frontend project template you want to update:",
          choices: _frontendFrameworks.frameworks.filter((f) => f.name),
          default: "Next.js",
        },
      ] as unknown as (UnnamedDistinctQuestion<
        __QuestionPrompsProps & object
      > & {
        name: string;
      })[];
    case "fullstack":
      return [
        {
          name: "chooseFullStackFramework",
          type: "select",
          message: "Choose the fullstack project template you want to update:",
          choices: _fullstackFrameworks.frameworks.filter((f) => f.name),
          default: "Next.js + NestJS",
        },
      ] as unknown as (UnnamedDistinctQuestion<
        __QuestionPrompsProps & object
      > & {
        name: string;
      })[];
    default:
      return [
        {
          name: "projectType",
          type: "select",
          message: "Choose project type you want to update:",
          choices: _projectTypes,
          default: "backend",
        },
        {
          name: "chooseBackendFramework",
          type: "select",
          message: "Choose the backend project template you want to update:",
          choices: _backendFrameworks.frameworks.filter((f) => f.name),
          default: "NestJS",
          when: (q) => q.projectType === "backend",
        },
        {
          name: "chooseFrontendFramework",
          type: "select",
          message: "Choose the frontend project template you want to update:",
          choices: _frontendFrameworks.frameworks.filter((f) => f.name),
          default: "Next.js",
          when: (q) => q.projectType === "frontend",
        },
        {
          name: "chooseFullStackFramework",
          type: "select",
          message: "Choose the fullstack project template you want to update:",
          choices: _fullstackFrameworks.frameworks.filter((f) => f.name),
          default: "Next.js + NestJS",
          when: (q) => q.projectType === "fullstack",
        },
      ] as (UnnamedDistinctQuestion<__QuestionPrompsProps & object> & {
        name: string;
      })[];
  }
}
