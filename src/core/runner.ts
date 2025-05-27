import { _basePath, _program } from "../constants/default";
import inquirer from "inquirer";
import { _selectedPrompts } from "./prompt";
import fs from "fs";
import path from "path";
import { _scanPath } from "../generated/files";
import { titleCase } from "../utils/string";
import { _printAscii } from "../utils/ascii";

export async function runner() {
  _printAscii({
    name: "Allin",
    desc: "Full Stack CLI that speeds up your development in one go.",
  });

  _program
    .name("allin")
    .description(
      "A full stack CLI that speeds up your framework creation in one go."
    )
    .version("1.0.0");

  _program
    .command("create")
    .option("-t, --template <template>", "desired template model", "backend")
    .helpOption("-h, --help", "get some information about create command")
    .summary("create new template")
    .description("Create new template")
    .action(async (options) => {
      const _answers = await inquirer.prompt(
        _selectedPrompts(options.template)
      );
      console.log(_answers);
    });

  _program
    .command("list")
    .option("-t, --template", "list projects by template name", "backend")
    .helpOption("-h, --help", "get some information about list command")
    .summary("show all templates")
    .description("Showing a list of available templates")
    .action(() => {
      const _targetPath = "src/templates";
      const _dirPath = path.join(_basePath, _targetPath);
      _scanPath(_dirPath);

      const _files = fs.readdirSync(_dirPath, {
        withFileTypes: true,
        recursive: false,
      });
      const _mainFolders = _files.filter((v) => v.isDirectory());

      console.group("Available Templates:");

      for (const f of _mainFolders) {
        console.groupCollapsed(`${titleCase(f.name)} Projects:`);

        const _targetSubPath = path.join(_dirPath, f.name);
        const _subFiles = fs.readdirSync(_targetSubPath, {
          withFileTypes: true,
          recursive: false,
        });
        const _mainSubFolders = _subFiles.filter((w) => w.isDirectory());

        for (const g of _mainSubFolders) {
          console.log(g.name, "\n");
        }

        console.groupEnd();
      }

      console.groupEnd();
    });

  _program
    .command("use")
    .helpOption("-h, --help", "get some information about use command")
    .summary("use selected template")
    .argument("<template>", "Selected templates")
    .argument("<project>", "Selected project")
    .description("Use selected template project as a project")
    .action((t, p) => {
      console.log(t, p);
    });

  _program.helpOption("-h, --help", "get some more information");
  _program.helpCommand("help [command]", "get some more information");

  _program.parse();
}
