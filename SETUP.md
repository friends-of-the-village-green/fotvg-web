# FOTVG Website — Setup Runbook (Windows)

**Assumes:** Windows 10 (version 1809 or later) or Windows 11, 64-bit. Commands are
PowerShell unless stated otherwise. You do not need WSL.

**Conventions in this document:**
- Lines starting with `PS>` are typed into PowerShell. Don't type the `PS>` part.
- 👤 = you must do this yourself (credentials, accounts, billing, DNS)
- 🤖 = safe to hand to Claude Code
- ⚠️ = a step where a mistake is expensive

---

## Where you are right now

| Item | Status |
|---|---|
| GitHub org `friends-of-the-village-green` | ✅ Done |
| Private repo `fotvg-web` | ✅ Done |
| Sanity account + project "Friends of the Village Green" | ✅ Created, not configured |
| GitHub 2FA | ⬜ Phase 0.3 below |
| Sanity organization + project transfer | ⬜ Phase 0.5 |
| Nonprofit applications (GitHub, Netlify, Sanity) | ⬜ Phase 0.6 |
| Windows workstation setup | ⬜ **Phase 1 — start here** |

Branch protection is deliberately skipped while you're the only committer. Revisit it
when the GitHub Team nonprofit plan is approved.

---

## Phase 0 — Accounts and ownership 👤

### 0.1 — Organizational email
A role address on FOTVG's own domain (`web@…` or `admin@…`), not a personal Gmail. If
FOTVG doesn't have Google Workspace, they likely qualify for Google for Nonprofits at no
cost. Every account eventually registers to this address.

You can proceed without it — just plan to add it as a co-owner everywhere later.

### 0.2 — Password manager
Bitwarden's free tier or 1Password's nonprofit program. **Set this up before you
generate any more credentials.** At least two board members need access.

### 0.3 — GitHub two-factor authentication ⚠️

This lives on your **personal account**, not on the repo or the org — that's why you
couldn't find it.

1. Go to **github.com/settings/security**
2. Under "Two-factor authentication", click **Enable two-factor authentication**
3. Choose an authenticator app (Microsoft Authenticator, Authy, 1Password) — not SMS
4. **Save the recovery codes into your password vault immediately.** Losing these is how
   people permanently lose GitHub accounts.

Then require it org-wide, in this order (doing it the other way round locks you out of
your own organization):

5. Go to your org → **Settings → Authentication security**
6. Tick **Require two-factor authentication for everyone in the organization**

### 0.4 — Add the role address to the GitHub org
Once the email exists: org → **People → Invite member** → invite it → then **Settings →
Access → Change role** to Owner. Two owners is the minimum for an organization that
should outlive you.

### 0.5 — Sanity organization and project transfer ⚠️

Sanity projects are assigned to an individual when created, so yours currently belongs
to you personally. Fix this *before* applying for the nonprofit plan, so the plan
attaches to FOTVG rather than to you.

1. Go to **manage.sanity.io**
2. Top-left dropdown → **Create new organization** → name it "Friends of the Village Green"
3. Open your project → **Settings** tab → scroll to **Danger zone** → **Transfer ownership**
4. Select the new organization → confirm

The transfer doesn't change project settings or tokens, so nothing breaks.

### 0.6 — Nonprofit applications
File all three now; approvals take days to weeks.

| Service | Where | Gets you |
|---|---|---|
| GitHub | github.com/solutions/industry/nonprofits | Free Team plan — protected branches, 3,000 CI/CD min/mo |
| Netlify | Their open source / public good program | Relief from the build-credit ceiling |
| Sanity | sanity.io/docs/platform-management/non-profit-plan | Growth-tier features free, 25 users |

All three want 501(c)(3) documentation. GitHub's terms also exclude political and
religiously affiliated organizations — worth confirming FOTVG's status with the board
while you're collecting the determination letter.

### 0.7 — Domain audit ⚠️
Answer these into `docs/hosting.md` before touching any DNS:
- Where is the domain registered, and who holds that login?
- Is auto-renew on? On whose card?
- **Are there MX records?** If FOTVG's email runs through this domain, a nameserver
  change breaks their email. Screenshot the current DNS zone before any change.

### 0.8 — Donation platform
Decide now; it affects the Donate page and a redirect in `netlify.toml`. Evaluate Zeffy
(nonprofit-focused, no platform fee) against a Stripe Payment Link. Confirm with the
treasurer who owns the account and where money lands.

