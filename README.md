# MTOGO-Frontend

The web client for MTOGO, a food delivery platform. Built with React 19 and Vite.

We work with Kanban and trunk-based development using [TakT](https://github.com/devx-cafe/gh-tt) and [InSitu](https://github.com/devx-cafe/gh-insitu). Every change starts as an issue on our [board](https://github.com/orgs/Kanban4sem/projects/1) and ends as exactly one commit on `main`.

## Getting started

### 1. Install on your own machine (once)

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows: with WSL2)
- [VS Code](https://code.visualstudio.com/) with the **Dev Containers** extension
- [GitHub CLI](https://cli.github.com/) (`brew install gh` on Mac, `winget install GitHub.cli` on Windows)

### 2. Log in to GitHub with project access (once)

```bash
gh auth login -h github.com -p https -s project -w
```

Then let the dev container inherit your login. On Mac add this line to `~/.zprofile` (on Linux/WSL: `~/.profile`). Use the path that `which gh` prints:

```bash
export GH_TOKEN=$(/opt/homebrew/bin/gh auth token)
```

On Windows, run this once in PowerShell instead:

```powershell
[Environment]::SetEnvironmentVariable("GH_TOKEN", (gh auth token), "User")
```

Restart your terminal and VS Code afterwards.

### 3. Open the repository in the dev container

1. Clone the repository and open the folder in VS Code.
2. Press `Cmd+Shift+P` (Windows: `Ctrl+Shift+P`) and choose **Dev Containers: Reopen in Container**.
3. The first build takes a few minutes. It installs the GitHub CLI, TakT, InSitu, our linters and the frontend dependencies.

All commands below are run in the terminal **inside** the dev container.

### 4. Check that everything works

```bash
gh auth status                # must show the 'project' scope
gh insitu run trunk-worthy    # all checks must be green
```

If git asks who you are, set your name and email once:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## Daily workflow

| Step    | Command                                                  | What happens                                                                        |
| ------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Start   | `gh tt workon -i <issue>` or `gh tt workon -t "<title>"` | Creates or reuses the issue branch and moves the issue to **In Progress**           |
| Save    | `gh tt wrapup -m "<message>"`                            | Runs the quality checks, commits and pushes. Use it as often as you like            |
| Sync    | `git pull --rebase origin main`                          | Needed before delivering if `main` has moved                                        |
| Deliver | `gh tt deliver`                                          | Squashes your work into one commit. CI verifies it and fast-forwards it onto `main` |

Rules:

- Never push directly to `main`.
- Fix formatting automatically with `gh insitu run fix-all`.
- Unknown but correct words for the spell checker go in `.dict/repo.dictionary`.

## Run, lint and build

```bash
npm run dev      # dev server on http://localhost:5173
npm run lint     # ESLint
npm run build    # production build in dist/
```

The API base URL is set in `src/api/client.js` and points to the backend on `http://localhost:7070/v1`.

## How we work

- [CONTRIBUTING](CONTRIBUTING.md): issues, workflow, commit messages, quality gates and ADRs
- [Coding standards](docs/coding-standards.md) and [Definition of Done](docs/definition-of-done.md)
- [AI workflow](docs/ai-workflow.md) and [`AGENTS.md`](AGENTS.md): how we work with AI agents
