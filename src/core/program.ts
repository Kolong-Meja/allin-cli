import { _allinGradient, _printAscii } from '@/utils/ascii.js';
import chalk from 'chalk';
import {
  _appCreator,
  _appDesc,
  _appLicense,
  _appName,
  _appVersion,
  _program,
} from '@/config.js';
import { _newCreateCommand } from './commands/create.js';
import { __renewProjectName } from '@/utils/string.js';

export async function _generateProgram(): Promise<void> {
  _program.name(_appName.toLowerCase()).description(_appDesc);

  _program.option(
    '-v, --version',
    `Action to get information about the current version of ${_allinGradient(
      'Allin CLI',
    )} tool.`,
    () => {
      _printAscii();
      process.exit(0);
    },
  );

  _program
    .command('create')
    .option(
      '-d, --dir <dir>',
      "Path destination directory to save the project template that you've created.",
      process.cwd(),
    )
    .option(
      '-g, --git',
      'Initialize git repo automatically (default: false).',
      false,
    )
    .option('-l, --license', 'Add a LICENSE file (default: false).', false)
    .option(
      '--ts',
      'Initialize project with TypeScript configuration (default: false).',
      false,
    )
    .helpOption(
      '-h, --help',
      `Action to get more information about ${chalk.bold('use')} command.`,
    )
    .summary('Action to create new project.')
    .description('Create new project on your own.')
    .action(async (options) => {
      _newCreateCommand(options);
    });

  _program.helpOption(
    '-h, --help',
    `Action to get more information about ${_allinGradient('Allin CLI')}.`,
  );
  _program.helpCommand(
    'help [command]',
    `Action to get more information about ${_allinGradient(
      'Allin CLI',
    )} commands.`,
  );

  _program.parse();
}
