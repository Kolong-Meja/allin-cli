#!/usr/bin/env node
import { Command } from "commander";
import figlet from "figlet";

import { prompts } from "./core/prompt";
import picocolors from "picocolors";
import inquirer from "inquirer";

async function executable() {
  const command = new Command();

  console.log(figlet.textSync("Allin"));
  console.log(
    picocolors.italic(
      "Full Stack CLI that speeds up your development in one go."
    )
  );
  console.log("\n");

  command
    .name("Allin CLI")
    .version("1.0.0")
    .description(
      "A full stack CLI that speeds up your framework creation in one go."
    );
  command.parse();

  const answers = await inquirer.prompt(prompts);
  console.log(answers);
}

function main() {
  executable();
}

main();
