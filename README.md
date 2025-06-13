# Allin CLI

A modern full-stack CLI tool based on TypeScript designed to accelerate your app development process — setup your entire stack in one seamless command.

### **Available on**: 

![OS](https://img.shields.io/badge/mac%20os-000000?style=for-the-badge&logo=apple&logoColor=white) ![OS](  https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black) ![OS](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)

### **Included Frameworks**:
- **Backend**:

![FRAMEWORK](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white) ![FRAMEWORK](https://img.shields.io/badge/fastify-202020?style=for-the-badge&logo=fastify&logoColor=white) ![FRAMEWORK](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)

- **Frontend**:

![FRAMEWORK](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![FRAMEWORK](https://img.shields.io/badge/Vue%20js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D) ![FRAMEWORK](https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00) ![FRAMEWORK](https://img.shields.io/badge/Astro-0C1222?style=for-the-badge&logo=astro&logoColor=FDFDFE)


## Table of Contents

- [Prerequisites](https://github.com/Kolong-Meja/allin-cli#prerequisites)
- [Installation](https://github.com/Kolong-Meja/allin-cli#installation)
- [Usage](https://github.com/Kolong-Meja/allin-cli#usage)
- [Commands](https://github.com/Kolong-Meja/allin-cli#commands)
- [Options](https://github.com/Kolong-Meja/allin-cli#options)
- [Examples](https://github.com/Kolong-Meja/allin-cli#examples)
- [Creator & Collaboration](https://github.com/Kolong-Meja/allin-cli#creator--collaboration)
- [License](https://github.com/Kolong-Meja/allin-cli#license)

## Prerequisites

Before using Allin CLI, ensure you have the following installed on your machine:

- Node.js version **22.16.0** (LTS) or later
- npm version **10.9.2** or later

You can verify your versions with:

```bash
node --version   # should output v22.16.0 or higher
npm --version    # should output 10.9.2 or higher
```

## Installation

Install Allin CLI globally via npm:

```bash
npm install -g @faisalrmdhn08/allin-cli
```

Install Allin CLI globally via yarn:

```bash
yarn global add @faisalrmdhn08/allin-cli
```

Install Allin CLI globally via pnpm:

```bash
pnpm add -g @faisalrmdhn08/allin-cli
```

Install Allin CLI globally via bun:

```bash
bun add -g @faisalrmdhn08/allin-cli
```

## Usage

Start creating project:

```bash
allin create
```

Show global help:

```bash
allin --help
```

Show version and exit:

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
| `-d, --dir <dir>` | Destination directory to save the project template.          | Current working directory |
| `-g, --git`       | Initialize a Git repository automatically after scaffolding. | `false`                   |
| `-l, --license`   | Add a `LICENSE` file to the generated project (GPLv3).       | `false`                   |
| `-h, --help`      | Display help information for a specific command.             | —                         |
| `-v, --version`   | Show current version of Allin CLI and exit.                  | —                         |

## Examples

Create a new project in folder **my-app**, **initialize Git**, and **add a LICENSE**:

```bash
allin create -d my-app -g -l
```

Create in current directory without Git or license:

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
