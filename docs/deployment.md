# Deployment

Stage (`https://stage.mtogo.saldic.dev`) and prod (`https://mtogo.saldic.dev`) run on one droplet, together with the backend. The decisions behind the pipeline are in [ADR-003](https://github.com/Kanban4sem/MTOGO-Backend/blob/main/docs/adr/003-deployment-pipeline.md) in `MTOGO-Backend`, which also owns the server side. On the server, Caddy sends `/v1/*` to the backend and every other path to the frontend. A frontend deployment leaves the backend untouched.

## Stage

Every commit that reaches `main` is deployed to stage by the **Deploy to stage** workflow. It builds the app, builds the image, pushes it to GHCR as `ghcr.io/kanban4sem/mtogo-frontend:<commit SHA>` and deploys it. Nothing has to be done by hand. Every commit gets its image, but only one stage deployment runs at a time. When several commits land while one is deploying, GitHub skips the ones in between and deploys the newest.

## Prod

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

## Health check

`deploy.sh` waits for the container's own health check and rolls back to the previous version on its own when it fails. When the new image can't be pulled, the previous version keeps running. After each deployment the workflow also calls `GET /` on the public host, and the run fails if it doesn't answer.

## Roll back

- **Stage:** open an earlier **Deploy to stage** run in the Actions tab and choose **Re-run all jobs**. The run deploys the image already built for that commit instead of building it again. GitHub keeps runs for 30 days.
- **Prod:** start **Release to prod** by hand (**Run workflow**) from `main` with the version to go back to, such as `1.2.3`. A manual start from any other branch fails before it deploys.

Each repository rolls back its own prod. Rolling back the frontend leaves the backend's version as it is.

## GitHub environments

The `stage` and `prod` environments are per repository. They are created in this repository on the first run and keep their own deployment history, separate from the backend's. If the team adds a protection such as a required approval, set it up in both repositories.

## First deployment of a new package

GHCR creates a package as private on its first push, and the droplet can't pull a private image. Make the `mtogo-frontend` package public once under the organization's **Packages** → **Package settings** → **Change visibility**, then re-run the failed run.
