/**
 * MOCKED DATA — Sale CRM (HIU Operation Portal)
 * -----------------------------------------------------------------------
 * Everything in this file is simulated seed data for the Sale CRM
 * prototype. No network calls are made; nothing here is persisted to a
 * real backend. It exists purely so the UI has realistic Vietnamese
 * content to render and interact with in-session.
 */

export type LeadStage = "NEW" | "CONTACTING" | "QUALIFIED" | "BOOKED" | "LOST";
export type LeadSource = "WEBSITE" | "MOBILE_APP" | "UPLOAD" | "MANUAL";
export type OpportunityStage = "OPEN" | "IN_PROGRESS" | "GROUP_CONFIRMED" | "GROUP_WON" | "GROUP_LOST";

export const STAGE_LABEL: Record<LeadStage, string> = {
  NEW: "Tiếp nhận",
  CONTACTING: "Đang liên hệ",
  QUALIFIED: "Đủ điều kiện",
  BOOKED: "Đã đặt hẹn",
  LOST: "Thất bại",
};

export const STAGE_TONE: Record<LeadStage, "info" | "primary" | "warning" | "success" | "error"> = {
  NEW: "info",
  CONTACTING: "primary",
  QUALIFIED: "warning",
  BOOKED: "success",
  LOST: "error",
};

export const OPP_STAGE_LABEL: Record<OpportunityStage, string> = {
  OPEN: "Mới mở",
  IN_PROGRESS: "Đang xử lý",
  GROUP_CONFIRMED: "Đã xác nhận đoàn",
  GROUP_WON: "Thành công",
  GROUP_LOST: "Thất bại",
};

export const OPP_STAGE_TONE: Record<OpportunityStage, "info" | "primary" | "teal" | "success" | "error"> = {
  OPEN: "info",
  IN_PROGRESS: "primary",
  GROUP_CONFIRMED: "teal",
  GROUP_WON: "success",
  GROUP_LOST: "error",
};

export const SOURCE_LABEL: Record<LeadSource, string> = {
  WEBSITE: "Website",
  MOBILE_APP: "Ứng dụng di động",
  UPLOAD: "Tải lên Excel",
  MANUAL: "Nhập thủ công",
};

export interface TimelineEvent {
  id: string;
  channel: string;
  note: string;
  by: string;
  at: string;
}

export interface AuditEvent {
  id: string;
  at: string;
  by: string;
  action: string;
  detail: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  org: string;
  source: LeadSource;
  campaign: string;
  pkg: string;
  department: string;
  note: string;
  stage: LeadStage;
  pic: string;
  createdAt: string;
  contactId: string;
  lostReason?: string;
  bookingAt?: string;
  timeline: TimelineEvent[];
  audit: AuditEvent[];
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  org: string;
  leadCount: number;
  duplicate: boolean;
  lastTouch: string;
}

export interface Org {
  id: string;
  name: string;
  taxCode: string;
  phone: string;
  contactPerson: string;
  address: string;
}

export interface Opportunity {
  id: string;
  orgId: string;
  pkg: string;
  size: number;
  expectedDate: string;
  stage: OpportunityStage;
  pic: string;
  negotiation: TimelineEvent[];
  lostReason?: string;
}

export const PIC_LIST = ["Hoàng Nhân Viên", "Đinh Nhân Viên", "Phạm Nhân Viên", "Quách Nhân Viên"];

export const CAMPAIGNS = [
  "TamSoatTimMach_Q4",
  "KhamTongQuat_2026",
  "MeBau_ThangSinh",
  "App_Launch_Promo",
  "KhamDoan_DN_Q4",
];

export const PACKAGES = [
  "Tầm soát Tim mạch & Đột quỵ",
  "Khám định kỳ Cơ bản – Nữ",
  "Khám Nâng cao – Nam",
  "Khám Tiền sản",
  "Tầm soát Tiêu hóa – Gan mật",
];

export const DEPARTMENTS = ["Phòng Kinh doanh", "Phòng Marketing", "Phòng Khám Dịch vụ"];

function timeline(items: Array<[string, string, string, string]>): TimelineEvent[] {
  return items.map(([channel, note, by, at], i) => ({ id: `EVT-${i}`, channel, note, by, at }));
}

function audit(items: Array<[string, string, string, string]>): AuditEvent[] {
  return items.map(([action, detail, by, at], i) => ({ id: `AUD-${i}`, action, detail, by, at }));
}

