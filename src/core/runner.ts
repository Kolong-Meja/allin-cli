import { _allinGradient, _printAscii } from "../utils/ascii.js";
import chalk from "chalk";
import {
  _appCreator,
  _appDesc,
  _appLicense,
  _appName,
  _appVersion,
  _program,
} from "../config.js";
import { _createCommand } from "./commands/create.js";
import { _listCommand } from "./commands/list.js";
import { _updateCommand } from "./commands/update.js";
import { table } from "table";

export async function runner(): Promise<void> {
  _program.name(_appName.toLowerCase()).description(_appDesc);

  _program.option(
    "-v, --version",
    "Action to get information about the current version of this tool.",
    () => {
      _printAscii();
      process.exit(0);
    }
  );

  _program
    .command("create")
    .option(
      "-d, --dir <dir>",
      "Path destination directory to save the project template that you've created.",
      process.cwd()
    )
    .option(
      "-t, --template <template>",
      "Template model that you want to used."
    )
    .helpOption(
      "-h, --help",
      `Action to get more information about ${chalk.bold("use")} command.`
    )
    .summary("Create new project.")
    .description("Create new project on your own.")
    .action((options) => {
      _createCommand(options);
    });

  _program
    .command("list")
    .option(
      "-t, --template [template]",
      "Show all of templates by template model that you've insert."
    )
    .option("-a, --all", "Show all templates.", false)
    .helpOption(
      "-h, --help",
      `Action to get more information about ${chalk.bold("list")} command.`
    )
    .summary("Show all templates.")
    .description("Showing all of available templates.")
    .action((options) => {
      _listCommand(options);
    });

  _program
    .command("update")
    .option(
      "-t, --template <template>",
      "Template model that you want to update to the newest version."
    )
    .option("-a, --all", "Update all templates dependencies.", false)
    .helpOption(
      "-h, --help",
      `Action to get more information about ${chalk.bold("update")} command.`
    )
    .summary("Update templates dependencies.")
    .description(
      "Updating an available template dependencies version automatically."
    )
    .action(async (options) => {
      _updateCommand(options);
    });

  _program.helpOption(
    "-h, --help",
    `Action to get more information about ${_allinGradient("Allin CLI")}.`
  );
  _program.helpCommand(
    "help [command]",
    `Action to get more information about ${_allinGradient(
      "Allin CLI"
    )} commands.`
  );

  _program.parse();
}
