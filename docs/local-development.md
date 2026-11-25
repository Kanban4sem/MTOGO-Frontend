# Local Development

How to run the frontend on your own machine against the backend. Set up the dev container first, as described in [Getting started](getting-started.md).

## Run the frontend

```bash
npm run dev      # dev server on http://localhost:5173
```

The app calls the API on the relative path `/v1` (set in `src/api/client.js`). In development, the Vite dev server forwards `/v1` to the backend on `http://localhost:8080`, so start the backend first, as described in the backend's [local development](https://github.com/Kanban4sem/MTOGO-Backend/blob/main/docs/local-development.md) guide.

## Feature flags

The backend declares the feature flags, and the frontend reads them from `GET /v1/features` at startup. How the frontend uses them is described in the [coding standards](coding-standards.md#feature-flags). To try a feature behind a flag, such as `authEnabled`, switch it on in the backend's `.env` as described under [Feature flags and login](https://github.com/Kanban4sem/MTOGO-Backend/blob/main/docs/local-development.md#feature-flags-and-login), restart the backend and reload the page.

## Try the API

The API the frontend calls is documented in Swagger UI, as described under [API documentation](coding-standards.md#api-documentation). The behaviour behind the pages is in the specs in [`docs/specs/`](specs/), such as [restaurants and their menus](specs/7-show-restaurants-and-their-menus.md) and [placing and paying for an order](specs/8-place-and-pay-for-an-order.md).

## Docker image

Build the app first, then the image:

```bash
npm run build
docker build -t mtogo-frontend .
docker run -p 8081:80 mtogo-frontend
```

The app is now on `http://localhost:8081`. nginx serves `dist/` and sends unknown paths to `index.html`, so React Router handles deep links. After a few seconds `docker ps` shows the container as `healthy`. API calls to `/v1` only work behind the reverse proxy on the server.
