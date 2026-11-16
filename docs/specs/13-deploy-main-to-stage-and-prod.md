# Deploy main to stage and prod

**Version:** 1.0 · **Date:** 2026-11-16 · **Issue:** #13 · **Feature flag:** None

## Acceptance criteria

Copied from #13. The issue is the source: change the issue first, then this copy.

- [ ] A commit on `main` is running on stage without any manual steps
- [ ] Prod is only deployed when someone starts it
- [ ] The deployed health check responds after each deployment
- [ ] A deployment can be rolled back to the previous image

## Behaviour

1. Every commit on `main` is built into a frontend image tagged with its commit SHA and pushed to GHCR, also when its deployment is skipped. A commit whose image already exists is not built again.
2. A commit on `main` is deployed to stage after its image is pushed, without any manual step.
3. Two stage deployments of the frontend never run at the same time. When several commits land while one is deploying, the ones in between may be skipped, and the newest is deployed last.
4. A frontend deployment leaves the backend in the same environment untouched.
5. Prod is deployed when someone pushes a version tag (`1.2.3` or `v1.2.3`) in this repository. The deployment uses the image already built for that commit, now also tagged with the version without the `v`.
6. A version tag on a commit that `main` never built fails before anything is deployed.
7. Someone can start the prod release by hand from `main` with a version. That version is deployed to prod, which is how prod is rolled back to an earlier version.
8. A manual start from any branch other than `main`, or with a version that doesn't match `v1.2.3` or `1.2.3`, or whose image doesn't exist, fails before anything is deployed.
9. Two prod deployments of the frontend never run at the same time, whether they come from a tag or a manual start. While one runs, GitHub keeps only the newest waiting release and cancels an older waiting one, so that release must be started again by hand.
10. After each deployment, the workflow requests the root page of that environment's public host from outside. The run fails if it doesn't answer.
11. When the new image can't be pulled, or the new version fails its container health check, the server keeps or returns to the previous frontend version (`deploy.sh` from Kanban4sem/MTOGO-Backend#11 and #20, unchanged).
12. Stage is rolled back by re-running an earlier "Deploy to stage" run. The re-run deploys the image already built for that commit without building it again.

## Implementation decisions