---

## Phase 1 — Windows workstation setup 👤

Everything here is on your machine. Work through it in order.

### 1.1 — Install Windows Terminal

Modern, tabbed, and much less painful than the legacy console. Skip if you already have it.

```
PS> winget install Microsoft.WindowsTerminal
```

Close it and reopen from the Start menu once installed. Use it for everything below.

### 1.2 — Allow PowerShell to run scripts ⚠️

npm installs command shims as PowerShell scripts, and Windows blocks them by default.
Without this, `npm`, `netlify`, and `sanity` will all fail with a confusing
"cannot be loaded because running scripts is disabled" error.

```
PS> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Answer `Y`. This affects only your user account and still blocks unsigned scripts
downloaded from the internet.

### 1.3 — Install the core tools

```
PS> winget install Git.Git
PS> winget install OpenJS.NodeJS.LTS
PS> winget install GitHub.cli
```

**Close PowerShell and open a new window** after these finish. Installers modify PATH,
and an already-open terminal won't see the change. This is the single most common source
of "command not found" confusion on Windows.

Check what Node version you got — you'll need it shortly:

```
PS> node --version
```

Note the major number (e.g. `v22.x` → **22**).

> **Why not nvm?** Managing multiple Node versions adds real friction on Windows and you
> only have one project. If you later need to juggle versions across the garden and
> nursery sites, add `CoreyButler.NVMforWindows` then — uninstall plain Node first, as
> the two conflict.

### 1.4 — Install Claude Code

Claude Code runs natively on Windows 10 1809+ and Windows 11 — WSL is optional, not
required. The native installer needs no Node.js and no administrator rights.

```
PS> irm https://claude.ai/install.ps1 | iex
```

Close and reopen PowerShell, then:

```
PS> claude --version
PS> claude doctor
```

`claude doctor` reports install health and is the first thing to run if anything
misbehaves later.

Because you installed Git for Windows in step 1.3, Claude Code will use Git Bash as its
shell, which gives better compatibility with bash-style commands than PowerShell.

> Claude Code requires a paid Claude plan (Pro, Max, Team, or Enterprise) or an API
> account billed per token. The free Claude.ai tier doesn't include it.

### 1.5 — Choose where the project lives ⚠️

**Do not put this project in Documents, Desktop, or anywhere OneDrive syncs.**

This is the biggest avoidable Windows headache in web development. OneDrive tries to
sync `node_modules` — tens of thousands of small files — producing file locks, failed
builds, sync storms, and occasionally corrupted installs. Modern Windows syncs Documents
and Desktop by default, so this catches people who didn't choose it.

Create a clean location outside OneDrive:

```
PS> New-Item -ItemType Directory -Path C:\dev -Force
PS> cd C:\dev
```

Keep the garden and nursery projects here too, as *siblings* — never nested:

```
C:\dev\
├── fotvg-web\
├── garden-site\
└── nursery-site\
```

Always open Claude Code from inside one project folder, never from `C:\dev` — from the
parent it can read and edit all three.

**Optional but worth it:** exclude `C:\dev` from Windows Defender real-time scanning.
Settings → Privacy & security → Windows Security → Virus & threat protection → Manage
settings → Exclusions → Add folder. This can cut `npm install` times substantially.

### 1.6 — Configure Git ⚠️

Line endings are the Windows-specific trap. Windows uses CRLF, Linux uses LF, and
Netlify builds on Linux. Left unconfigured you get phantom diffs where every line of
every file appears changed.

```
PS> git config --global user.name "Your Name"
PS> git config --global user.email "your-personal@email.com"
PS> git config --global core.autocrlf true
PS> git config --global core.longpaths true
PS> git config --global init.defaultBranch main
```

`core.longpaths` prevents failures from deeply nested `node_modules` paths exceeding the
legacy 260-character limit.

You'll override the email inside the FOTVG repo in Phase 2 once the role address exists.

### 1.7 — Install the CLI tools

```
PS> npm install -g netlify-cli
PS> npm install -g @sanity/cli
```

If either fails with a script execution error, step 1.2 didn't take — rerun it and open
a fresh terminal.

### 1.8 — Authenticate everything

Each of these opens a browser. Do them yourself; don't delegate.

```
PS> gh auth login
```
Choose: GitHub.com → HTTPS → authenticate with browser.

```
PS> netlify login
PS> sanity login
```

### 1.9 — Verify Phase 1

Run all of these. Every one should return something sensible:

```
PS> node --version
PS> npm --version
PS> git --version
PS> gh auth status
PS> claude --version
PS> netlify --version
PS> sanity --version
```

**Phase 1 is done when** all seven succeed in a freshly opened terminal.

---

## Phase 2 — Get the repo onto your machine 🤖

### 2.1 — Clone

The repo already exists, so clone it rather than creating one:

```
PS> cd C:\dev
PS> git clone https://github.com/friends-of-the-village-green/fotvg-web.git
PS> cd fotvg-web
```

Git Credential Manager (installed with Git for Windows) handles the login in a browser
popup the first time.

### 2.2 — Set the repo-specific commit identity

```
PS> git config user.email "web@fotvg-domain-here"
```

Local to this repo only; your global setting is untouched. This matters for handoff — a
future maintainer reading the log sees organizational authorship rather than one
volunteer's personal address.

### 2.3 — Drop in the starter kit

Unzip `fotvg-starter.zip`, then copy its **contents** (not the folder itself) into
`C:\dev\fotvg-web`. From wherever you unzipped it:

```
PS> Copy-Item -Path .\fotvg-starter\* -Destination C:\dev\fotvg-web -Recurse -Force
```

⚠️ **`.claude` and `.env.example` are hidden files.** File Explorer drag-and-drop will
silently skip them. Use the command above, or turn on View → Show → Hidden items first.

Verify they arrived:

```
PS> cd C:\dev\fotvg-web
PS> Get-ChildItem -Force
```

You should see `.claude`, `.env.example`, `CLAUDE.md`, `SETUP.md`, `README.md`, `docs`.

### 2.4 — Scaffold Astro

```
PS> npm create astro@latest . -- --template minimal --typescript strict --no-git
PS> npx astro add sitemap
```

Answer yes when it warns the directory isn't empty — it merges rather than overwrites.

### 2.5 — Add the Windows-critical config files

Create `.gitattributes`. This is what actually normalizes line endings in the repo,
regardless of anyone's local git settings:

```
* text=auto eol=lf
*.png binary
*.jpg binary
*.ico binary
*.woff2 binary
```

Create `.nvmrc` containing just your Node major version from step 1.3, e.g. `22`.

Check `.gitignore` contains at minimum:

```
node_modules/
dist/
.env
.env.*
!.env.example
.netlify/
.DS_Store
```

⚠️ Get `.gitignore` right **before** your first commit. Scrubbing a committed secret out
of history is far harder than never committing it.

### 2.6 — First commit

```
PS> npm install
PS> npm run dev
```

Visit `http://localhost:4321` — you should see a page. `Ctrl+C` to stop.

