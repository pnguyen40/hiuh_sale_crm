import {clock,beginLive,sendLive,receiveLive,sessionState,sessionFacet,isLive,timeLeft,updateTicket,visibleTickets,liveCases} from './operations.js';
import {canRead,current} from './model.js';
import {recordEvent} from './workbench.js';
export function installOperations(getState,render,toast,confirmLeave){
 let sending=false,lastSignature='';
 const check=()=>{const s=getState();return s.screen==='detail'?current(s):null;};
 document.addEventListener('click',async e=>{
  const el=e.target.closest('[data-action]');if(!el||el.disabled)return;
  const s=getState(),c=check(),a=el.dataset.action;
  if(a==='tickets'||a==='ticket-open'){
   if(!confirmLeave())return;
   s.screen='tickets';s.ticketId=a==='ticket-open'?el.dataset.id:null;s.ticketNote='';s.navOpen=false;s.overlay=null;s.noteDraft='';s.resumeDraft='';render();return;
  }
  if(a==='ticket-close'){if(s.ticketNote&&!confirm('Bỏ nội dung phiếu chưa lưu?'))return;s.ticketId=null;s.ticketNote='';render();}
  if(a==='ticket-clear'){s.ticketFilter={q:'',status:'',priority:'',unit:''};s.ticketPage=1;render();}
  if(a==='ticket-prev'||a==='ticket-next'){s.ticketPage+=a==='ticket-next'?1:-1;render();}
  if(a==='live-filter'){s.liveOnly=!s.liveOnly;s.filters.session=[];s.page=1;render();}
  if(a==='recent-filter'){s.liveOnly=false;s.filters.session=(s.filters.session||[]).includes('RECENT_EXPIRED')?[]:['RECENT_EXPIRED'];s.page=1;render();}
  if(a==='compose-mode'){s.composeMode=el.dataset.id;render();}
  if(a==='chat-toggle'&&c){
   try{if(c.session.mode==='LIVE'){c.session.mode='HISTORY';recordEvent(s,{at:new Date(clock(s)).toISOString(),action:'chat_pause',caseId:c.id});}else{el.disabled=true;await new Promise(r=>setTimeout(r,300));if(s!==getState()||current(s)?.id!==c.id)return;if(new URLSearchParams(location.search).get('fail')==='1')throw Error('Chưa xác nhận bàn giao chat. Thử lại; chưa gửi tin.');beginLive(s,c);s.composeMode='reply';}render();}
   catch(err){recordEvent(s,{at:new Date(clock(s)).toISOString(),action:'chat_start',caseId:c.id,result:'FAILED',code:'CHAT_NOT_READY'});render();toast(err.message,'warning');}
  }
  if(a.startsWith('demo-')&&c?.session&&canRead(s,c)){
   if(a==='demo-expire')c.session.lastCustomerActivity=clock(s)-600001;
   if(a==='demo-disconnect')c.session.connected=false;
   if(a==='demo-reconnect')c.session.connected=true;
   if(a==='demo-message')receiveLive(s,c,{sessionId:c.session.id,id:crypto.randomUUID(),text:'Tôi vẫn đang ở đây, nhờ anh/chị hỗ trợ thêm về lịch khám.'});
   render();
  }
 });
 document.addEventListener('input',e=>{const s=getState(),c=check();if(e.target.id==='live-text'&&c)s.liveDrafts[c.id]=e.target.value;if(e.target.id==='ticket-note')s.ticketNote=e.target.value;if(e.target.id==='ticket-search'){const pos=e.target.selectionStart;s.ticketFilter.q=e.target.value;s.ticketPage=1;render();const x=document.querySelector('#ticket-search');x.focus();x.setSelectionRange(pos,pos);}});
 document.addEventListener('change',e=>{const s=getState();if(e.target.closest('#ticket-filters')&&e.target.name&&!e.target.dataset.filter&&e.target.id!=='ticket-search'){s.ticketFilter[e.target.name]=e.target.value;s.ticketPage=1;render();}});
 document.addEventListener('submit',async e=>{
  if(e.target.id==='live-form'){
   e.preventDefault();if(sending)return;const s=getState(),c=current(s),text=s.liveDrafts[c.id]||'',session=c.session.id,key=crypto.randomUUID();sending=true;const button=e.submitter;button.disabled=true;
   try{await new Promise(r=>setTimeout(r,350));if(s!==getState()||current(s)?.id!==c.id)return;if(c.session.id!==session)throw Error('Phiên đã đổi. Kiểm tra lại trước khi gửi.');if(new URLSearchParams(location.search).get('fail')==='1')throw Error('Chưa gửi được. Nội dung nháp được giữ để thử lại.');sendLive(s,c,text,key);s.liveDrafts[c.id]='';render();document.querySelector('.live-messages')?.scrollIntoView({block:'end'});document.querySelector('#live-text')?.focus();}
   catch(err){recordEvent(s,{at:new Date(clock(s)).toISOString(),action:'chat_send',caseId:c.id,result:'FAILED',code:'SEND_NOT_CONFIRMED'});const error=document.querySelector('#live-error');if(error)error.textContent=err.message;else toast(err.message,'warning');}
   finally{sending=false;if(button?.isConnected)button.disabled=!isLive(s,c)||!canRead(s,c)||c.owner!==s.user||c.status!=='IN_PROGRESS';}
  }
  if(e.target.id==='ticket-update-form'){
   e.preventDefault();const s=getState();try{if(new URLSearchParams(location.search).get('fail')==='1')throw Error('Chưa lưu được, nội dung được giữ để thử lại.');updateTicket(s,s.ticketId,e.submitter.value,s.ticketNote);s.ticketNote='';render();toast('Đã cập nhật phiếu.');}catch(err){document.querySelector('#ticket-error').textContent=err.message;const t=visibleTickets(s).find(t=>t.id===s.ticketId);if(t)recordEvent(s,{at:new Date(clock(s)).toISOString(),action:'ticket_update',caseId:t.sourceId,objectType:'TICKET',objectId:t.id,result:'FAILED',code:'TICKET_UPDATE_FAILED'});}
  }
 });
 setInterval(()=>{
  const s=getState();document.querySelectorAll('[data-countdown]').forEach(el=>{const c=s.cases.find(c=>c.id===el.dataset.countdown);if(c)el.textContent=timeLeft(s,c);});
  const signature=s.cases.filter(c=>c.session).map(c=>c.id+sessionFacet(s,c)).join();
  if(lastSignature&&signature!==lastSignature&&!s.overlay&&!sending){render();if(s.screen==='detail'&&current(s)?.session&&sessionState(s,current(s))==='EXPIRED')toast('Phiên chat đã hết hạn. Nội dung nháp được giữ.','warning');}
  if(!s.overlay&&!sending)lastSignature=signature;
 },1000);
}