- **ADR:** [ADR-003](https://github.com/Kanban4sem/MTOGO-Backend/blob/main/docs/adr/003-deployment-pipeline.md) in `MTOGO-Backend` applies and is linked, not copied: the public GHCR image `ghcr.io/kanban4sem/mtogo-frontend`, stage on every commit to `main`, prod from a version tag without a rebuild.
- **Server contract (from Kanban4sem/MTOGO-Backend#11 and #20):** `deploy.sh` already accepts `<environment> frontend <tag>`, the server's compose file already has a `frontend` service that reads `FRONTEND_TAG`, and Caddy already sends every path outside `/v1/*` to the frontend. No change in `MTOGO-Backend` is needed. The workflows use the organization secrets `DEPLOY_SSH_KEY`, `DROPLET_HOST` and `DROPLET_KNOWN_HOSTS`.
- **Deploy action:** the frontend has its own copy of the backend's composite deploy action, with the service fixed to `frontend`. It connects as `deploy` with strict host key checking, removes the deploy key right after the SSH step and then checks the public host from outside. It does not depend on the backend repository.
- **Deploy to stage workflow:** a copy of the backend's, in two jobs.
  - **Build** has no concurrency group, and stops early when the image for the commit already exists. Otherwise it sets up Node 24, the same version as the devcontainer and the existing `prep-runner` action, runs `npm ci` and `npm run build` without tests (the ready flow already checked the commit), builds the image with the existing Dockerfile and the OCI `source` label pointing at this repository, and pushes it. The Dockerfile and `.dockerignore` stay unchanged: `.dockerignore` already lets `dist/` and `nginx.conf` through.
  - **Deploy** runs in the GitHub environment `stage` with concurrency group `deploy-stage` without cancelling, and deploys `stage frontend <sha>`.
- **Release to prod workflow:** a copy of the backend's, in the GitHub environment `prod` with concurrency group `deploy-prod` without cancelling. It refuses a manual start from any branch other than `main` before checkout, checks the version against `^v?[0-9]+\.[0-9]+\.[0-9]+$`, tags or finds the image and deploys `prod frontend <version>`. It doesn't build.
- **Versions:** the frontend has its own semantic version tags, independent of the backend's. Compatibility with the API is the API contract's job, not matching version numbers. Each repository rolls its own prod back.
- **Check from outside:** the last step of both workflows calls `GET /` on the environment's public host with `curl -fsS --retry 5 --retry-delay 3 --retry-all-errors`. Caddy answers 502 when the frontend container doesn't run, so the check fails. The container's own `HEALTHCHECK` still decides whether `deploy.sh` keeps the new version.
- **Concurrency across repositories:** the concurrency groups only apply within this repository, so a backend and a frontend deployment can run at the same time. `deploy.sh` takes a lock, so that is safe.
- **README:** a section on deployment: what deploys stage, how to release to prod, how to roll back each environment, and that the GHCR package must be made public once by hand. It links to ADR-003. It also notes that GitHub environments are per repository: `stage` and `prod` are created in this repository on the first run, with their own deployment history, so a protection such as required approval must be set up in both repositories if the team introduces one.

## Testing decisions

No application code changes, so there are no rule sets.

Before deliver:

- `prettier` checks the workflow, action and README files in trunk-worthy, and `cspell` checks the README. The shared `cspell` configuration ignores `.github/`. New words go in the repository dictionary.
- `actionlint` on both workflows and the deploy action, when it is installed. It is not part of trunk-worthy.

Right after deliver, on the real stage and prod, in this order:

1. **First stage deployment:** "Deploy to stage" starts by itself. If it fails at the pull because GHCR created the package as private, make `mtogo-frontend` public in GHCR and re-run the run. It must succeed, and the check from outside must pass. (Criterion 1 and 3, behaviour 1–2 and 10)
2. **Stage in the browser:** open `https://stage.mtogo.saldic.dev`. The app must load, and the browser's network tab must show `GET /v1/features` answering 200 from the same domain. On the server, `docker compose ps` in `/opt/mtogo/stage` must show the backend container healthy, with the same tag and the same uptime as before the frontend deployment. (Criterion 1, behaviour 4)
3. **Stage rollback:** after the next delivery to `main`, re-run the earlier "Deploy to stage" run. Its build job must skip the build because the image exists, `deploy.log` must show the older SHA, and the check from outside must pass. (Criterion 4, behaviour 12)
4. **Two prod releases:** the developer starts versioning with `gh tt semver init`, then releases a second version. Each "Release to prod" run must succeed, and `https://mtogo.saldic.dev/` must answer. No push to `main` deploys prod. (Criterion 2 and 3, behaviour 5)
5. **Prod rollback:** start "Release to prod" by hand with the first version. `deploy.log` must show `prod frontend <first version> ok`. Also start it once with an invalid version, such as `1.2`, and once from a branch other than `main`: the branch of the next issue, with `gh workflow run on_release.yml --ref <branch> -f version=<version>`, since this issue's branch is deleted on delivery. That branch must be created or rebased after #13 lands on `main`, so it has the workflow file. Both must fail before deploying, and the run from the other branch must fail in the step "Allow manual starts from main only", not with "workflow not found". (Criterion 4, behaviour 7–8)

The issue closes automatically when the delivery lands on `main`, so these checks happen after it closes. The results (links to the runs and the lines from `deploy.log`) are written as a comment on #13 and in the implementation note. A check that fails becomes a new bug issue.

## Out of scope

- Changes to `deploy.sh`, the server's compose file or Caddy. They already support the frontend.
- A multi-stage Dockerfile. The workflow builds `dist/` before `docker build`.
- Coordinated versions or releases of frontend and backend together.
- Making the GHCR package public and the first release with `gh tt semver init` are manual steps, not automated.

## Further notes

- Stage rollback needs a second commit on `main` built by the workflow, so check 3 waits for the next delivery.
- Prod rollback needs at least two released versions. They can point at the same commit, which proves the mechanism but not a change of code.

## Implementation notes

<!-- Written by /mtogo-implement and /mtogo-review. -->

### Spec 1.0 - 2026-11-16 - #13

- **Built:** the composite action `.github/actions/deploy` deploys `<environment> frontend <tag>` over SSH as `deploy` with strict host key checking, removes the deploy key and requests `GET /` on the public host. The workflow "Deploy to stage" (`on_main.yml`) builds `ghcr.io/kanban4sem/mtogo-frontend:<sha>` with Node 24 unless the image exists, then deploys it to stage in the concurrency group `deploy-stage`. The workflow "Release to prod" (`on_release.yml`) runs on a version tag or a manual start from `main`, checks the version, tags or finds the image and deploys it to prod in the concurrency group `deploy-prod`. The README has a deployment section that links to ADR-003.
- **Deviations:** None.
- **Tests:** `gh insitu run trunk-worthy` passes: `markdownlint`, `prettier`, `cspell` (README only, since it ignores `.github/`) and the frontend lint and build. `actionlint` isn't installed and wasn't run; the three YAML files parse. The five checks on the real stage and prod in [Testing decisions](#testing-decisions) are pending until after deliver.
- **Follow-up:** None.

## Changelog

| Version | Date       | Change        | Issue |
| ------- | ---------- | ------------- | ----- |
| 1.0     | 2026-11-16 | First version | #13   |
