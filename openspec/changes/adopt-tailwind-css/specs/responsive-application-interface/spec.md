## Purpose

Defines the user-visible presentation contract shared by the expense tracker across screen sizes, themes, and interactive control states.

## ADDED Requirements

### Requirement: Application views remain usable across viewport sizes
The application MUST adapt its authentication and transaction-management views to supported viewport sizes without clipping essential content or making primary controls inaccessible.

#### Scenario: Compact viewport
- **WHEN** a user opens an authentication or transaction-management view on a compact viewport
- **THEN** the view reflows its content and keeps its primary controls reachable without horizontal page scrolling

#### Scenario: Wide viewport
- **WHEN** a user opens a transaction-management view on a wide viewport
- **THEN** related content is arranged to use the available space while retaining clear grouping and readable labels

### Requirement: Theme changes apply consistently across views
The application MUST apply the active light or dark theme consistently to page backgrounds, surfaces, text, borders, and semantic status colors across authentication and transaction-management views.

#### Scenario: User changes the active theme
- **WHEN** the active theme changes
- **THEN** all visible application views update their themed surfaces and text while retaining readable contrast

### Requirement: Interactive controls expose their current state
The application MUST provide visible focus, disabled, selected, and pressed states for applicable interactive controls without obscuring their labels or meaning.

#### Scenario: Keyboard navigation reaches a control
- **WHEN** a user navigates to an interactive control with a keyboard
- **THEN** the focused control has a visible focus indicator

#### Scenario: Control is unavailable or selected
- **WHEN** an interactive control is disabled or selected
- **THEN** its visual state is distinguishable from the default state