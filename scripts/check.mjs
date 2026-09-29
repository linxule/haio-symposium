import assert from 'node:assert/strict';
import {readFile,access,readdir,stat} from 'node:fs/promises';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));const dist=join(root,'dist');
const html=await readFile(join(dist,'index.html'),'utf8');
assert(!/\{\{[^}]+\}\}/.test(html),'Unresolved template token');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'Duplicate HTML ID');
for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 if(url.startsWith('#'))assert(ids.includes(url.slice(1)),`Missing anchor ${url}`);
 else if(!url.startsWith('https://'))await access(join(dist,url));
}
const event=JSON.parse(await readFile(join(root,'content/event.json'),'utf8'));
assert.equal(event.speakers.length,6);assert.equal(event.committee.length,6);
assert.equal(event.schedule.length,7);assert.equal(event.sessions.length,2);
const papers=event.sessions.flatMap(s=>s.items).filter(t=>t.url);assert.equal(papers.length,4);
const minute=s=>Number(s.slice(0,2))*60+Number(s.slice(3));
for(const [i,item] of event.schedule.entries()){
 assert(minute(item.start)<minute(item.end));
 if(i)assert.equal(event.schedule[i-1].end,item.start,'Programme gap or overlap');
}
for(const session of event.sessions){
 const parent=event.schedule.find(t=>t.anchor===session.id);
 assert.equal(session.items[0].start,parent.start);assert.equal(session.items.at(-1).end,parent.end);
 session.items.forEach((t,i)=>{assert(minute(t.start)<minute(t.end));if(i)assert.equal(session.items[i-1].end,t.start);});
}
assert(!/<(?:script|iframe|form)\b/i.test(html),'Unexpected script, iframe or form');
assert.equal((html.match(/<h1\b/g)||[]).length,1);
assert.equal((html.match(/<article class="person"/g)||[]).length,12);
assert(html.includes('9 September 2024'));assert(html.includes('W12 0BZ'));
// Check the release's public machine-readable surface against its source.
const site=JSON.parse(await readFile(join(root,'content/site.json'),'utf8'));
const published=JSON.parse(await readFile(join(dist,'event.json'),'utf8'));
assert.deepEqual(published,{event:site,...event},'Published JSON differs from the archive source');
const full=await readFile(join(dist,'llms-full.txt'),'utf8');
for(const person of [...event.speakers,...event.committee]) {
 assert(full.includes(person.name));assert(full.includes(person.role));assert(full.includes(person.url));
}
for(const session of event.sessions) for(const item of session.items) {
 assert(full.includes(item.title));assert(full.includes(item.description));if(item.url)assert(full.includes(item.url));
}
assert(full.includes('Registration is closed'));assert(full.includes('Cavell House Bus Stop'));
assert(!/<(?:svg|section|div|p|a)\b/.test(full),'HTML leaked into plain text');
const llms=await readFile(join(dist,'llms.txt'),'utf8');
for(const path of ['llms-full.txt','event.json','robots.txt']) assert(llms.includes(`${site.url}/${path}`));
const robots=await readFile(join(dist,'robots.txt'),'utf8');
const groups=robots.split(/\n\n/).filter(group=>group.startsWith('User-agent:'));
assert(groups.length>1);assert(groups.some(group=>group.startsWith('User-agent: *\n')));
for(const group of groups) {
 assert(group.includes('Content-Signal: ai-train=yes, search=yes, ai-input=yes'));
 assert(group.includes('Allow: /'));assert(!group.includes('Disallow:'));
}
assert(robots.includes(`Sitemap: ${site.url}/sitemap.xml`));
assert((await readFile(join(dist,'sitemap.xml'),'utf8')).includes(`<loc>${site.url}/</loc>`));
assert(html.includes(`rel="canonical" href="${site.url}/"`));
let bytes=0;async function count(path){for(const entry of await readdir(path,{withFileTypes:true})){const p=join(path,entry.name);if(entry.isDirectory())await count(p);else bytes+=(await stat(p)).size;}}await count(dist);
console.log(`Passed: local assets, unique IDs, internal anchors, 12 people, 7 programme slots, 2 sessions, 4 paper links, continuous session timings, no signup embed, text/JSON parity and crawler permissions. Build size ${(bytes/1024/1024).toFixed(2)} MiB.`);