```
PS> git add -A
PS> git commit -m "Add project memory, skills, and Astro scaffold"
PS> git push
```

**Phase 2 is done when** the push succeeds and you can see the files on github.com.

---

## Phase 3 — Netlify (prototype on your personal account) 🤝

You're prototyping on your existing Netlify account and moving to FOTVG's later. That's
fine — the repo is the asset, and re-creating a Netlify site takes five minutes.

### 3.1 — Connect the site 👤

In the Netlify web UI: **Add new site → Import an existing project → GitHub →
fotvg-web**.

⚠️ When GitHub asks which repositories to grant access to, choose **"Only select
repositories"** and pick `fotvg-web` alone. The default is "All repositories", which
would hand Netlify access to your garden and nursery repos too.

Build settings:
- Build command: `npm run build`
- Publish directory: `dist`

Then rename the site to something unmistakably temporary — **fotvg-preview** — so nobody
mistakes it for the real thing and the good name stays free.

### 3.2 — Keep it out of search results 👤

While it lives on your personal account, add to `public/robots.txt`:

```
User-agent: *
Disallow: /
```

Remove this at switchover. A prototype URL that lands in a Facebook post outlives your
intentions.

### 3.3 — How Claude Code deploys

**The deploy mechanism is `git push`.** Netlify builds on push to `main` and creates a
preview for every pull request. Claude Code can ship changes end to end without ever
holding a Netlify credential:

```
branch → commit → push → PR → Netlify preview → you review → merge → production
```

This is the recommended setup. A confused or compromised agent cannot publish to
production, because merging is a human action in the GitHub UI.

If you later want Claude Code to read build logs or make draft deploys, create a Netlify
personal access token and set it in your Windows user environment:

