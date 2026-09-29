# Design reference and audit

The organizer-supplied **HAIO Symposium.pdf** is the reference for this reconstruction. The website is a responsive archive, not a pixel-for-pixel copy of its fixed-size pages.

## Verified source details

- Primary blue: `#0000CD`.
- Accent green: `#00FF7F`.
- Pale section background: `#E6E6FA`.
- Hero: Imperial Sans Display Regular; subtitle: Bold.
- Section headings: Imperial Sans Display Extrabold.
- Original person names: Agrandir Heavy; original short role labels: Canva Sans Regular.
- Programme and detailed sessions share a blue background, white body text, and green timing/session accents.
- Portraits use rounded corners on all sides, centered captions, underlined profile links and affiliation logos.
- Committee grouping: Business School (Lin, Corley), I-X (Tucci, Scott), Trusted AI Alliance / DSI (Shrier, Kennedy).

Colours and font names were checked in the PDF's graphics/text resources as well as its rendered pages. The exact affiliation logos were recovered from its embedded image objects; provenance is recorded in content/assets.json.

## Alignment corrections, 29 September 2026

Corrected the approximated palette and heading weights; restored the blue session background; added the six speaker logos and committee branding; restored oversized flat white HAIO marks; moved the ribbon below the title; adjusted portrait rounding and selected crop positions; restored underlined name links; and changed the programme heading to Schedule.

All event content, people, external URLs and timings remain unchanged. The Google Form stays omitted and the registration URL remains an archival link.

## Deliberate adaptations and remaining differences

Navigation, hero date/location details, a compact schedule heading, and a brief archive footer are additions for web use. Portraits, groupings, spacing and session columns reflow for small screens instead of shrinking the whole poster. The original repeated full-page dividers and every decorative treatment are not reproduced exactly. The hero ribbon is one uncropped image spanning the hero and lineup inside a shared wrapper; lineup clearance and the gradient track its intrinsic height, so the old Canva page boundary does not cut the artwork. The hero ribbon is sourced from the PDF's 800-pixel embedded artwork, so extreme enlargement can soften it.

Imperial Sans Display is supplied by the owner's local font installation. Agrandir Heavy and Canva Sans are absent from that installation: person names use Imperial Extrabold and short role labels use Arial/Helvetica. Those two label treatments are approximations. Font files stay outside the public repository.

## Validation

Build and existing content checks pass. The event data was compared against the previous version, excluding the added logo identifiers: no factual changes. Browser checks found no horizontal page overflow at 320, 390, 768, 1100 or 1440 pixels. Desktop/mobile hero, lineup, committee and session layouts were inspected. All local image references resolve and the six affiliation logos render. Third-party profile/paper URLs were preserved, not revalidated live.

## Three-reviewer detail pass, 29 September 2026

Independent read-only reviews covered typography, logo proportions, and responsive details. Checked their recommendations against the source PDF and applied:

- Three-line lineup and two-line committee heading shapes; heavier committee names, slightly larger desktop speaker names, and tighter name underlines.
- Bottom-aligned committee captions and institution marks. This follows the source baseline; portrait bottoms also remain aligned at tablet/desktop widths.
- Optically balanced I-X/DSI hero widths, smaller LSE/Cohere affiliation logos, and the tightly bounded flat HAIO mark in the header/footer.
- Two-line mobile role clearance and flush-left session type labels.
- Original decorative SVG car, bus, and train pictograms replacing numbered travel markers. The train is an intentional alternative to the source's premium Tube graphic.

The original font substitutions remain documented above. The continuous ribbon is unchanged. Build/content checks passed; all images loaded and no horizontal overflow was found at 320, 390, 768, 1001, 1100, and 1440 pixels. Visually inspected the desktop committee/hero and mobile lineup/venue.
