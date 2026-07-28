# Runbook

Operational procedures. Written for someone who is not the person who built this.

> **Status: skeleton.** Fill each section in as the corresponding piece is built, and
> rewrite anything here in plain language before handing the site over. If a volunteer
> can't follow a section without asking you, it isn't finished.

## Adding or editing an event
_(To be written once the Studio is live. Include screenshots.)_

## What the Publish button actually does
_(Explain the delay between publishing and the site updating.)_

## How to tell it worked
_(Where to look, how long to wait, what to do if nothing happens.)_

## Adding a photo
_(Size guidance, alt text, permission check.)_

## Rolling back a bad change
Netlify → Deploys → select the last good deploy → Publish deploy. Instant, no rebuild.

## Restoring content from backup
Weekly exports live in `backups/`. Restore with:
`npx sanity dataset import <file>.tar.gz production --replace`
**Ask before running this — it overwrites live content.**

## Who to contact
_(Names, roles, and what each person can help with.)_
