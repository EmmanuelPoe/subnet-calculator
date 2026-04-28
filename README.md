# Subnet Calculator

A fast, browser-based CIDR and VLSM subnetting tool. No backend required — runs entirely in the browser.

## Features

- **CIDR Calculator** — enter any network/prefix, get network address, broadcast, host range, usable hosts
- **VLSM Planner** — input multiple subnets with different host requirements, get an optimized allocation
- **Supernet Calculator** — find the smallest supernet covering a list of prefixes
- **Subnet Splitter** — divide a network into N equal subnets or subnets of a given size
- **IPv4 & IPv6** — full support for both address families
- **Export** — download results as CSV

## Tech Stack

- Vanilla JavaScript (no frameworks, no dependencies)
- HTML5 / CSS3
- Works offline — single HTML file deployment

## Usage

Open `index.html` directly in any browser, or serve it:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

## Example

```
Input:  192.168.10.0/24
Output:
  Network:    192.168.10.0
  Broadcast:  192.168.10.255
  First Host: 192.168.10.1
  Last Host:  192.168.10.254
  Hosts:      254
  Wildcard:   0.0.0.255
  Binary:     11000000.10101000.00001010.00000000
```

## VLSM Example

```
Network: 10.0.0.0/16
Requirements:
  Sales      - 200 hosts  → 10.0.0.0/24   (254 usable)
  Engineering - 50 hosts  → 10.0.1.0/26   (62 usable)
  Management  - 10 hosts  → 10.0.1.64/28  (14 usable)
  WAN Links   -  2 hosts  → 10.0.1.80/30  (2 usable)
```
