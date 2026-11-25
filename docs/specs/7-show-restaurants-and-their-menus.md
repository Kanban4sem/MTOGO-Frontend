# Show restaurants and their menus

**Version:** 2.0 · **Date:** 2026-11-25 · **Issue:** #7 · **Feature flag:** None, as agreed for the restaurant feature

## Acceptance criteria

- A customer can see the restaurants that accept orders.
- The homepage features up to two restaurants. The main navigation and homepage call to action open the full restaurant directory at `/restaurants`.
- A customer can see a restaurant's menu items with prices.

## Behaviour

1. The homepage shows a hero, a Trusted By section with six restaurant chain names and up to two featured restaurants. The directory at `/restaurants` lists all restaurants accepting orders.
2. Restaurant cards show the name, a preview image and a description from the API when available. The Se udvalg link sits to the right of the name and description. Prices appear in the restaurant menu.
3. Clicking a restaurant opens its own address at /restaurant/{restaurantId}/menu. Direct visits and browser back navigation use standard links and the existing server fallback.
4. The restaurant page displays its name, active menu titles and descriptions, available menu items with images on the left, descriptions and DKK prices.
5. Loading, empty results, unavailable restaurants and failed requests have Danish messages. Failed images fall back to the existing placeholder.
6. Layouts adapt to narrow screens. Links support keyboard focus, a skip link is provided, and reduced-motion preferences are respected.

## Implementation decisions

- Endpoint functions live under api/endpoints and use the existing client, which remains the only HTTP implementation. ProblemDetail detail is included in client error messages.
- The shared restaurant service supplies both homepage previews and restaurant details. React hooks own loading state and cancel requests when their components unmount.
- GET /v1/restaurants supplies the directory; GET /v1/restaurants/{restaurantId}/menus supplies active menus and available items. Image paths resolve against the frontend origin.
- The homepage and directory share a restaurant listing component. The homepage uses the first two eligible restaurants in API order. The menu page uses the shared restaurant service and image rendering.
- The original navbar, account components, providers and React Router dependency are restored from the existing customer-account branch, preserving the original navigation and login actions. Restaurant pages are integrated with those routes. Refreshing a menu URL relies on the existing index.html fallback.
- Original MTOGO design tokens are restored in :root alongside the page tokens. Every rounded component uses the same --mtogo-border-radius token (0.25rem), including cards, images, buttons, navigation and request states. Component styles use CSS modules.
- Trusted By shows Subway, Domino’s, KFC, Burger King, Pizza Hut and McDonald’s as example brand names.
- The original navbar retains the new logo. Restaurant cards use a subtle hover shadow without movement or image scaling. Status pills, arrow circles, the banner icon and the decorative menu stamp are removed. Menu items use a hover shadow defined in :root.
- Backend files are unchanged.

## Verification

- Open `/restaurants` directly and through each homepage entry point. Verify the directory lists the restaurants that accept orders and the homepage shows up to two.
- Open a restaurant from a card and use browser back to return. Check card alignment on mobile and desktop.
- Verify the loading, empty and retry states on the directory.

## Out of scope

Ordering, basket, payment, authentication and backend changes.

## Implementation notes

- Implemented the homepage, restaurant menu pages, API integration, responsive styles and request states.
- Initial names, prices and menu contents come from backend seed data, with no fallback restaurant fixtures in the UI.

### Spec 2.0 - 2026-11-25 - Homepage follow-up

- **Built** the public directory, its navigation links and a shared card layout for the directory and homepage.
- **Tests** include frontend lint, build and the browser checks listed above.

## Changelog

| Version | Date       | Change                                      | Issue              |
| ------- | ---------- | ------------------------------------------- | ------------------ |
| 2.0     | 2026-11-25 | Add the public directory and featured cards | Homepage follow-up |
| 1.0     | 2026-11-15 | Initial restaurant browsing spec            | #7                 |
