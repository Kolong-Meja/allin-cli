import { PathNotFoundError } from "../exceptions/custom.js";
import {
  _defaultBackendFrameworks,
  _defaultFrontendFrameworks,
  _defaultFullStackFrameworks,
  _defaultProjectTypes,
} from "../constants/default.js";
import fs from "fs";
import path from "path";
import { _renewalProjectName, _titleCase } from "../utils/string.js";
import chalk from "chalk";
import { table } from "table";
import { _isPathExist } from "../exceptions/trigger.js";
import { _basePath } from "../config.js";

export async function _getProjectTemplates(targetPath: string): Promise<void> {
  try {
    const _dirPath = path.join(_basePath, targetPath);
    _isPathExist(_dirPath);

    const _files = fs.readdirSync(_dirPath, {
      withFileTypes: true,
    });
    const _mainFolders = _files.filter((v) => v.isDirectory());

    for (const f of _mainFolders) {
      switch (f.name) {
        case "backend":
          let _backendFrameworksData = [
            [
              `${chalk.bold("No.")}`,
              `${chalk.bold("Template")}`,
              `${chalk.bold("Framework")}`,
              `${chalk.bold("Origin")}`,
            ],
          ];

          for (const [i, v] of _defaultBackendFrameworks.frameworks.entries()) {
            _backendFrameworksData.push([
              `${i + 1}`,
              v.templateName,
              v.name,
              v.origin,
            ]);
          }

          console.log(
            table(_backendFrameworksData, {
              columnDefault: {
                width: 20,
              },
              columns: [
                { alignment: "center", width: 5 },
                { alignment: "center", width: 25 },
                { alignment: "center" },
                { alignment: "center" },
              ],
              header: {
                alignment: "center",
                content: `Available ${_titleCase(f.name)} Projects`,
              },
            })
          );

          break;
        case "frontend":
          let _frontendFrameworksData = [
            [
              `${chalk.bold("No.")}`,
              `${chalk.bold("Template")}`,
              `${chalk.bold("Framework")}`,
              `${chalk.bold("Origin")}`,
            ],
          ];

          for (const [
            i,
            v,
          ] of _defaultFrontendFrameworks.frameworks.entries()) {
            _frontendFrameworksData.push([
              `${i + 1}`,
              v.templateName,
              v.name,
              v.origin,
            ]);
          }

          console.log(
            table(_frontendFrameworksData, {
              columnDefault: {
                width: 20,
              },
              columns: [
                { alignment: "center", width: 5 },
                { alignment: "center", width: 25 },
                { alignment: "center" },
                { alignment: "center" },
              ],
              header: {
                alignment: "center",
                content: `Available ${_titleCase(f.name)} Projects`,
              },
            })
          );
          break;
        case "fullstack":
          let _fullstackFrameworksData = [
            [
              `${chalk.bold("No.")}`,
              `${chalk.bold("Template")}`,
              `${chalk.bold("Framework")}`,
              `${chalk.bold("Origin")}`,
            ],
          ];

          for (const [
            i,
            v,
          ] of _defaultFullStackFrameworks.frameworks.entries()) {
            _fullstackFrameworksData.push([
              `${i + 1}`,
              v.templateName,
              v.name,
              `${v.detail.backend.origin + ", " + v.detail.frontend.origin}`,
            ]);
          }

          console.log(
            table(_fullstackFrameworksData, {
              columnDefault: {
                width: 20,
              },
              columns: [
                { alignment: "center", width: 5 },
                { alignment: "center", width: 25 },
                { alignment: "center", width: 25 },
                { alignment: "center", width: 30 },
              ],
              header: {
                alignment: "center",
                content: `Available ${_titleCase(f.name)} Projects`,
              },
            })
          );
          break;
      }
    }
  } catch (error: any) {
    let errorMessage =
      error instanceof Error ? error.message : "⛔️ An unknown error occurred.";

    if (error instanceof PathNotFoundError) {
      errorMessage = error.message;
    }

    console.error(errorMessage);
  }
}

export function _getProjectTemplatesByName(
  targetPath: string,
  template: string
): void {
  try {
    const _dirPath = path.join(_basePath, targetPath, template);
    _isPathExist(_dirPath);

    switch (template) {
      case "backend":
        let _backendFrameworksData = [
          [
            `${chalk.bold("No.")}`,
            `${chalk.bold("Template")}`,
            `${chalk.bold("Framework")}`,
            `${chalk.bold("Origin")}`,
          ],
        ];

        for (const [i, v] of _defaultBackendFrameworks.frameworks.entries()) {
          _backendFrameworksData.push([
            `${i + 1}`,
            v.templateName,
            v.name,
            v.origin,
          ]);
        }

        console.log(
          table(_backendFrameworksData, {
            columnDefault: {
              width: 20,
            },
            columns: [
              { alignment: "center", width: 5 },
              { alignment: "center", width: 25 },
              { alignment: "center" },
              { alignment: "center" },
            ],
            header: {
              alignment: "center",
              content: `Available ${_titleCase(template)} Projects`,
            },
          })
        );
        break;
      case "frontend":
        let _frontendFrameworksData = [
          [
            `${chalk.bold("No.")}`,
            `${chalk.bold("Template")}`,
            `${chalk.bold("Framework")}`,
            `${chalk.bold("Origin")}`,
          ],
        ];

        for (const [i, v] of _defaultFrontendFrameworks.frameworks.entries()) {
          _frontendFrameworksData.push([
            `${i + 1}`,
            v.templateName,
            v.name,
            v.origin,
          ]);
        }

        console.log(
          table(_frontendFrameworksData, {
            columnDefault: {
              width: 20,
            },
            columns: [
              { alignment: "center", width: 5 },
              { alignment: "center", width: 25 },
              { alignment: "center" },
              { alignment: "center" },
            ],
            header: {
              alignment: "center",
              content: `Available ${_titleCase(template)} Projects`,
            },
          })
        );
        break;
      case "fullstack":
        let _fullstackFrameworksData = [
          [
            `${chalk.bold("No.")}`,
            `${chalk.bold("Template")}`,
            `${chalk.bold("Framework")}`,
            `${chalk.bold("Origin")}`,
          ],
        ];

        for (const [i, v] of _defaultFullStackFrameworks.frameworks.entries()) {
          _fullstackFrameworksData.push([
            `${i + 1}`,
            v.templateName,
            v.name,
            `${v.detail.backend.origin + ", " + v.detail.frontend.origin}`,
          ]);
        }

        console.log(
          table(_fullstackFrameworksData, {
            columnDefault: {
              width: 20,
            },
            columns: [
              { alignment: "center", width: 5 },
              { alignment: "center", width: 25 },
              { alignment: "center", width: 25 },
              { alignment: "center", width: 30 },
            ],
            header: {
              alignment: "center",
              content: `Available ${_titleCase(template)} Projects`,
            },
          })
        );
        break;
    }
  } catch (error: unknown) {
    let errorMessage =
      error instanceof Error ? error.message : "⛔️ An unknown error occurred.";

    if (error instanceof PathNotFoundError) {
      errorMessage = error.message;
    }

    console.error(errorMessage);
  }
}
