# Allin CLI

![NPM VERSION](https://img.shields.io/npm/v/@faisalrmdhn08/allin-cli?style=flat-square)
![NPM DOWNLOADS](https://img.shields.io/npm/dm/@faisalrmdhn08/allin-cli?style=flat-square)
![LICENSE](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

A modern, full-stack CLI tool built with TypeScript that scaffolds your entire stack—backend, frontend or both—in one seamless command.

### Supported Platforms: 

![OS](https://img.shields.io/badge/mac%20os-000000?style=for-the-badge&logo=apple&logoColor=white) ![OS](  https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black) ![OS](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)

### Supported Templates :
![Express](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![Fastify](https://img.shields.io/badge/fastify-202020?style=for-the-badge&logo=fastify&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Koa](https://img.shields.io/badge/Koa.js-333333?style=for-the-badge&logo=koajs&logoColor=white)
![Next.js](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Vue](https://img.shields.io/badge/Vue%20js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Svelte](https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00)
![Astro](https://img.shields.io/badge/Astro-0C1222?style=for-the-badge&logo=astro&logoColor=FDFDFE)
![Solid](https://img.shields.io/badge/Solid%20JS-2C4F7C?style=for-the-badge&logo=solid&logoColor=white)
![Vanilla JS](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)


## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)
- [Options](#options)
- [Examples](#examples)
- [Creator & Collaboration](#creator--collaboration)
- [License](#license)

## Prerequisites

Before using Allin CLI, ensure you have:

- **Node.js** v22.16.0 (LTS) or later
- **npm** v10.9.2 or later
- **pnpm** (optional, if you use `-m pnpm`)
- **git** (optional, if you use `-g`)


You can verify your versions with:

```bash
node --version   # should output v22.16.0 or higher
npm --version    # should output 10.9.2 or higher
```

## Installation

#### npm:

```bash
npm install -g @faisalrmdhn08/allin-cli
```

#### yarn:

```bash
yarn global add @faisalrmdhn08/allin-cli
```

#### pnpm:

```bash
pnpm add -g @faisalrmdhn08/allin-cli
```

#### bun:

```bash
bun add -g @faisalrmdhn08/allin-cli
```

## Usage

#### Start creating new project:

```bash
allin create
```

#### Show help:

```bash
allin --help
```

#### Show version:

```bash
allin --version
```

## Commands

### create

Scaffold a new project from templates.

```bash
allin create [options]
```

- **Summary**: Action to create a new project.
- **Description**: Create a new frontend, backend, or full-stack project with your choice of frameworks.

## Options

| Flag                          | Description                                                  | Default                   |
| ----------------------------- | ------------------------------------------------------------ | ------------------------- |
| `--backend <backend>`         | Set default framework for backend project at first run.      | —                         |
| `--frontend <frontend>`       | Set default framework for frontend project at first run.     | —                         |
| `-f, --force`                 | Overwrite project that existed.                              | `false`                   |
| `--name <name>`               | Set project name at first run.                               | —                         |
| `--author <author>`           | Add author name for the project.                             | —                         |
| `--description <description>` | Set project name at first run.                               | —                         |
| `-d, --dir <dir>`             | Destination directory for the generated project.             | current working directory |
| `--git`                       | Initialize a Git repository.                                 | `false`                   |
| `--li, --license <license>`   | Add a LICENSE file.                                          | —                         |
| `--ts, --typescript`          | Initialize project with TypeScript configuration.            | `false`                   |
| `--dk, --docker`              | Initialize project with docker configuration.                | `false`                   |
| `--pm <pm>`                   | Choose package manager -> `npm` or `pnpm`.                   | `npm`                     |
| `-h, --help`                  | Display help for a specific command.                         | —                         |
| `-v, --version`               | Display the CLI version and exit.                            | —                         |

## Examples

Create a new project in my-app with all features:

```bash
allin create -d /home/my-app --name=test-project --backend=express --author "Faisal" --description "My project" --li=mit --git --ts --dk -f
```

Create in the current directory without extras:

```bash
allin create
```

If you using `--backend` and `--frontend` option. This are the value you can use:
| Framework                          | Value                                    |
| ---------------------------------- | ---------------------------------------- |
| Express.js                         | `express`                                |
| Koa.js                             | `koa`                                    |
| NestJS                             | `nest`                                   |
| Fastify                            | `fastify`                                |
| Next.js                            | `next`                                   |
| Vue.js                             | `vue`                                    |
| Svelte                             | `svelte`                                 |
| Astro.js                           | `astro`                                  |
| SolidJS                            | `solid`                                  |
| VanillaJS                          | `vanilla`                                |

If you using `--li, --license` option. This are the value you can use:
| License                                | Value                                    |
| -------------------------------------- | ---------------------------------------- |
| Apache 2.0 License                     | `apache-2`                               |
| BSD 2-Clause License                   | `bsd-2-clause`                           |
| BSD 3-Clause License                   | `bsd-3-clause`                           |
| GNU General Public License v3.0        | `gpl-3.0`                                |
| ISC License                            | `isc`                                    |
| GNU Lesser General Public License v3.0 | `lgpl-3.0`                               |
| MIT License                            | `mit`                                    |
| Unlicense                              | `unlicense`                              |


## Creator & Collaboration

**Creator**: Faisal Ramadhan

**Email**: [faisalramadhan1299@gmail.com](mailto:faisalramadhan1299@gmail.com)

**GitHub**: [https://github.com/Kolong-Meja/allin-cli](https://github.com/Kolong-Meja/allin-cli)

If you’d like to contribute, report an issue, or suggest a feature, please visit the GitHub repository and open an issue or pull request. Collaboration is very welcome! 🚀

## License

This project is licensed under the MIT License. See the LICENSE file for full details. [MIT](https://opensource.org/license/mit)
