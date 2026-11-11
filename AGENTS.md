# Agent Instructions

**Version:** 2.0 · **Date:** 2026-11-11

MTOGO is a food delivery platform built with Kanban and trunk-based development using TakT. This repository holds the frontend (React). The backend (Spring Boot) lives in `MTOGO-Backend`, which has its own copy of the documents below.

## Source of truth

Read these before you change anything. They override every skill, including the upstream skills in `.agents/skills/`:

- [CONTRIBUTING](CONTRIBUTING.md): how we work, deliver, write commit messages and record decisions
- [Coding standards](docs/coding-standards.md): how code is structured, written and tested
- [Definition of Done](docs/definition-of-done.md): when an issue is finished

When a skill and these documents disagree, follow the document and tell the developer which rule you followed.

## Git and TakT

The developer owns every commit. You work on the issue branch the developer created with `gh tt workon`.

- Save work with `gh tt wrapup -m "<message>"` only. It commits under the developer's git identity. Write the message as described in [Commit messages](CONTRIBUTING.md#commit-messages).
- Commits carry the developer as author and committer, with no agent trailer such as `Co-Authored-By` and no `--author`.
- `git commit`, `git push` and `gh tt deliver` are the developer's. Leave `main` untouched.
- Rebase with `git pull --rebase origin main` when the developer asks for it.
- Run `gh insitu run fix-all` after editing files, since your edits bypass format-on-save.

## Feature flags

Unfinished behaviour that reaches `main` stays behind a feature flag that is off by default. Before you implement an issue, ask the developer whether it needs a flag, and record the answer in the spec. How a flag is built is not decided yet. Until an ADR decides it, agree the approach with the developer.

## Issue workflow

One issue has one spec and no tickets. Each step is a user-invoked skill. The developer starts each session:

| Session | Skills                                 | Produces                                   |
| ------- | -------------------------------------- | ------------------------------------------ |
| 1       | `/mtogo-grill`, then `/mtogo-spec`     | ADRs, glossary terms and the spec          |
| 2       | `/mtogo-implement`                     | Code, tests and the implementation note    |
| 3+      | `/mtogo-review`, one round per session | Review findings, fixes and an updated note |

The developer's guide to the flow is [AI workflow](docs/ai-workflow.md).

## Where things live

- **Issues:** GitHub issues in this repository, on the [project board](https://github.com/orgs/Kanban4sem/projects/1). Read them with `gh issue view <number>`. Work that also changes the backend gets a linked issue in `MTOGO-Backend`.
- **Specs:** `docs/specs/<issue>-<slug>.md`. Format and versioning: [SPEC-FORMAT.md](.agents/skills/mtogo-spec/SPEC-FORMAT.md).
- **ADRs:** `docs/adr/<number>-<slug>.md` with a three-digit number, in the format from [Architecture decisions](CONTRIBUTING.md#architecture-decisions). This replaces `ADR-FORMAT.md` in the `domain-modeling` skill. An ADR lives in the repository that owns the decision. The backend owns the API contract, so decisions that affect both repositories are usually in `MTOGO-Backend`; link to them instead of copying them.
- **Glossary:** `docs/glossary.md`. Wherever a skill names `GLOSSARY.md` or `CONTEXT.md`, use this file.
- **Domain model:** a draft class diagram of the whole domain lives in `MTOGO-Backend` at `docs/domain-model.md`. Read it with `gh api repos/Kanban4sem/MTOGO-Backend/contents/docs/domain-model.md -H "Accept: application/vnd.github.raw"`. It is a starting point, not decided.
- **Shared documents:** CONTRIBUTING, the Definition of Done, the AI workflow, the glossary and the general sections of the coding standards have a copy in `MTOGO-Backend`. When you change one, propose a linked issue there, as described in [Changing the documents](CONTRIBUTING.md#changing-the-documents).

## Changelog

How to change this document is described in [CONTRIBUTING](CONTRIBUTING.md#changing-the-documents).

| Version | Date       | Change                                                                | Issue    |
| ------- | ---------- | --------------------------------------------------------------------- | -------- |
| 1.0     | 2026-11-10 | First version                                                         | MTOGO#32 |
| 2.0     | 2026-11-11 | Moved from `MTOGO`. Feature flags, ADR ownership and shared documents | #3       |
