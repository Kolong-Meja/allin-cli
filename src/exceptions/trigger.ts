import fs from 'fs';
import {
  HarassmentWordsDetected,
  PathNotFoundError,
  ProjectNotExistError,
  UnableOverwriteError,
  UnidentifiedFrameworkError,
  UnidentifiedTemplateError,
} from './custom.js';
import chalk from 'chalk';

export function _pathNotFound(path: string): void {
  if (!fs.existsSync(path))
    throw new PathNotFoundError(
      `${chalk.bold('Path not found')}: ${chalk.bold(path)} path is not exist.`,
    );
  return;
}

export function _projectNotExist(
  template: string,
  model: 'backend' | 'frontend' | 'fullstack',
  projects: string[],
): void {
  if (!projects.includes(template)) {
    throw new ProjectNotExistError(
      `${chalk.bold(
        'Project not exist',
      )}: ${template} project is not exist for ${model} template.`,
    );
  }
  return;
}

export function _unableOverwrite(path: string): void {
  if (fs.existsSync(path))
    throw new UnableOverwriteError(
      `${chalk.bold('Unable to overwrite')}: ${chalk.bold(
        path,
      )} is exist and cannot be overwritten. \n\n${chalk.bold(
        'Tips',
      )}: \nUse ${chalk.bold('-f, --force')} option when doing ${chalk.bold(
        'create',
      )} command to force overwrite.`,
    );
  return;
}

export function _unidentifiedTemplate(
  template: string,
  templates: string[],
): void {
  if (!templates.includes(template)) {
    throw new UnidentifiedTemplateError(
      `${chalk.bold('Unidentified template model')}: ${chalk.bold(
        template,
      )} template model is not found.`,
    );
  }
  return;
}

export function _unidentifiedProject(
  project: string,
  projects: string[],
): void {
  if (!projects.includes(project)) {
    throw new UnidentifiedFrameworkError(
      `${chalk.bold('Unidentified framework project')}: ${chalk.bold(
        project,
      )} framework project is not found.`,
    );
  }
  return;
}

export function _harassmentWordsDetected(value: string, words: string[]): void {
  const _isContainDirtyWord = words.some((e) => value.includes(e));

  if (_isContainDirtyWord) {
    throw new HarassmentWordsDetected(
      `${chalk.bold('Harassment words detected')}: ${chalk.bold(
        value,
      )} is a harassment word.`,
    );
  }
}
