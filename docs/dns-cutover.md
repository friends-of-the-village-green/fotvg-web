# DNS cutover — pointing `fotvg.org` at Netlify

How FotVG's web address moves from the old GoDaddy site to the new one, without
breaking the organization's email.

> **Read this whole file before changing a single record.** The domain that serves
> the website is the same domain that carries `president@`, `vicepresident@` and
> `tech@fotvg.org`. Those mailboxes are Google Workspace, and they are configured
> through DNS. A careless change here does not just take the website down — it
> silently stops FotVG's mail.

This is the detail behind Phase 6 of `SETUP.md` and the "Point DNS at the new site"
line in `docs/launch-checklist.md`.

---

## The short version

FotVG keeps GoDaddy as both registrar **and** DNS provider. Two records change:
the apex `A` record and the `www` `CNAME`. Everything to do with email is left
alone. The domain is not transferred anywhere.

| | From | To |
|---|---|---|
| `@` (apex) | `A` → *WebsiteBuilder Site* (resolves to `76.223.105.230`, `13.248.243.5`) | `A` → `75.2.60.5` |
| `www` | `CNAME` → `fotvg.org` | `CNAME` → *(the Netlify site).netlify.app* |

Everything else in the zone stays exactly as it is — including the `pay` `CNAME`,
which is live GoDaddy payments infrastructure and has nothing to do with the website.

---

## The zone as it stood, 29 August 2026

Sixteen records. Confirmed twice: from a public DNS lookup on 25 August, and from
GoDaddy's own DNS Records screen on 29 August — the screenshot is in
`docs/GoDaddy prior to Changes.docx`, which is gitignored because the Registration
Settings page carries a board member's home address. This table is the rollback
reference: if something goes wrong, this is what "put it back" means.

**Every TTL in the zone is 1 hour.**

| Name | Type | Value |
|---|---|---|
| `fotvg.org` | NS | `ns69.domaincontrol.com`, `ns70.domaincontrol.com` (GoDaddy, "using default nameservers") |
| `fotvg.org` | SOA | `ns69.domaincontrol.com` / `dns.jomax.net`, serial `2026041500` |
| `fotvg.org` | A | **one row, shown by GoDaddy as `WebsiteBuilder Site`, not an address.** It resolves to `76.223.105.230` and `13.248.243.5`. See *The apex A record is not a normal record* below. |
| `www.fotvg.org` | CNAME | `fotvg.org` |
| `pay.fotvg.org` | CNAME | `paylinks.commerce.godaddy.com` — **GoDaddy Payments (Poynt). Live. Not ours to touch.** See *Loose ends* |
| `fotvg.org` | MX | `1 aspmx.l.google.com`, `5 alt1`, `5 alt2`, `10 alt3`, `10 alt4` — **Google Workspace** |
| `fotvg.org` | TXT | `v=spf1 include:dc-aa8e722993._spfm.fotvg.org ~all` |
| `dc-aa8e722993._spfm.fotvg.org` | TXT | `v=spf1 include:_spf.google.com ~all` |
| `_dmarc.fotvg.org` | TXT | `v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;` |
| `fotvg.org` | TXT | `google-site-verification=dc2-YfhYhExonbmyTrp9tCjx96Bh_JZz1zvxvHSsYvM` |
| `_domainconnect.fotvg.org` | CNAME | `_domainconnect.gd.domaincontrol.com` |
| `google._domainkey.fotvg.org` | — | **does not exist** — no DKIM is published (see *Loose ends*) |

Also registered, on separate GoDaddy nameservers (`ns01`/`ns02.domaincontrol.com`):
`fotvgkingston.org`, pointing at a GoDaddy parked page, no mail.

Taking the screenshot was worth it. It caught two things the public lookup could not:
the `pay` `CNAME`, which nobody would have thought to query for, and the odd shape of
the apex `A` record.

### The apex A record holds a product, not an address, and cannot be part-edited

GoDaddy shows one apex `A` row, and its value is the words `WebsiteBuilder Site` rather
than an address. GoDaddy writes it on behalf of the Website Builder product, and it
answers with two Global Accelerator addresses.

The fields all *look* editable — nothing is greyed out. But they do not save. Tried on
29 August 2026: changing only the TTL to a custom 600 seconds, leaving the value alone,
was rejected with the Value field outlined in red and two messages —

