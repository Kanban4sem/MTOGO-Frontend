# Coding Standards

**Version:** 2.0 · **Date:** 2026-11-11

## Overview

These standards keep the code consistent, readable and easy to change. This copy covers the frontend. `MTOGO-Backend` has its own copy with the backend rules.

The general rules under [Naming](#naming), the sections [REST API and JSON](#rest-api-and-json), [Documentation files](#documentation-files) and [Comments](#comments) (apart from the Javadoc rule, which is backend only) are shared with `MTOGO-Backend`. Change them through a linked issue in both repositories, as described in [CONTRIBUTING](../CONTRIBUTING.md#changing-the-documents).

| Source                                      | Answers                                   |
| ------------------------------------------- | ----------------------------------------- |
| [CONTRIBUTING](../CONTRIBUTING.md)          | How do we work and deliver?               |
| [Definition of Done](definition-of-done.md) | When is an issue finished?                |
| This document                               | How do we structure, write and test code? |
| `.editorconfig`                             | How is code formatted?                    |

Exact versions live in `package.json`. Technology choices are recorded as ADRs in `docs/adr/`, or in `MTOGO-Backend` when they affect both repositories. Add or upgrade a dependency only through an issue the team has agreed on, and prefer what the project already has.

Good design reduces complexity. If a rule here makes the code more complicated, propose a change as described in [CONTRIBUTING](../CONTRIBUTING.md#changing-the-documents).

## Formatting

- `.editorconfig` is the source of truth for indentation, line endings, encoding and line length.
- Prettier formats JavaScript, CSS and Markdown. ESLint checks JavaScript.
- Format the code you change, but do not reformat unrelated code.
- Change formatting rules only in `.editorconfig` or the tool configuration, in a separate issue.

## Naming

Names describe what something is or does in domain language. One concept keeps one name in every layer (`Order` → `OrderDTO` → `/orders`). Avoid abbreviations and vague names such as `data`, `info`, `handle` or `manager`. If a good name is hard to find, the design is probably unclear.

### JavaScript and React

| Element                   | Convention               | Example                   |
| ------------------------- | ------------------------ | ------------------------- |
| Component file and folder | PascalCase, `.jsx`       | `OrderList/OrderList.jsx` |
| Component styles          | Same name, `.module.css` | `OrderList.module.css`    |
| Route-level component     | `Page` suffix            | `OrderDetailPage`         |
| Layout component          | `Layout` suffix          | `AppLayout`               |
| Form component            | `Form` suffix            | `LoginForm`               |
| Context                   | `<Name>Context.jsx`      | `AuthContext.jsx`         |
| Service                   | `<feature>Service.js`    | `orderService.js`         |
| Hook                      | `use` + PascalCase       | `useAuth`                 |
| Other modules             | camelCase `.js`          | `dateHelpers.js`          |
| Variable, function        | camelCase                | `orderList`               |
| Constant                  | UPPER_SNAKE_CASE         | `BASE_URL`                |
| Feature folder            | kebab-case               | `features/order-history/` |

### REST API and JSON

- **Paths:** lowercase plural nouns, kebab-case for more than one word (`/orders`, `/menu-items/{id}`). The HTTP method carries the action.
- **JSON fields:** camelCase (`deliveryAddress`).
- **Enum values:** UPPER_SNAKE_CASE (`IN_DELIVERY`).
- **Dates:** `YYYY-MM-DD`. **Timestamps:** ISO-8601.

### Documentation files

- Files in the repository root that GitHub or other tools look for by name are UPPERCASE: `README.md`, `CONTRIBUTING.md`, `AGENTS.md`, `LICENSE`.
- Everything in `docs/` is lowercase kebab-case: `definition-of-done.md`, `coding-standards.md`.
- ADRs are numbered: `docs/adr/001-framework.md`.

## Architecture

The code follows [Presentation Domain Data Layering](https://martinfowler.com/bliki/PresentationDomainDataLayering.html): the code is organised by feature first, with presentation, domain and data layers inside each feature.

### Frontend structure

```text
src/
├── api/                           client.js: the only place that talks HTTP, /endpoints for SoC
├── app/                           App, layouts, routes, app-wide pages
├── features/
│   └── <page>/                    SoC & Layers
│       └── <feature>/             Components belonging to a page, .module.css, .hooks.js (logic)
└── shared/                        Components, hooks, context, data, styles and utils used by more than one feature
```

- **Components render, services fetch.** Components never call `fetch`. They use their feature's `services/<feature>Service.js`, which uses `client.js`.
- **Features do not import from each other.** Anything used by more than one feature moves to `shared/`.
- Use absolute imports with the `@/` prefix.
- The OpenAPI specification is the contract between the repositories (see [API documentation](#api-documentation)).

## Comments

- Code shows what and how. Comments say what the code cannot: why, assumptions, constraints, domain rules and non-obvious choices.
- If a comment repeats the next line, delete it or improve the name.
- No divider or section comments - If a class needs sections, split it.
- Update comments in the same commit as the code they describe.
- No commented-out code.
- No `TODO` or `FIXME` - Create an issue instead.

## Error handling

The backend returns errors as [`ProblemDetail`](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-ann-rest-exceptions.html) (RFC 9457). 4xx responses carry a `detail` that is safe to show. 5xx responses are always generic and carry an `errorId`. The rules that produce them are in the backend's coding standards.

### Frontend errors

- `src/api/client.js` is the only place that reads error responses. It throws an `Error` with `message` (the `detail` of the `ProblemDetail`), `status` and `data`.
- Branch on `status`, never on the text of `message`.
- `401` and `403` are handled in one place, not in each component.
- Show users a friendly message. Include the `errorId` in bug reports so the log entry can be found.

## Testing

Every change ships with tests. The [Definition of Done](definition-of-done.md) requires that behaviour is covered. This section defines how.

### Frontend tests

There is no test framework yet. Until one is chosen, `npm run lint` must pass and the change is checked manually against the running API.

## API documentation

The backend generates the API documentation with springdoc-openapi. The specification is served at `/v3/api-docs` and Swagger UI at `/swagger-ui.html`. It is the contract between the repositories.

- Build against the specification, not against the backend's code.
- A frontend change that needs a change to the API gets a linked issue in `MTOGO-Backend` (see [Issues](../CONTRIBUTING.md#issues)).

## Changelog

| Version | Date       | Change                                  | Issue    |
| ------- | ---------- | --------------------------------------- | -------- |
| 1.0     | 2026-11-10 | First version                           | -        |
| 1.1     | 2026-11-10 | API changes get a linked frontend issue | MTOGO#32 |
| 1.2     | 2026-11-10 | Fixes to Frontend Architecture          | MTOGO#33 |
| 2.0     | 2026-11-11 | Moved from `MTOGO`, frontend rules only | #3       |
