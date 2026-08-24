## Context

The header already renders Overall and Monthly controls, but `selectedDataView` is local to `Header` and the other views independently receive the full `allTransactions` array. `Dashboard` and `SideBar` also contain separate date calculations, while `ExpenseList` owns search, type filtering, and pagination. See proposal.md and the expense-period-filter spec for the required behavior.

## Goals / Non-Goals

**Goals:**

- Establish one reporting-period state at the authenticated app-shell level.
- Apply one shared transaction subset to dashboard metrics, list filtering, and sidebar category calculations.
- Define current-month matching by the local calendar month and year, including correct behavior when there are no matches.
- Keep existing search, type filtering, pagination, refresh, delete, and transaction persistence behavior intact.

**Non-Goals:**

- Adding arbitrary date-range selection or historical month navigation.
- Persisting the selected period across browser sessions.
- Changing the API payload, transaction schema, budget semantics, or category definitions.

## Decisions

- **Own the period in `App` and pass it down.** `App` is the nearest common owner of `Header`, `Dashboard`, `ExpenseList`, and `SideBar`, so it can provide the selected period and a setter to all consumers. This is preferred over duplicating local state or introducing a context for a single app-shell concern.
- **Filter once at the app boundary.** Derive a filtered transaction collection from `allTransactions` and the selected period, then pass that collection to reporting components. This prevents each component from implementing subtly different month logic. The full collection remains available to mutation and refresh flows.
- **Use calendar boundaries for Monthly.** Compare transaction dates against the current local year and month, using a shared predicate or helper. This avoids locale-formatted month strings and makes the inclusion rule explicit while matching the product's current-month wording.
- **Keep list-specific filtering local.** `ExpenseList` should continue applying search, income/expense type, and pagination after receiving the period-filtered collection. This preserves existing controls and avoids coupling reporting scope to list UI state.
- **Preserve sidebar spending semantics.** The category chart continues to aggregate applicable expense transactions by category; it receives only the selected period's collection. Dashboard income and expense metrics continue to distinguish transaction type independently.

## Risks / Trade-offs

- **[Risk]** A transaction date with an unexpected or invalid format may be excluded from Monthly. **Mitigation:** centralize date parsing and treat invalid dates as non-matching rather than allowing inconsistent component behavior.
- **[Risk]** Removing component-local month calculations could affect existing budget or streak displays that intentionally use different scopes. **Mitigation:** scope the new filtered collection to the requested reporting views and review budget/streak behavior during implementation before changing it.
- **[Trade-off]** The selected period resets to Overall on a full reload. **Mitigation:** this is intentional for the requested default and avoids adding persistence requirements.

## Migration Plan

No data migration is required. Deploy the UI/state changes, verify Overall and Monthly with transactions inside and outside the current month, and roll back the application changes if reporting results regress; stored transactions remain unchanged.

## Open Questions

None.