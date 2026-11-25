// Runs the inline <script> from index.html in a sandbox with a minimal fake DOM.
// Usage: node --test tests/
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];

function load() {
  const els = {};
  const el = id => (els[id] ||= { id, value: '', textContent: '', innerHTML: '', style: {}, classList: { toggle() {} } });
  let rows = [];
  const document = {
    getElementById: el,
    querySelectorAll: q =>
      q === '.vlsm-name' ? rows.map(r => ({ value: r[0] }))
      : q === '.vlsm-hosts' ? rows.map(r => ({ value: r[1] }))
      : [0, 1, 2].map(() => ({ classList: { toggle() {} } })),
    createElement: () => ({}),
  };
  const ctx = vm.createContext({ document, Math, Number, String, Array });
  vm.runInContext(script, ctx);
  const text = s => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return {
    cidr(value) {
      el('cidr-input').value = value;
      ctx.calcCIDR();
      if (el('cidr-error').style.display === 'block') return null;
      const ids = ['network', 'broadcast', 'first', 'last', 'hosts', 'mask', 'wildcard'];
      return Object.fromEntries(ids.map(k => [k, el('r-' + k).textContent]));
    },
    vlsm(base, r) {
      el('vlsm-network').value = base;
      rows = r;
      ctx.calcVLSM();
      return { table: text(el('vlsm-results').innerHTML), html: el('vlsm-results').innerHTML, error: el('vlsm-error').textContent };
    },
    split(base, n) {
      el('split-network').value = base;
      el('split-count').value = String(n);
      ctx.calcSplit();
      return { nets: el('split-results').innerHTML.match(/\d+\.\d+\.\d+\.\d+\/\d+/g) || [], error: el('split-error').textContent };
    },
  };
}

test('CIDR known answers', () => {
  const c = load();
  assert.deepEqual(c.cidr('192.168.10.0/24'), {
    network: '192.168.10.0', broadcast: '192.168.10.255', first: '192.168.10.1', last: '192.168.10.254',
    hosts: '254', mask: '255.255.255.0', wildcard: '0.0.0.255',
  });
  assert.equal(c.cidr('10.1.2.3/8').network, '10.0.0.0');
  assert.equal(c.cidr('10.1.2.3/8').hosts, (16777214).toLocaleString());
  assert.deepEqual([c.cidr('172.16.5.4/31').first, c.cidr('172.16.5.4/31').last, c.cidr('172.16.5.4/31').hosts], ['172.16.5.4', '172.16.5.5', '2']);
  assert.equal(c.cidr('8.8.8.8/32').hosts, '1');
  assert.equal(c.cidr('200.1.1.1/24').broadcast, '200.1.1.255'); // unsigned math above 128.0.0.0
  assert.equal(c.cidr('0.0.0.0/0').broadcast, '255.255.255.255');
});

test('CIDR rejects malformed input', () => {
  const c = load();
  for (const bad of ['256.1.1.1/24', '10.0.0.0', '10.0.0.0/33', '1e1.0.0.0/8', '10.0.0.0/24abc', '10.0.0/24', '10.0.0.0.0/8', '-1.0.0.0/8', ''])
    assert.equal(c.cidr(bad), null, bad);
  assert.equal(c.cidr('  10.0.0.0/8  ').network, '10.0.0.0'); // surrounding whitespace is fine
});

test('VLSM allocates largest first (README example)', () => {
  const r = load().vlsm('10.0.0.0/16', [['Sales', '200'], ['Engineering', '50'], ['Management', '10'], ['WAN', '2']]);
  assert.equal(r.error, '');
  assert.match(r.table, /Sales 10\.0\.0\.0\/24 .* Engineering 10\.0\.1\.0\/26 .* Management 10\.0\.1\.64\/28 .* WAN 10\.0\.1\.80\/30/);
});

test('VLSM keeps names with their own rows when a host field is empty', () => {
  const r = load().vlsm('10.0.0.0/24', [['A', ''], ['B', '10']]);
  assert.match(r.table, /^Name .* B 10\.0\.0\.0\/28/);
  assert.doesNotMatch(r.table, /\bA\b/);
});

test('VLSM reports requirements that do not fit the base network', () => {
  const r = load().vlsm('10.0.0.0/30', [['Big', '100'], ['P2P', '2']]);
  assert.match(r.error, /Does not fit in 10\.0\.0\.0\/30: Big \(100 hosts\)/);
  assert.match(r.table, /P2P 10\.0\.0\.0\/30/);
  assert.doesNotMatch(r.table, /\/25/);
});

test('VLSM escapes subnet names', () => {
  const r = load().vlsm('10.0.0.0/24', [['<b>x</b>', '10']]);
  assert.match(r.html, /&lt;b&gt;x&lt;\/b&gt;/);
});

test('Split', () => {
  const c = load();
  assert.deepEqual(c.split('172.16.0.0/16', 4).nets, ['172.16.0.0/18', '172.16.64.0/18', '172.16.128.0/18', '172.16.192.0/18']);
  assert.equal(c.split('172.16.0.0/16', 3).nets.length, 4); // rounds up to a power of two
  assert.deepEqual(c.split('10.0.0.0/29', 2).nets, ['10.0.0.0/30', '10.0.0.4/30']);
  assert.match(c.split('10.0.0.0/30', 2).error, /smallest allowed is \/30/);
  assert.match(c.split('10.0.0.0/24', 2.5).error, /whole number/);
});
