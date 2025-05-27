import { _basePath, _program } from "../constants/default.js";
import inquirer from "inquirer";
import { _selectedPrompts } from "./prompt.js";
import {
  _scanPath,
  _getProjects,
  _getProjectsByName,
  _generateUseOption,
  _generateCreateOption,
} from "../generated/files.js";
import { _printAscii } from "../utils/ascii.js";
import chalk from "chalk";

export async function runner() {
  _printAscii({
    name: "Allin",
    desc: `${chalk.bold(
      chalk.green("Full Stack CLI")
    )} that speeds up your development in one go.`,
  });

  _program
    .name("allin")
    .description(
      "A full stack CLI that speeds up your framework creation in one go."
    )
    .version("1.0.0");

  _program
    .command("create")
    .option(
      "-d, --dir <directory>",
      "destination directory to save the created project",
      process.cwd()
    )
    .option("-t, --template <template>", "desired template model")
    .helpOption("-h, --help", "get some information about create command")
    .summary("create new template")
    .description("create new template on your own")
    .action(async (options) => {
      const _answers = await inquirer.prompt(
        _selectedPrompts(options.template)
      );

      _generateCreateOption(_answers, options);
    });

  _program
    .command("list")
    .option(
      "-t, --template <template>",
      "show list of projects by template name"
    )
    .helpOption("-h, --help", "get some information about list command")
    .summary("show all templates")
    .description("showing all of available templates")
    .action((options) => {
      if (!options.template) {
        _getProjects("src/templates");
      } else {
        _getProjectsByName("src/templates", options.template);
      }
    });

  _program
    .command("use")
    .option("-t, --template <template>", "desired template model")
    .option("-p, --project <project>", "desired project model")
    .option(
      "-d, --dir <directory>",
      "destination directory to save the project used",
      process.cwd()
    )
    .helpOption("-h, --help", "get some information about use command")
    .summary("use selected template")
    .description(
      "Use selected template project as a project. [NOTE]: Please do allin list to see all of available templates"
    )
    .action((options) => {
      _generateUseOption(options);
    });

  _program.helpOption("-h, --help", "get some more information");
  _program.helpCommand("help [command]", "get some more information");

  _program.parse();
}
