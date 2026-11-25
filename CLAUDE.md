# CLAUDE.md

Guidance for AI agents working in this repository. Read this first, then the matching file in `docs/`.

## What this is

A single-file, dependency-free IPv4 subnet calculator. Everything — HTML, CSS and JavaScript — is in `index.html`. Three tabs:

- **CIDR Calculator** — live results as you type (network, broadcast, first/last host, usable hosts, mask, wildcard, prefix, binary)
- **VLSM Planner** — allocate named subnets by host count from a base network
- **Subnet Splitter** — split a network into N equal subnets (rounded up to a power of two)

IPv6, a supernet calculator and CSV export are on the README roadmap, not implemented.

## Commands

```bash
python3 -m http.server 8080      # then open http://localhost:8080
# or just open index.html in a browser
node --test                      # tests/calc.test.js runs the page's script in Node (CI runs it on PRs)
```

There is no build step and no package manager.

## Rules for agents

- Keep it a single self-contained `index.html` with no external scripts, fonts or CDNs unless the user asks. "No dependencies, works offline" is the point of the project.
- All IPv4 math must stay in unsigned 32-bit space: keep the `>>> 0` coercions when touching bitwise code (JavaScript bitwise operators return signed 32-bit integers).
- Any user-provided text inserted with `innerHTML` must be escaped (the VLSM name already is). Prefer `textContent` for new output.
- Add a known-answer case to `tests/calc.test.js` for every behavior change.
- Show errors inline with `showError(id, message)`; do not use `alert()`.
- Update the README when you add or remove a feature.

## Docs

- [docs/architecture.md](docs/architecture.md) — functions and data flow
- [docs/ui.md](docs/ui.md) — layout, styling, element IDs
- [docs/security.md](docs/security.md)
- [docs/testing.md](docs/testing.md) — how tests run and the known-answer cases
- [docs/agent-guide.md](docs/agent-guide.md)
