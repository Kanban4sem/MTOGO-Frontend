# Show restaurants and their menus

**Version:** 1.0 · **Date:** 2026-11-15 · **Issue:** #7 · **Feature flag:** None, as agreed for the restaurant feature

## Acceptance criteria

- A customer can see the restaurants that accept orders.
- A customer can see a restaurant's menu items with prices.

## Behaviour

1. The homepage shows a Hero with text and an undecorated image, a TrustedBy section with six monochrome example company wordmarks and a restaurant directory. No pre-headings or decorative hero captions are displayed.
2. Only restaurants accepting orders are displayed. Restaurant names, item previews, descriptions, prices and preview images come from the API.
3. Clicking a restaurant opens its own address at /restaurant/{restaurantId}/menu. Direct visits and browser back navigation use standard links and the existing server fallback.
4. The restaurant page displays its name, active menu titles and descriptions, available menu items with images on the left, descriptions and DKK prices.
5. Loading, empty results, unavailable restaurants and failed requests have Danish messages. Failed images fall back to the existing placeholder.
6. Layouts adapt to narrow screens. Links support keyboard focus, a skip link is provided, and reduced-motion preferences are respected.

## Implementation decisions

- Endpoint functions live under api/endpoints and use the existing client, which remains the only HTTP implementation. ProblemDetail detail is included in client error messages.
- The shared restaurant service supplies both homepage previews and restaurant details. React hooks own loading state and cancel requests when their components unmount.
- GET /v1/restaurants supplies the directory; GET /v1/restaurants/{restaurantId}/menus supplies active menus and available items. Image paths resolve against the frontend origin.
- Homepage components live under features/home-page; menu components under features/restaurant-menu. Shared services, formatting, image rendering and request states are reused without imports between features.
- The original navbar, account components, providers and React Router dependency are restored from the existing customer-account branch, preserving the original navigation and login actions. Restaurant pages are integrated with those routes. Refreshing a menu URL relies on the existing index.html fallback.
- Original MTOGO design tokens are restored in :root alongside the page tokens. Every rounded component uses the same --mtogo-border-radius token (0.25rem), including cards, images, buttons, navigation and request states. Component styles use CSS modules.
- TrustedBy wordmarks are fictional, with opacity 0.7 and opacity 1 on hover. The visible example-company caption is removed at the developer's request. Replace with approved partner logos when available.
- The original navbar retains the new logo. Restaurant cards use a subtle hover shadow without movement or image scaling. Status pills, arrow circles, the banner icon and the decorative menu stamp are removed. Menu items use a hover shadow defined in :root.
- Backend files are unchanged.

## Verification

The developer requested no build, tests or subsequent verification commands and will check the result locally. No build, lint or tests were run.

## Out of scope

Ordering, basket, payment, authentication and backend changes.

## Implementation notes

- Implemented the homepage, restaurant menu pages, API integration, responsive styles and request states.
- Initial names, prices and menu contents come from backend seed data, with no fallback restaurant fixtures in the UI.
