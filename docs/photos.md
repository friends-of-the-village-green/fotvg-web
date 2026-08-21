# Photos

How a photo gets from a board member's phone onto the website, and the rules that gate
it.

Event photos are not decoration on this site. The board uses past-event write-ups as
evidence of delivery when applying for grants, so the photo roll is load-bearing
content. It still has to stay maintainable by one person.

---

## The rules, before anything else

1. **No photo goes on the site without confirmed permission from the photographer.**
2. **No photo containing identifiable children goes on the site without explicit written
   confirmation from the board.** Not a verbal nod, not an assumption because it was
   taken at a public event. Written.
3. **If in doubt about a recognizable adult, leave it out.** There are always other
   photos.
4. **A mediocre photo is worse than no photo.** Six good pictures beat forty average
   ones, and forty average ones cost forty times the effort to caption.

### The Secret Garden Tour needs extra care

Those photos are of **private homes**. Phone photos carry GPS coordinates in their EXIF
data, and the whole premise of the event is that the gardens are secret. Strip location
data from anything shot at a private residence, and confirm each garden owner is happy
for their garden to appear at all.

Sanity's image pipeline drops EXIF from the derived images it serves, but the **original
asset is retained and remains downloadable**. Strip location data *before* upload, not
after.

---

## The intake workflow

The aim is one known place for photos to land, using tools the board already has, with
no new accounts and no upload portal to maintain.

### 1. One Drive folder per event

Whoever is running an event creates a folder in FotVG's Google Drive named for the event
and its date:

```
Photos/2026-06-13 Secret Garden Tour/
```

Board members drop their photos straight in. No renaming, no resizing, no processing —
that is deliberate. Asking volunteers to prepare files is how you end up with no files.

### 2. A permission note in the folder

A plain text file in the same folder, one line per contributor:

```
Betsy Cooper — all photos in this folder — permission given by email 2026-07-28
Karen Jeyes — IMG_2201 to IMG_2240 — permission given verbally at board mtg 2026-07-23
Children visible in IMG_2233: board confirmed OK in writing 2026-07-25
```

This is the record. If it isn't written down, treat permission as absent.

**The spelling is "Karen Jeyes"** — confirmed by John, 9 August 2026. Not "Jayes".

### 2a. Credit is per photo, not per batch

**The batch that reached us via Betsy is mixed.** Some of those photographs are Karen
Jeyes'. In particular, the *Music at the Green* dancing-on-the-grass shot used as the
hero of mock-up 2 is **Karen Jeyes'**, not Betsy's — it was credited to Betsy in the
mock-ups on an assumption, and that assumption was wrong.

So: record the photographer **per file**, not "all photos in this folder", whenever a
folder holds work by more than one person. Before launch, every photo carried over from
the July batches needs its actual photographer confirmed with Betsy. Karen has given
explicit permission for her photographs to be used; that is settled. Who took which
picture is not.

### 3. Curate hard

Pick **6–12 photos per event**. Look for: people doing the thing, a sense of place, and
a range of ages. Skip: backs of heads, empty rooms before doors open, blurry crowd
shots, and eleven near-identical frames of the same moment.

### 4. Rename descriptively

`IMG_4471.jpg` tells a future maintainer nothing. Rename to what the picture shows:

```
secret-garden-tour-2026-visitors-in-the-rose-garden.jpg
music-on-the-green-2026-audience-on-the-lawn.jpg
```

### 5. Upload to Sanity, with alt text and a credit

Sanity handles resizing, cropping, and format conversion from the original — upload the
full-size file and let the pipeline do the work. Do not pre-shrink photos.

Every image needs:

- **Alt text** describing what is in the photo, for someone who cannot see it. Not a
  caption, not a repeat of the headline. See the `fotvg-brand` skill.
- **Photographer credit**, where known.
- **A caption**, if the photo needs context the surrounding text doesn't give.

---

## Who does the uploading

**Not every board member.** One or two trained editors with Studio accounts, and
everyone else contributing through the Drive folder.

This is a deliberate trade-off. Giving eight people Studio logins means eight people to
train, eight people who might publish an unpermissioned photo, and eight accounts to
maintain when the board turns over — which it does. It also consumes seats on Sanity's
nonprofit plan. Concentrating publishing in two trained people costs a bottleneck and
buys a permission checkpoint that actually gets used.

Revisit this if the bottleneck becomes the reason recaps don't get published.

---

## Where the source photos live

Photo batches from board members are mirrored locally at `../fotvg-photos`, a sibling of
this repo. That folder is **read-only reference and is not committed**. Photos reach the
site by being uploaded to Sanity, never by being copied into `public/`.

The one exception is a small number of genuinely static images — a logo, an OG share
image — which live in `public/` and change approximately never.

---

## Quick checklist

Before publishing any event recap:

- [ ] Permission recorded in writing for every photo used
- [ ] Board sign-off in writing for any identifiable children
- [ ] Location data stripped from photos taken at private homes
- [ ] 6–12 photos, not forty
- [ ] Descriptive filenames
- [ ] Alt text written for every image
- [ ] Photographer credited where known
