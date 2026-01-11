---
description: Rules for naming components and structuring directories within the src/components folder, including conventions for CamelCase names.
globs: src/components/**/*
---

- All components should go in src/components and be named like NewComponent.tsx
- Use CamelCase directories (e.g., components/AuthWizard).
- Favor named exports for components.
- Within the /src/components folder, consider organizing components by type or feature:
  - By Type: Group components like forms, buttons, layout elements, etc.
  - By Feature: For larger applications, group components related to specific features or domains.
    For example:
    /src/components
    ├── /ui
    │ ├── /Button
    │ ├── /Modal
    │ └── /Card
    ├── /forms
    │ ├── /TextField
    │ └── /Select
    └── /layout
      ├── /Navbar
      └── /Footer
