import {waitDue} from './follow-up.js';
// Business behaviour of the local prototype. No network delivery or real booking.
export const normalizePhone = (value = "") => {
  const p = value.replace(/[\s.()\-]/g, "");
  const local = p.replace(/^\+?84/, "0");
  return /^0\d{9,10}$/.test(local) ? local : "";
};
export const carePhone = c => c.care.phone ?? c.original.phone;
export const careName = c => c.care.name ?? (c.kind === "booking" ? "" : c.original.name);
export const needsBooking = c => c.purpose !== "B2B" && (!!c.bookingRequest || c.kind === "booking" || c.topic === "dat-lich");
export const hasAppointment = c => c.bookingStatus === "CONFIRMED" && !!c.appointmentId;
export const followUpText = c => c.followUpAt ? c.followUpAt.slice(0,16).replace("T", " · ") + (c.followUpAt.length === 10 ? " · Chưa chọn giờ" : "") : "Chưa hẹn liên hệ lại";
const demand = (ok, message) => { if (!ok) throw new Error(message); };
const text = v => String(v ?? "").trim();
function followUp(s, data) {
  const value = text(data.followUpAt);
  demand(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) && Date.parse(value + "+07:00") > Date.parse(s.now), "Chọn thời điểm liên hệ lại sau thời điểm hiện tại.");
  return value;
}
export function applyCareAction(s, c, action, data) {
  if (action === "contact") {
    const name=text(data.name), phone=text(data.phone), email=text(data.email);
    demand(name.length <= 100, "Tên tối đa 100 ký tự.");
    demand(!phone || normalizePhone(phone), "Số điện thoại chưa đúng định dạng.");
    demand(!email || (email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)), "Email chưa đúng định dạng.");
    demand(name || phone || email, "Bổ sung ít nhất một thông tin liên hệ.");
    const old={name:careName(c), phone:carePhone(c), email:c.care.email ?? c.original.email};
    const next={name,phone,email};
    const changed=Object.keys(next).filter(k=>text(old[k]) !== next[k]);
    demand(changed.length, "Thông tin chưa thay đổi.");
    demand(!changed.some(k=>text(old[k])) || text(data.reason), "Ghi lý do khi sửa hoặc xóa thông tin đã có.");
    Object.assign(c.care,next);
    // A changed phone makes the previous identity binding stale; never silently relink.
    if (changed.includes("phone")) c.contactId=null;
  }
  if (action === "wait") {
    demand(c.status === "IN_PROGRESS", "Chỉ yêu cầu đang xử lý được chuyển sang chờ.");
    const content=text(data.waitContent);
    demand(["CUSTOMER","INTERNAL"].includes(data.waitOn), "Chọn bên đang chờ phản hồi.");
    demand(content && content.length<=4000, "Nhập nội dung chờ / việc cần làm, tối đa 4.000 ký tự.");
    const due=waitDue(data);
    Object.assign(c,{status:"WAITING",waitOn:data.waitOn,waitContent:content,waitReason:"",followUpAt:due,nextStep:content});
  }
  if (action === "booking") {
    demand(c.status === "IN_PROGRESS", "Bắt đầu hoặc tiếp tục xử lý trước khi hỗ trợ đặt hẹn.");
    demand(!c.bookingRequest && !c.crmHandoff && c.purpose !== "B2B", "Yêu cầu đã có nhánh xử lý. Theo dõi nhánh hiện tại để tránh gửi trùng.");
    demand(careName(c) && normalizePhone(carePhone(c)), "Bổ sung tên người liên hệ và số điện thoại trước khi gửi yêu cầu đặt hẹn.");
    demand(["SELF","REPRESENTATIVE"].includes(data.relationship), "Chọn đặt cho bản thân hay người khác.");
    const patient=data.relationship === "SELF" ? careName(c) : text(data.patient);
    demand(patient && patient.length <= 100 && text(data.service) && text(data.service).length <= 200, "Nhập tên người đi khám và nhu cầu khám.");
    demand(/^\d{4}-\d{2}-\d{2}$/.test(data.date||"") && data.date >= s.now.slice(0,10), "Chọn ngày khám từ hôm nay trở đi.");
    const due=followUp(s,data);
    Object.assign(c,{purpose:"B2C",relationship:data.relationship,bookingRequest:{id:"BK-MOCK-"+c.id,patient,service:text(data.service),date:data.date},bookingStatus:"PENDING_ARRANGEMENT",appointmentId:null,followUpAt:due,nextStep:"Theo dõi kết quả sắp lịch",status:"WAITING",waitOn:"INTERNAL",waitReason:"Chờ bộ phận đặt lịch sắp xếp"});
  }
  if (action === "crm") {
    demand(c.status === "IN_PROGRESS", "Bắt đầu hoặc tiếp tục xử lý trước khi chuyển CRM.");
    demand(!c.crmHandoff && !c.bookingRequest, "Đã có yêu cầu chuyển CRM hoặc đặt lịch. Không tạo thêm bản trùng.");
    demand(careName(c) && normalizePhone(carePhone(c)), "Bổ sung tên người liên hệ và số điện thoại trước khi chuyển CRM.");
    demand(text(data.org) && text(data.org).length <= 200 && text(data.summary) && text(data.summary).length <= 4000, "Nhập tên doanh nghiệp và nhu cầu cần bàn giao.");
    const due=followUp(s,data);
    Object.assign(c,{purpose:"B2B",crmHandoff:{id:"HO-MOCK-"+c.id,state:"PENDING",org:text(data.org),summary:text(data.summary),ref:null,receiver:null,version:1},followUpAt:due,nextStep:"Kiểm tra CRM tiếp nhận nhu cầu doanh nghiệp",status:"WAITING",waitOn:"INTERNAL",waitReason:"Chờ nhóm kinh doanh doanh nghiệp tiếp nhận"});
  }
  if (action === "resolve") {
    demand(["IN_PROGRESS","WAITING"].includes(c.status), "Yêu cầu phải đang xử lý hoặc chờ phản hồi.");
    demand(["support","appointment","declined","handoff"].includes(data.outcome) && text(data.reason), "Chọn kết quả và ghi nội dung hỗ trợ.");
    if(data.outcome === "support") demand(!needsBooking(c) && !c.crmHandoff && c.purpose !== "B2B", "Nhu cầu đặt lịch hoặc B2B còn việc theo dõi. Chọn kết quả đúng hoặc tiếp tục chăm sóc.");
    if(data.outcome === "appointment") demand(hasAppointment(c), "Chưa có lịch đã xác nhận từ nguồn.");
    if(data.outcome === "handoff") demand(c.crmHandoff?.state === "ACCEPTED" && c.crmHandoff.ref && c.crmHandoff.receiver, "CRM chưa xác nhận tiếp nhận kèm mã cơ hội khám đoàn và bên nhận.");
    Object.assign(c,{status:"RESOLVED",result:text(data.reason),outcome:data.outcome});
  }
}
