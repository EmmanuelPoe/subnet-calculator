# Architecture

`index.html` = `<style>` (design) + three tab panels (markup) + one inline `<script>` (logic). No modules, no state beyond the DOM.

## Core helpers

| Function | Purpose |
|---|---|
| `ipToInt(ip)` | dotted quad → unsigned 32-bit integer |
| `intToIp(n)` | unsigned integer → dotted quad |
| `parseCIDR(cidr)` | strict regex `^\d{1,3}(\.\d{1,3}){3}/\d{1,2}$` (surrounding whitespace trimmed), octets ≤ 255, prefix ≤ 32; returns `{ip, pfx, ipInt, mask, network, broadcast}`, or `null` |
| `escapeHtml(text)` | escapes `& < > " '` for anything inserted with `innerHTML` |
| `showError(id, message)` | shows/hides an inline `.error` paragraph (empty message hides it) |
| `toBinary(ipInt)` | dotted binary string |

Masks are computed as `(0xFFFFFFFF << (32 - pfx)) >>> 0`, with `pfx === 0` special-cased because a 32-bit shift is a no-op in JavaScript.

## Tabs

### CIDR (`calcCIDR`, fires on `oninput`)
- Usable hosts: `2^(32-p) - 2`; /31 → 2 (RFC 3021 point-to-point), /32 → 1.
- First/last host are network+1 / broadcast-1, except /31 and /32 where they equal network/broadcast.

### VLSM (`addVLSMRow`, `calcVLSM`)
- Pairs each row's name with its own host count (unnamed rows become `Subnet <n>`), drops rows without hosts, sorts largest first, and allocates sequentially from the base network address — largest-first keeps each block aligned to its size.
- Prefix per subnet: the smallest block with `hosts + 2` addresses.
- Requirements that would extend past the base broadcast address are skipped and listed in `#vlsm-error`; the rest are still shown.
- Output: a table rendered with `innerHTML`; names go through `escapeHtml`.

### Split (`calcSplit`)
- N must be a whole number 2-1024. `bits = ceil(log2(N))`, `newPfx = base.pfx + bits`; refuses (inline error) if `newPfx > 30`.
- Always produces `2^bits` subnets (asking for 3 gives 4).

