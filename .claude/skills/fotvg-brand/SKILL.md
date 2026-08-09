---
name: fotvg-brand
description: Voice, tone, terminology, and visual conventions for Friends of the Village Green. Use this skill whenever writing or editing any user-facing text for the FotVG site — page copy, event descriptions, button labels, form labels, error messages, alt text, meta descriptions, or email templates. Also use it when reviewing copy someone else wrote, or when naming things that a visitor will see. If the output contains a sentence a member of the public will read, this skill applies.
---

# FotVG Voice & Brand

## The abbreviation

Write it **FotVG**. Capital F, lowercase o-t, capital VG. That is the organization's own
consistent usage across its Articles, bylaws, and minutes.

Not FOTVG. Not FoTVG. Not Fotvg. Not "the Friends."

## Who is speaking

Friends of the Village Green are neighbours in Kingston, Washington who **fund and run
the programs** at the Village Green Community Center — concerts and exhibitions, a
community garden, monthly lunches, lectures, a newcomers series, and trail work in the
woods above the upper parking lot.

They do **not** own the building and they do **not** own the land. Two other
organizations that share the "Village Green" name do:

- **Village Green Metropolitan Park District** owns the land.
- **Village Green Foundation** owns the building.
- **Friends of the Village Green** looks after the programs and the people who run them.

FotVG's own shorthand for the split is *"FotVG — Programs and people."*

Read `docs/organization.md` before writing any copy that describes who FotVG is.
Conflating the three organizations is the easiest mistake to make on this project, and
visitors, journalists, and grant reviewers do it constantly.

They are a volunteer board, not a staffed nonprofit. FotVG employs nobody. Where
`CLAUDE.md` and the mission statement say FotVG "staffs" programs, it means **finding
the people to run them** — not employing them.

The site should sound like one of them talking to a neighbour — informed, friendly,
practical, not selling anything.

## The test

Read the sentence aloud. If it sounds like it came from a marketing department, a grant
application, or a press release, rewrite it.

**Not this:** "FotVG is dedicated to fostering community engagement through
transformative programmatic initiatives."

**This:** "We pay for the concerts, the garden, and the monthly lunch. Most of it is
free, and everyone is welcome."

## Rules of thumb

**Be concrete.** Name the event, the date, the program. Specifics are what make a small
organization feel real.

- "The 2026 garden beds sold out" beats "the garden continues to thrive."
- "Attendance at the monthly luncheon has grown from the high twenties to about
  forty-five" beats "our lunch program has seen strong growth."
- "Volunteers build trails in the woods on Wednesday mornings" beats "we undertake
  ongoing stewardship activities."

**Lead with the useful thing.** Visitors want to know *what*, *when*, and *where*. Put
that first; put the context second. Event pages especially: date, time, and location
appear before the description.

**Short sentences.** Most readers are on a phone. Aim for 15–20 words average. Break up
anything over 25.

**Second person, active voice.** "You can join us on Saturday" not "volunteers are
invited to participate."

**No exclamation marks in body copy.** One per page maximum, and only where genuine
delight is warranted. Enthusiasm should come from the content, not the punctuation.

**No jargon.** Not nonprofit jargon ("capacity building," "stakeholders," "programming"
as a mass noun), not grant-application jargon, and not gardening jargon — say "cut back"
not "coppice." If a technical term is genuinely the right word, use it and explain it in
the same sentence.

**Don't imply scale FotVG doesn't have.** There is no office, no communications
department, and no team. Say "we," "our volunteers," "the board." Avoid "our team," "our
staff," and "our initiatives."

"Our programs" is fine, and so is naming them. The programs are real and they are
FotVG's — that is the one piece of organizational language that is accurate here.

**Use the value words because they are true.** *Welcoming*, *all ages and abilities*,
*free or low-cost*, *barrier-free*, *intergenerational*, *inclusive*. These recur
throughout FotVG's own writing. Use them where they describe something real, not as
decoration.

## Terminology

Use these consistently:

| Use | Not |
|---|---|
| Friends of the Village Green (first mention), FotVG after | FOTVG, FoTVG, Fotvg, the Friends |
| the Village Green Community Center — the building | our building, our center, our facility |
| the Village Green — the place, informally | the Green, the park, the site |
| the programs we fund / the programs we run | our facility, our venue |
| donate / give | contribute, support us financially |
| volunteers, supporters | members, membership, sign-up tiers |
| work party | volunteer day, service event, workday |
| Kingston | Kingston, WA (unless the audience may be out of state) |

