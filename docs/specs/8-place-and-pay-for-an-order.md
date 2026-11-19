# Place and pay for an order

**Version:** 1.0 · **Date:** 2026-11-19 · **Issue:** #8 · **Feature flag:** `orderingEnabled`, off by default

## Acceptance criteria

Copied from #8. The issue is the source: change the issue first, then this copy.

- [ ] A customer can order menu items to a delivery address
- [ ] The customer sees the order total before paying
- [ ] An order is placed only when the mocked payment is confirmed

## Behaviour

1. The basket, the checkout and the order confirmation are shown only when `orderingEnabled` is on. When it is off or unset, the menu page looks as it does today and the checkout and confirmation addresses show the not-found page.
2. Logging in at checkout also needs `authEnabled`. When it is off, a logged-out user at checkout is told that ordering needs login, with no link to log in.

3. Anyone can add a menu item to the basket from the restaurant's menu page, logged in or not.
4. A basket holds menu items from one restaurant. Adding a menu item from another restaurant asks the customer whether to empty the basket and start a new one; declining leaves the basket unchanged.
5. A menu item appears once in the basket. Adding it again raises its quantity.
6. A basket has at most 20 menu items, each with a quantity of 1–20. The basket states these limits. At a limit, the add and increase buttons are disabled and a message, announced to screen readers, explains why.
7. The customer can raise and lower a quantity and remove a menu item. Lowering a quantity of 1 removes the menu item.
8. The basket shows the basket total: menu price times quantity over its menu items, in DKK.
9. The basket survives a page refresh and the detour through login.
10. On desktop, the menu page shows the basket as a sticky side panel next to the menu items. On mobile, it shows a sticky bottom bar with the number of items and the basket total that leads to checkout.
11. The navigation bar shows a basket link with the number of items while the basket is not empty.

12. A logged-out user who opens checkout is sent to login and, after logging in, back to checkout with the basket intact. Login without a return address, or with one outside the app, goes to the homepage.
13. A logged-in user who is not a customer sees that only customers can order, and no checkout form.
14. A customer with an empty basket sees that the basket is empty, with a link to the restaurants.
15. A customer sees the basket's menu items, can change quantities and remove items, and sees the basket total before paying, labelled as a preview.
16. A customer enters a delivery address: street, postal code and city. The country is shown as Denmark and cannot be changed.
17. A delivery address is refused before sending when the street or city is blank or longer than 100 characters, or the postal code is not exactly four digits. Each field shows its own message.
18. A customer chooses between paying by card (simulated), the default, and simulating a declined payment. Under card payment, card number, expiry date and CVC fields are shown but disabled, with the note that the payment is simulated and no money is taken.
19. "Betal og bestil", followed by the basket total, places the order. While the request runs, the button reads "Afgiver ordren…" and is disabled, so the order is not placed twice.

20. When the payment is confirmed, the basket is emptied and the customer sees the order confirmation with the order number, the order lines with name, unit price, quantity and subtotal, the order total calculated by the backend, the delivery address and the order status Placed in Danish.
21. The order confirmation keeps the full order after a refresh, since the browser keeps it in the page's history. Opened without it, as in a new tab or from a pasted address, it shows only that the order with its number is placed, since the order cannot be read back yet.
22. When the payment is declined, no order is placed, the basket is kept, and the customer is told the payment was declined and can try again.
23. When a menu item is no longer available, or its menu or restaurant no longer accepts orders, the basket is kept and the customer is told so, with a link back to the restaurant's menu.
24. When the backend refuses the input, the basket is kept and its message is shown.
25. When the session has expired, the user is sent to login with a message that the session has expired, and back to checkout, with the basket kept. Logging out shows no such message.
26. When the user is not a customer, or ordering is switched off on the server, the basket is kept and a Danish message explains it.
27. When the server fails or cannot be reached, the basket is kept and a Danish message asks the customer to try again. A server failure shows its error reference when the server gives one. A page that shows an error message gives a Danish message for a network failure instead of the browser's.

## Implementation decisions

