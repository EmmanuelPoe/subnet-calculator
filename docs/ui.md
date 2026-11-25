# UI

## Layout

- Page title, subtitle "CIDR • VLSM • IPv4 • No dependencies".
- One `.card` (max-width 720px, centered) containing `.tabs` (three `.tab` buttons) and three panels: `#tab-cidr`, `#tab-vlsm`, `#tab-split`. `switchTab(name)` toggles panel `display` and the `.active` class; the button order in the markup must match the `['cidr','vlsm','split']` array.
- CIDR results use `.result-grid` (2 columns, 1 column under 500px) of `.result-item` cells; the binary row spans both columns (`.binary`).
- VLSM and Split results are `<table>`s injected into `#vlsm-results` / `#split-results`.

## Element IDs used by the script

`cidr-input`, `cidr-error`, `cidr-results`, `r-network`, `r-broadcast`, `r-first`, `r-last`, `r-hosts`, `r-mask`, `r-wildcard`, `r-prefix`, `r-binary`, `vlsm-network`, `vlsm-rows`, `add-subnet`, `vlsm-error`, `vlsm-results`, `split-network`, `split-count`, `split-error`, `split-results`. Renaming any of them requires updating the script.

## Visual language

Dark theme, hard-coded colors (no CSS variables): background `#0f1923`, cards `#1a2535`, borders `#243044`/`#2d4060`, accent `#5bc0f8`, muted text `#7a9abf`, buttons `#0f3460` (hover `#1a5090`), errors `#ff6b6b`. Values are shown in a monospace font (`Courier New`). Labels are uppercase with letter spacing.

## Conventions for changes

- Add new tools as a fourth tab: a `.tab` button, a `#tab-<name>` panel, and the name in the `switchTab` array.
- Errors are inline `.error` paragraphs under each tab's button, set with `showError(id, message)`. Do not use `alert()`.
- Keep it usable on a phone: test at 375px wide.
- Accessibility gaps worth fixing: the VLSM row label is a `<span>`, not a `<label>`; tabs are plain buttons without `role="tab"`/`aria-selected`.
