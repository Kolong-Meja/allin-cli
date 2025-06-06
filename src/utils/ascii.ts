import figlet from "figlet";
import gradient from "gradient-string";
import { __PrintAsciiProps } from "../types/default.js";
import { table } from "table";
import {
  _appCreator,
  _appDesc,
  _appGithubLink,
  _appLicense,
  _appName,
  _appVersion,
} from "../config.js";
import chalk from "chalk";

export const _allinGradient = gradient(["#B771E5", "#81E7AF", "#FF9100"]);

export const _printAscii = (): void => {
  const _ascii = `${_allinGradient(figlet.textSync(_appName, "3D-ASCII"))}`;
  const _desc = `${chalk.bold(chalk.italic(_appDesc))}`;

  const _header = `${_ascii}\n${_desc}\n`;

  const _version = `${_allinGradient("Allin CLI Tool")}: v${_appVersion}`;
  const _creator = `${_allinGradient("Allin Creator")}: ${_appCreator}`;
  const _license = `${_allinGradient("Allin License")}: ${_appLicense}`;
  const _githubLink = `${_allinGradient(
    "Allin Github Link"
  )}: ${_appGithubLink}`;

  const __data = [[_version], [_creator], [_license], [_githubLink]];

  console.log(
    table(__data, {
      singleLine: true,
      columnDefault: {
        width: 80,
      },
      columns: [
        {
          alignment: "left",
        },
        {
          alignment: "left",
        },
        {
          alignment: "left",
        },
        {
          alignment: "left",
        },
      ],
      header: {
        alignment: "center",
        content: _header,
      },
    })
  );
};
