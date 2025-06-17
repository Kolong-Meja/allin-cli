import {
  _backendFrameworks,
  _frontendFrameworks,
  _projectTypes,
} from '@/constants/index.js';
import type { __QuestionPrompsProps } from '@/types/index.js';
import { __renewStringsIntoTitleCase } from '@/utils/string.js';

import type { UnnamedDistinctQuestion } from 'node_modules/inquirer/dist/esm/types.js';

export function _createCommandQuestionPrompt(
  template: string,
): (UnnamedDistinctQuestion<__QuestionPrompsProps & object> & {
  name: string;
})[] {
  switch (template) {
    case 'backend':
      return [
        {
          name: 'projectName',
          type: 'input',
          message: 'Enter your project name:',
          default: 'my-project',
        },
        {
          name: 'chooseBackendFramework',
          type: 'select',
          message: 'Choose backend framework you want to use:',
          choices: _backendFrameworks.frameworks.map((f) => f.name),
          default: 'NestJS',
          when: () => template === 'backend',
        },
        {
          name: 'addDocker',
          type: 'confirm',
          message: 'Do you want to add Docker?',
          default: false,
        },
        {
          name: 'addDockerBake',
          type: 'confirm',
          message:
            'Do you want to add Docker Bake for building process of docker images?',
          default: false,
          when: (q) => q.addDocker !== false,
        },
      ];
    case 'frontend':
      return [
        {
          name: 'projectName',
          type: 'input',
          message: 'Enter your project name:',
          default: 'my-project',
        },
        {
          name: 'chooseFrontendFramework',
          type: 'select',
          message: 'Choose frontend framework you want to use:',
          choices: _frontendFrameworks.frameworks.map((f) => f.name),
          default: 'Next.js',
          when: () => template === 'frontend',
        },
        {
          name: 'addDocker',
          type: 'confirm',
          message: 'Do you want to add Docker?',
          default: false,
        },
        {
          name: 'addDockerBake',
          type: 'confirm',
          message:
            'Do you want to add Docker Bake for building process of docker images?',
          default: false,
          when: (q) => q.addDocker !== false,
        },
      ];
    default:
      return [
        {
          name: 'projectName',
          type: 'input',
          message: 'Enter your project name:',
          default: 'my-project',
        },
        {
          name: 'projectType',
          type: 'select',
          message: 'Choose your project type:',
          choices: _projectTypes,
          default: 'backend',
        },
        {
          name: 'chooseBackendFramework',
          type: 'select',
          message: 'Choose backend framework you want to use:',
          choices: _backendFrameworks.frameworks.map((f) => f.name),
          default: 'NestJS',
          when: (q) => q.projectType === 'backend',
        },
        {
          name: 'chooseFrontendFramework',
          type: 'select',
          message: 'Choose frontend framework you want to use:',
          choices: _frontendFrameworks.frameworks.map((f) => f.name),
          default: 'Next.js',
          when: (q) => q.projectType === 'frontend',
        },
        {
          name: 'addDocker',
          type: 'confirm',
          message: 'Do you want to add Docker?',
          default: false,
        },
        {
          name: 'addDockerBake',
          type: 'confirm',
          message:
            'Do you want to add Docker Bake for building process of docker images?',
          default: false,
          when: (q) => q.addDocker !== false,
        },
      ];
  }
}
