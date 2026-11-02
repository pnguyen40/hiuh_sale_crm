import {matchesAny} from './filter-model.js';
import {isLive,clock,sessionFacet} from './operations.js';
import {followUpDeadline} from "./follow-up.js";
// Configuration snapshots contain no case rows. Authorization is reapplied on every query.
export const emptyFilters=()=>({q:'',source:[],status:[],topic:[],owner:[],session:[],date:'',period:'',from:'',to:'',follow:''});
export const defaultColumns=['source','person','topic','lastMessage','status','owner','received','follow'];
export const ACTIONS={chat_start:"Bật chat trực tiếp",chat_pause:"Về lịch sử hội thoại",chat_send:"Gửi tin cho khách",ticket_create:"Tạo phiếu yêu cầu",ticket_update:"Cập nhật phiếu yêu cầu",summary_refresh:'Cập nhật AI summary',receive:'Tiếp nhận từ nguồn',claim:'Nhận xử lý',assign:'Đổi người phụ trách',start:'Bắt đầu xử lý',resume:'Tiếp tục xử lý',wait:'Chờ phản hồi',resolve:'Hoàn tất xử lý',cancel:'Hủy xử lý',reopen:'Mở lại',contact:'Sửa thông tin liên hệ',link:'Liên kết danh bạ',category:'Đổi chủ đề',note:'Thêm ghi chú',booking:'Gửi yêu cầu đặt hẹn',crm:'Chuyển CRM B2B',source_update:'Cập nhật lịch từ nguồn',crm_update:'CRM phản hồi',view_detail:'Xem chi tiết yêu cầu',view_save:'Lưu view',view_delete:'Xóa view',view_rename:'Đổi tên view',log_export:'Xuất CSKH log'};
export const ACTORS={mai:'Mai Anh',linh:'Thùy Linh',huy:'Minh Huy',supervisor:'Trưởng nhóm CSKH',system:'Hệ thống'};
export const RESULT={SUCCESS:'Thành công',FAILED:'Thất bại',DENIED:'Bị từ chối'};
const copy=v=>structuredClone(v);
const list=v=>Array.isArray(v)?v:v?[v]:[];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/đ/g,'d').replace(/[\s().-]/g,'');
export const actorId=s=>s.role==='SUPERVISOR'?'supervisor':s.user;
export const day=s=>new Date(clock(s)+7*3600000).toISOString().slice(0,10);
export const timestamp=c=>c.date+'T'+c.received.slice(-5)+':00+07:00';
export function withinPeriod(date,f,today){
 if(f.date && date!==f.date)return false;
 if(f.period==='custom')return (!f.from||date>=f.from)&&(!f.to||date<=f.to);
 if(!f.period)return true;
 const span={today:0,week:6,month:29}[f.period];
 if(span===undefined)return true;
 const start=new Date(today+'T00:00:00Z');start.setUTCDate(start.getUTCDate()-span);
 return date>=start.toISOString().slice(0,10)&&date<=today;
}
export function queryCases(s){
 if(s.revoked||!['STAFF','SUPERVISOR'].includes(s.role))return [];
 const f=s.filters;
 return s.cases.filter(c=>c.group==='CSKH'&&(s.view==='queue'?!c.owner&&c.status==='NEW':s.view==='mine'?c.owner===s.user:s.view==='team'&&s.role==='SUPERVISOR'))
 .filter(c=>{
 const hay=s.view==='queue'?c.id:[c.id,c.original.name,c.care.name,c.original.phone,c.care.phone].join(' ');
 const due=followUpDeadline(c);
 const open=!['RESOLVED','CANCELLED'].includes(c.status);
 return (!s.liveOnly||isLive(s,c))&&norm(hay).includes(norm(f.q))&&(!list(f.source).length||list(f.source).includes(c.kind))&&(!list(f.status).length||list(f.status).includes(c.status))&&(!list(f.topic).length||list(f.topic).includes(c.topic))&&(!list(f.owner).length||list(f.owner).includes(c.owner))&&(!list(f.session).length||list(f.session).includes(sessionFacet(s,c)))&&withinPeriod(c.date,f,day(s))&&(!f.follow||(open&&due!==null&&(f.follow==='overdue'?due<clock(s):f.follow==='today'?c.followUpAt.slice(0,10)===day(s):true)));
 }).sort((a,b)=>{
 const key=s.sortKey||'received';
 let av=key==='received'?Date.parse(timestamp(a)):key==='updated'?(a.updatedAt?Date.parse(a.updatedAt):Date.parse(timestamp(a))):key==='follow'?followUpDeadline(a):a.id;
 let bv=key==='received'?Date.parse(timestamp(b)):key==='updated'?(b.updatedAt?Date.parse(b.updatedAt):Date.parse(timestamp(b))):key==='follow'?followUpDeadline(b):b.id;
 if(av===null||bv===null)return av===bv?a.id.localeCompare(b.id):av===null?1:-1;
 return (s.sort==='asc'?1:-1)*(typeof av==='string'?av.localeCompare(bv):av-bv)||a.id.localeCompare(b.id);
 });
}
export const config=s=>({liveOnly:!!s.liveOnly,view:s.view,filters:copy(s.filters),sort:s.sort,sortKey:s.sortKey,columns:copy(s.columns)});
export const changedView=s=>{const v=s.savedViews.find(v=>v.id===s.activeView);return v&&JSON.stringify(config(s))!==JSON.stringify(v.config)};
const storageKey=s=>'cskh.views.v090.'+actorId(s);
function validConfig(c){return c&&['queue','mine','team'].includes(c.view)&&c.filters&&typeof c.filters==='object'&&['asc','desc'].includes(c.sort)&&['received','updated','follow','id'].includes(c.sortKey)&&Array.isArray(c.columns)&&c.columns.every(k=>defaultColumns.includes(k));}
export function hydrateViews(s){
 try{const data=JSON.parse(localStorage.getItem(storageKey(s))||'[]');s.savedViews=Array.isArray(data)?data.filter(v=>typeof v.id==='string'&&typeof v.name==='string'&&v.name.length<=60&&validConfig(v.config)&&!(v.config.view==='team'&&s.role!=='SUPERVISOR')).slice(0,12):[];}catch{s.savedViews=[];}
}
function persist(s,views){try{localStorage.setItem(storageKey(s),JSON.stringify(views));}catch{throw Error('Chưa lưu được view trên trình duyệt. Kiểm tra quyền lưu trữ rồi thử lại.')}s.savedViews=views;}
export function saveView(s,name,id=null){
 name=String(name||'').trim();if(!name||name.length>60)throw Error('Tên view cần từ 1 đến 60 ký tự.');
 if(s.savedViews.some(v=>v.id!==id&&norm(v.name)===norm(name)))throw Error('Tên view đã tồn tại. Chọn tên khác.');
 if(!id&&s.savedViews.length>=12)throw Error('Tối đa 12 view cá nhân. Xóa view không còn dùng trước khi lưu.');
 if(id&&!s.savedViews.some(v=>v.id===id))throw Error('View không còn tồn tại.');
 const item={id:id||'view-'+crypto.randomUUID(),name,config:id?copy(s.savedViews.find(v=>v.id===id).config):config(s)};
 persist(s,id?s.savedViews.map(v=>v.id===id?item:v):[...s.savedViews,item]);s.activeView=item.id;
 recordEvent(s,{action:id?'view_rename':'view_save',objectType:'VIEW',objectId:item.id});return item;
}
export function deleteView(s,id){if(!s.savedViews.some(v=>v.id===id))throw Error('View không còn tồn tại.');persist(s,s.savedViews.filter(v=>v.id!==id));if(s.activeView===id)s.activeView=null;recordEvent(s,{action:'view_delete',objectType:'VIEW',objectId:id});}
export function applyView(s,id){const v=s.savedViews.find(v=>v.id===id);if(!v||!validConfig(v.config)||v.config.view==='team'&&s.role!=='SUPERVISOR')throw Error('View không còn khả dụng với quyền hiện tại.');Object.assign(s,{liveOnly:false},copy(v.config),{activeView:id,page:1,error:false});delete s.filters.focus;}
const safeSnapshot=c=>c?{owner:c.owner||'Chưa phân công',status:c.status,topic:c.topic,contactId:c.contactId||'—',name:(c.care?.name??c.original?.name)?'Có giá trị':'Chưa có',phone:(c.care?.phone??c.original?.phone)?'••••••'+(c.care?.phone??c.original?.phone).slice(-4):'Chưa có',email:(c.care?.email??c.original?.email)?'Có giá trị':'Chưa có',followUpAt:c.followUpAt||'—',nextStep:c.nextStep?'Đã ghi nhận':'—',purpose:c.purpose,bookingStatus:c.bookingStatus,appointmentId:c.appointmentId||'—',bookingRequest:c.bookingRequest?.id||'—',crmHandoff:c.crmHandoff?.state||'—',noteCount:c.notes?.length||0}:{};
export function recordEvent(s,{action,caseId=null,objectType='REQUEST',objectId=caseId,result='SUCCESS',actor=actorId(s),before=null,after=null,reason=false,code=null,count=null,at=null}){
 action=action==='ticket-create'?'ticket_create':action;
 const seq=++s.logSeq;
 const prior=safeSnapshot(before),next=safeSnapshot(after);
 const diff=before&&after?Object.keys(next).filter(k=>['name','phone','email'].includes(k)?(before.care?.[k]??before.original?.[k])!==(after.care?.[k]??after.original?.[k]):JSON.stringify(prior[k])!==JSON.stringify(next[k])).map(k=>({field:k,before:prior[k],after:next[k]})):[];
 const entry={id:'CL-'+String(seq).padStart(6,'0'),seq,at:at||new Date(clock(s)).toISOString(),actor,actorType:actor==='system'?'SYSTEM':'USER',roleAtEvent:actor==='system'?'SYSTEM':actor==='supervisor'?'SUPERVISOR':'STAFF',action,caseId,objectType,objectId:objectId||'CSKH',result,diff,reason:!!reason,code,count,correlationId:'COR-MOCK-'+String(seq).padStart(6,'0'),group:'CSKH'};
 s.activity.unshift(entry);return entry;
}
export function visibleLogs(s){
 if(s.revoked||!['STAFF','SUPERVISOR'].includes(s.role))return [];
 const f=s.logFilters;
 return s.activity.filter(e=>e.group==='CSKH'&&(s.role==='SUPERVISOR'||(e.caseId?s.cases.some(c=>c.id===e.caseId&&c.group==='CSKH'&&c.owner===s.user):e.actor===actorId(s))))
 .filter(e=>(!f.q||norm([e.id,e.objectId,e.correlationId].join(' ')).includes(norm(f.q)))&&matchesAny(f.actor,e.actor)&&matchesAny(f.action,e.action)&&matchesAny(f.result,e.result)&&matchesAny(f.type,e.objectType)&&withinPeriod(new Date(Date.parse(e.at)+7*3600000).toISOString().slice(0,10),f,new Date(clock(s)+7*3600000).toISOString().slice(0,10)))
 .sort((a,b)=>(s.logSort==='asc'?1:-1)*(Date.parse(a.at)-Date.parse(b.at)||a.seq-b.seq));
}
export function initWorkbench(s){
 s.filters={...emptyFilters(),...s.filters};delete s.filters.focus;s.sortKey='received';s.columns=[...defaultColumns];s.savedViews=[];s.activeView=null;s.viewEditor=null;s.activity=[];s.logSeq=0;s.logFilters={q:'',actor:'',action:'',result:'',type:'',period:'week',from:'',to:''};s.logSort='desc';s.logPage=1;s.logDetail=null;
 for(const c of s.cases)recordEvent(s,{action:'receive',caseId:c.id,actor:'system',at:timestamp(c)});
 recordEvent(s,{action:'claim',caseId:s.cases[0].id,actor:'mai',at:'2026-11-01T09:19:00+07:00'});
 recordEvent(s,{action:'start',caseId:s.cases[0].id,actor:'mai',at:'2026-11-01T09:20:00+07:00'});
 recordEvent(s,{action:'view_detail',caseId:s.cases[3].id,actor:'mai',result:'DENIED',code:'ACCESS_DENIED',at:'2026-11-01T09:30:00+07:00'});
 recordEvent(s,{action:'booking',caseId:s.cases[1].id,actor:'mai',result:'FAILED',code:'UPSTREAM_UNAVAILABLE',at:'2026-11-01T09:32:00+07:00'});
}
export const csvCell=v=>'"'+String(v??'').replace(/^[=+@\-\t\r]/,"'$&").replaceAll('"','""')+'"';
export function logCsv(rows){return '\uFEFF'+[['Mã log','Thời điểm','Người thực hiện','Hành động','Đối tượng','Kết quả','Mã tương quan'],...rows.map(e=>[e.id,e.at,ACTORS[e.actor]||e.actor,ACTIONS[e.action]||e.action,e.objectId,RESULT[e.result],e.correlationId])].map(row=>row.map(csvCell).join(',')).join('\r\n');}
