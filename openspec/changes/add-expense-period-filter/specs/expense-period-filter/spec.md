## Purpose

Provide one consistent reporting-period choice so users can switch between their complete transaction history and the current calendar month's financial activity across the authenticated expense tracker.

## ADDED Requirements

### Requirement: User can select a reporting period

The authenticated application SHALL provide Overall and Monthly options in the existing header controls, SHALL default to Overall for each application load, and SHALL expose the current selection consistently in desktop and mobile controls.

#### Scenario: Overall is selected by default
- **WHEN** an authenticated user loads the application without making a period selection
- **THEN** the header displays Overall as selected and all reporting views use the complete transaction set

#### Scenario: User switches reporting period
- **WHEN** the user selects Monthly or Overall from either header control
- **THEN** the selected period is applied to every reporting view without changing or deleting stored transactions

### Requirement: Reporting views use the selected period

Dashboard totals, transaction listings, and the sidebar's spending-by-category data SHALL be derived from the transactions included by the selected reporting period. Monthly SHALL include transactions whose date falls in the current calendar month and year; Overall SHALL include transactions from all available dates.

#### Scenario: Overall reporting
- **WHEN** Overall is selected
- **THEN** the dashboard calculates total income, total expenses, net balance, and counts from all transactions, the transaction list can show all transactions, and spending-by-category totals use all applicable expense transactions

#### Scenario: Current-month reporting
- **WHEN** Monthly is selected
- **THEN** the dashboard calculates total income, total expenses, net balance, and counts only from current-month transactions, the transaction list shows only current-month transactions, and spending-by-category totals use only current-month applicable expense transactions

#### Scenario: No transactions match Monthly
- **WHEN** Monthly is selected and no transaction date falls in the current calendar month and year
- **THEN** each reporting view remains usable, displays zero or an empty state as appropriate, and does not include transactions from another month

### Requirement: Period changes preserve local view controls

The reporting-period change SHALL preserve the transaction list's search, income/expense filter, pagination behavior, and transaction mutation actions while recalculating the displayed results against the newly selected period.

#### Scenario: Existing list filters after a period change
- **WHEN** a user has an active search or transaction-type filter and changes the reporting period
- **THEN** the list applies both the existing list filters and the newly selected period before calculating visible rows and page counts