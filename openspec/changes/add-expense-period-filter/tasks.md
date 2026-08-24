## 1. Shared Reporting Scope

- [x] 1.1 Add authenticated app-level reporting-period state with `overall` as the default and a local-calendar current-month predicate/helper.
- [x] 1.2 Derive the period-filtered transaction collection from the full transaction data while keeping the full collection available for refresh, add, and delete operations.
- [x] 1.3 Pass the selected period and period change handler to both desktop and mobile header controls, and pass the filtered collection to reporting views.

## 2. Reporting View Integration

- [x] 2.1 Update `Dashboard` to calculate income, expense, balance, transaction counts, and monthly expense from the period-scoped transactions without duplicating period-selection logic.
- [x] 2.2 Update `ExpenseList` to apply its existing search, type filter, pagination, refresh, and delete behavior to the period-scoped transactions and reset pagination safely when the scope changes.
- [x] 2.3 Update `SideBar` spending-by-category calculations to use the period-scoped transactions while preserving expense-only category semantics and existing budget/streak behavior unless explicitly required by the selected scope.

## 3. Interaction and Presentation

- [x] 3.1 Ensure desktop and mobile controls stay visually synchronized, close their menus after selection, and expose Overall or Monthly as the active value.
- [x] 3.2 Ensure empty Monthly results render zero dashboard metrics and usable empty states without affecting stored transactions or unrelated authenticated actions.

## 4. Verification

- [x] 4.1 Verify with representative transactions inside and outside the current month that Overall and Monthly produce the expected dashboard, transaction list, and category totals.
- [x] 4.2 Verify search, income/expense filters, pagination, refresh, add, and delete behavior after switching periods, then run the project build or lint checks.