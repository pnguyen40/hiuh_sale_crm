// Synthetic fixtures only. Frame-specific overrides retain their intended scenarios.
import {recordEvent} from './workbench.js';
import {clock} from './operations.js';
const local=at=>new Date(at+7*3600000).toISOString();
const pad=n=>String(n).padStart(2,'0');
const names=['Nguyễn Minh Anh','Trần Hoài Nam','Lê Thị Bích Ngọc','Phạm Quốc Bảo','Võ Mỹ Linh','Đặng Gia Hân','Nguyễn Thị Hoàng Yến Phương','Alex Nguyễn'];
const inquiries=[
 'Tôi muốn đặt lịch khám vào sáng thứ Bảy. Bệnh viện còn khung giờ nào phù hợp không?',
 'Nhờ tư vấn gói khám tổng quát cho hai người lớn, kèm danh sách giấy tờ cần chuẩn bị.',
 'Tôi có bảo hiểm doanh nghiệp. Nhờ hướng dẫn thủ tục bảo lãnh và hồ sơ cần nộp.',
 'Tôi muốn biết cách nhận kết quả khám trên ứng dụng và thời gian có kết quả.',
 'Tôi muốn góp ý về thời gian chờ tại quầy tiếp nhận, nhờ bệnh viện phản hồi.',
 'Could you help me contact customer service? I would prefer a reply in English.'
];
export function seedCases(cases,now=Date.now()) {
 for(const [i,c] of cases.entries()) {
  const at=now-(i>0&&i%9===0?35:i>0&&i%7===0?12:i%5===0?4:0)*86400000-(i+2)*60000;
  const stamp=local(at);c.date=stamp.slice(0,10);c.received=c.date.split('-').reverse().join('/')+' '+stamp.slice(11,16);c.receivedMinute=Number(stamp.slice(11,13))*60+Number(stamp.slice(14,16));c.updatedAt=new Date(at+30000).toISOString();c.age=Math.floor((now-at)/86400000)>0?Math.floor((now-at)/86400000)+' ngày trước':i+2+' phút trước';
  if(i<3||i===30)continue;
  c.topic=c.sourceTopic=c.kind==='booking'?'dat-lich':Object.keys({ 'dat-lich':1,'tu-van-goi':1,'bao-hiem-vien-phi':1,'tra-cuu-ket-qua':1,'gop-y':1,khac:1})[Math.floor(i/3)%6];
  c.message=inquiries[Math.floor(i/3)%6]+(i%11===0?'\n\nTôi đi cùng người nhà và chỉ có thể nghe điện thoại sau 17 giờ. Nếu chưa liên hệ được, vui lòng để lại hướng dẫn chi tiết qua ứng dụng.':'');
  if(c.kind==='booking')c.message='Tôi muốn đăng ký khám, nhờ bệnh viện xác nhận khung giờ và hướng dẫn thủ tục.';
  c.original={name:i%10===0?'':names[i%names.length]+' (mẫu)',phone:i%10===0?'':i%13===0?'12345':'09000'+String(10000+i),email:i%4===0?'':`khach${i}@example.test`};
  if(i>=21){c.owner=['mai','linh','huy'][Math.floor(i/3)%3];c.status=['NEW','IN_PROGRESS','WAITING','RESOLVED','CANCELLED'][i%5];}
  c.purpose=i%8===0?'B2B':i%3===2?'B2C':'UNKNOWN';
  if(c.status==='WAITING'){c.waitOn=i%2?'CUSTOMER':'INTERNAL';c.waitReason=i%2?'Khách hẹn phản hồi sau giờ làm.':'Đợi đơn vị thụ lý xác nhận thông tin.';c.nextStep=i%2?'Gọi lại theo khung giờ khách chọn':'Kiểm tra kết quả từ đơn vị phối hợp';c.followUpAt=local(now+(i%2?-1:1)*3600000).slice(0,16);}
  else {c.followUpAt='';c.nextStep='';c.waitOn=null;}
  c.result=['RESOLVED','CANCELLED'].includes(c.status)?(c.status==='RESOLVED'?'Đã hỗ trợ và thông báo kết quả cho khách.':'Khách không tiếp tục nhu cầu, đã ghi nhận lý do.'):null;
  if(c.kind==='booking'){c.bookingStatus=['PENDING_ARRANGEMENT','CONFIRMED','CANCELLED'][Math.floor(i/3)%3];c.appointmentId=c.bookingStatus==='CONFIRMED'?`APT-MOCK-${pad(i)}`:null;c.bookingRequest={id:`BK-MOCK-${i}`,patient:names[(i+1)%names.length]+' (mẫu)',service:['Khám tổng quát','Khám nội tổng hợp','Khám chuyên khoa'][Math.floor(i/3)%3],date:local(now+86400000*(i%5+1)).slice(0,10)};}
  if(i%8===0)c.crmHandoff={id:`HO-MOCK-${i}`,state:i%16===0?'ACCEPTED':'PENDING',org:'Công ty Minh An (mẫu)',summary:'Tư vấn khám sức khỏe định kỳ cho 80 nhân viên.',ref:i%16===0?`CRM-MOCK-${i}`:null,receiver:i%16===0?'Nhóm kinh doanh doanh nghiệp':null,version:1};
  if(c.owner&&i%4===0){c.care.name=c.original.name||'Khách đã bổ sung tên (mẫu)';c.care.phone='09000'+String(10000+i);c.verified.phone='Đã xác nhận qua trao đổi';c.notes=[{text:'Khách ưu tiên phản hồi qua ứng dụng. Nội dung ghi chú nội bộ, không gửi ra ngoài.',time:stamp.slice(11,16),actor:'Mai Anh'}];}
 }
}
export function seedOperationalData(s) {
 const now=clock(s);let aiIndex=0;
 for(const [i,c] of s.cases.entries())if(c.kind==='ai'){
  const k=aiIndex++;
  if(i!==0){const offsets=[180000,530000,660000,1200000,1510000,2400000,60000,300000];c.session.lastCustomerActivity=now-offsets[k%offsets.length];c.session.connected=k%8!==7;
   const t=c.session.lastCustomerActivity-120000;
   c.transcript.messages=[{id:c.id+'-m1',role:'CUSTOMER',at:t,time:local(t).slice(11,16),text:c.message},{id:c.id+'-m2',role:'AI',at:t+30000,time:local(t+30000).slice(11,16),text:'Tôi đã ghi nhận nhu cầu. Bộ phận CSKH sẽ hỗ trợ thông tin chi tiết.'}];
   const role=k%3===0?'CUSTOMER':k%3===1?'AI':c.owner?'STAFF':'AI';
   c.transcript.messages.push({id:c.id+'-m3',role,at:c.session.lastCustomerActivity,time:local(c.session.lastCustomerActivity).slice(11,16),text:role==='CUSTOMER'?'Cảm ơn, nhờ anh/chị liên hệ lại sau 17 giờ giúp tôi.':role==='STAFF'?'CSKH đã tiếp nhận. Tôi sẽ kiểm tra thông tin và phản hồi qua ứng dụng cho anh/chị.':'Yêu cầu đã được chuyển sang CSKH. Anh/chị có thể bổ sung thông tin tại đây.'});
   c.log=k%10===7?'PARTIAL':k%10===8?'UNAVAILABLE':'FULL';c.aiSummary=null;
  }
 }
 // Default tickets available in every entry, not only the dedicated ticket frames.
 const candidates=s.cases.filter(c=>c.owner);
 for(let i=0;i<25;i++){
  const c=candidates[i%candidates.length],status=['NEW','IN_PROGRESS','WAITING','RESOLVED','CANCELLED'][i%5],at=now-(i+1)*3600000;
  const id='REQ-MOCK-'+String(i+1).padStart(4,'0');
  const t={id,sourceId:c.id,sourceRef:c.sourceRef,sessionId:c.session?.id||null,requestType:['appointment','insurance','records','support','other'][i%5],priority:['HIGH','NORMAL','LOW'][i%3],unit:['booking','finance','planning','cskh'][i%4],dueAt:local(now+(i%4===0?-1:i%4+1)*3600000).slice(0,16),description:['Phối hợp đội đặt hẹn xác nhận khung giờ khách yêu cầu.','Kiểm tra danh mục hồ sơ bảo lãnh trước khi phản hồi khách.','Hướng dẫn thủ tục cấp trích sao theo quy trình bệnh viện.','Khách cần nhận hướng dẫn bằng tiếng Anh qua ứng dụng.','Ghi nhận góp ý về thời gian chờ và phản hồi phương án hỗ trợ.'][i%5]+(i%7===0?'\nKhách đi cùng người nhà; cần gọi sau 17 giờ. Giữ lịch sử trao đổi và liên kết ca nguồn.':''),status,creator:c.owner,requestKey:'seed-v09-'+i,createdAt:at,history:[{at,actor:c.owner,status:'NEW',note:'Tạo phiếu từ yêu cầu của khách (mẫu).'}]};
  if(status!=='NEW')t.history.unshift({at:at+1800000,actor:['mai','linh','huy'][i%3],status,note:status==='RESOLVED'?'Đã phối hợp xử lý, gửi kết quả cho khách.':status==='CANCELLED'?'Khách xin dừng nhu cầu.':'Đã chuyển đơn vị liên quan, theo dõi phản hồi.'});
  s.tickets.push(t);recordEvent(s,{action:'ticket_create',caseId:c.id,objectType:'TICKET',objectId:id,actor:c.owner,at:new Date(at).toISOString()});
 }
 const actions=['contact','wait','resolve','cancel','reopen','category','booking','crm','chat_send','ticket_update','summary_refresh','assign'];
 for(let i=0;i<36;i++){
  const c=candidates[i%candidates.length],before=structuredClone(c),after=structuredClone(c);after.topic=before.topic==='gop-y'?'khac':'gop-y';
  recordEvent(s,{action:actions[i%actions.length],caseId:c.id,objectType:i%12===9?'TICKET':'REQUEST',objectId:i%12===9?s.tickets.find(t=>t.sourceId===c.id)?.id||c.id:c.id,actor:['mai','linh','huy','supervisor','system'][i%5],result:['SUCCESS','SUCCESS','SUCCESS','FAILED','DENIED'][i%5],code:i%5===3?'UPSTREAM_UNAVAILABLE':i%5===4?'ACCESS_DENIED':null,reason:i%3===0,before:i%12===5?before:null,after:i%12===5?after:null,at:new Date(now-i*120000).toISOString()});
 }
}
