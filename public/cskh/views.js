import {conversationList,livePanel,liveMessages,ticketLinks,composer} from './operations-ui.js';
import {summaryCard,privateNotes,noteComposer,caseProgress} from "./context-ui.js";
import {receivedMessages} from "./context.js";
import {caseList} from "./workbench-ui.js";
import { normalizePhone, careName, carePhone, needsBooking, hasAppointment, followUpText } from "./workflow.js";
import {
  TOPICS,
  STATUSES,
  PEOPLE,
  CONTACTS,
  current,
  terminal,
  canRead,
  canEdit,
  visibleCases,
} from "./model.js";
import { icons } from "./icons.js";
export const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const icon = (name, cls = "") =>
  `<svg class="icon ${cls}" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${(
    icons[name] || icons.FileText
  )
    .map(
      ([tag, attrs]) =>
        `<${tag} ${Object.entries(attrs)
          .filter(([k]) => k !== "key")
          .map(([k, v]) => `${k}="${esc(v)}"`)
          .join(" ")}/>`,
    )
    .join("")}</svg>`;
export const btn = (label, action, opts = {}) =>
  `<button type="${opts.type || "button"}" class="button ${opts.tone || ""} ${opts.cls || ""}" ${opts.disabled ? "disabled" : ""} ${action ? `data-action="${action}"` : ""} ${opts.id ? `data-id="${esc(opts.id)}"` : ""} ${opts.extra || ""}>${opts.icon ? icon(opts.icon) : ""}${label}</button>`;
export const badge = (label, tone = "") =>
  `<span class="badge ${tone}">${esc(label)}</span>`;
export const status = (c) =>
  badge(STATUSES[c.status][0], STATUSES[c.status][1]);
export const person = (id) => PEOPLE.find((p) => p.id === id);
export const avatar = (name, cls = "") =>
  `<span class="avatar ${cls}">${esc(name.toUpperCase())}</span>`;
export const source = (c) =>
  `<span class="source ${c.kind}"><span class="source-icon">${icon(c.kind === "ai" ? "Bot" : c.kind === "booking" ? "CalendarDays" : "MessageSquare")}</span>${c.kind === "ai" ? `AI ${c.channel === "WEB" ? "Website" : "App"}` : c.kind === "booking" ? "Đặt khám Website" : "Liên hệ Website"}</span>`;
export const field = (label, name, value = "", options = {}) =>
  `<label class="field ${options.cls || ""}" for="${options.id || name}"><span class="label">${label}${options.required ? ' <span aria-hidden="true">*</span>' : ""}</span>${options.textarea ? `<textarea id="${options.id || name}" name="${name}" ${options.required ? "required" : ""} maxlength="4000" placeholder="${esc(options.placeholder || "")}">${esc(value)}</textarea>` : options.options ? `<select id="${options.id || name}" name="${name}" ${options.disabled ? "disabled" : ""} ${options.required ? "required" : ""}>${options.options.map(([v, t]) => `<option value="${esc(v)}" ${v === value ? "selected" : ""}>${esc(t)}</option>`).join("")}</select>` : `<input id="${options.id || name}" name="${name}" type="${options.type || "text"}" ${["followDay","followMonth","followYear"].includes(name)?'inputmode="numeric" autocomplete="off"':""} value="${esc(value)}" placeholder="${esc(options.placeholder || "")}" ${options.required ? "required" : ""} ${options.disabled ? "disabled" : ""} ${options.maxlength ? `maxlength="${options.maxlength}"` : ""}>`}</label>`;
export const banner = (title, body, tone = "") =>
  `<div class="banner ${tone}">${icon(tone === "warning" ? "TriangleAlert" : tone === "success" ? "CircleCheck" : tone === "error" ? "CircleAlert" : "ShieldCheck")}<div><strong>${esc(title)}</strong>${body ? `<div>${esc(body)}</div>` : ""}</div></div>`;
