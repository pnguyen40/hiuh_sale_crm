import { esc, icon } from './views.js';
import { COPY } from './chat-i18n.js';
import { POLICY_URL, uid, demoSession, createSession, sessionStatus, clockText, canSend, openHandoff, cancelHandoff, requestHandoff, setLanguage, sendMessage, claimCase, startCase, acceptHandoff, expire, reconnect, event } from './chat-model.js';
import { initSession, getSession, changeSession, subscribe, addSession, storageAvailable } from './chat-store.js';
const validationScenario=new URLSearchParams(location.search).get('scenario')==='validation';
let sid=initSession(), draft='', contact={name:'',phone:''}, warnings=validationScenario?['ERR_NAME_EMPTY','ERR_PHONE_EMPTY']:[], errorKey='', busy=false, minimized=false, failedOnce=false, requestKey=uid();
const root=document.querySelector('#customer-app');
const time = at => new Date(at).toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Ho_Chi_Minh'});
const wait = () => new Promise(r=>setTimeout(r,450));
function announce(text) { document.querySelector('#chat-announcement').textContent=text; }
function reviewBar(s) {
  return `<aside class="review-bar" aria-label="Công cụ xem prototype"><a class="review-brand" href="review-ai.html">AI chat <span>v0.9 · Dữ liệu mô phỏng</span></a><div class="review-links"><a href="ai-log.html?sid=${s.id}" target="_blank" rel="noopener">${icon('PanelRightOpen')} Xem phía CSKH</a><details class="demo-tools"><summary>Mô phỏng</summary><div class="demo-popover"><label>Trạng thái mẫu<select id="scenario"><option value="">Chọn trạng thái</option><option value="initial">Bắt đầu</option><option value="form">Khai báo thông tin</option><option value="waiting">Chờ CSKH</option><option value="human">Đang chat CSKH</option><option value="invalid">Thông tin cần bổ sung</option><option value="english">English</option><option value="warning">Còn 01:35</option><option value="expired">Đã hết phiên</option><option value="offline">Mất kết nối</option></select></label><label>Kênh nguồn<select id="demo-channel"><option value="WEB" ${s.channel==='WEB'?'selected':''}>Website</option><option value="APP" ${s.channel==='APP'?'selected':''}>Mobile app</option></select></label><button data-cmd="fail-next">Lần gửi kế tiếp thất bại</button><button data-cmd="disconnect">Mô phỏng mất kết nối</button><button data-cmd="warning">Đưa về còn 01:35</button><button data-cmd="expire">Hết phiên ngay</button><button data-cmd="staff" ${s.phase!=='REQUESTED'?'disabled':''}>Nhân viên nhận và kết nối</button><small>Không gửi dữ liệu tới bệnh viện. Hai góc nhìn dùng chung dữ liệu local.</small></div></details></div></aside>`;
}
function form(s,t) {
  return `<section class="handoff-card" aria-labelledby="form-title"><div class="handoff-heading">${icon('Headset')}<h2 id="form-title">${t.form}</h2></div><p>${t.minimum}</p><form id="handoff-form" novalidate><label for="customer-name">${t.name}<input id="customer-name" name="name" maxlength="100" autocomplete="name" value="${esc(contact.name)}" placeholder="${t.nameHint}" aria-invalid="${warnings.includes('ERR_NAME_EMPTY')}" ${warnings.includes('ERR_NAME_EMPTY')?'aria-describedby="name-error"':''}></label>${warnings.includes('ERR_NAME_EMPTY')?`<p class="field-error" id="name-error">${icon('CircleAlert')}${t.ERR_NAME_EMPTY}</p>`:''}<label for="customer-phone">${t.phone}<input id="customer-phone" name="phone" type="tel" inputmode="tel" maxlength="50" autocomplete="tel" value="${esc(contact.phone)}" placeholder="${t.phoneHint}" aria-invalid="${warnings.some(x=>x.startsWith('ERR_PHONE'))}" ${warnings.some(x=>x.startsWith('ERR_PHONE'))?'aria-describedby="phone-error"':''}></label>${warnings.filter(x=>x.startsWith('ERR_PHONE')).map(x=>`<p class="field-error" id="phone-error">${icon('CircleAlert')}${t[x]}</p>`).join('')}${warnings.length?`<div class="validation-help" role="alert"><strong>${t.validationTitle}</strong><p>${t.validationHint}</p></div>`:''}${errorKey?`<p class="field-error" role="alert">${t[errorKey]||t.handoffError}</p>`:''}<p class="handoff-lock">${icon('Info')}${s.locale==='en'?'Once your request is received, this session stays with customer care.':'Sau khi gửi thành công, phiên này sẽ tiếp tục với CSKH và không quay lại AI.'}</p><div class="form-actions"><button class="primary" type="submit" ${busy||!canSend(s)?'disabled':''}>${busy?t.checking:t.submit}${!busy?icon('ArrowRight'):''}</button>${warnings.length?`<button class="continue-anyway" type="button" data-cmd="continue-anyway" ${busy||!canSend(s)?'disabled':''}>${t.skip}</button>`:''}<button class="text-button" type="button" data-cmd="cancel-handoff" ${busy?'disabled':''}>${t.back}</button></div></form></section>`;
}
function messages(s,t) {
  let body = s.messages.map(m=>({at:m.at,kind:'message',value:m}));
  body.push(...s.events.filter(e=>['HANDOFF_REQUESTED','HUMAN_CONNECTED'].includes(e.type)).map(e=>({at:e.at,kind:'event',value:e})));
  body.forEach((item,index)=>item.order=item.value.order??index);
  body.sort((a,b)=>a.at-b.at || a.order-b.order);
  return body.map(item=>{
    const m=item.value;
    if(item.kind==='event')return `<div class="chat-event">${icon(m.type==='HUMAN_CONNECTED'?'UserRoundCheck':'ArrowRightLeft')}<span>${m.type==='HUMAN_CONNECTED'?t.connectedEvent:t.handoffEvent} · ${time(m.at)}</span></div>`;
    return `<article class="message ${m.role.toLowerCase()}" data-message="${m.id}"><div class="message-meta">${m.role==='CUSTOMER'?'':`<span class="speaker-icon">${icon(m.role==='STAFF'?'Headset':'Bot')}</span>`}<strong>${m.role==='CUSTOMER'?t.customer:m.role==='STAFF'?t.humanName:t.aiName}</strong><time>${time(m.at)}</time></div><p>${esc(m.text)}</p>${m.role==='CUSTOMER'?`<small>${icon('Check')}${t.sent}</small>`:''}</article>`;
  }).join('');
}
function render() {
  const s=getSession(sid);if(!s)return;
  const t=COPY[s.locale]||COPY.vi, st=sessionStatus(s), active=document.activeElement, focus=active?.id, selection=active?.selectionStart;
  const oldScroll=document.querySelector('.conversation-scroll'), scroll=oldScroll?.scrollTop, atBottom=oldScroll?oldScroll.scrollHeight-oldScroll.clientHeight-oldScroll.scrollTop<80:true;
  document.documentElement.lang=s.locale;
  const status=st==='EXPIRED'?t.expired:st==='UNKNOWN'?t.offline:s.phase==='HUMAN_ACTIVE'?t.human:s.humanLocked?t.waiting:t.ai;
  root.innerHTML=`${reviewBar(s)}<header class="hospital-header"><img src="assets/hiuh-logo.png" alt="Bệnh viện Đại học Quốc tế Hồng Bàng"><span>${t.noteConnection}</span><a href="tel:1900966979">${icon('Phone')}1900 966 979</a></header><main class="customer-page ${s.channel==='APP'?'app-channel':''}">${minimized?`<button class="reopen primary" data-cmd="reopen">${icon('MessageSquare')}${t.reopen}</button>`:`<section class="chat-window" aria-label="${t.title}"><header class="chat-header"><div class="assistant-identity"><span class="assistant-mark">${icon(s.humanLocked?'Headset':'Bot')}</span><div><h1>${t.title}</h1><p><span class="presence ${st==='UNKNOWN'||st==='EXPIRED'?'muted':''}"></span>${status}</p></div></div><div class="header-controls"><label class="language-control">${icon('Languages')}<span class="sr-only">${t.language}</span><select id="chat-language" aria-label="${t.language}"><option value="auto" ${s.localeMode==='auto'?'selected':''}>${t.auto}</option><option value="vi" ${s.localeMode==='vi'?'selected':''}>Tiếng Việt</option><option value="en" ${s.localeMode==='en'?'selected':''}>English</option></select></label><button class="icon-button" data-cmd="minimize" aria-label="${t.close}">${icon('Minus')}</button></div></header><div class="human-strip"><div><button class="handoff-switch" role="switch" aria-checked="${s.humanLocked}" aria-label="${t.connect}" data-cmd="open-handoff" ${s.humanLocked||s.phase==='HANDOFF_FORM'||!canSend(s)?'disabled':''}><span class="switch-track"><span></span></span><span>${t.connect}</span>${s.humanLocked?icon('LockKeyhole'):''}</button><p>${s.humanLocked?t.locked:t.switchHint}</p></div>${st!=='EXPIRED'?`<div class="countdown ${st==='ENDING'?'soon':''}">${icon('Clock3')}<span>${t.timer}<b data-timer>${clockText(s)}</b></span></div>`:''}</div><div class="conversation-scroll"><div class="conversation-inner"><div class="privacy-notice" id="privacy-notice">${icon('ShieldCheck')}<p><span lang="vi">${COPY.vi.notice} <a href="${POLICY_URL}" target="_blank" rel="noopener" data-policy>${COPY.vi.policy}${icon('ExternalLink')}</a>.</span>${s.locale==='en'?`<span class="translated-notice" lang="en">${t.notice} <a href="${POLICY_URL}" target="_blank" rel="noopener" data-policy>${t.policy}</a>.</span>`:''}</p></div><div class="date-separator">${new Date(s.createdAt).toLocaleDateString(s.locale==='en'?'en-GB':'vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'numeric',month:'long',year:'numeric'})}</div><div class="messages" role="log" aria-label="${s.locale==='en'?'Conversation':'Nội dung trò chuyện'}">${messages(s,t)}</div>${s.phase==='HANDOFF_FORM'?form(s,t):''}${s.phase==='REQUESTED'?`<section class="waiting-panel"><span class="waiting-icon">${icon('Headset')}</span><div><h2>${t.waitingTitle}</h2><p>${t.waitingBody}</p><small>${t.noEta}</small></div></section>`:''}</div></div><footer class="chat-footer">${st==='ENDING'?`<div class="session-alert warning" role="status">${icon('Clock3')}<div><strong>${t.warning} · <span data-timer>${clockText(s)}</span></strong><p>${t.warningBody}</p></div><button data-cmd="continue">${t.keepAlive}</button></div>`:''}${st==='UNKNOWN'?`<div class="session-alert" role="alert">${icon('WifiOff')}<div><strong>${t.offline}</strong><p>${t.offlineBody}</p></div><button data-cmd="reconnect">${t.retry}</button></div>`:''}${st==='EXPIRED'?`<div class="session-alert ended" role="status">${icon('Clock3')}<div><strong>${t.expired}</strong><p>${t.expiredBody.replace('10',String(s.config.idleMs/60000))}</p></div><button class="primary" data-cmd="new-session">${t.newSession}</button></div>`:''}${s.phase!=='HANDOFF_FORM'?`<form class="message-composer" id="customer-message-form"><label class="sr-only" for="customer-message">${t.input}</label><textarea id="customer-message" rows="1" maxlength="4000" placeholder="${t.input}" ${busy?'readonly':''}>${esc(draft)}</textarea><button type="submit" class="primary" ${busy||!canSend(s)?'disabled':''}>${busy?t.busy:t.send}${icon('ArrowUp')}</button></form>${errorKey?`<p class="composer-error" role="alert">${t[errorKey]||t.sendError}</p>`:''}`:''}<div class="footer-help"><span>${icon('Info')}${s.humanLocked?t.locked:t.reference}</span><a href="tel:1900966979">${t.contact}</a></div>${!storageAvailable?'<p class="composer-error" role="status">Trình duyệt không cho lưu local. Dữ liệu chỉ giữ trong tab này; hai góc nhìn chưa đồng bộ.</p>':''}</footer></section>`}</main>`;
  if(focus){const next=document.getElementById(focus);if(next){next.focus({preventScroll:true});if(typeof selection==='number'&&next.setSelectionRange)next.setSelectionRange(selection,selection);}}
  const nextScroll=document.querySelector('.conversation-scroll');if(nextScroll)nextScroll.scrollTop=atBottom?nextScroll.scrollHeight:scroll||0;
}
function switchToSession(id,keepDraft=false) { sid=id;if(!keepDraft){draft='';contact={name:'',phone:''};}warnings=[];errorKey='';requestKey=uid();const url=new URL(location.href);url.searchParams.set('sid',id);history.replaceState(null,'',url);render(); }
async function submitHandoff(allowWarnings=false) {
  if(busy)return;const s=getSession(sid), t=COPY[s.locale];busy=true;errorKey='';render();
  const current=sid;
  try {
    await wait();if(current!==sid)return;
    if(failedOnce){failedOnce=false;await changeSession(sid,s=>event(s,'HANDOFF_FAILED',{result:'FAILED'}));throw Error('handoffError');}
    const result=await changeSession(sid,s=>requestHandoff(s,contact,{allowWarnings,key:requestKey}));
    if(result.needsConfirmation){warnings=result.warnings;announce(t.validationTitle);}
    else {warnings=[];announce(t.waitingTitle);}
  } catch(err){errorKey='handoffError';}
  finally{busy=false;render();if(warnings.length)document.getElementById(warnings.includes('ERR_NAME_EMPTY')?'customer-name':'customer-phone')?.focus();}
}
root.addEventListener('input',e=>{
  if(e.target.id==='customer-message')draft=e.target.value;
  if(e.target.id==='customer-name')contact.name=e.target.value;
  if(e.target.id==='customer-phone')contact.phone=e.target.value;
});
root.addEventListener('change',async e=>{
  if(e.target.id==='chat-language'){await changeSession(sid,s=>setLanguage(s,e.target.value));render();}
  if(e.target.id==='scenario'&&e.target.value)switchToSession(addSession(demoSession(e.target.value,getSession(sid).channel)));
  if(e.target.id==='demo-channel')switchToSession(addSession(createSession(e.target.value)));
});
root.addEventListener('keydown',e=>{
  if(e.target.id==='customer-message'&&e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();document.querySelector('#customer-message-form').requestSubmit();}
  if(e.key==='Escape'&&getSession(sid).phase==='HANDOFF_FORM'&&!busy){changeSession(sid,s=>cancelHandoff(s));}
});
root.addEventListener('submit',async e=>{
  e.preventDefault();if(e.target.id==='handoff-form')return submitHandoff();
  if(e.target.id!=='customer-message-form'||busy||!canSend(getSession(sid)))return;
  if(!draft.trim()){errorKey='messageLength';render();document.getElementById('customer-message').focus();return;}
  busy=true;errorKey='';const text=draft,id=sid,key=uid();render();
  try{
    await wait();if(id!==sid)return;
    if(failedOnce){failedOnce=false;await changeSession(sid,s=>event(s,'SEND_FAILED',{result:'FAILED',role:'CUSTOMER'}));throw Error('sendError');}
    await changeSession(sid,s=>sendMessage(s,'CUSTOMER',text,{key}));draft='';
    const s=getSession(sid);
    if(!s.humanLocked){await wait();await changeSession(sid,s=>{if(s.phase==='AI_ACTIVE'&&!s.humanLocked&&canSend(s))sendMessage(s,'AI',s.locale==='en'?'I can help with hospital service information. Select “Chat with customer care” if you would like to speak with the team.':'Tôi có thể hỗ trợ thông tin dịch vụ của bệnh viện. Nếu cần trao đổi với nhân viên, bạn hãy chọn “Chat với nhân viên CSKH”.');});}
  }catch{errorKey='sendError';}finally{busy=false;render();document.getElementById('customer-message')?.focus();}
});
root.addEventListener('click',async e=>{
  if(e.target.closest('[data-policy]'))changeSession(sid,s=>event(s,'POLICY_OPENED'));
  const button=e.target.closest('[data-cmd]');if(!button||button.disabled)return;
  const cmd=button.dataset.cmd;
  try{
    if(cmd==='open-handoff'){warnings=[];errorKey='';await changeSession(sid,s=>openHandoff(s));document.getElementById('customer-name')?.focus();}
    if(cmd==='cancel-handoff'){warnings=[];errorKey='';await changeSession(sid,s=>cancelHandoff(s));document.querySelector('.handoff-switch')?.focus();}
    if(cmd==='continue-anyway')await submitHandoff(true);
    if(cmd==='minimize'){minimized=true;render();}
    if(cmd==='reopen'){minimized=false;render();}
    if(cmd==='new-session')switchToSession(addSession(createSession(getSession(sid).channel)),true);
    if(cmd==='reconnect'){errorKey='';await changeSession(sid,s=>reconnect(s));}
    if(cmd==='continue')await changeSession(sid,s=>{if(!canSend(s))return;s.lastCustomerActivityAt=Date.now();s.expiresAt=Date.now()+s.config.idleMs;event(s,'CUSTOMER_CONTINUED');});
    if(cmd==='disconnect')await changeSession(sid,s=>{s.connected=false;event(s,'CONNECTION_LOST');});
    if(cmd==='warning')await changeSession(sid,s=>{if(s.phase!=='ENDED'){s.lastCustomerActivityAt=Date.now()-s.config.idleMs+95000;s.expiresAt=Date.now()+95000;}});
    if(cmd==='expire')await changeSession(sid,s=>{s.expiresAt=Date.now();expire(s);});
    if(cmd==='staff')await changeSession(sid,s=>{if(!s.owner)claimCase(s);if(s.caseState==='NEW')startCase(s);acceptHandoff(s);sendMessage(s,'STAFF',s.locale==='en'?'Hello, I am Mai Anh from customer care. I have received your conversation and will assist you.':'Chào bạn, mình là Mai Anh từ bộ phận CSKH. Mình đã nhận nội dung trao đổi và sẽ tiếp tục hỗ trợ bạn.');});
    if(cmd==='fail-next'){failedOnce=true;announce('Đã bật mô phỏng lỗi cho lần gửi kế tiếp.');button.textContent='Đã bật lỗi cho lần gửi kế tiếp';}
  }catch{errorKey='sendError';render();}
});
subscribe(render);render();
let lastStatus=sessionStatus(getSession(sid));
setInterval(()=>{
  const s=getSession(sid);if(!s)return;const state=sessionStatus(s);
  document.querySelectorAll('[data-timer]').forEach(el=>el.textContent=clockText(s));
  if(state==='EXPIRED'&&s.phase!=='ENDED')changeSession(sid,x=>expire(x));
  if(state!==lastStatus){lastStatus=state;render();announce(state==='ENDING'?COPY[s.locale].warning:state==='EXPIRED'?COPY[s.locale].expired:'');}
},1000);
window.HIUH_CHAT={getState:()=>getSession(sid)};
