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
3. The first build takes a few minutes. It installs the GitHub CLI, TakT, InSitu, our linters, the frontend dependencies, and Claude Code and Codex as extensions and on the command line. It also checks `.claude/skills` out as a symlink so Claude Code finds the repository's skills, also in a clone made on Windows. If your dev container already exists, rebuild it.
4. Log in to the AI agents once: run `claude` and `codex` in the terminal and follow the prompts. Your login lives in the Docker volumes `mtogo-claude` and `mtogo-codex`, so it survives rebuilds and also works in the MTOGO-Backend dev container. The first rebuild that adds these volumes starts logged out.

   Both agents are installed by default. If you don't use one, set `MTOGO_SKIP_CLAUDE=1` or `MTOGO_SKIP_CODEX=1` as an environment variable on your own machine, restart VS Code and rebuild the dev container. The container then skips that command-line install. The VS Code extensions stay installed. Disable them for yourself in VS Code.

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

The app calls the API on the relative path `/v1` (set in `src/api/client.js`). In development, the Vite dev server forwards `/v1` to the backend on `http://localhost:8080`, so start the backend first.

With `orderingEnabled` on, signed-in customers can open **Din profil → Mine ordrer** at `/profile/orders`. The list and detail pages read the customer's orders from `/v1/customer/orders` and `/v1/customer/orders/{id}`.

Signed-in users can open the notifications dropdown from the bell next to **Log ud**. When `orderingEnabled` is on, the bell shows the signed-in customer's unread order notification count. The app checks for notifications every 30 seconds with `GET /v1/customer/orders/notifications`. While the dropdown is open, the app marks the displayed notifications as read with `PUT /v1/customer/orders/notifications/{id}/read`. The dropdown keeps the messages available after they have been read.

Delivered notifications show a disabled **Feedback** button.

At `/profile/settings`, signed-in customers can update their name and phone number through `PUT /v1/users/me`. They can add, edit and remove saved delivery addresses through `/v1/users/me/delivery-addresses`. The settings page displays the account email as read-only.

At `/checkout`, customers can choose a saved address or enter one for the current order. They can save the entered address as their default after successful payment. Checkout reads the profile and saved addresses from the API and sends `deliveryAddressId` to `POST /v1/orders` when a saved address is selected. Orders retain the address recorded at checkout. Signing out clears the basket on that browser.

Restaurant users can open **Restaurant → Virksomhedsprofil** to see the signed-in account's details. With `orderingEnabled` on, **Restaurant → Ordrer** lists their restaurant's orders newest first and lets them filter by status. The page uses `GET /v1/restaurant/orders` to list orders and `PATCH /v1/restaurant/orders/{id}` to accept or reject a placed order or mark an accepted order as ready.

With `orderingEnabled` on, signed-in delivery agents can open **Din profil → Dashboard** at `/dashboard` to take orders that are ready for pickup. **Ordrer** at `/dashboard/orders` shows the agent's active and completed deliveries. Both views show the full delivery addresses. The dashboard uses `GET /v1/delivery-agent/orders` to list orders and `PATCH /v1/delivery-agent/orders/{id}` to take an order, mark it as picked up and mark it as delivered.

## Docker image

Build the app first, then the image:

```bash
npm run build
docker build -t mtogo-frontend .
docker run -p 8081:80 mtogo-frontend
```

The app is now on `http://localhost:8081`. nginx serves `dist/` and sends unknown paths to `index.html`, so React Router handles deep links. After a few seconds `docker ps` shows the container as `healthy`. API calls to `/v1` only work behind the reverse proxy on the server.

## Deployment

Stage (`https://stage.mtogo.saldic.dev`) and prod (`https://mtogo.saldic.dev`) run on one droplet, together with the backend. The decisions behind the pipeline are in [ADR-003](https://github.com/Kanban4sem/MTOGO-Backend/blob/main/docs/adr/003-deployment-pipeline.md) in `MTOGO-Backend`, which also owns the server side. On the server, Caddy sends `/v1/*` to the backend and every other path to the frontend. A frontend deployment leaves the backend untouched.

### Stage

Every commit that reaches `main` is deployed to stage by the **Deploy to stage** workflow. It builds the app, builds the image, pushes it to GHCR as `ghcr.io/kanban4sem/mtogo-frontend:<commit SHA>` and deploys it. Nothing has to be done by hand. Every commit gets its image, but only one stage deployment runs at a time. When several commits land while one is deploying, GitHub skips the ones in between and deploys the newest.

### Prod

Prod is deployed only when someone releases a version:

```bash
gh tt semver bump --patch   # or --minor, --major
git push origin --tags
```

`bump` needs an earlier version tag, so the first release starts with `init` instead:

```bash
gh tt semver init --tag 0.1.0 -m "First release"
git push origin --tags
```

The **Release to prod** workflow adds the version as a tag on the image `main` already built for that commit and deploys it. It doesn't rebuild. A tag on a commit that `main` hasn't built yet fails, so wait until **Deploy to stage** has finished for that commit.

Only one prod release runs at a time. While one runs, GitHub keeps only the newest waiting release and cancels an older waiting one, so start a cancelled release again by hand with **Run workflow**.

The frontend has its own versions, independent of the backend's. The API contract keeps the two compatible, not matching version numbers.

### Health check

`deploy.sh` waits for the container's own health check and rolls back to the previous version on its own when it fails. When the new image can't be pulled, the previous version keeps running. After each deployment the workflow also calls `GET /` on the public host, and the run fails if it doesn't answer.

### Roll back

- **Stage:** open an earlier **Deploy to stage** run in the Actions tab and choose **Re-run all jobs**. The run deploys the image already built for that commit instead of building it again. GitHub keeps runs for 30 days.
- **Prod:** start **Release to prod** by hand (**Run workflow**) from `main` with the version to go back to, such as `1.2.3`. A manual start from any other branch fails before it deploys.

Each repository rolls back its own prod. Rolling back the frontend leaves the backend's version as it is.

### GitHub environments

The `stage` and `prod` environments are per repository. They are created in this repository on the first run and keep their own deployment history, separate from the backend's. If the team adds a protection such as a required approval, set it up in both repositories.

### First deployment of a new package

GHCR creates a package as private on its first push, and the droplet can't pull a private image. Make the `mtogo-frontend` package public once under the organization's **Packages** → **Package settings** → **Change visibility**, then re-run the failed run.

## How we work

- [CONTRIBUTING](CONTRIBUTING.md): issues, workflow, commit messages, quality gates and ADRs
- [Coding standards](docs/coding-standards.md) and [Definition of Done](docs/definition-of-done.md)
- [AI workflow](docs/ai-workflow.md) and [`AGENTS.md`](AGENTS.md): how we work with AI agents
- [Minimum viable product](docs/minimum-viable-product.md): what the first release contains and the order status lifecycle