Name the other two organizations in full on first mention: **Village Green Metropolitan
Park District**, **Village Green Foundation**. Never shorten either to "the Village
Green" — that is exactly the ambiguity to avoid.

Spell out dates as "Saturday, March 14" — no ordinals, no abbreviations, no "3/14"
which reads ambiguously to international visitors.

## Never write

- **"Become a member," "join FotVG," or anything implying membership.** The bylaws and
  the Articles of Incorporation both state the corporation has no members. The calls to
  action are **Donate**, **Volunteer**, and **Come along**.
- **Anything implying FotVG owns, runs, books, or maintains the building or the land.**
  No "our building," no "visit our center," no "book our hall."
- **A board member's home address.** Several appear in the source documents, including
  as the registered agent address. The public contact address is the Village Green
  Community Center.
- **The EIN, bank or Square account details, or insurance policy numbers.** All appear
  in the source documents. None belong on a website.

## Calls to action

Use verbs that say what happens next. Be specific about the commitment.

- "Donate" — not "Support us" or "Learn more"
- "Sign up for the March work party" — not "Get involved"
- "Email us" — not "Contact"
- "See all events" — not "Read more"

Never use "Click here." Never use "Learn more" as standalone link text; it tells a
screen reader user nothing about the destination.

## Alt text

Every image needs alt text written for someone who cannot see it. Describe what matters
about the image in this context, not what is literally in frame.

**Not this:** "Image of people in a garden"
**This:** "Six volunteers spreading wood chips along the path at the October work party"

Decorative images (background textures, dividers) take `alt=""` so screen readers skip
them. If you cannot tell whether an image is decorative, ask.

## Headings

Headings are navigation, not decoration. Write them so someone tabbing through the page
outline understands the structure. Sentence case, no trailing punctuation.

**Good:** "What we've done this year"
**Bad:** "Making A Difference!"

## Page titles and search

Board minutes record that leading with "friends" or "village green" produces too many
wrong results on Google. Anchor page titles and meta descriptions on **Kingston,
Washington** and **Village Green Community Center**.

Never ship a bare `<title>Friends of the Village Green</title>`.

## Visual conventions

**Wordmark, not a logo.** Board decision, May 2026: *"FotVG in name only for now, no
illustration."* A rope-motif draft was rejected in February 2026. Set the name in type.
Do not generate, commission, or improvise a pictorial mark.

**Green is the unifying colour**, discussed by the board though never formally adopted
as a specific value. An "open door" motif was floated and not adopted — don't reach for
it.

**Legibility is a brand attribute here.** The audience skews older. Generous type size,
strong contrast, and large tap targets are part of how this organization presents
itself, not just an accessibility obligation. See the `accessibility` skill.

## Things to always get right

- **FotVG has no paid staff, and the board are all volunteers.** Both are confirmed, and
  both are safe to write. So is "all-volunteer."

  But do not write "nobody gets paid." FotVG's money does sometimes pay a person — a
  musician's fee, an instructor — and that is rather the point of donating. The rule is
  that anyone paid to deliver a program is **not** a FotVG board member or volunteer.

  This is the strongest thing FotVG can say to a donor, so say it plainly: what you give
  goes to the program, because there is no salary for it to go to first.
- Do not state tax-deductibility, EIN, or nonprofit status details unless the exact
  wording has been confirmed with the board. Ask rather than guessing.
- Do not promise event details (times, presenters, availability) that aren't confirmed
  in the source content. If a field is empty, omit it rather than inventing a placeholder.
- Do not name individual volunteers or include photographs of identifiable people
  without confirming permission exists. See `docs/photos.md`.
- Do not include children's names or identifying detail, ever.
- Keep the Village Green Community Center's tenth anniversary (May 2026, so it opened in
  2016) distinct from FotVG's own founding (2025). They are eleven years apart.

## When you're unsure

Ask rather than inventing. The most common failure mode for AI-drafted nonprofit copy is
confident specificity about things the organization never said — invented founding
dates, invented program names, invented statistics. Leave a clearly marked `[TK: ask
board]` placeholder instead.

Two questions are open in `docs/organization.md` and affect copy directly: which set of
pillars is current, and whether "Supporting programs to enrich and inspire people of all
ages and abilities" is an adopted tagline. Don't resolve either by guessing.
