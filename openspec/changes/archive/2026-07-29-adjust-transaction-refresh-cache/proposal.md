## Why

The refresh action should avoid removing previously available transaction data when the server cannot be reached. The updated behavior should preserve the current cached state on failure while still replacing it with fresh data when the server responds successfully.

## What Changes

- Keep the existing cached transactions intact if the refresh request fails or the server does not respond.
- Clear the old cache only after the server returns fresh transaction data successfully.
- Preserve the existing refresh button experience while aligning the cache behavior with the new failure-handling rule.

## Capabilities

### New Capabilities
- `transaction-refresh-cache-policy`: defines that cache replacement only happens after a successful refresh response.

### Modified Capabilities
- None.

## Impact

- Transaction refresh flow in the expense tracker UI.
- Local storage cache behavior during manual refresh.
- User-facing feedback when refresh succeeds or fails.
