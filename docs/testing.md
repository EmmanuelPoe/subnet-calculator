# Testing

There are no automated tests. Verify manually in a browser. To automate, either move the logic into `calc.js` (loaded with a relative `<script src>`, so the page still works offline) and test it with `node --test`, or extract the inline `<script>` and run it in Node's `vm` module with a stubbed `document` — that is how the table below was checked.

## Known-answer cases

| Input | Expected |
|---|---|
| CIDR `192.168.10.0/24` | network .0, broadcast .255, hosts .1-.254, 254 usable, mask 255.255.255.0, wildcard 0.0.0.255 |
| CIDR `10.1.2.3/8` | network 10.0.0.0, broadcast 10.255.255.255, 16,777,214 usable |
| CIDR `172.16.5.4/31` | first 172.16.5.4, last 172.16.5.5, 2 usable |
| CIDR `8.8.8.8/32` | first = last = 8.8.8.8, 1 usable |
| CIDR `0.0.0.0/0` | broadcast 255.255.255.255, mask 0.0.0.0 |
| CIDR `200.1.1.1/24` | no negative numbers anywhere (checks the unsigned conversions) |
| CIDR `256.1.1.1/24`, `10.0.0.0`, `10.0.0.0/33` | inline error shown |
| VLSM base `10.0.0.0/16`, 200 / 50 / 10 / 2 hosts | `10.0.0.0/24`, `10.0.1.0/26`, `10.0.1.64/28`, `10.0.1.80/30` (README example) |
| VLSM name `<b>x</b>` | rendered as literal text, not bold |
| Split `172.16.0.0/16` into 4 | four /18s: .0.0, .64.0, .128.0, .192.0 |
| Split `172.16.0.0/16` into 3 | four /18s (count rounds up to a power of two) |
| Split `10.0.0.0/29` into 2 | `10.0.0.0/30`, `10.0.0.4/30` |
| Split `10.0.0.0/30` into 2 | refused ("Too many subnets for this prefix") — /30 is the smallest result allowed |

## Known bugs

Each of these was reproduced by running the page's script in Node.

1. **VLSM name/host misalignment**: host values are filtered (`filter(h => h > 0)`) before being paired with names by index. Rows `A` (empty hosts) and `B` (10 hosts) produce one subnet labelled **A** with B's requirement. Pair rows first, then filter.
2. **VLSM overflow**: allocations are not checked against the base network. Base `10.0.0.0/30` with a 100-host requirement returns `10.0.0.0/25`, far outside the base. Check `current + size - 1 <= base.broadcast` and report what does not fit.
3. **Loose parsing gives silently wrong answers**: `1e1.0.0.0/8` passes validation (`isNaN("1e1")` is false) and is computed as `1.0.0.0/8` because `parseInt("1e1")` is 1; `10.0.0.0/24abc` is accepted as /24. Validate with `/^\d{1,3}$/` per octet and `/^\d{1,2}$/` for the prefix.
4. **/0 host range**: `0.0.0.0/0` reports first host `0.0.0.1` and 4,294,967,294 usable hosts — mathematically consistent, but worth deciding whether /0 (and /1-/7) should be accepted at all.
