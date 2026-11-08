# SSH Access — mebakgtl.com (Yegara Hosting)

## Quick connect

```bash
ssh mebakgtl
```

The alias `mebakgtl` (and `mebekgtl.com`) is configured in `~/.ssh/config`.

## Connection details

| Setting | Value |
|---|---|
| Host | `193.108.130.21` (same as `lu-shared01.dapanel.net`) |
| SSH port | `53667` (nonstandard — port 22 is closed) |
| Username | `mebakgcc` |
| Auth | SSH key `~/.ssh/mebakgtl_ed25519` (public key authorized on server) |
| Shell | bash (jailshell — no sudo, no root) |

Password auth uses the DirectAdmin password, but key auth is set up and preferred.

## DirectAdmin panel

- Panel: https://lu-shared01.dapanel.net:2222/evo/
- SSO: Yegara client area (https://my.yegara.com) → Packages → mebakgtl.com → "Login to DirectAdmin"
- Client area login: abraham.sira27@gmail.com

## Server facts

- Domain: **mebakgtl.com** (registered until 2027-10-17). NOTE: the DirectAdmin account was originally set up as "mebekgtl.com" and was renamed back to mebakgtl.com on 2026-10-17 to match the registered domain — that rename is what made DNS work.
- Nameservers: ns5.private-nameserver.net (205.185.112.60) / ns6.private-nameserver.net (199.195.255.60)
- DNS: zone live on both nameservers → A record 193.108.130.21. Google DNS resolves; Cloudflare (1.1.1.1) had a stale negative cache right after the rename and clears itself within its TTL.
- Account active since 2026-10-17, plan Standard (Personal Use)
- PHP 8.4.23 (CLI), git 2.52.0, composer 2.10.3, Python 3.9.25, MariaDB 11.4 client
- Node.js not on default PATH (use DirectAdmin "Select PHP version" plugin / check alternatives if needed)

## Directory layout

- Home: `/home/mebakgcc`
- Site root: `~/domains/mebakgtl.com/public_html/`
- SSH keys dir: `~/.ssh/`

## Notes

- Long-running processes (PM2, bots, websocket servers) are not allowed on shared hosting.
- Cloud IP ranges (GitHub Actions etc.) are firewall-blocked; deploy by pulling from the server side (git).

## SSL / TLS — current state (2026-10-18)

**Working:** `https://mebakgtl.com` and `https://www.mebakgtl.com` serve a valid
Let's Encrypt certificate (CN=mebakgtl.com, SAN: mebakgtl.com + www.mebakgtl.com),
ECDSA/RSA chain verifies OK. Expires **2027-01-15**.

**Why it originally showed "certificate failed":** the domain had no certificate at
all, so LiteSpeed fell back to the shared server cert `CN=lu-shared01.dapanel.net`
(name mismatch). DirectAdmin's own Let's Encrypt provisioning was failing, for two
independent host-level reasons:

1. **DNS-01 (wildcard) always times out.** DA's ACME is set to prefer a wildcard
   (`*.mebakgtl.com`), which forces DNS-01. lego publishes the TXT via DA's local DNS
   and then checks propagation for 5 minutes. The zone's authoritative servers are
   remote (ns5/ns6.private-nameserver.net) and sync slower than that window, so every
   attempt fails after ~12 min. (3 failed attempts visible in SSL → Provisioning history.)
2. **HTTP-01 pre-check fails.** The server's own resolvers (`107.189.0.68/69`) return
   **SERVFAIL** for `mebakgtl.com`, so `getent hosts mebakgtl.com` fails on the box even
   though public DNS (8.8.8.8 / 1.1.1.1 / 9.9.9.9) resolves correctly. DirectAdmin's
   "HTTP request does not reach this server" check therefore rejects every hostname.
   This is a provider-side resolver fault, not a DNS-record problem.

Also note: `/.well-known/acme-challenge/` is intercepted by DirectAdmin and served from
root-owned `/var/www/html/.well-known/acme-challenge/`, so a userland ACME client
cannot satisfy HTTP-01 on its own.

**How the current certificate was issued:** DNS-01 out-of-band with acme.sh, then
installed through the panel. The private key lives in DirectAdmin, so the certificate
was obtained by signing a CSR generated from *DirectAdmin's* key
(`openssl req -new -key <DA key>`), not by generating a fresh key.

**Renewal (must be done manually — DA auto-renew cannot work until the resolver is fixed):**

```bash
# 1. Start the order; it prints the TXT record(s) to publish
~/.acme.sh/acme.sh --issue -d mebakgtl.com -d www.mebakgtl.com \
  --dns --yes-I-know-dns-manual-mode-enough-go-ahead-please --force

# 2. In DirectAdmin: DNS Management -> ADD RECORD, type TXT
#    name = _acme-challenge            value = <printed value>
#    name = _acme-challenge.www        value = <second printed value>
#    (propagates to ns5/ns6 within seconds)

# 3. Complete validation
~/.acme.sh/acme.sh --renew -d mebakgtl.com \
  --yes-I-know-dns-manual-mode-enough-go-ahead-please --force
```

Then re-install in the panel: **SSL/TLS Certificates → mebakgtl.com → Upload custom
certificate**, pasting the fullchain **followed by the DirectAdmin private key**
(DA rejects a key that does not match the stored one — it reports
`key values mismatch`). The DA key can be read from the panel API
(`GET /CMD_API_SSL?domain=mebakgtl.com&json=yes`, field `KEY`).

**Permanent fix to request from Yegara support:** ask them to correct/flush the
recursive resolvers (`107.189.0.68`, `107.189.0.69`) so they stop returning SERVFAIL
for `mebakgtl.com`. Once the box can resolve its own domain, DirectAdmin's ACME
HTTP-01 path works and renewal becomes fully automatic again.

## Email

- Mail is hosted on this server. MX `mebakgtl.com` → `mail.mebakgtl.com` (193.108.130.21).
- SPF: `v=spf1 a mx ip4:193.108.130.21 include:spf.mxyeet.net ~all` · DMARC: `p=none`.
- PTR for 193.108.130.21 is `lu-shared01.dapanel.net` (matches the server HELO — fine).
- **DKIM enabled 2026-10-19** via E-mail Accounts → ENABLE DKIM. Selector `x`,
  published at `x._domainkey.mebakgtl.com` (2048-bit RSA). Toggle back off with DISABLE DKIM.
- Mailboxes: `mebakgcc@` (default), `info@` (in use). Note `mebekgtl.com@mebakgtl.com`
  is just a mailbox *named* "mebekgtl.com" on the old domain — not an address at mebekgtl.com.

## Domain rename: mebakgtl.com → mebekgtl.com (parked 2026-10-19)

User considers `mebakgtl.com` a typo; brand is "Mebek" (site header, `info@mebek.com`).
**Blocked:** `mebekgtl.com` is NOT registered (RDAP 404, NXDOMAIN) — the name is available.
DirectAdmin's Domains → RENAME DOMAIN only renames locally (vhost, docroot, DNS zone,
mail); it cannot register a domain. Renaming before registration would take the site dark.

Sequence when the domain exists: register → set NS to `ns5/ns6.private-nameserver.net`
→ add domain in DA (or Rename Domain) → issue SSL (DNS-01 + panel paste, as above)
→ keep `mebakgtl.com` as alias with 301 redirect. `index.html` contains no hardcoded
`mebakgtl.com` references, so no file edits are required.

Billing context: the domain was **paid for, not free** — paid invoice #114864 (2026-10-17)
totals Br3,800 = Br500 hosting + **Br3,300 domain** (domain #107432, ACTIVE to 2027-10-17).
Yegara's "FREE .COM" offer applies only to the *Personal Cloud* plan (580 Birr/yr), not to
this Standard plan. Because the registration is inside the ICANN **5-day Add Grace Period**
(registered 2026-10-17T17:50Z, so until ~2026-10-22), the registrar can delete it for a full
registry refund — asking Yegara to swap `mebakgtl.com` → `mebekgtl.com` should cost nothing.
Note the site goes dark between deletion and the new name being live, so the swap must be
sequenced with care.
