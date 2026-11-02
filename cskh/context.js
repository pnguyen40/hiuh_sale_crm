import {careName,carePhone,normalizePhone,needsBooking,hasAppointment} from './workflow.js';
const bodies=[['CUSTOMER','09:06','Xin chào, tôi muốn tìm hiểu các gói khám tổng quát tại bệnh viện.'],['AI','09:06','Chào anh/chị. Tôi có thể hỗ trợ thông tin ban đầu. Anh/chị muốn tìm hiểu nội dung khám hay cần được tư vấn thêm về thủ tục?'],['CUSTOMER','09:07','Tôi cần người tư vấn giúp chọn gói phù hợp và cho biết cần chuẩn bị những gì trước khi đến.'],['AI','09:08','Tôi đã chuyển yêu cầu đến bộ phận chăm sóc khách hàng. Nhân viên sẽ tiếp tục hỗ trợ anh/chị.']];
export const receivedMessages=c=>c.log==='UNAVAILABLE'?[]:c.transcript.messages.slice(0,c.log==='PARTIAL'?2:undefined);
export function buildSummary(c){
 const messages=receivedMessages(c);const ids=new Set(messages.filter(m=>bodies.some(([role,time,text])=>m.role===role&&m.text===text)).map(m=>m.id));const ref=i=>c.transcript.messages[i].id;
 const facts=[{label:'Nhu cầu',text:'Khách muốn tìm hiểu gói khám tổng quát.',refs:[ref(0)]}];
 if(ids.has(ref(2)))facts.push({label:'Cần CSKH hỗ trợ',text:'Tư vấn chọn gói phù hợp và thông tin cần chuẩn bị trước khi đến.',refs:[ref(2)]});
 return {state:'READY',sourceSessionId:c.transcript.id,revision:c.transcript.version,coverage:c.log,generatedAt:'01/11/2026 · 09:45',facts:facts.filter(f=>f.refs.every(id=>ids.has(id))),gaps:messages.some(m=>!bodies.some(([role,time,text])=>m.role===role&&m.text===text))?'Có nội dung mới cần đọc trực tiếp tại nguồn; bản mẫu chưa tóm tắt phần này.':ids.has(ref(2))?'Phần hội thoại đã nhận chưa có tên, số liên hệ hoặc ngày khám mong muốn.':'Chỉ tóm tắt phần đã nhận; chưa đủ nội dung để kết luận yêu cầu tiếp theo.',model:'Dữ liệu minh họa'};
}
export const summaryState=c=>c.log==='UNAVAILABLE'?'UNAVAILABLE':c.aiSummary?.state==='READY'&&(c.aiSummary.sourceSessionId!==c.transcript.id||c.aiSummary.revision!==c.transcript.version||c.aiSummary.coverage!==c.log)?'STALE':c.aiSummary?.state||'EMPTY';
export function initContext(s){
 for(const c of s.cases){c.sourceRef=(c.kind==='ai'?'CHAT-':c.kind==='booking'?'WEB-BOOK-':'WEB-MSG-')+c.id;c.transcript=c.kind==='ai'?{id:c.sourceRef,version:1,state:'HANDED_OFF',messages:bodies.map(([role,time,text],i)=>({id:c.id+'-m'+(i+1),role,time,text}))}:null;if(c.kind==='ai')c.aiSummary=buildSummary(c);}
 const c=s.cases[0];
 if(['M-34','M-35','M-36','M-37','M-38'].includes(s.frame)){s.screen='detail';s.caseId=c.id;}
 if(s.frame==='M-34')c.transcript.version=2;
 if(s.frame==='M-35')c.aiSummary.state='ERROR';
 if(s.frame==='M-36')c.aiSummary=null;
 if(s.frame==='M-37')c.log='PARTIAL',c.aiSummary=buildSummary(c);
 if(s.frame==='M-38')c.log='UNAVAILABLE';
 if(s.frame==='M-39'){s.view='mine';s.filters.source=['ai'];}
}
export function completionAdvice(c){
 if(['RESOLVED','CANCELLED'].includes(c.status))return {title:'Yêu cầu đã kết thúc',text:c.result||'Kết quả đã được ghi nhận.'};
 if(c.crmHandoff||c.purpose==='B2B')return c.crmHandoff?.state==='ACCEPTED'&&c.crmHandoff.ref&&c.crmHandoff.receiver?{title:'Đã có xác nhận từ CRM',text:'Có thể ghi kết quả bàn giao cùng nội dung đã hỗ trợ khách.'}:{title:'Còn chờ CRM tiếp nhận',text:'Chỉ hoàn tất theo kết quả bàn giao khi CRM xác nhận, có mã Cơ hội khám đoàn và bên nhận. Khách dừng nhu cầu: ghi kết quả và lý do riêng.'};
 if(needsBooking(c))return hasAppointment(c)?{title:'Đã có lịch xác nhận',text:'Trao đổi với khách và ghi kết quả trước khi hoàn tất yêu cầu.'}:{title:'Còn chờ kết quả lịch',text:'Chỉ hoàn tất theo kết quả có lịch khi nguồn đã xác nhận kèm mã lịch. Khách chưa tiếp tục: ghi kết quả và lý do riêng.'};
 return {title:'Hoàn tất theo kết quả hỗ trợ',text:'Ghi nội dung đã tư vấn. Nếu phát sinh nhu cầu đặt hẹn, tiếp tục theo dõi đến kết quả phù hợp.'};
}
