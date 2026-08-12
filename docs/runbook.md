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
Filling in "How it went" is what moves the event from *What's on* to *What we've done*.

_(To be written: screenshots.)_

## Changing the wording on the home page

The headline across the top of the home page, the small line above it, and the
paragraph underneath are all editable. So is the photograph behind them.

1. Go to https://fotvg.sanity.studio and sign in.
2. **Site settings**, at the bottom of the left sidebar, under the divider.
3. It opens on the **Home page** tab. Four fields:
   - **Small line above the headline** — the brass capitals at the very top.
   - **Headline** — the large heading. It is set very large; about sixteen characters
     fit on a line before it wraps.
   - **Introduction** — the paragraph. **Bold** is the only formatting, and it is worth
     using on the two things a skimming reader should catch: that we are Friends of the
     Village Green, and that we are all-volunteer.
   - **Home page photograph** — see "Adding a photo" below for the permission rules.
4. **Publish**, bottom right. It appears on the website at the next daily rebuild.

**Leaving a field empty puts the original wording back.** That is deliberate — the home
page can never end up with a blank headline because someone cleared a box to start again
and got distracted. If you want a field genuinely gone rather than reset, that is a code
change; ask.

The rest of the site's wording — the section headings, "What we've done", the Donate and
Volunteer text — is in the code, not the Studio. Ask for those to be changed.

## What the Publish button actually does

Publish makes your change live **in Sanity**. It does not put it on the website.

The website is rebuilt from Sanity's content, and it only shows what was there at the
moment of the last build. So there are two steps, and only the first is yours.

**The site rebuilds once a day, at about 6am Pacific.** So something published on
Tuesday afternoon appears on the website on Wednesday morning. That delay is
deliberate — Netlify's free plan limits how many builds we get in a month, and building
on every single publish would spend a month's allowance in one busy afternoon and take
the site offline (decision 005).

The daily rebuild also does something less obvious but more important: it is what moves
an event from *What's on* to *What we've done* once its date passes. Nothing else does
that.

**If something needs to go out now** — a cancellation, most likely — either:

- Netlify → the site → **Deploys** → **Trigger deploy** → **Deploy site**, or
- GitHub → **Actions** → **Rebuild the website** → **Run workflow**.

Either takes a couple of minutes.

> ⚠️ **Setup still needed.** The daily rebuild runs from
> `.github/workflows/daily-build.yml` and needs a Netlify build hook URL stored as a
> GitHub secret called `NETLIFY_BUILD_HOOK_URL`. Until that exists, the scheduled run
> fails every morning and nothing rebuilds on its own. See "Setting up the daily
> rebuild" below.

## Setting up the daily rebuild

One-off, and needs doing before editors are asked to rely on the site.

1. **Netlify** → the site → **Site configuration** → **Build & deploy** → **Build
   hooks** → **Add build hook**. Name it `Daily rebuild`, branch `main`. Save, then
   copy the URL it gives you.
2. **GitHub** → the repository → **Settings** → **Secrets and variables** → **Actions**
   → **New repository secret**. Name it exactly `NETLIFY_BUILD_HOOK_URL`, paste the URL
   as the value, and save.
3. Test it: **Actions** → **Rebuild the website** → **Run workflow**. A green tick, and
   a new deploy appearing in Netlify, means it works.

**That URL is a credential.** Anyone who has it can trigger builds and exhaust the
month's allowance. It goes in the GitHub secret and the password vault, and nowhere
else — never in the repository, never in an email.

> ⚠️ **GitHub turns off scheduled workflows in quiet repositories.** After 60 days with
> no commits, the daily rebuild stops and GitHub emails the repository admins. This
> repository *will* go quiet — that is rather the point of building it this way — so
> expect that email one day and do not ignore it. Re-enabling is one button in the
> Actions tab.

## How to tell it worked

1. Netlify → **Deploys**. The newest entry should say **Published** with a green tick.
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
