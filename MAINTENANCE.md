# Maintain the HAIO archive

Use this guide to edit, build and publish the [HAIO Symposium archive](https://haiosymposium.com/). For the event overview, see the [README](README.md).

## Archive sources

We rebuilt the archive from the organizer's Canva PDF and supplied artwork. It keeps the blue and green palette, portraits and institutional marks. The ribbon flows from the opening section into the lineup. See [the design notes](DESIGN.md) for source checks and adaptations.

## Run locally

Requires Node.js 20 or newer. There are no third-party build dependencies, browser scripts, analytics, cookies, forms or databases.

```sh
npm run build
npm run check
npm run preview
```

Open <http://127.0.0.1:4173>. Rebuild and refresh after edits; the preview server does not watch files. Set `PORT` to change its port. It binds to localhost and is not a production server.

## Edit the archive

| File | Purpose |
| --- | --- |
| `content/event.json` | People, affiliations, programme, session summaries and links |
| `content/site.json` | Public URL and event metadata |
| `index.html` | Page structure and venue directions |
| `public/styles.css` | Typography, colours and responsive layout |
| `public/assets/` | Optimized portraits, artwork and logos |
| `content/assets.json` | Image provenance |
| `scripts/build.mjs` | Static build and local font handling |
| `scripts/publish-text.mjs` | Generated crawler policy, text, JSON and sitemap |
| `wrangler.jsonc` | Cloudflare static hosting configuration |

`dist/` is the generated website and is excluded from Git. Keep historical event facts intact; do not silently update a speaker's 2024 affiliation to their current one.

## Search, AI readers and training

Following [Research Memex](https://research-memex.org/), this archive welcomes search indexing, AI retrieval and training for material within the site owner's rights. It publishes these files:

- [`/robots.txt`](https://haiosymposium.com/robots.txt) allows every crawler. The wildcard and named AI crawler groups each declare `Content-Signal: ai-train=yes, search=yes, ai-input=yes`.
- [`/llms.txt`](https://haiosymposium.com/llms.txt) provides an archive guide and source links.
- [`/llms-full.txt`](https://haiosymposium.com/llms-full.txt) provides generated event text, including people, programme, paper links and venue directions.
- [`/event.json`](https://haiosymposium.com/event.json) exposes the same structured content used by the site.
- [`/sitemap.xml`](https://haiosymposium.com/sitemap.xml) identifies the canonical page.

These files are generated during the build, so they remain aligned with the archive. Please cite the event archive and the relevant authors. Paper summaries here describe the programme; consult the linked papers for research claims. Crawler signals express permissions and preferences, not a guarantee of crawler behavior. They do not relicense third-party material.

## Fonts and asset rights

Imperial Sans Display font binaries are not included in Git or release source archives. The build looks in `~/Library/Fonts` for `ImperialSansDisplay-Regular.ttf`, `ImperialSansDisplay-Bold.ttf` and `ImperialSansDisplay-Extrabold.ttf`. To supply authorized copies elsewhere:

```sh
HAIO_FONT_DIR=/path/to/fonts npm run build
```

Without these files the site builds with local-font declarations and an Arial/Helvetica fallback. The published build uses the owner's installed fonts. Agrandir Heavy and Canva Sans, used in the original name and role labels, are approximated with Imperial Extrabold and Arial/Helvetica.

Original repository code and documentation are MIT licensed; see [LICENSE](LICENSE). Third-party photographs, institutional logos, branding, artwork, fonts and linked papers retain their respective rights and are excluded from that grant. Publishing the archive does not grant a blanket right to redistribute those assets or imply endorsement. Raw recovery ZIP/PDF files and original font binaries remain outside this repository.

## Deploy

The website is served by Cloudflare Workers Static Assets as `haio-symposium`. There is no application Worker, database or runtime API. The canonical website is [haiosymposium.com](https://haiosymposium.com/). [www.haiosymposium.com](https://www.haiosymposium.com/) serves the same archive with the apex URL in page metadata; it does not redirect. The [workers.dev address](https://haio-symposium.linxule.workers.dev/) remains available as a fallback.

Use an authenticated Wrangler 4 installation:

```sh
wrangler whoami
npm run deploy
```

Deployment rebuilds, checks and uploads `dist/`, including any authorized fonts supplied locally. A Git push alone does not deploy, and a clean checkout without those fonts uses the fallback. Update `content/site.json` if the canonical host changes, then rebuild and deploy. Do not enable a Cloudflare-managed AI crawler block that contradicts the published allow policy.

## Domain email policy

`haiosymposium.com` does not send or receive email. Its Cloudflare DNS records publish this policy:

| Type | Name | Value |
| --- | --- | --- |
| MX | `@` | Priority `0`, target `.` (null MX) |
| TXT | `@` | `v=spf1 -all` |
| TXT | `*._domainkey` | `v=DKIM1; p=` |
| TXT | `_dmarc` | `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;` |

These records have automatic TTLs. Null MX declares that the domain accepts no mail; SPF, empty DKIM and DMARC tell compliant receivers to reject unauthenticated mail claiming to come from this domain or its subdomains. No reporting mailbox is configured. The setup follows [Cloudflare's guidance for domains without email](https://www.cloudflare.com/learning/dns/dns-records/protect-domains-without-email/) and [GOV.UK's null MX guidance](https://www.gov.uk/guidance/protect-domains-that-dont-send-email).

These email records are managed in Cloudflare DNS, separately from `wrangler.jsonc`. Before enabling email, replace null MX with the provider's MX records, authorize legitimate senders in SPF, publish the provider's DKIM selectors, and review DMARC for the intended sending domains. Preserve the website's Worker records when changing email settings.

## Release and validation

`v1.0.0` is the sole archive release. The website, custom-domain configuration and maintenance documentation are consolidated into one commit shared by `main` and the release tag. GitHub hosts source; Cloudflare serves the built website.

`npm run check` verifies local assets, unique IDs, anchors, event counts, session timing continuity, generated text/JSON parity and crawler permissions. It also confirms that no signup embed, form or browser script has appeared. Desktop and mobile layouts were visually reviewed, with no horizontal overflow at 320, 390, 768, 1001, 1100 and 1440 pixels. External profile and paper links preserve the supplied event source; their ongoing availability is not guaranteed by the checks.
