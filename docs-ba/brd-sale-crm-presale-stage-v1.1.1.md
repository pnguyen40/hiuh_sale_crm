---
title: "Sale CRM - BRD for presale stage"
document_id: "HBH-SCRM-BRD"
version: "1.1.1"
status: "draft"
lifecycle_note: "Pre-sales Solution Validation — Khung yêu cầu nghiệp vụ gửi bộ phận Kinh doanh HIUH"
date: "2026-11-09"
predecessor: "./brd-sale-crm-presale-stage-v1.1.0.md"
change_type: "brd-detail-simplification"
version_rationale: "Rút gọn mục 10 về mức yêu cầu nghiệp vụ theo format v1.0.0; không thay đổi phạm vi chức năng."
ai_log_ref: "../log/ai-log.md"
decision_log_ref: "../log/decision-log.md"
prd_ref: "./prd-sale-crm-phase1-mvp-v1.1.0.md"
change_request: "CR-MOB-01 — Mapping tài khoản HIUH Connect vào B2C"
decision_refs: ["DEC-HBH-SCRM-065", "DEC-MOB-01", "DEC-MOB-02", "DEC-MOB-03", "DEC-MOB-04", "DEC-MOB-05", "DEC-MOB-06", "DEC-MOB-07", "DEC-MOB-08", "DEC-MOB-09"]
type: "Business Requirements Document"
description: "Khung yêu cầu nghiệp vụ Sale CRM phục vụ xác thực giải pháp và walkthrough với bộ phận Kinh doanh HIUH."
tags: ["sale-crm", "brd", "presale", "hiuh"]
generated: { by: "hermes/gpt-6-astra", at: "2026-11-09T16:31:56+07:00", based_on: "BRD v1.1.0; format v1.0.0" }
sources:
  - id: brd-v1-1-0
    resource: "./brd-sale-crm-presale-stage-v1.1.0.md"
    title: "BRD đầu vào v1.1.0, quyết định và tiêu chí CR-MOB-01"
  - id: brd-v1-0-0
    resource: "./brd-sale-crm-presale-stage-v1.0.0.md"
    title: "BRD gốc v1.0.0"
  - id: prd-v1-1-0
    resource: "./prd-sale-crm-phase1-mvp-v1.1.0.md"
    title: "PRD v1.1.0 — đặc tả CR-MOB-01"
---

# 📋 Sale CRM — BRD for presale stage — v1.1.1

