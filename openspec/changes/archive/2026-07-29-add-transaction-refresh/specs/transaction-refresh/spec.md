## Purpose

This capability lets users explicitly refresh transaction data so the list always reflects the latest server state.

## ADDED Requirements

### Requirement: User can refresh transactions from the server
The system SHALL provide a refresh control beneath the transaction list, aligned to the left side of the transactions area, that allows the user to request a fresh fetch of transaction data.

#### Scenario: Refresh from the transaction list
- **WHEN** a user clicks the refresh control under the transactions list
- **THEN** the system SHALL clear the cached transaction data, request the latest transactions from the server, and replace the cache with the returned data

### Requirement: Refresh feedback is visible to the user
The system SHALL provide visible feedback after a refresh attempt so the user knows whether the operation succeeded or failed.

#### Scenario: Refresh succeeds
- **WHEN** the server returns transaction data successfully
- **THEN** the system SHALL update the visible transaction list and show a success message

#### Scenario: Refresh fails
- **WHEN** the refresh request fails or the server returns an error
- **THEN** the system SHALL show an error message and leave the user with a clear state that the refresh did not complete