export function shell(s, body) {
  const user=s.role === "SUPERVISOR" ? "Trưởng nhóm CSKH" : "Mai Anh";
  const role=s.role === "SUPERVISOR" ? "Trưởng nhóm" : "Nhân viên CSKH";
  const initials=s.role === "SUPERVISOR" ? "TN" : "MA";
  return `<div id="screen" data-screen="${s.screen === 'list' ? 'C-01' : s.screen === 'log' ? 'C-03' : s.screen==='tickets'?'C-04':'C-02'}" class="${s.navOpen?'nav-open':''}"><button class="nav-backdrop" data-action="nav-close" aria-label="Đóng điều hướng" tabindex="-1"></button><aside id="portal-nav" aria-label="Điều hướng Operation Portal" class="crm-2 sidebar">
<div class="crm-3">
<span class="crm-4">HIU Hospital</span>${btn("", "nav-close", {icon:"X",cls:"ghost icon-only mobile-close-nav",extra:'aria-label="Đóng điều hướng"'})}
<span class="crm-5">Vận hành nội bộ</span>
</div>
<nav class="crm-6">
<span class="crm-7">VẬN HÀNH</span>
<a href="#" data-portal-reference="true" class="crm-8"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle ms crm-9" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle></svg><span class="crm-10">Hàng đợi ghi</span></a>
<a href="#" data-portal-reference="true" class="crm-8"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search ms crm-9" aria-hidden="true"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg><span class="crm-10">Hàng đợi đọc</span></a>
<span class="crm-7" style="margin-top:6px">THU NGÂN &amp; LÂM SÀNG</span>
<a href="#" data-portal-reference="true" class="crm-8"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle ms crm-9" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle></svg><span class="crm-10">Xác nhận thanh toán</span></a>
<a href="#" data-portal-reference="true" class="crm-8"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle ms crm-9" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle></svg><span class="crm-10">Sinh hiệu</span></a>
<a href="#" data-portal-reference="true" class="crm-8"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle ms crm-9" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle></svg><span class="crm-10">Chi phí lượt khám</span></a>
<span class="crm-7" style="margin-top:6px">NỘI DUNG &amp; KHÁCH HÀNG</span>
<a href="#" data-portal-reference="true" class="crm-8"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text ms crm-9" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"></path><path d="M14 2v5a1 1 0 0 0 1 1h5"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path></svg><span class="crm-10">Quản lý nội dung</span></a>
<a href="#" data-portal-reference="true" class="crm-8"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-stethoscope ms crm-9" aria-hidden="true"><path d="M11 2v2"></path><path d="M5 2v2"></path><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"></path><path d="M8 15a6 6 0 0 0 12 0v-3"></path><circle cx="20" cy="10" r="2"></circle></svg><span class="crm-10">Quản lý bác sĩ</span></a>
<div class="crm-17 portal-sale-module" data-module="sale">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-check ms crm-18" aria-hidden="true"><path d="m16 11 2 2 4-4"></path><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg><span class="crm-19">Sale CRM</span>
</div>
<div class="crm-21 portal-sale-children">
<!-- -->
<a href="/" aria-current="false" class="crm-22"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard ms crm-23" aria-hidden="true"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg><span class="crm-24">Dashboard Giám sát</span></a>
<!-- -->
<a href="/#leads" aria-current="false" class="crm-22"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users ms crm-23" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle></svg><span class="crm-24">Hồ sơ tư vấn (B2C)</span><span class="crm-25">12</span></a>
<!-- -->
<a href="/#b2b" aria-current="false" class="crm-22"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2 lucide-building-2 ms crm-23" aria-hidden="true"><path d="M10 12h4"></path><path d="M10 8h4"></path><path d="M14 21v-3a2 2 0 0 0-4 0v3"></path><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path></svg><span class="crm-24">Cơ hội khám đoàn (B2B)</span><span class="crm-25">6</span></a>
<!-- -->
<a href="/#contacts" aria-current="false" class="crm-22"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-contact ms crm-23" aria-hidden="true"><path d="M16 2v2"></path><path d="M7 22v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"></path><path d="M8 2v2"></path><circle cx="12" cy="11" r="3"></circle><rect x="3" y="4" width="18" height="18" rx="2"></rect></svg><span class="crm-24">Danh bạ Contact</span></a>
<!-- -->
<a href="/#audit" aria-current="false" class="crm-22"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check ms crm-23" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg><span class="crm-24">Nhật ký Kiểm tra</span></a>
<!-- -->
</div>
<div class="crm-17 portal-cskh-module" data-module="cskh">${icon("Headset")}<span>CSKH</span></div><div class="crm-21 portal-cskh-children" aria-label="Menu CSKH"><button class="crm-22" aria-current="${!['log','tickets'].includes(s.screen)?'page':'false'}" data-action="list">${icon("Inbox")}<span class="crm-24">Tiếp nhận &amp; Xử lý</span></button><button class="crm-22" aria-current="${s.screen==='tickets'?'page':'false'}" data-action="tickets">${icon("FileText")}<span class="crm-24">Phiếu yêu cầu</span></button><button class="crm-22" aria-current="${s.screen==='log'?'page':'false'}" data-action="log">${icon("History")}<span class="crm-24">CSKH log</span></button><a href="review-ai.html" class="crm-22 portal-nav-review-ai" style="text-decoration:none">${icon("Bot")}<span class="crm-24">Bộ review AI &amp; Chat</span><span class="crm-25" style="background:#e0e7ff;color:#3730a3;font-size:10px;padding:2px 6px;border-radius:999px;font-weight:600">v0.9</span></a><button class="crm-22" data-future="F-NAV-01" disabled>${icon("Bell")}<span class="crm-24">Thông báo</span><span class="future-label">Sắp triển khai</span></button><button class="crm-22" data-future="F-NAV-02" disabled>${icon("FileText")}<span class="crm-24">Mẫu thông báo</span><span class="future-label">Sắp triển khai</span></button></div><span class="crm-7" style="margin-top:6px">HỆ THỐNG</span>
<a href="#" data-portal-reference="true" class="crm-8"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle ms crm-9" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle></svg><span class="crm-10">Quản trị hệ thống</span></a>
</nav>
<div class="crm-user-footer">
<div class="crm-user-avatar">${initials}</div>
<div class="crm-user-meta">
<span class="crm-user-name">${user}</span>
<span class="crm-user-role">${role}</span>
</div>
</div>
</aside><header class="header portal-header">${btn("", "nav-toggle", {icon:"Menu",cls:"ghost icon-only mobile-menu-button",extra:`aria-label="Mở điều hướng" aria-expanded="${!!s.navOpen}" aria-controls="portal-nav"`})}<nav class="portal-breadcrumb" aria-label="Breadcrumb"><span>CSKH</span>${icon("ChevronRight")}<strong>${s.screen==='list'?'Tiếp nhận &amp; Xử lý':s.screen==='log'?'CSKH log':s.screen==='tickets'?'Phiếu yêu cầu':'Chi tiết yêu cầu'}</strong></nav><div class="portal-account" style="display:flex;align-items:center;gap:12px"><a href="review-ai.html" class="button primary review-ai-header-btn" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:#0052D7;color:#ffffff;font-size:12px;font-weight:600;border-radius:8px;box-shadow:0 1px 3px rgba(0,82,215,0.3);white-space:nowrap;line-height:20px">${icon("Bot")}<span>Mở Bộ Review AI</span></a><a class="prototype-label" href="review-ai.html">Prototype v0.9.0 · AI chat &amp; log</a><span>${role}</span><strong>${user}</strong></div></header>${body}</div>`;
}
export const listView = caseList;