> Domain has some invalid records, please address the invalid records.
> Record could not be added

The form validates the whole row on save, and `WebsiteBuilder Site` is not a valid IPv4
address, so nothing on that row can be changed while it still says that. **The record
can only be saved by replacing the value with a real address** — which is precisely the
cutover edit.

The consequence: **the TTL on the apex cannot be lowered in advance.** See *About the
TTLs* below, which is why that turns out not to matter.

The one thing to watch afterwards: with a *published* Website Builder site still
attached to the account, GoDaddy occasionally re-asserts its own `A` record or nags
about "fixing" the DNS. If the old site ever reappears at `fotvg.org`, that is the
first place to look. Unpublishing the old site removes the possibility altogether —
see the cutover steps, which do that first.

---

## Why not move DNS to Netlify

It is entirely possible: change the nameservers at GoDaddy to the four Netlify gives
you (`dns1`–`dns4.p0X.nsone.net`) and Netlify runs the zone. Registration stays at
GoDaddy either way — nameservers and registration are separate things, and no domain
transfer is involved.

It is still the wrong choice here, for three reasons.

1. **Everything above has to be recreated by hand, correctly, in advance.** Miss a
   record and FotVG's email breaks. Netlify's own documentation says that with a lot
   of existing records, an external DNS provider is simpler and safer.
2. **The SPF record is a trap** (see below). It is exactly the sort of thing that
   gets copied wrong.
3. **What Netlify DNS buys you is worth nothing to this site** — wildcard
   certificates for branch-deploy subdomains, custom Deploy Preview addresses. This
   is a small brochure site rebuilt daily. There is no need.

Leaving DNS at GoDaddy also means the board only ever has to hold one set of
credentials for the domain, which matters more than any of the above.

### The SPF trap, written down

FotVG's apex SPF record does not point at Google. It points at
`dc-aa8e722993._spfm.fotvg.org` — a *second* TXT record in the same zone, which then
includes `_spf.google.com`. That indirection is GoDaddy's "SPF merge" feature.

Anyone migrating the zone will copy the apex TXT record, see `v=spf1 include:…~all`,
tick it off, and never notice that the thing it includes lived in the zone they just
abandoned. SPF then fails, and FotVG's mail starts landing in spam folders with no
error message anywhere.

If the zone is ever moved, replace the apex record with the flattened form:

```
v=spf1 include:_spf.google.com ~all
```

and drop the `_spfm` record entirely.

---

## Before cutover day

- [ ] **FotVG's own Netlify account exists** and this repository is connected to it.
      Do not attach the real domain to a site running on John's personal build
      allowance — `SETUP.md` Phase 6, decision 015.
- [ ] 🚨 **The domain is renewed.** `fotvg.org` comes up for renewal on **3 September
      2026** and auto-renew is **not shown as on** (checked 29 August 2026). Nothing
      else on this page matters if the registration lapses: the website and every
      `@fotvg.org` mailbox go down together. **Renew before cutting over**, and turn
      auto-renew on at the same time so this cannot recur. Only Catherine can pay it.
- [ ] **The GoDaddy account is FotVG's,** not a previous volunteer's, and at least two
      current board members can get into it. Record the answer in `docs/hosting.md`.
- [x] **How Google Workspace is billed.** **Resolved 29 August 2026: Workspace is direct
      with Google, on Google's nonprofit plan — not resold through GoDaddy.** So
      cancelling the GoDaddy plan cannot take FotVG's email with it. This was the
      largest unknown attached to this cutover and it is now closed.
- [ ] **Old URLs mapped.** List the addresses the current site publishes — anything
      on printed material, in the newsletter, or linked from another site — and add
      301 redirects to `netlify.toml` for any that will not exist on the new site.
      Cheap now, embarrassing later.
- [ ] **Decide the canonical address.** `www.fotvg.org` or `fotvg.org`? Pick one; the
      other will permanently redirect to it. Netlify suggests `www` as primary when
      DNS is external, because an apex `A` record pins the site to a single address
      rather than using their full content network. For a site this size the
      difference is immaterial — what matters is choosing deliberately and then being
      consistent everywhere: Sanity Site settings, printed material, the newsletter.
