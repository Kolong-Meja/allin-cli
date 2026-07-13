# Allin CLI

**Scaffold a production-ready backend or frontend project in seconds — with safety nets built in.**

One command asks a few smart questions (or none at all, if you pass flags) and hands you a ready-to-run project: framework installed, TypeScript wired up, Docker/ESLint/logging configured if you want them, and a Git repo already committed.

[![NPM Version](https://img.shields.io/npm/v/@faisalrmdhn08/allin-cli?style=flat-square)](https://www.npmjs.com/package/@faisalrmdhn08/allin-cli)
[![NPM Downloads](https://img.shields.io/npm/dm/@faisalrmdhn08/allin-cli?style=flat-square)](https://www.npmjs.com/package/@faisalrmdhn08/allin-cli)
[![Node Version](https://img.shields.io/node/v/@faisalrmdhn08/allin-cli?style=flat-square)](https://www.npmjs.com/package/@faisalrmdhn08/allin-cli)
[![Publish](https://img.shields.io/github/actions/workflow/status/Kolong-Meja/allin-cli/publish.yml?style=flat-square&label=publish)](https://github.com/Kolong-Meja/allin-cli/actions/workflows/publish.yml)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](https://opensource.org/license/mit)

### Platforms

![macOS](https://img.shields.io/badge/mac%20os-000000?style=for-the-badge&logo=apple&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)
![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)

### Templates

![Express](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![Fastify](https://img.shields.io/badge/fastify-202020?style=for-the-badge&logo=fastify&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Feathers](https://img.shields.io/badge/FeathersJS-333333?style=for-the-badge&logo=feathersjs&logoColor=white)
![Koa](https://img.shields.io/badge/Koa.js-333333?style=for-the-badge&logo=koajs&logoColor=white)
![Next.js](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Vue](https://img.shields.io/badge/Vue%20js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Svelte](https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00)
![Astro](https://img.shields.io/badge/Astro-0C1222?style=for-the-badge&logo=astro&logoColor=FDFDFE)
![Solid](https://img.shields.io/badge/Solid%20JS-2C4F7C?style=for-the-badge&logo=solid&logoColor=white)
![Vanilla JS](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

## Table of Contents

- [Why allin-cli?](#why-allin-cli)
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)
- [Options](#options)
- [Templates](#templates)
- [License Templates](#license-templates)
- [Examples](#examples)
- [How It Keeps Your Project Safe](#how-it-keeps-your-project-safe)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Creator & Collaboration](#creator--collaboration)
- [License](#license)

## Why allin-cli?

- 🧠 **Reads your intent from the project name.** Name it `my-nest-api` and it detects "NestJS backend" on its own — one less prompt to answer.
- 🛡️ **Fails safely.** If a scaffold breaks halfway through, whatever was there before is automatically restored, and any half-written output is cleaned up. No manual cleanup, no half-broken folders.
- 🎛️ **Interactive or scripted — your choice.** Skip every prompt with flags for CI pipelines and repeatable setups, or just run `allin create` and answer along the way.
- 🧩 **12 frameworks, one CLI.** 6 backend, 6 frontend, all through the same command and the same flags.
- 📦 **Checks your package manager before it asks you anything.** npm, pnpm, yarn, or bun — verified upfront, so you're not ten prompts deep before finding out the binary isn't installed.
- ⚙️ **Optional add-ons, not forced ones.** Docker (+ Docker Bake), ESLint, Winston logging, `.env` scaffolding, a LICENSE, a README, and an automatic first Git commit — all opt-in.

## Quick Start

Try it without installing anything:

```bash
npx @faisalrmdhn08/allin-cli create
```

That drops you into an interactive setup. Answer a few questions and you're done.

Prefer one shot, no prompts? Pass everything as flags:

```bash
npx @faisalrmdhn08/allin-cli create my-api ./projects --template=express --ts --git
```

> 💡 **Tip:** a short terminal recording (via [VHS](https://github.com/charmbracelet/vhs) or [asciinema](https://asciinema.org/)) right here would let people see the interactive flow before they type a single command — worth adding once you've got one you like.

## Prerequisites

- **Node.js** v22 or later
- **npm** v10 or later
- **pnpm**, **yarn**, or **bun** — optional, only if you plan to use `--pm`
- **git** — optional, only if you use `--git`

```bash
node --version   # should output v22.x or higher
npm --version    # should output 10.x or higher
```

## Installation

#### npm

```bash
npm install -g @faisalrmdhn08/allin-cli
```

#### yarn

```bash
yarn global add @faisalrmdhn08/allin-cli
```

#### pnpm

```bash
pnpm add -g @faisalrmdhn08/allin-cli
```

#### bun

```bash
bun add -g @faisalrmdhn08/allin-cli
```

## Usage

```bash
allin create [name] [directory] [type] [options]
```

```bash
allin --help       # show global help
allin --version    # print the CLI version banner and exit
```

Anything you don't pass as an argument or flag, `allin` will ask for interactively — project name, project type, directory, package manager, and so on.

## Commands

### `create`

Scaffold a new backend or frontend project from a template.

- **Arguments**
  - `[name]` — project name. Also used to auto-detect the project type (e.g. a name containing `vue` resolves to the Vue.js template without asking).
  - `[directory]` — target directory. Defaults to the current working directory.
  - `[type]` — `backend` or `frontend`. Ignored if `[name]` already implies a type, or if `--template` is set (the template's own category wins).

## Options

| Flag                                  | Description                                                              | Default |
| -------------------------------------- | -------------------------------------------------------------------------| ------- |
| `-n, --name <name>`                    | Project name to use for the setup.                                       | —       |
| `-d, --dir <dir>`                      | Destination folder for the generated project.                            | cwd     |
| `-f, --force`                          | Overwrite the target directory if it already exists (auto-backed up).    | `false` |
| `--au, --author <author>`              | Author name to include in the project metadata.                          | —       |
| `--desc, --description <desc>`         | Short description for the project.                                       | —       |
| `--ver, --version <version>`           | Initial version to write into the generated project's `package.json`.    | —       |
| `--template <template>`                | Framework template to use (see [Templates](#templates)).                 | —       |
| `--pm, --package-manager <pm>`         | Package manager: `npm`, `pnpm`, `yarn`, or `bun`.                        | `npm`   |
| `--li, --license <license>`            | Add a LICENSE file (see [License Templates](#license-templates)).        | —       |
| `--readme`                             | Add a starter README file to the generated project.                      | `false` |
| `--ts, --typescript`                   | Initialize with TypeScript configuration and typings.                    | `false` |
| `--dk, --docker`                       | Include Docker configuration (with an optional Docker Bake setup).       | `false` |
| `--env`                                | Generate a `.env` file scaffold for the project.                         | `false` |
| `--git`                                | Initialize a Git repository and make the first commit.                   | `false` |
| `-h, --help`                           | Show help for the `create` command.                                      | —       |

> ⚠️ `--ver, --version <version>` sets the **generated project's** version. The top-level `allin -v, --version` (no arguments) prints **the CLI's own** version banner and exits — different flag, different purpose, easy to confuse at a glance.

## Templates

Pass any value below to `--template`. The category (backend/frontend) is inferred automatically — no need to also pass `[type]`.

**Backend**

| Framework | Value     |
| --------- | --------- |
| Express.js| `express` |
| Fastify   | `fastify` |
| FeathersJS| `feather` |
| NestJS    | `nest`    |
| Koa       | `koa`     |
| Node.js   | `node`    |

**Frontend**

| Framework | Value     |
| --------- | --------- |
| Next.js   | `next`    |
| Vue.js    | `vue`     |
| Svelte    | `svelte`  |
| Astro.js  | `astro`   |
| SolidJS   | `solid`   |
| VanillaJS | `vanilla` |

## License Templates

Pass any value below to `--li` / `--license`:

| License                                | Value       |
| --------------------------------------- | ----------- |
| MIT License                             | `mit`       |
| Apache 2.0 License                      | `apache-2`  |
| BSD 2-Clause License                    | `bsd-2`     |
| BSD 3-Clause License                    | `bsd-3`     |
| GNU General Public License v3.0         | `gpl-3`     |
| GNU Lesser General Public License v3.0  | `lgpl-3`    |
| ISC License                             | `isc`       |
| Unlicense                               | `unlicense` |

## Examples

Fully non-interactive backend setup:

```bash
allin create my-api ./projects \
  --template=express \
  --author "Faisal Ramadhan" \
  --description "Internal API service" \
  --li=mit \
  --pm=pnpm \
  --ts --dk --env --git -f
```

Let the name decide the framework — `my-vue-dashboard` resolves to Vue.js automatically, so no `--template` is needed:

```bash
allin create my-vue-dashboard . --ts --git
```

Pure interactive mode — just answer the prompts:

```bash
allin create
```

## How It Keeps Your Project Safe

A few things happen behind the scenes that are easy to miss but worth knowing about:

- **Package manager preflight check.** Before a single prompt appears, `allin` verifies the package manager you asked for is actually installed and runnable. If it isn't, you get a clear error immediately instead of a failure five steps in.
- **Automatic backup & rollback.** Using `--force` on an existing folder backs it up first. If generation fails for any reason, that backup is restored and any partially-created output is removed — your original folder comes back exactly as it was.
- **Guarded project names.** Names that look like file paths, don't follow safe naming rules, or contain disallowed words are rejected with a clear validation message before anything is written to disk.
- **Clear, typed errors.** Unknown project types or template names throw a specific, readable error rather than failing silently or falling back to a guess.

## Roadmap

Ideas being considered for upcoming versions — not implemented yet:

- [ ] `allin doctor` — diagnose environment/setup issues before you scaffold
- [ ] `--dry-run` — preview what would be generated without writing anything
- [ ] `.allinrc` config file support (via `cosmiconfig`), so repeated flags become defaults
- [ ] Update notifier — a heads-up when a newer version of the CLI is available
- [ ] Custom templates from remote repositories
- [ ] Combined full-stack scaffolding (backend + frontend in a single run)
- [ ] Exhaustive package-manager mapping that throws on unrecognized values instead of silently falling back

Have an idea or a use case this doesn't cover yet? Open an issue — that's exactly what shapes this list.

## Contributing

```bash
git clone https://github.com/Kolong-Meja/allin-cli.git
cd allin-cli
npm install
npm run start -- create   # run the CLI from source (tsx, no build step)
npm run test               # run the test suite
npm run format              # apply Prettier formatting
```

1. Fork the repo and create a branch for your change.
2. Keep changes focused — one fix or feature per PR is easier to review than several bundled together.
3. Run `npm run test` and `npm run check-format` before opening the PR.
4. Open a PR describing what changed and why.

Bug reports, feature requests, and PRs are all welcome on [GitHub](https://github.com/Kolong-Meja/allin-cli/issues).

## Creator & Collaboration

**Creator:** Faisal Ramadhan
**Email:** [faisalramadhan1299@gmail.com](mailto:faisalramadhan1299@gmail.com)
**GitHub:** [github.com/Kolong-Meja/allin-cli](https://github.com/Kolong-Meja/allin-cli)

## License

MIT — see the [LICENSE](https://github.com/Kolong-Meja/allin-cli/blob/main/LICENSE) file for full details.