- **Flag:** every ordering view and route checks `orderingEnabled` through the existing feature-flag hook. A missing flag counts as off, so the frontend check must be removed before or together with the backend flag: #34 and Kanban4sem/MTOGO-Backend#44.
- **API:** a new order endpoint function calls `POST /v1/orders` through the existing client, with the customer's Bearer token. The request has `lines` (`menuItemId`, `quantity`), `deliveryAddress` (`street`, `postalCode`, `city`) and `paymentToken`. Prices and the country are never sent. A `201` returns the order (`id`, `restaurantId`, `status`, `channel`, `placedAt`, `total`, `deliveryAddress` with `country`, and `lines` with `menuItemId`, `name`, `unitPrice`, `quantity`, `subtotal`). Errors are ProblemDetail: `400` invalid input, `401` not logged in, `402` declined, `403` not a customer, `404` flag off, `409` not orderable. There is no `Location` header; the confirmation is found by `id`. The contract is owned by Kanban4sem/MTOGO-Backend#15 and is unchanged.
- **Payment token:** card payment sends `mock-card`; the simulated decline sends `decline`.
- **Basket:** a shared basket provider and hook, since the navigation bar, the menu page and checkout all use it. It holds the restaurant, and for each menu item its ID, name, price and quantity, and enforces the rules in behaviours 4–7. It is stored in `localStorage` under one key, read defensively, and emptied only after a `201`. The basket total uses the menu prices from `GET /v1/restaurants/{id}/menus`.
- **Order feature:** checkout and the order confirmation live in a new order feature; the add controls and the basket panel join the restaurant menu feature. Features share code only through the shared folder.
- **Routes:** `/checkout` and `/orders/:orderId` under the home layout. The confirmation receives the `201` response in router state.
- **Login return:** login reads a return address from router state and goes there after logging in, falling back to the homepage. Only paths inside the app are accepted, so a crafted link can't send the user to another site. A shared route guard sends a logged-out user to login with the current address and whether the session expired; checkout is behind it.
- **Errors:** the client handles `401` and `403` in one place, as the coding standards require: a `401` clears the session and marks it expired, the route guard sends the user to login, and a `403` gets one Danish message. At checkout a `403` can only mean the account is not a customer, so checkout replaces that message with one saying only customers can order (behaviour 26). Checkout maps the other status codes to the Danish messages in behaviours 22–27; `400` shows the backend's `detail`, and a `5xx` adds the `errorId` as the error reference. The client catches a failed `fetch` and throws a Danish connection message, so every page that shows the error message benefits.
- **Order status:** a shared constants module maps all six order status codes to Danish: PLACED Afgivet, ACCEPTED Accepteret, REJECTED Afvist, READY Klar, PICKED_UP Afhentet, DELIVERED Leveret. Later issues reuse it so the names don't drift.
- **Design:** the existing design tokens, `--mtogo-border-radius`, buttons, inputs, request states and CSS modules, matching the current menu page. Layouts work on mobile and desktop, every control works by keyboard, and reduced-motion preferences are respected.
- **ADRs:** [ADR-001](https://github.com/Kanban4sem/MTOGO-Backend/blob/main/docs/adr/001-feature-flags.md) applies. No new ADR.

## Testing decisions

There is no frontend test framework yet, so `npm run lint` passes and these manual checks run against the API with `orderingEnabled` and `authEnabled` on unless stated:

- **Flag:** with `orderingEnabled` on, off and unset, the basket, navigation link, checkout and confirmation appear only when on (behaviour 1). With `authEnabled` off, checkout shows no login link (2).
- **Basket rules:** add, raise, lower and remove; adding the same menu item again; a menu item from a second restaurant asks first, and declining keeps the basket; 20 menu items and quantity 20 disable the buttons with the message; the basket total; a refresh keeps the basket (3–9, 11).
- **Access:** checkout logged out goes to login and back with the basket; a customer sees the form; a restaurant user sees the customers-only message; an empty basket shows the empty state; plain login still goes to the homepage (12–14).
- **Confirmed payment:** a `201` empties the basket and shows the confirmation with the backend's order total and status Afgivet; a refresh keeps the confirmation, and the confirmation address opened in a new tab shows only the order number (15, 18–21).
- **Declined payment:** the simulated decline gives the declined message and keeps the basket (22).
- **Address:** blank street and city, 101 characters, and postal codes `123`, `12345` and `12a4` are refused in the browser; 100 characters and `1234` are accepted (16–17). A `400` from the backend, sent by bypassing the browser checks, shows its message (24).
- **Errors:** an item made unavailable during checkout gives the `409` message with a link to the menu (23); a removed token gives the login detour with the expired-session message, and logging out and in again shows no such message (25); the API stopped gives the Danish connection message at checkout (27).
- **Layout:** mobile and desktop widths, keyboard-only use, and the disabled card fields (10, 18).

## Out of scope

- Reading orders, order tracking and the `Location` header: #11, Kanban4sem/MTOGO-Backend#18 and #46. #11 has a comment to load the confirmation from the API.
- Prefilling the delivery address from the customer's details: #14 has a comment.
- Real payment and card input.
- Delivery fees, service fees and commission.
- A frontend test framework.
- Removing the flag: #34, with Kanban4sem/MTOGO-Backend#44.
- Copying **Basket** and **Basket total** to the backend glossary: Kanban4sem/MTOGO-Backend#54.

## Further notes

The grilling added **Basket** and **Basket total** to the glossary. The ordering terms from Kanban4sem/MTOGO-Backend#15 were already copied.

## Implementation notes

<!-- Written by /mtogo-implement and /mtogo-review. -->

### Spec 1.0 - 2026-11-19 - #8

- **Built:** A shared basket: pure basket rules (one restaurant, one line per menu item, at most 20 menu items with a quantity of 1–20, basket total summed in øre, limit messages), a BasketProvider and `useBasket` that store the basket in `localStorage` under `mtogo:basket` and read it defensively. A shared BasketSummary shows the basket's menu items with quantity controls, the limits, a live limit message and the basket total, and is reused by the menu page and checkout. The restaurant menu feature gains add buttons with the reason when blocked, a sticky basket side panel on desktop, a sticky bottom bar on mobile that states the limits until one is reached, and a dialog that asks before starting a new basket for another restaurant. The navigation bar shows a basket link with the number of items. A new order feature holds checkout (delivery address with per-field messages, Denmark fixed, simulated card or decline, "Betal og bestil" disabled while placing the order, Danish messages per status code) and the order confirmation. An order service and `POST /v1/orders` endpoint send only menu item IDs, quantities, the delivery address and the payment token. Login goes to a return address from router state, limited to paths inside the app, and keeps it when the user goes on to register and back. The client turns a failed `fetch` into a Danish connection message. On a `401` to an authenticated request it clears the session, also when the token was removed by hand, but not when the token was replaced while the request ran. The session counts as expired only when a user was logged in, so a stale token at startup gives a plain login later; it gives a `403` one Danish message, which checkout replaces with one saying only customers can order. A route guard, `ProtectedRoutes` in the app's routes folder, wraps the checkout page and sends a logged-out user to login with the current address as the return address, and login says when the session has expired; checkout keeps only its customer and empty-basket checks. A second guard, `FeatureFlagRoute`, shows a loading state while the flags load and the not-found page while a flag is off. A second submit in the same tick is stopped by a ref, since state only updates on the next render. Shared modules name the six order statuses and the country in Danish, the user roles, and the checkout, menu and confirmation addresses and routes. One basket rule decides whether a menu item can be added and which limit stops it, and the reason on a blocked add button reads from it. The basket's Danish text (its limits, item count, limit messages and the reason an add button is blocked) lives in its own module beside the basket rules. The menu page's side panel and bottom bar are separate components, and both state the limits when the basket is empty. `/checkout` and `/orders/:orderId` show the not-found page, now its own page, unless `orderingEnabled` is on. Every view gates on the flag through `useFeatureFlags`.
- **Deviations:** Behaviour 21 assumed a refresh drops the order from router state, but the browser keeps it in history. The developer chose to keep the full confirmation after a refresh. Behaviour 21 and its check were corrected in place at 1.0, since the spec isn't on `main`. To reuse components rather than copy styles, the shared Button gained a `secondary` variant, Input gained an `error` prop with `aria-invalid` and `aria-describedby`, and `globals.css` gained a `visuallyHidden` class. The delivery address and card fields are configs rendered by FormFields, like login and register. The flags load after startup, so the feature-flag hook gained a loading state, which `FeatureFlagRoute` waits for; AuthLayout still shows its not-found page until they arrive. Register passes the return address back to login. With the flag off, the menu page renders the price as before, without the wrapper the add button needs. A few small touches beyond the behaviours: checkout has a "Tilføj flere retter" link back to the menu and the note "Vi leverer kun i Danmark.", the basket names its restaurant ("Fra …"), every checkout failure and the message shown when login is unavailable add "Din kurv er gemt.", and the add button reads "Tilføj én mere (n)" once the menu item is in the basket.
- **Tests:** `npm run lint` and `npm run build` pass. The basket rules, including which limit stops an add, the reason for a blocked add button and the item count were checked at their boundaries with throwaway Node scripts (not committed). The API side was checked through the dev server's proxy with the request checkout sends: card payment gives `201` with the backend's total and status `PLACED`, the simulated decline `402`, a missing, invalid or logged-out token `401`, a street of 101 characters, postal code `123` and quantity 21 `400`, and a street of 100 characters and quantity 20 `201`. The checks in the browser, the flag switched off or unset, and the `409` for an unavailable menu item, which the API cannot set up, are for the developer to run. The checks that need a non-customer account (behaviours 13 and 26) moved to #9 and #10, since no restaurant or delivery agent account can be made yet.
- **Follow-up:** #35 puts the profile page behind the same route guard. #9 and #10 have comments with the checks for a restaurant user and a delivery agent. Kanban4sem/MTOGO-Backend#55 seeds data that gives a `409` locally, so the check for behaviour 23 can run.

## Changelog

| Version | Date       | Change        | Issue |
| ------- | ---------- | ------------- | ----- |
| 1.0     | 2026-11-19 | First version | #8    |