function identity(s, c) {
  const name=careName(c), phone=carePhone(c), editable=canEdit(s,c);
  const number=normalizePhone(phone);
  const hist=s.cases.filter(x=>x.id!==c.id && canRead(s,x) && ((number && normalizePhone(carePhone(x))===number) || (c.contactId && x.contactId===c.contactId))).sort((a,b)=>b.updated-a.updated);
  const contact=CONTACTS.find(x=>x.id===c.contactId);
  return `<section class="panel detail-column" data-geometry="identity"><div class="identity-header">${avatar(name ? name.split(" ").slice(-2).map(x=>x[0]).join("") : "?", "big")}<h2 class="identity-name">${esc(name || "Khách hàng mới")}</h2><div class="identity-sub">Người liên hệ</div><div class="contact-line">${icon("Phone")}<span>${esc(phone || "Chưa có số liên hệ")}</span>${phone ? btn("", "copy-phone", {icon:"Copy",cls:"ghost icon-only",extra:'aria-label="Sao chép số liên hệ"'}) : ""}</div>${(c.care.email ?? c.original.email) ? `<p class="help">${esc(c.care.email ?? c.original.email)}</p>` : ""}${editable && name && phone ? btn("Sửa thông tin liên hệ", "overlay", {id:"D-02",icon:"NotebookPen",cls:"full"}) : ""}</div>
  <div class="identity-section"><h2>Lịch sử liên hệ</h2>${hist.length ? `<p class="help">Các yêu cầu cùng số liên hệ hoặc đã gắn cùng người trong danh bạ. Số dùng chung có thể là người khác.</p>${hist.slice(0,s.showHistory?99:3).map(x=>`<div class="recent-care"><button class="link-button" data-action="open" data-id="${x.id}">${esc((x.care.name ?? x.original.name) || "Chưa có tên")} · ${x.id}</button><p>${esc(TOPICS[x.topic])}</p><span class="help">${esc(x.received)} · ${STATUSES[x.status][0]}</span></div>`).join("")}${hist.length>3 ? btn("Xem thêm", "history-more", {cls:"ghost"}) : ""}` : `<p class="help">${number ? "Chưa có lần liên hệ trước trong phạm vi bạn được xem." : "Bổ sung số điện thoại để tìm các lần liên hệ trước."}</p>`}</div>
  ${c.bookingRequest ? `<div class="identity-section"><h2>Người đi khám</h2><p>${esc(c.bookingRequest.patient)}</p><p class="help">${c.relationship === "REPRESENTATIVE" ? "Đặt cho người khác" : "Theo thông tin yêu cầu đặt khám"}</p></div>` : ""}
  <div class="identity-section"><details><summary>Danh bạ Contact (tùy chọn)</summary><p class="help">${contact ? "Đã chọn: " + esc(contact.name) : "Dùng khi cần nhận diện khách đã có trong danh bạ. Khách mới có thể tiếp tục ngay."}</p>${editable ? btn("Tìm trong Danh bạ Contact", "overlay", {id:"D-01",cls:"ghost",icon:"Search"}) : ""}</details></div>
  ${ticketLinks(s,c)}${c.kind==='ai'?care(s,c).replace('class="panel detail-column" data-geometry="care"','class="identity-care"'):""}<div class="identity-section"><details class="original"><summary>Khai báo ban đầu</summary><p>${esc(c.original.name || "Chưa có tên")}</p><p>${esc(c.original.phone || "Chưa có số")}</p><p class="help">Giữ nguyên thông tin nhận từ nguồn.</p></details></div></section>`;
}
const pair = (label, value) => `<div><span class="label">${esc(label)}</span><div class="data-value">${esc(value)}</div></div>`;
function nextStep(s,c) {
  if (terminal(c)) return "";
  let heading="Hỗ trợ nhu cầu của khách", body="Trao đổi để làm rõ nhu cầu, sau đó hỗ trợ đặt hẹn hoặc chuyển nhu cầu doanh nghiệp.", actions="";
  if(c.crmHandoff) {
    const h=c.crmHandoff, accepted=h.state === "ACCEPTED";
    heading=accepted?"CRM đã nhận vào Cơ hội khám đoàn":h.state === "REJECTED" ? "CRM chưa tiếp nhận — cần xử lý tiếp" : "Chờ CRM tiếp nhận";
    body=`${h.org} · ${h.summary}`;
    actions=`<p class="help">${accepted ? esc(h.ref)+" · "+esc(h.receiver) : "Nhóm kinh doanh doanh nghiệp · CSKH tiếp tục theo dõi"}</p>`;
  } else if(c.bookingRequest) {
    heading=hasAppointment(c)?"Khách đã có lịch khám":({CANCELLED:"Lịch đã hủy từ nguồn",REJECTED:"Nguồn chưa nhận nhu cầu lịch",UNKNOWN:"Chưa xác định được trạng thái lịch"}[c.bookingStatus] || "Đang chờ sắp lịch");
    body=`${c.bookingRequest.patient} · ${c.bookingRequest.service} · Ngày mong muốn ${c.bookingRequest.date}`;
    actions=`<p class="help">${hasAppointment(c) ? "Mã lịch: "+esc(c.appointmentId) : "Mã yêu cầu: "+esc(c.bookingRequest.id)+" · Chưa có lịch xác nhận"}</p>`;
  } else if(!careName(c) || !normalizePhone(carePhone(c))) {
    heading="Bổ sung cách liên hệ với khách";
    body="Cần tên và số liên hệ để tiếp tục hỗ trợ. Nếu nguồn chưa cung cấp, ghi việc cần bổ sung và hẹn kiểm tra lại.";
    actions=btn("Bổ sung thông tin liên hệ", "overlay", {id:"D-02",tone:"primary",icon:"NotebookPen"});
  } else if(c.status === "IN_PROGRESS") {
    actions=c.purpose === "B2B" ? btn("Chuyển nhu cầu doanh nghiệp sang CRM", "overlay", {id:"D-10",tone:"primary",icon:"Building2"}) : btn("Đặt hẹn qua CSKH", "overlay", {id:"D-09",tone:"primary",icon:"CalendarDays"})+btn("Nhu cầu doanh nghiệp → CRM", "overlay", {id:"D-10",icon:"Building2"});
  } else body="Bắt đầu hoặc tiếp tục xử lý để hỗ trợ khách đặt hẹn hay chuyển nhu cầu doanh nghiệp.";
  return `<div class="next-step"><h2>${heading}</h2><p>${esc(body)}</p><div class="action-row">${actions}</div>${c.followUpAt ? `<p class="follow-up">${icon("Clock")} ${esc(followUpText(c))} · ${esc(c.nextStep)}</p>` : ""}</div>`;
}
function sourceContent(c) {
  const header = `<div class="source-heading"><h2>${c.kind === "ai" ? "Hội thoại được chuyển giao" : c.kind === "booking" ? "Yêu cầu đặt khám" : "Lời nhắn từ Website"}</h2>${badge(c.kind === "ai" ? { FULL: "Hội thoại đầy đủ", PARTIAL: "Chưa đầy đủ", UNAVAILABLE: "Chưa tải được" }[c.log] : "Nội dung gốc", c.log === "PARTIAL" ? "warning" : "")}</div>`;
  if (c.kind === "ai") {
    const messages=receivedMessages(c);
    return header + `<details class="source-reference"><summary>Thông tin nguồn · ${esc(c.sourceRef)}</summary><div class="data-grid">${pair("Kênh hội thoại",c.channel==='WEB'?'AI Website':'AI App')}${pair("Thời điểm bàn giao",c.received)}${pair("Tham chiếu phiên",c.transcript.id)}${pair("Trạng thái phiên","Đã chuyển giao cho CSKH")}</div></details>` +
      (c.log==='PARTIAL'?banner('Hội thoại chưa đầy đủ','Chỉ hiển thị phần nguồn đã cung cấp. Không suy ra nội dung còn thiếu.','warning'):'') +
      (c.log==='UNAVAILABLE'?`<div class="empty-state" style="min-height:200px"><h2>Chưa tải được hội thoại</h2><p>Bạn vẫn có thể thực hiện các thao tác chăm sóc hợp lệ.</p>${btn('Thử tải lại','retry-chat',{icon:'RefreshCw'})}</div>`:
      `<div class="chat-date">${esc(c.date.split('-').reverse().join('/'))}</div>${messages.map(m=>`<article class="chat-message ${m.role==='AI'?'ai':''}" data-message-id="${esc(m.id)}" tabindex="-1">${avatar(m.role==='AI'?'AI':m.role==='STAFF'?'CS':'KH',m.role==='AI'?'':'grey')}<div class="bubble-wrap"><div class="chat-meta"><span>${m.role==='AI'?'Trợ lý AI':m.role==='STAFF'?'CSKH':'Khách hàng'}</span><time>${esc(m.time)}</time></div><div class="chat-bubble">${esc(m.text)}</div></div></article>`).join('')}`) +
      `<div class="handoff-event">${icon('ArrowRight')} Hệ thống · 09:08 · Đã tiếp nhận yêu cầu từ phiên AI</div><div class="readonly-note">${icon('LockKeyhole')}Hội thoại gốc chỉ đọc. Ghi chú nội bộ được lưu riêng bên dưới.</div>`;
  }
  if (c.kind === "contact")
    return (
      header +
      `<div class="source-info"><div class="data-grid">${pair("Chủ đề khách chọn", TOPICS[c.sourceTopic])}${pair("Thời điểm gửi", c.received)}${pair("Tên khai báo", c.original.name)}${pair("Số liên hệ", c.original.phone)}</div></div><span class="section-label">Nội dung lời nhắn</span><div class="message-card">${c.message
        .split("\n\n")
        .map((p) => `<p>${esc(p)}</p>`)
        .join(
          "",
        )}</div>${banner("Đây là lời nhắn liên hệ", "Tiếp tục hỗ trợ theo nhu cầu của khách ở phần phía trên.")}<div class="message-caption">${icon("ShieldCheck")}Đã nhận bằng chứng đồng ý theo lượt gửi từ nguồn.</div><div class="readonly-note">${icon("LockKeyhole")}Nội dung và thông tin khai báo ban đầu được giữ nguyên.</div>`
    );
  const confirmed = c.bookingStatus === "CONFIRMED" && c.appointmentId;
  const sourceLabel = {CANCELLED:"Lịch đã hủy từ nguồn",REJECTED:"Yêu cầu lịch bị từ chối",UNKNOWN:"Chưa rõ trạng thái lịch"}[c.bookingStatus] || "Chờ bệnh viện sắp xếp";
  return (
    header +
    `<div class="booking-status ${confirmed ? "confirmed" : ""}"><div class="status-hero">${icon(confirmed ? "CalendarDays" : "Clock")}</div><h3>${confirmed ? "Lịch đã xác nhận từ nguồn" : sourceLabel}</h3><p>${confirmed ? "Thông tin lịch được cập nhật từ hệ thống nguồn." : "Tiếp tục theo dõi kết quả và trao đổi với khách theo trạng thái hiện tại."}</p><div style="margin-top:16px">${badge(confirmed ? "Lịch đã xác nhận" : sourceLabel, confirmed ? "success" : "warning")}</div></div><div class="data-grid">${pair("Mã yêu cầu đặt khám", c.bookingRequest?.id || "Chưa có")}${pair("Mã lịch xác nhận", confirmed ? c.appointmentId : "Chưa có")}${pair("Tên trên form bệnh nhân", c.original.name)}${pair("Số liên hệ khai báo", c.original.phone)}${pair("Ngày khám mong muốn", "03/11/2026")}${pair("Chuyên khoa", confirmed ? "Nội tổng quát" : "Chưa được cung cấp")}${pair("Bác sĩ", confirmed ? "Bác sĩ mẫu Minh" : "Chưa sắp xếp")}${pair("Cập nhật từ nguồn", confirmed ? "01/11/2026 · 09:40" : "01/11/2026 · 09:08")}</div><div class="divider"></div>${banner("Tiến độ chăm sóc được theo dõi riêng", "Trạng thái lịch từ nguồn không tự hoàn tất hoặc hủy yêu cầu hỗ trợ.")}<div class="readonly-note">${icon("LockKeyhole")}Thông tin lịch chỉ đọc. CSKH phối hợp xử lý, không sửa hoặc hủy lịch tại đây.</div>`
  );
}
function care(s, c) {
  const t = terminal(c),
    p = s.role === "SUPERVISOR",
    actions =
      c.status === "NEW"
        ? btn("Bắt đầu xử lý", "start", {
            icon: "ArrowRight",
            tone: "primary",
            cls: "full",
          })
        : c.status === "IN_PROGRESS"
          ? btn("Chờ phản hồi", "overlay", { id: "D-05", icon: "Clock" }) +
            btn("Hoàn tất xử lý", "overlay", {
              id: "D-06",
              icon: "Check",
            })
          : c.status === "WAITING"
            ? btn("Tiếp tục xử lý", "resume", {
                icon: "ArrowRight",
                tone: "primary",
              }) + btn("Hoàn tất", "overlay", { id: "D-06", icon: "Check" })
            : p
              ? btn("Mở lại yêu cầu", "overlay", {
                  id: "D-08",
                  icon: "RefreshCw",
                  cls: "full",
                })
              : '<div class="readonly-line">Yêu cầu đã kết thúc · Chỉ đọc</div>';
  const events = [
    ...c.audit.filter((e) => e.action !== "note"),
  ].sort((a, b) => b.time.localeCompare(a.time));
  return `<section class="panel detail-column" data-geometry="care">${caseProgress(c)}<div class="care-actions"><h2>Xử lý yêu cầu</h2><div class="action-row">${actions}</div>${s.resume ? `<div class="inline-resume">${field("Ghi chú tiếp tục xử lý", "resume-note", s.resumeDraft || "", { textarea: true, placeholder: "Ghi nhận phản hồi hoặc việc sẽ tiếp tục…" })}${btn("Lưu và tiếp tục", "save-resume", { tone: "primary", cls: "full" })}</div>` : ""}${c.status === "WAITING" ? `<div style="margin-top:16px">${banner(c.waitOn === "INTERNAL" ? "Đang chờ nội bộ" : "Đang chờ khách hàng", c.waitContent ? "" : c.waitReason, "warning")}</div>` : ""}${t ? `<div class="terminal-summary" style="margin-top:16px">${esc(c.result || "Đã ghi nhận kết quả xử lý.")}</div>` : ""}</div><div class="care-section"><div class="row between"><h2>Chủ đề yêu cầu</h2>${!t ? '<button class="link-button" data-action="overlay" data-id="D-03">Đổi chủ đề</button>' : ""}</div><span class="data-value">${TOPICS[c.topic]}</span></div><div class="care-section"><div class="row between"><h2>Lịch sử xử lý</h2>${icon("History")}</div>${events
    .slice(0, s.moreTimeline ? 99 : 5)
    .map(
      (e) =>
        `<div class="timeline-item"><i class="timeline-dot"></i><div class="strong">${esc(e.title)}</div><p>${esc(e.detail)}</p><time>${e.time} · ${esc(e.actor || "Nhóm CSKH")}</time></div>`,
    )
    .join(
      "",
    )}${events.length > 5 ? '<button class="link-button" data-action="timeline-more">Xem thêm lịch sử</button>' : ""}</div>${!t && (c.status !== "NEW" || p) ? `<div class="care-section">${btn("Hủy xử lý yêu cầu", "overlay", { id: "D-07", cls: "ghost", icon: "X" })}</div>` : ""}</section>`;
}
export function detailView(s) {
  const c = current(s);
  if (!canRead(s, c))
    return `<main class="content"><div class="page-title"><div><h1>Chi tiết yêu cầu</h1><p>Chăm sóc khách hàng</p></div></div><div class="panel empty-state" style="height:600px;margin-top:84px"><div class="empty-icon">${icon("LockKeyhole")}</div><h2>Bạn không còn quyền xem yêu cầu này.</h2><p>Yêu cầu có thể đã được chuyển cho người phụ trách khác. Nội dung chi tiết đã được ẩn.</p>${btn("Về danh sách", "list", { tone: "primary", icon: "ArrowLeft" })}</div></main>`;
  return `<main class="content"><div class="page-title"><div class="row" style="gap:16px">${btn("", "list", { cls: "icon-only", icon: "ArrowLeft", extra: 'aria-label="Quay danh sách"' })}<div><h1>Yêu cầu ${c.id}</h1><p>Tiếp nhận nhu cầu · hỗ trợ đặt hẹn · theo dõi kết quả</p></div></div>${source(c)}</div><div class="detail-meta"><div class="row">${status(c)}<span class="meta-separator"></span>${icon("UserRound")}<span class="meta-text">Phụ trách: <strong>${person(c.owner)?.name || "Chưa có"}</strong></span><span class="meta-separator"></span>${icon("Clock")}<span class="meta-text">Tiếp nhận ${c.received}</span></div>${s.role === "SUPERVISOR" && !terminal(c) ? btn(c.owner ? "Chuyển người phụ trách" : "Giao yêu cầu", "overlay", { id: "D-04", icon: "Users" }) : ""}</div><div class="mobile-detail-tabs" role="tablist" aria-label="Chi tiết yêu cầu">${[["source","Nội dung"],["identity",c.kind==='ai'?"Khách & Xử lý":"Khách hàng"],[c.kind==='ai'?"conversations":"care",c.kind==='ai'?"Hội thoại":"Xử lý"]].map(([id,label])=>`<button type="button" role="tab" aria-selected="${(s.detailSection||"source")===id}" data-action="detail-section" data-id="${id}">${label}</button>`).join("")}</div><div class="detail-columns" data-kind="${c.kind}" data-mobile-section="${s.detailSection||'source'}">${c.kind==='ai'?conversationList(s,c):care(s,c)}<section class="panel detail-column conversation-panel" data-geometry="source"><div class="source-tools"><h2>Nội dung nguồn</h2>${btn('Ghi chú nội bộ · '+c.notes.length,'notes-jump',{cls:'ghost',icon:'LockKeyhole'})}</div><div class="source-content">${s.justStarted===c.id?`<div class="start-options"><strong>Đã bắt đầu xử lý</strong><p>Tiếp tục hỗ trợ khách hoặc lập phiếu để thụ lý sau.</p>${btn("Tạo phiếu yêu cầu","overlay",{id:"D-11",icon:"Plus"})}</div>`:""}${livePanel(s,c)}${c.session?.mode==='LIVE'?`<details class="handoff-context"><summary>Bối cảnh bàn giao · AI summary · nội dung gốc</summary>${nextStep(s,c)}${summaryCard(c)}${sourceContent(c)}</details><h2 class="live-thread-title">Trao đổi trực tiếp</h2>${liveMessages(s,c)||'<p class="help">Phiên sẵn sàng. Gửi lời chào để tiếp tục hỗ trợ khách.</p>'}`:`${nextStep(s,c)}${summaryCard(c)}${sourceContent(c)}${c.session?.messages.length?'<h2 class="live-thread-title">Lịch sử trao đổi trực tiếp</h2>'+liveMessages(s,c):''}`}${privateNotes(c)}</div>${composer(s,c,noteComposer(s,c))}</section>${identity(s, c)}</div></main>`;
}
