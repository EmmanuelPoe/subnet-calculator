# Subnet Calculator

A fast, browser-based IPv4 subnetting tool. No backend and no dependencies — a single HTML file that works offline.

## Features

- **CIDR Calculator** — results update as you type: network and broadcast address, first/last host, usable hosts, subnet and wildcard masks, prefix length, binary form. /31 (point-to-point, RFC 3021) and /32 are handled.
- **VLSM Planner** — name your subnets and their host counts; allocations are made largest-first from the base network. Requirements that do not fit are listed instead of spilling outside the base network.
- **Subnet Splitter** — divide a network into N equal subnets (N is rounded up to a power of two; the smallest result is /30).

Input is validated strictly (`a.b.c.d/p`, octets 0-255, prefix 0-32) and errors are shown inline.

## Usage

Open `index.html` directly in any browser, or serve it:

```bash
python3 -m http.server 8080
# or
npx serve .
```

## Example

```
CIDR: 192.168.10.0/24
  Network:    192.168.10.0
  Broadcast:  192.168.10.255
  First Host: 192.168.10.1
  Last Host:  192.168.10.254
  Hosts:      254
  Mask:       255.255.255.0
  Wildcard:   0.0.0.255
  Binary:     11000000.10101000.00001010.00000000
```

## VLSM example

```
Network: 10.0.0.0/16
Requirements:
  Sales       - 200 hosts → 10.0.0.0/24   (254 usable)
  Engineering -  50 hosts → 10.0.1.0/26   (62 usable)
  Management  -  10 hosts → 10.0.1.64/28  (14 usable)
  WAN Links   -   2 hosts → 10.0.1.80/30  (2 usable)
```

## Tests

```bash
node --test
```

The tests run the page's own script in Node with a stubbed DOM (`tests/calc.test.js`); CI runs them on every pull request.

## Roadmap

IPv6, supernet/summary calculator, CSV export.

Agent and contributor docs: [CLAUDE.md](CLAUDE.md) and [docs/](docs/).
