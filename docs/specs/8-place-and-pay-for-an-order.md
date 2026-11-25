# Place and pay for an order

**Version:** 7.0 · **Date:** 2026-11-25 · **Issue:** #8 · **Feature flag:** none; `orderingEnabled` from #8 was removed in #34 and `authEnabled` in #22

## Acceptance criteria

Copied from #8. The issue is the source: change the issue first, then this copy.

- [ ] A customer can order menu items to a delivery address
- [ ] The customer sees the order total before paying
- [ ] An order is placed only when the mocked payment is confirmed

## Behaviour

1. The basket, the checkout, the order confirmation and the order views are always shown, without a feature flag.
2. Logging in at checkout is always available, without a feature flag.

3. Anyone can add a menu item to the basket from the restaurant's menu page, logged in or not.
4. A basket holds menu items from one restaurant. Adding a menu item from another restaurant asks the customer whether to empty the basket and start a new one; declining leaves the basket unchanged.
5. A menu item appears once in the basket. Adding it again raises its quantity.
6. A basket has at most 20 menu items, each with a quantity of 1–20. The basket states these limits. At a limit, the add and increase buttons are disabled and a message, announced to screen readers, explains why.
7. The customer can raise and lower a quantity and remove a menu item. Lowering a quantity of 1 removes the menu item.
8. The basket shows the basket total: menu price times quantity over its menu items, in DKK.
9. The basket survives a page refresh and the detour through login. Explicitly signing out clears the basket.
10. On desktop, the menu page shows the basket as a sticky side panel next to the menu items. On mobile, it shows a sticky bottom bar with the number of items and the basket total that leads to checkout.
11. The navigation bar shows a basket link with the number of items to guests and signed-in customers with a nonempty basket.

12. A logged-out user who opens checkout is sent to login and, after logging in, back to checkout with the basket intact. Login without a return address, or with one outside the app, goes to the homepage.
13. A logged-in user who is not a customer sees that only customers can order, and no checkout form.
14. A customer with an empty basket sees that the basket is empty, with a link to the restaurants.
15. A customer sees the basket's menu items, can change quantities and remove items, and sees the basket total before paying, labelled as a preview.
16. Checkout shows the customer's name and lists all saved delivery addresses. A complete default is selected automatically when present. The customer can choose any saved address or enter another one. A profile with only a postal code and city fills those fields for manual entry. The country is fixed to Denmark.
17. An entered delivery address is refused before sending when the street or city is blank or longer than 100 characters, or the postal code is not exactly four digits. Each field shows its own message. An entered address applies to the current order. The customer can also choose to save it as the default, which takes effect after successful payment.
18. A customer chooses between paying by card (simulated), the default, and simulating a declined payment. Under card payment, card number, expiry date and CVC fields are shown but disabled, with the note that the payment is simulated and no money is taken.
19. "Betal og bestil", followed by the basket total, places the order. While the request runs, the button reads "Afgiver ordren…" and is disabled, so the order is not placed twice.

20. When the payment is confirmed, the basket is emptied and the customer sees the order confirmation with the order number, the order lines with name, unit price, quantity and subtotal, the order total calculated by the backend, the delivery address and the order status Placed in Danish.
21. The order confirmation loads the order from the API, so it shows the same order after a refresh, in a new tab or from a pasted address. An unknown order, another customer's order or an order number that isn't a number shows "Ordren blev ikke fundet".
22. When the payment is declined, no order is placed, the basket is kept, and the customer is told the payment was declined and can try again.
23. When a menu item is no longer available, or its menu or restaurant no longer accepts orders, the basket is kept and the customer is told so, with a link back to the restaurant's menu.
24. When the backend refuses the input, the basket is kept and its message is shown.
25. When the session has expired, the user is sent to login with a message that the session has expired, and back to checkout, with the basket kept. Logging out shows no such message, and from any page it lands on the homepage.
26. When the user is not a customer, or ordering is switched off on the server, the basket is kept and a Danish message explains it.
27. When the server fails or cannot be reached, the basket is kept and a Danish message asks the customer to try again. A server failure shows its error reference when the server gives one. A page that shows an error message gives a Danish message for a network failure instead of the browser's.
28. When checkout cannot fetch saved delivery addresses, it tells the customer and offers manual entry. If a selected address disappears before ordering, checkout keeps the basket and lets the customer pick another address or enter it manually. An expired session follows the login flow in behaviour 25.
29. The confirmation and the delivery agent's orders use the delivery address recorded on the order. Changing the profile's default leaves previous orders' addresses intact. The dashboard shows the street, postal code and city for available orders and for orders assigned to the signed-in agent.
30. Customers see the recorded delivery address in their order list and order detail. An unknown order, another customer's order or an order number that isn't a number shows "Ordren blev ikke fundet" in the order detail.
31. Delivery agents can expand their order cards to see the order lines, including item names, quantities and subtotals, and the order total.
32. The order confirmation, customer order list and detail, restaurant orders and delivery-agent orders display the Danish status name from the API. The restaurant can filter by the statuses represented in its order list.
33. The order confirmation and the customer's order list and detail are for customers. A logged-out user is sent to login and back. A restaurant user or delivery agent sees "Du har ikke adgang til denne side".

