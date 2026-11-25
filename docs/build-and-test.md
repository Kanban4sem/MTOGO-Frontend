# Build and Test

How to lint and build the frontend, and how changes are checked. How changes are tested is described in the [coding standards](coding-standards.md#testing).

## Lint and build

```bash
npm run lint     # ESLint
npm run build    # production build in dist/
```

## Tests

There is no test framework yet. Until one is chosen, a change to behaviour is covered by `npm run lint` passing and manual checks against the running API, as the [coding standards](coding-standards.md#frontend-tests) describe. When the issue has a spec, the checks are listed in it.

## Quality checks

`gh insitu run trunk-worthy` runs spelling, Markdown, formatting, lint and build, the same way as the pre-commit hook and the ready flow. The checks are described under [Quality gates](../CONTRIBUTING.md#quality-gates).
