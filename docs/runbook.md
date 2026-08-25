# Runbook

Operational procedures. Written for someone who is not the person who built this.

> **Status: partly written.** Sections marked _(to be written)_ still need doing, and
> everything here should get screenshots before the site is handed over. If a volunteer
> can't follow a section without asking you, it isn't finished.

## Where things are

| Thing | Where |
|---|---|
| Editing content | https://fotvg.sanity.studio |
| The prototype website | https://fotvg-webtest.netlify.app |
| The code | https://github.com/friends-of-the-village-green/fotvg-web |

## Adding or editing an event

1. Go to https://fotvg.sanity.studio and sign in.
2. **Events** in the left sidebar → **Create new** (or click an existing event to edit it).
3. Fill in the **Before it happens** tab: name, date, where, and a short summary. Press
   **Generate** next to the web address.
4. Click **Publish**, bottom right.

Afterwards, when the event has happened, open the same event again — do not create a
new one — and fill in the **Afterwards** tab with the write-up and the photographs.
Filling in "How it went" is what moves the event off *What's on* (`/events`) and onto
*What we've done* (`/past-events`), including that program's own filtered list. Until
"How it went" has something in it, a past event appears on neither.

_(To be written: screenshots.)_

## Choosing what appears on the home page

The home page shows a few past write-ups under **What we've done**, each one a full band
across the page with its photographs. Which ones is the board's choice.

1. Open the event → **Afterwards — the write-up** tab.
2. Check **Feature on the home page**.
3. **Publish**. It appears at the next daily rebuild, not straight away.

Three or four is what the page carries comfortably; six is the most it will show, newest
first. There is no need to uncheck the old ones first — but if you check seven, the
*oldest* of the seven drops off the page without saying so, so uncheck one deliberately
rather than wondering later why it never appeared.

**If nothing is checked anywhere**, the home page falls back to the three most recent
write-ups. So the section is never empty, and "uncheck everything" is a safe way to go
back to how it used to behave.

Only events with a write-up can be featured. Checking the box on an event with an empty
"How it went" does nothing at all.

**Archiving wins over featuring.** If an event is archived it is off the website
altogether, home page included, whatever this box says. The Studio shows a warning on
the document when both are checked, and the events list says ARCHIVED rather than
claiming it is on the home page.

## Taking an old event off the website

Use this instead of deleting. Deleting cannot be undone; this can.

1. Open the event → **Before it happens** tab (the one that opens by default).
2. Check **Archived — hide from the website**.
3. **Publish**. It disappears at the next daily rebuild.

The event stays in the Studio, so you can still open it and copy the wording for next
year's version. Uncheck the box and it comes back at exactly the same web address.

**One thing to know before you archive something recent:** the event's own page stops
existing, so anyone following an old Facebook post or emailed link to it gets a "page
not found". That is fine for a concert from three summers ago and less fine for one from
last month.

In the events list, an archived event shows **ARCHIVED** next to its date, so you can
tell at a glance why it is not on the site.

**Archived is not the same as canceled.** Cancel an event that is not going to happen —
its page stays up and says so plainly, which is what someone holding a flyer needs.
Archive one that happened fine but that you no longer want listed.

## Changing the wording on the home page

The headline across the top of the home page, the small line above it, and the
paragraph underneath are all editable. So is the photograph behind them.

1. Go to https://fotvg.sanity.studio and sign in.
2. **Site settings**, at the bottom of the left sidebar, under the divider.
3. It opens on the **Home page** tab, in three boxes you can open and close:

   **The top of the page**
   - **Small line above the headline** — the brass capitals at the very top.
   - **Headline** — the large heading. It is set very large; about sixteen characters
     fit on a line before it wraps.
   - **Introduction** — the paragraph. **Bold** is the only formatting, and it is worth
     using on the two things a skimming reader should catch: that we are Friends of the
     Village Green, and that we are all-volunteer.
   - **Home page photograph** — see "Adding a photo" below for the permission rules.

   **What we support — the closing note**
   - The last card under "What we support", after the program areas — "And, we hope,
     more". It is the one card there that is not a program: it has no page of its own
     and never links anywhere. Keep it about as long as a program summary so the card
     sits level with the ones beside it.

   **Three organizations share the name**
   - The bordered card near the bottom. ⚠️ **Read the field's own note before changing
     the text.** Who owns the land, who owns the building and who supports the programs
     are three different organizations, and getting it wrong says something untrue about
     somebody else. Keep the bold on the three names.

