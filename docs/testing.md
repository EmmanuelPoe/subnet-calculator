# Testing

```bash
node --test          # discovers tests/calc.test.js
```

`tests/calc.test.js` extracts the inline `<script>` from `index.html`, runs it in a `node:vm` sandbox with a minimal fake DOM, and asserts on the values written to result elements. CI (`.github/workflows/ci.yml`, Node 22) runs it on every pull request. Still check visual changes in a real browser (desktop and ~375px wide).

## Known-answer cases

| Input | Expected |
|---|---|
| CIDR `192.168.10.0/24` | network .0, broadcast .255, hosts .1-.254, 254 usable, mask 255.255.255.0, wildcard 0.0.0.255 |
| CIDR `10.1.2.3/8` | network 10.0.0.0, broadcast 10.255.255.255, 16,777,214 usable |
| CIDR `172.16.5.4/31` | first 172.16.5.4, last 172.16.5.5, 2 usable |
| CIDR `8.8.8.8/32` | first = last = 8.8.8.8, 1 usable |
| CIDR `0.0.0.0/0` | broadcast 255.255.255.255, mask 0.0.0.0 |
| CIDR `200.1.1.1/24` | no negative numbers anywhere (checks the unsigned conversions) |
| CIDR `256.1.1.1/24`, `10.0.0.0`, `10.0.0.0/33`, `1e1.0.0.0/8`, `10.0.0.0/24abc` | inline error shown |
| VLSM base `10.0.0.0/16`, 200 / 50 / 10 / 2 hosts | `10.0.0.0/24`, `10.0.1.0/26`, `10.0.1.64/28`, `10.0.1.80/30` (README example) |
| VLSM name `<b>x</b>` | rendered as literal text, not bold |
| VLSM rows `A` (no hosts), `B` (10 hosts) in `10.0.0.0/24` | one row labelled **B**, `10.0.0.0/28` |
| VLSM base `10.0.0.0/30`, `Big` 100 hosts + `P2P` 2 hosts | error lists `Big (100 hosts)`; `P2P` gets `10.0.0.0/30` |
| Split `172.16.0.0/16` into 4 | four /18s: .0.0, .64.0, .128.0, .192.0 |
| Split `172.16.0.0/16` into 3 | four /18s (count rounds up to a power of two) |
| Split `10.0.0.0/29` into 2 | `10.0.0.0/30`, `10.0.0.4/30` |
| Split `10.0.0.0/30` into 2 | refused ("Too many subnets for this prefix") — /30 is the smallest result allowed |

