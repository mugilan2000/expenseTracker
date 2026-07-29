## Why

The transaction footer currently behaves inconsistently on smaller screens. In mobile view, the refresh button and pagination controls can break apart and appear on separate rows, which makes the footer feel misaligned and less usable. This change will make the footer stay visually consistent across mobile and desktop layouts.

## What Changes

- Adjust the transaction footer layout so the refresh button and pagination controls remain aligned in the same line on mobile view.
- Preserve the current desktop layout and spacing.
- Keep the page-size selector and pagination controls accessible without overlap or wrapping issues.

## Capabilities

### New Capabilities
- `transaction-list-footer-layout`: supports responsive alignment of the transaction footer controls across mobile and desktop views.

### Modified Capabilities
- None.

## Impact

- Transaction list footer UI in the expense list component.
- Responsive styling for footer controls.
- Related layout behavior in the transaction list view.
