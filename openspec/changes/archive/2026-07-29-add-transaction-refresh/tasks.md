## 1. UI and interaction

- [x] 1.1 Add a refresh button beneath the transactions list in the transactions view, aligned to the left side.
- [x] 1.2 Wire the button to a refresh action that can be triggered from the transaction list area.
- [x] 1.3 Add a loading or disabled state for the refresh control while a request is in progress.

## 2. Data refresh flow

- [x] 2.1 Clear the cached transaction data before requesting fresh server data.
- [x] 2.2 Fetch the latest transactions from the server and replace the cache with the returned payload.
- [x] 2.3 Update the visible list and show success or error feedback after the refresh completes.

## 3. Validation

- [x] 3.1 Verify the refresh button appears in the expected place and works from the UI.
- [x] 3.2 Confirm that refreshed data is stored in cache and shown in the list.
