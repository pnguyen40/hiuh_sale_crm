import {seedCases,seedOperationalData} from './mock-data-v09.js';
import {initOperations,createTicket} from './operations.js';
import {initContext} from "./context.js";
import {initWorkbench,recordEvent,queryCases} from "./workbench.js";
import { applyCareAction } from "./workflow.js";
export const TOPICS = {
  "dat-lich": "Đặt lịch khám",
  "tu-van-goi": "Tư vấn gói khám",
  "bao-hiem-vien-phi": "Bảo hiểm / Viện phí",
  "tra-cuu-ket-qua": "Tra cứu kết quả",
  "gop-y": "Góp ý",
  khac: "Khác",
};
export const STATUSES = {
  NEW: ["Mới", "neutral"],
  IN_PROGRESS: ["Đang xử lý", "primary"],
  WAITING: ["Chờ phản hồi", "warning"],
  RESOLVED: ["Đã hoàn tất", "success"],
  CANCELLED: ["Đã hủy", "neutral"],
};
export const PEOPLE = [
  { id: "mai", name: "Mai Anh", initials: "MA", active: true, group: "CSKH" },
  {
    id: "linh",
    name: "Thùy Linh",
    initials: "TL",
    active: true,
    group: "CSKH",
  },
  { id: "huy", name: "Minh Huy", initials: "MH", active: true, group: "CSKH" },
];
export const CONTACTS = [
  {
    id: "CT-EX-101",
    name: "Khách mẫu An",
    phone: "0900000101",
    relation: "SELF",
  },
  {
    id: "CT-EX-102",
    name: "Người liên hệ mẫu Chi",
    phone: "0900000203",
    relation: "REPRESENTATIVE",
  },
  {
    id: "CT-EX-103",
    name: "Người liên hệ mẫu Dũng",
    phone: "0900000101",
    relation: "UNKNOWN",
  },
];
export const clone = (v) => structuredClone(v);
export function makeCase(n, kind = "contact") {
  const topic = Object.keys(TOPICS)[(n - 1) % 6];
  return {
    id: `CS-EX-${String(n).padStart(3, "0")}`,
    kind,
    channel: n % 2 ? "WEB" : "APP",
    group: "CSKH",
    topic: kind === "booking" ? "dat-lich" : topic,
    sourceTopic: kind === "booking" ? "dat-lich" : topic,
    owner: null,
    status: "NEW",
    received: `01/11/2026 ${String(Math.floor((545 - (n % 45)) / 60)).padStart(2, "0")}:${String((545 - (n % 45)) % 60).padStart(2, "0")}`,
    receivedMinute: 545 - (n % 45),
    age: `${40 + (n % 45)} phút trước`,
    date: "2026-11-01",
    updated: n,
    original: {
      name:
        kind === "ai"
          ? ""
          : kind === "booking"
            ? "Bệnh nhân mẫu Bình"
            : `Khách mẫu ${["An", "Bình", "Chi", "Dũng", "Hà", "Lan", "Minh", "Ngọc"][n % 8]}`,
      phone: kind === "ai" ? "" : "0900000" + String(100 + n),
      email: kind === "ai" ? "" : "khach.mau@example.test",
    },
    care: {},
    nameContext:
      kind === "booking"
        ? "PATIENT_FORM"
        : kind === "ai"
          ? "UNKNOWN"
          : "CONTACT_FORM",
    relationship: "UNKNOWN",
    contactId: null,
    verified: {
      name: "Chưa đối chiếu",
      phone: "Chưa đối chiếu",
      relationship: "Chưa đối chiếu",
    },
    log: "FULL",
    bookingStatus: "PENDING_ARRANGEMENT",
    appointmentId: null,
    sourceVersion: 1,
    waitOn: null,
    waitReason: "",
    notes: [],
    audit: [
      {
        title: "Tiếp nhận yêu cầu",
        detail: "Hệ thống tiếp nhận từ nguồn",
        time: "09:08",
      },
    ],
    message:
      "Tôi muốn tìm hiểu lịch khám và chi phí khám tổng quát tại bệnh viện. Nhờ anh/chị tư vấn giúp những giấy tờ cần chuẩn bị.\n\nTôi có thể sắp xếp đến bệnh viện vào đầu tuần tới. Mong nhận được phản hồi. Cảm ơn anh/chị.",
    result: null,
    purpose: "UNKNOWN",
    bookingRequest: kind === "booking" ? { id: `BK-EX-${n}`, patient: "Bệnh nhân mẫu Bình", service: "Khám tổng quát", date: "2026-11-03" } : null,
    crmHandoff: null,
    followUpAt: "",
    nextStep: "",
  };
}
export function initialCases() {
  const cases = Array.from({ length: 63 }, (_, i) => {
    const c = makeCase(i + 1, ["ai", "contact", "booking"][i % 3]);
    if (i >= 21) {
      c.owner = i % 3 === 0 ? "linh" : "mai";
      c.status = [
        "NEW",
        "IN_PROGRESS",
        "WAITING",
        "RESOLVED",
        "IN_PROGRESS",
        "CANCELLED",
      ][i % 6];
      if (c.status === "WAITING") {
        c.waitOn = "CUSTOMER";
        c.waitReason = "Chờ khách xác nhận thời gian thuận tiện để tư vấn.";
        c.followUpAt="2026-11-02T09:00"; c.nextStep="Liên hệ lại để tiếp tục tư vấn";
      }
      if (["RESOLVED", "CANCELLED"].includes(c.status))
        c.result = "Đã ghi nhận kết quả hỗ trợ.";
    }
    return c;
  });
  const b = makeCase(2, "contact");
  b.original.name = "Khách mẫu An";
  b.original.phone = "0900000101";
  b.topic = b.sourceTopic = "dat-lich";
  b.owner = "mai";
  b.status = "NEW";
  cases[1] = b;
  const a = cases[0];
  a.owner = "mai";
  a.status = "IN_PROGRESS";
  a.topic = "tu-van-goi";
  a.audit.unshift({
    title: "Bắt đầu xử lý",
    detail: "Mai Anh · Tiếp tục chăm sóc từ hội thoại",
    time: "09:20",
  });
  const c = cases[2];
  c.owner = "mai";
  c.status = "IN_PROGRESS";
  c.original.phone = "0900000203";
  c.contactId = "CT-EX-102";
  c.purpose="B2C"; c.followUpAt="2026-11-02T09:00"; c.nextStep="Kiểm tra kết quả sắp lịch";
  c.care.name = "Người liên hệ mẫu Chi";
  c.relationship = "REPRESENTATIVE";
  c.verified.name = "Đã đối chiếu phù hợp";
  c.verified.relationship = "Đã đối chiếu phù hợp";
  c.notes = [
    {
      text: "Người liên hệ xác nhận đặt khám hộ. Đã tách thông tin người liên hệ và tên trên form bệnh nhân.",
      time: "09:25",
      actor: "Mai Anh",
    },
  ];
  c.audit.unshift({
    title: "Đã đối chiếu người liên hệ",
    detail: "Mai Anh · Người đại diện",
    time: "09:25",
  });
  const old = cases[30];
  old.original.name = "Khách mẫu An"; old.original.phone = "0900000101";
  old.contactId = "CT-EX-101"; old.owner = "mai"; old.status = "RESOLVED";
  old.topic = "tu-van-goi"; old.received = "28/10/2026 10:00"; old.date = "2026-10-28";
  old.result = "Đã tư vấn thông tin gói khám.";
  return cases;
}
export function scenario(frame) {
  const cases = initialCases();
  seedCases(cases);
  let s = {
    frame,
    cases,
    role: "STAFF",
    user: "mai",
    view: "queue",
    screen: "list",
    caseId: null,
    overlay: null,
    filters: { q: "", source: "", topic: "", status: "", date: "", owner: "" },
    page: 1,
    sort: "asc",
    error: false,
    conflict: false,
    revoked: false,
    ambiguous: false,
    resume: false,
    now: new Date().toISOString(),
  };
  const setCase = (index) => {
    s.screen = "detail";
    s.caseId = cases[index].id;
    return cases[index];
  };
  if (frame === "M-02") {
    s.view = "mine";
    s.filters.status = "IN_PROGRESS";
    s.sort = "desc";
  }
  if (frame === "M-03") {
    s.view = "team";
    s.role = "SUPERVISOR";
    s.sort = "desc";
  }
  if (frame === "M-04") setCase(0);
  if (frame === "M-05") setCase(1);
  if (frame === "M-06") setCase(2);
  const overlays = {
    "M-07": "D-01",
    "M-08": "D-02",
    "M-09": "D-03",
    "M-10": "D-04",
    "M-11": "D-05",
    "M-12": "D-06",
    "M-13": "D-07",
    "M-14": "D-08",
    "M-18": "D-01",
    "M-19": "D-02",
  };
  if (overlays[frame]) {
    const c = setCase(1);
    c.status = "IN_PROGRESS";
    s.overlay = overlays[frame];
    if (["M-10", "M-14"].includes(frame)) s.role = "SUPERVISOR";
    if (frame === "M-14") {
      c.status = "RESOLVED";
      c.result = "Đã hướng dẫn thủ tục và thời gian tiếp nhận.";
    }
    if (frame === "M-18") s.ambiguous = true;
  }
  if (frame === "M-15") {
    s.filters.q = "CS-KHONG-TIM-THAY";
  }
  if (frame === "M-16") s.error = true;
  if (frame === "M-17") {
    s.conflict = true;
    cases[3].owner = "linh";
  }
  if (frame === "M-20") setCase(0).log = "PARTIAL";
  if (frame === "M-21") setCase(0).log = "UNAVAILABLE";
  if (frame === "M-22") {
    setCase(1);
    s.revoked = true;
    cases[1].owner = "linh";
  }
  if (frame === "M-23") {
    const c = setCase(2);
    c.bookingStatus = "CONFIRMED";
    c.appointmentId = "APPT-EX-003";
    c.sourceVersion = 2;
  }
  if (frame === "M-24") {
    const c = setCase(1);
    c.status = "WAITING";
    c.waitOn = "CUSTOMER";
    c.waitReason = "Chờ khách xác nhận ngày đến khám và nhu cầu tư vấn.";
  }
  if (frame === "M-24") { current(s).followUpAt = "2026-11-02T09:00"; current(s).nextStep = "Liên hệ lại để chốt ngày khám"; }
  if (["M-25", "M-28"].includes(frame)) {
    const c = setCase(1); c.status = "IN_PROGRESS"; c.purpose = "B2B";
    c.topic = "tu-van-goi"; c.message = "Tôi đại diện Công ty Mẫu, cần tư vấn khám sức khỏe cho 80 nhân viên vào tháng 12. Nhờ bệnh viện liên hệ báo giá.";
    if (frame === "M-28") c.crmHandoff = {id:"HO-MOCK-002", state:"ACCEPTED", org:"Công ty Mẫu", summary:c.message, ref:"CRM-MOCK-002", receiver:"Nhóm kinh doanh doanh nghiệp", version:2};
  }
  if (frame === "M-26") { setCase(1); }
  if (frame === "M-27") { const c = setCase(1); c.status="IN_PROGRESS"; s.overlay="D-09"; }
  if (frame === "M-29") { const c = setCase(1); c.status="IN_PROGRESS"; s.overlay="D-10"; }
  initWorkbench(s);
  if(frame === 'M-30'){s.view='mine';s.filters.follow='overdue';cases[2].followUpAt='2026-11-01T08:00';}
  if(frame === 'M-31'){s.view='mine';s.filters.status=['IN_PROGRESS','WAITING'];s.sortKey='follow';s.sort='asc';s.viewEditor='save';}
  if(frame === 'M-32'){s.screen='log';s.role='SUPERVISOR';}
  if(frame === 'M-33'){s.screen='log';s.role='SUPERVISOR';const before=clone(cases[1]);cases[1].owner='linh';const e=recordEvent(s,{action:'assign',caseId:cases[1].id,before,after:cases[1],reason:true});s.logDetail=e.id;}
  initContext(s);
  initOperations(s);
  seedOperationalData(s);
  if(frame==='M-47'){s.role='SUPERVISOR';s.view='team';s.filters.session=['RECENT_EXPIRED'];s.sort='desc';}
  if(frame==='M-48'){s.role='SUPERVISOR';s.view='team';s.filters.source=['ai'];s.sort='desc';}
  if(frame==='M-49'){s.role='SUPERVISOR';s.screen='tickets';}
  if(frame==='M-50'){s.role='SUPERVISOR';s.screen='log';}
  if(frame==='M-51'){s.role='SUPERVISOR';s.view='team';s.filters.topic=['dat-lich','tu-van-goi'];s.sort='desc';}
  return s;
}
export const current = (s) => s.cases.find((c) => c.id === s.caseId);
export const terminal = (c) => ["RESOLVED", "CANCELLED"].includes(c.status);
export const canRead = (s, c) =>
  !!c &&
  !s.revoked &&
  c.group === "CSKH" &&
  (s.role === "SUPERVISOR" || c.owner === s.user);
