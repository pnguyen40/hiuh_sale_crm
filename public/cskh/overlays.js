import {ticketForm} from './operations-ui.js';
import {waitDefaults} from './follow-up.js';
import { normalizePhone, careName, carePhone, needsBooking, hasAppointment } from "./workflow.js";
import { TOPICS, PEOPLE, CONTACTS, current } from "./model.js";
import {
  esc,
  icon,
  btn,
  badge,
  field,
  banner,
  avatar,
  person,
} from "./views.js";
export const GEOMETRY = {
  "D-11": [600,100,720,850],
  "D-01": [1200, 64, 720, 1016],
  "D-02": [600, 230, 720, 620],
  "D-03": [680, 330, 560, 420],
  "D-04": [640, 270, 640, 540],
  "D-05": [600, 170, 720, 740],
  "D-09": [540, 180, 840, 720],
  "D-10": [560, 200, 800, 680],
  "D-06": [600, 240, 720, 600],
  "D-07": [640, 290, 640, 500],
  "D-08": [640, 270, 640, 540],
};
const TITLES = {
  "D-11": ["Tạo phiếu yêu cầu", "Giao việc cần xử lý tiếp và theo dõi kết quả.", "Tạo phiếu yêu cầu"],
  "D-09": ["Đặt hẹn qua CSKH", "Gửi nhu cầu để bộ phận đặt lịch sắp xếp. Chưa phải lịch đã xác nhận.", "Gửi yêu cầu đặt hẹn"],
  "D-10": ["Chuyển nhu cầu doanh nghiệp sang CRM", "Chuyển sang Cơ hội khám đoàn của CRM trong Operation Portal.", "Chuyển sang CRM"],
  "D-01": [
    "Tìm trong Danh bạ Contact",
    "Tùy chọn cho khách đã có thông tin. Không cần liên kết để chăm sóc.",
    "Xác nhận liên kết",
  ],
  "D-02": [
    "Thông tin liên hệ",
    "Bổ sung thông tin vừa trao đổi hoặc sửa thông tin khai nhầm.",
    "Lưu thông tin",
  ],
  "D-03": [
    "Đổi chủ đề",
    "Cập nhật phân loại phục vụ chăm sóc, giữ nguyên chủ đề từ nguồn.",
    "Lưu chủ đề",
  ],
  "D-04": [
    "Chuyển người phụ trách",
    "Điều phối yêu cầu tới nhân viên đang hoạt động trong cùng nhóm.",
    "Chuyển người phụ trách",
  ],
  "D-05": [
    "Chờ phản hồi",
    "Ghi rõ đang chờ ai và thông tin cần bổ sung.",
    "Chuyển sang chờ",
  ],
  "D-06": [
    "Hoàn tất xử lý",
    "Ghi nhận kết quả hỗ trợ trước khi kết thúc yêu cầu.",
    "Hoàn tất xử lý",
  ],
  "D-07": [
    "Hủy xử lý yêu cầu",
    "Ghi nhận lý do dừng xử lý và lưu lịch sử.",
    "Hủy xử lý",
  ],
  "D-08": [
    "Mở lại yêu cầu",
    "Tiếp tục chăm sóc yêu cầu đã kết thúc, giữ nguyên lịch sử.",
    "Mở lại và tiếp tục xử lý",
  ],
};
export function candidateList(s, query) {
  const c = current(s);
  const q = (query || "").trim().toLowerCase();
  const number = normalizePhone(q);
  const candidates = q ? CONTACTS.filter(p => number ? normalizePhone(p.phone) === number : p.name.toLowerCase().includes(q)) : [];
  return `<p class="form-help">${candidates.length} người liên hệ phù hợp · Chưa có lựa chọn tự động</p>${
    candidates.length
      ? candidates
          .map(
            (p) =>
              `<label class="candidate"><input type="radio" name="contactId" value="${p.id}" aria-label="Chọn ${esc(p.name)}">${avatar(
                p.name
                  .split(" ")
                  .slice(-2)
                  .map((x) => x[0])
                  .join(""),
              )}<span class="grow"><span class="strong">${esc(p.name)}</span><p>${p.phone} · ${p.id}</p><p>Thông tin trong danh bạ được phép tra cứu</p></span></label>`,
          )
          .join("")
      : `<div class="original-value"><h3>Chưa tìm thấy người liên hệ</h3><p class="form-help">Bạn có thể tiếp tục chăm sóc yêu cầu chưa liên kết.</p></div>`
  }`;
}
export function overlayView(s) {
  const c = current(s),
    id = s.overlay;
  if (!id || !c) return "";
  let [title, subtitle, submit] = TITLES[id];
  let body = "";
  const mode = s.linkMode || "link",
    v = s.formValues || {};
  const textReason = (
    label = "Lý do",
    placeholder = "Ghi rõ nội dung và căn cứ…",
  ) =>
    field(label, "reason", v.reason || "", {
      textarea: true,
      required: true,
      placeholder,
    });
  if (id === "D-01") {
    body = banner(
      "Số điện thoại có thể được nhiều người sử dụng",
      "Chỉ liên kết khi đã đối chiếu đủ căn cứ. Không tự gộp hồ sơ.",
    );
    body += `<div class="row between"><span class="section-label">${mode === "create" ? "Người liên hệ mới" : mode === "unlink" ? "Bỏ liên kết" : "Tra cứu danh bạ"}</span><div class="row">${btn(mode === "create" ? "Tra cứu hiện có" : "Tạo người liên hệ", "link-mode", { id: mode === "create" ? "link" : "create", cls: "ghost", icon: mode === "create" ? "Search" : "Plus" })}${c.contactId && mode !== "unlink" ? btn("Bỏ liên kết", "link-mode", { id: "unlink", cls: "ghost", icon: "Unlink" }) : ""}</div></div><input type="hidden" name="mode" value="${mode}">`;
    if (mode === "link")
      body +=
        field("Tên hoặc số liên hệ", "contactQuery", carePhone(c), {
          placeholder: "Tìm trong Danh bạ Contact được cấp quyền",
        }) +
        `<div id="candidates" class="stack">${candidateList(s, carePhone(c))}</div>`;
    if (mode === "create") {
      body +=
        field("Họ tên người liên hệ", "name", "", {
          required: true,
          maxlength: 100,
          placeholder: "Nhập tên người đã đối chiếu",
        }) +
        field("Số điện thoại", "phone", "", {
          required: true,
          placeholder: "Nhập số đã làm rõ",
        }) +
        field("Quan hệ với người bệnh", "relationship", "UNKNOWN", {
          options: [
            ["UNKNOWN", "Chưa xác định"],
            ["SELF", "Tự liên hệ"],
            ["REPRESENTATIVE", "Người đại diện"],
          ],
        }) +
        banner(
          "Tách tên người bệnh và tên người liên hệ",
          "Không sao chép tên trên form bệnh nhân để tạo người liên hệ.",
        );
      submit = "Tạo và liên kết";
    }
    if (mode === "unlink") {
      body += banner(
        "Bỏ liên kết khỏi yêu cầu này",
        "Thao tác không xóa hoặc gộp hồ sơ người liên hệ.",
        "warning",
      );
      submit = "Bỏ liên kết";
    }
    body += textReason(
      mode === "unlink" ? "Lý do bỏ liên kết" : "Căn cứ đối chiếu",
      "Ví dụ: Người liên hệ đã xác nhận họ tên và quan hệ…",
    );
  }
  if (id === "D-02") {
    body = field("Tên người liên hệ", "name", careName(c), {maxlength:100,placeholder:"Tên dùng khi trao đổi"}) +
      `<div class="form-grid">${field("Số điện thoại", "phone", carePhone(c), {type:"tel",placeholder:"Ví dụ: 0900000101"})}${field("Email (nếu có)", "email", c.care.email ?? c.original.email, {type:"email"})}</div>` +
      field("Lý do sửa (chỉ cần khi đổi thông tin đã có)", "reason", "", {textarea:true,placeholder:"Ví dụ: khách cung cấp lại số liên hệ"}) +
      `<details class="original"><summary>Thông tin khai báo ban đầu</summary><p>${esc(c.original.name || "Chưa có tên")} · ${esc(c.original.phone || "Chưa có số")}</p></details><p class="form-help">Thông tin ban đầu được giữ lại. Người sửa và thời điểm được lưu tự động.</p>`;
  }
  if (id === "D-09") {
    body = `<div class="original-value"><strong>${esc(careName(c) || "Chưa có tên người liên hệ")}</strong><p>${esc(carePhone(c) || "Chưa có số liên hệ")}</p></div>` +
      field("Đặt cho ai?", "relationship", "SELF", {required:true,options:[["SELF","Bản thân"],["REPRESENTATIVE","Người khác"]]}) +
      `<div id="patient-field" hidden>${field("Tên người đi khám", "patient", "", {maxlength:100,placeholder:"Chỉ điền khi đặt cho người khác"})}</div>` +
      field("Dịch vụ / nhu cầu khám", "service", "", {required:true,placeholder:"Ví dụ: khám tổng quát, tư vấn chuyên khoa"}) +
      `<div class="form-grid">${field("Ngày khám mong muốn", "date", "", {type:"date",required:true})}${field("Hẹn kiểm tra kết quả", "followUpAt", "", {type:"datetime-local",required:true})}</div>` +
      `<p class="form-help">Không cần chọn bác sĩ hoặc có hồ sơ bệnh nhân trước. Lịch xác nhận sẽ được cập nhật từ bộ phận đặt lịch.</p>`;
  }
  if (id === "D-10") {
    body = `<div class="original-value"><strong>${esc(careName(c) || "Chưa có tên người liên hệ")}</strong><p>${esc(carePhone(c) || "Chưa có số liên hệ")}</p></div>` +
      field("Tên doanh nghiệp / tổ chức", "org", "", {required:true,maxlength:200}) +
      field("Nhu cầu bàn giao", "summary", "", {textarea:true,required:true,placeholder:"Nhu cầu khám đoàn, quy mô dự kiến, thời gian mong muốn…"}) +
      field("Hẹn kiểm tra CRM tiếp nhận", "followUpAt", "", {type:"datetime-local",required:true}) +
      `<p class="form-help">Sau khi chuyển, CSKH tiếp tục theo dõi đến khi CRM xác nhận tiếp nhận. Việc chuyển không tự xác nhận lịch khám hoặc đóng yêu cầu.</p>`;
  }
  if (id === "D-03")
    body =
      `<div class="original-value"><span class="label">Chủ đề hiện tại</span><span class="strong">${TOPICS[c.topic]}</span></div>` +
      field("Chủ đề mới", "topic", "", {
        required: true,
        options: [
          ["", "Chọn chủ đề mới"],
          ...Object.entries(TOPICS).filter(([k]) => k !== c.topic),
        ],
      }) +
      field("Ghi chú (tùy chọn)", "reason", "", {textarea:true});
  if (id === "D-04") {
    if (!c.owner) {
      title = "Giao yêu cầu";
      submit = "Giao yêu cầu";
    }
    body =
      `<div class="original-value"><span class="label">Người phụ trách hiện tại</span><span class="strong">${person(c.owner)?.name || "Chưa có người phụ trách"}</span></div>` +
      field("Người phụ trách mới", "owner", "", {
        required: true,
        options: [
          ["", "Chọn nhân viên trong nhóm"],
          ...PEOPLE.filter((p) => p.id !== c.owner && p.active).map((p) => [
            p.id,
            p.name,
          ]),
        ],
      }) +
      field(c.owner ? "Lý do chuyển" : "Ghi chú giao yêu cầu", "reason", "", {
        textarea: true,
        required: !!c.owner,
      }) +
      `<p class="form-help">Tiến độ yêu cầu được giữ nguyên. Quyền chi tiết chuyển theo người phụ trách hiện tại.</p>`;
  }
  if (id === "D-05") {
    const d={...waitDefaults(c),...v};
    body=`<fieldset class="wait-party"><legend class="label">Đang chờ phản hồi từ <span aria-hidden="true">*</span></legend><div class="segmented"><label><input type="radio" name="waitOn" value="CUSTOMER" required ${d.waitOn==='CUSTOMER'?'checked':''}>Khách hàng</label><label><input type="radio" name="waitOn" value="INTERNAL" required ${d.waitOn==='INTERNAL'?'checked':''}>Nội bộ</label></div></fieldset>`+
      field('Nội dung chờ / việc cần làm','waitContent',d.waitContent,{textarea:true,required:true,placeholder:'Đang chờ thông tin gì và sẽ làm gì tiếp?'})+
      `<fieldset class="wait-date"><legend>Hẹn liên hệ / kiểm tra lại <span aria-hidden="true">*</span></legend><div class="wait-date-fields">${field('Ngày','followDay',d.followDay,{required:true,placeholder:'DD',maxlength:2})}${field('Tháng','followMonth',d.followMonth,{required:true,placeholder:'MM',maxlength:2})}${field('Năm','followYear',d.followYear,{required:true,placeholder:'YYYY',maxlength:4})}${field('Giờ (tùy chọn)','followTime',d.followTime,{type:'time'})}</div><p class="help">Tháng và năm điền sẵn theo giờ hệ thống. Nhập ngày cần theo dõi; có thể để trống giờ.</p></fieldset>`+
      banner('Chăm sóc vẫn đang tiếp diễn','Yêu cầu chuyển sang Chờ phản hồi sau khi lưu.');
  }
  if (id === "D-06") {
    const valid = hasAppointment(c);
    body =
      field("Kết quả xử lý", "outcome", "", {
        required: true,
        options: [
          ["", "Chọn kết quả"],
          ...(!needsBooking(c) && !c.crmHandoff && c.purpose !== "B2B" ? [["support", "Đã giải đáp / tư vấn xong"]] : []),
          ...(valid ? [["appointment", "Đã có lịch xác nhận"]] : []),
          ...(c.crmHandoff?.state === "ACCEPTED" ? [["handoff", "CRM đã tiếp nhận xử lý"]] : []),
          ["declined", "Khách chưa tiếp tục / không còn nhu cầu"],
        ],
      }) +
      textReason("Nội dung hỗ trợ", "Tóm tắt việc đã hỗ trợ và kết quả…") +
      (needsBooking(c)
        ? `<div class="original-value"><span class="label">Lịch từ nguồn · Chỉ đọc</span>${esc(valid ? c.appointmentId + " · Đã xác nhận" : "Chờ bệnh viện sắp xếp · Chưa có mã lịch xác nhận")}</div>`
        : "") +
      `<p class="form-help">Lưu kết quả để chuyển yêu cầu sang Đã hoàn tất. Việc này không tạo hoặc cập nhật lịch khám.</p>`;
  }
  if (id === "D-07")
    body =
      banner(
        "Thao tác này chỉ hủy yêu cầu hỗ trợ, không hủy lịch khám.",
        "Thông tin và lịch sử vẫn được giữ để đối soát.",
        "warning",
      ) +
      textReason(
        "Lý do hủy xử lý",
        "Ghi rõ căn cứ yêu cầu không thể tiếp tục…",
      );
  if (id === "D-08")
    body =
      `<div class="original-value"><span class="label">Kết quả trước đó · Chỉ đọc</span>${esc(c.result || "Đã kết thúc yêu cầu.")}</div>` +
      field("Người phụ trách sau khi mở lại", "owner", "", {
        required: true,
        options: [
          ["", "Chọn nhân viên trong nhóm"],
          ...PEOPLE.filter((p) => p.active).map((p) => [p.id, p.name]),
        ],
      }) +
      textReason("Lý do mở lại") +
      `<p class="form-help">Yêu cầu trở về Đang xử lý. Lịch sử chăm sóc trước đó được giữ nguyên.</p>`;
  if(id === "D-11")body=ticketForm(s,c);
  const [x, y, w, h] = GEOMETRY[id];
  return `<div class="backdrop"></div><form id="overlay-form" class="modal ${id === "D-01" ? "drawer" : ""}" role="dialog" aria-modal="true" aria-labelledby="overlay-title" data-overlay="${id}" style="--modal-width:${w}px;--modal-height:${h}px" novalidate><div class="modal-header"><div><h2 id="overlay-title" tabindex="-1">${title}</h2><p>${subtitle}</p></div>${btn("", "close-overlay", { icon: "X", cls: "icon-only ghost", extra: 'aria-label="Đóng cửa sổ"' })}</div><div class="modal-body">${body}<div id="modal-error" class="modal-error" role="alert"></div></div><div class="modal-footer">${btn(id === "D-07" ? "Quay lại" : "Đóng", "close-overlay")}${btn(submit, null, { type: "submit", tone: id === "D-07" ? "danger" : "primary", extra: 'id="overlay-submit"' })}</div></form>`;
}
