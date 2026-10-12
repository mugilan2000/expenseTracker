## Why

The application relies on global custom CSS for its interface, making styling harder to keep consistent as screens and components evolve. Adopting Tailwind CSS gives the React UI a shared utility-based styling approach while preserving the application's existing workflows.

## What Changes

- Adopt Tailwind CSS as the primary styling system for the React application.
- Migrate existing screen and component styling away from the current custom CSS files.
- Preserve existing responsive layouts, visual states, and application interactions during the migration.

## Capabilities

### New Capabilities
- `responsive-application-interface`: Consistent responsive presentation and clear interaction states across application views.

### Modified Capabilities
- None.

## Impact

- Affects `src/index.css`, `src/App.css`, and styling in React components and pages.
- Adds Tailwind CSS and the Vite integration/configuration required by the installed Tailwind version.
- No API, data, authentication, or transaction behavior changes are intended.