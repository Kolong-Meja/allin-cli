import figlet from "figlet";
import gradient from "gradient-string";
import { __PrintAsciiProps } from "@/types/default.js";
import { getBorderCharacters, table } from "table";
import {
  __nodeJsVersion,
  _appCreator,
  _appDesc,
  _appGithubLink,
  _appLicense,
  _appName,
  _appVersion,
  _os,
} from "../config.js";
import chalk from "chalk";

export const _allinGradient = gradient(["#3CB371", "#81E7AF", "#FFD63A"]);

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

  // METADATA.
  const __data = [[_version], [_creator], [_license], [_githubLink]];

  const __nodeVersion = `${_allinGradient("Node Version")}: ${__nodeJsVersion}`;
  const __currentOs = `${_allinGradient("Operating System")}: ${_os}`;

  // ENVIRONMENT.
  __data.push([__nodeVersion], [__currentOs]);

  console.log(
    table(__data, {
      border: getBorderCharacters("norc"),
      columnDefault: {
        width: 80,
      },
      singleLine: true,
      columns: [
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
