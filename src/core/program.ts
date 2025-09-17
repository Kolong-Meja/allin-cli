import { __config, program } from '@/config.js';
import { __generateTextAscii, __gradientColor } from '@/utils/ascii.js';
import chalk from 'chalk';
import { CreateCommand } from './commands/create.js';

export async function generateProgram(): Promise<void> {
  program.name(__config.appName.toLowerCase()).description(__config.appDesc);

  program.option(
    '-v, --version',
    `Action to get information about the current version of ${__gradientColor(
      'Allin CLI',
    )} tool.`,
    () => {
      __generateTextAscii();
      process.exit(0);
    },
  );

  program
    .command('create')
    .argument(
      '[name]',
      'Specify the project name to use for the initial setup.',
    )
    .argument('[directory]', 'Target directory for the project.')
    .argument('[type]', 'Type of project to be executed.')
    .option(
      '-n, --name <name>',
      'Specify the project name to use for the initial setup.',
    )
    .option(
      '-d, --dir <dir>',
      'Destination folder where the generated project will be created. Defaults to the current working directory.',
    )
    .option(
      '-f, --force',
      'Overwrite the target directory if it already exists.',
      false,
    )
    .option(
      '--au, --author <author>',
      'Set the author name to include in the project metadata.',
    )
    .option(
      '--desc, --description <desc>',
      'Provide a short description for the project.',
    )
    .option('--ver, --version <version>', 'Set the version of the project.')
    .option(
      '--template <template>',
      'Select the template to use for the project.',
    )
    .option(
      '--pm, --package-manager <pm>',
      'Choose the package manager for dependency installation.',
      'npm',
    )
    .option('--li, --license <license>', 'Add a LICENSE file to the project.')
    .option('--readme', 'Add a README file to the project.', false)
    .option(
      '--ts, --typescript',
      'Initialize the project with TypeScript configuration and typings.',
      false,
    )
    .option(
      '--dk, --docker',
      'Include Docker configuration files for containerized setup.',
      false,
    )
    .option('--env', 'Generate .env file for project configuration.', false)
    .option(
      '--git',
      'Automatically initialize a Git repository and make the first commit.',
      false,
    )
    .helpOption(
      '-h, --help',
      `Action to get more information about ${chalk.bold('create')} command.`,
    )
    .summary('Action to create new project.')
    .description('Create new project.')
    .action(async (name, directory, type, options) => {
      const command = CreateCommand.instance;
      command.create(name, directory, type, options);
    });

  program.helpOption(
    '-h, --help',
    `Action to get more information about ${__gradientColor('Allin CLI')}.`,
  );

  program.helpCommand(
    'help [command]',
    `Action to get more information about ${__gradientColor(
      'Allin CLI',
    )} commands.`,
  );

  program.parse();
}