- [x] **Screenshot the GoDaddy DNS page.** Done 29 August 2026, and the zone table
      above corrected from it. The screenshots stay out of the repository — the
      Registration Settings page shows a board member's home address.
- [ ] **Find out what `pay.fotvg.org` is for**, and whether anything printed points at
      it. See *Loose ends*.
- [ ] **Pick the day.** Tuesday or Wednesday morning. Not a Friday, not the week of
      an event, not while the person who understands it is away.

### About the TTLs

Every record in the zone has a one-hour TTL, and the usual advice — drop them to 600
seconds a day ahead — **does not apply here.** Two reasons, and they compound.

The apex `A` record cannot be part-edited at all (above), so its TTL cannot be lowered
without performing the cutover itself. And the reason for lowering it in the first place
was to make a *retreat* fast, which is a benefit worth nothing when there is nothing to
retreat to.

So set TTL 600 as part of the cutover edit and skip the separate day-ahead trip. What
that costs is one hour, once: resolvers holding the old answer keep it for up to an hour
before they see Netlify. What it preserves is the part that actually matters — the new
record carries a 600-second TTL from the moment it is saved, so if the address is
mistyped, the correction is visible in about ten minutes. The short TTL protects the
second attempt, not the first.

One hour of some visitors seeing a site that was never promoted is not a cost worth a
day of preparation to avoid.

## Cutover

1. **In Netlify first.** Site → Domain management → add `fotvg.org`. Netlify will
   report that DNS is not pointing at it yet and offer the records it wants. That is
   expected. Set the primary domain to whichever address you chose above.
2. ⚠️ **Set Production visibility to Public.** Project configuration → General →
   Visitor access → Project visibility → Edit visibility. New Netlify projects are
   created **Private**, meaning only logged-in team members can see them — useful
   before launch, catastrophic after it.

   This is measured, not guessed. On 29 August 2026, with visibility Private,
   `https://fotvg.netlify.app/` answered **HTTP 401** and a Netlify "Login Redirect"
   page to an unauthenticated request — `robots.txt` included. The prototype, which is
   public, answered 200. **Every path is gated, for everyone not signed in to the
   team.**

   Netlify's own wording says a private project is visible to the team "until it goes
   live", which reads as though attaching a domain lifts it. It may well. Do not find
   out on the morning. Set it, then load `https://fotvg.org` in a private browsing
   window and confirm you get the site rather than a login screen. The failure this
   prevents is the whole site showing a login wall to every visitor — including, on
   the worst possible day, a grant reviewer.
3. **Unpublish the old GoDaddy site.** Websites + Marketing → the site → unpublish, or
   point it back at its free `.godaddysites.com` address. This is what stops GoDaddy
   re-asserting the apex `A` record later, and it is safe because the old site is not
   in use and is not the rollback. **Unpublish only. Do not cancel the plan** — the
   Workspace billing and `pay.fotvg.org` questions are still open.
4. **In GoDaddy** → `fotvg.org` → DNS → DNS Records:
   - Edit the apex `A` row — the one reading `WebsiteBuilder Site`. Value
     **`75.2.60.5`**. TTL 600. All four fields on that row are editable; accept any
     warning about disconnecting the Website Builder site.
   - Edit the `www` `CNAME`: change the value from `fotvg.org` to the site's Netlify
     address, e.g. `fotvg.netlify.app`. TTL 600.
5. **Touch nothing else.** Not the five MX records, not any of the four TXT records,
   not `_domainconnect`, and **not `pay`** — that one is taking money.
6. **Wait.** Ten to thirty minutes is typical, up to 24 hours is possible.
7. **Let the certificate issue.** Netlify requests a Let's Encrypt certificate only
   once DNS actually resolves to it. "Certificate pending" or a browser warning for
   the first half hour is normal and not a fault. If it is still pending after a few
   hours, use Netlify's "Renew certificate" button before assuming anything is wrong.

Why an `A` record and not something tidier: a `CNAME` cannot legally sit at the apex
of a domain. Some DNS providers offer `ALIAS` or `ANAME` records to work around this,
and Netlify prefers them (`apex-loadbalancer.netlify.com`) — but GoDaddy's standard
DNS does not offer one. Hence the fixed address.

