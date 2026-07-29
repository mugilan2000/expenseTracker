## Purpose

Ensures the transaction footer controls remain aligned and usable on mobile screens while preserving the existing desktop experience.

## ADDED Requirements

### Requirement: Transaction footer controls stay aligned on mobile
The system SHALL keep the refresh button and pagination controls in the same footer row on narrow viewports.

#### Scenario: Mobile viewport renders footer
- **WHEN** the transaction list is displayed on a mobile-sized viewport
- **THEN** the system SHALL keep the refresh action and pagination controls visually aligned in the same row without stacking them vertically

#### Scenario: Desktop viewport renders footer
- **WHEN** the transaction list is displayed on a desktop-sized viewport
- **THEN** the system SHALL preserve the existing footer layout and spacing

### Requirement: Transaction footer remains responsive without overlap
The system SHALL adapt the footer layout to the available width so the refresh button, page-size selector, and pagination controls remain readable and aligned.

#### Scenario: Narrow screen width is used
- **WHEN** the transaction list footer is displayed in a narrow layout
- **THEN** the system SHALL adjust the footer layout so controls remain visible and do not overlap each other
