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

- [x] **FotVG's own Netlify account exists** and this repository is connected to it.
      Done 29 August 2026: team **FotVG**, project **fotvg**, on `tech@fotvg.org`.
      Do not attach the real domain to a site running on John's personal build
      allowance — `SETUP.md` Phase 6, decision 015.
- [x] 🚨 **The domain is renewed.** **Done 31 August 2026** — one year, add-ons declined,
      registry expiry now **3 September 2027**. Auto-renew was still not confirmed; that
      question follows the domain to the new registrar. The original note is kept below,
      because the verification command and the `clientRenewProhibited` trap both stay
      useful. The registry — not GoDaddy's screen, the `.org`
      registry itself — gives the expiry as **2026-09-03 14:01 UTC, which is 07:01
      Pacific on Thursday 3 September**. It was a one-year registration taken out on
      3 September 2025, and auto-renew is not shown as on (checked 29 August 2026).
      Nothing else on this page matters if it lapses: the website and every
      `@fotvg.org` mailbox go down together, and a `.org` in redemption is expensive
      and slow to recover. **Renew before cutting over**, and turn auto-renew on at the
      same time so this cannot recur. Only Catherine can pay it.

      Verify it independently rather than relying on a promise — after renewal the
      registry should read **2027**-09-03:

      ```
      curl -s https://rdap.publicinterestregistry.org/rdap/domain/fotvg.org | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(JSON.parse(d).events.find(e=>e.eventAction==='expiration').eventDate))"
      ```

      If renewal is refused, the likely cause is the registry status set — GoDaddy's
      Domain Lock applies `clientRenewProhibited` along with the delete, transfer and
      update locks. Renewing through the GoDaddy account normally works anyway, because
      a registrar can lift its own status; if it does not, turning Domain Lock off,
      renewing, and turning it back on is the fix.
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
- [x] **Decide the canonical address.** Decided: the apex, `https://fotvg.org`, with
      `www` redirecting to it — decision 040. Note that choosing the apex does **not**
      mean leaving `www` out of the Netlify configuration; it still has to be added as a
      domain alias or no certificate is ever issued for it (decision 043).
      The original question, and the reasoning:
      `www.fotvg.org` or `fotvg.org`? Pick one; the
      other will permanently redirect to it. Netlify suggests `www` as primary when
      DNS is external, because an apex `A` record pins the site to a single address
      rather than using their full content network. For a site this size the
      difference is immaterial — what matters is choosing deliberately and then being
      consistent everywhere: Sanity Site settings, printed material, the newsletter.
- [x] **Screenshot the GoDaddy DNS page.** Done 29 August 2026, and the zone table
      above corrected from it. The screenshots stay out of the repository — the
      Registration Settings page shows a board member's home address.
- [x] **Find out what `pay.fotvg.org` is for.** Answered 29 August 2026: it is debris
      from the abandoned Website Builder site. The endpoint returns 503 with nothing
      provisioned, and the treasurer — who would know — has never heard of it. No money
      moves through it. Left untouched during the cutover and deleted later; see
      *Loose ends*.
- [x] **Pick the day.** Tuesday 1 September 2026. Not a Friday, not the week of
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

0. **Content first, then the merge, then everything else.** Clear the per-program
   donation links in the Studio and **Publish** — not just save. The site reads the
   public dataset with no token, so a draft is invisible to the build and the links
   would still render with nobody any the wiser. Then wait a few minutes: the Sanity
   client runs with `useCdn: true`, and a build started the instant after publishing
   can capture the stale cached response. A build that does that looks exactly like a
   successful one.

   Then merge the switchover pull request. That build fetches content fresh, so it
   carries the cleared links *and* the `fotvg.org` canonical URLs *and* the removed
   `robots.txt` disallow together — one build, no window where one has landed and the
   others have not. Confirm on the `.netlify.app` address that the "Or give to a
   particular program" section has gone before moving on.

   ⚠️ If a content-only deploy is ever wanted before the build hook is swapped,
   trigger it from **Netlify → fotvg → Deploys → Trigger deploy**. The GitHub Action
   still points at the prototype's hook until the `NETLIFY_BUILD_HOOK_URL` secret is
   replaced, so "Run workflow" would rebuild the wrong site.
