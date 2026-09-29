import {readFile,writeFile,mkdir,cp,copyFile,access,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {homedir} from 'node:os';
import {publishText} from './publish-text.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const dist=join(root,'dist');
const data=JSON.parse(await readFile(join(root,'content/event.json'),'utf8'));
const site=JSON.parse(await readFile(join(root,'content/site.json'),'utf8'));
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const person=p=>`<article class="person" data-person="${escape(p.id)}"><a class="portrait-link" href="${escape(p.url)}" tabindex="-1" aria-hidden="true"><img src="assets/${escape(p.id)}.webp" alt="" loading="lazy" width="480" height="480"></a><div><h3><a href="${escape(p.url)}">${escape(p.name)}</a></h3><p class="role">${escape(p.role)}</p><p class="affiliation">${p.logo?`<img class="affiliation-logo" src="assets/${escape(p.logo)}.webp" alt="${escape(p.affiliation)}" loading="lazy">`:escape(p.affiliation)}</p></div></article>`;
const committeeBrands=[
 [{asset:'business-school',alt:'Imperial College Business School, Department of Management and Entrepreneurship'}],
 [{asset:'ix',alt:'I-X, an initiative of Imperial'}],
 [{asset:'trusted-ai',alt:'Trusted AI Alliance'},{asset:'dsi',alt:'Imperial Data Science Institute'}]
];
const committee=committeeBrands.map((brands,i)=>`<div class="committee-row"><div class="committee-brands">${brands.map(b=>`<img src="assets/${b.asset}.webp" alt="${b.alt}" loading="lazy">`).join('')}</div>${data.committee.slice(i*2,i*2+2).map(person).join('')}</div>`).join('');
const slot=t=>`<time datetime="2024-09-09T${t.start}:00+01:00">${t.start}</time>–<time datetime="2024-09-09T${t.end}:00+01:00">${t.end}</time>`;
const schedule=data.schedule.map(t=>`<li><div class="slot">${slot(t)}</div><div><h3>${t.anchor?`<a href="#${t.anchor}">${escape(t.title)} <span aria-hidden="true">↗</span></a>`:escape(t.title)}</h3>${t.detail?`<p>${escape(t.detail)}</p>`:''}</div></li>`).join('\n');
const sessions=data.sessions.map(s=>`<section class="session" id="${s.id}" aria-labelledby="${s.id}-heading"><div class="session-heading"><span class="session-number" aria-hidden="true">${s.number}</span><div><p class="eyebrow">Session ${Number(s.number)}</p><h2 id="${s.id}-heading">${escape(s.title)}</h2></div></div>${s.items.map(t=>`<article class="talk"><div><div class="slot">${slot(t)}</div><p class="kind">${escape(t.type)}</p></div><div><h3>${escape(t.title)}</h3><p class="by">${escape(t.by)}</p>${t.url?`<a class="paper-link" href="${escape(t.url)}" aria-label="Read paper: ${escape(t.title)}">Read paper <span aria-hidden="true">↗</span></a>`:''}</div><p class="abstract">${escape(t.description)}</p></article>`).join('')}</section>`).join('\n');
let html=await readFile(join(root,'index.html'),'utf8');
for(const [key,value] of Object.entries({canonical:escape(site.url),speakers:data.speakers.map(person).join('\n'),committee,schedule,sessions,map:escape(data.map),registration:escape(data.registration)})) html=html.replaceAll(`{{${key}}}`,value);
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});await cp(join(root,'public'),dist,{recursive:true});
await writeFile(join(dist,'index.html'),html);
await publishText({dist,data,site,html});
// Keep font binaries out of Git; use the owner's installed copies when available.
const fontRoot=process.env.HAIO_FONT_DIR||join(homedir(),'Library','Fonts');
let css='';let count=0;
for(const [style,weight] of [['Regular',400],['Bold',700],['Extrabold',800]]){
 const filename=`ImperialSansDisplay-${style}.ttf`;const source=join(fontRoot,filename);
 let available=false;try{await access(source);available=true;}catch{}
 const names=`local('Imperial Sans Display ${style}'),local('ImperialSansDisplay-${style}')`;
 if(available){await mkdir(join(dist,'fonts'),{recursive:true});await copyFile(source,join(dist,'fonts',filename));count++;}
 css+=`@font-face{font-family:'Imperial Sans Display';font-style:normal;font-weight:${weight};font-display:swap;src:${names}${available?`,url('fonts/${filename}') format('truetype')`:''}}\n`;
}
await writeFile(join(dist,'fonts.css'),css);
console.log(`Built static site in dist/ (${count} local font weights included).`);
