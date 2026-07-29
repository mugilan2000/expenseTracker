## Context

The transaction list is currently rendered as a single array and the search logic is applied to the data already being displayed. To support pagination cleanly, the list should be derived from the full filtered transaction set and then sliced for display rather than paginating the already-rendered portion of the list.

## Goals / Non-Goals

**Goals:**
- Introduce paginated transaction rendering with a user-selectable page size.
- Keep the existing filter and search UI intact while making the behavior more scalable.
- Ensure search results span all pages for the current filter.

**Non-Goals:**
- Adding a new backend endpoint or server-side pagination.
- Changing the transaction editing or creation workflow.

## Decisions

- The component will compute the full filtered transaction list first, then slice it based on the current page and page size.
- The page size preference will be stored locally in component state and exposed through a simple selector near the pagination controls. On focus, the selector will switch to the accent border and remove the browser default outline so the control appears consistent with the design.
- Pagination controls will be rendered as simple previous/next buttons with page numbers, placed at the bottom-right of the list area.

## Risks / Trade-offs

- [Search performance] → The list will be filtered once over the full transaction set, which is acceptable for the current client-side data size.
- [State complexity] → The component will need to reset the current page when filters or search terms change so the user lands on a sensible page.
