import { UnnamedDistinctQuestion } from "inquirer/dist/commonjs/types";
import {
  DEFAULT_BACKEND_FRAMEWORKS,
  DEFAULT_FRONTEND_FRAMEWORKS,
  DEFAULT_FULL_STACK_FRAMEWORKS,
  DEFAULT_PROJECT_TYPES,
} from "../constants/default";
import { PromptAnswers } from "@/types/prompt";

export const prompts: (UnnamedDistinctQuestion<PromptAnswers & object> & {
  name: string;
})[] = [
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
    choices: DEFAULT_PROJECT_TYPES,
    default: "Full Stack",
  },
  {
    name: "chooseBackendFramework",
    type: "select",
    message: "Choose backend framework:",
    choices: DEFAULT_BACKEND_FRAMEWORKS,
    default: "NestJS",
    when: (q) => q.projectType === "Backend",
  },
  {
    name: "chooseFrontendFramework",
    type: "select",
    message: "Choose frontend framework:",
    choices: DEFAULT_FRONTEND_FRAMEWORKS,
    default: "Next.js",
    when: (q) => q.projectType === "Frontend",
  },
  {
    name: "chooseFullStackFramework",
    type: "select",
    message: "Choose full stack framework:",
    choices: DEFAULT_FULL_STACK_FRAMEWORKS,
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
];