1. **In Netlify.** Site → Domain management → add `fotvg.org`. Netlify will
   report that DNS is not pointing at it yet and offer the records it wants. That is
   expected. Set the primary domain to whichever address you chose above.

   🚨 **Then add `www.fotvg.org` as a domain alias as well** — Add domain alias →
   `www.fotvg.org`. Adding the apex alone is not enough, and the way it fails is nasty.
   Netlify will list `www.fotvg.org` by itself as "Redirects automatically to primary
   domain", which looks like the job is done, but the certificate it issues carries a
   single name: `DNS:fotvg.org`. A visitor typing `www.fotvg.org` then gets a full-page
   browser security warning instead of a redirect, because there is no certificate to
   present for that name. Measured on 1 September 2026; see *What happened on the day*.
   With the alias added, the reissued certificate reads
   `DNS:fotvg.org, DNS:www.fotvg.org` and the redirect works. Decision 043.
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
3. **Unpublish the old GoDaddy site.** This is what stops GoDaddy re-asserting the apex
   `A` record later, and it is safe because the old site is not in use and is not the
   rollback. **Unpublish only. Do not cancel the plan** — the Workspace billing and
   `pay.fotvg.org` questions are still open.

   **The control is not on the Website dashboard**, which is where everyone looks for
   it. That page offers Preview, Edit Website and a large black **Publish Site** button
   — the opposite of what you want. Unpublish lives *inside the builder*:
   **Edit Website → Settings → Unpublish → confirm**.

   **Unpublishing does not release the domain.** GoDaddy's own documentation is explicit
   that the domain stays linked to the site; visitors get a "Coming Soon" page with the
   site's header image. So from this moment until DNS propagates, `fotvg.org` serves
   GoDaddy's placeholder rather than the old site. Harmless when the old site was never
   promoted, but it argues for doing steps 3 and 4 back to back rather than leaving a
   gap overnight.
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

   When it has issued, **check which names are on it** rather than checking that the
   site loads. The apex loading proves nothing about `www`:

   ```
   echo | openssl s_client -connect 75.2.60.5:443 -servername fotvg.org 2>/dev/null \
     | openssl x509 -noout -subject -ext subjectAltName -dates
   ```

   You want `DNS:fotvg.org, DNS:www.fotvg.org`. One name means step 1's alias is
   missing.

Why an `A` record and not something tidier: a `CNAME` cannot legally sit at the apex
of a domain. Some DNS providers offer `ALIAS` or `ANAME` records to work around this,
and Netlify prefers them (`apex-loadbalancer.netlify.com`) — but GoDaddy's standard
DNS does not offer one. Hence the fixed address.

### Checking your work, without trusting a screen

Two screens lied during the September 2026 cutover — GoDaddy's DNS panel showed a record
it had not yet written, and the machine doing the work served a stale answer for the
best part of an hour. Neither is a reason for alarm; both are a reason to check the
domain from outside.

**Query a public resolver over HTTPS.** This bypasses the local cache, the router and
the ISP, and it is the closest thing to "what a stranger sees":

```
curl -s "https://dns.google/resolve?name=fotvg.org&type=A"
curl -s "https://cloudflare-dns.com/dns-query?name=fotvg.org&type=A" -H "accept: application/dns-json"
```

**Do not trust `nslookup ... ns69.domaincontrol.com`.** Naming the nameserver looks
authoritative and is not: a local resolver can answer anyway, and it will keep serving
the old apex record for the full hour of its original TTL. The tell is the words
`Non-authoritative answer` in the output, and a TTL counting down from 3600 rather than
600. A cached record ages exactly the way a real one does, which is what makes it
convincing.

**Test the site by address rather than by name**, so a stale cache cannot mislead you:

```
curl -sI --resolve fotvg.org:443:75.2.60.5 https://fotvg.org/
```

**Do not judge the cutover from the machine that performed it.** Its answers are the
most likely of anyone's to be stale, and `ipconfig /flushdns` will not help when the
cached copy is held upstream on the network. A phone on cellular data is a better
witness than any command on the laptop.

