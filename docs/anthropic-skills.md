# Anthropic skills for the UniMem website

Installed from `https://github.com/anthropics/skills.git` at revision `ca45fc496a3436251f191354091d557da31c15b5`:

- [Frontend design](../.agents/skills/frontend-design/SKILL.md): design direction, type, structure, restrained motion, and screenshot critique.
- [Webapp testing](../.agents/skills/webapp-testing/SKILL.md): native Python Playwright reconnaissance and browser checks, with the bundled server lifecycle helper.

Both are project-local Agent Skills in `.agents/skills`, each with its unmodified Apache-2.0 license. The lock manifest records hashes of all eight upstream files. Other skills in the upstream repository address documents, Anthropic's own brand, and different workflows; they are not installed into this website project.

## Brief and design plan

UniMem serves developers and teams evaluating persistent agent memory. The page's primary job is to make the memory feedback loop understandable, show the boundaries of its evidence, and lead to a real local first run. The source-backed content, working interactions, and current site map provide the design target.

The defining object is the interactive memory loop. Supporting typography and section structure should make that object easier to read, rather than compete with it.

### Compact token system

| Token      | Value     | Role                                              |
| ---------- | --------- | ------------------------------------------------- |
| Paper      | `#f5f8f6` | Main page field                                   |
| White      | `#ffffff` | Evidence and editable surfaces                    |
| Forest ink | `#174437` | Headlines and primary actions                     |
| Evergreen  | `#246a53` | Focus, active states, and links                   |
| Sea glass  | `#d9eae1` | Selected controls and supporting surfaces         |
| Quiet line | `#cbd8d0` | Boundaries between different kinds of information |

Typography: one self-hosted **IBM Plex Sans** variable family for display and body text. Its technical character, readable numerals, and computing lineage fit a product about machine memory. Code and exact record identifiers retain a monospace treatment. Body text stays within approximately 65–75 characters per line.

### Layout study

Two arrangements were considered for the opening. The existing content supports a side-by-side instrument more clearly than a centered statement followed by a separate demo; retain that relationship, with left-aligned copy and a readable, interactive instrument beside it.

```text
Chosen desktop opening             Narrow screen
┌────────────────────────────┐      ┌──────────────────┐
│ Brand   Navigation  Start  │      │ Brand  Search Menu│
├────────────┬───────────────┤      ├──────────────────┤
│ Category   │ Memory loop   │      │ Category         │
│ Statement  │ Candidates    │      │ Statement        │
│ Meaning    │ Trial stages  │      │ Meaning / action │
│ First run  │ Evidence      │      │ Memory loop      │
└────────────┴───────────────┘      └──────────────────┘

Alternative: centered statement above a separate full-width instrument.
The chosen arrangement puts the product interaction beside its explanation.
```

### Plan review before implementation

The baseline screenshots were captured with the installed testing skill's server helper. They show a dark hero, a bright single-word highlight, repeated uppercase labels, and catalog items numbered as if they were steps. The plan changes those treatments: a light opening, one ink color for the full headline, sentence-case labels only where useful, and type-specific symbols for the memory catalog. Numbering stays in the actual trial and installation sequences. Dark surfaces belong to code and dense record tools.

The palette keeps recognition of UniMem's green identity while replacing the acid highlight with sea glass. No new gradients, stock AI imagery, customer counts, or speculative product claims are introduced. Motion responds to a visitor's action; no automatic demo progression or repeated scroll entrances are added.

## Installation and use

The skills are readable through their project paths and referenced by `AGENTS.md`. To verify upstream integrity, compare each installed file's SHA-256 against `.agents/skills/anthropic-skills.lock.json`. To update, review a specific new upstream revision, then replace only the two selected skill folders and refresh the manifest.

The Python browser workflow requires Playwright (`python -m pip install playwright`, then `python -m playwright install chromium`) or an available Chromium selected with `CHROME_PATH`. The bundled helper starts the app before the browser workflow and stops it afterward. It is development tooling, not website runtime code.

Browser verification and screenshot review follow implementation; results are recorded in the website QA documentation.

Run the installed workflow with:

```bash
npm run build
npm run review:browser
```

It writes screenshots and `review.json` to `artifacts/skill-review`, starts a production server through the upstream helper, and shuts the server down at the end. That output directory is separate from Playwright's `test-results` directory so running the CI suite does not delete the visual-review artifacts.

## Applied refinement and review

The final opening uses one continuous headline color beside the memory instrument. The catalog uses six memory-specific SVG symbols, and redundant category labels and non-sequential catalog numbers have been removed. Dark panels remain for records and executable examples. The font is served from this repository, with its SIL Open Font License and source hash included under `public/fonts`.

Screenshot review prompted two further adjustments: removing a duplicate heading above the memory instrument, and replacing decorative font characters with SVG icons or clear text. The latter prevents missing-glyph boxes in captions, external links, trust controls, and field-note artwork.

The Python workflow also found a real search interaction bug: Escape inside a populated native search input cleared its text before closing the dialog. Search now handles that key explicitly. A regression check verifies that closing search on mobile preserves the underlying menu until a second Escape.

All 42 TypeScript browser checks pass. The additional Python workflow passes at 1440, 768, 390, and 320 pixels, including memory lifecycle, historical recall, graph layout, OS/client instructions, search, benchmarks, and preparing a contact draft without an API submission. Results and reviewed screenshots are linked from [website QA](qa.md).

This installs two project-local skills for agents working on the repository. It does not install a global Claude or ChatGPT plugin, and the skills are not shipped as browser runtime dependencies.
