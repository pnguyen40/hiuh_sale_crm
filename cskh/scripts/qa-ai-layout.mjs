import {execFileSync} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
const SESSION='ab-hiuh-ai-1102',BASE='http://127.0.0.1:4802/CSKH/prototype-portal-v0.9.0/';
const out=new URL('../evidence/ai-chat/',import.meta.url).pathname;mkdirSync(out,{recursive:true});
const results=[];
function b(...args){const r=JSON.parse(execFileSync('agent-browser',['--session',SESSION,'--json',...args],{encoding:'utf8',maxBuffer:5e6,timeout:25000}));if(!r.success)throw Error(r.error);return r.data;}
function ev(code){return b('eval','-b',Buffer.from(code).toString('base64')).result;}
function viewport(w,h){b('set','viewport',String(w),String(h),'1');const size=ev('({w:innerWidth,h:innerHeight,dpr:devicePixelRatio})');const ratio=w/size.w;if(Math.abs(size.w-w)>1)b('set','viewport',String(Math.round(w*ratio)),String(Math.round(h*ratio)),String(1/size.dpr));return ev('({w:innerWidth,h:innerHeight,dpr:devicePixelRatio})');}
function capture(tab,path,w,h,name,extra=''){
 b('tab',tab);const actual=viewport(w,h);b('open',BASE+path);b('wait','--fn',path.startsWith('ai-log')?'!!window.HIUH_LOG':path.startsWith('customer')?'!!window.HIUH_CHAT':'document.readyState==="complete"');
 if(extra)ev(extra);
 const geometry=ev(`(()=>{const focus=[...document.querySelectorAll('.chat-window,.message-composer,.handoff-card,.ai-log-layout,.ai-composer,.ai-identity')].filter(el=>el.getClientRects().length).map(el=>{const r=el.getBoundingClientRect();return {name:el.className,x:r.x,y:r.y,w:r.width,h:r.height,within:r.x>=-1&&r.right<=innerWidth+1}});return {viewport:{w:innerWidth,h:innerHeight,dpr:devicePixelRatio},overflow:document.documentElement.scrollWidth-innerWidth,focus};})()`);
 const pass=geometry.overflow<=1&&geometry.focus.every(x=>x.within)&&Math.abs(actual.w-w)<=2;
 b('screenshot',out+name+'.png');results.push({name,path,target:{w,h},...geometry,pass});console.log((pass?'PASS ':'FAIL ')+name+' '+JSON.stringify(geometry.viewport)+' overflow '+geometry.overflow);
}
capture('t11','customer-chat.html?scenario=initial',1440,900,'customer-initial-1440');
capture('t11','customer-chat.html?scenario=validation',390,844,'customer-validation-390');
capture('t11','customer-chat.html?scenario=warning',360,800,'customer-warning-360');
capture('t11','customer-chat.html?scenario=human',390,844,'customer-human-390');
capture('t11','customer-chat.html?scenario=english',768,1024,'customer-english-768');
capture('t11','customer-chat.html?scenario=form&channel=APP',390,844,'customer-app-form-390');
capture('t11','customer-chat.html?scenario=expired',390,844,'customer-expired-390');
capture('t11','customer-chat.html?scenario=initial',1642,965,'customer-user-1642');
capture('t12','ai-log.html?scenario=invalid',1440,900,'ai-log-invalid-1440');
capture('t12','ai-log.html?scenario=human',1280,800,'ai-log-human-1280');
capture('t12','ai-log.html?scenario=human',1920,1080,'ai-log-human-1920');
capture('t12','ai-log.html?scenario=waiting',390,844,'ai-log-queue-390');
capture('t12','ai-log.html?scenario=invalid',390,844,'ai-log-identity-390',`document.querySelector('[data-cmd="panel"][data-panel="identity"]').click()`);
capture('t12','ai-log.html?scenario=human',360,800,'ai-log-human-360');
capture('t12','ai-log.html?scenario=partial',768,1024,'ai-log-partial-768');
capture('t12','ai-log.html?scenario=invalid',1642,965,'ai-log-user-1642');
writeFileSync(out+'layout-results.json',JSON.stringify({method:'Viewport measured in CSS px; compensated for existing Chrome origin zoom 80%; screenshots DPR approximately 1',tests:results,passed:results.filter(x=>x.pass).length,total:results.length},null,2));
if(results.some(x=>!x.pass))process.exitCode=1;
