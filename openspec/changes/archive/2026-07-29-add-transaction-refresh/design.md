## Context

The current app already fetches transaction data from the API and stores it in local storage, but the main refresh path relies on the existing cached payload unless the app is reloaded or the cache is manually cleared. The refresh feature should fit into the existing data flow instead of introducing a separate state model.

## Goals / Non-Goals

**Goals:**
- Reuse the existing API helper and cache storage pattern.
- Add a clear refresh control in the transactions view.
- Make the refresh operation feel reliable and visible to the user.

**Non-Goals:**
- Adding a new backend endpoint or schema.
- Implementing background sync or automatic polling.
- Changing the overall transaction editing workflow.

## Decisions

- The refresh control will live in the transaction list area, directly beneath the list, so it stays close to the data the user is viewing.
- The refresh action will reuse the existing server fetch path and the same local storage cache write path used by the main app flow.
- The UI will use the existing toast mechanism for feedback and will disable the control while a refresh is in progress to avoid duplicate requests.

## Risks / Trade-offs

- [Network latency] → The refresh control will show a pending state and use the existing toast feedback to reduce uncertainty.
- [Stale state during refresh] → The app will clear the cached data before the fetch and then repopulate it on success, which keeps the flow deterministic.