## Immediately after

- [x] `https://fotvg.org` and `https://www.fotvg.org` both load the new site, both
      with a padlock, one redirecting to the other. Verified 1 September 2026:
      `https://fotvg.org` 200 with a valid certificate; `https://www.fotvg.org` 301 to
      it in one hop. The certificate carries both names.
- [x] `http://` versions redirect to `https://`. Both hostnames, verified the same day.
- [x] The live site serves the right content. `/`, `/about-us`, `/sitemap-index.xml` and
      `/robots.txt` all 200 on the real domain; the "Or give to a particular program"
      section is gone; the general Square link is present; canonical reads
      `https://fotvg.org/`; no `[TK]` markers.
- [ ] **Send an email to `president@fotvg.org` from an outside account and confirm it
      arrives.** Then send one *from* a `@fotvg.org` address to a Gmail or Outlook
      account and confirm it lands in the inbox rather than spam. This is the test
      that actually matters. **Still outstanding.** Every record has been verified
      present and correct, which is not the same as a message having been delivered.
- [ ] The contact form submits and the notification arrives.
- [ ] Check it on a phone, on cellular data rather than home wi-fi. Note that the
      cutover machine's own network served the old record for the best part of an hour
      afterwards, so it is a poor judge of whether the site is up.
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
- [ ] **Tidy the duplicate `www` entry in Netlify**, or decide to leave it. Domain
      management currently lists `www.fotvg.org` twice: once as "Redirects automatically
      to primary domain", which Netlify created when the apex was made primary, and once
      as a "Domain alias", which was added by hand to force the certificate to include
      it (decision 043). Redundant, and working. If it is tidied, remove the **alias**
      and keep the redirect, then check `www.fotvg.org` again — the alias is what the
      certificate was reissued against, and this is not worth breaking for neatness.

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

## What happened on the day — 1 September 2026

The cutover was done on Tuesday 1 September 2026 and the site went live the same
afternoon. It worked, and nothing in the zone was damaged: the five Google Workspace
`MX` records, both halves of the SPF chain, `DMARC`, the Google verification `TXT` and
the `pay` `CNAME` were verified intact at every stage. Email never went down.

Three things cost time, and none of them were in the procedure as written.

**The GoDaddy DNS panel saved silently and then did not.** The first attempt at the apex
`A` record hung on a spinner for several minutes and wrote nothing. A later attempt
showed `75.2.60.5 / 600 seconds` in the record table while the change had genuinely gone
through — the panel was right that time. In between there was no way to tell the two
states apart from the screen alone. Verify from outside the account, not from the page
that just accepted the edit.

**The stale-cache trap cost the most time, and produced a wrong diagnosis.** Direct
queries naming `ns69.domaincontrol.com` kept returning the old Global Accelerator
addresses long after the record had propagated worldwide. The answers came from a
resolver in front of this machine, not from GoDaddy. The countdown made it convincing:
the TTL fell 2714 → 2668 → 2017 across successive checks, which reads exactly like a
live record ageing, and it led to a confident and entirely wrong conclusion that the
apex edit had failed while the `www` edit had succeeded. The two records differed only
in how long their old values had left to live — `www` had already been re-cached at 600
seconds and so refreshed quickly, while the apex sat on the original 3600. Public
DoH resolvers had the correct answer the whole time. `ipconfig /flushdns` did not help,
because the stale copy was upstream on the network rather than in Windows.

**The `www` certificate was the one real defect, and nothing in the run sheet would have
caught it.** See step 1 and decision 043. `fotvg.org` was serving correctly with a valid
certificate while `www.fotvg.org` threw a full-page browser security warning, and every
signal short of inspecting the certificate's names looked healthy — DNS was right, the
panel listed the redirect, the apex loaded. Adding the alias fixed it in a few minutes.

Also worth recording: **the certificate issued immediately**, not after the half hour the
procedure warns about, and `http` → `https` redirects were live straight away.