## Immediately after

- [ ] `https://fotvg.org` and `https://www.fotvg.org` both load the new site, both
      with a padlock, one redirecting to the other.
- [ ] `http://` versions redirect to `https://`.
- [ ] **Send an email to `president@fotvg.org` from an outside account and confirm it
      arrives.** Then send one *from* a `@fotvg.org` address to a Gmail or Outlook
      account and confirm it lands in the inbox rather than spam. This is the test
      that actually matters.
- [ ] The contact form submits and the notification arrives.
- [ ] Check it on a phone, on cellular data rather than home wi-fi.
- [ ] Tell the board it has happened, and what to do if they see something odd.

## For a week or two afterwards

- [ ] Watch for the old site reappearing at `fotvg.org`. If it does, GoDaddy has
      re-asserted its `A` record — put `75.2.60.5` back and unpublish the old site.
- [ ] **Cancel the GoDaddy Website Builder plan** — but only the website plan, never the
      domain registration. Both questions that used to guard this are now answered:
      Workspace is direct with Google, and `pay.fotvg.org` is dead. Nothing of value
      hangs off the plan. Do it as its own small task once the new site has been live a
      week or two, not on cutover day.
- [ ] **Delete the `pay` `CNAME`** at the same time. It serves a 503 and belongs to the
      abandoned build. One change at a time — not during the cutover.
- [ ] Put the TTLs back up to an hour or so, once nothing has needed changing.

## If it goes wrong

**There is nothing to roll back to, and that is fine.** The old GoDaddy Website Builder
site was a first attempt at a web presence that was never promoted and is not in active
use — confirmed by John, 29 August 2026. Restoring it is not a goal. So the failure this
procedure has to survive is not "the old site is gone", it is "the new site is not up
yet", and the answer to that is to fix forward.

The realistic failure is a typo in the new `A` record, which shows up as `fotvg.org` not
resolving at all. Correct the record; with a 600-second TTL it is right again within
about ten minutes. That is what the TTL reduction buys — not a retreat, a fast second
attempt.

Email is untouched either way, because nothing in this procedure goes near it. If email
*does* break, the cause is not this procedure — it is something else that changed.
Compare the live zone against the table above, record by record.

---

## Loose ends worth doing separately

Not part of the cutover. Do not bundle them into it.

- **No DKIM is published.** `google._domainkey.fotvg.org` does not exist, so FotVG's
  outgoing mail is unsigned. With DMARC set to `p=quarantine`, that leaves
  deliverability resting on SPF alone. Turning DKIM on in the Google Workspace admin
  console and adding the TXT record it generates is a free improvement — but it is a
  mail change, not a website change, and belongs on its own day with whoever
  administers the Workspace account.
- **`pay.fotvg.org` is a dead record.** It points at GoDaddy Payments
  (`paylinks.commerce.godaddy.com` → Poynt), which made it look live. It is not:
  the endpoint returns **503, nothing provisioned**, and Catherine — the treasurer,
  who would know — has never heard of it. It is debris from the abandoned Website
  Builder attempt. No money moves through it. Delete it when the GoDaddy plan is
  cancelled; leave it alone until then, because there is no reason to make an extra
  change to a zone that carries FotVG's mail.
- **The domain's registrant contact is a personal Gmail address**, not one of the
  `@fotvg.org` role addresses. Whoever controls that inbox can recover the domain. The
  Studio invitations already use role addresses for exactly this reason — the registrar
  account is a much bigger prize and should follow. A change of registrant email is a
  slow, verification-heavy process at any registrar, so start it early and not during a
  cutover.
- **DMARC reports go to GoDaddy** (`dmarc_rua@onsecureserver.net`), which means
  nobody at FotVG ever sees them. Worth pointing somewhere the board can reach if
  anyone is ever going to act on them.
- **`fotvgkingston.org`** sits on a GoDaddy parked page. Decide whether it forwards
  to `fotvg.org` — GoDaddy's domain forwarding does this without touching this
  zone — or stays dormant as a defensive registration. Either is fine; drifting
  without a decision is not.
- **HSTS.** Netlify can send it. Do not enable it until the site has been stable for
  a good while — it is difficult to undo, because browsers cache the instruction.
