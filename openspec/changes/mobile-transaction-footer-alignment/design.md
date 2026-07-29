## Context

The transaction footer is rendered inside the expense list component with a flex container that uses space-between alignment and wrapping. On narrow viewports, the controls can wrap and appear on separate rows, which causes the misalignment reported in mobile view.

## Goals / Non-Goals

**Goals:**
- Keep the refresh button and pagination controls on the same visual row on mobile screens.
- Preserve the current desktop footer behavior.
- Maintain readable spacing around the page-size selector and pagination controls.

**Non-Goals:**
- Redesigning the full transaction list layout.
- Changing paging behavior or the refresh action logic.

## Decisions

- Use a responsive footer layout that switches to a compact mobile-friendly arrangement at narrower widths.
- Keep the desktop layout unchanged so existing behavior remains stable on larger screens.
- Apply the responsive behavior in the transaction list component rather than introducing a new shared layout pattern for this one case.

## Risks / Trade-offs

- [Mobile space constraints] → The footer will need a compact arrangement that still preserves clear spacing between controls.
- [Cross-browser rendering differences] → The responsive layout should be tested in the main supported browser environments to ensure consistent alignment.