export const canEdit = (s, c) => canRead(s, c) && !terminal(c);
export function phoneValid(v) {
  const cleaned = v.replace(/[\s.()\-]/g, "");
  return /^(0\d{9,10}|\+?84\d{9,10})$/.test(cleaned);
}
export const visibleCases = queryCases;

function demand(ok, message) {
  if (!ok) throw new Error(message);
}
export function applyAction(s,id,action,data={}) {
 try {return applyActionCore(s,id,action,data)} catch(error) {
  recordEvent(s,{action,caseId:id,result:/quyền|phụ trách|được phép/.test(error.message)?'DENIED':'FAILED',code:/quyền|phụ trách|được phép/.test(error.message)?'ACCESS_OR_CONFLICT':'VALIDATION_FAILED'});
  throw error;
 }
}
function applyActionCore(s, id, action, data = {}) {
  const c = s.cases.find((x) => x.id === id);
  demand(c, "Yêu cầu không còn tồn tại.");
  if(action === "ticket-create"){createTicket(s,c,data);return c;}
  const before = c ? clone(c) : null;
  if (action === "claim") {
    demand(
      !s.revoked && ["STAFF","SUPERVISOR"].includes(s.role) && c.group === "CSKH" && !c.owner && c.status === "NEW",
      "Yêu cầu đã có người phụ trách. Danh sách đã được cập nhật.",
    );
    c.owner = s.user;
  } else {
    demand(canRead(s, c), "Bạn không còn quyền xem yêu cầu này.");
    if (action === "assign") {
      demand(
        s.role === "SUPERVISOR" && !terminal(c),
        "Bạn không có quyền giao hoặc chuyển yêu cầu này.",
      );
      const p = PEOPLE.find(
        (x) => x.id === data.owner && x.active && x.group === c.group,
      );
      demand(p, "Chọn nhân viên đang hoạt động trong cùng nhóm.");
      demand(p.id !== c.owner, "Chọn người phụ trách khác.");
      demand(
        !c.owner || data.reason?.trim(),
        "Nhập lý do chuyển người phụ trách.",
      );
      c.owner = p.id;
    } else if (action === "reopen") {
      demand(
        s.role === "SUPERVISOR" && terminal(c),
        "Chỉ trưởng nhóm được mở lại yêu cầu đã kết thúc.",
      );
      demand(
        data.reason?.trim() &&
          PEOPLE.some(
            (x) => x.id === data.owner && x.active && x.group === c.group,
          ),
        "Nhập lý do và chọn người phụ trách.",
      );
      c.owner = data.owner;
      c.status = "IN_PROGRESS";
    } else {
      demand(
        ["start","wait","resume","resolve","cancel","note","category","link","contact","booking","crm"].includes(action),
        "Thao tác không được hỗ trợ.",
      );
      demand(
        !terminal(c),
        "Yêu cầu đã kết thúc. Cần trưởng nhóm mở lại trước khi xử lý.",
      );
      if (action === "start") {
        demand(
          c.status === "NEW" && c.owner,
          "Yêu cầu phải có người phụ trách và ở trạng thái Mới.",
        );
        c.status = "IN_PROGRESS";
      }
      if (["wait", "resolve", "contact", "booking", "crm"].includes(action)) applyCareAction(s, c, action, data);
      if (action === "resume") {
        demand(
          c.status === "WAITING" && data.reason?.trim(),
          "Nhập ghi chú trước khi tiếp tục xử lý.",
        );
        c.status = "IN_PROGRESS";
        c.notes.unshift({
          text: data.reason.trim(),
          actor: "Mai Anh",
          time: "09:45",
        });
      }
      if (action === "cancel") {
        demand(
          c.status !== "NEW" || s.role === "SUPERVISOR",
          "Chỉ trưởng nhóm được hủy yêu cầu Mới.",
        );
        demand(data.reason?.trim(), "Nhập lý do hủy xử lý.");
        c.status = "CANCELLED";
        c.result = data.reason.trim();
      }
      if (action === "note") {
        demand(
          data.text?.trim() && data.text.trim().length <= 4000,
          "Ghi chú cần từ 1 đến 4.000 ký tự.",
        );
        c.notes.unshift({
          text: data.text.trim(),
          actor: s.role === "SUPERVISOR" ? "Trưởng nhóm" : "Mai Anh",
          time: "09:45",
        });
      }
      if (action === "category") {
        demand(
          TOPICS[data.topic] && data.topic !== c.topic,
          "Chọn chủ đề khác hiện tại.",
        );
        c.topic = data.topic;
      }
      if (action === "link") {
        demand(
          data.reason?.trim(),
          "Nhập căn cứ đối chiếu trước khi liên kết.",
        );
        let contact = CONTACTS.find((x) => x.id === data.contactId);
        if (data.mode === "create") {
          demand(
            data.name?.trim() &&
              data.name.trim().length <= 100 &&
              phoneValid(data.phone),
            "Tên phải có 1–100 ký tự và số điện thoại đúng định dạng.",
          );
          contact = {
            id: "CT-EX-NEW-" + String(CONTACTS.length + 1),
            name: data.name.trim(),
            phone: data.phone,
            relation: data.relationship || "UNKNOWN",
          };
          CONTACTS.push(contact);
        }
        demand(
          contact || data.mode === "unlink",
          "Chọn một người liên hệ; hệ thống không tự chọn.",
        );
        c.contactId = contact?.id || null;
        if (contact) {
          c.care.name = contact.name;
        } else delete c.care.name;
      }

    }
  }
  const labels = {
    claim: "Nhận xử lý",
    assign: "Cập nhật người phụ trách",
    reopen: "Mở lại yêu cầu",
    start: "Bắt đầu xử lý",
    wait: "Chờ phản hồi",
    resume: "Tiếp tục xử lý",
    resolve: "Hoàn tất xử lý",
    cancel: "Hủy xử lý yêu cầu",
    note: "Lưu ghi chú",
    category: "Đổi chủ đề",
    link: "Cập nhật liên kết người liên hệ",
    contact: "Cập nhật thông tin liên hệ",
    booking: "Gửi yêu cầu đặt hẹn qua CSKH",
    crm: "Chuyển nhu cầu doanh nghiệp sang CRM",
  };
  c.audit.unshift({
    action,
    title: labels[action],
    detail: data.reason || data.summary || data.text || (action === "contact" ? "Bổ sung thông tin liên hệ; giữ bản khai báo ban đầu" : "Thao tác đã được ghi nhận"),
    actor: s.role === "SUPERVISOR" ? "Trưởng nhóm" : "Mai Anh",
    before: {
      owner: before.owner,
      status: before.status,
      contactId: before.contactId,
      care: before.care,
      followUpAt: before.followUpAt, nextStep: before.nextStep, purpose: before.purpose,
      bookingRequest: before.bookingRequest, crmHandoff: before.crmHandoff,
    },
    after: {
      owner: c.owner,
      status: c.status,
      contactId: c.contactId,
      care: clone(c.care),
      followUpAt: c.followUpAt, nextStep: c.nextStep, purpose: c.purpose,
      bookingRequest: clone(c.bookingRequest), crmHandoff: clone(c.crmHandoff),
    },
    time: "09:45",
  });
  c.updated = 1000 + c.audit.length;
  c.updatedAt = s.now;
  recordEvent(s,{action,caseId:id,before,after:c,reason:!!(data.reason||data.waitContent)});
  return c;
}
