import chalk from 'chalk';
import { __renewProjectName } from '@/utils/string.js';
import { __config, program } from '@/config.js';
import { __generateTextAscii, __gradientColor } from '@/utils/ascii.js';
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
    .option(
      '--backend <backend>',
      'Set default framework for backend project at first run.',
    )
    .option(
      '--frontend <frontend>',
      'Set default framework for frontend project at first run.',
    )
    .option(
      '-d, --dir <dir>',
      "Path destination directory to save the project template that you've created.",
      process.cwd(),
    )
    .option('--li, --license <license>', 'Add a LICENSE file.')
    .option(
      '--ts, --typescript',
      'Initialize project with TypeScript configuration.',
      false,
    )
    .option(
      '--dk, --docker',
      'Initialize project with docker configuration.',
      false,
    )
    .option('--git', 'Initialize git repo automatically.', false)
    .option(
      '--pm <pm>',
      'Choose or switching default package manager of the project.',
      'npm',
    )
    .helpOption(
      '-h, --help',
      `Action to get more information about ${chalk.bold('create')} command.`,
    )
    .summary('Action to create new project.')
    .description('Create new project on your own.')
    .action(async (options) => {
      const command = CreateCommand.instance;
      command.create(options);
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