export const INITIAL_CONTACTS: Contact[] = [
  { id: "CTC-00123", name: "Lê Hoàng Minh", phone: "0901234567", email: "minh.le@example.com", org: "—", leadCount: 2, duplicate: true, lastTouch: "Gọi điện · 07/10/2026 08:40" },
  { id: "CTC-00487", name: "Trần Thị Mai", phone: "0912345678", email: "—", org: "—", leadCount: 1, duplicate: false, lastTouch: "Hệ thống · 07/10/2026 08:12" },
  { id: "CTC-00212", name: "Phạm Thu Hà", phone: "0987654321", email: "ha.pham@example.com", org: "—", leadCount: 1, duplicate: false, lastTouch: "Zalo · 06/10/2026 16:30" },
  { id: "CTC-00305", name: "Võ Minh Khoa", phone: "0903456789", email: "—", org: "—", leadCount: 1, duplicate: false, lastTouch: "Gọi điện · 06/10/2026 14:00" },
  { id: "CTC-00098", name: "Nguyễn Quốc Bảo", phone: "0945678901", email: "—", org: "—", leadCount: 1, duplicate: true, lastTouch: "Kiosk chuyển hướng · 05/10/2026 09:15" },
];

export const INITIAL_ORGS: Org[] = [
  { id: "ORG-00041", name: "Tập đoàn Công nghệ Beta", taxCode: "0109876543", phone: "02838123456", contactPerson: "Nguyễn Nhân Sự · 0988776655", address: "Q.1, TP.HCM" },
  { id: "ORG-00042", name: "Công ty TNHH An Phát", taxCode: "0312345678", phone: "02839001122", contactPerson: "Trần Hành Chính · 0911222333", address: "Bình Dương" },
  { id: "ORG-00043", name: "Công ty CP Sao Việt", taxCode: "0301122334", phone: "02838778899", contactPerson: "Lê Kế Toán · 0909888777", address: "Q.7, TP.HCM" },
  { id: "ORG-00044", name: "Công ty TNHH Minh Long", taxCode: "0305566778", phone: "02839556677", contactPerson: "Phạm Nhân Sự · 0933444555", address: "Đồng Nai" },
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  { id: "GRP-00012", orgId: "ORG-00041", pkg: "Gói khám đoàn Cơ bản (GK-DN-CB)", size: 200, expectedDate: "15/11/2026", stage: "OPEN", pic: "Hoàng Nhân Viên", negotiation: timeline([["Gặp mặt", "Khởi tạo cơ hội, gửi báo giá sơ bộ.", "Hoàng Nhân Viên", "01/10/2026 09:00"]]) },
  { id: "GRP-00011", orgId: "ORG-00042", pkg: "Gói khám đoàn Nâng cao (GK-DN-NC)", size: 120, expectedDate: "02/11/2026", stage: "GROUP_CONFIRMED", pic: "Đinh Nhân Viên", negotiation: timeline([["Gặp mặt", "Thống nhất gói Nâng cao, 120 CBNV.", "Hoàng Nhân Viên", "05/10/2026 10:10"]]) },
  { id: "GRP-00010", orgId: "ORG-00041", pkg: "Gói khám đoàn Cơ bản (GK-DN-CB)", size: 85, expectedDate: "20/10/2026", stage: "GROUP_WON", pic: "Hoàng Nhân Viên", negotiation: timeline([["Ký biên bản", "BBTT-2026-010.", "Hoàng Nhân Viên", "01/10/2026 16:00"]]) },
  { id: "GRP-00009", orgId: "ORG-00043", pkg: "Gói khám đoàn Nâng cao (GK-DN-NC)", size: 150, expectedDate: "28/11/2026", stage: "OPEN", pic: "Đinh Nhân Viên", negotiation: [] },
  { id: "GRP-00008", orgId: "ORG-00044", pkg: "Gói khám đoàn Cơ bản (GK-DN-CB)", size: 60, expectedDate: "—", stage: "GROUP_LOST", pic: "Hoàng Nhân Viên", lostReason: "Chọn đối tác khác", negotiation: timeline([["Thất bại", "Doanh nghiệp chọn đơn vị khám lưu động gần khu công nghiệp.", "Hoàng Nhân Viên", "30/09/2026 11:00"]]) },
];

