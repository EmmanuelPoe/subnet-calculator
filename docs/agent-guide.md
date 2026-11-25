# Agent guide

## Recipes

**Add a tool (new tab)**: add a `.tab` button, a `<div id="tab-<name>" style="display:none">` panel, append `'<name>'` to both arrays in `switchTab`, and write a `calc<Name>()` function that uses `parseCIDR`.

**Implement a README-promised feature** (supernet, CSV export, IPv6): add it as above, then keep the README in sync. IPv6 needs `BigInt` arithmetic (128-bit); do not try to reuse the 32-bit helpers. CSV export can build a `Blob` and trigger a download with a temporary `<a download>`, with no dependency.

**Fix a bug**: add a failing case to `tests/calc.test.js` first, fix it, then run `node --test`.

## Pitfalls

- JavaScript bitwise ops are signed 32-bit: `0xFFFFFFFF << 8` is negative until coerced with `>>> 0`. Addresses at or above 128.0.0.0 are where mistakes show up.
- `1 << 32 === 1`; that is why prefix 0 is special-cased. Use `Math.pow(2, n)` for sizes, as the code does.
- `toLocaleString()` formats host counts with thousands separators; don't parse those strings back into numbers.
- The `button` CSS rule applies to tab buttons and the "+ Add Subnet" button too; override with more specific selectors (`.tab`, `#add-subnet`) as the existing code does.

## Done means

`node --test` passes, the page works in a browser (desktop and ~375px wide) with no console errors and no external requests, README accurate.
