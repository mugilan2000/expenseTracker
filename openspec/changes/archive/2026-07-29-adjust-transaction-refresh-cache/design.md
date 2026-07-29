## Context

The current refresh implementation removes cached transaction data before the network request is completed. That creates a gap where the UI can temporarily lose the last known good state if the request fails. The updated design should keep the existing cached data until the server has confirmed a successful fetch.

## Goals / Non-Goals

**Goals:**
- Preserve the current cached transactions when a refresh attempt fails.
- Replace the cache only after a successful fetch response.
- Keep the user-facing refresh flow unchanged except for the improved failure behavior.

**Non-Goals:**
- Adding a new backend endpoint.
- Changing the transaction list UI structure beyond the refresh action.

## Decisions

- The refresh flow will fetch fresh data first and only write the result to local storage after the request succeeds.
- If the request fails, the existing cache remains in place and the user sees an error message.
- The existing toast-based feedback remains the mechanism for user notifications.

## Risks / Trade-offs

- [Temporary stale data during refresh] → The app will continue to show the last known good data until the server confirms a new payload.
- [Need to avoid double writes] → The code will only update local storage after the successful fetch completion path.
