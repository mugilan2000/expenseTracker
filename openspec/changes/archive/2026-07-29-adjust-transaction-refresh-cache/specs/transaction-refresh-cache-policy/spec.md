## Purpose

This capability ensures refresh operations only replace the cached transaction data after a successful server response.

## ADDED Requirements

### Requirement: Cache is preserved on refresh failure
The system SHALL preserve the existing cached transaction data when a refresh request fails or the server does not respond.

#### Scenario: Refresh request fails
- **WHEN** the refresh request cannot reach the server or returns an error
- **THEN** the system SHALL keep the existing cached transactions unchanged and show an error message

### Requirement: Cache is replaced on successful refresh
The system SHALL replace the cached transaction data only after the server returns fresh transaction data successfully.

#### Scenario: Refresh request succeeds
- **WHEN** the server returns transaction data successfully
- **THEN** the system SHALL replace the cache with the returned data and update the visible transaction list
