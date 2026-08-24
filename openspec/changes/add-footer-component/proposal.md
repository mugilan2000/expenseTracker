## Why

The app currently ends after the main content, which leaves the page feeling unfinished and does not provide a clear attribution area. A small footer improves the overall polish and makes the app feel more complete.

## What Changes

- Add a reusable footer component for the app shell.
- Render the footer at the bottom of the page for all app states.
- Display the text "Design and developed by Mugilan S" inside the footer.

## Capabilities

### New Capabilities
- footer-component: A reusable page footer that renders app attribution at the bottom of the application layout.

### Modified Capabilities
- None.

## Impact

- Affects the main app layout in src/App.jsx.
- Introduces a new presentation component in src/components/Footer.jsx.
- Adds matching styles in src/App.css.
