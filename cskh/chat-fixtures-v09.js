import {demoSession,validateContact} from './chat-model.js';
import {loadStore,saveStore} from './chat-store.js';
// Separate demo store for v0.9; never writes to the v0.8 key.
export function seedChatFixtures(now=Date.now()){
 const db=loadStore();if(db.fixturesVersion==='0.9.1')return;
 db.sessions=db.sessions.filter(s=>!s.id.startsWith('AI-DEMO-V09'));
 const names=['Lê Minh Anh (mẫu)','Alex Nguyễn (mẫu)','Trần Hoài Nam (mẫu)','Nguyễn Thị Hoàng Yến Phương (mẫu)','', 'Võ Mỹ Linh (mẫu)'];
 const topics=['Tôi muốn đặt lịch khám vào sáng thứ Bảy.','Could you help me with the appointment procedure?','Nhờ hướng dẫn hồ sơ bảo lãnh viện phí.','Tôi đi cùng người nhà, vui lòng gọi lại sau 17 giờ để xác nhận thông tin.','Tôi muốn biết cách xem kết quả khám trên ứng dụng.','Tôi cần góp ý về thời gian chờ tại quầy tiếp nhận.'];
 for(let i=0;i<14;i++){
  const kind=['waiting','human','invalid','partial','expired','offline','waiting'][i%7];
  const s=demoSession(kind,i%2?'APP':'WEB',now-90000);
  s.id='AI-DEMO-V09-'+String(i+1).padStart(3,'0');s.caseId='CS-AI-MOCK-'+String(i+1).padStart(3,'0');
  s.contact={name:names[i%6],phone:i%7===2?'12345':i%7===4?'':'0900000'+String(100+i)};s.warnings=validateContact(s.contact);
  s.messages.find(m=>m.role==='CUSTOMER').text=topics[i%6];
  if(i%6===1){s.locale='en';s.localeSource='manual';s.localeMode='en';s.messages.forEach(m=>m.locale='en');}
  if(s.phase==='HUMAN_ACTIVE'){const last=s.messages.at(-1);last.text=i%6===1?'Hello, I have received your request. Our customer service team will assist you.':'CSKH đã nhận được nội dung của anh/chị. Tôi sẽ kiểm tra và phản hồi thông tin.';s.notes=[{id:'note-'+i,actor:'Mai Anh',at:now-30000,text:'Khách ưu tiên trao đổi qua ứng dụng; ghi chú nội bộ (mẫu).'}];}
  if(kind==='expired'){s.expiresAt=now-(i<7?4:19)*60000;const event=s.events.find(e=>e.type==='SESSION_EXPIRED');if(event)event.at=s.expiresAt;}
  if(i===10)s.coverage='UNAVAILABLE';
  if(i===12){s.phase='REQUESTED';s.expiresAt=now+90000;s.connected=true;}
  s.handoff.sourceSessionId=s.id;
  db.sessions.push(s);
 }
 db.fixturesVersion='0.9.1';saveStore(db);
}
