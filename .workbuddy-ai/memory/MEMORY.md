# Project memory — bk2 (Mebek site)

## Hard rules (user-set, do not repeat mistakes)

- **Never publish Mebek content under `bekitradingplc.com` (or any other company's domain).**
  On 2026-10-19 I created `mebek.bekitradingplc.com` as a free preview; the user rejected it
  sharply — "so different company in one website?" — and ordered its removal. Removed same
  session. Mebek may only ever appear at `mebekgtl.com` (once registered) or a local-only
  preview (hosts file). No cross-brand subdomains, ever.
- Do not spend the user's money without explicit approval. Domain registration (~Br3,300/yr)
  is the only unavoidable paid step for `mebekgtl.com`; user is highly cost-sensitive and
  has repeatedly asked for costless paths.
- User does not accept DNS-level explanations at face value — always show live verification
  (nslookup against 8.8.8.8, curl with Host header) rather than asserting.

## Architecture facts

- Mebek site files live in HahuCloud cPanel: `/home/bekitrad/public_html/mebekgtl.com/`
  (index.html 37KB, same file as workspace `index.html`).
- HahuCloud server: 91.204.209.22 (coral.premium.hostns.io), cPanel v138 "Meridian" theme.
- Existing mailbox on HahuCloud: `info@mebekgtl.com` (local delivery only until the domain
  is registered; external mail bounces).
- Working email today: `info@mebakgtl.com` on Yegara (193.108.130.21), SPF+DKIM+DMARC ok.
