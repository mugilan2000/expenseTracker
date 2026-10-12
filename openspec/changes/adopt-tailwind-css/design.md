## Context

See [proposal.md](proposal.md) for motivation. The React/Vite app currently imports global styles from `src/index.css` and `src/App.css`. The app switches theme by setting `data-theme` on the document element, and its responsive rules include breakpoints at 900px and 560px. Vite also configures React and PWA plugins that must remain active.

## Goals / Non-Goals

**Goals:**
- Use Tailwind CSS utilities for component and layout styling while retaining the existing theme behavior and view structure.
- Keep the generated web and Android builds working with the existing Vite configuration.
- Remove duplicated component styling after equivalent utility styling is in place.

**Non-Goals:**
- Replace React components with a prebuilt component library or redesign the product's visual identity.
- Change authentication, transaction, routing, or data behavior.

## Decisions

- **Use Tailwind CSS with its official Vite integration.** Add Tailwind and the Vite integration compatible with the selected Tailwind major, then register the integration without removing the React or PWA plugins. Tailwind's direct Vite integration keeps the build setup small; a separate PostCSS configuration is unnecessary unless compatibility requires it.
- **Prefer Tailwind over Material UI.** Tailwind is the utility-first CSS framework requested and allows the current React component structure and interaction logic to remain. Material UI is a React component library, not just a CSS framework, and would introduce a larger component replacement and visual redesign.
- **Preserve runtime theme tokens as CSS custom properties.** Keep the existing `data-theme` switch and define light/dark values for shared colors and typography in a small global stylesheet. Expose those values to Tailwind utilities so a runtime theme change updates surfaces, text, borders, and semantic colors without generating theme-specific component markup.
- **Migrate incrementally by view/component.** Convert layout and shared controls first, then authentication and transaction views. Keep each view buildable during migration; remove `App.css` and obsolete global rules only after their selectors have no consumers. Retain only genuinely global concerns such as font loading, base styles, and theme variables.
- **Keep utility class names statically discoverable.** Use complete class strings or explicit maps for conditional variants so Tailwind's build-time class detection includes every state.

## Risks / Trade-offs

- [Utility classes can make JSX harder to scan] -> Keep class groupings consistent and extract a small reusable component only where it removes real duplication.
- [Theme or responsive regressions can be subtle] -> Compare authentication, dashboard, add-transaction, and expense-list views in both themes at compact and wide viewport sizes before deleting old rules.
- [A partial migration can leave conflicting CSS] -> Remove migrated selectors in the same component slice and finish by searching for obsolete class names and CSS imports.
- [Tailwind integration may differ by major version] -> Use the official integration and CSS entry syntax for the chosen installed version, then require the production Vite build to pass.

## Migration Plan

1. Add Tailwind and its compatible Vite integration; connect the plugin and CSS entry while preserving current plugins, theme variables, and font loading.
2. Migrate shared layout, header/footer, and common control styling, then convert authentication and transaction-management views in small slices.
3. Verify theme switching, responsive layout, focus and control states, and existing application workflows after each major slice.
4. Remove obsolete custom component rules and imports once all consumers are migrated; run lint and production builds for the web and Android Vite mode.

If a slice regresses, restore that slice's prior class names and CSS rules while leaving the Tailwind build integration in place; if the integration itself blocks builds, remove its plugin/import and dependency changes together.