> **Business Requirements Document · Pre-sales Solution Validation**
> CRM y tế cho Phòng Kinh doanh Bệnh viện Đại học Quốc tế Hồng Bàng (HIUH)
> Khung xác thực giải pháp và chốt phạm vi dự án — dùng cho buổi walkthrough với bộ phận Kinh doanh (Sale team)
> [Trang BRD tham chiếu lịch sử trên Notion](https://app.notion.com/p/nexlabtechnology/Sale-CRM-BRD-3f72c7d6a90381858d1ef601d4fa9c9f?source=copy_link) — chưa đồng bộ bản v1.1.1 trong phạm vi công việc này.

| | |
|---|---|
| Mục tiêu tài liệu | Khung xác thực giải pháp tiền bán hàng (Pre-sales Solution Validation) & Walkthrough cho bộ phận Kinh doanh |
| Dự án & Nền tảng | Sale CRM Bệnh viện Đại học Quốc tế Hồng Bàng (HIUH) – Phân hệ trên Operation Portal |
| Stakeholder chính | Phòng Kinh doanh (Trưởng phòng, Phó phòng, Nhân viên kinh doanh / tư vấn) & Ban Giám đốc HIUH |
| Phân hệ | CRM Phòng Kinh doanh & Marketing (Khách lẻ B2C, Khám đoàn B2B, Hồ sơ & Tương tác, Dashboard Funnel/Pipeline) |
| Nền tảng triển khai | Phân hệ Sale CRM trên Operation Portal |
| Đơn vị soạn | Nexlab Technology (Senior BA) |
| Phiên bản · Ngày | v1.1.1 — Rút gọn CR-MOB-01 ở mức BRD · 09/11/2026 |

Quy ước: **[Cần bệnh viện xác nhận]** là nội dung cần làm rõ và thống nhất cùng bộ phận Kinh doanh. **P0** = Bắt buộc cho giai đoạn 1 (MVP), **P1** = Ưu tiên cao. Nhãn giao diện người dùng sử dụng thống nhất là **Hồ sơ tư vấn**, không dùng nhãn "Lead".

**Thay đổi v1.1.1:** rút gọn mục 10 về mục tiêu, yêu cầu nghiệp vụ và ranh giới; giữ phạm vi CR-MOB-01 của v1.1.0. Chi tiết triển khai và nghiệm thu tiếp tục tham chiếu PRD v1.1.0. Các tài liệu EPIC, Visual, Plan và Constitution kế thừa vẫn là tham chiếu lịch sử.

## Thuật ngữ & Khái niệm cốt lõi CRM (CRM Terminologies)

| Thuật ngữ | Thuật ngữ tiếng Anh | Định nghĩa & Ý nghĩa nghiệp vụ |
|---|---|---|
| **Người liên hệ** | Contact | Cá nhân thực hiện liên hệ, trao đổi với bệnh viện qua các kênh tiếp nhận (Website, Hotline, Mobile App, trực tiếp tại quầy...). Một người liên hệ có thể hỏi thông tin cho bản thân hoặc đại diện cho người khác (người thân, đại diện tổ chức). Không mặc định Người liên hệ là người bệnh (`Patient`). |
| **Hồ sơ tư vấn** | Consultation Case | Thực thể quản lý một nhu cầu tư vấn dịch vụ của khách lẻ (B2C), đi qua phễu chuyển đổi từ Tiếp nhận đến khi Đặt hẹn (`NEW → CONTACTING → QUALIFIED → BOOKED` hoặc `LOST`). Một Người liên hệ có thể phát sinh nhiều Hồ sơ tư vấn độc lập theo các thời điểm hoặc nhu cầu/chiến dịch khác nhau (quan hệ 1–N). |
| **Cơ hội khám đoàn** | Group Opportunity | Cơ hội kinh doanh/thương vụ phục vụ khách hàng tổ chức, doanh nghiệp (B2B) khám sức khỏe định kỳ cho cán bộ nhân viên hoặc học sinh sinh viên. Được quản lý theo quy trình thương vụ độc lập (`OPEN → IN_PROGRESS → GROUP_CONFIRMED → GROUP_WON / GROUP_LOST`), gắn với thông tin Tổ chức và Người liên hệ đầu mối; tách biệt hoàn toàn với phễu khách lẻ. |
| **Đầu mối thô** | Lead | Khái niệm chỉ thông tin liên hệ sơ bộ, chưa qua thẩm định nhu cầu. Trong phạm vi giải pháp hiện tại, hệ thống không sử dụng nhãn "Lead" trên giao diện nghiệp vụ mà chuẩn hóa thành "Hồ sơ tư vấn" ngay khi được tiếp nhận vào phễu. |
| **Người phụ trách** | Person In Charge (PIC) | Nhân viên kinh doanh hoặc chuyên viên tư vấn (`STAFF - SALES`) chịu trách nhiệm trực tiếp theo dõi, liên hệ, chăm sóc và cập nhật tiến độ của một Hồ sơ tư vấn hoặc Cơ hội khám đoàn. |
| **Dòng thời gian tương tác** | Activity Timeline | Nhật ký ghi nhận theo trình tự thời gian mọi hoạt động tương tác với khách hàng (cuộc gọi, tư vấn trực tiếp, ghi chú thông tin, phân công hoặc chuyển giao người phụ trách). |
| **Ghi chú tư vấn** | Note | Nội dung ghi nhận thông tin chi tiết về nhu cầu, phản hồi hoặc lưu ý về khách hàng; áp dụng nguyên tắc chỉ ghi nối thêm (`append-only`), không được chỉnh sửa hoặc xóa nhằm bảo toàn lịch sử tương tác. |
| **Phễu chuyển đổi** | Funnel | Chế độ báo cáo thống kê lũy kế số lượng hồ sơ đã từng đạt qua từng chặng trong phễu theo thời gian, đo lường tỷ lệ chuyển đổi (`Conversion Rate`) giữa các chặng. |
| **Đường ống tác nghiệp** | Pipeline | Chế độ báo cáo phân bổ số lượng hồ sơ hiện đang dừng tại từng chặng ở thời điểm hiện tại, phục vụ việc điều phối và quản lý tải công việc của tư vấn viên. |
| **Lý do thất bại** | Loss Reason | Danh mục lý do chuẩn hóa bắt buộc phải chọn khi đóng một Hồ sơ tư vấn (`LOST`) hoặc Cơ hội khám đoàn (`GROUP_LOST`) nhằm phục vụ phân tích nguyên nhân mất khách (như giá, khoảng cách, đã khám nơi khác, sai thông tin...). |
| **Hẹn khám tư vấn** | Booked Appointment | Mốc ghi nhận khách hàng đồng ý ngày/khung giờ khám dự kiến trong CRM; là cam kết giữa bộ phận kinh doanh và khách hàng, tách biệt với lịch khám chính thức trên hệ thống quản lý bệnh viện (`HIS`). |
| **Chiến dịch & Nguồn tiếp nhận** | Campaign & Source | Kênh phát sinh hồ sơ (Website HIUH, Mobile App HIUH Connect (PHR+), Hotline, Nhập tay, Tệp danh sách) kèm các tham số chiến dịch tiếp thị (UTM Campaign/Source/Medium) để đo lường hiệu quả truyền thông. |
| **Vết kiểm toán** | Audit Trail | Nhật ký hệ thống ghi nhận bất biến mọi thao tác trọng yếu (phân công, đổi chặng, xuất dữ liệu) kèm định danh người thực hiện, thời gian và kết quả nhằm phục vụ kiểm soát tuân thủ và bảo mật. |

**Quy tắc phân định cốt lõi:**
1. **Quan hệ 1–N giữa Contact và Hồ sơ tư vấn:** Một Người liên hệ có thể có nhiều Hồ sơ tư vấn theo thời gian (ví dụ: tư vấn gói thai sản tháng 1, tư vấn khám sức khỏe tổng quát tháng 10). Mọi tương tác và hồ sơ đều liên kết về Người liên hệ gốc.
2. **Tách biệt B2C và B2B:** Khách lẻ đi theo phễu 4 chặng của Hồ sơ tư vấn. Khám đoàn doanh nghiệp đi theo quy trình 5 trạng thái của Cơ hội khám đoàn, quản lý theo đơn vị/tổ chức, không trộn lẫn vào phễu khách lẻ.
3. **Phân quyền và bảo mật dữ liệu y tế:** Chỉ phòng Kinh doanh (`SALES`) thao tác cập nhật tiến độ; phòng Marketing (`MKT`) chỉ đọc dữ liệu để đo lường hiệu quả nguồn/chiến dịch. Tuyệt đối không lưu trữ dữ liệu khám chữa bệnh lâm sàng trên CRM.

---

## 1. Tóm tắt điều hành

Tài liệu này xác lập khung yêu cầu nghiệp vụ và phạm vi giải pháp Sale CRM cho Bệnh viện Đại học Quốc tế Hồng Bàng (HIUH), làm cơ sở cho **buổi walkthrough đầu tiên với bộ phận Kinh doanh** trước khi chốt phạm vi Phase 1 MVP và kế hoạch triển khai.

Sale CRM là một phân hệ vận hành trực thuộc **Operation Portal**, dùng chung hạ tầng đăng nhập và phân quyền, phục vụ hai bộ phận Kinh doanh (SALES) và Marketing (MKT). Toàn bộ luồng nghiệp vụ cốt lõi được thiết kế hoàn chỉnh với phân quyền 6 tổ hợp Department × Role và kịch bản xử lý ngoại lệ.

| | |
|---|---|
| **Khách lẻ (B2C)** | Hồ sơ tư vấn đi qua bốn chặng Tiếp nhận (NEW) → Đang liên hệ (CONTACTING) → Đủ điều kiện (QUALIFIED) → Đã đặt hẹn (BOOKED), hoặc kết thúc LOST có lý do; cảnh báo trùng nhưng không tự động gộp. |
| **Khám đoàn (B2B)** | Tổ chức/đoàn → cơ hội độc lập → Group Confirmed → Group Won hoặc Group Lost (không gộp khách lẻ; không quản lý roster cá nhân). |
| **Báo cáo & Phân quyền** | Dashboard 2 chế độ Funnel (lũy kế) & Pipeline (đang ở chặng); phân quyền 2 chiều Department × Role; Audit Trail bất biến. |

Kết quả mong muốn sau walkthrough: Bộ phận Kinh doanh xác nhận quy trình vận hành thực tế, chốt danh sách yêu cầu P0 và thống nhất ma trận phân quyền, làm căn cứ hoàn thiện Presale BRD chính thức và PRD.

---

## 2. Bối cảnh và vấn đề kinh doanh

Các vấn đề dưới đây tổng hợp từ khảo sát và định hướng phát triển của HIUH; cần bộ phận Kinh doanh xác nhận mức độ ảnh hưởng trong buổi walkthrough.

| Vấn đề | Biểu hiện | Hệ quả kinh doanh |
|---|---|---|
| Khách hàng tiềm năng phân tán và thất thoát nguồn gốc | Thông tin đến từ Website HIUH, Mobile App HIUH Connect (PHR+), Kiosk sảnh, hotline và tại quầy nằm rời rạc; nhập Excel thủ công dễ mất dấu. | Mất khách, tư vấn viên gọi trùng hoặc bỏ sót; không đo được hiệu quả từng kênh và chiến dịch. |
| Phản hồi chậm & thiếu chủ quản (PIC) | Không có người phụ trách rõ ràng ngay khi hồ sơ phát sinh; thiếu quy chuẩn thời gian phản hồi đầu tiên. | Khách chuyển sang bệnh viện khác trong thời gian chờ; giảm tỷ lệ chuyển đổi, ảnh hưởng uy tín HIUH. |
| Đặt hẹn chưa đồng bộ & dễ nhầm với HIS | Tư vấn viên ghi nhận hẹn nhưng chưa xác thực slot thực tế; nhầm lẫn cam kết đặt hẹn của sale với lịch khám HIS chính thức. | Tỷ lệ vắng mặt cao; khách đến nhưng không có bác sĩ hoặc slot phù hợp; xung đột tại quầy tiếp đón. |
| Hồ sơ và tương tác bị chia cắt | Lịch sử cuộc gọi, tin nhắn, ghi chú nằm rải rác trên sổ tay/file cá nhân; thất lạc khi bàn giao nhân sự. | Tư vấn thiếu ngữ cảnh, không nắm nhu cầu hoặc gói khám khách từng quan tâm; trải nghiệm người bệnh gián đoạn. |
| Quản lý khám đoàn B2B bằng bảng tính | Theo dõi cơ hội khám công ty, trường học qua Excel rời rạc; lẫn tiến độ khám đoàn với lịch khám lẻ. | Sai lệch quy mô đoàn, chậm nghiệm thu, khó dự báo tải khám, mất dấu vết đàm phán. |
| Báo cáo thiếu trực quan và chiều sâu | Không bóc tách phễu lũy kế (Funnel) với số đang xử lý (Pipeline); không lọc theo nguồn, chiến dịch, nhân viên. | Lãnh đạo khó đánh giá năng suất thực tế; không có căn cứ tối ưu ngân sách tiếp thị. |

---

## 3. Mục tiêu

### 3.1 Mục tiêu kinh doanh của giải pháp

1. **100% Hồ sơ tư vấn có nguồn gốc và PIC chịu trách nhiệm:** tiếp nhận tập trung từ các nguồn MVP (Website HIUH, Mobile App HIUH Connect (PHR+), upload Excel, nhập tay), không bỏ sót khách hàng tiềm năng nào.
2. **Minh bạch dòng thời gian tương tác (Activity Timeline & Note):** ghi nhận đầy đủ cuộc gọi, tương tác và ghi chú tư vấn theo cơ chế chỉ nối thêm (append-only), không sửa hoặc xóa.
3. **Theo dõi độc lập hai hành trình B2C và B2B:** khách lẻ theo bốn chặng `NEW → CONTACTING → QUALIFIED → BOOKED`, hoặc kết thúc `LOST` có lý do chuẩn hóa; khám đoàn theo dõi cơ hội đến `Group Confirmed/Won` hoặc `Group Lost`.
4. **Ra quyết định dựa trên dữ liệu trực quan:** Dashboard 2 chế độ Funnel (lũy kế) và Pipeline (đang ở chặng), lọc theo Kỳ, Phòng ban, Nhân viên, Nguồn và Chiến dịch.
5. **Bảo mật, phân quyền chặt chẽ và tuân thủ:** phân quyền 2 chiều Department × Role, Audit Trail bất biến; cấm tuyệt đối lưu trữ hoặc hiển thị dữ liệu lâm sàng/bệnh án.

Chỉ tiêu định lượng (SLA phút phản hồi, tỷ lệ chuyển đổi mục tiêu) **[Cần bệnh viện xác nhận]** theo số liệu vận hành thực tế.

### 3.2 Mục tiêu của giai đoạn pre-sales & buổi walkthrough

| Mục tiêu | Cách đạt | Tiêu chí hoàn thành |
|---|---|---|
| Xác thực quy trình nghiệp vụ | Trình diễn và walkthrough bốn chặng khách lẻ B2C và quy trình khám đoàn B2B trên giao diện giải pháp. | Bộ phận Kinh doanh xác nhận mức phù hợp hoặc chỉ ra điểm cần hiệu chỉnh cho từng chặng. |
| Rà soát và chốt danh mục P0 | Đối chiếu bảng yêu cầu Mục 7, đánh giá theo 4 mức: Giữ / Sửa / Bỏ / Bổ sung. | Trưởng phòng Kinh doanh phê duyệt danh sách yêu cầu bắt buộc cho Phase 1 MVP. |
| Xác thực ma trận phân quyền | Trình diễn kiểm soát truy cập 6 tổ hợp Department × Role và nguyên tắc không tự duyệt. | Ma trận Mục 8 và cơ chế phân bổ thủ công được chấp thuận. |
| Định hình ranh giới tích hợp | Làm rõ ranh giới CRM với HIS, Operation Portal và định dạng file khám đoàn. | Đủ cơ sở để hoàn thiện Presale BRD và lập kế hoạch triển khai. |

---

## 4. Stakeholder và người dùng

| Vai trò | Quan tâm chính | Vai trò trong pre-sales |
|---|---|---|
| Ban Giám đốc (CEO / BOD) | Doanh thu, tỷ lệ chuyển đổi, hiệu quả ngân sách tiếp thị, an toàn dữ liệu y tế. | Định hướng chiến lược, phê duyệt phạm vi và ngân sách. |
| Trưởng phòng Kinh doanh (HEAD - SALES) | Bức tranh pipeline, doanh số B2C/B2B, phân bổ chỉ tiêu, năng suất nhân viên, kiểm soát cơ hội đoàn. | Chủ trì nghiệp vụ, chốt P0, phê duyệt quy trình và ma trận phân quyền. |
| Phó phòng Kinh doanh (DEPUTY_HEAD - SALES) | Phân bổ hồ sơ, giám sát phản hồi, theo dõi tiến độ hàng ngày, hỗ trợ chốt khám đoàn. | Xác thực luồng phân công thủ công, quy trình tư vấn và báo cáo tác nghiệp. |
| Nhân viên Kinh doanh / Tư vấn (STAFF - SALES) | Danh sách hồ sơ được giao, bộ lọc công việc, ghi cuộc gọi/note nhanh, theo dõi trạng thái. | Trực tiếp đánh giá quy trình thao tác và độ tiện dụng của giao diện. |
| Bộ phận Marketing (MKT: HEAD / DEPUTY_HEAD / STAFF) | Thu thập đa nguồn, hiệu quả chiến dịch (Campaign/UTM), chất lượng hồ sơ từ Website và Mobile App. | Xác thực nguồn dữ liệu, quy tắc gán chiến dịch, chỉ số chuyển đổi. |
| Đội ngũ Nexlab (Presale Lead, Senior BA) | Hiểu nhu cầu thực tế, kiểm soát trần phạm vi MVP, thu thập phản hồi có cấu trúc. | Chủ trì walkthrough, điều phối demo, ghi nhận phản hồi và cập nhật tài liệu. |

---

## 5. Phạm vi

**Trong phạm vi (Phase 1 MVP)**

- Tiếp nhận đa nguồn: Website HIUH, tài khoản đăng ký HIUH Connect qua module “Tài khoản bệnh nhân” (CR-MOB-01), upload Excel (kiểm tra cấu trúc, báo lỗi theo dòng; nhập dòng hợp lệ, bỏ dòng lỗi), nhập tay.
- Nhận diện & cảnh báo trùng Contact: so khớp độc lập theo SĐT và Email tại bước tiếp nhận, liệt kê mọi Contact khớp; người tiếp nhận chọn liên kết Contact cũ hoặc tạo mới (không tự động gộp, Contact mới được phép trùng khóa).
- Quan hệ Contact 1–N Hồ sơ tư vấn: một người liên hệ có thể phát sinh nhiều Hồ sơ tư vấn độc lập theo nhu cầu và chiến dịch; người liên hệ không nhất thiết là người được khám.
- Phân công & chuyển giao PIC thủ công: HEAD/DEPUTY_HEAD giao hồ sơ cho STAFF; lưu lịch sử; không tự động chia.
- Activity Timeline & Note: ghi cuộc gọi, tương tác; ghi chú chỉ nối thêm.
- Phễu khách lẻ B2C bốn chặng: `NEW → CONTACTING → QUALIFIED → BOOKED`, hoặc `LOST` có lý do chuẩn hóa.
- Pipeline khám đoàn B2B: lưu tổ chức, đầu mối, gói/ngày/quy mô dự kiến; theo dõi Open/In Progress → Group Confirmed → Group Won hoặc Group Lost.
- Dashboard 2 chế độ: Funnel (lũy kế) và Pipeline (đang ở chặng); phân tích theo Nguồn, Chiến dịch, Phòng ban, PIC.
- Phân quyền 2 chiều Department × Role: 6 tổ hợp kiểm soát màn hình, dữ liệu và export; Audit Trail chỉ đọc bất biến.

**Ngoài phạm vi (Out of Scope / Giai đoạn sau)**

- Tích hợp 2 chiều tự động với HIS (dữ liệu giai đoạn này ghi nhận độc lập trên CRM).
- Patient ID HIS, mã BHYT, CCCD, dữ liệu lâm sàng hoặc bản sao production dùng làm dữ liệu demo. CR-MOB-01 bổ sung luồng dữ liệu tài khoản/liên hệ tối thiểu từ HIUH Connect; bộ dữ liệu demo vẫn giả lập, tách khỏi dữ liệu vận hành.
- Dữ liệu lâm sàng: cấm tuyệt đối kết quả khám, xét nghiệm, chẩn đoán hình ảnh, toa thuốc, tiền sử bệnh án.
- Vận hành khám thực tế: `BOOKED → Walk-in` (CRM ↔ HIS), check-in tại quầy, hàng đợi phòng khám.
- Hủy sau `BOOKED` và mở lại hồ sơ `LOST`: chưa có quyết định; khách `LOST` quay lại được xử lý ở giai đoạn sau.
- Kiosk tạo Hồ sơ tư vấn: Kiosk trong giai đoạn này chỉ ghi nhận Activity khi đã nhận diện Contact.
- Roster thành viên đoàn và check-in cá nhân trong khám đoàn.
- Tự động chia hồ sơ (round-robin, auto-assign, self-claim), SLA đếm ngược tự động.
- AI scoring, dự báo doanh thu, gợi ý hành động tiếp theo.
- B2B Portal tự phục vụ, hợp đồng pháp lý đầy đủ, kế toán công nợ/hóa đơn điện tử.

---

## 6. Quy trình nghiệp vụ

**Tham khảo** sơ đồ tại Sale CRM Visual Workflows v0.6.2 (tham chiếu lịch sử ngoài gói tài liệu này): Journey Map (Mục 1), Swimlane (Mục 2), State Transition (Mục 3), ERD 8 thực thể lịch sử (Mục 4). ERD hiện hành có thêm liên kết mobile tại PRD v1.1.0 §5.2.

### 6.1 Phễu khách lẻ (B2C)

Phễu một lớp, bốn chặng. Thực thể đi qua phễu là **Hồ sơ tư vấn** (`Consultation Case`), gắn với một Contact.

```text
Tiếp nhận (NEW) → Đang liên hệ (CONTACTING) → Đủ điều kiện (QUALIFIED) → Đã đặt hẹn (BOOKED)
     │                    │                          │
     └─(sai thông tin)────┴──────────────────────────┴──→ Thất bại (LOST), bắt buộc lý do
```

| Chặng | Enum | Điều kiện vào chặng | Dữ liệu bắt buộc | Người thực hiện |
|---|---|---|---|---|
| Tiếp nhận | `NEW` | Tiếp nhận hợp lệ từ nguồn MVP; đã xử lý cảnh báo trùng (INT-07); cấp `case_id`. Hồ sơ tạo tự động, không cần nhân viên xác nhận thêm. | `contact_id`, `source`, `created_at` | Hệ thống + người tiếp nhận (xử lý trùng) |
| Đang liên hệ | `CONTACTING` | PIC đã được gán (WRK-01); PIC chủ động chuyển chặng khi bắt đầu liên hệ tư vấn. Không yêu cầu có Activity trước (khuyến khích ghi Activity CUS-03 cùng lúc). | + `pic_id` | STAFF (hoặc HEAD/DEPUTY_HEAD) |
| Đủ điều kiện | `QUALIFIED` | Xác định được nhu cầu; gắn gói khám/dịch vụ quan tâm (IND-02). | + `service_package_id` | PIC |
| Đã đặt hẹn | `BOOKED` | Khách đồng ý ngày/khung giờ khám dự kiến (IND-03). Chỉ chuyển từ `QUALIFIED`. | + `expected_appointment_date` | PIC |
| Thất bại | `LOST` | Từ `CONTACTING` hoặc `QUALIFIED` với lý do chuẩn hóa; từ `NEW` chỉ khi lý do là sai thông tin (IND-05). Không chuyển từ `BOOKED`. | `loss_reason_code` | PIC |

**Quy tắc nghiệp vụ**

- **Không bỏ qua chặng:** chuyển tuần tự `NEW → CONTACTING → QUALIFIED → BOOKED`. Không chuyển ngược, không chuyển tắt.
- **Đổi chặng thủ công hoàn toàn:** mọi chuyển chặng do PIC (hoặc HEAD/DEPUTY_HEAD trong phạm vi phòng) bấm chọn; hệ thống không tự đổi chặng theo Activity, Note hay sự kiện nào. Hệ thống chỉ kiểm tra dữ liệu bắt buộc của chặng đích (bảng trên) và ma trận chuyển hợp lệ; thiếu dữ liệu thì từ chối và báo lỗi. Mỗi lần đổi chặng ghi Audit Trail (IAM-04).
- **Ngoại lệ đồng bộ mobile (CR-MOB-01):** liên kết tài khoản đã xác định dùng lại đúng Contact/hồ sơ; giữ stage hiện tại, kể cả `BOOKED` và `LOST`. Chỉ hồ sơ thực sự mới được tạo ở `NEW`; không tự tăng chặng do đăng ký ứng dụng hoặc OTP. Lần đầu khớp SĐT/email cần xác nhận Contact và hồ sơ đích (§10.2).
- **Cảnh báo trùng xử lý tại bước tiếp nhận:** khi phát hiện trùng SĐT hoặc Email, người tiếp nhận chọn liên kết Hồ sơ tư vấn vào Contact hiện có hoặc tạo Contact mới. Hồ sơ mới chỉ xuất hiện ở `NEW` sau khi lựa chọn được lưu; nếu CR-MOB-01 liên kết hồ sơ đã có thì giữ stage hiện tại. Không tự động gộp.
- **Quy tắc khớp trùng:** so khớp độc lập theo từng khóa SĐT và Email (chuẩn hóa trước khi so). Hệ thống liệt kê **mọi** Contact khớp bất kỳ khóa nào, ghi rõ khớp theo khóa gì; người tiếp nhận chọn đúng một Contact hoặc tạo Contact mới. Cho phép Contact mới trùng SĐT/Email với Contact cũ (ví dụ người thân dùng chung SĐT); hệ thống không chặn và không gộp. Lựa chọn và danh sách ứng viên được lưu vết (IAM-04).
- **Không tự động đóng hồ sơ:** gọi không nghe máy hoặc chưa liên hệ được, hệ thống hỗ trợ tạo task gọi lại; hồ sơ giữ nguyên chặng cho đến khi PIC cập nhật.
- **`LOST` bắt buộc lý do chuẩn hóa:** giá, khoảng cách, không liên lạc được, đã khám nơi khác, sai thông tin… để phân tích nguyên nhân mất khách. **[Cần bệnh viện xác nhận]** danh mục cuối cùng.
- **`LOST` là kết thúc:** không mở lại trong phạm vi giai đoạn 1. Khách quay lại được xử lý ở giai đoạn sau (xem Mục 5 Ngoài phạm vi).
- **Ranh giới `BOOKED`:** chỉ ghi nhận thỏa thuận ngày/khung giờ dự kiến giữa tư vấn viên và khách; KHÔNG phải lịch khám bệnh viện (HIS Appointment) chính thức; không đồng nghĩa khách chắc chắn đến viện.

Giai đoạn kế tiếp (ngoài MVP): `BOOKED → Walk-in` qua tích hợp CRM ↔ HIS; mapping `patient_id` là nice-to-have.

### 6.2 Pipeline doanh nghiệp (B2B)

Năm trạng thái, enum thống nhất với `GROUP_OPPORTUNITY.stage` trong ERD (Visual §4) và GRP-13. Không có trạng thái Intake hay Negotiating riêng; đàm phán, đề xuất phương án nằm trong `IN_PROGRESS` (báo giá/phê duyệt chính thức ngoài MVP theo EPIC §7.1).

| Giai đoạn | Enum | Điều kiện chuyển sang giai đoạn này |
|---|---|---|
| 1. Mở | `OPEN` | Tiếp nhận thông tin doanh nghiệp (chặn trùng mã số thuế/tên đơn vị), Contact đầu mối và nhu cầu khám ban đầu; gán PIC B2B. |
| 2. Đang tiếp cận | `IN_PROGRESS` | Khảo sát quy mô nhân sự, địa điểm, danh mục khám, ngân sách dự kiến; trao đổi phương án gói khám và ngày dự kiến với doanh nghiệp. |
| 3. Xác nhận đoàn | `GROUP_CONFIRMED` | Doanh nghiệp chốt phương án: gói, ngày khám dự kiến và số lượng nhân sự dự kiến. |
| 4. Thành công | `GROUP_WON` | Ký hợp đồng nguyên tắc hoặc biên bản thỏa thuận khám đoàn. Chỉ từ `GROUP_CONFIRMED`. |
| 5. Thất bại | `GROUP_LOST` | Từ `OPEN`, `IN_PROGRESS` hoặc `GROUP_CONFIRMED`; bắt buộc `loss_reason_code`. Không từ `GROUP_WON`. |

Quy tắc: cơ hội khám đoàn quản lý và báo cáo hoàn toàn tách biệt; không cộng chung số đoàn vào KPI phễu khách lẻ.

---

## 7. Yêu cầu nghiệp vụ

Các yêu cầu nghiệp vụ dưới đây được phân loại theo từng nhóm chức năng, xác định mức độ ưu tiên triển khai và giao diện chức năng tương ứng.

### A. Tiếp nhận & Quản lý Hồ sơ tư vấn (EPIC-01)

| Mã | Yêu cầu nghiệp vụ | Ưu tiên | Màn hình liên quan |
|---|---|---|---|
| INT-01 | Tiếp nhận Hồ sơ tư vấn từ Website HIUH có source = WEBSITE. | P0 | Tiếp nhận hồ sơ (CRM-LEAD-INTAKE) |
| INT-02 | Đồng bộ tài khoản HIUH Connect từ “Tài khoản bệnh nhân” vào B2C theo CR-MOB-01; `source = MOBILE_APP` (“Dữ liệu di động”), tạo mới ở `NEW` hoặc giữ stage hồ sơ đã liên kết; lưu OTP hai trạng thái. | P0 | CRM-LEAD-INTAKE, CRM-LEAD-DUP, CRM-LEAD-LIST |
| INT-05 | Lưu nguồn gốc, chiến dịch (Campaign) và tham số UTM nếu có. | P0 | Chi tiết hồ sơ (CRM-LEAD-DETAIL) |
| INT-07 | Cảnh báo Contact có khả năng trùng tại bước tiếp nhận; so khớp độc lập theo SĐT và Email, liệt kê mọi Contact khớp kèm khóa khớp; người tiếp nhận chọn một Contact cũ hoặc tạo mới (được phép trùng SĐT/Email), không tự động gộp. Hồ sơ mới chỉ vào `NEW` sau khi xử lý; mobile được liên kết vào hồ sơ hiện có và giữ stage (§10.2). | P0 | Xử lý trùng Contact (CRM-LEAD-DUP) |
| INT-09 | Upload danh sách từ Excel có kiểm tra hợp lệ, hiển thị lỗi theo dòng trước khi xác nhận. Khi xác nhận: nhập các dòng hợp lệ, bỏ dòng lỗi (partial import); trả kết quả theo dòng (đã nhập / lỗi + nguyên nhân) để người dùng sửa và upload lại phần lỗi. Dòng hợp lệ nhưng trùng Contact đi qua INT-07 từng dòng. | P0 | Nhập danh sách Excel (CRM-LEAD-IMPORT) |
| INT-11 | Nhập Hồ sơ tư vấn thủ công từ các kênh ngoài kênh số. | P0 | Tạo mới hồ sơ (CRM-LEAD-CREATE) |
| CUS-01 | Danh sách Contact/Hồ sơ tư vấn tập trung, tìm kiếm và lọc theo nguồn, chiến dịch, chặng; bổ sung cột “Xác thực OTP” sau “Họ và tên” trên danh sách B2C (§10.2). | P0 | Danh sách hồ sơ (CRM-LEAD-LIST) |
| CUS-02 | Hồ sơ Contact liên kết 1–N Hồ sơ tư vấn; mỗi hồ sơ giữ `case_id`, nguồn gốc và lịch sử riêng. | P0 | Chi tiết hồ sơ (CRM-LEAD-DETAIL) |

### B. Phân công & Tương tác chăm sóc (EPIC-02)

| Mã | Yêu cầu nghiệp vụ | Ưu tiên | Màn hình liên quan |
|---|---|---|---|
| WRK-01 | Phân công và chuyển giao PIC thủ công từ HEAD/DEPUTY_HEAD cho STAFF; lưu vết lịch sử đổi PIC. | P0 | Danh sách hồ sơ (CRM-LEAD-LIST) |
| WRK-04 | Bộ lọc danh sách tác nghiệp theo Department, PIC, nguồn, campaign, hành trình và chặng. | P0 | Danh sách hồ sơ (CRM-LEAD-LIST) |
| CUS-03 | Activity Timeline ghi cuộc gọi, tư vấn, đổi PIC và mốc tiếp nhận sảnh. | P0 | Chi tiết hồ sơ (CRM-LEAD-DETAIL) |
| CUS-04 | Note chỉ nối thêm (append-only), cấm sửa hoặc xóa. | P0 | Chi tiết hồ sơ (CRM-LEAD-DETAIL) |

### C. Chuyển đổi khách lẻ B2C (EPIC-03)

| Mã | Yêu cầu nghiệp vụ | Ưu tiên | Màn hình liên quan |
|---|---|---|---|
| IND-01 | Quản lý bốn chặng Hồ sơ tư vấn khách lẻ: `NEW → CONTACTING → QUALIFIED → BOOKED`, hoặc `LOST`. Chuyển tuần tự, không bỏ chặng, không chuyển ngược. PIC đổi chặng thủ công; hệ thống chỉ validate dữ liệu bắt buộc, không tự đổi chặng. | P0 | Chi tiết hồ sơ (CRM-LEAD-DETAIL) |
| IND-02 | Gắn gói khám sức khỏe/dịch vụ quan tâm (danh mục gói chuẩn hóa HIUH) khi hồ sơ đạt `QUALIFIED`. | P0 | Chi tiết hồ sơ (CRM-LEAD-DETAIL) |
| IND-03 | Ghi nhận `BOOKED` khi khách cam kết ngày/khung giờ khám dự kiến; chỉ từ `QUALIFIED`. | P0 | Chi tiết hồ sơ (CRM-LEAD-DETAIL) |
| IND-05 | Đóng `LOST` bắt buộc chọn lý do chuẩn hóa. Từ `NEW` chỉ chấp nhận lý do sai thông tin. Không đóng `LOST` từ `BOOKED`. | P0 | Chi tiết hồ sơ (CRM-LEAD-DETAIL) |

### D. Cơ hội khám đoàn B2B (EPIC-04)

| Mã | Yêu cầu nghiệp vụ | Ưu tiên | Màn hình liên quan |
|---|---|---|---|
| GRP-01 | Quản lý hồ sơ Tổ chức / Doanh nghiệp mức nhẹ gắn Contact đầu mối. | P1 | Quản lý tổ chức (CRM-B2B-ORG) |
| GRP-02 | Phạm vi cơ hội khám đoàn: gói khám, ngày dự kiến, số lượng nhân sự dự kiến. | P1 | Cơ hội khám đoàn (CRM-B2B-OPP) |
| GRP-13 | Vòng đời cơ hội khám đoàn: Open/In Progress → Group Confirmed → Group Won hoặc Group Lost. | P1 | Cơ hội khám đoàn (CRM-B2B-OPP) |

### E. Báo cáo Dashboard & Nền tảng quản trị (EPIC-05, IAM)

| Mã | Yêu cầu nghiệp vụ | Ưu tiên | Màn hình liên quan |
|---|---|---|---|
| DASH-01 | Báo cáo thống kê số lượng Hồ sơ tư vấn và kết quả theo nguồn tiếp nhận. | P0 | Báo cáo tổng quan (CRM-DASH-MAIN) |
| DASH-02 | Dashboard phễu khách lẻ B2C hiển thị bốn chặng `NEW`, `CONTACTING`, `QUALIFIED`, `BOOKED` kèm tỷ lệ chuyển chặng; `LOST` hiển thị tách riêng. | P0 | Báo cáo tổng quan (CRM-DASH-MAIN) |
| DASH-03 | Dashboard pipeline khám đoàn B2B hiển thị độc lập số lượng và quy mô đoàn. | P1 | Báo cáo tổng quan (CRM-DASH-MAIN) |
| DASH-05 | Báo cáo hiệu quả chiến dịch Marketing: số Hồ sơ tư vấn, số đạt `QUALIFIED`, số `BOOKED` theo campaign. | P0 | Báo cáo tổng quan (CRM-DASH-MAIN) |
| DASH-08 | Bộ lọc ngữ cảnh theo Kỳ, Department, Phạm vi cá nhân/Toàn phòng, Nguồn và Campaign. | P0 | Báo cáo tổng quan (CRM-DASH-MAIN) |
| DASH-12 | Chuyển 2 chế độ: Funnel (số đã từng đạt chặng, lũy kế, có tỷ lệ) và Pipeline (số đang ở chặng, không tỷ lệ). | P0 | Báo cáo tổng quan (CRM-DASH-MAIN) |
| IAM-01 | Phân quyền truy cập và thao tác theo ma trận 2 chiều Department × Role; `MKT` chỉ đọc Hồ sơ tư vấn, `SALES` thao tác (xem Mục 8). | P0 | Toàn hệ thống |
| IAM-04 | Audit Trail bất biến ghi vết thao tác trọng yếu (phân công, đổi chặng, export). | P0 | Nhật ký kiểm toán (CRM-AUDIT-LOG) |
| CUS-05 | Xuất Excel giới hạn theo phạm vi phụ trách của từng vai trò. | P1 | Danh sách hồ sơ (CRM-LEAD-LIST) |

---

## 8. Phân quyền và quy tắc duyệt

| Thao tác nghiệp vụ | Nhân viên (STAFF) | Phó phòng (DEPUTY_HEAD) | Trưởng phòng (HEAD) |
|---|---|---|---|
| Xem danh sách Hồ sơ tư vấn & Contact trong phòng ban | Chỉ hồ sơ được giao | ✓ Toàn phòng | ✓ Toàn phòng |
| Phân công và chuyển giao PIC | – | ✓ | ✓ |
| Cập nhật chặng Hồ sơ tư vấn (B2C) | Chỉ hồ sơ được giao | ✓ Toàn phòng | ✓ Toàn phòng |
| Thêm Activity và Note | Chỉ hồ sơ được giao | ✓ Toàn phòng | ✓ Toàn phòng |
| Tạo cơ hội khám đoàn B2B | ✓ | ✓ | ✓ |
| Chuyển trạng thái Group Confirmed / Won / Lost | – | ✓ | ✓ |
| Xem Dashboard | Chỉ phạm vi cá nhân | ✓ Toàn phòng | ✓ Toàn phòng |
| Xuất Excel | Chỉ hồ sơ được giao | ✓ Toàn phòng | ✓ Toàn phòng |
| Xem Audit Trail | Chỉ thao tác của mình | ✓ Toàn phòng | ✓ Toàn phòng |

- **Cấu trúc 2 chiều Department × Role:** hai phòng ban `SALES` và `MKT` theo ba cấp HEAD, DEPUTY_HEAD, STAFF. Bảng thao tác ở trên áp dụng cho `SALES`.
- **Phạm vi chéo MKT ↔ SALES:** `MKT` (cả ba cấp) **chỉ đọc** toàn bộ Hồ sơ tư vấn và Contact để đo hiệu quả nguồn/campaign; `MKT` vẫn tiếp nhận (upload danh sách, tiếp nhận từ nguồn số, xử lý cảnh báo trùng tại bước tiếp nhận) và xem Dashboard toàn bộ dữ liệu B2C. Chỉ `SALES` được phân công/chuyển PIC, cập nhật chặng, thêm Activity/Note và thao tác cơ hội khám đoàn. Quyền xuất dữ liệu của `MKT` **[Cần bệnh viện xác nhận]** (mặc định: không cho phép xuất file).
- **Không tự duyệt:** không người dùng nào tự phê duyệt bản ghi do chính mình khởi tạo hoặc đề xuất.
- **Cấm dữ liệu lâm sàng:** cả 6 tổ hợp không được truy cập kết quả khám, xét nghiệm, chẩn đoán hình ảnh, toa thuốc hay bệnh án.
- **Phạm vi xem và xuất file:** HEAD và DEPUTY_HEAD trong toàn phòng ban; STAFF chỉ hồ sơ được phân công trực tiếp.
- **Audit Trail bất biến:** mọi phân công, chuyển PIC, đổi chặng, cập nhật thông tin và xuất dữ liệu được lưu vết chỉ nối thêm gồm actor, action, object, timestamp, outcome.
- **Quyền xử lý cảnh báo trùng tại bước tiếp nhận** theo từng tổ hợp Department × Role **[Cần bệnh viện xác nhận]**.

---

## 9. Tích hợp và ranh giới hệ thống

| Hệ thống | Dữ liệu với CRM & Ranh giới | Ưu tiên |
|---|---|---|
| HIS | Lịch bác sĩ, danh mục dịch vụ, hồ sơ người bệnh, trạng thái lượt khám. Giai đoạn 1: phân biệt rõ `BOOKED` (cam kết khám trên CRM) với lịch khám chính thức tại bệnh viện (`HIS`). Tích hợp 2 chiều tự động thuộc giai đoạn sau. | P0 |
| Website HIUH & Landing Pages | Form đăng ký tư vấn, đặt lịch khám gói theo chuyên khoa. Tiếp nhận tự động thành Hồ sơ tư vấn kèm nguồn và UTM. | P0 |
| Mobile App HIUH Connect (PHR+) | Tài khoản đăng ký HIUH Connect được quản lý tại module “Tài khoản bệnh nhân”; đồng bộ một chiều thông tin tài khoản/liên hệ và trạng thái xác thực SĐT vào B2C theo CR-MOB-01. Không cần phát sinh yêu cầu đặt lịch; không lấy hồ sơ người thân hay dữ liệu khám chữa bệnh. | P0 |
| Intelligent Kiosk | Điều hướng người bệnh tại sảnh. Giai đoạn 1: Kiosk không tự tạo Hồ sơ tư vấn mới, chỉ ghi nhận tương tác khi đã nhận diện Contact. | P1 |
| Tổng đài IP & Zalo OA | Lịch sử cuộc gọi, popup hồ sơ khi gọi đến; hàng đợi tin nhắn nhắc lịch. Tích hợp sâu ở giai đoạn sau. | P1 |
| Tệp Excel (Khám đoàn / Ngoại kiểm) | Tiếp nhận danh sách nhân viên doanh nghiệp, khách tổ chức; kiểm tra cấu trúc, báo lỗi theo dòng. | P0 |

---

*Tài liệu khung xác thực giải pháp tiền bán hàng, phục vụ buổi làm việc đầu tiên với bộ phận Kinh doanh Bệnh viện Đại học Quốc tế Hồng Bàng (HIUH). Nguồn tham chiếu: HBH-SCRM-EPIC-OPTION-MUST-PLUS v0.6.2, HBH-SCRM-VISUAL-WORKFLOWS v0.6.2, DEC-HBH-SCRM-065.*


## 10. CR-MOB-01 — Liên kết tài khoản HIUH Connect với B2C

### 10.1 Mục tiêu

Tiếp nhận tài khoản đăng ký HIUH Connect thành đầu mối tư vấn B2C, không cần chờ khách đặt lịch. Nhân viên Kinh doanh nhận biết nguồn “Dữ liệu di động” và trạng thái xác thực SĐT để phục vụ tư vấn. Đăng ký ứng dụng hoặc xác thực OTP không tự làm tăng chặng chuyển đổi.

### 10.2 Yêu cầu nghiệp vụ chính

| Nội dung | Yêu cầu |
|---|---|
| Đối tượng tiếp nhận | Liên kết theo **chủ tài khoản**, không theo từng hồ sơ người thân. Mỗi tài khoản liên kết một Người liên hệ và một Hồ sơ tư vấn đích; đồng bộ không tự sinh thêm nhu cầu tư vấn. |
| Điều kiện tiếp nhận | Có định danh tài khoản và SĐT hợp lệ. Tài khoản chưa xác thực OTP vẫn được tiếp nhận; thiếu SĐT thì chờ bổ sung. Chưa có tên thì hiển thị “Chưa cập nhật”. |
| Tạo mới và xử lý trùng | Dùng lại liên kết đã có. Khi chưa có liên kết, hồ sơ mới bắt đầu tại `NEW`; nếu khớp SĐT hoặc email, người tiếp nhận xác nhận Người liên hệ và hồ sơ đích theo INT-07. Không tự gộp hoặc tự chọn hồ sơ. |
| Nguồn tiếp nhận | Hồ sơ đích mang nguồn `MOBILE_APP`, nhãn “Dữ liệu di động”, kể cả khi trước đó thuộc nguồn khác. Lưu vết nguồn cũ; không đổi nguồn các hồ sơ khác của cùng Người liên hệ. |
| Thông tin cập nhật | Họ tên và SĐT lấy bản hợp lệ mới nhất từ HIUH Connect, kể cả thay thế dữ liệu nhân viên đã nhập. Email chỉ bổ sung khi CRM còn trống. Giữ nguyên chặng, PIC, chiến dịch và dữ liệu tư vấn của hồ sơ đã có. |
| Xác thực OTP | Thêm cột **Xác thực OTP** sau **Họ và tên** trên danh sách B2C. Hiển thị **Đã xác thực OTP** hoặc **Chưa xác thực OTP** theo nguồn; hồ sơ chưa liên kết hiển thị `—` (không áp dụng). Nhân viên không sửa hoặc thực hiện xác thực tại CRM. |
| Đồng bộ | Tiếp nhận dữ liệu đã có khi triển khai và tự cập nhật tài khoản mới hoặc thay đổi. Mục tiêu hiển thị trong tối đa **5 phút** khi đủ dữ liệu và đã xác định hồ sơ đích; chạy lại không tạo trùng. |
| Tài khoản khóa hoặc xóa | Tài khoản bị khóa vẫn được tiếp nhận nếu đủ dữ liệu. Khi nguồn xác nhận xóa tài khoản, dừng đồng bộ nhưng giữ hồ sơ và lịch sử CRM. Không đổi chặng do khóa, mở khóa hoặc xóa tài khoản. |

### 10.3 Ranh giới và kết quả mong đợi

- Chỉ đồng bộ một chiều thông tin tài khoản, liên hệ và trạng thái xác thực. Không lấy hồ sơ người thân, CCCD, BHYT hoặc dữ liệu lâm sàng.
- Giữ quy trình B2C và phân quyền hiện có; không tự mở lại `LOST` hoặc tạo lịch HIS từ `BOOKED`. Các thay đổi thông tin và liên kết phải có vết kiểm tra.
- Giữ chức năng, công thức và bộ lọc báo cáo. Hồ sơ được đổi nguồn được tính vào nhóm `MOBILE_APP`; chỉ liên kết hoặc cập nhật hồ sơ cũ không làm tăng tổng số hồ sơ hay số theo chặng.

**Chi tiết tại PRD:** ánh xạ dữ liệu, quy tắc cập nhật, bố cục đầy đủ danh sách, xử lý lỗi đồng bộ và kịch bản nghiệm thu nằm tại [PRD v1.1.0, mục 29](./prd-sale-crm-phase1-mvp-v1.1.0.md). Bản này chỉ rút gọn mức trình bày của BRD; giữ các quyết định `DEC-MOB-01`–`DEC-MOB-09` và tiêu chí `BA-MOB-01`–`BA-MOB-10` tại [BRD v1.1.0, mục 10](./brd-sale-crm-presale-stage-v1.1.0.md) để truy vết, không hủy yêu cầu đã có.

## 11. Lịch sử phiên bản

| Phiên bản | Ngày | Thay đổi |
|---|---|---|
| 1.0.0 | 15/10/2026 | Bản BRD tiền bán hàng gốc; được lưu nguyên vẹn trong repo. |
| 1.1.0 | 09/11/2026 | CR-MOB-01: nguồn tài khoản HIUH Connect → B2C; quy tắc nhận diện, giữ stage, đổi nguồn, cập nhật thông tin; OTP hai trạng thái và danh sách 12 cột; đồng bộ ban đầu/cập nhật, mục tiêu 5 phút, xử lý tài khoản khóa/xóa và nghiệm thu. |
| 1.1.1 | 09/11/2026 | Rút gọn mục 10 theo mức BRD; giữ yêu cầu nghiệp vụ, dẫn chi tiết sang PRD; sửa tham chiếu liên quan, không thay đổi phạm vi chức năng. |

Quyết định CR-MOB-01 không thay thế các quyết định còn mở của phần nghiệp vụ khác.
