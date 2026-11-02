import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const root=path.resolve(import.meta.dirname,'..');
const output=path.resolve(root,'../handoff/CSKH-Operation-Portal-v0.9.0.html');
const evidence=path.join(root,'evidence/handoff-single-v09');
const session=process.env.CSKH_QA_SESSION||'ab-cskh-export-1102';
const url=pathToFileURL(output).href;
function browser(args,input){
  const text=execFileSync('agent-browser',['--session',session,...args,'--json'],{input,encoding:'utf8',timeout:30000,maxBuffer:12*1024*1024});
  const result=JSON.parse(text);if(!result.success)throw Error(result.error||text);return result.data;
}
const evaluate=code=>browser(['eval','--stdin'],code).result;
const results=[];const check=(name,pass,detail)=>results.push({name,pass,detail});
const html=fs.readFileSync(output,'utf8');const data=JSON.parse(html.match(/<script id="handoff-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const bad=[];
for(const [name,page] of Object.entries(data.pages)){
  if(/@import\s+(url|['"])/.test(page.styles))bad.push(name+' CSS import');
  if(/src="(?!data:|__CSKH_ASSET_)/.test(page.body))bad.push(name+' relative resource');
  for(const match of page.styles.matchAll(/url\(['"]?([^)'" ]+)/g))if(!match[1].startsWith('__CSKH_ASSET_')&&!match[1].startsWith('data:'))bad.push(name+' '+match[1]);
}
check('All CSS imports, local images and fonts are embedded',bad.length===0&&data.assets.length===20,{bad,assets:data.assets.length});
check('BRD embedded byte-for-byte',data.brdMarkdown===fs.readFileSync(path.resolve(root,'../CSKH-01-brd-v0.9.0.md'),'utf8'));
browser(['set','offline','on']);browser(['set','viewport','1440','900']);
for(const name of Object.keys(data.pages)){
  browser(['open',url+'?surface='+name+(name==='portal'?'&frame=M-03':name==='customer'?'&scenario=human':name==='staff'?'&scenario=human':'')]);
  const state=evaluate(`({surface:window.__CSKH_HANDOFF?.surface,heading:document.querySelector('h1')?.textContent,bodyLength:document.body.innerText.length,offline:!navigator.onLine,overflow:document.documentElement.scrollWidth-innerWidth,network:performance.getEntriesByType('resource').filter(r=>!r.name.startsWith('data:')).map(r=>r.name),fonts:document.fonts.status})`);
  const errors=browser(['errors']);
  check('Offline route: '+name,state.surface===name&&state.bodyLength>100&&state.offline&&state.network.length===0&&errors.errors.length===0,{...state,errors:errors.errors});
}
browser(['open',url+'?surface=portal&frame=M-03']);
const frames=evaluate(`(()=>{const out=[];for(let i=1;i<=51;i++){const id='M-'+String(i).padStart(2,'0');try{CSKH.loadFrame(id);out.push({id,rendered:!!document.querySelector('main')&&!!document.querySelector('h1')});}catch(e){out.push({id,error:e.message});}}CSKH.loadFrame('M-03');return out;})()`);
check('51 Portal frames render in the single file',frames.length===51&&frames.every(f=>f.rendered),frames);
const css=evaluate(`({body:getComputedStyle(document.body).fontFamily,heading:getComputedStyle(document.querySelector('h1')).fontFamily,color:getComputedStyle(document.querySelector('h1')).color,sidebar:document.querySelector('.portal-sidebar')?.getBoundingClientRect().width,columns:[...document.querySelectorAll('th')].map(x=>x.innerText)})`);
check('DS typography and last-message column preserved',css.body.includes('Lexend')&&css.heading.includes('Plus Jakarta Sans')&&css.color==='rgb(22, 32, 92)'&&css.columns.includes('Câu hội thoại cuối cùng'),css);
browser(['click','[data-filter-trigger="topic"]']);browser(['check','input[data-filter="topic"][value="dat-lich"]']);browser(['check','input[data-filter="topic"][value="tu-van-goi"]']);
const filter=evaluate(`({selected:[...document.querySelectorAll('#filter-pop-topic input:checked')].map(x=>x.value),open:document.getElementById('filter-pop-topic').matches(':popover-open'),topics:[...new Set([...document.querySelectorAll('tbody tr')].map(x=>x.children[3].innerText))]})`);
check('Native multi-select works offline and keeps menu open',filter.selected.length===2&&filter.open&&filter.topics.every(x=>['Đặt lịch khám','Tư vấn gói khám'].includes(x)),filter);
browser(['press','Escape']);
browser(['open',url+'?surface=portal&frame=M-47']);
const recent=evaluate(`({badges:[...document.querySelectorAll('tbody .session-badge')].map(x=>x.innerText),rows:document.querySelectorAll('tbody tr').length})`);
check('Recent-expiry frame uses the 15-minute filter',recent.rows>0&&recent.badges.every(x=>x.includes('Phiên vừa hết trong 15')),recent);
browser(['open',url+'?surface=portal&frame=M-49']);
const tickets=evaluate(`({title:document.querySelector('h1').innerText,rows:document.querySelectorAll('tbody tr').length,text:document.querySelector('main').innerText.slice(0,500)})`);
check('Ticket data present in exported file',tickets.title==='Phiếu yêu cầu'&&tickets.rows>0,tickets);
browser(['open',url+'?surface=portal&frame=M-50']);
check('CSKH log renders offline',evaluate(`document.querySelector('h1').innerText==='CSKH log'&&document.querySelectorAll('tbody tr').length>0`));
// Read the exact session exercised manually with native clicks, typing and two tabs.
const exchange=evaluate(`(()=>{const db=JSON.parse(localStorage.getItem('hiuh-ai-chat-offline-v09'));const s=db.sessions.find(x=>x.messages.some(m=>m.role==='STAFF'&&m.text==='Kiểm thử bàn giao HTML 1 file')&&x.messages.some(m=>m.role==='CUSTOMER'&&m.text==='Khách đã nhận tin bản HTML'));return s?{sameSession:true,caseId:s.caseId,owner:s.owner,customerReply:true,staffReply:true}:null})()`);
check('Two-tab public exchange from manual UI run persisted',!!exchange?.sameSession,exchange);
const layouts=[];
for(const [width,height,surface,query] of [[1440,900,'portal','&frame=M-03'],[1440,900,'staff','&scenario=human'],[390,844,'customer','&scenario=initial'],[390,844,'portal','&frame=M-03']]){
  browser(['set','viewport',String(width),String(height)]);browser(['open',url+'?surface='+surface+query]);
  const layout=evaluate(`({overflow:document.documentElement.scrollWidth-innerWidth,launcherVisible:document.getElementById('handoff-navigation').getBoundingClientRect().width>0,home:document.querySelector('.handoff-mobile-home')?.getBoundingClientRect().width,fonts:document.fonts.status})`);
  layouts.push({width,height,surface,...layout});browser(['screenshot',path.join(evidence,surface+'-'+width+'.png')]);
}
check('Desktop/mobile: no page overflow, launcher does not cover mobile controls',layouts.every(l=>l.overflow===0&&(l.width>600||!l.launcherVisible)),layouts);
browser(['set','viewport','1440','900']);browser(['open',url]);
browser(['click','#handoff-navigation']);
check('Handoff navigation opens',evaluate(`document.getElementById('handoff-navigation').shadowRoot.querySelector('#panel').matches(':popover-open')`));
browser(['press','Escape']);
const report={checkedAt:new Date().toISOString(),file:output,sha256:createHash('sha256').update(html).digest('hex'),method:'agent-browser isolated Chromium; file://; offline mode; native controls plus read-only DOM/model inspection; 51 frames render check is not full workflow coverage',pass:results.every(r=>r.pass),results};
fs.writeFileSync(path.join(evidence,'qa-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:report.pass,total:results.length,failed:results.filter(x=>!x.pass),report:path.join(evidence,'qa-results.json')},null,2));
if(!report.pass)process.exitCode=1;
