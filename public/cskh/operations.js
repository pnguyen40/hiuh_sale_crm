import {canRead,terminal} from './model.js';
import {recordEvent} from './workbench.js';
export const REQUEST_TYPES={'appointment':'Đặt hẹn chuyên khoa','insurance':'Bảo lãnh viện phí','records':'Cấp trích sao bệnh án','support':'Hỗ trợ thông tin','other':'Khác'};
export const UNITS={booking:'Đội Đặt hẹn',finance:'Tài chính kế toán',planning:'Kế hoạch tổng hợp',cskh:'Nhóm CSKH'};
export const PRIORITIES={HIGH:'Cao',NORMAL:'Thường',LOW:'Thấp'};
export const TICKET_STATES={NEW:'Mới',IN_PROGRESS:'Đang xử lý',WAITING:'Chờ phản hồi',RESOLVED:'Hoàn tất',CANCELLED:'Đã hủy'};
const demand=(ok,message)=>{if(!ok)throw Error(message)};
export const clock=s=>Date.now()+(s.clockOffset||0);
export const remaining=(s,c)=>Math.max(0,Math.ceil(((c.session?.lastCustomerActivity||0)+600000-clock(s))/1000));
export const sessionState=(s,c)=>!c?.session?'NONE':remaining(s,c)===0?'EXPIRED':!c.session.connected?'UNKNOWN':remaining(s,c)<=120?'ENDING':'ACTIVE';
export const sessionExpiresAt=c=>c?.session?c.session.lastCustomerActivity+600000:null;
export const isRecentExpired=(s,c)=>sessionState(s,c)==='EXPIRED'&&clock(s)-sessionExpiresAt(c)<900000;
export const sessionFacet=(s,c)=>isRecentExpired(s,c)?'RECENT_EXPIRED':sessionState(s,c);
export const isLive=(s,c)=>['ACTIVE','ENDING'].includes(sessionState(s,c))&&!terminal(c);
export const eligible=s=>s.revoked?[]:s.cases.filter(c=>c.kind==='ai'&&!terminal(c)&&(canRead(s,c)||(!c.owner&&c.status==='NEW'&&c.group==='CSKH')));
export const liveCases=s=>eligible(s).filter(c=>isLive(s,c)).sort((a,b)=>remaining(s,a)-remaining(s,b));
export const timeLeft=(s,c)=>{const sec=remaining(s,c);return `${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`};
export function initOperations(s){
 s.tickets=[];s.ticketSeq=82;s.ticketFilter={q:'',status:'',priority:'',unit:''};s.ticketPage=1;s.liveDrafts={};s.clockOffset=0;s.liveOnly=false;
 const now=clock(s);
 for(const [i,c] of s.cases.entries())if(c.kind==='ai')c.session={id:c.sourceRef+'-LIVE',lastCustomerActivity:now-(i===0?180000:i===3?510000:i===6?20000:660000),connected:i!==9,mode:'HISTORY',botPaused:false,messages:[],seen:new Set()};
 if(s.frame==='M-40'){s.view='queue';}
 if(['M-41','M-42','M-43'].includes(s.frame)){s.screen='detail';s.caseId=s.cases[0].id;if(s.frame==='M-42')s.cases[0].session.lastCustomerActivity=now-610000;if(s.frame==='M-43')s.cases[0].session.connected=false;}
 if(['M-44','M-45','M-46'].includes(s.frame)){
  const c=s.cases[0];s.caseId=c.id;
  createTicket(s,c,{requestType:'appointment',priority:'NORMAL',unit:'booking',dueAt:new Date(now+3600000+7*3600000).toISOString().slice(0,16),description:'Khách cần tư vấn thời gian khám; phối hợp đội đặt hẹn rồi liên hệ lại.',requestKey:'seed'});
  if(s.frame==='M-44')s.screen='tickets';else if(s.frame==='M-45'){s.screen='tickets';s.ticketId=s.tickets[0].id;}else {s.screen='detail';s.caseId=c.id;s.overlay='D-11';s.ticketRequestKey='frame-M46-'+now;}
 }
}
export function checkLive(s,c){demand(canRead(s,c)&&c.owner===s.user,'Bạn cần là người đang phụ trách ca này.');demand(!terminal(c)&&c.status==='IN_PROGRESS','Bắt đầu hoặc tiếp tục xử lý trước khi chat.');demand(isLive(s,c),'Phiên đã hết hạn hoặc chưa xác định kết nối. Nội dung nháp vẫn được giữ.');}
export function beginLive(s,c){checkLive(s,c);c.session.mode='LIVE';c.session.botPaused=true;recordEvent(s,{at:new Date(clock(s)).toISOString(),action:'chat_start',caseId:c.id});}
export function sendLive(s,c,text,key){checkLive(s,c);demand(c.session.mode==='LIVE'&&c.session.botPaused,'Chuyển sang Chat trực tiếp trước khi gửi.');const body=String(text||'').trim();demand(body&&body.length<=4000,'Tin nhắn cần từ 1 đến 4.000 ký tự.');if(c.session.seen.has(key))return;c.session.seen.add(key);c.session.messages.push({id:key,role:'STAFF',text:body,at:clock(s),state:'SENT'});recordEvent(s,{at:new Date(clock(s)).toISOString(),action:'chat_send',caseId:c.id});}
export function receiveLive(s,c,{sessionId,id,text,at=clock(s)}){
 if(!canRead(s,c)||sessionId!==c.session?.id||c.session.seen.has(id)||terminal(c)||sessionState(s,c)==='EXPIRED')return false;
 if(!Number.isFinite(at)||at>clock(s)||at<c.session.lastCustomerActivity)return false;
 c.session.seen.add(id);c.session.lastCustomerActivity=at;c.session.connected=true;c.session.messages.push({id,role:'CUSTOMER',text:String(text).slice(0,4000),at});return true;
}
export const visibleTickets=s=>s.revoked?[]:(s.tickets||[]).filter(t=>canRead(s,s.cases.find(c=>c.id===t.sourceId)));
export const findTicket=(s,id)=>visibleTickets(s).find(t=>t.id===id);
export function createTicket(s,c,d){
 demand(canRead(s,c)&&['IN_PROGRESS','WAITING'].includes(c.status),'Bắt đầu xử lý và kiểm tra quyền trước khi tạo phiếu.');
 demand(REQUEST_TYPES[d.requestType]&&PRIORITIES[d.priority]&&UNITS[d.unit],'Chọn loại yêu cầu, mức ưu tiên và đơn vị thụ lý.');
 demand(typeof d.requestKey==='string'&&d.requestKey.length>0,'Thiếu khóa lưu phiếu. Mở lại form và thử lại.');
 const description=String(d.description||'').trim();demand(description&&description.length<=4000,'Nhập mô tả yêu cầu, tối đa 4.000 ký tự.');
 const due=Date.parse(d.dueAt+':00+07:00');demand(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(d.dueAt||'')&&Number.isFinite(due)&&new Date(due+7*3600000).toISOString().slice(0,16)===d.dueAt&&due>clock(s),'Chọn hạn xử lý sau thời điểm hiện tại.');
 if(s.tickets.some(t=>t.requestKey===d.requestKey&&t.sourceId===c.id))return s.tickets.find(t=>t.requestKey===d.requestKey&&t.sourceId===c.id);
 const id='REQ-'+new Date(clock(s)+7*3600000).toISOString().slice(0,10).replaceAll('-','')+'-'+String(++s.ticketSeq).padStart(4,'0');
 const t={id,sourceId:c.id,sourceRef:c.sourceRef,sessionId:c.session?.id||null,requestType:d.requestType,priority:d.priority,unit:d.unit,dueAt:d.dueAt,description,status:'NEW',creator:s.user,requestKey:d.requestKey,createdAt:clock(s),history:[{at:clock(s),actor:s.user,status:'NEW',note:'Tạo phiếu'}]};
 s.tickets.unshift(t);recordEvent(s,{at:new Date(clock(s)).toISOString(),action:'ticket_create',caseId:c.id,objectType:'TICKET',objectId:id});return t;
}
export function updateTicket(s,id,next,note){const t=findTicket(s,id);demand(t,'Bạn không còn quyền xem phiếu này.');const map={NEW:['IN_PROGRESS','CANCELLED'],IN_PROGRESS:['WAITING','RESOLVED','CANCELLED'],WAITING:['IN_PROGRESS','RESOLVED','CANCELLED'],RESOLVED:s.role==='SUPERVISOR'?['IN_PROGRESS']:[],CANCELLED:s.role==='SUPERVISOR'?['IN_PROGRESS']:[]};demand(map[t.status].includes(next),'Chuyển trạng thái không hợp lệ.');const content=String(note||'').trim();demand(content&&content.length<=4000,'Ghi kết quả hoặc nội dung xử lý, tối đa 4.000 ký tự.');const previous=t.status;t.status=next;t.history.unshift({at:clock(s),actor:s.user,status:next,note:content});recordEvent(s,{at:new Date(clock(s)).toISOString(),action:'ticket_update',caseId:t.sourceId,objectType:'TICKET',objectId:id,reason:true,code:previous+'_'+next});return t;}
