import chalk from 'chalk';
import type { OptionValues } from 'commander';
import fse from 'fs-extra';
import {
  PathNotFoundError,
  ProjectNotExistError,
  UnableOverwriteError,
  UnidentifiedFrameworkError,
  UnidentifiedTemplateError,
} from './error.js';

// CHECK MEMBERSHIP UTIL
const __ensureIncluded = (val: string, list: string[]) => list.includes(val);

export function __pathNotFound(path: string): void {
  if (!fse.existsSync(path)) {
    throw new PathNotFoundError(
      `${chalk.bold('Path not found')}: ${chalk.bold(path)} path does not exist.`,
    );
  }
}

export function __projectNotExist(
  template: string,
  model: 'backend' | 'frontend',
  projects: string[],
): void {
  if (!__ensureIncluded(template, projects)) {
    throw new ProjectNotExistError(
      `${chalk.bold('Project not exist')}: ${template} project is not available for ${model} template.`,
    );
  }
}

export function __unableOverwriteProject(
  path: string,
  optionValues: OptionValues,
): void {
  const exists = fse.existsSync(path);
  const force = optionValues.force === true;

  if (exists && !force) {
    throw new UnableOverwriteError(
      `${chalk.bold('Unable to overwrite')}: ${chalk.bold(
        path,
      )} already exists and cannot be overwritten.\n\n${chalk.bold(
        'Tips',
      )}:\nUse ${chalk.bold('-f, --force')} when running the ${chalk.bold(
        'create',
      )} command to allow overwriting.`,
    );
  }
}

export function __unidentifiedProjectTemplate(
  template: string,
  templates: string[],
): void {
  if (!__ensureIncluded(template, templates)) {
    throw new UnidentifiedTemplateError(
      `${chalk.bold('Unidentified template model')}: ${chalk.bold(
        template,
      )} template model is not recognized.`,
    );
  }
}

export function __unidentifiedFramework(
  project: string,
  projects: string[],
): void {
  if (!__ensureIncluded(project, projects)) {
    throw new UnidentifiedFrameworkError(
      `${chalk.bold('Unidentified framework project')}: ${chalk.bold(
        project,
      )} framework project is not recognized.`,
    );
  }
}
