# Hosting and account ownership

Fill this in during Phase 0. It is the document that makes this site recoverable if the
person who built it becomes unavailable.

**This repository is public.** Record *which* account owns a service, not the address or
the credential. Addresses and logins go in the password vault. Nothing in this file
should be useful to someone attempting a password reset.

| Service | Account owner | Plan | Who has access | Notes |
|---|---|---|---|---|
| Domain registrar | | GoDaddy | | Holds `fotvg.org` (primary) and `fotvgkingston.org` (defensive, unused). Auto-renew on? Whose card? |
| Old website | | GoDaddy site builder | | The current live fotvg.org. Built by a previous volunteer. Being replaced — see decision 006. |
| DNS | | | | Record current zone before any change |
| Email / MX | | | | **Breaking this breaks FotVG's email** |
| GitHub org | | Free | | |
| Netlify (prototype) | John, personal account | Free | John | Site `fotvg-webtest.netlify.app`, connected to the `fotvg-web` repo. **Temporary.** Build credits come out of John's personal allowance. Open-source/public-good application: not yet filed as of 9 Aug 2026. |
| Netlify (production) | not created yet | | | To be created under a FotVG account at switchover, then pointed at `fotvg.org`. See decision 015. |
| Sanity | John, personal account | **Growth Trial — expires ~27 Aug 2026** | John | Organization "FotVG", org ID `o7rU0mAV3`. Project **FotVG Website**, project ID `nd22vlzw`, dataset `production`. Created 9 Aug 2026. Nonprofit application not yet submitted — form link in hand, to be submitted by Kathleen or Betsy **before the trial expires**. At expiry the project drops to the free plan; nothing is lost. |
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
_(Paste or screenshot the zone file here before making any change.)_

## Recovery notes
_(What someone would need to do to regain control of each account.)_