export const INITIAL_LEADS: Lead[] = [
  { id: "LED-00981", name: "Lê Hoàng Minh", phone: "0901234567", email: "minh.le@example.com", org: "—", source: "WEBSITE", campaign: "TamSoatTimMach_Q4", pkg: "Tầm soát Tim mạch & Đột quỵ", department: "Phòng Kinh doanh", note: "Khách cần tư vấn gói tim mạch gấp.", stage: "QUALIFIED", pic: "Hoàng Nhân Viên", createdAt: "07/10/2026 08:40", contactId: "CTC-00123",
    timeline: timeline([["Gọi điện", "Đã tư vấn gói, khách quan tâm.", "Hoàng Nhân Viên", "07/10/2026 08:45"]]),
    audit: audit([["ASSIGN_PIC", "Giao Hoàng Nhân Viên", "Nguyễn Trưởng Phòng", "07/10/2026 08:52"], ["UPDATE_STAGE", "CONTACTING → QUALIFIED", "Hoàng Nhân Viên", "07/10/2026 08:45"]]) },
  { id: "LED-00980", name: "Trần Thị Mai", phone: "0912345678", email: "—", org: "—", source: "MOBILE_APP", campaign: "App_Launch_Promo", pkg: "—", department: "Phòng Kinh doanh", note: "", stage: "NEW", pic: "", createdAt: "07/10/2026 08:12", contactId: "CTC-00487", timeline: [], audit: [] },
  { id: "LED-00979", name: "Phạm Thu Hà", phone: "0987654321", email: "ha.pham@example.com", org: "—", source: "MANUAL", campaign: "KhamTongQuat_2026", pkg: "Khám định kỳ Cơ bản – Nữ", department: "Phòng Kinh doanh", note: "", stage: "CONTACTING", pic: "Hoàng Nhân Viên", createdAt: "06/10/2026 16:25", contactId: "CTC-00212", timeline: [], audit: [] },
  { id: "LED-00978", name: "Võ Minh Khoa", phone: "0903456789", email: "—", org: "—", source: "UPLOAD", campaign: "KhamTongQuat_2026", pkg: "Khám Nâng cao – Nam", department: "Phòng Kinh doanh", note: "", stage: "BOOKED", pic: "Đinh Nhân Viên", createdAt: "06/10/2026 14:03", contactId: "CTC-00305", bookingAt: "09/10/2026 08:00", timeline: [], audit: [] },
  { id: "LED-00977", name: "Đặng Ngọc Lan", phone: "0934567890", email: "—", org: "—", source: "WEBSITE", campaign: "MeBau_ThangSinh", pkg: "Khám Tiền sản", department: "Phòng Kinh doanh", note: "", stage: "CONTACTING", pic: "Hoàng Nhân Viên", createdAt: "06/10/2026 10:18", contactId: "CTC-00341", timeline: [], audit: [] },
  { id: "LED-00976", name: "Nguyễn Quốc Bảo", phone: "0945678901", email: "—", org: "—", source: "MOBILE_APP", campaign: "TamSoatTimMach_Q4", pkg: "Tầm soát Tim mạch & Đột quỵ", department: "Phòng Kinh doanh", note: "", stage: "LOST", pic: "Đinh Nhân Viên", createdAt: "05/10/2026 15:50", contactId: "CTC-00098", lostReason: "Chi phí cao", timeline: [], audit: [] },
  { id: "LED-00975", name: "Hoàng Thị Yến", phone: "0956789012", email: "—", org: "—", source: "UPLOAD", campaign: "KhamTongQuat_2026", pkg: "Khám định kỳ Cơ bản – Nữ", department: "Phòng Kinh doanh", note: "", stage: "QUALIFIED", pic: "Đinh Nhân Viên", createdAt: "05/10/2026 09:30", contactId: "CTC-00402", timeline: [], audit: [] },
  { id: "LED-00974", name: "Bùi Đức Anh", phone: "0967890123", email: "anh.bd@example.com", org: "—", source: "WEBSITE", campaign: "TamSoatTimMach_Q4", pkg: "Tầm soát Tim mạch & Đột quỵ", department: "Phòng Kinh doanh", note: "", stage: "BOOKED", pic: "Hoàng Nhân Viên", createdAt: "04/10/2026 11:05", contactId: "CTC-00156", bookingAt: "11/10/2026 09:30", timeline: [], audit: [] },
  { id: "LED-00973", name: "Phan Thanh Tâm", phone: "0978901234", email: "—", org: "—", source: "MANUAL", campaign: "—", pkg: "Tổng quát Nhi", department: "Phòng Kinh doanh", note: "", stage: "NEW", pic: "", createdAt: "04/10/2026 09:48", contactId: "CTC-00433", timeline: [], audit: [] },
  { id: "LED-00972", name: "Đỗ Hải Nam", phone: "0989012345", email: "—", org: "—", source: "MOBILE_APP", campaign: "App_Launch_Promo", pkg: "Tầm soát Tiêu hóa – Gan mật", department: "Phòng Kinh doanh", note: "", stage: "CONTACTING", pic: "Đinh Nhân Viên", createdAt: "03/10/2026 17:20", contactId: "CTC-00277", timeline: [], audit: [] },
];

export const SOURCE_PERFORMANCE = [
  { name: "Website", lead: 62, booked: 19, rate: "31%" },
  { name: "Mobile App", lead: 39, booked: 9, rate: "23%" },
  { name: "Tải tệp Excel/CSV", lead: 36, booked: 7, rate: "19%" },
  { name: "Nhập tay", lead: 26, booked: 9, rate: "35%" },
];

export const CAMPAIGN_PERFORMANCE = [
  { name: "Tầm soát tim mạch Q4", lead: 49, booked: 16, rate: "33%" },
  { name: "Gói khám tổng quát 2026", lead: 42, booked: 11, rate: "26%" },
  { name: "Khám đoàn doanh nghiệp Q4", lead: 23, booked: 4, rate: "17%" },
  { name: "Mẹ bầu tháng sinh", lead: 26, booked: 6, rate: "23%" },
  { name: "Ra mắt Mobile App", lead: 23, booked: 5, rate: "22%" },
];