```
PS> [Environment]::SetEnvironmentVariable("NETLIFY_AUTH_TOKEN","your-token-here","User")
```

Open a new terminal for it to take effect. ⚠️ Netlify tokens are **account-scoped** —
during the prototype phase, one token reaches FOTVG, garden, and nursery alike. The rule
in `CLAUDE.md` stands: never `netlify deploy --prod`.

### 3.4 — What not to do during prototyping ⚠️

- **Don't attach FOTVG's real domain** to your personal Netlify team. Prototype on the
  `.netlify.app` subdomain only.
- **Don't publicize a working contact form.** Submissions land in *your* Netlify
  account, not FOTVG's.
- **Don't grant Netlify blanket repository access** (see 3.1).

**Phase 3 is done when** a pull request produces a working preview URL.

---

## Phase 4 — Sanity 🤝

### 4.1 — Initialize against the existing project 👤

Your project already exists, so **don't** use `--create-project`:

```
PS> cd C:\dev\fotvg-web
PS> mkdir studio
PS> cd studio
PS> npx sanity@latest init
```

When prompted, **select the existing "Friends of the Village Green" project** and the
`production` dataset. Choose the clean template with no predefined schemas.

Keep the Studio inside this same repo — one repo, one history, one place to look.

### 4.2 — Build schema v1 🤖

Five document types, per the `sanity-content-model` skill: `siteSettings`, `page`,
`event`, `newsPost`, `person`. Resist adding more until real content demands it.

### 4.3 — Deploy the Studio 👤

```
PS> cd C:\dev\fotvg-web\studio
PS> npx sanity deploy
```

Choose a hostname — `fotvg.sanity.studio`. Editors get a permanent URL, and the Studio
never consumes Netlify build credits.

### 4.4 — CORS origins 👤

At manage.sanity.io → your project → **API → CORS origins**, add:
- `http://localhost:4321`
- Your Netlify production URL
- Your Netlify preview wildcard (`https://*--fotvg-preview.netlify.app`)

### 4.5 — Read token 👤

Project → **API → Tokens → Add API token**. Permissions: **Viewer** only, never Editor.

Copy it once — it isn't shown again. Put it in your password vault, then into Netlify:
**Site configuration → Environment variables**:

```
PUBLIC_SANITY_PROJECT_ID   = (from manage.sanity.io)
PUBLIC_SANITY_DATASET      = production
SANITY_API_READ_TOKEN      = (the viewer token)
```

For local development, create `.env` in the repo root with the same three values.
⚠️ Confirm `.env` is in `.gitignore` first.

### 4.6 — Wire Astro to Sanity 🤖

`src/lib/sanity.js` (client + `urlFor`) and `src/lib/queries.js` (named GROQ exports).

### 4.7 — Build trigger 🤝

Create a Netlify build hook, then a Sanity webhook pointing at it — configured as a
**scheduled or batched trigger, at most one build per day.** Read the deploy-budget
section of the `netlify-ops` skill first; getting this wrong is how the site goes dark
mid-month.

Note that free and trial Sanity plans don't allow overages: at 100% of the API, CDN, or
bandwidth quota, public API access is blocked and content stops loading on the live
site. The Studio keeps working, so you can still log in. Warning emails go to project
admins at 80% — don't ignore them.

### 4.8 — Backup automation 🤖

A GitHub Action running weekly:

```
npx sanity dataset export production backups/production-$(date +%F).tar.gz
```

Set this up now, while it's cheap. It's the insurance policy against the entire vendor
dependency.

**Phase 4 is done when** you can create an event in the Studio and see it on a preview.

---

## Phase 5 — Foundation build 🤖

Hand these to Claude Code roughly in order, one branch and PR each:

1. `BaseLayout.astro` — meta tags, Open Graph, skip link, header, footer
2. Design tokens in `global.css`
3. Header with accessible mobile navigation
4. Home page — what FOTVG is, next events, donate CTA
5. `/events` listing and `/events/[slug]` detail pages
6. Standing pages — About, What We Do, Get Involved, Donate, Contact
7. Contact form with Netlify Forms, honeypot, spam filtering
8. 404 page, `robots.txt`, sitemap, favicons
9. Pagefind search — last, once there's content to index

Run the `accessibility` checklist before merging each one.

---

## Phase 6 — Switchover to FOTVG's Netlify account 👤

When FOTVG's own Netlify team exists:

