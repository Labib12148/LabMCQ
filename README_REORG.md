# Project Structure Overview

This document outlines the reorganized source tree for easier maintenance. The app's runtime behavior and UI remain unchanged.

## Directory Layout

```
src/
  assets/               # Static images and icons
  components/           # Shared UI components
    index.js
  features/
    board/              # Board question feature
    chapter/            # Chapter-wise practice feature
  hooks/                # Reusable hooks (add new ones here)
    index.js
  pages/
    Home/
  utils/                # Non-UI helpers
    index.js
  styles/               # Global styles and tokens
  data/                 # Question JSON (unchanged)
  App.jsx
  main.jsx
  index.css
```

## Adding New Code
- **Pages/Routes**: place new top-level pages under `src/pages/`.
- **Feature logic**: keep feature-specific components and logic inside `src/features/<feature>`.
- **Shared components**: use `src/components/` and re-export via the folder's `index.js`.
- **Hooks & utilities**: put custom hooks in `src/hooks/` and shared helpers in `src/utils/`.
- Use the `@` alias for imports from `src`.

