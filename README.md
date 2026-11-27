# MTOGO-Frontend

MTOGO is a food delivery platform. Customers order food from local restaurants and pay online, restaurants accept and prepare the orders, and delivery agents bring them to the customer's door. The customer can follow each order from payment to delivery.

This repository holds the frontend: the MTOGO website that customers, restaurants and delivery agents use. It gets all its data from the REST API in [MTOGO-Backend](https://github.com/Kanban4sem/MTOGO-Backend).

## What the frontend does

- **Customers** browse restaurants and their menus, fill a basket and pay at checkout, with a saved or new delivery address. Under **Din profil** they follow their orders and manage their name, phone number and delivery addresses.
- **Notifications:** the bell in the navigation bar shows customers each change to an order's status, and keeps the messages after they are read.
- **Restaurants** see their account details and a list of their orders, newest first. They accept or reject new orders and mark them as ready.
- **Delivery agents** take orders that are ready for pickup from their dashboard, mark them as picked up and delivered, and see their active and completed deliveries.
- **Feature flags:** the backend decides which features are switched on, and the website shows only those.

What the first release contains, and the order status lifecycle, are described in the [minimum viable product](docs/minimum-viable-product.md). The words we use for the domain are in the [glossary](docs/glossary.md).

## Technology

React 19 and Vite. The website is served by nginx as a Docker image on [stage](https://stage.mtogo.saldic.dev) and [prod](https://mtogo.saldic.dev), behind the same host as the backend.

## Getting started

We work with Kanban and trunk-based development using [TakT](https://github.com/devx-cafe/gh-tt) and [InSitu](https://github.com/devx-cafe/gh-insitu). Every change starts as an issue on our [board](https://github.com/orgs/Kanban4sem/projects/1) and ends as exactly one commit on `main`.

- [Getting started](docs/getting-started.md): set up your machine and the dev container
- [Local development](docs/local-development.md): running the frontend against the backend, feature flags and the Docker image
- [Build and test](docs/build-and-test.md): lint, build and how changes are checked
- [Deployment](docs/deployment.md): stage, releasing to prod and rolling back

The dev container runs `npm ci` before VS Code starts checking spelling. The Danish cSpell dictionary is a project dev dependency loaded from `node_modules`. GitHub Actions installs the same dependencies from `package-lock.json` before running cSpell.

## How we work

- [CONTRIBUTING](CONTRIBUTING.md): issues, workflow, commit messages, quality gates and ADRs
- [Coding standards](docs/coding-standards.md) and [Definition of Done](docs/definition-of-done.md)
- [AI workflow](docs/ai-workflow.md) and [`AGENTS.md`](AGENTS.md): how we work with AI agents
- [Minimum viable product](docs/minimum-viable-product.md): what the first release contains and the order status lifecycle
