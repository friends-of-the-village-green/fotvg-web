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

## What the Publish button actually does

Publish makes your change live **in Sanity**. It does not put it on the website.

The website is rebuilt from Sanity's content, and it only shows what was there at the
moment of the last build. So there are two steps, and only the first is yours.

> ⚠️ **There is currently no automatic trigger.** Nothing rebuilds the site when you
> publish. Until the build hook is set up (decision 005 — batched to at most one build a
> day), a change in the Studio reaches the website only when someone pushes code or
> triggers a deploy by hand in Netlify. **This needs finishing before the board is asked
> to rely on the site.**

To trigger a build by hand in the meantime: Netlify → the site → **Deploys** →
**Trigger deploy** → **Deploy site**.

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
