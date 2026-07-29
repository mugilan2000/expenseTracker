## Why

The transaction list currently renders every transaction on a single page, which becomes hard to scan as the dataset grows. A paginated list with a configurable page size will make large histories easier to browse, and search should operate across the full filtered result set rather than only the current page.

## What Changes

- Add pagination to the transaction list so transactions are displayed across multiple pages.
- Allow the user to choose the page size for the list, with the page-size dropdown using the accent color on focus and suppressing the browser's default black outline.
- Place the pagination controls at the bottom of the list, aligned to the right.
- Ensure search operates across all matching transactions, not just the records visible on the current page.

## Capabilities

### New Capabilities
- `transaction-list-pagination`: supports paginated transaction browsing with configurable page size and bottom pagination controls.

### Modified Capabilities
- None.

## Impact

- Transaction list UI and interaction model.
- Search behavior for transaction filtering.
- Client-side list rendering and state handling for paginated results.