4. The **Donate and volunteer** tab holds the words on the green band — a heading and a
   paragraph for each half, plus two short blocks on the money side:
   - **Covering the card fee** — the sentence asking the donor to add the processing fee
     to their gift. Square keeps 3.3% plus 30 cents of each card donation, so give a
     worked example rather than saying "a few dollars": a few dollars is twelve percent
     of a $25 gift and almost nothing on $500. Clear the field to drop the ask.
   - **Other ways to give** — the check address, under the Donate button. Check with the
     treasurer before changing the name checks are made out to; a bank can refuse a
     check written to an abbreviation.

   The Donate button itself, the Square link and the line about tax are not editable and
   cannot be broken from here.
5. **Publish**, bottom right. It appears on the website at the next daily rebuild.

**Leaving a field empty puts the original wording back.** That is deliberate — the home
page can never end up with a blank headline because someone cleared a box to start again
and got distracted. If you want something genuinely gone rather than reset, that is a
code change; ask.

Still in the code rather than the Studio: the section headings themselves ("What we've
done", "What's on", "What we support"), the button labels, and the footer. Ask for those.

## Letting donors give to one program

A donor who wants their gift to go to the Village Green Arts Program rather than to
general funds picks it **before** leaving this site, by clicking one of the small links
under the Donate button. Each of those links is a **separate donation link in Square**.

That is the whole mechanism, and the reason for it: Square records the link's title on
the payment, so the funds arrive already sorted in Square's own reports. There is
nothing to type, nothing to transcribe, and nothing for the treasurer to match up by
hand afterwards. Decision 028 explains why the alternatives were rejected.

⚠️ **Two links pointing at the same Square page would silently merge the two funds.**
Create the Square link first. Only add it to the website once it exists.

### Creating a donation link in Square — treasurer

Square moves its menus around, so the labels may sit slightly differently from these.
The shape of it does not change.

1. Sign in at https://squareup.com/dashboard.
2. In the left sidebar, **Payments & orders**, then **Payment links**.
3. **Create link**, then choose **Accept a donation**.
4. **Title** — this is the important field. It is what the donor sees *and* what
   identifies the fund in every report afterwards, so make it unmistakable:
   - `FotVG — Village Green Arts Program`
   - `FotVG — Greenworks`
   - `FotVG — where it's needed most`  (the general one, for the main Donate button)
5. **Description** — optional, one line about what the money does.
6. Leave **custom fields** off. They are free text, and the answers do not reach the
   notification email — that is exactly what these separate links replace.
7. Save, then **copy the link**. It looks like `https://square.link/u/XXXXXXXX`.
8. Send all three links to whoever maintains the website.

**Optional:** each link can carry its own donation goal, which shows the donor a
"raised so far" figure. Set it per link, not once for everything, or the three funds
share one thermometer.

### Putting them on the website

1. https://fotvg.sanity.studio → **Site settings** → **Donate and volunteer** tab.
2. **Donate — link** — the general one. This is where the big Donate button goes.
3. **Donate — links to a particular program** — **Add item** once per program:
   - **Program** — as a donor would recognize it, and the same words as the program
     page: "Village Green Arts Program", not "VGAP". It is the link text, so it has to
     make sense read on its own.
   - **Square link** — the link for that program alone.
4. **Publish**. It appears at the next daily rebuild.

Leaving the list empty is fine and normal — the extra links simply do not appear, and
the Donate button carries on by itself.

### Checking it worked

Give $1 to one of the program links yourself, then look at **Payments & orders →
Transactions** in Square. The payment should be labeled with that link's title. If it
is labeled with the general link's title instead, the website is pointing at the wrong
URL. Refund the dollar to yourself afterwards.

## What the Publish button actually does

Publish makes your change live **in Sanity**. It does not put it on the website.

The website is rebuilt from Sanity's content, and it only shows what was there at the
moment of the last build. So there are two steps, and only the first is yours.

**The site rebuilds once a day, at 14:00 UTC — 7am Pacific in summer, 6am in winter.**
So something published on Tuesday afternoon appears on the website on Wednesday
morning. That delay is deliberate — Netlify's free plan limits how many builds we get
in a month, and building on every single publish would spend a month's allowance in one
busy afternoon and take the site offline (decision 005).

The daily rebuild also does something less obvious but more important: it is what moves
an event from *What's on* to *What we've done* once its date passes. Nothing else does
that.

**If something needs to go out now** — a cancellation, most likely — either:

- Netlify → the site → **Deploys** → **Trigger deploy** → **Deploy site**, or
- GitHub → **Actions** → **Rebuild the website** → **Run workflow**.

Either takes a couple of minutes.

The daily rebuild runs from `.github/workflows/daily-build.yml`, which calls a Netlify
build hook held in the GitHub secret `NETLIFY_BUILD_HOOK_URL`. That secret has been in
place since 10 August 2026 and the scheduled run has been green every morning since.
Nothing here is waiting to be set up.

## Replacing the daily rebuild build hook

**This is already set up — the steps below are kept for the day the hook has to be
replaced** — because it was revoked, because the Netlify site was recreated, or because
the Netlify account changed hands. They are the same steps that set it up originally.

1. **Netlify** → the site → **Site configuration** → **Build & deploy** → **Build
   hooks** → **Add build hook**. Name it `Daily rebuild`, branch `main`. Save, then
   copy the URL it gives you.
2. **GitHub** → the repository → **Settings** → **Secrets and variables** → **Actions**
   → **New repository secret**. Name it exactly `NETLIFY_BUILD_HOOK_URL`, paste the URL
   as the value, and save.
3. Test it: **Actions** → **Rebuild the website** → **Run workflow**. A green check mark, and
   a new deploy appearing in Netlify, means it works.

**That URL is a credential.** Anyone who has it can trigger builds and exhaust the
month's allowance. It goes in the GitHub secret and the password vault, and nowhere
else — never in the repository, never in an email.

> ⚠️ **GitHub turns off scheduled workflows in quiet repositories.** After 60 days with
> no commits, the daily rebuild stops and GitHub emails the repository admins. This
> repository *will* go quiet — that is the whole point of building it this way — so
> expect that email one day and do not ignore it. Re-enabling is one button in the
> Actions tab.

## How to tell it worked

1. Netlify → **Deploys**. The newest entry should say **Published** with a green check mark.
   A build takes a couple of minutes.
2. Open the page on the live site and refresh.
3. If the deploy failed, click it and read the log. The last red line is usually the
   real error.

If the deploy succeeded but your change isn't there, the usual cause is that the
document was saved as a draft rather than published — open it in the Studio and check
for a **Publish** button that is still active.

## Updating the Studio after a schema change ⚠️

**The deployed Studio does not update itself when the schema changes.**

The Studio auto-updates its *Sanity version*, but the fields, document types and sidebar
come from a build that was uploaded by `sanity deploy`. If a developer adds a field and
merges it, editors will keep seeing the old form until someone runs:

```
cd <repo>\studio
npx sanity deploy
```

This is the one that gets forgotten, and the symptom is confusing: the code says the
field exists, the site expects it, and the editor cannot find it anywhere. Any change
under `studio/schemaTypes/` needs this.

## Adding a photo

Read `docs/photos.md` first — the permission rules are not optional and they are the
real risk on this site.

Short version:

- Permission from the photographer, recorded in writing.
- Written board sign-off for any identifiable child.
- Strip location data from anything taken at a private home **before** uploading.
- Six to twelve photographs per event, not forty.
- Alt text is required. Describe what is in the picture for someone who cannot see it.
- Credit the photographer per photo, not per batch.

Upload the full-size original. Do not shrink it first — Sanity does that better.

## Rolling back a bad change

**A bad content change:** open the document in the Studio, and use the version history
(the clock icon at the top of the document) to restore an earlier version.

**A bad code change or a broken build:** Netlify → **Deploys** → select the last good
deploy → **Publish deploy**. Instant, no rebuild.

## Restoring content from backup

Weekly exports live in `backups/`. Restore with:
`npx sanity dataset import <file>.tar.gz production --replace`

**Ask before running this — it overwrites live content.**

_(To be written: the backup itself is not automated yet.)_

## Who to contact

_(Names, roles, and what each person can help with.)_
