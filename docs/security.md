# Security

The app runs entirely in the browser, has no backend, stores nothing, and makes no network requests. The realistic risks are script injection through rendered output and future dependency creep.

## Output rendering

- CIDR results are written with `textContent` (safe).
- VLSM and Split build HTML strings and assign them to `innerHTML`. The only free-text input, the VLSM subnet name, is escaped (`& < > " '`); every other interpolated value is computed from integers. Keep it that way: escape any new user-supplied string, or build rows with `document.createElement` + `textContent`.
- `addVLSMRow` uses `innerHTML` with a constant string only.

## Hosting

If served from a web host, add a Content-Security-Policy. Because the script and styles are inline, a strict policy needs hashes (`script-src 'sha256-...'`) or moving them to separate files; inline `onclick`/`oninput` handlers would also need to become `addEventListener` calls.

## Dependencies

None, intentionally. Do not add CDN scripts; if a library is ever needed, vendor it with a subresource-integrity hash.
