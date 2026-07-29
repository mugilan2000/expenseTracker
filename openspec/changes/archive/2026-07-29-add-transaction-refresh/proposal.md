## Why

The transaction view currently depends on whatever is already cached in the browser, so users may not see the latest server data without reloading the app or waiting for stale state to be replaced. A dedicated refresh action will make the list feel predictable and give users a clear way to force a fresh sync.

## What Changes

- Add a refresh button beneath the transaction list in the transactions window, aligned to the left side of the transactions area.
- When the user triggers refresh, the app will clear the cached transaction data, fetch the latest transactions from the server, and store the fresh result in cache.
- Surface success or failure feedback so the user knows whether the refresh completed.

## Capabilities

### New Capabilities
- `transaction-refresh`: supports explicit refresh of transaction data from the server and cache replacement.

### Modified Capabilities
- None.

## Impact

- Transaction list UI in the expense tracker experience.
- App-level refresh flow that currently relies on cached data.
- Local storage cache behavior for transaction data.
