## Context

The application uses a shared app shell in src/App.jsx with conditional content for the login and authenticated experiences. The footer can be added once at the root of that layout so it is consistently rendered regardless of which view is active.

## Goals / Non-Goals

**Goals:**
- Add a lightweight footer component with the requested attribution.
- Keep the footer visually aligned with the existing app styling.
- Avoid duplicating layout logic across the login and dashboard branches.

**Non-Goals:**
- No new backend behavior or data fetching is required.
- No additional navigation or interactive footer controls are included.

## Decisions

- Use a small functional component in src/components/Footer.jsx so the footer remains reusable and easy to maintain.
- Render the footer outside the conditional login/dashboard branches in App.jsx to ensure it appears at the end of the page for all states.
- Apply a dedicated CSS class in src/App.css so the footer can inherit the existing theme colors and spacing.

## Risks / Trade-offs

- [Minimal layout impact] → The footer is kept simple and lightweight so it does not compete with the main content.

## Open Questions

- None.
