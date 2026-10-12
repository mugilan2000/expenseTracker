## 1. Tailwind Setup

- [x] 1.1 Add Tailwind CSS and its compatible official Vite integration, preserving the existing React and PWA plugins.
- [x] 1.2 Configure the global CSS entry and theme tokens so Tailwind utilities follow the existing light/dark `data-theme` values and font setup.
- [x] 1.3 Confirm Tailwind styles compile in the production web build before beginning the component migration.

## 2. Component Migration

- [x] 2.1 Migrate application layout, header, footer, shared buttons, and responsive mobile navigation to Tailwind utilities.
- [x] 2.2 Migrate dashboard, add-transaction, and expense-list layouts and control states to Tailwind utilities.
- [x] 2.3 Migrate authentication views and their validation, loading, disabled, and provider-login states to Tailwind utilities.
- [x] 2.4 Replace dynamically assembled utility names with complete static class names or explicit variant maps.

## 3. Verification And Cleanup

- [x] 3.1 Verify authentication and transaction views at compact and wide viewports in both themes, including focus, selected, pressed, and disabled states.
- [x] 3.2 Verify existing navigation, mobile menu, theme switching, transaction entry, filtering, pagination, and other current interactions remain unchanged.
- [x] 3.3 Remove obsolete custom component CSS and imports after confirming no remaining consumers; retain only necessary global styles and theme tokens.
- [x] 3.4 Run lint and production builds for the default web mode and Android mode, and resolve any migration regressions.