One assumption is now slightly in doubt, and it is written here rather than quietly
corrected. GoDaddy's Website Builder dashboard reported **521 site visitors in twelve
months, 28 in the last thirty days** for a site this document twice describes as never
promoted and not in active use. Almost certainly crawlers, and it changed no decision on
the day. But it is not zero, and the *Old URLs mapped* item — 301 redirects in
`netlify.toml` for anything printed or linked elsewhere — was never completed. If anyone
ever reports a dead link into the old site, that is the reason and that is the fix.

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

---

## Leaving GoDaddy

Not part of the switchover. Recorded here because the timing constraints are
non-obvious and the traps are expensive.

FotVG intends to move `fotvg.org` off GoDaddy entirely — the registration, not just
the DNS. The trigger was the August 2026 renewal: $23.99 for the year plus a $14.99
"domain protection" add-on that is bundled by default and, if bought, actively blocks
transferring the domain out.

**Status: renewed at GoDaddy 31 August 2026**, one year, protection declined. Registry
expiry is now 3 September 2027, so there is no longer any deadline pressure.

### Why the transfer could not happen in August 2026

A registrar transfer takes 5–7 days — ICANN gives the losing registrar five days to
approve before the registry force-completes it. On 31 August the domain had **two days**
left. The same domain carries the Google Workspace `MX` records, so a transfer that
overran the expiry would have taken the website and `president@`, `vicepresident@` and
`tech@` down together. Renewing first was the only safe order. Nothing is lost by it:
an inbound transfer adds a year on top of the existing expiry.

### Do not start before mid-October 2026

Two separate clocks, and waiting until mid-October clears both:

- **Renewal grace.** A transfer completing too soon after a renewal causes the registry
  to credit the renewal back — the expiry snaps to where it was and the $23.99 buys
  nothing.
- **A possible 60-day change-of-registrant lock.** RDAP shows the domain was last
  changed **11 August 2026**. If that was a registrant-contact change, ICANN's 60-day
  transfer lock runs to roughly 10 October. If it was only a DNS edit, it does not
  apply. Check the domain's change history rather than assuming.

### Sequencing trap: fix the registrant contact *after* the transfer

*Loose ends* above wants the registrant contact moved from a personal Gmail to an
`@fotvg.org` role address. **Do that at the new registrar, not at GoDaddy.** A change
of registrant starts a fresh 60-day transfer lock, so doing it first would strand the
domain at GoDaddy until December.

### Where to go: Porkbun, not Cloudflare

Cloudflare Registrar is at-cost and roughly a dollar a year cheaper, but it **requires
the domain to use Cloudflare's nameservers, with no exceptions**. That would mean moving
this entire zone — the Workspace `MX` records, both `SPF` records, `DMARC` — off GoDaddy
as part of the registrar move. Porkbun places no such requirement, which keeps the
registrar move and any future DNS move independent of each other. For a dollar, that
separation is worth more than the saving. Not yet a formal decision — record it in
`docs/decisions.md` when the move is actually scheduled.

### The mechanics, when the time comes

The transfer-out control is hidden while the domain is locked, which is what makes it
hard to find. It is **not** under anything labelled DNS — a registrar transfer and a
nameserver change are different operations, and GoDaddy's help only surfaces inbound
transfer articles if you search for the latter.

1. Domain Portfolio → `fotvg.org` → **Domain Settings** → **Transfer**.
2. Turn **Domain Lock** off. Confirm paid **Domain Protection** is off too — if it was
   ever purchased, disabling it needs 2FA on the account, which means involving whoever
   holds the registrant email.
3. **Transfer to Another Registrar** then becomes available and issues the auth code.
4. Do `fotvgkingston.org` at the same time — it was registered the same day and will
   otherwise repeat this every September.

Registry state at renewal, for reference:

```
fotvg.org   created 2025-09-03   expires 2027-09-03   registrar GoDaddy (IANA 146)
status: clientTransferProhibited clientUpdateProhibited
        clientDeleteProhibited   clientRenewProhibited
```

Those four codes are what GoDaddy's free lock sets. They are also what the paid
protection sets, so they do not by themselves tell you which is switched on.
