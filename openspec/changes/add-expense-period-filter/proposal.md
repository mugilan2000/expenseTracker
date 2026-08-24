## Why

The header currently exposes Overall and Monthly choices, but the selected view is local to the header and does not change the data shown elsewhere in the app. Users need one consistent reporting period so dashboard totals, transactions, and spending by category all describe the same set of records.

## What Changes

- Make the reporting-period selection shared across the authenticated app, defaulting to Overall.
- When Overall is selected, calculate dashboard metrics, transaction rows, and spending-by-category totals from all available transactions.
- When Monthly is selected, calculate those same views from transactions in the current calendar month.
- Keep the period selection available in both desktop and mobile header controls and update all affected views immediately after a selection.
- Preserve existing transaction data and transaction creation behavior; the change only controls which records are included in reporting views.

## Capabilities

### New Capabilities

- `expense-period-filter`: Select an Overall or current Monthly reporting period and apply it consistently to dashboard metrics, transaction listings, and spending-by-category totals.

### Modified Capabilities

- None.

## Impact

- Affects shared state and authenticated app layout in `src/App.jsx` and the period controls in `src/components/Header.jsx`.
- Updates data filtering and derived totals in `src/components/Dashboard.jsx`, `src/components/ExpenseList.jsx`, and the spending-by-category sidebar component.
- Requires consistent current-calendar-month handling for transaction dates and prop updates across the affected components.
- No API, database schema, or external dependency changes are expected.