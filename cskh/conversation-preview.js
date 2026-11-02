import {canRead} from './model.js';
import {receivedMessages} from './context.js';
import {esc,icon} from './views.js';
export const SPEAKERS={CUSTOMER:'Bệnh nhân',STAFF:'CSKH',AI:'AI'};
export function lastPublicMessage(s,c){
 if(s.view==='queue'||!canRead(s,c))return {state:'LOCKED'};
 if(c.kind!=='ai')return c.message?.trim()?{state:'READY',role:'CUSTOMER',text:c.message,time:c.received.slice(-5)}: {state:'EMPTY'};
 if(c.log==='UNAVAILABLE')return {state:'UNAVAILABLE'};
 const list=[...receivedMessages(c),...(c.session?.messages||[])].filter(m=>SPEAKERS[m.role]&&m.text?.trim()&&!m.private&&m.visibility!=='INTERNAL'&&m.state!=='FAILED');
 // Transcript precedes the live stream; both preserve source order for ties.
 const last=list.map((m,index)=>({...m,index})).sort((a,b)=>(a.at||0)-(b.at||0)||a.index-b.index).at(-1);
 return last?{...last,state:c.log==='PARTIAL'?'PARTIAL':'READY'}:{state:'EMPTY'};
}
export function conversationPreview(s,c){
 const m=lastPublicMessage(s,c);
 if(m.state==='LOCKED')return `<span class="last-message-empty">${icon('LockKeyhole')}Nhận xử lý để xem</span>`;
 if(m.state==='UNAVAILABLE')return '<span class="last-message-empty">Chưa tải được hội thoại</span>';
 if(m.state==='EMPTY')return '<span class="last-message-empty">Chưa có câu hội thoại</span>';
 const at=m.at?new Date(m.at).toLocaleTimeString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit'}):m.time;
 return `<div class="last-message" data-speaker="${m.role}"><div class="last-message-meta"><span class="speaker-dot ${m.role.toLowerCase()}" aria-hidden="true"></span><strong>${SPEAKERS[m.role]}</strong><time>${esc(at||'')}</time></div><p title="${esc(m.text)}">${esc(m.text)}</p>${m.state==='PARTIAL'?'<small>Mới nhất đã nhận · log một phần</small>':''}</div>`;
}
export const speakerLegend=()=>'<div class="speaker-legend" aria-label="Người gửi câu hội thoại"><span><i class="speaker-dot customer" aria-hidden="true"></i>Bệnh nhân</span><span><i class="speaker-dot staff" aria-hidden="true"></i>CSKH</span><span><i class="speaker-dot ai" aria-hidden="true"></i>AI</span></div>';
