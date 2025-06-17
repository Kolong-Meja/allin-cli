# Allin CLI

![NPM VERSION](https://img.shields.io/npm/v/@faisalrmdhn08/allin-cli?style=flat-square)
![NPM DOWNLOADS](https://img.shields.io/npm/dm/@faisalrmdhn08/allin-cli?style=flat-square)
![LICENSE](https://img.shields.io/badge/license-GPLv3-blue?style=flat-square)

A modern, full-stack CLI tool built with TypeScript that scaffolds your entire stack—backend, frontend or both—in one seamless command.

### Supported Platforms: 

![OS](https://img.shields.io/badge/mac%20os-000000?style=for-the-badge&logo=apple&logoColor=white) ![OS](  https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black) ![OS](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)

### Supported Templates :
![EXPRESS](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white) ![FASTIFY](https://img.shields.io/badge/fastify-202020?style=for-the-badge&logo=fastify&logoColor=white) ![NESTJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) ![NEXT](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![VUE](https://img.shields.io/badge/Vue%20js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D) ![SVELTE](https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00) ![ASTRO](https://img.shields.io/badge/Astro-0C1222?style=for-the-badge&logo=astro&logoColor=FDFDFE) ![SOLID](https://img.shields.io/badge/Solid%20JS-2C4F7C?style=for-the-badge&logo=solid&logoColor=white)


### **New Features**:
- Add new `--ts` option so you can initiliaze `Typescript` on your project.
- Add **SolidJS Framework** as a project template which you can use when creating new project.


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

Before using Allin CLI, ensure you have the following installed on your machine:

- **Node.js** version **22.16.0** (LTS) or later
- **npm** version **10.9.2** or later
- **git** (optional, if you use option `-g` or `--git`)

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

| Flag              | Description                                                  | Default                   |
| ----------------- | ------------------------------------------------------------ | ------------------------- |
| `-d, --dir <dir>` | Destination directory for the generated project.             | current working directory |
| `-g, --git`       | Initialize a Git repository.                                 | `false`                   |
| `-l, --license`   | Add a LICENSE file (GPLv3).                                  | `false`                   |
| `--ts`            | Scaffold project with TypeScript config and boilerplate.     | `false`                   |
| `-h, --help`      | Display help for a specific command.                         | —                         |
| `-v, --version`   | Display the CLI version and exit.                            | —                         |

## Examples

Create new project in folder **my-app** with `git init`, add `LICENSE`, and add `Typescript`:

```bash
allin create -d my-app -g -l --ts
```

Create new project in folder **my-app** with `git init` only.

```bash
allin create -d my-app -g
```

Create new project in folder **my-app** with add `LICENSE` only.

```bash
allin create -d my-app -l
```
Create new project in folder **my-app** with add `Typescript` only.

```bash
allin create -d my-app --ts
```

Create in current directory without `git init`, add `LICENSE`, and add `Typescript`:

```bash
allin create
```

## Creator & Collaboration

**Creator**: Faisal Ramadhan

**Email**: [faisalramadhan1299@gmail.com](mailto:faisalramadhan1299@gmail.com)

**GitHub**: [https://github.com/Kolong-Meja/allin-cli](https://github.com/Kolong-Meja/allin-cli)

If you’d like to contribute, report an issue, or suggest a feature, please visit the GitHub repository and open an issue or pull request. Collaboration is very welcome! 🚀

## License

This project is licensed under the GNU General Public License version 3 (GPLv3). See the LICENSE file for full details. [GPL3](https://www.gnu.org/licenses/gpl-3.0.txt)