## Implementation decisions

- **Flag:** no ordering view or route checks a flag. #34 removed `orderingEnabled` before or together with the backend flag (Kanban4sem/MTOGO-Backend#44), since the frontend treated a missing flag as off.
- **API:** checkout reads `GET /v1/users/me` for the customer's name and any legacy postal-area data, and `GET /v1/users/me/delivery-addresses` for the selectable addresses. `POST /v1/orders` sends `lines` (`menuItemId`, `quantity`) and `paymentToken`. Choosing a saved address sends `deliveryAddressId` as the address selection. Manual entry sends `deliveryAddress` (`street`, `postalCode`, `city`) and the `saveAsDefault` checkbox value. Requests use the customer's Bearer token. The delivery agent's order response includes `deliveryAddress` for ready, unassigned orders and orders assigned to the signed-in agent.
- **Payment token:** card payment sends `mock-card`; the simulated decline sends `decline`.
- **Basket:** a shared basket provider and hook, since the navigation bar, the menu page and checkout all use it. It holds the restaurant, and for each menu item its ID, name, price and quantity, and enforces the rules in behaviours 4–7. It is stored in `localStorage` under one key, read defensively, and emptied after a `201` or when the user explicitly signs out. The basket total uses the menu prices from `GET /v1/restaurants/{id}/menus`.
- **Order feature:** checkout and the order confirmation live in a new order feature; the add controls and the basket panel join the restaurant menu feature. Features share code only through the shared folder.
- **Routes:** `/checkout` and `/orders/:orderId` under the home layout. Checkout goes to the confirmation with the order number from the `201` response, and the confirmation reads the order from `GET /v1/customer/orders/{id}`, as the customer's order detail does. The route guard requires the customer role on the confirmation and on `/profile/orders` and `/profile/orders/:orderId`. The backend answers `404` for an unknown or foreign order and `400` for an id that isn't a number; both views show both as not found.
- **Logout:** the navigation bar and the dashboard go to the homepage before they clear the session, because the route guard would otherwise send the user from a protected page to login with that page as the return address.
- **Login return:** login reads a return address from router state and goes there after logging in, falling back to the homepage. Only paths inside the app are accepted, so a crafted link can't send the user to another site. A shared route guard sends a logged-out user to login with the current address and whether the session expired; checkout is behind it.
- **Errors:** the client handles `401` and `403` in one place, as the coding standards require: a `401` clears the session and marks it expired, the route guard sends the user to login, and a `403` gets one Danish message. At checkout a `403` can only mean the account is not a customer, so checkout replaces that message with one saying only customers can order (behaviour 26). Checkout maps the other status codes to the Danish messages in behaviours 22–27; `400` shows the backend's `detail`, and a `5xx` adds the `errorId` as the error reference. The client catches a failed `fetch` and throws a Danish connection message, so every page that shows the error message benefits.
- **Order status:** views read `statusName.danish` from the order response. The backend names are Bestilt (PLACED), Accepteret (ACCEPTED), Afvist (REJECTED), Klar til afhentning (READY), Afhentet (PICKED_UP) and Leveret (DELIVERED). A shared module defines the status codes for filtering and actions. Restaurant filter labels come from the listed orders.
- **Order addresses and lines:** the customer order list and detail use the recorded `deliveryAddress`. One formatter assembles the street and postal area for checkout, confirmation, customer orders and delivery-agent orders. Delivery-agent order cards use `deliveryAddress.city` as part of the postal area and show the API's order lines and total. Assignment uses the API's `assignedToMe`. [Backend #66](https://github.com/Kanban4sem/MTOGO-Backend/issues/66) provides these fields.
- **Design:** the existing design tokens, `--mtogo-border-radius`, buttons, inputs, request states and CSS modules, matching the current menu page. Layouts work on mobile and desktop, every control works by keyboard, and reduced-motion preferences are respected.
- **ADRs:** [ADR-001](https://github.com/Kanban4sem/MTOGO-Backend/blob/main/docs/adr/001-feature-flags.md) applies. No new ADR.

## Testing decisions

There is no frontend test framework yet, so `npm run lint` passes and these manual checks run against the API:

- **Flag:** with no `orderingEnabled` in the backend's `.env`, the menu page's add buttons and basket, the basket link, checkout, the confirmation, the customer's order pages and their profile link, the restaurant's orders and the delivery agent's dashboard all appear for their roles (behaviour 1). With no `authEnabled` in the backend's `.env`, the navigation bar shows "Log ind" and "Opret bruger", `/login` and `/register` show their forms after a refresh, and checkout logged out goes to login (2).
- **Basket rules:** add, raise, lower and remove; adding the same menu item again; a menu item from a second restaurant asks first, and declining keeps the basket; 20 menu items and quantity 20 disable the buttons with the message; the basket total; a refresh keeps the basket (3–9, 11).
- **Access:** checkout logged out goes to login and back with the basket; a customer sees the form; a restaurant user sees the customers-only message; an empty basket shows the empty state; plain login still goes to the homepage (12–14).
- **Confirmed payment:** a `201` empties the basket and shows the confirmation with the backend's order total and the Danish status name Bestilt; a refresh and the confirmation address opened in a new tab both show the full order as the API returns it (15, 18–21).
- **Order access:** as a customer, open `/orders/999999`, `/orders/abc`, `/profile/orders/999999`, `/profile/orders/abc` and another customer's order number, and check that each shows "Ordren blev ikke fundet". As a restaurant user and as a delivery agent, open `/orders/<id>`, `/profile/orders` and `/profile/orders/<id>`, and check that each shows "Du har ikke adgang til denne side". Logged out, the same addresses go to login and back (21, 30, 33).
- **Logout:** log out from the confirmation, the order detail, the customer's settings, the restaurant's orders and the dashboard. Check that each lands on the homepage with no login page in between (25). Record the checks for #48 on #48.
- **Declined payment:** the simulated decline gives the declined message and keeps the basket (22).
- **Address validation:** with manual entry, try blank street and city, 101 characters, and postal codes `123`, `12345` and `12a4`. Check that each invalid field shows its message. Try 100 characters and `1234` and confirm that the form submits. A `400` from the API shows its message (16–17, 24).
- **Address selection:** open checkout as a seeded customer with only a postal code and city. Check that checkout fills those fields and requires a street. Save multiple addresses and check that a complete default is preselected, a second saved address is selectable, and each saved selection sends its `deliveryAddressId` without an entered address or `useDefaultAddress`. Check that manual entry with the save box unchecked leaves the default intact (16–17).
- **Saving an address:** select a new address and check the save box. Simulate a declined payment and verify that the basket, the form and the existing profile address are retained. Then pay successfully, check that the request sent `saveAsDefault: true`, and reopen checkout in the same session to verify that the new default is selected (16–17, 20, 22).
- **Address display:** verify that an available order card shows its street, postal code and city without opening the card. Check that the assigned agent still sees them after taking it and that a second agent no longer sees the taken order. Change the customer's default and check that the prior order still uses its original address (29).
- **Customer orders:** open the list and detail for the placed order. Compare the delivery address and the Danish status name with the API and the confirmation. Change the customer's default and check that the previous order still shows its original address (30, 32).
- **Restaurant orders:** compare Bestilt with the customer views for the same order. Accept it and mark it ready. Check that the status badge, available filter labels and update notice use the API's Danish names, including Klar til afhentning (32).
- **Delivery-agent orders:** expand the available order and check its item names, quantities, subtotals and total against the API. Take it and check the same details in active orders. Pick it up and deliver it, then check the status names on the update notices and the active and completed order cards (31–32). Record the order-view checks on #50.
- **Address lookup failure and stale selection:** fail `GET /v1/users/me/delivery-addresses` and verify that manual address entry remains available. Select an address, delete it in a second tab and place the order. Check that checkout keeps the basket and lets the customer choose another address (28).
- **Errors:** an item made unavailable during checkout gives the `409` message with a link to the menu (23); a removed token gives the login detour with the expired-session message, and logging out and in again shows no such message (25); the API stopped gives the Danish connection message at checkout (27).
- **Sign out:** put items in the basket, sign out and refresh. Check that the basket is empty, including in another open tab. Sign in as a delivery agent or restaurant user and check that the navigation bar has no basket link (9, 11). Also check that a session expiration still preserves the basket through sign-in (25).
- **Layout:** mobile and desktop widths, keyboard-only use, and the disabled card fields (10, 18).

## Out of scope

- Order tracking and the `Location` header: #11 and Kanban4sem/MTOGO-Backend#46. The confirmation takes the order number from the route, so it does not need the header.
- Real payment and card input.
- Delivery fees, service fees and commission.
- A frontend test framework.
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

### Spec 2.0 - 2026-11-22 - #44

- **Built:** Checkout reads the current profile and lets the customer reuse a complete default delivery address, enter an address for one order, or save an entered address after successful payment. Profiles with only a postal code and city supply those fields for manual entry. Delivery agents see the recorded delivery address on available and assigned orders. Explicit sign-out clears the basket, and the navigation bar shows the basket link only to guests and customers.
- **Deviations:** Checkout sends both booleans explicitly because Jackson rejects missing values for the backend request record's primitive fields. This issue uses the existing `orderingEnabled` flag.
- **Tests:** The checks above cover the three address requests, legacy profiles, payment decline, existing orders, the agent's view and clearing the basket on sign-out. The developer will run lint and the manual checks against the API.
- **Follow-up:** None.

### Spec 3.0 - 2026-11-25 - #50

- **Built:** Order views use the API's Danish status names. Customers see the order's delivery address in their list and detail, and delivery agents see order lines and the total in their order cards. Checkout and the order views share address formatting. The glossary uses the backend definition of **Status name**.
- **Deviations:** None.
- **Tests:** The manual order-view checks above are for the developer to run against the API and record on #50.
- **Follow-up:** None.

### Spec 4.0 - 2026-11-25 - #14

- **Built:** Checkout lists saved delivery addresses, sends a selected address ID and displays the recipient name. Customer settings can update name and phone number and add, edit or delete delivery addresses.
- **Deviations:** None.
- **Tests:** The developer will run the manual checkout checks above and verify that settings changes persist after a refresh and that deleting a saved address leaves past orders intact.
- **Follow-up:** None.

### Spec 5.0 - 2026-11-25 - #48

- **Built:** The confirmation loads the order from `GET /v1/customer/orders/{id}` through its own hook, and checkout no longer passes the order in router state. The customer order service moved to the shared folder, since the confirmation and the customer's order pages both use it. The confirmation and the customer's order pages require the customer role. A shared `isOrderNotFound` in `orderErrors.js` treats `400` and `404` as not found in both views. When the confirmation can't load the order for another reason, it shows the order number from the address, the error and a "Prøv igen" button, since checkout has already emptied the basket. A shared `useLogout` hook goes to the homepage before logging out, and the navigation bar and the dashboard both use it.
- **Deviations:** Built as if `orderingEnabled` were already removed (#34), as the developer decided. The existing flag guards on these pages are left for #34 to remove. Built in the light workflow, without `/mtogo-grill` or `/mtogo-spec`.
- **Tests:** `npm run lint` and `npm run build` pass. The order access and logout checks above are for the developer to run against the API and record on #48.
- **Follow-up:** None.

### Spec 6.0 - 2026-11-25 - #34

- **Built:** Removed the `orderingEnabled` checks. `FeatureFlagRoute` and `useCanSeeCustomerOrders` are deleted, since no route or link checks a flag any more. The checkout, confirmation, customer order and restaurant order pages and the delivery agent's layout keep only their route guard. The navigation bar always gives customers "Mine ordrer", restaurants "Ordrer" and delivery agents their dashboard, and the profile page always links to the customer's orders. The order notifications in the navigation bar are always on for a signed-in customer. The menu page always renders the menu with add buttons and the basket, in one `Menus` component with a `MenuItem` per menu item, and its CSS names that layout `menuWithBasket` and no longer has the price layout for when the flag was off. The feature-flag provider and hook stay for `authEnabled`.
- **Deviations:** None. Built in the light workflow.
- **Tests:** `npm run lint` and `npm run build` pass, and `git grep orderingEnabled` finds only this spec's history. The flag check above is for the developer to run against the API.
- **Follow-up:** None.

### Spec 7.0 - 2026-11-25 - #22

- **Built:** Removed the `authEnabled` checks. The login and registration views and the navigation bar's "Log ind" and "Opret bruger" links are always shown. The route guard always sends a logged-out user to login, so it no longer waits for the flags or takes a `loginUnavailable` message, and the pages and the delivery agent's layout no longer pass one. The feature-flag provider, hook and `GET /v1/features` endpoint stay for future flags, as the developer decided on #22, and the coding standards say how to restore `FeatureFlagRoute`.
- **Deviations:** None. Built in the light workflow.
- **Tests:** `npm run lint` and `npm run build` pass, and `git grep authEnabled` finds only spec history. The flag check above is for the developer to run against the API.
- **Follow-up:** None.

## Changelog

| Version | Date       | Change                                                                           | Issue |
| ------- | ---------- | -------------------------------------------------------------------------------- | ----- |
| 1.0     | 2026-11-19 | First version                                                                    | #8    |
| 2.0     | 2026-11-22 | Choose, save and display delivery addresses                                      | #44   |
| 3.0     | 2026-11-25 | Use API status names and complete order views                                    | #50   |
| 4.0     | 2026-11-25 | Choose between saved addresses at checkout                                       | #14   |
| 5.0     | 2026-11-25 | Load the confirmation from the API, customers only, logout lands on the homepage | #48   |
| 6.0     | 2026-11-25 | Remove the `orderingEnabled` feature flag                                        | #34   |
| 7.0     | 2026-11-25 | Remove the `authEnabled` feature flag                                            | #22   |