1. Accept an owner invite to the new team
2. Connect the **same** GitHub repo as a new site — select-repositories only, again
3. Re-enter the three environment variables from `docs/hosting.md`
4. Create a new build hook — ⚠️ **update the Sanity webhook to the new URL.** Easy to
   forget; the symptom is silently stale content.
5. Point form notifications at FOTVG's address
6. Verify a PR builds a preview and a merge builds production
7. Remove the `robots.txt` disallow
8. Point DNS at the new site — only now, and only after rereading the MX warning in 0.7
9. Delete `fotvg-preview` from your personal account

Nothing in that list requires the old site to exist. That's the property worth
protecting: at every moment, the repo plus that short config list should be enough to
stand the site up from scratch.

---

## Phase 7 — Before handover

- [ ] Nonprofit plans approved: GitHub, Netlify, Sanity
- [ ] Branch protection enabled on `main` (possible once GitHub Team lands)
- [ ] Dataset export action has run successfully at least once
- [ ] A second board member has admin on GitHub, Netlify, and Sanity
- [ ] All credentials in the shared vault
- [ ] `docs/runbook.md` written in plain language, with screenshots
- [ ] Uptime monitoring on production (UptimeRobot free tier)
- [ ] Google Search Console verified
- [ ] **A real FOTVG volunteer has added an event to the Studio, unassisted, while you
      watched without helping**

That last one is the item that actually predicts whether this site is still being
updated in 2029. Don't skip it, and don't offer hints while they try.

---

## Appendix A — PowerShell for someone new

| Task | PowerShell |
|---|---|
| Where am I? | `pwd` |
| List files | `ls` (include hidden: `ls -Force`) |
| Change directory | `cd C:\dev\fotvg-web` |
| Up one level | `cd ..` |
| Make a folder | `mkdir foldername` |
| Clear the screen | `cls` |
| Stop a running command | `Ctrl+C` |
| Recall previous command | `↑` arrow |
| Autocomplete a path | `Tab` |

Paths containing spaces need quotes: `cd "C:\My Folder"`. Prefer folder names without
spaces — it avoids a whole category of problems.

## Appendix B — The daily git loop

```
PS> git checkout main
PS> git pull                              # get the latest
PS> git checkout -b add-events-page       # start work
   ...make changes...
PS> git add -A
PS> git commit -m "Add events listing page"
PS> git push -u origin add-events-page
PS> gh pr create --fill                   # open the pull request
   ...review the Netlify preview, merge in the GitHub UI...
PS> git checkout main
PS> git pull
```

The mental model: `main` is what's live, branches are where work happens, a pull request
is the gate between them.

⚠️ **Never run `git push --force` on `main`.** With branch protection off, nothing will
stop you, and it's the one command that destroys work irrecoverably.

## Appendix C — Windows troubleshooting

**"'npm' is not recognized as the name of a cmdlet"**
PATH not refreshed. Close every PowerShell window and open a new one. If it persists,
sign out of Windows and back in.

**"cannot be loaded because running scripts is disabled"**
Step 1.2 didn't apply. Rerun `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`,
answer `Y`, then open a fresh terminal.

**"claude is not recognized"**
Confirm `%USERPROFILE%\.local\bin` is on your PATH, then reopen the terminal. Run
`claude doctor`.

**Every file shows as modified in git, with no changes you made**
Line endings. Confirm `.gitattributes` exists (step 2.5), then:
```
PS> git add --renormalize .
PS> git commit -m "Normalize line endings"
```

**`npm install` is extremely slow, or fails with EPERM / file-in-use**
The folder is being synced by OneDrive, or Defender is scanning it. Move the project to
`C:\dev` (step 1.5) and add the Defender exclusion.

**"Filename too long" during install or clone**
```
PS> git config --global core.longpaths true
```

**Build works locally but fails on Netlify**
Usually a missing environment variable — it works locally because it's in your `.env`.
Check Netlify → Site configuration → Environment variables. Second most likely cause: a
Node version mismatch between `.nvmrc` and what Netlify is using.

## Appendix D — First prompt for Claude Code

From `C:\dev\fotvg-web`, run `claude`, then:

> Read CLAUDE.md and the skills in .claude/skills/. Then set up the base Astro structure
> described in the astro-conventions skill: BaseLayout with meta tags and skip link,
> design tokens in global.css, and a placeholder home page. Don't add any dependencies
> beyond @astrojs/sitemap yet. Work on a branch and open a PR when it builds cleanly.
