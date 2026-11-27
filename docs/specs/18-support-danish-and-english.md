# Support Danish and English

**Version:** 1.0 · **Date:** 2026-11-27 · **Issue:** #18 · **Feature flag:** None

## Acceptance criteria

Copied from #18.

- [ ] A user can switch between Danish and English
- [ ] Every view, including order statuses, is shown in the chosen language

## Behaviour

1. A visitor sees Danish on their first visit. Danish preserves the existing interface copy.
2. A visitor can switch between Dansk and English. The control displays DK or EN for the selected language. Switching updates the current page without navigating away or clearing form input.
3. The browser remembers the selected language after a reload. If storage is unavailable, the visitor can still switch for the current page session.
4. Interface text, validation, notifications, dates, currency formatting and order status names follow the selected language. Prices remain in Danish kroner.
5. The standard menu description follows the selected language. Restaurant names and other restaurant-provided content appear as supplied.

## Implementation decisions

- The language is a browser preference. Existing URLs work in both languages.
- The shared navigation and each route keep their own message catalogs. Visiting a route loads that route's code and messages.
- The order views and notifications use the selected status name supplied by the API. For older responses, a known status code supplies the name in the selected language. Error references remain attached to server errors in either language.

## Testing decisions

- Open the homepage in a fresh browser profile. Confirm Danish and DK, switch to English, navigate to another page, and reload. Confirm English and EN, then switch back.
- On a restaurant menu, check the standard description and the dish count for one and several dishes. On checkout, check the saved default address label and the option for another address. On the customer profile, check the order and settings links.
- Switch language with a checkout or settings form open. Confirm the input remains and any validation messages follow the active language.
- Check the same order in both languages across the customer, restaurant and delivery views. Compare the status and any order notification with the matching API status name.
- Run `npm test` for stored preferences, catalog parity, localized status names and formatting, API error references and validation messages.

## Out of scope

- Translation of restaurant-authored menu text and dish descriptions.

## Further notes

The language selection extends the Danish presentation described in specs #7, #8 and #51 to English.

## Implementation notes

### Spec 1.0 - 2026-11-27 - #18

- **Built:** Browser language selection, lazy route catalogs and localized interface text, order statuses and messages.
- **Deviations:** None.
- **Tests:** Added a Node test suite and included it in the frontend verification command. Manual checks are listed above.
- **Follow-up:** None.

## Changelog

| Version | Date       | Change        | Issue |
| ------- | ---------- | ------------- | ----- |
| 1.0     | 2026-11-27 | First version | #18   |
