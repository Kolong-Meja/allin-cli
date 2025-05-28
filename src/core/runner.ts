import {
  _basePath,
  _currentVersion,
  _defaultBackendFrameworks,
  _defaultFrontendFrameworks,
  _defaultFullStackFrameworks,
  _defaultProjectTypes,
  _program,
} from "../constants/default.js";
import inquirer from "inquirer";
import { _generateCreatePrompts, _generateUsePrompts } from "./prompt.js";
import {
  _generateCreateCommand,
  _generateListCommand,
  _generateUseCommand,
  _getProjects,
  _getProjectsByName,
} from "../generated/files.js";
import { _printAscii } from "../utils/ascii.js";
import chalk from "chalk";

export async function runner() {
  _printAscii({
    name: "Allin",
    desc: `${chalk.bold(
      `${chalk.green(
        "Full Stack CLI"
      )} that speeds up your development in one go.`
    )}`,
  });

  _program
    .name("allin")
    .description(
      "A full stack CLI that speeds up your framework creation in one go."
    );

  _program.option(
    "-v, --version",
    "Action to get information about the current version of this tool.",
    () => {
      console.log(`${chalk.bold("Allin CLI Tool")}: v${_currentVersion}`);
      process.exit(0);
    }
  );

  _program
    .command("create")
    .option(
      "-d, --dir <directory>",
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
    .summary("Create new project template.")
    .description("Create new project template by yourself.")
    .action(async (options) => {
      const _answers = await inquirer.prompt(_generateCreatePrompts(options));

      _generateCreateCommand(_answers, options);
    });

  _program
    .command("list")
    .option(
      "-t, --template <template>",
      "Show all of projects that existed by template model that you've insert."
    )
    .option("-a, --all", "Show all project templates that existed.", false)
    .helpOption(
      "-h, --help",
      `Action to get more information about ${chalk.bold("list")} command.`
    )
    .summary("Show all project templates.")
    .description("Showing all of available project templates.")
    .action(async (options) => {
      _generateListCommand(options);
    });

  _program
    .command("use")
    .option(
      "-d, --dir <directory>",
      "Path destination directory to save the project template that you've choose.",
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
    .summary("Using an existing project template.")
    .description("Using an existing project template as your project.")
    .action(async (options) => {
      const _answers = await inquirer.prompt(
        _generateUsePrompts(options.template)
      );

      _generateUseCommand(_answers, options);
    });

  _program.helpOption(
    "-h, --help",
    `Action to get more information about ${chalk.bold("Allin CLI")}.`
  );
  _program.helpCommand(
    "help [command]",
    `Action to get more information about ${chalk.bold("Allin CLI")} commands.`
  );

  _program.parse();
}
