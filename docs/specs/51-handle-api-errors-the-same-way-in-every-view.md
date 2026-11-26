# Handle API errors the same way in every view

**Version:** 3.0 · **Date:** 2026-11-27 · **Issue:** #51 · **Feature flag:** None. Built after `orderingEnabled` and `authEnabled` were removed (#34, #22)

## Acceptance criteria

Copied from #51. The issue is the source: change the issue first, then this copy.

- [ ] `client.js` gives each error status one Danish message, and no view shows the backend's `detail`
- [ ] Every view that calls the API shows the error reference (`errorId`) on a 5xx
- [ ] A 404 or 409 on the restaurant's status update refreshes the list, with the same message as the delivery view
- [ ] Only `client.js` gives 403 its general message. A view may replace it with a more specific one, as checkout does
- [ ] The coding standards, spec 7 and spec 8 are updated, and the manual checks of each error case are left to #52

## Behaviour

1. When the API refuses a request, the user sees a Danish message chosen by the status code. Maintenance responses use the feature-specific message in behaviour 20.
2. A `400` or `422` says "Oplysningerne blev afvist. Kontrollér dem, og prøv igen."
3. A `403` says "Du har ikke adgang til denne handling."
4. A `404` says "Det, du leder efter, findes ikke længere."
5. A `409` says "Det er ændret i mellemtiden. Opdatér siden, og prøv igen."
6. Any other `4xx` says "Forespørgslen kunne ikke gennemføres."
7. A `5xx` says "Der opstod en serverfejl. Prøv igen senere." followed by "Fejlreference: <errorId>" when the server gives one. A `5xx` without an `errorId` shows no reference.
8. A request that cannot reach the server keeps the existing Danish connection message, with no reference.
9. A view may replace the general message with one that fits its situation, but its replacement is Danish too and never contains the backend's text. On a `5xx` the replacement still shows the error reference.
10. Checkout keeps its own messages for `402`, `403`, `404` and `409`, as spec 8 describes. Every other refusal at checkout shows the general message followed by "Din kurv er gemt.", and on a `5xx` the error reference comes last. A network failure shows the connection message from behaviour 8 followed by "Din kurv er gemt."
11. When a saved delivery address chosen at checkout no longer exists, checkout says "Den valgte adresse findes ikke længere. Din kurv er gemt. Vælg en anden adresse, eller indtast den manuelt."
12. Login and register keep their own messages for `400`, `401`, `404` and `409`. A `403` and any other refusal show the general message, and a network failure shows the client's connection message from behaviour 8.
13. When saving the customer's settings fails, the customer sees the general message, preceded by "Nogle ændringer er gemt." when part of the save succeeded. The reference appears once.
14. When a restaurant user changes an order's status and gets a `404` or `409`, the order list is refreshed and the restaurant user sees "Ordren kan have ændret sig. Listen opdateres.", as a delivery agent does.
15. Any other failed status change shows the general message on the restaurant's orders and on the delivery agent's orders.
16. On a `5xx`, these views show the error reference under their own Danish heading: the restaurant directory and the homepage's featured restaurants, the restaurant's menu, the customer's settings when they fail to load, and the order notifications.
17. On a `5xx`, the order confirmation, the customer's order list and detail, the restaurant's orders and the delivery agent's orders show the error reference with the general message.
18. On a `5xx`, the notices for saved addresses and unread notifications show the error reference after their own Danish text. If the logout request fails, the user lands on the homepage and sees a warning that they are logged out in this browser and that the server did not confirm the session ended. A `5xx` includes the error reference when the server provides it.
19. When logout completes successfully from the navigation bar or dashboard, the homepage shows a confirmation that the user is logged out.
20. When a login, registration or order request returns the maintenance `503` from [ADR-010](https://github.com/Kanban4sem/MTOGO-Backend/blob/main/docs/adr/010-maintenance-mode.md), the affected views immediately show the Danish pause message. The views return when the shared status check sees that the feature has resumed.

## Implementation decisions

- **One mapping:** the API client stays the only code that reads error responses. It maps the status to the Danish message in behaviours 2–8 and adds the reference to the message on a `5xx`. The thrown error keeps `status` and `data`, so `data.detail` stays available for debugging but no view renders it.
- **Shared, not per hook:** the mapping lives in the client rather than the shared request hook from #54, because the hook covers only loads. Status changes, checkout and the settings save call the client directly.
- **Replacing a message:** a view branches on `status`, never on the message text, as the coding standards require. A view that shows its own text on a `5xx` adds the reference through `withErrorReference`, which the client also uses, or shows it alone through `errorReference`. A view that adds text after the general message takes it from the client's `getStatusMessage`, so the reference still comes last.
- **Removed duplicates:** the auth error mapping drops its `403` entry and its own reference. The settings save no longer adds the reference itself, since the message already carries it.
- **Restaurant orders:** a `404` on a status update takes the same path as a `409`, with the delivery view's text.
- **Coding standards:** the frontend errors rule changes. `message` is the Danish message for the status, not the `detail`, and views never show `detail`. It is a rule change, so the coding standards go to 8.0. The section is frontend-only, so the backend needs no linked issue.
- **Specs:** spec 8 (behaviours 24 and 27 and its Errors decision) and spec 7 (its sentence about `detail`) are amended to point here.
- **API:** no change to paths, DTOs or status codes.
- **ADRs:** none. The rule lives in the coding standards.

## Testing decisions

There is no frontend test framework yet. The developer moved the manual checks per view to #52, which introduces a framework soon, and the issue's acceptance criteria say so. A comment on #52 asks for tests of this mapping and the special cases in behaviours 10–14.

- **Mapping in the client:** a throwaway Node script, not committed, runs the client's status mapping over equivalence partitions and boundaries: `400`, `403`, `404`, `409`, `422`, `418` for another `4xx`, `499`, `500` and `599` with and without an `errorId`, and a network failure. It checks that no message contains the `detail` and that only a `5xx` carries the reference (behaviours 1–8). The result is recorded in the implementation note.
- **Lint and build:** `npm run lint` and `npm run build` pass.
- **Logout feedback:** Log out from the navigation bar on the homepage and from the dashboard. Check that the homepage shows “Du er logget ud.” after logout. Repeat with a `500` and a known `errorId` on the logout request. Check that the local session ends and the homepage shows the warning with that reference.

## Out of scope

- The shared notification component and translating messages into the selected language: #41, which builds on this mapping.
- Specific messages for individual `400` cases, which would need a problem type per case from the backend. Not created as an issue; raise it if generic messages prove too vague.
- Manual checks per view and automated tests: #52.

## Further notes

Grilled together with #41, which stays separate. No glossary term: "Fejlreference" is text in the UI, not domain language.

## Implementation notes

<!-- Written by /mtogo-implement and /mtogo-review. -->

### Spec 1.0 - 2026-11-26 - #51

- **Built:** The API client maps each error status to the Danish messages in behaviours 2–8 and ends a `5xx` message with "Fejlreference: <errorId>" when the server gives one. The backend's `detail` stays in the error's data and no view renders it. A shared `withErrorReference` adds the reference to the client's message and to the text of views with their own text, and `errorReference` gives the reference alone where a view shows it under its own heading: the restaurant directory and featured restaurants, the menu, the settings load and the order notifications, and to the notices for saved addresses that checkout could not load, notifications that could not be marked as read and a logout from the navigation bar that could not end the session on other devices (behaviour 18). Checkout shows the general message plus "Din kurv er gemt." for every status it has no message of its own for, with the reference last on a `5xx`, and its own text for a deleted saved address. The auth error mapping keeps only `400`, `401`, `404` and `409` and otherwise uses the client's message. The settings save no longer adds the reference itself. A `404` on the restaurant's status update refreshes the list like a `409`, with the delivery view's message. The coding standards' frontend errors rule is at 8.0.
- **Deviations:** None.
- **Tests:** A throwaway Node script, not committed, ran the client against a stubbed `fetch` for `400`, `403`, `404`, `409`, `422`, `418`, `499`, `500` and `599` with and without an `errorId`, and a network failure. All 12 cases passed: no message contained the `detail`, only a `5xx` with an `errorId` carried the reference, and `status` and `data.detail` were kept. `npm run lint` and `npm run build` pass. Manual checks per view are left to #52, as decided.
- **Follow-up:** None.

### Spec 2.0 - 2026-11-26

- **Built:** The shared logout flow shows a confirmation on success or a warning if the server does not confirm the session ended. Both messages appear on the homepage after navigating away from the page where logout started.
- **Tests:** See the logout feedback checks above.

### Spec 3.0 - 2026-11-27 - #69

- **Built:** The client identifies the paused feature on each of the three affected requests. The forms update the shared pause state to show the same Danish inline notice as the status check. Other errors keep their normal handling.
- **Tests:** The maintenance checks in [spec 8](8-place-and-pay-for-an-order.md#testing-decisions) cover a pause during use and ordinary `503` responses.

## Changelog

| Version | Date       | Change                                                   | Issue |
| ------- | ---------- | -------------------------------------------------------- | ----- |
| 1.0     | 2026-11-26 | First version                                            | #51   |
| 2.0     | 2026-11-26 | Show logout feedback on the homepage                     | -     |
| 3.0     | 2026-11-27 | Show the Danish pause message for a maintenance response | #69   |
