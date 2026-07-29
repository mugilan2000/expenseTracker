## Purpose

This capability makes the transaction history easier to browse by splitting it into pages and ensuring search works across the full filtered dataset.

## ADDED Requirements

### Requirement: Transaction list is paginated
The system SHALL display transactions in a paginated list with a configurable page size, and the page-size selector SHALL use the accent color when focused while suppressing the browser's default black outline.

#### Scenario: User changes page size
- **WHEN** a user selects a page size preference
- **THEN** the system SHALL show the first page of results using that page size
- **AND** the page-size selector SHALL render with the accent focus border instead of the browser's default black outline

#### Scenario: User navigates pages
- **WHEN** a user moves to another page
- **THEN** the system SHALL show the corresponding slice of transactions for the current filter and search state

### Requirement: Pagination controls appear at the bottom right
The system SHALL place pagination controls at the bottom of the transaction list and align them to the right.

#### Scenario: Transaction list renders
- **WHEN** the transaction list contains more than one page of results
- **THEN** the system SHALL show pagination controls at the bottom right of the list

### Requirement: Search uses the full filtered dataset
The system SHALL evaluate search queries against all transactions that match the active filter, not only the transactions currently visible on the active page.

#### Scenario: Search across pages
- **WHEN** a user searches while the transaction list is paginated
- **THEN** the system SHALL return matches from the full filtered dataset and show the relevant page of results
