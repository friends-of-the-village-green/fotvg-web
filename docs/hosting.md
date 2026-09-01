# Hosting and account ownership

Fill this in during Phase 0. It is the document that makes this site recoverable if the
person who built it becomes unavailable.

**This repository is public.** Record *which* account owns a service, not the address or
the credential. Addresses and logins go in the password vault. Nothing in this file
should be useful to someone attempting a password reset.

| Service | Account owner | Plan | Who has access | Notes |
|---|---|---|---|---|
| Domain registrar | | GoDaddy | | Holds `fotvg.org` (primary) and `fotvgkingston.org` (defensive, unused). Domain Lock on, privacy on. Registrant contact is Catherine Farrell at a personal Gmail, **not** an `@fotvg.org` role address — an account-recovery weak point worth fixing, see `docs/dns-cutover.md`. **Renewed 31 August 2026** for one year — registry expiry is now **3 September 2027** (confirmed by RDAP). The paid domain-protection add-on was declined deliberately: it blocks transfer-out. **FotVG intends to leave GoDaddy entirely** — see *Leaving GoDaddy* in `docs/dns-cutover.md`. |
| Old website | | GoDaddy site builder | | The current live fotvg.org. Built by a previous volunteer. Being replaced — see decision 006. **Technically live but never promoted and not in active use** — a first attempt at a web presence that did not take (John, 29 Aug 2026). It is therefore *not* a rollback target for the DNS cutover. Unpublish it at cutover; do not cancel the plan until the Workspace-billing and `pay.fotvg.org` questions are answered. |
| GoDaddy Payments | none | — | — | `pay.fotvg.org` → `paylinks.commerce.godaddy.com` (Poynt). **Dead.** The endpoint returns 503 with nothing provisioned, and Catherine has never heard of it — debris from the abandoned Website Builder site. Delete the DNS record when the GoDaddy website plan is cancelled. |
| DNS | | GoDaddy (free with registration) | | Nameservers `ns69`/`ns70.domaincontrol.com`. Zone recorded 25 Aug 2026 — see `docs/dns-cutover.md`. Staying at GoDaddy through the switchover; only two records change. |
| Email / MX | FotVG, direct with Google | **Google Workspace — Google's nonprofit plan** | | `MX` → `aspmx.l.google.com` et al. Carries `president@`, `vicepresident@`, `tech@`. **Breaking this breaks FotVG's email.** **Billed directly by Google, not resold through GoDaddy** (confirmed 29 Aug 2026) — so cancelling the GoDaddy website plan cannot take the email with it. Note: no DKIM published, and SPF uses GoDaddy's indirect `_spfm` form — `docs/dns-cutover.md`. |
| GitHub org | | Free | | |
| Netlify (prototype) | John, personal account | Free | John | Site `fotvg-webtest.netlify.app`, connected to the `fotvg-web` repo. **Temporary.** Build credits come out of John's personal allowance. Open-source/public-good application: not yet filed as of 9 Aug 2026. |
| Netlify (production) | **FotVG**, signed up with Google as `tech@fotvg.org` | Free | John and Catherine both reach `tech@fotvg.org`; `president@` to be invited as a second team owner | Created 29 Aug 2026. Team **FotVG**, project **fotvg**, project ID `50d3fda7-26b7-4477-a577-c9238df55d92`, at `fotvg.netlify.app`. Connected to the `fotvg-web` repo, branch `main`, no environment variables (decision 019). ⚠️ **Project visibility starts Private** — must be set Public at cutover or visitors get a login wall. `fotvg.org` to be attached at switchover; see `docs/dns-cutover.md`. |
| Sanity | John, personal account | **Nonprofit plan — approved and set up, 29 Aug 2026** | John | Organization "FotVG", org ID `o7rU0mAV3`. Project **FotVG Website**, project ID `nd22vlzw`, dataset `production`. Created 9 Aug 2026 on a Growth trial; the nonprofit application landed before it expired. |
| Sanity Studio | (same Sanity project) | — | John; **Kathleen (`president@`) and Betsy (`vicepresident@`) invited as project Editors, 9 Aug 2026** — role addresses rather than personal ones, so access travels with the office as the board turns over | Deployed 9 Aug 2026 to **https://fotvg.sanity.studio**, app ID `llg85ofl96ybrc4e2d0yr0lj`. Hosted by Sanity, not Netlify, so it costs no build credits. **Does not update itself when the schema changes** — see `docs/runbook.md`. |
| Donation platform | | | | Where does the money land? |
| Password vault | | | | Which board members have access? |

## Source material access

| What | Where | Access | Notes |
|---|---|---|---|
| FotVG shared drive | Google Drive → Shared drives → **FotVG** | John, **viewer** | Granted by Catherine Farrell (tech@fotvg.org), 28 July 2026. "Files owned by Friends of the Village Green"; 6 people. Google labels it an "untrusted shared drive" — that is just its external-org marker, not a problem. |
| Static mirror | `../fotvg-drive-folders` | local, 82 files | Downloaded 28 July 2026. **Now a snapshot, not the truth.** |
| Greenworks mission/vision | Google Doc, link in the password vault | John, **editor** | Shared by Kathleen Bullivant, 9 August 2026. Content transcribed into `docs/organization.md`, which is the copy to work from. |

**Reading Drive from tooling — the connector is on the wrong account.** The Google Drive
connector cannot see the FotVG shared drive, and could not see Kathleen's document
either. The cause is **not** that connectors can't enumerate shared drives — it is that
the connector is authorized against John's **Northwest Perennial Alliance** work account
rather than his personal one.

The evidence: searches through the connector return NPA material — *Perennial Post*
newsletters, HPSO quarterlies, NPA member spreadsheets — and nothing from FotVG. Both
FotVG items were shared to John **personally** (the shared drive by Catherine on 28 July,
the Greenworks doc by Kathleen on 9 August), and both are invisible to the connector. In
the browser, signed in as John personally, the FotVG shared drive appears normally.

**Fix:** reauthorize the Google Drive connector against the personal Gmail account.
Until that happens, everything below applies. Re-test afterwards by searching for
`Ledger_FotVG` — it lives in the shared drive and currently returns nothing.

- Read shared-drive documents **through the browser** while signed in as John.
- Google Docs render to canvas, so text extraction from `/edit` returns nothing useful.
  Append **`/mobilebasic`** to a Doc URL to get plain HTML that reads cleanly. The
  `/export?format=txt` endpoint redirects back to the editor and does not work here.
- Treat `../fotvg-drive-folders` as a dated snapshot. Check anything load-bearing against
  the live drive before relying on it.

## Current DNS records

The zone as it stood on **25 August 2026** — nameservers, the old site's `A` records,
the Google Workspace `MX` records, SPF, DMARC — is recorded in
**`docs/dns-cutover.md`**, along with the procedure for pointing the domain at Netlify
and how to put it back.

Still to do: a screenshot of GoDaddy's own DNS management screen, which shows TTLs and
anything that does not answer to a public lookup. Take it before making any change.

## Recovery notes
_(What someone would need to do to regain control of each account.)_
