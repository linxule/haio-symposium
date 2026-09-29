import {writeFile} from 'node:fs/promises';
import {join} from 'node:path';

// All people, programme slots, abstracts and paper links come from the same
// data as the rendered page. Machine-readable copies must not drift from it.
export async function publishText({dist,data,site,html}) {
  const base=site.url;
  const preamble=`# HAIO Symposium 2024

> ${site.title}. An archive of the symposium held at Imperial College London on ${site.displayDate}.

This event has already taken place. Roles and affiliations are those recorded for the 2024 event, not claims about current employment. All event times are London time (BST, UTC+01:00). The programme descriptions are event summaries, not substitutes for the linked research papers.

Search indexing, AI retrieval/input, and AI training are welcome for material within the site owner's rights. Third-party portraits, institutional marks, artwork, fonts and linked papers retain their respective rights; this policy does not relicense them. Please cite the archive and the relevant authors when using their work.
`;
  await writeFile(join(dist,'llms.txt'),`${preamble}
## Archive

- [Symposium website](${base}/): Visual archive with lineup, committee, programme and venue.
- [Full text](${base}/llms-full.txt): Generated text of the event details, people, schedule, sessions, papers and venue.
- [Event data](${base}/event.json): Structured event metadata and programme.
- [Crawler policy](${base}/robots.txt): All crawlers allowed; search, AI input and training signals set to yes.
- [Source repository](${site.repository}): Build instructions, asset provenance and maintenance notes.
`);
  const people=items=>items.map(p=>`### ${p.name}\n\n${p.role} · ${p.affiliation}\n\nProfile: ${p.url}`).join('\n\n');
  const programme=data.schedule.map(t=>`- ${t.start}–${t.end}: ${t.title}${t.detail?`. ${t.detail}`:''}`).join('\n');
  const sessions=data.sessions.map(s=>`## Session ${Number(s.number)}: ${s.title}\n\n${s.items.map(t=>`### ${t.start}–${t.end}: ${t.title}\n\n${t.type}. ${t.by}\n\n${t.description}${t.url?`\n\nPaper: ${t.url}`:''}`).join('\n\n')}`).join('\n\n');
  // Keep venue prose identical to the HTML, including the transport directions.
  const decode=s=>s.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('&#39;',"'");
  const venue=decode(html.match(/<section class="venue[\s\S]*?<\/section>/)[0]
    .replace(/<svg[\s\S]*?<\/svg>/g,'')
    .replace(/<span aria-hidden="true">[\s\S]*?<\/span>/g,'')
    .replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g,'$2 ($1)')
    .replace(/<br\s*\/?>(\s*)/g,'\n').replace(/<\/(?:p|h[1-6]|div)>/g,'\n\n')
    .replace(/<[^>]+>/g,'').replace(/[ \t]+/g,' ').replace(/^ +/gm,'').replace(/\n{3,}/g,'\n\n').trim());
  await writeFile(join(dist,'llms-full.txt'),`${preamble}
Source: ${base}/

## Event

- Date: ${site.displayDate}
- Time: ${site.time}, ${site.timezone}
- Venue: ${site.venue}

## Speakers and respondents

${people(data.speakers)}

## Organizing committee

${people(data.committee)}

## Schedule

${programme}

${sessions}

## Venue and travel

${venue}

## Archival event listing

${data.registration}

Registration is closed. The original Google signup form is not part of this archive.
`);
  await writeFile(join(dist,'event.json'),JSON.stringify({event:site,...data},null,2)+'\n');
  await writeFile(join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${base}/</loc></url></urlset>\n`);
  const crawlers=['*','GPTBot','ChatGPT-User','OAI-SearchBot','ClaudeBot','Claude-Web','anthropic-ai','claude-user','Google-Extended','PerplexityBot','Perplexity-User','Applebot-Extended','FacebookBot','Meta-ExternalAgent','Bytespider','Amazonbot','CCBot','cohere-ai','Diffbot','MistralAI-User','Omgilibot','ImagesiftBot','DuckAssistBot','YouBot'];
  await writeFile(join(dist,'robots.txt'),`# HAIO Symposium: search, AI input and training welcome.\n# Signals express the owner's permissions; third-party rights remain unchanged.\n# See /llms.txt and https://contentsignals.org/\n\n${crawlers.map(bot=>`User-agent: ${bot}\nContent-Signal: ai-train=yes, search=yes, ai-input=yes\nAllow: /`).join('\n\n')}\n\nSitemap: ${base}/sitemap.xml\n`);
}
