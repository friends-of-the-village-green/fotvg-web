---
name: accessibility
description: WCAG 2.2 AA review checklist and remediation patterns for the FotVG site. Use this skill before finishing any change that touches markup, styling, forms, images, navigation, or interactive behavior — and whenever the user mentions accessibility, screen readers, contrast, keyboard navigation, or ADA compliance. Run the checklist as a final pass on any PR that changes what a visitor sees. If you have written HTML or CSS in this session, use this skill before declaring the work done.
---

# Accessibility Review — FotVG

## Why this matters here specifically

FotVG serves a community that skews older. Some visitors will have low vision, tremor,
or be navigating on a phone in bright sunlight. Beyond that, public-facing nonprofit
sites in the US receive accessibility demand letters with some regularity, and
retrofitting is far more expensive than building correctly.

WCAG 2.2 AA is the standard. Treat it as the floor.

## Run this checklist before finishing any visual change

### Structure
- [ ] Exactly one `<h1>` per page, and it describes the page
- [ ] Headings descend without skipping levels (no h2 → h4)
- [ ] Landmarks present: `<header>`, `<nav>`, `<main>`, `<footer>`
- [ ] Skip-to-content link is the first focusable element and becomes visible on focus
- [ ] `<html lang="en">` is set
- [ ] Lists are marked up as lists; tables use `<th>` with `scope`

### Images and media
- [ ] Every `<img>` has an `alt` attribute
- [ ] Meaningful images have descriptive alt text (see the `fotvg-brand` skill)
- [ ] Decorative images have `alt=""`
- [ ] No text baked into images (event flyers must also exist as real text on the page)
- [ ] Any embedded video has captions

### Color and contrast
- [ ] Body text against its background is at least 4.5:1
- [ ] Large text (18.66px bold or 24px+) is at least 3:1
- [ ] UI components and focus indicators are at least 3:1 against adjacent colors
- [ ] No information conveyed by color alone — a green "confirmed" dot needs a label
- [ ] The design still works at 200% browser zoom without horizontal scrolling

### Keyboard
- [ ] Every interactive element is reachable by Tab
- [ ] Focus indicator is clearly visible on every focusable element — never
      `outline: none` without a replacement of equal or better visibility
- [ ] Tab order follows visual order
- [ ] No keyboard traps
- [ ] Mobile nav can be opened, used, and closed by keyboard, and Escape closes it
- [ ] Anything that opens on hover also opens on focus

### Forms
- [ ] Every input has an associated `<label>` — placeholder text is not a label
- [ ] Required fields are indicated in text, not only with a red asterisk
- [ ] Error messages identify the specific field and say how to fix it
- [ ] Errors are programmatically associated with their input (`aria-describedby`)
- [ ] Submission success is announced, not only visually indicated
- [ ] Autocomplete attributes set on name and email fields

### Links and targets
- [ ] Link text makes sense out of context — no bare "click here" or "read more"
- [ ] Links are distinguishable from body text by more than color alone
- [ ] Links that open a new tab say so
- [ ] Tap targets are at least 24×24 CSS pixels, ideally 44×44
- [ ] Adjacent tap targets have spacing between them

### Motion and timing
- [ ] `prefers-reduced-motion` is respected for any transition or animation
- [ ] Nothing auto-plays, auto-advances, or auto-scrolls
- [ ] No time limits on any interaction

**One documented exception, and only one: the home page hero.** The board asked for a
rotating set of photographs, and the site crossfades between them with no controls
(decision 036). It is allowed to stand for three reasons together, not any one of them
alone: the photographs carry no information — they are `aria-hidden` and decorative, so
nothing is lost by not seeing a particular one — the text sitting over them never changes,
and `prefers-reduced-motion` stops it dead on the first picture. WCAG 2.2.2 is about
moving, blinking or scrolling *information*; this is a backdrop. Adding a pause control
would mean JavaScript and a visible button, which is a decision to take deliberately
rather than a line to add. **Do not treat this as a precedent for a carousel.**

## Testing

Automated tooling catches roughly a third of real issues. Do both:

**Automated** — run against a built site:
```bash
npx @axe-core/cli http://localhost:4321 --exit
npx pa11y-ci --sitemap http://localhost:4321/sitemap-index.xml
```

**Manual** — the part that actually finds things:
1. Unplug the mouse. Tab through the whole page. Can you do everything?
2. Zoom the browser to 200% and then 400%. Does the layout hold?
3. Turn on VoiceOver (Cmd+F5 on macOS) or NVDA and listen to one page top to bottom.
4. View the page in greyscale. Is anything now ambiguous?

## Common fixes

**Focus indicator removed by a CSS reset:**
```css
:focus-visible {
  outline: 3px solid var(--color-accent-dark);
  outline-offset: 2px;
}
```

**Skip link:**
```html
<a href="#main" class="skip-link">Skip to main content</a>
```
```css
.skip-link {
  position: absolute; left: -9999px;
}
.skip-link:focus {
  left: var(--space-m); top: var(--space-m);
  z-index: 100; padding: var(--space-s) var(--space-m);
  background: var(--color-bg); outline: 3px solid var(--color-accent-dark);
}
```

**Reduced motion:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## What to report

When you finish a review, report findings as a short list with severity, not a wall of
tool output. For anything you fixed, say what changed. For anything you could not fix
without a design decision, say what the tradeoff is and ask.

Do not claim a page is "WCAG compliant." Say what was checked and what passed. Formal
conformance claims require human testing with assistive technology.
