# Architecture

`index.html` = `<style>` (design) + three tab panels (markup) + one inline `<script>` (logic). No modules, no state beyond the DOM.

## Core helpers

| Function | Purpose |
|---|---|
| `ipToInt(ip)` | dotted quad → unsigned 32-bit integer |
| `intToIp(n)` | unsigned integer → dotted quad |
| `parseCIDR(cidr)` | validates `a.b.c.d/p` (4 octets 0-255, prefix 0-32) and returns `{ip, pfx, ipInt, mask, network, broadcast}`, or `null` if invalid |
| `toBinary(ipInt)` | dotted binary string |

Masks are computed as `(0xFFFFFFFF << (32 - pfx)) >>> 0`, with `pfx === 0` special-cased because a 32-bit shift is a no-op in JavaScript.

## Tabs

### CIDR (`calcCIDR`, fires on `oninput`)
- Usable hosts: `2^(32-p) - 2`; /31 → 2 (RFC 3021 point-to-point), /32 → 1.
- First/last host are network+1 / broadcast-1, except /31 and /32 where they equal network/broadcast.

### VLSM (`addVLSMRow`, `calcVLSM`)
- Reads all `.vlsm-name` and `.vlsm-hosts` inputs, sorts requirements by host count (largest first), and allocates sequentially from the base network address.
- Prefix per subnet: the smallest block with `hosts + 2` addresses.
- Output: a table rendered with `innerHTML`; the subnet name is HTML-escaped.

### Split (`calcSplit`)
- `bits = ceil(log2(N))`, `newPfx = base.pfx + bits`, refuses if `newPfx > 30`.
- Always produces `2^bits` subnets (asking for 3 gives 4).

## Known logic gaps

See [testing.md](testing.md#known-bugs): VLSM does not check that allocations fit inside the base network, and empty host fields misalign names. `parseCIDR` accepts malformed octets such as `"1e1"` (computed as 1) because it validates with `isNaN` but converts with `parseInt`, and accepts prefixes such as `"24abc"`.
