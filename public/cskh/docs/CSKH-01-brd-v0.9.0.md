---
type: Business Requirements Document
title: CSKH — Hỗ trợ khách đặt hẹn và bàn giao nhu cầu doanh nghiệp
document_id: BRD-CSKH-01
version: 0.9.0
status: draft
document_status: In Review
date: 02/11/2026
predecessor: CSKH-01-brd-v0.8.0.md
supersedes: CSKH-01-brd-v0.8.0.md
change_type: Đồng bộ prototype v0.9; truy vết phiên vừa hết trong 15 phút, câu hội thoại cuối cùng và bộ lọc chọn nhiều
version_rationale: Kế thừa đầy đủ v0.8; thêm FR-42..44, BR-34..36, M-47..51; giữ nguyên các bản trước
academic_sample_ref: ../Template/BRD-template-volere-v1.0.0.md
master_instruction_ref: Yêu cầu S-24 và S-26 ngày 02/11/2026; giữ xác nhận S-21 và baseline v0.8
epic_boundary_ref: CSKH-scope-of-work-v0.3.0.md
decision_log_ref: decision-log-additions-v0.3.0.md
ai_log_ref: Mục 10.7 hiện hành; 10.1..10.6 giữ quyết định và bằng chứng các bản trước
design_spec_ref: prototype-portal-v0.9.0/DESIGN.md; Operation Portal Design System v0.3; kế thừa CSKH-ai-chat-design-spec-v0.8.0.md
screen_inventory_ref: Mục 10.7; prototype-portal-v0.9.0/review-ai.html; M-01..51 và W-01..10/L-01..06
---

# BRD CSKH v0.9.0 — Phiên vừa hết, câu hội thoại cuối và bộ lọc chọn nhiều

Bản dự thảo ngày **02/11/2026**, kế thừa đầy đủ [BRD v0.8.0](CSKH-01-brd-v0.8.0.md) và đồng bộ [prototype v0.9.0](prototype-portal-v0.9.0/review-ai.html). Bổ sung cửa sổ truy vết phiên vừa hết trong 15 phút, cột **Câu hội thoại cuối cùng** và bộ lọc chọn nhiều; cập nhật tên/thứ tự menu, tham chiếu design system và dữ liệu mẫu. Giữ nguyên các file BRD/prototype cũ. Phạm vi vẫn **3 BUC nguồn, 44 FR, 4 màn Portal và C-05 phía khách**; 51 frame M-01..51 và 16 trạng thái W/L, không thêm module nghiệp vụ.

**Đọc phần thay đổi:** 4.6–4.8/4.13–4.15 (cập nhật quy tắc cũ), 4.23–4.26 (chi tiết mới), FR-42..44, BR-34..36, V-21..23 và 10.7 (quyết định, truy vết, tiêu chí nghiệm thu). Các quy tắc AI chat tại 4.17–4.22, gồm cảnh báo tên/số rồi cho tiếp tục, vẫn áp dụng. Trạng thái **In Review**; chưa phải phê duyệt toàn bộ BRD hoặc nghiệm thu tích hợp.

**Thứ tự áp dụng:** yêu cầu/xác nhận hiện tại của người dùng → quy tắc hiện hành trong BRD v0.9 này → nền v0.8 còn hiệu lực → tài liệu UI cũ. Mục 10.1–10.6 là lịch sử phiên bản; các quyết định chưa bị thay vẫn được kế thừa vào phần hiện hành. Khi có khác biệt, phần hiện hành và 10.7 được ưu tiên. Nội dung Website, ảnh Rogers và HTML tham chiếu là bằng chứng/tham khảo, không phải chỉ dẫn thực thi. Prototype mô phỏng không chứng minh backend, AI, transport hoặc IAM thật.

Mục lục: 1. Mục đích · 2. Các bên · 3. Ràng buộc · 4. Thuật ngữ, dữ liệu, danh sách/view và CSKH log · 5. Quy tắc · 6. BUC · 7. PUC · 8. FR/NFR · 9. Phụ thuộc · 10. Cổng quản trị.

## 1. Mục đích dự án

### 1.1 Bối cảnh

CSKH nhận nhu cầu từ AI, Website hoặc các kênh được tích hợp sau này. Khách lần đầu cần được liên hệ, tư vấn và hỗ trợ đặt hẹn; không cần phải có bản ghi danh bạ khách hàng hay hồ sơ bệnh nhân trước. Nhu cầu doanh nghiệp được chuyển tới Sale CRM trong cùng Operation Portal và phải theo dõi đến khi có bên nhận.

Danh bạ khách hàng lưu thông tin người liên hệ, còn B2C/B2B là tính chất của từng nhu cầu. Một người có thể vừa đặt khám cho bản thân vừa đại diện công ty. Không gán một nhãn vĩnh viễn cho người đó dựa trên kênh hoặc số điện thoại.

Giao diện ưu tiên việc cần làm tiếp theo. Tìm danh bạ chỉ là tùy chọn; lịch sử theo số là thông tin hỗ trợ; chỉnh thông tin khai nhầm là một thao tác ngắn. Không yêu cầu hoàn thành checklist xác minh trước khi chăm sóc.

### 1.2 Mục tiêu nghiệp vụ

| BO | Kết quả | Tiêu chí đích trong UAT |
|---|---|---|
| BO-1 | Tiếp tục bối cảnh AI đúng phiên | 100% tin hợp lệ đúng thứ tự/người gửi; phần thiếu được chỉ rõ |
| BO-2 | Không mất lời nhắn | 100% sáu chủ đề giữ nội dung/nguồn gốc; không tự biến lời nhắn thành lịch xác nhận |
| BO-3 | Khách mới được hỗ trợ tới kết quả đặt lịch | 100% ca thử không có bản ghi danh bạ khách hàng đi được tới gửi nhu cầu và nhận kết quả; 0 xác nhận lịch từ ghi chú đơn thuần |
| BO-4 | Không bỏ sót trách nhiệm | 100% yêu cầu đang xử lý có một người phụ trách; race chỉ một người thắng; chờ có việc/mốc theo dõi |
| BO-5 | Sửa thông tin nhanh và có lịch sử | Thêm tên/số trong một lần lưu; 100% sửa giá trị đã có giữ bản gốc, lý do và trước-sau |
| BO-6 | B2B có nơi tiếp nhận rõ | 100% ca bàn giao có mã tương quan; 0 yêu cầu hỗ trợ kết thúc như đã bàn giao khi CRM chưa nhận |

Các tỷ lệ là tiêu chí nghiệm thu đích, không phải dữ liệu vận hành đã đo. Tỷ trọng khách lần đầu do người dùng cung cấp làm bối cảnh; chưa có thống kê.

### 1.3 Nguồn và thay đổi

- S-01..10: nguồn lịch sử được kế thừa trong [BRD tiền nhiệm v0.3.1](CSKH-01-brd-v0.3.1.md) và [sổ bằng chứng](CSKH-evidence-and-decisions-v0.2.0.md); không đọc lại Notion/Website để suy ra trạng thái mới.
- S-11: phản hồi người dùng ngày 01/11/2026: đồng ý rà soát, nâng version không ghi đè, sửa prototype; yêu cầu nhận diện B2C/B2B, chuyển B2B vào CRM và xem lịch sử khi số đã có.
- S-12: [báo cáo rà soát prototype](reviews/CSKH-feature-review-booking-focus-20261101.md), đã kiểm chứng local.
- S-13: [BRD Sale CRM do người dùng chỉ định](../Sale-CRM/v2.2/brd-sale-crm-presale-stage-v0.4.2.md): thuật ngữ Hồ sơ tư vấn (Consultation Case), Cơ hội khám đoàn, Danh bạ khách hàng. Tên file là v0.4.2, metadata bên trong ghi v1.0.0 ngày 15/10/2026; dẫn theo đường dẫn này, không tự sửa version nguồn. Tài liệu bao gồm B2B trong phạm vi, các GRP-01/02/13 ưu tiên P1; không còn dùng BRD CRM v1.5.0 cũ để kết luận B2B ngoài phạm vi.

- S-14: phản hồi thuật ngữ của người dùng và quét trực tiếp prototype CRM `http://127.0.0.1:8080/` ngày 01/11/2026: Dashboard, Hồ sơ tư vấn, chi tiết hồ sơ Đã đặt hẹn, Cơ hội khám đoàn, Danh bạ Contact. Xem [bằng chứng](reviews/CSKH-CRM-terminology-20261101.md).

- S-15: phản hồi trực tiếp ngày 01/11/2026 yêu cầu hợp nhất thuật ngữ vào BRD, đặt nhãn chuyên nghiệp, áp dụng filter/sort/view như CRM và thêm CSKH log. Đã quét thực tế CRM cổng 8080; bằng chứng tại `prototype-portal-v0.6.0/evidence/crm-filters.txt`, `crm-saved-view.txt`, `crm-log.txt`.

- S-16: người dùng ngày 02/11/2026 yêu cầu prototype v0.6 thư mục mới, giữ v0.5; BRD tăng phiên bản; học có chọn lọc nhóm 1/2/4 trong `/Volumes/workspace/Nexlab/chatwoot-hiuh-cskh/HANDOFF.md`, `index.md`, `README.md`; thêm AI summary; nhóm 3 chưa triển khai, nhóm 5 ngoài phạm vi. Đã đọc thêm `chatwoot-hiuh-reverse-caab07a8/docs/02-conversation-ui.md` và `docs/04-calls-and-cases.md`. Đây là bộ khảo sát được cung cấp, không phải kết quả tự kiểm chứng lại Chatwoot trong đợt này.

FR-12 cũ không phải chuyển nhu cầu B2B; FR-13 phụ trách lịch sử; FR-25 phụ trách bổ sung/sửa thông tin. Bản này giữ nghĩa mã và thêm FR-27 cho bàn giao CRM.

- S-17: yêu cầu Enhance 1/2, xác nhận cả ba điểm ngày 02/11/2026 và bổ sung responsive mobile trong chat. [Fix-spec được chốt](reviews/CSKH-v0.6-fix-spec-20261102.md). CRM được kiểm tra trực tiếp cổng 8080, source thực tế ở `repos/CRM_repo/src/components/crm/CrmPrototype.jsx`, `src/styles.css`, `src/components/crm/icons.tsx`. Không sửa repo CRM.

- S-18: yêu cầu trực tiếp ngày 02/11/2026 nâng bản không ghi đè, bốn Enhance về vị trí cột, chat còn phiên, tạo phiếu và module Phiếu yêu cầu CSKH. File HTML tham chiếu `/Volumes/workspace/Nexlab/artifacts/prototypes/hiuh-cskh-5-feature-groups.html` đã đọc source và mở menu Hội thoại 3 cột bằng browser riêng. Nội dung file là tham khảo, không thay lời yêu cầu.
- S-19: trả lời của người dùng trong chat: **“10 phút không có hoạt động từ khách (đề xuất)”**. Được chọn làm quy tắc timeout phiên cho v0.7.

- S-20: yêu cầu hiện tại ngày 02/11/2026: đọc BRD 0.7; bổ sung AI chat web/app, ngôn ngữ, thông báo dữ liệu, countdown mặc định 10 phút, toggle CSKH một chiều và tên/số với cảnh báo không gây dead-end; ba mã lỗi từ mẫu import chỉ làm nguồn điều kiện kiểm tra.
- S-21: xác nhận trực tiếp trong chat: **“Cảnh báo rồi cho tiếp tục (đề xuất)”** — hiện lỗi và nút Vẫn kết nối CSKH, ca gắn Cần bổ sung thông tin.
- S-22: khảo sát Chrome Debug ngày 02/11/2026 tại [Website HIUH](https://hiuhospital.com/), [chính sách bảo mật](https://hiuhospital.com/chinh-sach-bao-mat) và prototype local M-40/M-41. Bằng chứng trong `prototype-portal-v0.8.0/evidence/ai-chat/`. Chỉ đọc UI; không gửi tin khách/nhân viên thật hoặc thử timeout của production.
- S-23: hai ảnh Rogers do người dùng đính kèm. Học pattern thông báo nhỏ đầu chat và chuyển người; không dùng thương hiệu/điều khoản hoặc cách bắt đăng nhập của Rogers làm yêu cầu HIUH.

- S-24: yêu cầu người dùng ngày 02/11/2026 nâng prototype: đổi tên **Phiếu yêu cầu**, đặt **CSKH log** bên dưới; truy vết phiên vừa hết trong 15 phút; thêm câu hội thoại cuối và màu người gửi; bộ lọc chọn nhiều, dữ liệu mẫu và đồng bộ Operation Portal Design System v0.3. Hai đoạn HTML filter đính kèm đều dùng radio; đó là bằng chứng UI, không phải yêu cầu giữ chọn một.
- S-25: [prototype v0.9](prototype-portal-v0.9.0/README.md), mã nguồn và [QA đã ghi nhận](prototype-portal-v0.9.0/QA.md); đối chiếu trực tiếp hàm trạng thái phiên, preview, filter và frame M-47..51. Bằng chứng UI/CRM/HTML và giới hạn kiểm chứng nằm trong bộ này; không suy ra API production đã có.
- S-26: yêu cầu trực tiếp **“Cập nhật BRD lên v0.9 cho khớp prototype, bổ sung logic phiên vừa hết trong 15 phút, cột Câu hội thoại cuối cùng và bộ lọc chọn nhiều.”** Rà soát tài liệu tại [báo cáo đồng bộ v0.9](reviews/CSKH-v0.9-brd-alignment-20261102.md).

## 2. Các bên liên quan

| Vai trò | Trách nhiệm |
|---|---|
| Người liên hệ | Nêu nhu cầu cá nhân hoặc đại diện doanh nghiệp; cung cấp cách liên hệ và thông tin người đi khám nếu đặt hộ |
| Nhân viên CSKH | Nhận việc, tư vấn, làm rõ thông tin, hỗ trợ đặt hẹn/bàn giao, theo dõi và kết thúc đúng kết quả |
| Trưởng nhóm CSKH | Giao/chuyển cùng nhóm, hỗ trợ ngoại lệ, mở lại; giữ một người chịu trách nhiệm |
| Bộ phận/hệ thống lịch | Sắp lịch, trả mã yêu cầu và lịch xác nhận; quản lý đổi/hủy lịch |
| Nhóm kinh doanh/CRM B2B | Nhận bàn giao, trả mã cơ hội khám đoàn và bên nhận, tiếp tục quy trình doanh nghiệp |
| Chủ kênh AI/Website | Giữ phiên/lượt gửi và cung cấp kênh liên hệ tiếp; thông báo thiếu dữ liệu |
| IAM/chủ dữ liệu/nhóm tích hợp | Phân quyền, chống trùng, sự kiện, lưu vết và chính sách dữ liệu |

## 3. Ràng buộc

- C-SOL-01: BUC-001..003 là ba nguồn hiện tại. “Bất kỳ channel” là nguyên tắc nhất quán, không tự mở Zalo/call center/email intake mới trong lượt này.
- C-SOL-02: Giữ source_kind và source_topic. Hỗ trợ đặt hẹn/bàn giao không biến AI_HANDOFF thành WEB_BOOKING.
- C-SOL-03: Lịch nguồn có thẩm quyền; CSKH gửi nhu cầu/đọc kết quả, không trực tiếp xác nhận, sửa hoặc hủy lịch. Chưa thêm SMS/ZNS/OTP/CTI. Chat hai chiều chỉ trong phiên AI Web/App còn hiệu lực theo 4.14.
- C-SOL-04: Bốn màn Portal dùng Operation Portal Design System v0.3 theo 4.26 và responsive theo 4.13; C-05 khung AI chat phía khách theo 4.17–4.22. Không thiết kế lại phần Website khác hoặc CRM/B2B.
- C-SOL-05: Sửa phạm vi cũ cấm mọi thao tác gửi nhu cầu lịch/CRM: nay cho phép FR-26/27. Các năng lực vận hành CRM sâu vẫn ngoài CSKH.
- C-ENV-01: API, route thật, danh bạ dùng chung và khả năng CRM B2B tiếp nhận chưa được xác minh. Prototype chỉ mô phỏng, không gửi dữ liệu thật.
- C-SCH-01: Chưa có ngày triển khai production được chốt.
- C-GOV-01: Chỉ thay đổi baseline CSKH ở file phiên bản mới; tài liệu CRM hiện có không bị sửa ngầm.

## 4. Thuật ngữ và dữ liệu

### 4.1 Khái niệm

| Khái niệm | Ý nghĩa / ranh giới |
|---|---|
| Ca tiếp nhận CSKH | Một việc chăm sóc theo phiên/lượt gửi; giữ một người phụ trách, nguồn, nội dung, tiến độ, kết quả |
| bản ghi danh bạ khách hàng | Người liên hệ trong danh bạ, có thể chưa tồn tại khi khách mới đến; không phải Patient hoặc Opportunity |
| Patient | Người đi khám; có thể khác người liên hệ; không bắt buộc có Patient ID trước khi hỗ trợ |
| B2C/B2B/UNKNOWN | Tính chất nhu cầu hiện tại: cá nhân/doanh nghiệp/chưa rõ. Chọn gửi lịch xác lập B2C, chọn chuyển CRM xác lập B2B; không tự suy từ kênh |
| Lịch sử liên hệ | Case cùng số chuẩn hóa hoặc bản ghi danh bạ khách hàng, trong quyền; cùng số không đồng nghĩa cùng người |
| Thông tin chăm sóc | Tên/số/email đã bổ sung/sửa, tách dữ liệu gốc; không sửa master bản ghi danh bạ khách hàng âm thầm |
| Yêu cầu lịch | booking_request_id, người đi khám, nhu cầu/ngày mong muốn; chưa phải appointment_id |
| Bàn giao CRM | Mã bàn giao, mã yêu cầu hỗ trợ/nguồn, tổ chức, nhu cầu, bên nhận đích, PENDING/ACCEPTED/REJECTED, mã cơ hội khám đoàn khi được nhận |
| Hẹn theo dõi | waiting_on, waiting_content, follow_up_date, follow_up_time (nullable), precision DATE/MINUTE, owner; Asia/Ho_Chi_Minh. Quy tắc và ánh xạ prototype tại 4.12 |

### 4.1.1 Từ ngữ thống nhất trên Operation Portal

| Bề mặt | Tên dùng trên UI và trao đổi nghiệp vụ | Phân biệt |
|---|---|---|
| CSKH — danh sách | Tiếp nhận & Xử lý | Tên menu/màn C-01; thay Yêu cầu hỗ trợ từ v0.7 |
| CSKH — đối tượng nguồn | Ca tiếp nhận; chi tiết hiển thị Yêu cầu CS-… | Một lần tiếp nhận từ AI/Liên hệ/Đặt khám; không gọi là Contact/Lead |
| CSKH — công việc theo dõi | Phiếu yêu cầu; nút Tạo phiếu yêu cầu | REQ-… liên kết ca nguồn, vòng đời riêng; không phải Hồ sơ tư vấn CRM |
| CSKH | Người liên hệ; thông tin liên hệ | Người đang trao đổi, không mặc định là người đi khám |
| CRM | Danh bạ Contact | Tập bản ghi người liên hệ; không phải yêu cầu hỗ trợ hay cơ hội |
| CRM B2C | Hồ sơ tư vấn (Consultation Case) | Một nhu cầu tư vấn dịch vụ khách lẻ; một người có thể có nhiều hồ sơ |
| CRM B2B | Cơ hội khám đoàn (Group Opportunity) | Nhu cầu doanh nghiệp/tổ chức; không gọi là Consultation Case |
| CRM | Đã đặt hẹn (BOOKED) | Cam kết ngày/khung giờ dự kiến; không tự xác nhận lịch HIS |
| Nguồn lịch | Lịch khám đã xác nhận | Có xác nhận và mã lịch từ nguồn có thẩm quyền |

Thứ tự menu trong nhóm CSKH: **Tiếp nhận & Xử lý → Phiếu yêu cầu → CSKH log**. Tên Phiếu yêu cầu áp dụng thống nhất cho menu, tiêu đề và breadcrumb; không đổi mã C-04 hoặc vòng đời phiếu. CSKH log vẫn là nhật ký thao tác, không phải AI transcript.

Giữ **CSKH** làm tên module. Khi nói về phân hệ có thể dùng **CRM B2C / CRM B2B**; khi nói về đối tượng dùng **Hồ sơ tư vấn / Cơ hội khám đoàn**. Không dùng Lead để gọi Hồ sơ tư vấn. Giữ nguyên **Danh bạ Contact** ở điều hướng dùng chung và các thao tác trỏ vào danh bạ. Trong form CSKH, dùng **Người liên hệ / Thông tin liên hệ** cho người đang trao đổi; không gọi yêu cầu hỗ trợ là Contact. Các khóa kỹ thuật như `contact_id` giữ nguyên.

Quy ước “đặt hẹn / đặt lịch” theo phản hồi người dùng ngày 01/11/2026:

| Ngữ cảnh | Nhãn áp dụng | Điều kiện / ý nghĩa |
|---|---|---|
| Nhân viên hỗ trợ khách | Đặt hẹn qua CSKH | Tên thao tác, không phải kết quả đã thành công |
| CSKH mới gửi nhu cầu | Gửi yêu cầu đặt hẹn; Đang chờ sắp lịch | Chưa có xác nhận lịch; không hiển thị Đã đặt hẹn chỉ vì gửi thành công |
| Cam kết hẹn qua CSKH | Đã đặt hẹn | Khách đã thống nhất ngày/giờ hẹn; cần lưu căn cứ cam kết. Luồng CSKH hiện tại chưa có bước ghi nhận cam kết riêng nên tiếp tục hiển thị chờ đến phản hồi nguồn, không tự suy ra BOOKED |
| Khách tự thao tác trên Website/App | Khách tự đặt lịch | Chỉ dùng khi biết khách là người thực hiện; nguồn Website/App đơn thuần chưa đủ chứng minh |
| Lịch chính thức từ nguồn | Lịch khám đã xác nhận | Có xác nhận và mã lịch từ nguồn có thẩm quyền; giữ điều kiện hoàn tất hiện tại |
| CRM B2C hiện hành | Đã đặt hẹn (BOOKED) | Prototype CRM ghi nhận cam kết ngày/khung giờ dự kiến; không suy ra lịch HIS đã xác nhận hoặc người đặt là CSKH |

Nguồn tiếp nhận, người hỗ trợ đặt hẹn và trạng thái xác nhận là ba thông tin khác nhau. Nguồn Website có thể dẫn tới CSKH hỗ trợ đặt hẹn. Không đổi `source_kind` sang đặt lịch Website sau thao tác CSKH. Khi tích hợp cần lưu bên thực hiện và bằng chứng cam kết/xác nhận; không suy ra từ chữ “hẹn” hoặc “lịch”. Quy ước thuật ngữ không bổ sung trạng thái BOOKED hoặc tích hợp CRM/HIS; các tính năng mới ở mục 4.6–4.8.

Quy ước ở mục này là nội dung chuẩn, thay phần thuật ngữ chưa đồng bộ trong bộ đặc tả UI/binding v0.3.0. Báo cáo `CSKH-CRM-terminology-20261101.md` chỉ còn là bằng chứng lịch sử, không phải đặc tả cần cập nhật song song. Không sửa module CRM tại cổng 8080 hoặc BRD CRM nguồn.

**Quyết định nhãn v0.4.0:** menu/danh sách **Yêu cầu hỗ trợ**; nút **Nhận xử lý**; module **CSKH**. “Nhận xử lý” là nhận trách nhiệm, vẫn giữ trạng thái Mới; nút “Bắt đầu xử lý” mới chuyển sang Đang xử lý. “Phiếu hỗ trợ” phù hợp khi cần nhấn mạnh mã phiếu, nhưng không dùng thêm làm tên song song. Không chọn “Hồ sơ chăm sóc” vì dễ lẫn với Hồ sơ tư vấn CRM hoặc hồ sơ bệnh nhân.

**Đối chiếu thực tế CRM đã hợp nhất:** danh bạ ghi 1 Contact–N Hồ sơ tư vấn; dashboard dùng Đã đặt hẹn/BOOKED với ngày/giờ dự kiến; chi tiết ghi không gửi HIS; nguồn Website/App vẫn có BOOKED. B2B có vòng đời riêng Open → Group Confirmed → Group Won/Lost. Các quan sát này củng cố ranh giới thuật ngữ, không chứng minh hệ thống tích hợp đã hoạt động.

### 4.2 Quy tắc dữ liệu

1. Bản khai báo gốc bất biến. Chuẩn hóa số chỉ phục vụ tìm kiếm/kiểm tra, không xác minh chủ số.
2. Nhận diện bản ghi danh bạ khách hàng là tùy chọn. Không tạo bản ghi danh bạ khách hàng giả cho AI thiếu số. Khi người dùng sửa số, xóa liên kết bản ghi danh bạ khách hàng trên yêu cầu hỗ trợ đang dùng để tránh nhận diện cũ và ghi lịch sử; không xóa bản ghi danh bạ khách hàng master hoặc lịch sử yêu cầu hỗ trợ.
3. Tìm lịch sử tự động khi có số hợp lệ, chỉ trả các yêu cầu hỗ trợ đang có quyền. Chưa nhận yêu cầu hỗ trợ thì không lộ tên/số/nội dung hay số lượng yêu cầu hỗ trợ cũ.
4. Thêm thông tin còn thiếu không cần căn cứ theo trường. Sửa/xóa giá trị đã có cần một lý do cho lần sửa, tự ghi người/thời điểm/trước-sau. Không đánh dấu “đã xác minh toàn bộ”.
5. Khi đặt hộ, hỏi người đi khám riêng. Không sao tên bệnh nhân sang tên người liên hệ. Khi chưa đặt lịch không bắt buộc quan hệ với bệnh nhân.
6. Mỗi lần gửi lịch/CRM có khóa ổn định gắn yêu cầu hỗ trợ và mục đích; timeout/lặp phải trả cùng tham chiếu. Case có nhánh đang xử lý không gửi lại sang nhánh khác; nếu khách có hai nhu cầu riêng, tạo/tiếp nhận hai yêu cầu hỗ trợ theo quy trình nguồn hiện hữu, không đổi nguồn của yêu cầu hỗ trợ cũ.
7. Bàn giao chỉ PENDING khi gửi được lưu; ACCEPTED cần mã cơ hội khám đoàn và bên nhận. Lỗi gửi giữ draft/yêu cầu hỗ trợ; từ chối giữ CSKH xử lý. Không coi việc bấm nút hoặc có bản ghi danh bạ khách hàng là CRM đã nhận.
8. Bàn giao không bypass INT-07 của CRM: phía CRM xử lý trùng danh bạ theo số/email và tạo/liên kết bản ghi phù hợp trước khi trả kết quả tiếp nhận. CSKH không phải thao tác xác minh danh bạ ở luồng mặc định. Nếu nguồn đã có Hồ sơ tư vấn/Cơ hội khám đoàn, giữ tham chiếu để tái dùng và xác định bên chăm sóc chính; không tạo thêm bản trùng.
9. AI thiếu kênh liên hệ phải giữ phiên và ghi việc yêu cầu nguồn bổ sung với owner/mốc theo dõi. Phiên AI còn mở có thể chat trực tiếp theo 4.14; hết phiên/chưa rõ kết nối thì bổ sung cách liên hệ hoặc tạo phiếu. Không giả định đã có kênh gọi ra; tích hợp tại V-09/V-15.

### 4.3 Trường của BUC-002

Giao diện Website phải kiểm tra các điều kiện dưới đây trước khi gửi; phía tiếp nhận kiểm tra lại cùng quy tắc. Dữ liệu qua cả hai lớp vẫn được xem là khách hàng khai báo, chưa tự xác minh đúng thực tế.

| Trường / HTML | Quan sát từ HTML | Quy tắc áp dụng v0.3.0 | CSKH nhận |
|---|---|---|---|
| `name` / `#cf-name` | `required`, `type=text`; không có maxlength | Bắt buộc, bỏ khoảng trắng đầu/cuối; 1–100 ký tự. Giới hạn 100 là chuẩn hóa của bản này. | Họ tên người liên hệ |
| `phone` / `#cf-phone` | `required`, `type=tel`; không có pattern | Bắt buộc. Chuẩn hóa theo quy tắc số ở dưới; không xác thực danh tính chỉ bằng số. | Số gốc và số chuẩn hóa |
| `email` / `#cf-email` | `type=email`, nhãn không bắt buộc | Tùy chọn; nếu nhập phải đúng định dạng email và ≤254 ký tự; giới hạn là chuẩn hóa. | Email nếu có |
| `topic` / `#cf-topic` | Select 6 option; không có required; không có option rỗng | Bắt buộc payload chứa một trong 6 mã; lấy giá trị đang chọn. HTML không có selected, option đầu là dat-lich; không kết luận người dùng đã chủ động chọn. | source_topic và category ban đầu |
| `message` / `#cf-message` | `required`, `textarea rows=4`; không maxlength | Bắt buộc, 1–4.000 ký tự sau trim; giới hạn là chuẩn hóa. Không diễn giải thành chẩn đoán. | Nội dung gốc được bảo vệ |
| `#cf-consent` | Checkbox không có name/required/checked | Bắt buộc đồng ý trước gửi; JS phải đưa consent và tham chiếu chính sách vào payload, server kiểm tra. Không có name không có nghĩa đã được truyền. | consent=true, consent_at, policy_version |
| Nút Gửi lời nhắn | `type=submit`, `aria-busy=false`, opacity 0.6; không disabled | Trạng thái gửi phải được kiểm soát ở JS/server; opacity không chặn submit. Khóa gửi trùng trong khi chờ và xử lý bằng khóa nguồn. | Không lưu thuộc tính trình bày |

**Quy tắc kiểm tra số điện thoại của bản đầu tiên:** loại khoảng trắng, dấu chấm, gạch ngang và ngoặc dùng để trình bày; giữ chuỗi gốc. Chấp nhận số nội địa bắt đầu `0` gồm 10 hoặc 11 chữ số, hoặc dạng `+84`/`84` theo sau 9 hoặc 10 chữ số; chuẩn hóa về `+84` bỏ số `0` đầu. Từ chối chữ cái, ký tự lạ hoặc độ dài khác. Đây là kiểm tra cú pháp đã chọn cho phạm vi Việt Nam, không chứng minh số đang hoạt động hoặc người gửi sở hữu số. Không thêm OTP vào phạm vi này.

Các giới hạn được bổ sung trong bảng là yêu cầu cho phiên bản đầu tiên, không phải khẳng định JavaScript/backend hiện có đã triển khai. `novalidate` trên form liên hệ chỉ xác nhận native form validation bị bỏ qua; server vẫn phải kiểm tra. Đoạn đặt lịch không có thẻ form hoặc name trên input nên không thể suy ra payload/API từ HTML.


### 4.4 Trường của BUC-003

Giao diện nguồn kiểm tra trường bắt buộc/định dạng trước khi gửi; phía tiếp nhận kiểm tra lại. Nhãn dấu sao hoặc nút bị khóa trong HTML chỉ là quan sát giao diện, không là bằng chứng đã có đủ kiểm tra hoặc dữ liệu đúng thực tế.

| Trường / HTML | Quan sát từ HTML | Quy tắc tại Website/nguồn trong v0.3.0 | Phạm vi CSKH |
|---|---|---|---|
| Họ và tên | Nhãn `*`, `maxlength=100`, aria-label; không required/name | Bắt buộc 1–100 ký tự sau trim; kiểm tra JS/server, không suy ra từ thuộc tính required | Nhận tên để liên hệ/phối hợp; không mặc định là danh tính đã xác minh |
| Ngày sinh | `type=date`, `max=2026-10-29`; không required | Tùy chọn; ngày hợp lệ và ≤ ngày gửi hiện tại theo Asia/Ho_Chi_Minh. Không hardcode 29/10/2026. | Không cần lưu trong ca tiếp nhận; giữ tại nguồn |
| Giới tính | Option rỗng, Nam, Nữ, Khác | Tùy chọn; giữ nguyên 3 giá trị khi có; rỗng là chưa cung cấp | Giữ tại nguồn |
| Số điện thoại | Nhãn `*`, `inputmode=numeric`; không type=tel/required/pattern/name | Bắt buộc; inputmode chỉ gợi ý bàn phím, phải validate máy chủ | Số gốc/chuẩn hóa cho liên hệ |
| Email | `inputmode=email`, `maxlength=254`; không type=email/required/name | Tùy chọn; validate định dạng khi nhập, ≤254 ký tự | Nhận nếu có |
| CCCD | `inputmode=numeric`, `maxlength=12`, placeholder 12 chữ số | Tùy chọn; nếu nhập thì đúng 12 chữ số. maxlength không chứng minh đã kiểm tra đủ 12. | Không sao chép vào CSKH; tham chiếu hồ sơ nguồn |
| Mã thẻ BHYT | `maxlength=20`; không required | Tùy chọn; trim, tối đa 20 ký tự; giữ chữ/số, không suy ra giá trị bảo hiểm từ mã | Không sao chép vào CSKH |
| Lịch sử bệnh/dị ứng/thuốc | Chỉ thấy nút mở phần tùy chọn; chưa có trường bên trong | Không tự tạo schema hay tiêu chí bắt buộc cho phần chưa được cung cấp | Không sao chép vào CSKH |
| Bác sĩ | Tóm tắt Chưa chọn được bác sĩ | Không bắt buộc để tiếp nhận yêu cầu; chuyển PENDING_ARRANGEMENT | doctor_ref rỗng; không chọn bác sĩ thay người dùng |
| Ngày khám | Tóm tắt 29/10/2026, không là input trong đoạn được gửi | Lấy ngày đã chọn từ ngữ cảnh bước trước; giá trị minh họa không là ngày mặc định. Kiểm tra tại thời điểm gửi ở nguồn. | appointment_date, không suy ra giờ khám |
| Chuyên khoa | Không xuất hiện trong đoạn HTML này | Lấy từ lựa chọn ở bước trước. Hợp đồng đầu vào lưu thông tin nếu có; thiếu thì ghi chưa cung cấp và CSKH bổ sung nhu cầu, không bịa mã khoa | specialty_ref/display nếu nguồn gửi |
| Xác nhận đặt lịch | `type=button`, `disabled`, `aria-disabled=true` trong ảnh chụp | Nút hiện bị khóa; HTML không nêu biểu thức bật nút hay API. Sau đủ validation/consent, thao tác tạo yêu cầu, không tự chứng minh lịch xác nhận | Chỉ nhận sau submit thật thành công |
| Sự đồng ý | Không có checkbox/bằng chứng trong đoạn HTML đặt lịch | Bổ sung thu/kiểm tra sự đồng ý tại bước xác nhận hoặc nhận tham chiếu bằng chứng có thật từ nguồn; không tự gán true | consent_ref/at/policy_version; thiếu bị từ chối trước tạo ca tiếp nhận Website |


Ngày khám phải được nguồn kiểm tra không trước ngày gửi theo Asia/Ho_Chi_Minh. Sự kiện tích hợp đến muộn không được tự loại chỉ vì ngày tiếp nhận tại CSKH đã đổi; giữ thời điểm gửi gốc và để nhân viên xử lý. Không có trường giờ khám trong đoạn HTML được cung cấp nên không bắt buộc giờ để tạo ca tiếp nhận.


### 4.5 Ma trận trạng thái và kết thúc

| Từ | Đến | Điều kiện |
|---|---|---|
| Tiếp nhận | NEW | Lưu thành công theo khóa nguồn |
| NEW | NEW có owner | Nhận/giao thành công, một người chịu trách nhiệm |
| NEW | IN_PROGRESS | Chủ yêu cầu hỗ trợ/trưởng nhóm bắt đầu xử lý |
| IN_PROGRESS | WAITING | D-05: bên chờ, một nội dung chờ/việc cần làm, ngày hợp lệ bắt buộc, giờ tùy chọn; không kiểm tra trước/sau hiện tại. D-09/D-10 giữ mốc đầy đủ ở tương lai; chi tiết tại 4.12 |
| WAITING | IN_PROGRESS | Có phản hồi/tiếp tục chăm sóc, ghi chú lần tiếp tục |
| IN_PROGRESS/WAITING | RESOLVED | Kết quả hợp lệ theo bảng dưới và nội dung hỗ trợ |
| NEW | CANCELLED | Trưởng nhóm, lý do rõ |
| IN_PROGRESS/WAITING | CANCELLED | Chủ yêu cầu hỗ trợ/trưởng nhóm, lý do rõ; không hủy lịch/CRM |
| RESOLVED/CANCELLED | IN_PROGRESS | Trưởng nhóm mở lại, lý do và owner hoạt động trong nhóm |

| Kết quả kết thúc | Khi được dùng |
|---|---|
| support — Đã giải đáp/tư vấn xong | Nhu cầu thông thường, không còn yêu cầu đặt lịch hoặc bàn giao B2B đang cần xử lý |
| appointment — Đã có lịch xác nhận | CONFIRMED và có appointment_id từ nguồn đúng yêu cầu |
| handoff — CRM đã tiếp nhận | ACCEPTED, có mã cơ hội khám đoàn và bên nhận; không tuyên bố đã bán hàng/đặt lịch |
| declined — Khách chưa tiếp tục/không còn nhu cầu | Có nội dung/lý do từ trao đổi; không coi không nghe máy là từ chối |

Trạng thái nguồn lịch/CRM và tiến độ yêu cầu hỗ trợ độc lập. Nguồn cập nhật không tự đóng yêu cầu hỗ trợ. Khách rút sau khi đã gửi lịch vẫn phải theo quy trình nguồn nếu cần hủy lịch; đóng yêu cầu hỗ trợ không thực hiện việc này.


### 4.6 Danh sách tác nghiệp, lọc và sắp xếp

Mục tiêu: tìm đúng việc để nhận, xử lý và theo dõi; giữ cách tổ chức quen thuộc của CRM. Không thêm dashboard/Kanban trong phiên bản này.

| Thành phần | Quy định |
|---|---|
| Phạm vi | Chờ nhận: NEW chưa có người phụ trách trong nhóm; Của tôi: người phụ trách hiện tại là người dùng; Của nhóm: chỉ SUPERVISOR |
| Tìm kiếm | Mã yêu cầu, tên, số liên hệ trong phạm vi được xem; Chờ nhận chỉ tìm mã. Không tìm nội dung hội thoại hoặc toàn danh bạ |
| Trạng thái / nguồn | Chọn nhiều giá trị; OR trong cùng trường, AND giữa các trường. Nguồn vẫn là AI, Liên hệ Website, Đặt khám Website; không đổi nguồn sau đặt hẹn |
| Chủ đề / phụ trách | Checkbox chọn nhiều theo 4.25; phụ trách chỉ xuất hiện trong Của nhóm. Giữ sáu chủ đề hiện hành |
| Trạng thái phiên | Checkbox chọn nhiều: đang kết nối, sắp hết, vừa hết trong 15 phút, đã hết từ 15 phút, chưa rõ kết nối; phân nhóm không chồng lấn theo 4.23. Ca không có phiên không khớp khi chọn bất kỳ giá trị phiên nào |
| Ngày tiếp nhận | Tất cả, Hôm nay, 7/30 ngày gần đây, khoảng ngày gồm hai đầu theo Asia/Ho_Chi_Minh; một đầu trống nghĩa không giới hạn đầu đó; khoảng đảo ngược báo lỗi và không trả kết quả |
| Hẹn theo dõi | Quá hẹn theo dõi / Hẹn hôm nay / Có hẹn; chỉ các yêu cầu chưa hoàn tất/hủy. Hẹn có giờ: mốc nhỏ hơn hiện tại. Hẹn chỉ có ngày: chỉ quá hẹn sau khi ngày đó kết thúc theo UTC+7, không tự suy thành vi phạm SLA |
| Điều kiện đang lọc | Chỉ hiện khi có điều kiện: nhãn, bỏ từng trường và Xóa lọc. Không hiện Chưa áp dụng bộ lọc khi rỗng; lỗi tải giữ cấu hình |
| Sắp xếp | Tiếp nhận, cập nhật gần nhất, hẹn theo dõi, mã yêu cầu; tăng/giảm; luôn có mã yêu cầu làm khóa phụ ổn định. Hẹn chỉ có ngày dùng cuối ngày để so sánh, không ghi thêm giờ vào dữ liệu. Hẹn trống luôn cuối. Chờ nhận mặc định tiếp nhận cũ trước; Của tôi/nhóm mới trước |
| Cột | Mã và Thao tác cố định; chọn Nguồn, Người liên hệ, Chủ đề, Câu hội thoại cuối cùng, Trạng thái, Phụ trách, Tiếp nhận, Hẹn theo dõi; mặc định bật cả tám cột tùy chọn. Chờ nhận không có Người liên hệ bất kể cấu hình đã lưu; cột câu cuối bị che nội dung theo 4.24 |
| Phân trang | 20 dòng; lọc/sort/view đổi về trang 1. Tổng số tính sau quyền và bộ lọc, không dùng số giả hoặc số toàn hệ thống |

CRM quan sát được bộ lọc nhiều lựa chọn, nhãn điều kiện, chọn cột, “Lưu thành view” tạo tab tùy chỉnh. Trong lần quét chưa xác minh được tương tác sắp xếp tại tiêu đề cột CRM; quy tắc sắp xếp CSKH ở trên được định nghĩa riêng theo tác nghiệp, không coi là hành vi CRM đã kiểm chứng.


#### 4.6.1 Pattern Views / Filter / Result — hiện hành v0.9

| Hàng | Hợp đồng UI |
|---|---|
| Views | Tab có tên, count và trạng thái được chọn; Lưu thành view, đổi tên/xóa theo 4.7. Không dùng count vượt quyền |
| Filter | Search có label **Tìm kiếm**; Chờ nhận tìm **Mã yêu cầu**, Của tôi/nhóm tìm **Mã, tên hoặc số liên hệ**. Trạng thái · Nguồn · Chủ đề · Trạng thái phiên chọn nhiều; Thời gian tiếp nhận · Hẹn theo dõi chọn một. Của nhóm thêm Phụ trách chọn nhiều |
| Bố cục | Các control được xuống hàng khi thiếu chỗ, theo DS v0.3; không ép toàn bộ filter vào một hàng cuộn ngang. Search, chip và menu có khoảng cách, popup nổi ngoài vùng cuộn. Quy tắc nowrap của v0.6 được thay từ v0.9 |
| Giá trị đang chọn | Trạng thái active và số lựa chọn trên trigger của nhóm nhiều giá trị. Chờ nhận khóa **Trạng thái: Mới**; focus đọc được hint **Chờ nhận chỉ có trạng thái Mới.** nhưng không mở/chọn. Của tôi/nhóm mở lại |
| Điều kiện áp dụng | C-01 có hàng nhãn điều kiện khi đang lọc; bỏ từng trường hoặc Xóa lọc. Xóa lọc không đổi phạm vi/quyền, không ghi đè view đã lưu. C-03/C-04 hiện lựa chọn qua trigger và count, không yêu cầu thêm hàng chip chưa có trong prototype |
| Result | **{n} kết quả + mô tả phạm vi + sort + Cột hiển thị**. Tổng số sau quyền/lọc; lỗi tải không dựng số 0. Cột mới theo 4.24, phân trang 20 dòng giữ nguyên |
| Keyboard | Tab, Enter/Space chọn checkbox; menu chọn nhiều giữ mở; **Bỏ chọn** chỉ xóa nhóm, **Xong** đóng. Escape đóng và trả focus về trigger; click ngoài đóng; các cách đóng không hoàn tác lựa chọn đã áp dụng. Khoảng ngày mở hai trường ngày |
| Ranh giới | Giữ sort toolbar và sort header, không thêm tìm kiếm/sort theo text câu hội thoại. Chọn cột không thay bộ lọc dữ liệu. Ngữ nghĩa lựa chọn và lưu view theo 4.25 |

Quan sát CRM là tham chiếu pattern, không mặc định mọi filter phải là checkbox. Trường có nhiều giá trị dùng checkbox; khoảng thời gian và hẹn theo dõi là lựa chọn đơn. Màn hẹp giữ mục tiêu chạm tối thiểu 44px; bảng cuộn ngang trong vùng bảng, nội dung chính cuộn được tới phân trang.

### 4.7 View cá nhân — ảnh chụp cấu hình

**Lưu thành view** lưu `{scope, filters, liveOnly, sort_key, sort_direction, visible_columns}` của danh sách C-01. Các nhóm chọn nhiều lưu mảng mã giá trị không trùng; bao gồm `session`, cột `lastMessage` và điều kiện `liveOnly`. Không coi menu chọn cột là bộ lọc dữ liệu. Không lưu danh sách mã yêu cầu, không sao chép tên/số khách hoặc nội dung hội thoại từ kết quả, không lưu tập kết quả hay quyền tại thời điểm lưu. Chuỗi tìm kiếm là một phần điều kiện nên có thể chứa số/tên do người dùng nhập; cần bảo vệ như tùy chọn riêng của tài khoản, không đưa chuỗi này vào log chung.

- Tên 1–60 ký tự sau trim; không trùng sau chuẩn hóa hoa/thường, dấu và khoảng trắng. Tối đa 12 view cá nhân trong bản đầu.
- Khi mở view, truy vấn lại dữ liệu hiện tại với quyền hiện tại. “Hôm nay/7 ngày” và cửa sổ vừa hết 15 phút được tính lại; khoảng ngày cố định giữ nguyên. Lưu `RECENT_EXPIRED` như điều kiện động, không lưu mốc now hoặc tập ca đang khớp.
- Thay bộ lọc sau khi mở không ghi đè view; hiện **Đã thay đổi**. Lưu thành view tạo bản mới; không có cập nhật ngầm.
- Cho đổi tên, xóa có xác nhận. Xóa view không xóa yêu cầu; view hệ thống không xóa/đổi tên.
- Không chia sẻ view nhóm và không lấy view làm cơ chế cấp quyền. Cấu hình phạm vi Của nhóm không được áp dụng khi mất quyền trưởng nhóm.
- Bản triển khai lưu cấu hình phía máy chủ theo tài khoản. Prototype dùng localStorage riêng theo persona; chỉ lưu cấu hình. Lưu trữ bị chặn báo lỗi, không báo đã lưu. Prototype không đồng bộ thiết bị và không có đăng nhập thật.

### 4.8 CSKH log — nhật ký hoạt động người dùng

**Tên menu và màn: CSKH log (C-03).** Là lịch sử thao tác kiểm toán của CSKH, không phải transcript AI, ghi chú trao đổi hay log lỗi kỹ thuật. Lịch sử xử lý trong chi tiết yêu cầu và CSKH log dùng cùng sự kiện nghiệp vụ trong hệ thống triển khai; không tạo hai nguồn lịch sử có thể mâu thuẫn.

#### 4.8.1 Nội dung một sự kiện

| Trường | Quy định |
|---|---|
| event_id, occurred_at | Mã duy nhất, thời điểm máy chủ; lưu múi giờ chuẩn, hiển thị UTC+7; mã/sequence phân định thứ tự khi cùng thời điểm |
| actor_id, actor_type, role_at_event | Người dùng hoặc hệ thống; không sửa tên tác giả cũ khi chuyển người phụ trách |
| action | Mã hành động ổn định; UI hiện nhãn tiếng Việt |
| object_type, object_id, request_id | Yêu cầu hỗ trợ / Phiếu yêu cầu / View cá nhân / Tệp nhật ký; liên kết yêu cầu/phiếu chỉ khi còn quyền đọc |
| result | SUCCESS / FAILED / DENIED; lần thử thất bại không được ghi như thao tác thành công |
| changes | Trường thay đổi và trước/sau theo danh sách cho phép; không dump toàn payload |
| reason_ref, error_code | Lý do được lưu trong yêu cầu có quyền, mã lỗi an toàn; không chép nội dung tự do vào bảng log |
| correlation_id, group_id | Truy dấu xuyên CSKH/nguồn lịch/CRM và giới hạn nhóm; không coi ID là bằng chứng được cấp quyền |
| export metadata | Với xuất log: phạm vi, điều kiện đã làm sạch, số bản ghi và mã tệp; không lưu cả tệp hoặc số điện thoại tìm kiếm vào log |

#### 4.8.2 Sự kiện phải ghi

| Nhóm | Hành động |
|---|---|
| Tiếp nhận / phân công | Nhận từ nguồn, nhận xử lý, giao/chuyển người phụ trách |
| Vòng đời | Bắt đầu, chờ, tiếp tục, hoàn tất, hủy, mở lại |
| Dữ liệu chăm sóc | Bổ sung/sửa thông tin, liên kết/bỏ liên kết danh bạ, đổi chủ đề, thêm ghi chú (chỉ metadata và số ghi chú) |
| Kết quả khách hàng | Gửi yêu cầu đặt hẹn, nguồn cập nhật lịch; bàn giao CRM B2B, CRM tiếp nhận/từ chối |
| Truy cập và cấu hình | Mở chi tiết yêu cầu có nội dung; lưu/đổi tên/xóa view; tạo tệp xuất log |
| Lỗi / từ chối | Lưu thất bại, validation không hợp lệ, nhận trùng, thiếu quyền khi đọc/ghi/xuất. Ghi mã lỗi an toàn và kết quả; không ghi giá trị người dùng vừa gõ |

Không ghi mỗi phím gõ, click mở menu, hover, chuyển tab, mỗi lần lọc hay đọc một dòng log. Sự kiện nguồn trùng/cũ bị bỏ qua không sinh lần thành công thứ hai; metadata loại bỏ nằm ở giám sát tích hợp.

#### 4.8.3 Quyền, bảo vệ dữ liệu và độ tin cậy

- STAFF: log của yêu cầu đang phụ trách trong nhóm và thao tác view cá nhân của mình; không xem log yêu cầu đang chờ nhận hoặc đã chuyển đi. Việc từng là tác giả không duy trì quyền đọc yêu cầu cũ.
- SUPERVISOR: toàn nhóm CSKH, gồm thất bại/bị từ chối và log view/export của nhóm; có quyền xuất. Nhóm khác không được truy cập. INTEGRATION_ADMIN chỉ có metadata giám sát kỹ thuật ngoài màn C-03.
- Danh sách, tổng số, tìm kiếm, panel chi tiết, liên kết và xuất phải cùng áp dụng quyền hiện tại. Không cache nội dung sau khi thu quyền. Lọc và saved view không vượt quyền.
- Log chỉ nối thêm, không có sửa/xóa trên UI/API thông thường; backend bảo vệ kho log và kiểm tra quyền. Thay đổi dữ liệu và ghi sự kiện thành công phải cùng giao dịch bền vững hoặc outbox bảo đảm không mất sự kiện. Nếu không bảo đảm ghi được log, không báo thao tác nghiệp vụ thành công. Hạ tầng bảo vệ tính toàn vẹn được xác nhận trước triển khai; prototype không chứng minh khả năng này.
- Trước/sau chỉ cho các trường nghiệp vụ cần thiết. Danh sách log không hiển thị tên, số đầy đủ, email, hội thoại, nội dung ghi chú, chẩn đoán hay dữ liệu y tế. Prototype che số chỉ còn 4 chữ số cuối, tên/email chỉ báo có giá trị; các trường này không xuất vào CSV.
- Chính sách thời hạn lưu, truy xuất bản gốc lý do và xóa theo chính sách thuộc chủ dữ liệu, chưa chốt số ngày. Không áp dụng quyền xóa thủ công log cho nhân viên.

#### 4.8.4 Giao diện và xuất nhật ký

- Tìm mã log/yêu cầu/mã tương quan; người thực hiện, hành động, kết quả và loại đối tượng là các nhóm checkbox chọn nhiều theo 4.25; thời gian chọn một. Sắp thời điểm mới/cũ trước; 20 dòng/trang, hiển thị tổng số thật trong quyền.
- Chọn mã log mở panel chi tiết: mã tương quan, đối tượng, kết quả/mã lỗi, lý do có được ghi nhận hay không, trước/sau. Liên kết về yêu cầu phải kiểm tra lại quyền.
- Chỉ SUPERVISOR có **Xuất nhật ký CSV**. Xuất toàn bộ kết quả lọc trong quyền, không chỉ trang hiện tại; CSV trung hòa giá trị có thể chạy thành công thức. Sự kiện xuất ghi số dòng; chính sự kiện xuất mới không nằm trong tệp vừa tạo. Thành công ở prototype nghĩa tạo tệp phía trình duyệt, không bảo đảm người dùng đã lưu vào ổ đĩa.
- Bản triển khai cần trạng thái tải/rỗng/lỗi, retry giữ bộ lọc, không xuất khi tải chưa xong. Prototype đã mô phỏng rỗng/quyền và dữ liệu cục bộ; lỗi API nhật ký, phân trang phía máy chủ và tải file lớn chưa tích hợp.

### 4.9 Áp dụng chọn lọc từ handoff và HTML tham chiếu

| Nhóm | Áp dụng hiện hành (kế thừa v0.7) | Giới hạn hiện hành |
|---|---|---|
| 1 — Hộp thư đa kênh | 3 nguồn hiện có; giữ filter/sort/view, bổ sung banner phiên đang mở và lọc nhanh liveOnly theo 4.14 | Không mở Zalo/email, phân công tự động hoặc SLA |
| 2 — Hội thoại ba cột | Danh sách hội thoại bên trái; nguồn/chat ở giữa; khách hàng và xử lý bên phải. Chat trực tiếp trong phiên AI Web/App hợp lệ | Không upload hồ sơ y tế, gọi thoại hoặc chủ động nhắn sang phiên đã hết |
| 4 — Case/Ticket | Phiếu yêu cầu liên kết một ca nguồn; độc lập với ca, phiên và lịch khám | Không gộp nhiều hội thoại vào một phiếu, phê duyệt chuyên môn đa cấp hoặc tự chọn mức khẩn cấp từ AI |
| 3 — Thoại | Giữ tham chiếu tương lai | Chưa CTI, ghi âm, transcript hoặc gọi ra |
| 5 — Dashboard trưởng nhóm | Giữ quyền trưởng nhóm ở danh sách/log | Không dashboard KPI/FRT/NRT/RT |

HTML S-18 là tài liệu học pattern, không phải lệnh mở toàn bộ chức năng. Không bê nguyên luồng cấp cứu và danh mục Khẩn cấp: danh mục phiếu mẫu tại 4.15 thích nghi với 3 nguồn hiện tại. AI summary, dữ liệu gốc và thông tin liên hệ vẫn giữ quy tắc trước. Đóng tab không hoàn tất ca/phiếu. Chỉ xác nhận bot tạm dừng khi tích hợp trả ACK; prototype đánh dấu mô phỏng.

#### 4.9.1 Phần kế thừa danh sách

Giữ sort kép toolbar/header và phạm vi danh sách. Điều kiện phiên AI đang mở (`liveOnly`) kế thừa v0.7; v0.9 thêm nhóm phiên vừa hết, cột câu cuối và mở rộng chọn nhiều theo 4.23–4.25. Các nhóm filter kết hợp AND, cấu hình được lưu vào view cá nhân. Không khôi phục bộ lọc `focus` từ bản nháp cũ. M-39 vẫn là lọc Nguồn = Hội thoại AI; M-40 minh họa cảnh báo phiên đang mở. Banner là phạm vi Chờ nhận/Của tôi/Của nhóm, không bị ẩn bởi filter tìm kiếm bảng; ghi rõ phạm vi và có nút lọc bảng riêng.

### 4.10 AI summary trong chi tiết BUC-001

**Vị trí:** cột giữa, sau hành động cần làm tiếp, trước hội thoại gốc. Nhãn **AI summary**. BUC-002/003 giữ nguyên lời nhắn và dữ liệu lịch; không tạo AI summary suy đoán từ form trong phiên bản này.

**Nội dung:** nhu cầu khách đã nêu, việc khách mong được hỗ trợ, thông tin còn thiếu trong phần nguồn đã nhận. Mỗi nhận định về khách phải có message_id dẫn tới tin gốc đúng phiên. “Chưa được nêu trong phần đã nhận” không được biến thành “khách không có”. Không suy tên, số điện thoại, người đi khám, chẩn đoán, mức độ khẩn, gói phù hợp hay ngày hẹn đã chốt. Không tự ghi vào thông tin chăm sóc, danh bạ, ghi chú, lịch hoặc CRM.

| Trạng thái | Hiển thị và hành vi |
|---|---|
| Có bản tóm tắt / READY | Nhận định + Xem tin gốc; nguồn phiên, phiên bản, thời điểm tạo; nhắc cần đối chiếu |
| Nguồn PARTIAL | Nhãn Tóm tắt một phần; chỉ các message_id đã nhận; không tóm tắt đoạn chưa có |
| Chưa có / EMPTY | Nút Tạo tóm tắt; không dựng nội dung trước khi có kết quả |
| Đang tạo / LOADING | Có phản hồi tiến trình, chặn yêu cầu tạo trùng; các thao tác chăm sóc vẫn dùng được |
| Lỗi / ERROR | Chưa tạo được; Thử lại; đọc tin gốc và xử lý tiếp được |
| Cũ / STALE | Phiên bản nguồn hoặc độ đầy đủ khác bản đã dùng; ẩn nhận định cũ, hiện Cần cập nhật |
| Nguồn UNAVAILABLE | Không hiển thị nhận định/không cho tạo; tải được hội thoại rồi mới tóm tắt |

**Hợp đồng tối thiểu đích:** summary_id, request_id, source_session_id, source_revision, coverage, generated_at, generator_version, state, facts[{label,text,message_ids}], missing_information, error_code. API và dữ liệu nguồn phải kiểm tra cùng quyền đọc yêu cầu; chỉ dùng nội dung đã bàn giao. Không ghi nội dung tóm tắt hoặc transcript vào CSKH log kỹ thuật.

**Kết quả bất đồng bộ:** gắn request_id + source_revision + coverage; sau tải lại frame/đổi yêu cầu không đổ nhầm dữ liệu vào yêu cầu khác. Nếu nguồn đã đổi, bỏ kết quả cũ và yêu cầu tạo lại. Thu quyền trong lúc tạo: bỏ kết quả khỏi giao diện, không phục hồi nội dung cũ; ghi metadata từ chối. Tạo/cập nhật thành công hoặc lỗi có sự kiện `summary_refresh` trong CSKH log, không đổi trạng thái chăm sóc. Tin dẫn chiếu phải nằm trong tập tin đã nhận của cùng phiên; không tìm bằng số điện thoại để ghép phiên khác.

**Ranh giới prototype:** toàn bộ tóm tắt là fixture minh họa từ hội thoại mẫu, nút tạo/cập nhật mô phỏng thời gian chờ; chưa gọi mô hình AI/dịch vụ ngoài. Timestamp trong fixture theo mốc 01/11/2026 như bộ v0.5 để giữ khả năng so sánh, không phải thời điểm triển khai. Chưa xác nhận chất lượng AI thực tế, cấu hình nhà cung cấp, chi phí hoặc đồng ý truyền dữ liệu; những việc này là điều kiện tích hợp, không được coi đã có từ UI.

### 4.11 Chi tiết ba cột

| Loại ca | Cột trái | Cột giữa | Cột phải |
|---|---|---|---|
| AI Web/App | Hội thoại AI trong phạm vi được xem; ưu tiên phiên còn mở | Nội dung nguồn / chat trực tiếp, AI summary, ghi chú nội bộ | Khách hàng, lịch sử liên hệ, phiếu liên quan và điều khiển xử lý ca |
| Liên hệ Website | Tiến độ, chủ đề, xử lý, lịch sử ca | Lời nhắn nguồn và ghi chú nội bộ | Khách hàng/người liên hệ, lịch sử cùng số, phiếu liên quan |
| Đặt khám Website | Tiến độ, chủ đề, xử lý, lịch sử ca | Dữ liệu đặt khám và ghi chú nội bộ | Người liên hệ/người đi khám, lịch sử, phiếu liên quan |

Nguồn và khách hàng luôn liền kề; khách hàng ở ngoài cùng bên phải. Áp dụng thứ tự người dùng ghi rõ `[optional] | source | identity`; câu nói về customer panel ở trái được hiểu theo mục tiêu nhất quán với HTML tham chiếu (danh sách trái, khách phải), không đảo khách sang trái.

Khi đọc lịch sử, cột giữa ưu tiên việc cần làm → AI summary → nội dung nguồn chỉ đọc. Khi bật chat, bối cảnh bàn giao/summary thu gọn để ưu tiên trao đổi trực tiếp. Tin trực tiếp nối thêm, không sửa transcript bàn giao; summary hiện tại chỉ dựa trên phần bàn giao. Ghi chú nội bộ hiển thị riêng, không đi vào kênh gửi khách. Người dùng có thể chuyển qua lại Lịch sử/Chat trực tiếp khi đủ điều kiện mà không mất trao đổi đã ghi nhận. Chuyển về lịch sử không tự bật lại bot.

Ô soạn có hai chế độ rõ **Trả lời khách** và **Ghi chú nội bộ**; giữ nháp riêng. Hết phiên/mất quyền không cho gửi. Không bắt tạo Patient hoặc Danh bạ Contact trước hỗ trợ. Cùng số không gộp ca/phiên. Điều kiện đóng ca lịch/CRM tại 4.5 vẫn giữ.

### 4.12 Form Chờ phản hồi (D-05) và độ chính xác ngày/giờ

**Phạm vi:** chỉ thay form Chờ phản hồi thủ công. Không thay validation form Đặt hẹn qua CSKH (D-09) hoặc Chuyển CRM (D-10).

| Nội dung | Quy tắc đã chốt |
|---|---|
| Bên chờ | Khách hàng hoặc Nội bộ, bắt buộc |
| Nội dung chờ / việc cần làm | Một textarea bắt buộc sau trim, tối đa 4.000 ký tự. Placeholder: Đang chờ thông tin gì và sẽ làm gì tiếp? Thay hai trường Lý do chờ và Việc cần làm tiếp |
| Ngày | Khi chưa có hẹn: để trống; người dùng phải điền. Kiểm tra ngày thực có, gồm năm nhuận; không chấp nhận 31/02 |
| Tháng/năm | Điền sẵn khi mở form từ đồng hồ hệ thống theo Asia/Ho_Chi_Minh, được sửa. Đây là giờ thực, khác mốc fixture dùng để diễn lại dữ liệu mẫu |
| Giờ/phút | Tùy chọn. Bỏ trống nghĩa chưa chọn giờ, không tự gán 00:00. Nhập 00:00 có nghĩa đúng nửa đêm và được giữ |
| Trước/sau hiện tại | D-05 không có min/max so với hiện tại: chấp nhận quá khứ/hôm nay/tương lai. Vẫn kiểm tra dữ liệu ngày và định dạng giờ hợp lệ |
| Nháp/giá trị cũ | Giữ dữ liệu đang nhập khi validation/lưu lỗi hoặc render lại. Nếu có hẹn đã lưu, điền lại đầy đủ phần ngày/giờ đó; không ghi đè bằng tháng/năm hiện tại. Mở form mới sau bỏ nháp lấy mặc định mới |
| Khi lưu | IN_PROGRESS → WAITING, giữ owner, một nội dung nguồn duy nhất, không sửa lịch/CRM. Hiện nội dung một lần trong vùng việc tiếp; banner bên chờ chỉ nhắc trạng thái. Log chung chỉ metadata |

**Hợp đồng dữ liệu đích:** `waiting_content` là nội dung nguồn duy nhất; `follow_up_date` dạng YYYY-MM-DD bắt buộc; `follow_up_time` HH:mm hoặc null; `follow_up_precision` = DATE/MINUTE, timezone Asia/Ho_Chi_Minh. Không biểu diễn chưa chọn giờ bằng timestamp giả.

**Ánh xạ prototype:** `waitContent` là nội dung nguồn; `nextStep` giữ cùng giá trị cho các nơi đọc trước đây; `waitReason` để trống cho lần lưu D-05 mới. Form mở dữ liệu cũ gộp các giá trị lý do/việc khác nhau, không nhân đôi nội dung trùng. `followUpAt` chứa YYYY-MM-DD hoặc YYYY-MM-DDTHH:mm, giữ đúng độ chính xác; đây là mô hình local, không tự sửa API thật.

**Theo dõi và sort:** hẹn DATE chỉ quá hẹn khi ngày hệ thống UTC+7 lớn hơn ngày hẹn; hẹn MINUTE giữ so sánh giờ hiện có. Hẹn hôm nay so sánh phần ngày. Có hẹn không phụ thuộc việc đã chọn giờ. Chỉ xét yêu cầu chưa hoàn tất/hủy. Sort dùng cuối ngày cho DATE, giữ giờ cho MINUTE, hẹn trống cuối cả hai chiều và mã yêu cầu làm khóa phụ; không lưu giá trị cuối ngày suy ra vào dữ liệu.

**D-09/D-10:** giữ timestamp đầy đủ và phải sau mốc hiện tại của quy trình. Trong prototype, kiểm tra này dùng `s.now` của fixture 01/11/2026 để tái hiện bộ ca cũ; D-05 dùng đồng hồ hệ thống chỉ để điền mặc định tháng/năm. Không bổ sung SLA hoặc thông báo tự động.

### 4.13 Responsive desktop, tablet và mobile

- Desktop từ 1024px: shell theo viewport, giữ điều hướng Portal, C-02 ba cột có vùng cuộn độc lập; không scale/zoom toàn trang. Màn danh sách có ba hàng Views / Filter / Result theo 4.6.1. Kiểm chứng đích 1920×1080, 1440×900 và 1280×800.
- Dưới 1024px: menu Portal mở bằng nút điều hướng, Esc/đóng trả focus. AI dùng tab **Nội dung · Khách & Xử lý · Hội thoại**; Liên hệ/Đặt khám dùng **Nội dung · Khách hàng · Xử lý**. Đổi tab giữ nháp theo ca và chế độ soạn.
- Mobile dưới 768px: control chính cao tối thiểu 44px, form/input dễ nhập; có bàn phím số cho ngày/tháng/năm. Search và các filter xuống hàng theo chiều rộng khả dụng. Hàng view và thao tác result được xuống hàng khi cần; không có overflow ngang toàn trang.
- Bảng thêm cột câu hội thoại cuối theo 4.24; cấu trúc phân trang giữ nguyên; vùng table cuộn ngang/dọc độc lập để tiếp cận các cột/thao tác. Phân trang và footnote được reflow bằng CSS, không đổi nội dung/logic.
- Popover và modal nằm trong viewport, nội dung dài cuộn bên trong, nút lưu/đóng vẫn tiếp cận được. Trả lời khách/Ghi chú nội bộ có nhãn và vùng soạn riêng, ở cuối cột nội dung.
- CSKH log giữ lọc, xuất theo quyền và panel chi tiết; trên màn hẹp panel được xếp lại. Không tạo dashboard mobile khác.
- Màn ngang điện thoại hoặc khi bàn phím làm giảm chiều cao: cho cuộn toàn phần nội dung, không cắt hội thoại hoặc nút lưu ghi chú.
- Kiểm chứng bằng viewport giả lập 390×844, 360×800 và tablet 768×1024; chưa coi là kiểm chứng trên thiết bị iOS/Android vật lý hoặc mọi trình duyệt.

### 4.14 Phiên AI và chat trực tiếp

**Timeout kế thừa (S-19), mặc định v0.9: 10 phút không có hoạt động từ khách**, tính từ `last_customer_activity_at`. Tin CSKH, mở màn, đọc hội thoại và heartbeat của máy CSKH không gia hạn. Phiên có hoạt động khách hợp lệ thì cập nhật mốc; đã hết phiên thì không tự hồi sinh bởi event đến muộn. Đóng tab/mất transport chuyển trạng thái chưa rõ kết nối; không suy ra khách đã đọc hay đã nhận.

| Trạng thái | UI | Hành động |
|---|---|---|
| ACTIVE | Khách còn kết nối + mm:ss | Nhận ca → Bắt đầu xử lý → bật Chat trực tiếp |
| ENDING | Sắp hết phiên khi còn ≤2 phút, màu cảnh báo + chữ | Ưu tiên tiếp nhận; không tự tăng mức ưu tiên phiếu |
| UNKNOWN | Chưa rõ kết nối | Khóa bật/gửi; cần xác nhận kết nối còn trong hạn |
| EXPIRED | **Phiên vừa hết trong 15'** khi còn trong cửa sổ; **Đã hết hơn 15'** khi đủ/từ 15 phút, theo 4.23 | Khóa gửi; giữ nháp, cho xem log và lập phiếu/liên hệ sau |

Kế thừa cấu hình v0.8 tại 4.19; mốc mặc định vẫn 600 giây. Ngưỡng cảnh báo 2 phút là lựa chọn UI của bản này, không là SLA nghiệp vụ. Countdown hiển thị từ đồng hồ hệ thống trong prototype. Triển khai thật dùng `expires_at/server_now` được server xác nhận; đồng hồ máy không quyết định quyền gửi. “Hoạt động” trong demo là tin khách; tập event hợp lệ thực tế (tin nhắn, thao tác khách được gateway công nhận) cần dev chốt tại V-15. Không dùng heartbeat tự động làm bằng chứng khách hoạt động.

**Danh sách chính:** banner số phiên còn mở, số sắp hết, tối đa ba mã ca/kênh/countdown sớm hết nhất, nút Nhận xử lý/Mở. Tab Chờ nhận chỉ hiện metadata, không tên/số/nội dung. Phạm vi banner theo tab (không theo filter bảng); “Chỉ xem phiên đang mở” lọc bảng và có trạng thái được chọn, “Xem tất cả ca” bỏ điều kiện này. Table có badge trạng thái phiên ở cột nguồn. Không đổi sort gốc hoặc tự nhận ca. Lỗi tải danh sách hiển thị chưa tải được trạng thái, không giả số 0.

**Bật chat và gửi:** chỉ owner hiện tại của ca IN_PROGRESS, trong quyền đọc, ACTIVE/ENDING. Supervisor vẫn cần là owner để gửi công khai; quyền xem không mặc nhiên là quyền gửi thay người phụ trách. Gọi tiếp quản và đợi ACK AI đã dừng trước khi cho gửi. Lỗi ACK giữ lịch sử; không khẳng định chat sẵn sàng. Kiểm tra lại quyền, trạng thái, đúng session và hạn ngay trước khi ghi. Gửi có khóa chống lặp, giới hạn 1–4.000 ký tự; đang gửi chặn gửi trùng; lỗi giữ nháp và cho thử lại. “Đã gửi” cần ACK; không dùng “Đã đọc”. Đổi ca khi có nội dung chưa lưu cảnh báo; không gửi nhầm sang ca mới. Mất quyền gỡ nội dung/nháp khỏi UI.

**Dữ liệu/event tối thiểu:** request_id, source_session_id, channel WEB/APP, connection_state, last_customer_activity_at, expires_at, server_now, session_revision, bot_handoff_state; message_id, client_message_id, sender_type, text, sent_at, ack_state. Đúng session, event không cũ/không tương lai và không lặp mới áp dụng. Không ghép hội thoại theo số điện thoại. Transcript bàn giao bất biến; phần chat mới nối thêm; AI summary chỉ đọc phần bàn giao đến khi có hợp đồng tóm tắt mở rộng.

**Nhật ký:** chat_start/chat_pause/chat_send thành công/thất bại, người/ca/phiên/thời điểm/kết quả/mã tương quan; không copy nội dung tin nhắn vào CSKH log. Prototype dùng giờ hệ thống cho sự kiện mới; log fixture cũ vẫn theo ngày mẫu. Tắt chế độ chat không tự chuyển quyền lại cho AI.

### 4.15 Phiếu yêu cầu

**Mục tiêu:** tách công việc cần phối hợp/xử lý sau khỏi phiên chat ngắn. Là khả năng chung của ba BUC nguồn, không tạo kênh tiếp nhận thứ tư. Tên menu C-04 **Phiếu yêu cầu**; nút **Tạo phiếu yêu cầu**, form D-11. Sau Bắt đầu xử lý hiện lựa chọn tạo phiếu; trong ca IN_PROGRESS/WAITING cũng có nút ở panel khách hàng.

| Trường | Quy tắc |
|---|---|
| Mã phiếu | REQ-ngày-số thứ tự do hệ thống cấp sau lưu thành công; không dùng mã ca CS-… |
| Ca nguồn / tham chiếu nguồn / phiên | Chỉ đọc, bất biến, đúng ca đang mở; mỗi phiếu một ca; một ca có thể nhiều phiếu |
| Loại yêu cầu | Bắt buộc: Đặt hẹn chuyên khoa, Bảo lãnh viện phí, Cấp trích sao bệnh án, Hỗ trợ thông tin, Khác |
| Ưu tiên | Bắt buộc: Cao, Thường (mặc định), Thấp; chọn thủ công, không tự suy từ AI hoặc timeout |
| Đơn vị thụ lý | Bắt buộc: Đội Đặt hẹn, Tài chính kế toán, Kế hoạch tổng hợp, Nhóm CSKH; danh mục mẫu, không chứng minh đơn vị đã nhận |
| Hạn xử lý | Bắt buộc ngày/giờ hợp lệ sau hiện tại UTC+7; khác D-05 cho phép ngày không giờ; không tự gán SLA |
| Mô tả | Bắt buộc 1–4.000 ký tự, công việc và kết quả cần nhận |
| Dấu vết | Người/thời điểm tạo, trạng thái, lịch sử nội dung xử lý; requestKey chống lưu lặp |

Danh mục nêu trên để review UI, cần mapping đơn vị thật tại V-16. Không đưa loại Cấp cứu ngoài viện/ưu tiên Khẩn cấp từ HTML tham chiếu vào phiên bản này. Phiếu điều phối không thay hồ sơ bệnh án hoặc bằng chứng lịch đã xác nhận.

**Vòng đời:** Mới → Đang xử lý → Chờ phản hồi ↔ Đang xử lý → Hoàn tất; Đang xử lý/Chờ phản hồi có thể Hoàn tất hoặc Hủy, Mới có thể Hủy. Chuyển trạng thái phải có nội dung/kết quả 1–4.000 ký tự. Chỉ supervisor mở lại phiếu Hoàn tất/Đã hủy về Đang xử lý, kèm lý do. Không cho Mới → Hoàn tất trực tiếp. Mỗi thay đổi nối thêm lịch sử với người/thời điểm.

**Độc lập:** Tạo/hoàn tất/hủy phiếu không đổi trạng thái ca/phiên/lịch/CRM. Ca hoàn tất không tự đóng phiếu còn mở; phiếu vẫn truy cập theo quyền ca. Tiến độ phiếu là CSKH theo dõi/phối hợp; chọn đơn vị không tự gửi thông báo hoặc thực hiện nghiệp vụ của đơn vị. Kết quả đặt hẹn vẫn cần xác nhận và appointment_id từ nguồn. Không đổi nội dung source gốc.

**Quyền hiện tại:** STAFF chỉ đọc/tạo/cập nhật phiếu gắn ca mình đang phụ trách; SUPERVISOR trong nhóm. Chuyển owner nguồn làm người cũ mất quyền đọc/cập nhật phiếu, người mới tiếp tục; thu quyền gỡ chi tiết/nháp. Cấp quyền riêng cho cán bộ đơn vị thụ lý chưa được dựng trong prototype, cần V-16. “Đơn vị thụ lý” hiện là thông tin điều phối, không grant quyền qua một select.

**C-04:** tìm mã phiếu/mã ca/loại; lọc trạng thái, ưu tiên, đơn vị bằng checkbox chọn nhiều theo 4.25; số kết quả; 20 phiếu/trang. Table có mã nguồn, loại, ưu tiên, đơn vị, trạng thái, hạn/quá hạn. Chi tiết có mô tả, nguồn liên kết ngược, thao tác trạng thái và lịch sử. Empty/no-results/mất quyền có thông báo. Lỗi ghi giữ form/nháp, không sinh phiếu hoặc báo thành công giả. CSKH log dùng objectType=TICKET với ticket_create/ticket_update, chỉ metadata; bấm mã mở đúng phiếu. Mobile xếp lại table/panel, form cuộn trong viewport.

### 4.16 Enhance 1 — English wording

> Update the detail pages for AI Conversations, Website Contacts, and Website Bookings to use a consistent column order: **[optional module-specific panel] | Source / Conversation | Customer Details**. Keep Source and Customer Details adjacent, with Customer Details anchored on the far right. For AI chat, use the left panel as a conversation list and place case-processing controls in the customer-details panel. For the other intake types, use the left panel for case-processing controls. Preserve all existing actions and adapt the layout for mobile.

### 4.17 AI chat phía khách — phạm vi và ngôn ngữ

**Phạm vi bổ sung:** khung AI chat trên Website và mobile app của bệnh viện; tiếp nối BUC-001, không tạo nguồn tiếp nhận thứ tư. C-05 là bề mặt dành cho khách; C-02 vẫn là chi tiết ca phía CSKH. Không thiết kế lại toàn Website, form liên hệ/đặt khám, hệ thống đăng nhập hoặc CRM. AI log ở đây là nội dung hội thoại và bối cảnh phiên; phân biệt với CSKH log ở 4.8.

| Nội dung | Quy tắc |
|---|---|
| Ngôn ngữ | AI chat hỗ trợ đa ngôn ngữ. Ngôn ngữ khách chọn thủ công được ưu tiên; nếu không chọn, dùng ngôn ngữ được xác định đủ tin cậy từ tương tác của khách. Ngôn ngữ thiết bị chỉ là gợi ý, không ghi đè lựa chọn khách |
| Mặc định | Chưa xác định, độ tin cậy thấp, ngôn ngữ chưa hỗ trợ hoặc chưa tải được bản dịch: dùng tiếng Việt; luôn có lựa chọn đổi ngôn ngữ |
| Phạm vi dịch | Nhãn, cảnh báo, lỗi, countdown, form liên hệ, chờ/kết nối CSKH, mất kết nối và hết phiên cùng đổi theo ngôn ngữ hiện tại. Không tự dịch lại tin nhắn lịch sử hoặc sửa dữ liệu gốc |
| Thông báo đầu tiên | Thông báo thu thập dữ liệu luôn có bản tiếng Việt theo yêu cầu trực tiếp. Khi xác định ngôn ngữ khác, có thể hiện thêm bản dịch; bản tiếng Việt vẫn có thể đọc được |
| Lưu vết | `ui_locale`, `locale_source` (MANUAL/DETECTED/FALLBACK), ngôn ngữ từng tin nếu có và các lần đổi ngôn ngữ. Nhân viên biết ngôn ngữ khách dùng; không suy ra nhân viên biết ngôn ngữ đó |
| Prototype | Minh họa VI/EN và quy tắc fallback. Nhận diện tự động chỉ là bộ từ khóa mẫu; chưa chứng minh mô hình phát hiện ngôn ngữ hoặc danh sách ngôn ngữ production |

Danh sách ngôn ngữ phát hành, độ tin cậy của nhận diện, cơ chế điều phối nhân viên theo ngôn ngữ và người duyệt bản dịch thuộc V-18. Không hứa hỗ trợ con người bằng mọi ngôn ngữ chỉ vì AI chat có thể đổi ngôn ngữ.

### 4.18 Thông báo thu thập dữ liệu đầu phiên

Hiện trước khi khách gửi tin đầu tiên, ở đầu nội dung trò chuyện, cỡ chữ nhỏ nhưng đọc được, không dùng modal bắt buộc. Nội dung đề xuất cho bản này:

> Nội dung trò chuyện và thông tin bạn cung cấp sẽ được thu thập để hỗ trợ bạn. [Chính sách bảo mật](https://hiuhospital.com/chinh-sach-bao-mat).

Liên kết đúng URL người dùng cung cấp, mở tab mới trên Website hoặc màn chính sách có đường quay lại trên app; không kết thúc phiên, không xóa nháp. Khi chính sách không mở được, giữ nguyên phiên và cho thử lại. Không sao tên nhà cung cấp, điều khoản hoặc thương hiệu Rogers từ ảnh tham khảo vào sản phẩm HIUH.

**Lưu bằng chứng hiển thị:** `notice_shown_at`, `notice_locale=vi`, `notice_copy_version`, `policy_url`; nếu hệ thống chính sách cấp phiên bản thì lưu `policy_version`, không tự gán từ ngày trang hiển thị. `policy_opened_at` là tùy chọn và khác `consent_at`. Banner này không tự tạo `consent=true`, không thay cơ chế đồng ý của BUC-002/003 và không chứng minh tuân thủ. Chủ dữ liệu xác nhận cơ chế đồng ý cho AI chat trước triển khai tại V-19. BRD này không tự thêm checkbox hay cản luồng khi người dùng chỉ yêu cầu thông báo.

### 4.19 Đồng hồ phiên và cách tiếp tục

Kế thừa quyết định S-19 của v0.7: **mặc định 10 phút không có hoạt động từ khách**. Yêu cầu hiện tại cho phép dev quyết định cấu hình; dùng `idle_timeout_seconds=600` và `warning_before_seconds=120` trong prototype, không hardcode vào hợp đồng. Dev chốt tham số và tập hoạt động hợp lệ trước triển khai; thông điệp hiển thị theo cấu hình thực, không ghi 10 phút nếu cấu hình đã đổi.

| Tình huống | Phía khách | Phía CSKH / dữ liệu |
|---|---|---|
| Phiên còn hiệu lực | Có thể hiển thị thời gian còn lại mm:ss | Cùng mốc `expires_at` của nguồn; không có hai đồng hồ nghiệp vụ riêng |
| Còn tối đa ngưỡng cảnh báo | Cảnh báo “Phiên sắp kết thúc”, mm:ss, nút “Tiếp tục trò chuyện” | Badge ENDING, ưu tiên theo 4.14; không tự gán SLA/ưu tiên ca |
| Khách gửi tin hợp lệ | Gia hạn sau khi gateway tiếp nhận hoạt động | Tin CSKH, AI, heartbeat, tải trang, đọc hoặc gõ nháp không gia hạn |
| Khách chọn Tiếp tục | Đề xuất ghi một hoạt động chủ động, gia hạn sau ACK từ nguồn | Đây là hoạt động đề xuất bổ sung, cần V-18; không dùng bộ đếm FE làm thẩm quyền |
| Đang khai báo | Đồng hồ vẫn chạy; lỗi nhập liệu không làm phiên hết ngay | Gửi yêu cầu chuyển CSKH thành công được tính là hoạt động khách; chỉ mở form không gia hạn |
| Hết hạn | Thông báo rõ, khóa gửi vào phiên cũ, giữ lịch sử/nháp; nút “Bắt đầu phiên mới” | Log/case giữ nguyên. Phiên mới có ID mới, không tự gộp theo số hoặc mở lại phiên cũ |
| Mất kết nối | Giữ nháp, cho thử kết nối; không báo “Đã gửi” | UNKNOWN; xác nhận lại server trước gửi. Reconnect chỉ trong thời hạn còn hiệu lực |
| Ẩn tab/thu gọn/tải lại | Không reset thời gian hay quyền bot; khôi phục theo phiên được xác nhận | Khi quay lại, tính lại từ `expires_at/server_now`; không cộng thời gian nghỉ tab |

Nếu hết phiên trong lúc chờ CSKH, ca tiếp nhận đã lưu vẫn tồn tại; không xóa ca hoặc coi khách hủy nhu cầu. Có số hợp lệ thì nhân viên xử lý theo cách liên hệ được phép; thiếu số thì đánh dấu cần bổ sung/đi theo nhánh chờ của BUC-001. Không hứa chắc có thể gọi lại nếu số còn thiếu/sai. Cả hai phía cùng thấy phiên hết; không gửi tin muộn sang phiên mới.

### 4.20 Chuyển một chiều từ AI sang nhân viên CSKH

Toggle/nút **Chat với nhân viên CSKH** luôn dễ tìm trong phần đầu khung chat. Không yêu cầu khách phải tranh luận với AI hoặc nhập câu lệnh đặc biệt để gặp người. Việc nhận ca, bắt đầu xử lý và tiếp quản vẫn là ba bước khác nhau.

| Trạng thái tương tác khách | Hành vi và bước tiếp |
|---|---|
| AI_ACTIVE | AI trả lời; toggle tắt; bật toggle mở form tên/số |
| HANDOFF_FORM | Hiện hai trường và giải thích chuyển một chiều; chưa gửi yêu cầu. Khách có thể đóng form/“Tiếp tục với AI” khi chưa được CSKH tiếp nhận yêu cầu |
| REQUESTING | Đang gửi; chặn bấm trùng, giữ dữ liệu. Không hiện thành công khi chưa lưu bền vững |
| REQUESTED | Đã có ACK lưu yêu cầu/mã ca; hiển thị “Đang chờ nhân viên CSKH”, toggle bật và khóa. Khách tiếp tục gửi tin trong cùng phiên. Không tự trả về AI vì chờ lâu |
| HUMAN_ACTIVE | Nhân viên là owner, ca IN_PROGRESS, phiên hợp lệ, nguồn ACK đã dừng AI. Hiển thị tên nhân viên, tin người gửi rõ ràng; không thể bật AI lại trong phiên này |
| ENDED | Chỉ đọc phiên cũ, giữ ca và nháp; muốn chat mới phải mở phiên mới với ID mới |

**Chốt thiết kế:** khóa một chiều ngay sau ACK lưu yêu cầu chuyển CSKH thành công, sớm hơn mốc đã chat với nhân viên, để tránh AI và CSKH cùng phản hồi. Trước ACK lỗi gửi, form được giữ và cho thử lại/đóng form nếu nguồn xác nhận chưa lưu. Trường hợp mất ACK sau lưu: tra kết quả theo cùng `handoff_request_id` trước khi cho hủy, không tự gửi một yêu cầu khác.

Ngay khi yêu cầu được nhận, gateway ngừng phát các phản hồi AI mới cho phiên đó; phản hồi đang sinh đến muộn phải bị loại. Gửi công khai từ CSKH vẫn chờ ACK dừng bot và đúng quyền FR-33. Tắt chế độ xem chat ở Portal chỉ đổi cách xem, không chuyển quyền về AI. Mất kết nối, đổi ngôn ngữ, thu gọn, refresh hay đổi thiết bị không bỏ cờ khóa của cùng phiên.

Trong lúc chờ: giữ lịch sử, cho nhắn thêm nếu phiên còn hiệu lực, không bịa vị trí hàng đợi/ETA. Nếu không có nhân viên sẵn sàng, nói rõ chưa kết nối, cho để lại nội dung và liên hệ tổng đài hiện hữu; không tự tạo lịch hẹn gọi lại hoặc cam kết phản hồi. Hết phiên không tự biến thành hoàn tất ca.

### 4.21 Tên và số điện thoại — cảnh báo nhưng cho tiếp tục

**Đã được người dùng xác nhận trong phiên này:** “Cảnh báo rồi cho tiếp tục (đề xuất)”. Hai trường là thông tin tối thiểu hệ thống đề nghị khai báo, nhưng không là điều kiện cứng để tiếp cận CSKH. Form không có OTP, CCCD, email hoặc checklist nhận diện bắt buộc.

| Mã | Điều kiện FE | Cảnh báo dành cho khách | Cách tiếp tục / bàn giao |
|---|---|---|---|
| ERR_NAME_EMPTY | Tên rỗng hoặc chỉ khoảng trắng sau trim | “Bạn chưa nhập họ tên. Nhân viên sẽ hỏi lại khi kết nối.” | Sửa trường hoặc **Vẫn kết nối CSKH**; log gắn thiếu tên |
| ERR_PHONE_EMPTY | Số trống hoặc chỉ gồm khoảng trắng, gạch ngang `-`, `—` (chấp nhận thêm `–`) | “Bạn chưa nhập số điện thoại. Nhân viên chưa có số để liên hệ lại.” | Sửa hoặc tiếp tục; không tạo số giả/không hứa gọi lại |
| ERR_PHONE_INVALID | Sau chuẩn hóa phân cách không đúng 10 chữ số; chứa chữ/ký tự không được hỗ trợ cũng bị cảnh báo | “Số điện thoại chưa đúng 10 chữ số. Bạn có thể sửa hoặc tiếp tục để nhân viên hỗ trợ.” | Sửa hoặc tiếp tục; lưu nguyên bản, mã cảnh báo và quyết định tiếp tục |

**Không dùng câu “Dữ liệu không được import”, không loại dòng/loại ca.** Các đoạn quy tắc import người dùng đưa là nguồn nhận diện điều kiện lỗi; yêu cầu trực tiếp và xác nhận trên quyết định cách xử lý trong chat. Không đổi validation của import, BUC-002/003, D-09/10 hoặc CRM.

- Khi bấm Kết nối CSKH, kiểm tra cả hai trường; hiển thị lỗi dưới từng trường, focus trường lỗi đầu tiên. Không xóa nội dung, không khóa vĩnh viễn nút.
- Nếu có lỗi, hiện nhắc chung và nút **Vẫn kết nối CSKH** rõ ràng. Nút này gửi yêu cầu kèm `contact_validation_codes` và `validation_override_ack=true`; không cần tên/số hợp lệ. Server kiểm tra lại cấu trúc/an toàn và phân loại chất lượng dữ liệu nhưng không từ chối chỉ vì ba lỗi chất lượng trên.
- Tên gốc giữ dấu/chữ Unicode, không ép tên Việt. FE giới hạn 100 ký tự; số gốc 50 ký tự để tránh payload vô hạn. Khi vượt giới hạn không âm thầm cắt ở server; phản hồi lỗi có hướng khắc phục. Đây là lựa chọn giới hạn UI đề xuất.
- Chuẩn hóa trên bản sao: trim, bỏ khoảng trắng, dấu chấm, dấu ngoặc và gạch phân cách; **không xóa chữ rồi coi số còn lại là hợp lệ**. Đề xuất `+84` + 9 chữ số → `0` + 9 chữ số; số nước ngoài không đúng quy tắc vẫn được tiếp tục sau cảnh báo. Không xác minh nhà mạng/chủ số hoặc tính tồn tại; kiểm tra 10 chữ số không được gọi là đã xác minh.
- CSKH nhìn thấy cờ **Cần bổ sung thông tin**, mã lỗi, giá trị gốc và ngôn ngữ. Không tự tìm danh bạ từ số chưa hợp lệ; không tạo Contact/Patient giả. Thông tin bổ sung lưu riêng; sửa giá trị đã có tuân theo FR-25 (lý do/người/thời điểm/trước-sau).

### 4.22 AI log và bối cảnh phiên tại CSKH

Giữ bố cục C-02 của v0.7: **Danh sách hội thoại | Nội dung nguồn/trao đổi | Khách hàng & xử lý**. Không tạo thêm module AI log độc lập với ca. Prototype có route `ai-log.html` để review phần bổ sung C-02; menu CSKH log tiếp tục chỉ nhật ký thao tác.

| Vùng | Bổ sung và hành vi |
|---|---|
| Danh sách | Ca đã bàn giao, kênh Web/App, trạng thái phiên, phạm vi Chờ nhận/Của tôi. Chờ nhận chỉ metadata; sau nhận mới thấy tên/nội dung trong quyền |
| Đầu hội thoại | Mã ca/phiên, độ đầy đủ, trạng thái/countdown, trạng thái bàn giao, hành động Bắt đầu xử lý/Tiếp quản chat tùy điều kiện |
| Hội thoại | Phân biệt AI/Khách/CSKH, thời gian và ngôn ngữ từng tin; mốc khách yêu cầu CSKH và nhân viên tham gia. Giữ message_id/thứ tự, không gom bằng số điện thoại |
| Tóm tắt bàn giao | Dẫn tới tin nguồn thuộc đúng snapshot; phần thiếu nói rõ; không suy chẩn đoán hoặc thông tin khách chưa nêu. Tin mới sau bàn giao không âm thầm thay snapshot |
| Mốc phiên | Bắt đầu, đã hiện thông báo, đổi ngôn ngữ, chuyển CSKH, nhận/bắt đầu/tiếp quản, mất/khôi phục kết nối, hết hạn. Không đổ nội dung chat/giá trị người dùng vào metadata log |
| Khách hàng | Tên/số gốc; thông tin chăm sóc sau bổ sung; cờ/mã lỗi; không đánh dấu xác minh; không tự gộp Contact |
| Thông báo dữ liệu | Thời điểm/ngôn ngữ/phiên bản copy, liên kết chính sách; nhãn rõ “hiển thị thông báo không đồng nghĩa ghi nhận đồng ý” |
| Soạn tin | Trả lời khách/Ghi chú nội bộ riêng; nháp theo ca/chế độ; send cần ACK, lỗi giữ nháp. Tin nhân viên không reset đồng hồ khách |
| Trạng thái lỗi | PARTIAL/UNAVAILABLE không dựng log giả; loading có phản hồi; hết phiên khóa gửi nhưng giữ ca. Thu quyền gỡ nội dung và nháp. Empty/no-results có cách đổi lọc |
| Mobile | Tab Nội dung / Khách & Xử lý / Hội thoại; thao tác và dữ liệu không mất khi đổi tab; không tràn ngang toàn trang |

**Bổ sung hợp đồng dữ liệu đích:**

| Nhóm | Trường tối thiểu |
|---|---|
| Định danh và đồng bộ | source_system, source_session_id, request_id khi được tiếp nhận, handoff_request_id, correlation_id, session_revision, event_id, server_sequence, server_now |
| Ngôn ngữ | ui_locale, locale_source, message_locale nếu có; sự kiện đổi ngôn ngữ không sửa message gốc |
| Thông báo | notice_shown_at, notice_locale, notice_copy_version, policy_url, policy_version nếu nguồn có; consent_ref/at chỉ khi thực sự được thu |
| Liên hệ | original_name, original_phone, phone_normalized nếu hợp lệ, contact_validation_codes[], validation_override_ack, care_contact riêng |
| Bàn giao | requested_at, persisted_at, bot_stop_requested_at, bot_stop_ack_at, human_joined_at, owner_id, human_locked, handoff_status |
| Phiên | last_customer_activity_at, expires_at, idle_timeout_seconds, warning_before_seconds, connection_state |
| Hội thoại | message_id/client_message_id, sender_type, text, sent_at, server_sequence, delivery_ack, coverage, snapshot_revision |

**Độ tin cậy:** cùng phiên + cùng mã bàn giao phát lại trả cùng ca; khác phiên cùng số không gộp. Cùng khóa khác nội dung trả xung đột để đối soát. Tin trùng/cũ/khác phiên/tương lai bất hợp lệ không thêm lần hai, không hồi sinh phiên hết hạn. Thứ tự cùng timestamp dựa trên `server_sequence`, không sắp theo vai người gửi. Chỉ bàn giao phần đã nhận; dữ liệu đến bổ sung phải có phiên bản. API đọc/ghi luôn kiểm tra quyền hiện tại; localStorage/BroadcastChannel trong demo không là cơ chế phân quyền hoặc lưu bền vững production.

**Thu thập và tiếp nhận là hai mốc:** phiên AI có thể được lưu tại nguồn; không tự tạo một ca CSKH cho mọi lần mở chat. Phạm vi hiện hành tạo ca khi yêu cầu chuyển CSKH được lưu. AI kết thúc mà chưa chuyển CSKH không tự tạo ca chăm sóc. Chính sách thu/lưu các phiên không bàn giao cần V-19; không mở công cụ xem mọi cuộc chat của toàn bộ khách trong CSKH.

### 4.23 Truy vết phiên vừa hết trong 15 phút

**Mục tiêu:** giúp CSKH tìm lại các phiên vừa hết để đọc bối cảnh và tiếp tục xử lý ca. Đây là cửa sổ tra cứu sau hết hạn, độc lập với timeout 10 phút tại 4.14/4.19; không phải thêm 15 phút được chat.

Mốc tính là `expires_at` của đúng `source_session_id`, không phải thời điểm nhận ca, đóng ca, mở danh sách hoặc câu thoại cuối. Với cấu hình mặc định: `expires_at = last_customer_activity_at + 600 giây`. Đặt `elapsed = server_now − expires_at`; nhóm vừa hết khi phiên đã hết hạn và `0 ≤ elapsed < 900 giây`. Nguồn/server có thẩm quyền xác nhận mốc và phiên bản; đồng hồ trình duyệt chỉ phục vụ hiển thị. Prototype Portal dùng đồng hồ máy và mốc hoạt động mẫu; tích hợp thật phải xác minh V-21.

| Điều kiện | Nhóm lọc | Nhãn / kết quả |
|---|---|---|
| Chưa có phiên | NONE | Không có badge phiên; không khớp khi chọn bộ lọc phiên |
| Chưa hết, kết nối xác nhận, còn >120 giây | ACTIVE | Khách còn kết nối; countdown theo cấu hình |
| Chưa hết, kết nối xác nhận, còn ≤120 giây | ENDING | Sắp hết phiên |
| Chưa hết nhưng chưa rõ kết nối | UNKNOWN | Chưa rõ kết nối; khóa gửi |
| Đã hết, `0 ≤ elapsed < 900 giây` | RECENT_EXPIRED | **Phiên vừa hết trong 15'** |
| Đã hết, `elapsed ≥ 900 giây` | EXPIRED trong bộ lọc | **Đã hết hơn 15'** |

`RECENT_EXPIRED` chỉ là nhóm tra cứu của trạng thái nghiệp vụ `EXPIRED`; không thêm trạng thái được gửi tin. Hai nhóm hết phiên không chồng lấn. Tại đúng `expires_at`, phiên vào nhóm vừa hết; tại đúng `expires_at + 15 phút`, phiên ra khỏi nhóm. Nhãn hiện tại “Đã hết hơn 15'” của prototype bao gồm cả mốc **đúng 15 phút**. Khi hạn đã được nguồn xác nhận, kết nối lại không che trạng thái hết hạn; không có mốc đáng tin thì không tự suy thành vừa hết.

**Phạm vi và số lượng:** áp dụng quyền và tab trước khi đếm/lọc. Chờ nhận gồm ca NEW chưa có người phụ trách trong nhóm; Của tôi gồm ca do người dùng phụ trách; Của nhóm chỉ dành cho SUPERVISOR. Nhóm vừa hết có thể chứa ca RESOLVED/CANCELLED trong quyền, vì mục tiêu là tra cứu. Nhóm phiên còn mở kế thừa loại trừ ca đã hoàn tất/hủy. Không mở rộng sang mọi phiên AI chưa bàn giao.

**Tương tác tại C-01:**

- Nút lọc nhanh vừa hết đặt điều kiện phiên thành `[RECENT_EXPIRED]`, tắt `liveOnly`, giữ tìm kiếm/các nhóm lọc khác; bấm lại bỏ điều kiện nhanh. Nút phiên còn mở bật `liveOnly` và bỏ bộ lọc trạng thái phiên cũ.
- Số trên nút vừa hết phản ánh toàn phạm vi tab trong quyền, không phụ thuộc tìm kiếm/chủ đề/các bộ lọc bảng. Số kết quả bảng tính sau tất cả điều kiện, vì vậy có thể nhỏ hơn số trên nút.
- Nhóm được tính lại khi đồng hồ vượt mốc, khi tải lại hoặc quay lại tab. Một phiên có thể rời nhóm và phiên khác vừa hết đi vào; không lưu danh sách ID cố định. Khi cửa sổ hết, chỉ đổi nhãn/nhóm, lịch sử vẫn còn khi bỏ bộ lọc.
- View đã lưu giữ điều kiện “vừa hết trong 15 phút”; mỗi lần mở tính theo thời điểm hiện tại, không dùng thời điểm lúc lưu view.

**Xử lý tiếp:** xem log, bổ sung thông tin hoặc lập phiếu khi quyền/trạng thái ca cho phép. Không tự đổi trạng thái ca/phiếu, không tự đặt ưu tiên hoặc tạo cuộc gọi. Gửi tin/tiếp quản phiên đã hết vẫn bị chặn; giữ nháp/lịch sử. Tin đến muộn, refresh hoặc kết nối lại không hồi sinh phiên, không mở lại AI; phiên mới cần ID mới theo 4.19–4.22. Nhãn phân biệt vừa hết/đã hết từ 15 phút áp dụng ở Portal/AI log; cảnh báo hết phiên phía khách giữ theo 4.19.

### 4.24 Cột Câu hội thoại cuối cùng

**Vị trí:** cột tùy chọn, mặc định bật tại bảng Tiếp nhận & Xử lý (C-01), sau **Chủ đề**, trước **Trạng thái**. Có thể ẩn/hiện và lưu cùng view. Cột giúp đọc nhanh nội dung công khai gần nhất của đúng ca/phiên; không đổi phạm vi tìm kiếm, không thêm cách sắp xếp theo nội dung hội thoại.

| Nguồn | Nội dung được dùng |
|---|---|
| AI_HANDOFF | Tin công khai đã nhận hợp lệ từ transcript và phần chat nối tiếp của cùng phiên; vai gửi CUSTOMER, STAFF hoặc AI |
| WEB_CONTACT / WEB_BOOKING | Lời nhắn gốc của khách trong lần gửi nguồn, nếu có; người gửi CUSTOMER và thời điểm gửi/tiếp nhận đã có. Không suy ra có kênh trả lời trực tiếp |

**Chọn tin cuối:** chỉ xét tin có nội dung, đúng ca/phiên và đã nhận hoặc gửi thành công. Loại ghi chú nội bộ, sự kiện hệ thống, AI summary, bản nháp và tin gửi lỗi/chưa được xác nhận. Dùng thứ tự nguồn: thời điểm gửi, rồi `server_sequence` khi trùng thời điểm theo hợp đồng 4.22; không sắp theo vai gửi hoặc thời điểm mở UI. Tin trùng không thêm lần hai; tin cũ đến muộn không thay tin mới hơn. Prototype dùng timestamp và thứ tự sẵn có của transcript/luồng tin khi bằng giờ; hợp đồng thứ tự thật còn tại V-22.

| Người gửi | Chấm tròn | Nhãn chữ |
|---|---|---|
| CUSTOMER | Xanh lá `#22c55e` | Bệnh nhân |
| STAFF | Xanh dương `#0052d7` | CSKH |
| AI | Tím `#7c3aed` | AI |

Luôn có nhãn chữ cùng màu, không dùng màu làm dấu hiệu duy nhất. “Bệnh nhân” là nhãn vai người gửi của UI; không xác nhận người liên hệ đã có Patient ID hoặc đang nói cho chính mình. Hiển thị giờ theo Asia/Ho_Chi_Minh, nội dung rút gọn một dòng có dấu lược; nội dung đầy đủ đọc trong chi tiết ca. Chuỗi được hiển thị như văn bản, không thực thi HTML từ tin nhắn.

| Tình huống | Cột hiển thị / quyền |
|---|---|
| Chờ nhận, kể cả SUPERVISOR đang ở tab này | **Nhận xử lý để xem**; không trả text qua nội dung ô, tooltip hoặc dữ liệu chi tiết ngoài quyền |
| Ca đã nhận, người dùng có quyền hiện tại | Xem tin hợp lệ gần nhất; trả lời công khai thành công cập nhật người gửi, giờ và nội dung |
| PARTIAL | Tin gần nhất trong phần thực sự nhận được, kèm **Mới nhất đã nhận · log một phần**; không khẳng định là tin cuối tuyệt đối tại nguồn |
| UNAVAILABLE | **Chưa tải được hội thoại**; không lấy summary hoặc nội dung bịa làm thay thế |
| Không có tin hợp lệ / lời nhắn rỗng | **Chưa có câu hội thoại** |
| Chuyển owner hoặc thu quyền | Tính lại quyền và gỡ nội dung không còn được xem; view/cột đã lưu không cấp lại quyền |

Cột này là bản đọc của hội thoại gốc, không là bản ghi thứ hai để chỉnh sửa. Nội dung tin không được chép vào **CSKH log**; nhật ký hoạt động tiếp tục chỉ lưu metadata theo 4.8/4.22. Ghi chú nội bộ mới không thay đổi câu thoại cuối công khai.

### 4.25 Bộ lọc chọn nhiều

Control được chọn theo ý nghĩa: các giá trị phân loại có thể cùng xuất hiện trong tập kết quả dùng checkbox; khoảng thời gian, cách sắp xếp hoặc điều kiện hẹn chỉ chọn một. Không thay toàn bộ control thành checkbox.

| Màn | Checkbox chọn nhiều | Vẫn chọn một / giới hạn |
|---|---|---|
| C-01 Tiếp nhận & Xử lý | Trạng thái ca, Nguồn, Chủ đề, Trạng thái phiên; Phụ trách ở Của nhóm | Thời gian tiếp nhận, Hẹn theo dõi dùng radio; sort chọn một. Chờ nhận khóa Trạng thái ở Mới |
| C-04 Phiếu yêu cầu | Trạng thái, Ưu tiên, Đơn vị thụ lý | Tìm kiếm vẫn là một chuỗi; không thêm bộ lọc loại phiếu trong đợt này |
| C-03 CSKH log | Người thực hiện, Hành động, Kết quả, Loại đối tượng | Thời gian và sắp xếp chọn một; giữ giới hạn quyền xuất |

**Logic:** OR trong cùng nhóm, AND giữa các nhóm và điều kiện tìm kiếm/thời gian/phạm vi. Ví dụ `(Chủ đề = Đặt lịch khám OR Tư vấn gói khám) AND Nguồn = AI`. Không chọn giá trị nào nghĩa là không giới hạn nhóm đó; tập giá trị không trùng. Khi chọn bất kỳ trạng thái phiên, ca không có phiên không khớp. Kết hợp điều kiện không giao nhau trả kết quả rỗng trung thực; không tự nới bộ lọc hoặc quyền.

**Hành vi chung:**

- Áp dụng ngay mỗi lần chọn/bỏ checkbox; menu giữ mở, focus giữ tại lựa chọn để tiếp tục thao tác. Nút mở hiển thị đang lọc và số giá trị đã chọn trong nhóm.
- **Bỏ chọn** chỉ xóa nhóm đang mở. **Xong**, đóng, click ngoài hoặc Escape chỉ đóng menu, không là bước lưu và không hoàn tác các lựa chọn đã áp dụng. Escape trả focus về nút mở; checkbox có nhãn và dùng được bằng bàn phím.
- Thay bộ lọc đưa về trang 1; tổng số và phân trang tính trên kết quả trong quyền. **Xóa lọc** bỏ các điều kiện của màn hiện tại, giữ phạm vi và quyền. CSKH log ban đầu lọc 7 ngày; sau Xóa lọc, thời gian là Tất cả trong phạm vi quyền.
- C-01 có chip điều kiện để bỏ từng nhóm/điều kiện đang áp dụng theo 4.6. C-03/C-04 hiện dùng dấu đang lọc, số lựa chọn trên nút và thao tác xóa; không mặc định coi hai màn đã có toàn bộ cơ chế chip/view của C-01.
- Không có kết quả vẫn giữ điều kiện và cho xóa lọc. Lỗi tải giữ cấu hình, có thử lại; không dùng lỗi tải để báo số kết quả bằng 0. Khoảng ngày đảo ngược báo lỗi theo 4.6.

**View cá nhân tại C-01:** lưu mảng giá trị của từng nhóm cùng phạm vi, tìm kiếm, `liveOnly`, điều kiện ngày/hẹn, sắp xếp và cột theo 4.7. Mở lại phải khôi phục đủ nhiều giá trị; tính lại dữ liệu/15 phút/quyền tại thời điểm mở. Không lưu kết quả hay quyền vào view. Chuyển tab dùng cấu hình phù hợp phạm vi; không để filter phụ trách hoặc view Của nhóm vượt quyền của STAFF. Chưa mở rộng view cá nhân sang C-03/C-04.

**Chọn cột** cũng dùng checkbox nhưng là cấu hình trình bày, không là bộ lọc dữ liệu. Nút **Mặc định** phục hồi bộ cột mặc định; Mã yêu cầu và Thao tác luôn có. Bỏ cột không đổi tập ca hoặc quyền.

### 4.26 Menu, design system và dữ liệu review

Menu CSKH hiện hành theo thứ tự **Tiếp nhận & Xử lý → Phiếu yêu cầu → CSKH log → Thông báo → Mẫu thông báo**. Hai mục cuối vẫn disabled/future theo BR-15. Đổi tên C-04 từ “Phiếu yêu cầu CSKH” thành **Phiếu yêu cầu** tại menu, tiêu đề và breadcrumb; vẫn dùng mã REQ-… và nút Tạo phiếu yêu cầu. Việc đổi tên không gộp ca CS-… với phiếu.

Nguồn giao diện Portal: [Operation Portal Design System v0.3](../Design/operation_portal_design_system/hiu-hospital-design-system-v0.3/readme.md), ánh xạ cụ thể tại [DESIGN v0.9](prototype-portal-v0.9.0/DESIGN.md). Portal dùng Lexend cho nội dung, Plus Jakarta Sans cho heading; nền `#f6f8fd`, heading `#16205c`, nội dung `#3b4177`; sidebar 264px/header 64px trên desktop. Control, bảng, màu ngữ nghĩa, bo góc và responsive theo bộ chuẩn; giữ nhãn chữ bên cạnh dấu màu. Widget khách tiếp tục Montserrat theo Website HIUH, không áp typography Portal vào Website một cách máy móc.

| Màn/module đang hoạt động | Dữ liệu mẫu v0.9 dùng review |
|---|---|
| C-01/C-02 | 63 ca, 3 nguồn, 6 chủ đề, 5 trạng thái, nhiều owner và chưa phân công; thiếu/sai/tên dài, người đại diện, hẹn quá hạn/tương lai, lịch nguồn và CRM |
| Hội thoại/AI log | 21 ca AI trong Portal; kho chat tương tác riêng có 14 phiên mẫu Web/App, VI/EN, FULL/PARTIAL/UNAVAILABLE, chờ/người thật, mới hết/quá 15 phút, mất kết nối, lỗi liên hệ và ghi chú |
| C-04 | 25 phiếu thường trực; đủ 5 loại/5 trạng thái/3 ưu tiên/4 đơn vị, mô tả, hạn, người tạo, mã nguồn/phiên và lịch sử. M-44..46 có thêm phiếu phục vụ kịch bản kế thừa |
| C-03 | 128 sự kiện nền; 5 tác nhân, 3 kết quả, nhiều hành động/đối tượng, trước-sau/lý do/mã tương quan. Thao tác trong demo bổ sung sự kiện |

Số mẫu là độ bao phủ để thử UI, không là KPI hay số bắt buộc của sản phẩm. Quyền và mặc định thời gian có thể làm số dòng nhìn thấy thấp hơn tổng mẫu. Hai kho Portal/AI chat vẫn riêng, không chứng minh đồng bộ backend. Các module ngoài CSKH và hai menu future không được coi là mới triển khai. M-47..51 bổ sung vào 46 frame nền; 16 trạng thái W/L của v0.8 tiếp tục áp dụng.


## 5. Quy tắc nghiệp vụ

| Mã | Quy tắc | FR chính |
|---|---|---|
| BR-01 | Ba loại nguồn có hợp đồng riêng, giữ xuất xứ | 01..11 |
| BR-02 | bản ghi danh bạ khách hàng/Patient/yêu cầu hỗ trợ riêng; không tự gộp theo số; nhận diện tùy chọn | 07/12/13/21/25 |
| BR-03 | Khóa chống trùng và phiên bản sự kiện tăng; kiểm tra lại lúc ghi | 10/11/20/24/26/27 |
| BR-04 | Validation nguồn và server; đúng định dạng không là đúng danh tính | 04/07/25 |
| BR-05 | Sáu chủ đề, source_topic bất biến; phân loại chăm sóc có lịch sử | 06/14 |
| BR-06 | Consent Website gắn lượt gửi; không tự gán từ banner | 05/07 |
| BR-07 | Yêu cầu hỗ trợ khác lịch xác nhận; appointment_id chỉ từ nguồn | 08/18/20/26 |
| BR-08 | Chưa có bác sĩ vẫn tiếp nhận nhu cầu hợp lệ; không tạo dữ liệu giả | 07/08/20 |
| BR-09 | Transcript theo phiên và thứ tự; trạng thái đầy đủ không là xác minh | 01/02/03/13 |
| BR-10 | Phạm vi dữ liệu/quyền tối thiểu; y tế có cấu trúc giữ tại nguồn | 09/13/23 |
| BR-11 | Nhận/giao/chuyển giữ một người phụ trách; quyền đổi theo owner hiện tại | 16/19/23/28 |
| BR-12 | Vòng đời và điều kiện kết thúc tại 4.5 | 17/18/28 |
| BR-13 | Gốc bất biến, ghi chú nối thêm, nhật ký trước-sau có actor/time | 13/15/21/22 |
| BR-14 | Làm rõ thông tin bằng bổ sung/sửa có lý do khi cần; bỏ checklist mặc định | 12/21/25 |
| BR-15 | Future disabled có nhãn, không route/API giả | DR-03 |
| BR-16 | B2C/B2B theo nhu cầu, không gán vĩnh viễn theo bản ghi danh bạ khách hàng/kênh | 14/26/27 |
| BR-17 | B2B chờ CRM thực sự nhận, không tự đóng theo nút gửi | 18/27 |
| BR-18 | Mọi việc còn chờ có người chịu trách nhiệm, nội dung và mốc theo dõi; D-05 theo ngày/giờ tùy chọn, D-09/D-10 giữ timestamp tương lai (4.12) | 18/26/27/28 |
| BR-19 | Lọc/sort/view/cột chỉ đổi cách xem; luôn áp dụng quyền hiện tại trước tổng số, phân trang và xuất | 19/23/29/30 |
| BR-20 | View lưu cấu hình riêng theo tài khoản, không lưu kết quả hoặc quyền; không cập nhật ngầm | 29 |
| BR-21 | CSKH log chỉ nối thêm, che dữ liệu, SUCCESS/FAILED/DENIED đúng kết quả; xuất cũng có vết | 22/23/30 |
| BR-22 | AI summary có nguồn, có phiên bản, chỉ hỗ trợ đọc; không tự điều khiển chăm sóc | 03/22/31 |
| BR-23 | Phiên hết sau 10 phút không hoạt động khách; CSKH không gia hạn; nguồn trạng thái có thẩm quyền | 32/33 |
| BR-24 | Chat chỉ owner đang xử lý, phiên hợp lệ, ACK bàn giao; nội bộ và công khai tách biệt | 03/23/33 |
| BR-25 | Phiếu/ca/phiên/lịch/CRM độc lập, mã/nguồn bất biến; idempotency lúc tạo phiếu | 34 |
| BR-26 | Phiếu theo quyền ca hiện tại; lịch sử nối thêm, supervisor mới mở lại | 22/23/30/34 |
| BR-27 | Ngôn ngữ khách chọn ưu tiên; không xác định/không hỗ trợ thì VI; lịch sử giữ nguyên | 35 |
| BR-28 | Thông báo đầu phiên có VI và link chính sách; bằng chứng hiển thị khác bằng chứng đồng ý | 36 |
| BR-29 | Timeout mặc định 600s/nhắc 120s có cấu hình; server có thẩm quyền; không hồi sinh phiên cũ | 32/33/37/41 |
| BR-30 | Chuyển một chiều sau ACK nhận yêu cầu; không có HUMAN_ACTIVE → AI_ACTIVE trong cùng phiên | 03/33/38 |
| BR-31 | Ba lỗi tên/số là cảnh báo được tiếp tục có xác nhận; không áp dụng loại dòng import | 39 |
| BR-32 | Log bàn giao có locale/notice/validation/handoff; dữ liệu gốc bất biến, cùng số không gộp phiên | 01/02/21/40 |
| BR-33 | Gửi/retry giữ khóa và nháp, thông báo thành công cần ACK; thu quyền gỡ dữ liệu | 24/33/41 |
| BR-34 | Phiên vừa hết là tập EXPIRED có `0 ≤ now − expires_at < 900 giây`, tính động và trong quyền; không gia hạn chat, không xóa lịch sử, không tự đổi tiến độ ca/phiếu | 32/33/42 |
| BR-35 | Câu thoại cuối lấy tin công khai hợp lệ gần nhất đúng ca/phiên; có nhãn người gửi và mức đầy đủ; che trước nhận/ngoài quyền, bỏ nội bộ/lỗi/nháp | 19/23/40/43 |
| BR-36 | Checkbox phân loại: OR cùng nhóm, AND giữa nhóm; rỗng là tất cả trong phạm vi; áp dụng ngay, view lưu cấu hình nhiều giá trị và tính lại quyền/thời gian | 19/29/30/34/44 |

## 6. Phạm vi công việc và BUC

### 6.1 Sự kiện

| BE | Sự kiện | BUC |
|---|---|---|
| BE-001 | AI bàn giao phiên/bối cảnh | BUC-001 |
| BE-002 | Website gửi lời nhắn hợp lệ | BUC-002 |
| BE-003 | Website gửi nhu cầu đặt khám | BUC-003 |
| BE-004 | Nguồn lịch trả/cập nhật kết quả | BUC-001/002/003 khi đã gửi nhu cầu |
| BE-005 | CRM xác nhận/từ chối bàn giao | BUC-001/002/003 theo nhánh B2B |
| BE-006 | Hoạt động khách, cập nhật kết nối hoặc timeout phiên | BUC-001 |
| BE-007 | Tạo/cập nhật phiếu yêu cầu liên quan | Nhánh dùng chung BUC-001/002/003 |

### 6.2 BUC-001 — Tiếp tục chăm sóc từ AI

| Thuộc tính | Nội dung |
|---|---|
| Mục tiêu | Tiếp tục nhu cầu của khách, đạt kết quả tư vấn/đặt lịch/bàn giao phù hợp |
| Chủ thể | Khách, AI, CSKH; lịch/CRM khi cần |
| Khởi phát | BE-001 |
| Tiền điều kiện | Phiên/lượt bàn giao hợp lệ; chưa bắt buộc bản ghi danh bạ khách hàng, tên/số hoặc Patient ID |
| Kết quả | Case có trách nhiệm, bối cảnh gốc; việc đang chờ có mốc hoặc kết thúc đúng 4.5 |

| Bước | Nhân viên / khách | Hệ thống |
|---|---|---|
| 1 | Khách mở chat, đọc thông báo, chọn ngôn ngữ; bật chuyển CSKH, khai tên/số hoặc xác nhận tiếp tục sau cảnh báo | Thực hiện 4.17–4.22; lưu một ca sau ACK, giữ phiên/log/bối cảnh, khóa quay lại AI và yêu cầu nguồn dừng phản hồi trùng |
| 2 | Nhân viên nhận hoặc được giao | Cấp quyền đúng owner, giữ NEW |
| 3 | Bắt đầu, đọc bối cảnh | Hiện log theo quyền; thiếu phần nào báo phần đó |
| 4 | Liên hệ qua kênh hợp lệ, bổ sung tên/số nếu có | Lưu thông tin chăm sóc riêng; tự tìm lịch sử trong quyền, không bắt link/verify |
| 5 | Làm rõ nhu cầu cá nhân/doanh nghiệp | Giữ source_kind; ghi hướng xử lý khi nhân viên chọn |
| 6 | Cá nhân: hỗ trợ lịch; doanh nghiệp: bàn giao CRM; câu hỏi khác: tư vấn | Thực hiện nhánh chung ở 6.5 |
| 7 | Theo dõi và ghi kết quả | Giữ mốc, nguồn cập nhật; kết thúc theo 4.5 |

Nhánh thay thế: thiếu kênh liên hệ → giữ phiên, yêu cầu chủ kênh bổ sung, chờ nội bộ có mốc; log thiếu/lỗi → đọc phần có/thử lại, không dựng nội dung; không cần lịch → ghi kết quả tư vấn. Ngoại lệ quyền/race/lưu lỗi theo 6.6.

### 6.3 BUC-002 — Chăm sóc lời nhắn Website

| Thuộc tính | Nội dung |
|---|---|
| Mục tiêu | Hiểu lời nhắn và hỗ trợ đúng nhu cầu, kể cả đặt lịch hoặc doanh nghiệp |
| Chủ thể | Người liên hệ, Website, CSKH, lịch/CRM khi cần |
| Khởi phát | BE-002 |
| Tiền điều kiện | Trường và consent hợp lệ theo 4.3, mã lượt gửi ổn định |
| Kết quả | Case giữ nguồn/lời nhắn; kết quả hoặc việc tiếp theo rõ ràng |

| Bước | Người thực hiện | Hệ thống |
|---|---|---|
| 1 | Khách gửi form hiện có | Kiểm tra nguồn/server, consent, chống trùng, lưu rồi trả mã |
| 2 | Nhân viên nhận/giao và bắt đầu | Cấp quyền, ghi trách nhiệm |
| 3 | Đọc nhu cầu, liên hệ khách | Hiện tên/số và lịch sử trong quyền |
| 4 | Chỉnh thông tin khai nhầm nếu cần | Lưu trước-sau/lý do, giữ gốc; không yêu cầu đối chiếu ba trường |
| 5 | Xác định nhu cầu và hỗ trợ theo 6.5 | Topic đặt lịch chưa là lịch; chỉ gửi lịch/CRM khi nhân viên chọn |
| 6 | Theo dõi hoặc kết thúc | Áp dụng 4.5, giữ kết quả và mốc |

Nhánh thay thế: cùng số có nhiều người → hiện danh sách liên quan có nhãn, không auto-merge; chưa nghe máy → chờ và hẹn lại; khách chỉ muốn tư vấn → kết thúc support; doanh nghiệp → nhánh CRM, không đi qua đặt lịch cá nhân bắt buộc.

### 6.4 BUC-003 — Phối hợp nhu cầu đặt khám Website

| Thuộc tính | Nội dung |
|---|---|
| Mục tiêu | Theo dõi nhu cầu đến lịch xác nhận hoặc kết quả rõ từ khách |
| Chủ thể | Người đặt, Website, CSKH, chủ lịch |
| Khởi phát | BE-003 hoặc BE-004 |
| Tiền điều kiện | Trường/consent hợp lệ 4.4; bác sĩ có thể chưa chọn |
| Kết quả | Giữ yêu cầu nguồn, lịch cập nhật đúng; chăm sóc kết thúc đúng kết quả |

| Bước | Người thực hiện | Hệ thống |
|---|---|---|
| 1 | Website gửi nhu cầu khám | Tạo yêu cầu hỗ trợ theo booking_request_id, trạng thái chờ nếu chưa xác nhận |
| 2 | Nhân viên nhận và bắt đầu | Cấp quyền và giữ một người phụ trách |
| 3 | Liên hệ người đặt, làm rõ đặt cho ai và nhu cầu | Tách người liên hệ/người đi khám; không bắt Patient ID hoặc bản ghi danh bạ khách hàng |
| 4 | Phối hợp bộ phận lịch | Dùng yêu cầu đã có, không tạo yêu cầu thứ hai |
| 5 | Theo dõi, nguồn gửi kết quả | Chỉ nhận sự kiện đúng tham chiếu/phiên bản; CONFIRMED cần mã lịch |
| 6 | Ghi kết quả với khách | Có lịch hoặc khách chưa tiếp tục có lý do; không đóng support khi còn chờ lịch |

Nhánh thay thế: đã có lịch từ đầu → hiển thị lịch, không tạo lại; thiếu khoa/bác sĩ → làm rõ nhu cầu, không tạo giá trị; đặt hộ → tách người đi khám; nguồn hủy/từ chối → báo đúng, tiếp tục chăm sóc; phát hiện nhu cầu doanh nghiệp riêng → tiếp nhận riêng qua nguồn hiện hữu để tránh đổi nguồn/nhánh lịch đang hoạt động.

### 6.5 Các nhánh dùng chung

- **Cá nhân cần đặt lịch:** thông tin liên hệ tối thiểu → tự đặt/đặt hộ → nhu cầu/ngày mong muốn → gửi một yêu cầu lịch → chờ có mốc → nhận lịch từ nguồn → thông báo qua kênh hiện hữu/ghi kết quả. Không cần bác sĩ trước; không xây chat/SMS mới.
- **Doanh nghiệp:** tên/số người đại diện, tổ chức, nhu cầu → chuyển CRM → PENDING, CSKH vẫn chịu trách nhiệm → ACCEPTED có mã cơ hội/bên nhận → có thể kết thúc handoff. Nếu REJECTED/lỗi thì tiếp tục xử lý; không coi đã bấm gửi là hoàn tất.
- **Tư vấn khác:** giải đáp, ghi chú, kết thúc support nếu đã đáp ứng; không ép khách đặt lịch.
- **Nhận diện khách cũ:** tìm số/tên và chọn đúng người khi cần; tùy chọn, không chặn các nhánh trên.

### 6.6 Ngoại lệ dùng chung

| Tình huống | Xử lý |
|---|---|
| Hai người nhận đồng thời | Một người thắng; người còn lại thấy owner mới, không mở nội dung trái quyền |
| Chuyển khi đang mở form | Kiểm tra lại quyền lúc ghi; thu quyền thì đóng form, gỡ dữ liệu/draft |
| Lưu lỗi/timeout | Giữ draft khi còn quyền; retry cùng khóa, không báo thành công trước lưu |
| Sự kiện lặp/cũ | Không nhân bản, không làm lùi lịch/CRM |
| Số/email sai định dạng | Báo trường lỗi; không sửa gốc; không coi hợp lệ cú pháp là đã xác minh |
| Chưa nghe máy | Ghi lần thử, chờ có mốc; không tự kết luận số sai/khách rút |
| Sai bản ghi danh bạ khách hàng | Bỏ/thay liên kết tùy chọn có lý do, không merge/delete master |
| Khách rút | Ghi lý do; hủy yêu cầu hỗ trợ không hủy lịch; xử lý lịch ở nguồn nếu cần |
| Mở lại | Trưởng nhóm chọn owner hợp lệ, giữ đầy đủ lịch sử |

### 6.7 Tầm nhìn giữ nguyên

[Catalog BUC tương lai v0.2.0](CSKH-future-buc-catalog-v0.2.0.md) giữ mã 004..019 và các phụ thuộc App/Web/IAM. Không dùng lại mã tương lai cho nhánh CRM. Bàn giao CRM FR-27 là nhánh của ba BUC hiện tại; không bật notification hay hành trình khám.

## 7. Phạm vi sản phẩm và PUC

| PUC | BUC | BO | Bề mặt | FR |
|---|---|---|---|---|
| PUC-01 | BUC-001 | 1/3/4/5/6 | C-01, C-02 AI, C-05 phía khách; thao tác chung | 01..03,10..41 theo phạm vi từng FR |
| PUC-02 | BUC-002 | 2/3/4/5/6 | Form liên hệ có sẵn, C-01, C-02 lời nhắn | 04..06,10..28 |
| PUC-03 | BUC-003 | 3/4/5/6 | Form lịch có sẵn, C-01, C-02 lịch | 05,07..28 |

Luồng sản phẩm: C-01 nhận việc → C-02 đọc nguồn/tiếp tục → bổ sung liên hệ khi thiếu → hỗ trợ lịch hoặc chuyển CRM theo nhu cầu → chờ/tiếp tục → kết thúc hợp lệ. Chỉ hiện danh bạ trong vùng tùy chọn, bỏ ba badge đối chiếu. D-02 chỉnh tên/số/email cùng một lần; D-09/10 bảo vệ thao tác gửi sang lịch/CRM. B2B không cần bước chọn bản ghi danh bạ khách hàng trước.

Giữ 9 epic nền CSKH-01/02/03/04/05/07/09/11/13; FR-26..28 mở rộng CSKH-01/11/13. Năng lực nhận CRM B2B thuộc chủ CRM và phải đối chiếu phụ thuộc trước tích hợp. [Scope mới](CSKH-scope-of-work-v0.3.0.md), [inventory](CSKH-screen-inventory-v0.3.0.md), [design spec](CSKH-design-spec-1920x1080-v0.3.0.md), [binding](CSKH-name-phone-binding-v0.3.0.md).

## 8. Yêu cầu chức năng và phi chức năng

### 8.1 Yêu cầu chức năng

44 FR thuộc phạm vi đích của v0.9.0, ưu tiên Must trừ khi ghi khác. FR-01..25 giữ mã; các dòng thay đổi dưới đây thay nội dung tương ứng v0.2.0. Prototype mô phỏng không được coi là triển khai tất cả FR nền.

| ID | Yêu cầu và Fit Criteria | PUC | Epic | Quy tắc | Nguồn |
|---|---|---|---|---|---|
| FR-01 | **Nhận log AI:** Hệ thống phải nhận phiên Website/App được chuyển giao, giữ mã phiên/tin, người gửi, thời gian và thứ tự.<br>**Fit Criteria:** Hai phiên ở hai kênh hiển thị đúng tin, người gửi và thời điểm; log không thuộc phiên không bị trộn. | PUC-01 | CSKH-01 | BR-01, BR-09 | Yêu cầu người dùng; nội dung AI trong snapshot |
| FR-02 | **Bổ sung log không trùng:** Hệ thống phải chỉ thêm tin mới theo message_id; hiển thị FULL/PARTIAL/UNAVAILABLE đúng bằng chứng nhận.<br>**Fit Criteria:** Phát lại cùng message_id không nhân bản; thiếu đoạn hiển thị PARTIAL; khi nhận đủ chuyển FULL và giữ lịch sử. | PUC-01 | CSKH-01 | BR-03, BR-09 | Quy tắc v0.1.0 |
| FR-03 | **Bàn giao và quyền đọc:** Hệ thống phải cho nhân viên trong phạm vi đọc log gốc chỉ đọc; AI ngừng xử lý cùng yêu cầu sau chuyển giao.<br>**Fit Criteria:** Nhân viên đủ quyền đọc toàn bộ phần được bàn giao; không sửa log; tài khoản ngoài nhóm bị từ chối; chat trực tiếp chỉ khi người phụ trách đã bắt đầu xử lý, phiên hợp lệ và xác nhận bàn giao theo FR-32/33; không sửa transcript gốc. | PUC-01 | CSKH-01 | BR-09, BR-10 | Yêu cầu BUC-001; snapshot CSKH-04 |
| FR-04 | **Kiểm tra lời nhắn trước tiếp nhận:** Hệ thống phải kiểm tra tên, số liên hệ, email tùy chọn, chủ đề và nội dung tại giao diện trước gửi và kiểm tra lại ở máy chủ theo Mục 4.3.<br>**Fit Criteria:** Thiếu trường/sai định dạng được chỉ rõ tại giao diện; gửi trực tiếp dữ liệu sai vẫn bị từ chối; dữ liệu đúng định dạng tạo WEB_CONTACT nhưng không tự được ghi đã xác minh danh tính. | PUC-02 | CSKH-01 | BR-04, BR-05, BR-14 | S-01 ngày 31/10/2026; HTML nguồn |
| FR-05 | **Bằng chứng đồng ý:** Hệ thống phải yêu cầu consent=true và lưu thời điểm/phiên bản chính sách tại lượt gửi Website; không tự mặc định từ checkbox đang trống hoặc đoạn pháp lý.<br>**Fit Criteria:** Không đồng ý thì không tạo ca tiếp nhận từ form; payload có bằng chứng được lưu; BUC-003 dùng bằng chứng ở bước xác nhận của nguồn, không giả định HTML đã có checkbox. | PUC-02, PUC-03 | CSKH-01 | BR-04, BR-06 | HTML liên hệ/đặt lịch; quy tắc v0.1.0 |
| FR-06 | **Chủ đề liên hệ:** Hệ thống phải giữ sáu mã chủ đề HTML, phân biệt dat-lich của lời nhắn với một yêu cầu đặt khám.<br>**Fit Criteria:** Cả sáu mã ánh xạ đúng; WEB_CONTACT/topic=dat-lich không tự sinh appointment_id, CONFIRMED hoặc thông báo đặt lịch. | PUC-02 | CSKH-01, CSKH-05 | BR-05, BR-07 | HTML select cf-topic |
| FR-07 | **Thông tin đặt khám:** Hệ thống phải kiểm tra thông tin bắt buộc/định dạng tại giao diện nguồn trước gửi và kiểm tra lại khi tiếp nhận theo Mục 4.4; không mặc định chủ số liên hệ là người bệnh.<br>**Fit Criteria:** Tên tối đa 100, số bắt buộc, ngày không sai quy tắc; bác sĩ có thể rỗng; trường tùy chọn kiểm tra khi nhập; dữ liệu qua định dạng không tự xác minh danh tính; các trường y tế có cấu trúc không bị sao chép sang yêu cầu hỗ trợ. | PUC-03 | CSKH-01 | BR-02, BR-04, BR-06, BR-10, BR-14 | S-01 ngày 31/10/2026; HTML nguồn |
| FR-08 | **Chờ sắp bác sĩ:** Hệ thống phải tiếp nhận yêu cầu chưa có bác sĩ vào NEW với booking_status=PENDING_ARRANGEMENT và không yêu cầu appointment_id.<br>**Fit Criteria:** Trường hợp HTML chưa chọn bác sĩ vẫn được tiếp nhận khi đủ trường; giao diện báo chờ bệnh viện sắp xếp, không báo đã có lịch xác nhận. | PUC-03 | CSKH-01 | BR-07, BR-08 | HTML phần Tóm tắt |
| FR-09 | **Dữ liệu y tế tại nguồn:** Hệ thống phải chỉ giữ tham chiếu bảo vệ tới hồ sơ nguồn; không sao chép CCCD/BHYT/bệnh sử/dị ứng/thuốc vào ticket hoặc timeline chung.<br>**Fit Criteria:** Payload CSKH tối thiểu không có các giá trị trên; người có thẩm quyền xem tại hệ thống nguồn; không tự tạo schema cho phần bệnh sử đang thu gọn. | PUC-03 | CSKH-01 | BR-10 | HTML đặt lịch; quyết định tối thiểu dữ liệu |
| FR-10 | **Thông tin tiếp nhận tối thiểu:** Hệ thống phải giữ mã hệ thống nguồn, loại nguồn, mã lượt gửi, thời điểm gửi và mã tương quan; phân biệt AI_HANDOFF, WEB_CONTACT, WEB_BOOKING theo Mục 4.2.<br>**Fit Criteria:** Mọi lượt nhận có đủ thông tin nguồn để đối soát; loại không hỗ trợ bị từ chối; PRD ánh xạ rõ các tên tham chiếu source_system/source_kind/source_submission_id/submitted_at/correlation_id sang hợp đồng triển khai, không suy ra API đã tồn tại từ HTML. | PUC-01, PUC-02, PUC-03 | CSKH-01, CSKH-04 | BR-01, BR-03 | Quy tắc kế thừa; ranh giới BRD/PRD v0.1.3 |
| FR-11 | **Tạo một ticket:** Hệ thống phải tạo một request_id theo khóa nguồn/lượt gửi, khởi tạo NEW; gửi lại cùng dữ liệu trả cùng mã.<br>**Fit Criteria:** Ba lần cùng khóa chỉ có một ticket; cùng số nhưng khác submission_id có hai ticket; cùng khóa/nội dung khác bị báo xung đột, không ghi đè. | PUC-01, PUC-02, PUC-03 | CSKH-04 | BR-02, BR-03 | Quy tắc v0.1.0 |
| FR-12 | **Nhận diện bản ghi danh bạ khách hàng khi cần:** Cung cấp tra cứu danh bạ theo tên/số trong quyền; liên kết tùy chọn khi nhân viên xác nhận đúng người. Khách mới không phải tạo hoặc liên kết bản ghi danh bạ khách hàng để chăm sóc, đặt lịch hay chuyển CRM.<br>**Fit Criteria:** Không có tên/số thì không gợi ý một bản ghi danh bạ khách hàng bất kỳ; không auto-merge; sửa số bỏ liên kết cũ đang dùng và lưu vết, không tự gắn bản ghi danh bạ khách hàng khác. Liên kết bản ghi danh bạ khách hàng không đồng nghĩa chuyển B2B sang CRM. | PUC-01, PUC-02, PUC-03 | CSKH-02, CSKH-03 | BR-02, BR-14 | S-11 ngày 01/11/2026; DEC-CSKH01-016..021 |
| FR-13 | **Lịch sử liên hệ theo quyền:** Hiển thị lịch sử của yêu cầu hỗ trợ hiện tại và tìm các yêu cầu trước theo số chuẩn hóa hoặc bản ghi danh bạ khách hàng đã chọn, chỉ trong quyền hiện tại.<br>**Fit Criteria:** Có cùng số thì hiện các yêu cầu liên quan kèm tên/ngày/nguồn; ghi rõ số có thể dùng chung. Không tự gộp hoặc kết luận cùng người, không lộ số lượng/nội dung ngoài quyền. Số thiếu không hiện lịch sử tùy ý. | PUC-01, PUC-02, PUC-03 | CSKH-02, CSKH-03 | BR-02, BR-10, BR-13 | S-11 ngày 01/11/2026; DEC-CSKH01-016..021 |
| FR-14 | **Chủ đề và hướng xử lý:** Giữ sáu chủ đề nguồn; cho đổi chủ đề chăm sóc, ghi người/thời điểm/trước-sau; ghi chú lý do tùy chọn. B2C/B2B là hướng xử lý từng nhu cầu, không thay source_kind/source_topic.<br>**Fit Criteria:** Đổi chủ đề không ghi đè nguồn; cùng bản ghi danh bạ khách hàng có thể có các nhu cầu B2C và B2B khác nhau. Chưa rõ thì UNKNOWN, không suy đoán từ số hoặc kênh. | PUC-01, PUC-02, PUC-03 | CSKH-01, CSKH-11, CSKH-13 | BR-05, BR-16 | S-11 ngày 01/11/2026; DEC-CSKH01-016..021 |
| FR-15 | **Ghi chú nội bộ nối thêm:** Thể hiện tại ô nhập neo cuối cột giữa theo mục 4.11; không gửi ra kênh khách.  Hệ thống phải cho nhân viên được phân quyền thêm ghi chú hành chính với tác giả/thời điểm, không sửa hoặc xóa ghi chú cũ.<br>**Fit Criteria:** Hai ghi chú được giữ riêng; thao tác sửa/xóa bị từ chối ở API; không dùng ghi chú thay đổi bản gốc của Website/AI. | PUC-01, PUC-02, PUC-03 | CSKH-07 | BR-10, BR-13 | Snapshot CSKH-07 |
| FR-16 | **Nhận và điều phối yêu cầu hỗ trợ:** Hệ thống phải cho STAFF đang hoạt động tự nhận yêu cầu hỗ trợ NEW chưa có người phụ trách trong nhóm mà không chờ duyệt; SUPERVISOR được giao yêu cầu hỗ trợ hoặc chuyển người phụ trách theo Mục 4.5 và BR-11.<br>**Fit Criteria:** Hai STAFF cùng nhận hoặc STAFF nhận đồng thời trưởng nhóm giao chỉ một thao tác hợp lệ thành công; thao tác còn lại thấy trạng thái mới nhất, không ghi đè. Nhận/giao giữ NEW; chuyển yêu cầu hỗ trợ chưa kết thúc cần lý do, người đích hoạt động cùng nhóm và lịch sử trước/sau, không đặt lại tiến độ. STAFF không tự lấy/chuyển yêu cầu hỗ trợ đã có người phụ trách. | PUC-01, PUC-02, PUC-03 | CSKH-09 | BR-11, BR-12, BR-13 | S-01 ngày 31/10/2026, thay quy định phụ trách chỉ qua trưởng nhóm |
| FR-17 | **Vòng đời yêu cầu:** Hệ thống phải thực thi đúng ma trận NEW/IN_PROGRESS/WAITING/RESOLVED/CANCELLED.<br>**Fit Criteria:** Thử từng chuyển hợp lệ và không hợp lệ trong Mục 4; API và giao diện nhất quán; không còn QUALIFIED/NOT_QUALIFIED trên ticket giai đoạn này. | PUC-01, PUC-02, PUC-03 | CSKH-11 | BR-12 | Quyết định giải quyết xung đột scope |
| FR-18 | **Chờ và kết thúc theo kết quả khách hàng:** WAITING qua D-05 cần bên chờ, một nội dung chờ/việc cần làm và ngày theo dõi; giờ tùy chọn, không bắt buộc ở tương lai (4.12). RESOLVED cần kết quả và nội dung; CANCELLED/mở lại cần lý do.<br>**Fit Criteria:** Tư vấn thông thường được kết thúc support. Nhu cầu đặt lịch chỉ kết thúc appointment khi CONFIRMED và có mã lịch, hoặc declined khi khách chưa tiếp tục/không còn nhu cầu có lý do. B2B kết thúc handoff chỉ khi CRM đã nhận, có mã cơ hội khám đoàn và bên nhận; đang PENDING/REJECTED không đóng như đã bàn giao. Kết thúc không tự tạo CRM hoặc lịch. | PUC-01, PUC-02, PUC-03 | CSKH-01, CSKH-11, CSKH-13 | BR-07, BR-12, BR-17, BR-18 | S-11 ngày 01/11/2026; DEC-CSKH01-016..021 |
| FR-19 | **Danh sách tác nghiệp:** Chuẩn hóa Views / Filter / Result và responsive theo 4.6.1/4.13; lọc phiên đang mở theo FR-32, phiên vừa hết theo FR-42, preview theo FR-43 và bộ lọc chọn nhiều theo FR-44. Áp dụng chi tiết mục 4.6 (lọc nhiều giá trị, khoảng ngày, theo dõi, sort ổn định, chọn cột, phân trang).  Hệ thống phải có danh sách yêu cầu hỗ trợ NEW chưa có người phụ trách trong nhóm để tự nhận, danh sách đang phụ trách và bộ lọc nguồn/chủ đề/người phụ trách/trạng thái/ngày nhận.<br>**Fit Criteria:** STAFF thấy đúng yêu cầu hỗ trợ chờ của nhóm với mã, nguồn, chủ đề, thời điểm/tuổi và tình trạng phụ trách; trước khi nhận không đọc được lời nhắn/log hoặc liên hệ chi tiết. Case được nhận/giao không còn có thể tự nhận; không phát sinh dashboard, Kanban hoặc phân phối tự động. | PUC-01, PUC-02, PUC-03 | CSKH-11, CSKH-09 | BR-01, BR-10, BR-11, BR-12 | S-01 ngày 31/10/2026 |
| FR-20 | **Cập nhật kết quả lịch từ nguồn:** Nhận sự kiện có phiên bản tăng, mã riêng và booking_request_id đúng, áp dụng cả yêu cầu Website và nhu cầu đặt lịch do CSKH hỗ trợ từ AI/lời nhắn.<br>**Fit Criteria:** CONFIRMED phải có appointment_id; sự kiện cũ/lặp không làm lùi trạng thái; từ chối/hủy hiển thị đúng trạng thái, không tự đóng/hủy yêu cầu hỗ trợ; không đổi nguồn gốc ban đầu. | PUC-01, PUC-02, PUC-03 | CSKH-01, CSKH-11, CSKH-13 | BR-03, BR-07, BR-08 | S-11 ngày 01/11/2026; DEC-CSKH01-016..021 |
| FR-21 | **Bảo toàn thông tin khai báo:** Giữ bản gốc chỉ đọc; lưu riêng thông tin phục vụ chăm sóc sau bổ sung/sửa, có lịch sử trước-sau.<br>**Fit Criteria:** Thêm thông tin còn thiếu không bắt nhập căn cứ theo từng trường. Sửa/xóa giá trị đã có bắt buộc lý do; tự lưu người/thời điểm. Không ghi đè transcript, bản ghi danh bạ khách hàng master hoặc trạng thái lịch nguồn. | PUC-01, PUC-02, PUC-03 | CSKH-02, CSKH-03 | BR-02, BR-13, BR-14 | S-11 ngày 01/11/2026; DEC-CSKH01-016..021 |
| FR-22 | **CSKH log — ghi sự kiện:** Áp dụng hợp đồng sự kiện, danh mục và bảo vệ tại mục 4.8.1–4.8.3.  Hệ thống phải ghi thao tác trọng yếu cùng người, thời điểm, yêu cầu hỗ trợ, trước/sau, kết quả, lý do khi có và mã tương quan.<br>**Fit Criteria:** Từ một yêu cầu hỗ trợ truy được tiếp nhận, tự nhận/giao/chuyển, nhận diện, hiệu chỉnh, phân loại, ghi chú, trạng thái và cập nhật nguồn; truy cập nội dung nhạy cảm có vết; nhật ký kỹ thuật không chứa nội dung nhạy cảm. | PUC-01, PUC-02, PUC-03 | CSKH-13 | BR-11, BR-13, BR-14 | S-01 ngày 31/10/2026; quy tắc bảo toàn lịch sử |
| FR-23 | **Quyền theo nhóm và phụ trách hiện tại:** Hệ thống phải kiểm tra quyền STAFF/SUPERVISOR/INTEGRATION_ADMIN ở máy chủ cho mọi lần đọc/ghi.<br>**Fit Criteria:** STAFF xem danh sách chờ tối thiểu và nhận yêu cầu hỗ trợ thuộc nhóm, chỉ đọc/sửa chi tiết yêu cầu hỗ trợ đang phụ trách; SUPERVISOR quản lý nhóm; sau chuyển, nhân viên cũ dù đã mở yêu cầu hỗ trợ cũng không còn quyền cập nhật/đọc mới; ngoài nhóm bị chặn; INTEGRATION_ADMIN chỉ xem metadata lỗi. | PUC-01, PUC-02, PUC-03 | CSKH-02, CSKH-03, CSKH-09, CSKH-13 | BR-10, BR-11, BR-13 | S-01 ngày 31/10/2026, cập nhật phạm vi STAFF của DEC-CSKH01-009 |
| FR-24 | **Xử lý lỗi và phản hồi trung thực:** Hệ thống phải chỉ trả tiếp nhận thành công khi ticket đã lưu bền vững; lỗi có mã tương quan và cho retry cùng mã nguồn.<br>**Fit Criteria:** Mô phỏng lưu thất bại, mất phản hồi sau lưu, payload sai, nguồn không hợp lệ: không mất ticket/không trùng/không báo thành công sai; chỉ metadata lỗi vào log kỹ thuật. | PUC-01, PUC-02, PUC-03 | CSKH-01, CSKH-04, CSKH-13 | BR-03, BR-04, BR-13 | Quy tắc v0.1.0 |
| FR-25 | **Bổ sung và sửa thông tin liên hệ:** Cho bổ sung/sửa tên, số điện thoại, email trong một thao tác; kiểm tra định dạng và yêu cầu lý do khi thay thông tin đã có. Không duy trì checklist ba trường chưa/đã đối chiếu trong luồng thường.<br>**Fit Criteria:** AI thiếu tên/số nhập trong một lần, không cần bản ghi danh bạ khách hàng. Đổi số khai nhầm giữ số gốc, có người/thời điểm/lý do/trước-sau. Không nghe máy ghi kết quả lần liên hệ/WAITING, không tự kết luận số sai. Không có kết quả phù hợp được chọn sẵn. Tra lịch sử thuộc FR-13, không phải chức năng của FR-25. | PUC-01, PUC-02, PUC-03 | CSKH-02, CSKH-03 | BR-02, BR-04, BR-13, BR-14 | S-11 ngày 01/11/2026; DEC-CSKH01-016..021 |
| FR-26 | **Hỗ trợ đặt hẹn từ mọi nguồn đang hỗ trợ:** Nhân viên có quyền gửi nhu cầu cá nhân từ AI/lời nhắn/đặt khám vào quy trình lịch hiện có. Không cần bản ghi danh bạ khách hàng hay hồ sơ bệnh nhân tồn tại trước.<br>**Fit Criteria:** Có người liên hệ, số hợp lệ, người đi khám, dịch vụ/nhu cầu, ngày mong muốn và mốc theo dõi. Bác sĩ có thể thiếu. Chỉ tạo yêu cầu chờ sắp xếp; gửi lại cùng yêu cầu hỗ trợ/khóa không tạo trùng. Case đã có yêu cầu lịch chỉ theo dõi, không gửi lần hai. | PUC-01, PUC-02, PUC-03 | CSKH-01, CSKH-11, CSKH-13 | BR-07, BR-08, BR-16, BR-18 | S-11 ngày 01/11/2026; DEC-CSKH01-016..021 |
| FR-27 | **Bàn giao nhu cầu doanh nghiệp sang CRM:** Nhân viên phân loại nhu cầu B2B và chuyển kèm người liên hệ, số, doanh nghiệp/tổ chức, nhu cầu, nguồn và mã yêu cầu hỗ trợ sang CRM trong Operation Portal.<br>**Fit Criteria:** Không tự tạo Opportunity khi chỉ chọn bản ghi danh bạ khách hàng. Sau gửi hiển thị PENDING; chỉ ACCEPTED khi có xác nhận kèm mã cơ hội/bên nhận. Lỗi hoặc REJECTED giữ trách nhiệm CSKH. Một yêu cầu hỗ trợ/khóa bàn giao không sinh nhiều hồ sơ; không xây lại quy trình báo giá/khám đoàn trong CSKH. | PUC-01, PUC-02, PUC-03 | CSKH-01, CSKH-11, CSKH-13 | BR-03, BR-16, BR-17 | S-11 ngày 01/11/2026; DEC-CSKH01-016..021 |
| FR-28 | **Hẹn theo dõi:** Lưu bên chờ, nội dung chờ/việc cần làm và mốc theo dõi theo độ chính xác ngày hoặc phút tại 4.12.<br>**Fit Criteria:** D-05 điền sẵn tháng/năm từ giờ hệ thống, ngày do người dùng nhập, giờ tùy chọn, chấp nhận mốc quá khứ/hôm nay/tương lai; ngày phải tồn tại. D-09/D-10 vẫn bắt buộc thời điểm đầy đủ sau hiện tại. Mốc còn hiển thị trong Của tôi và chi tiết; ngày không có giờ chỉ quá hẹn sau cuối ngày UTC+7. Thay đổi người phụ trách giữ mốc/việc; tiếp tục xử lý không xóa lịch sử. Không tự gửi SMS/ZNS hoặc thêm SLA. | PUC-01, PUC-02, PUC-03 | CSKH-01, CSKH-11, CSKH-13 | BR-11, BR-12, BR-18 | S-11 ngày 01/11/2026; DEC-CSKH01-016..021 |
| FR-29 | **View cá nhân:** Lưu cấu hình tại 4.7, đặt tên, mở, đổi tên và xóa.<br>**Fit Criteria:** Refresh giữ view riêng tài khoản; áp dụng khôi phục mảng lọc/sort/cột/phạm vi và liveOnly theo 4.25, tính lại dữ liệu/cửa sổ 15 phút; thay điều kiện hiện Đã thay đổi; tên trùng/rỗng/không lưu được có lỗi; mất quyền không dùng view nhóm và không lộ kết quả cũ. | PUC-01/02/03 | CSKH-11 | BR-19/20 | S-15 |
| FR-30 | **Tra cứu và xuất CSKH log:** C-03 đọc sự kiện FR-22 theo 4.8, lọc chọn nhiều theo FR-44, phân trang/panel trước-sau; SUPERVISOR xuất CSV trong quyền.<br>**Fit Criteria:** Hành động thành công, thất bại, bị từ chối có kết quả đúng; chuyển owner loại quyền đọc của người cũ; nội dung nhạy cảm bị che; xuất đúng toàn bộ kết quả lọc, có sự kiện xuất và số dòng; không có sửa/xóa log. | PUC-01/02/03 | CSKH-13 | BR-10/13/19/21 | S-15 |
| FR-31 | **AI summary có nguồn:** Theo mục 4.10, phục vụ đọc nhanh bối cảnh BUC-001, trong cùng quyền đọc yêu cầu.<br>**Fit Criteria:** Mỗi nhận định dẫn tới đúng tin đã nhận; PARTIAL không chứa ý từ phần thiếu; UNAVAILABLE không có nhận định; EMPTY/LOADING/ERROR/STALE rõ ràng; kết quả cũ/khác phiên/thu quyền bị loại; không sửa dữ liệu nghiệp vụ; ghi metadata tạo/cập nhật trong CSKH log. | PUC-01 | CSKH-01, CSKH-13 | BR-09/10/13/22 | S-16 |
| FR-32 | **Nhận biết và ưu tiên phiên đang mở:** trạng thái/countdown/badge/banner/lọc nhanh theo 4.14; nhóm EXPIRED được phân loại tiếp theo FR-42.<br>**Fit Criteria:** đúng WEB/APP; 10 phút theo hoạt động khách; staff send không reset; trước nhận chỉ metadata; lỗi tải không fake số 0; quyền/tab/lọc áp dụng đúng; liveOnly lưu cùng view. | PUC-01 | C-01/C-02; M-40..43 | BR-10/23 | S-18/19 |
| FR-33 | **Chat trực tiếp từ ca AI:** chuyển lịch sử/live, đợi ACK, gửi/nhận và giữ nháp theo 4.14.<br>**Fit Criteria:** owner IN_PROGRESS + phiên hợp lệ; expired/unknown/thu quyền/đổi phiên chặn gửi; event sai phiên/lặp/cũ bỏ qua; lỗi gửi giữ nháp; chỉ ACK thành công báo Đã gửi; ghi chú nội bộ không gửi khách; mobile thao tác đầy đủ. | PUC-01 | C-02; M-41..43 | BR-03/10/13/23/24 | S-18/19 |
| FR-34 | **Tạo và theo dõi phiếu độc lập:** D-11/C-04 **Phiếu yêu cầu** theo 4.15, từ cả ba nguồn; bộ lọc chọn nhiều theo FR-44.<br>**Fit Criteria:** validation trường/hạn/khóa lưu, chống trùng, source bất biến; đủ vòng đời và nhật ký; lọc/phân trang/link nguồn; quyền đổi theo owner ca; không thay ca/lịch/CRM; đóng ca không đóng phiếu; mobile/lỗi/empty/mất quyền rõ ràng. | PUC-01/02/03 | C-02/C-04/D-11; M-44..46 | BR-25/26 | S-18 |
| FR-35 | **Ngôn ngữ AI chat:** thực hiện 4.17. **Fit Criteria:** VI mặc định; EN/VI đổi toàn bộ cảnh báo/form/trạng thái; lựa chọn thủ công thắng nhận diện; không thay tin lịch sử; locale có trong log. | PUC-01 | C-05/C-02 | BR-27 | S-20 |
| FR-36 | **Thông báo dữ liệu đầu phiên:** thực hiện 4.18. **Fit Criteria:** thông báo VI trước tin đầu; đúng link chính sách; mở link không mất nháp; log có thời điểm/copy; không tự gán consent. | PUC-01 | C-05/C-02 | BR-28 | S-20/22/23 |
| FR-37 | **Cảnh báo hết phiên phía khách:** thực hiện 4.19. **Fit Criteria:** mặc định 600s, cảnh báo ≤120s; countdown không âm; tin nhân viên không reset; tiếp tục chủ động đợi ACK; hết hạn giữ nháp/log, phiên mới có ID mới. | PUC-01 | C-05/C-02 | BR-29 | S-19/20 |
| FR-38 | **Khách yêu cầu nhân viên, chuyển một chiều:** thực hiện 4.20. **Fit Criteria:** toggle mở form; yêu cầu chưa lưu không báo đã chuyển; đã nhận khóa AI kể cả refresh; nhận ca ≠ bắt đầu ≠ tiếp quản; CSKH chỉ gửi sau ACK dừng bot. | PUC-01 | C-05/C-02 | BR-30 | S-20 |
| FR-39 | **Cảnh báo tên/số không chặn hỗ trợ:** thực hiện 4.21. **Fit Criteria:** đúng ba mã lỗi; tên Unicode/số có phân cách; lỗi có nút tiếp tục; override tạo ca thiếu/sai thông tin có cờ; không dùng thông báo import/loại dòng; không tự xác minh. | PUC-01 | C-05/C-02 | BR-31 | S-20/21 |
| FR-40 | **AI log có bối cảnh bàn giao:** thực hiện 4.22. **Fit Criteria:** đúng phiên/kênh, metadata ngôn ngữ/thông báo/validation/bàn giao; tin đúng thứ tự khi cùng timestamp; FULL/PARTIAL/UNAVAILABLE; CSKH log không chứa text chat; không lộ chi tiết trước nhận/ngoài quyền. | PUC-01 | C-02/C-03 | BR-32 | S-20/22 |
| FR-41 | **Khôi phục và phản hồi trung thực ở hai phía:** thực hiện 4.19/4.20/4.22. **Fit Criteria:** lỗi gửi/ACK giữ nháp và retry cùng khóa; mất ACK sau lưu tra kết quả; reconnect không reset idle/khóa AI; hết phiên trong lúc chờ vẫn giữ ca; không có nhân viên không báo đã kết nối; thu quyền gỡ nội dung. | PUC-01 | C-05/C-02 | BR-33 | S-20 |
| FR-42 | **Truy vết phiên vừa hết trong 15 phút:** badge, lọc nhanh và nhóm trạng thái theo 4.23.<br>**Fit Criteria:** mốc 0/14:59.999/15:00 đúng; số trên nút theo phạm vi và quyền, kết quả bảng theo toàn bộ điều kiện; tự đổi nhóm, view tính lại; giữ lịch sử và khóa gửi sau hết hạn. | PUC-01 | C-01/C-02; M-47, M-42, L-05 | BR-19/23/29/34 | S-24/25/26 |
| FR-43 | **Câu hội thoại cuối cùng trong danh sách:** cột mặc định bật và lưu cùng view theo 4.24.<br>**Fit Criteria:** đúng tin công khai mới nhất, đủ ba vai/màu/nhãn/giờ; tin gửi thành công cập nhật; nội bộ/lỗi/nháp không thay preview; Chờ nhận/thu quyền che nội dung; PARTIAL/UNAVAILABLE/EMPTY rõ; nguồn Website dùng lời nhắn gốc. | PUC-01/02/03 | C-01/C-02; M-48, M-40 | BR-09/10/19/32/35 | S-24/25/26 |
| FR-44 | **Bộ lọc chọn nhiều nhất quán:** C-01/C-03/C-04 theo 4.25; chọn một giữ cho thời gian/hẹn/sort.<br>**Fit Criteria:** OR/AND và không chọn đúng; áp dụng ngay, menu/focus giữ ổn định; Bỏ chọn/Xong/Escape đúng nghĩa; reset trang/tổng số theo quyền; view C-01 phục hồi mảng lựa chọn, cột và cửa sổ động; không hứa view trên màn chưa hỗ trợ. | PUC-01/02/03 | C-01/C-03/C-04; M-49..51 | BR-19/20/36 | S-24/25/26 |

### 8.2 Tám nhóm NFR Volere

#### 8.2.1 Giao diện và cảm nhận — Look and Feel

- **NFR-LF01:** Nhãn nguồn và trạng thái phải phân biệt lời nhắn, yêu cầu đặt khám và lịch xác nhận.
  - **Fit Criteria:** Ba loại nguồn có nhãn riêng; PENDING_ARRANGEMENT không hiện thành Đặt lịch thành công; 6 topic đúng nhãn HTML.
  - **Ưu tiên:** Cao. **Nguồn:** S-02, DEC-CSKH01-007/010. **PUC:** 01/02/03.

#### 8.2.2 Khả năng sử dụng và nhân văn — Usability and Humanity

- **NFR-UH01:** Lỗi nhập liệu/tiếp nhận phải chỉ rõ việc người dùng có thể làm tiếp và bảo toàn dữ liệu để thử lại.
  - **Fit Criteria:** Thiếu trường, sai số/email được chỉ rõ trước gửi; máy chủ vẫn từ chối dữ liệu sai khi bỏ qua giao diện. Nhãn dữ liệu đã qua định dạng không bị thể hiện thành đã xác minh thực tế; thông báo tranh chấp nhận yêu cầu hỗ trợ chỉ rõ không nhận thành công. Khi lỗi lưu không mất nội dung hoặc tạo trùng.
  - **Ưu tiên:** Cao. **Nguồn:** S-02; chuẩn hóa bản đầu tiên. **PUC:** 02/03.

#### 8.2.3 Hiệu năng — Performance

- **NFR-PE01:** Danh sách tác nghiệp phải đáp ứng kiểm thử chức năng ở tập dữ liệu quy mô nhỏ đã định nghĩa cho bản đầu tiên.
  - **Fit Criteria:** Với 1.000 ca tiếp nhận giả lập, 10 nhân viên đồng thời, 95% thao tác tải/lọc danh sách trả kết quả trong ≤2 giây trong môi trường UAT được ghi cấu hình. Đây là tiêu chí thiết kế BA chọn, chưa là số đo hoặc SLA đã cam kết.
  - **Ưu tiên:** Trung bình. **Nguồn:** Chuẩn hóa để đo; DEC-CSKH01-011. **PUC:** 01/02/03.

#### 8.2.4 Vận hành — Operational

- **NFR-OP01:** Tiếp nhận phải phục hồi được sau mất phản hồi hoặc phát lại sự kiện.
  - **Fit Criteria:** Cùng 100 lượt gửi giả lập được phát lại 3 lần và có ngắt kết nối sau lưu; đối soát có đúng 100 ca tiếp nhận, không mất dữ liệu và có mã tương quan để xử lý lỗi.
  - **Ưu tiên:** Cao. **Nguồn:** BR-03, FR-11/24. **PUC:** 01/02/03.

#### 8.2.5 Khả năng bảo trì — Maintainability

- **NFR-MA01:** Bộ kết nối phải tách ánh xạ dữ liệu nguồn khỏi quy trình tạo ca tiếp nhận chung.
  - **Fit Criteria:** Ba source_kind đi qua cùng quy tắc tạo ca tiếp nhận/chống trùng; thay mapping một nguồn không đổi ID hoặc trạng thái của hai nguồn còn lại; có phiên bản hợp đồng và bộ payload mẫu.
  - **Ưu tiên:** Cao. **Nguồn:** DEC-CSKH01-005. **PUC:** 01/02/03.

#### 8.2.6 An ninh và bảo mật — Security

- **NFR-SE01:** Quyền theo nhóm/phụ trách phải được kiểm tra ở API; nội dung nhạy cảm không xuất hiện trong log kỹ thuật hay danh sách chung.
  - **Fit Criteria:** Mọi ca đọc/ghi ngoài quyền hiện tại bị từ chối; STAFF chỉ xem metadata danh sách chờ của nhóm trước nhận; nhân viên cũ không đọc/ghi mới sau chuyển; INTEGRATION_ADMIN chỉ đọc metadata lỗi; nội dung chi tiết và lịch sử hiệu chỉnh chỉ trả cho người có quyền; dữ liệu y tế có cấu trúc giữ tại nguồn.
  - **Ưu tiên:** Rất cao. **Nguồn:** BR-10/11/13. **PUC:** 01/02/03.

#### 8.2.7 Văn hóa và chính trị — Cultural and Political

- **NFR-CP01:** Giữ tên/chữ tiếng Việt của người dùng và danh mục nguồn; chuẩn hóa số không thay đổi tên gốc.
  - **Fit Criteria:** Tên có dấu được lưu/hiện nguyên vẹn; Nam/Nữ/Khác và 6 topic đúng nhãn; tên khoa nếu có dùng danh mục HIUH, không tự dịch. Không có yêu cầu chính trị riêng trong scope.
  - **Ưu tiên:** Cao. **Nguồn:** S-02; Reference/Terminology/hiuh-terminology.md. **PUC:** 01/02/03.

#### 8.2.8 Pháp lý và tuân thủ — Legal

- **NFR-LE01:** Phải giữ bằng chứng đồng ý cho lượt gửi form Website BUC-002/003 và tuân theo phạm vi dữ liệu/quyền đã được chủ dữ liệu cấp khi triển khai.
  - **Fit Criteria:** Lượt Website có consent_at/policy_version/evidence_ref; tài liệu triển khai ghi chủ dữ liệu, nơi lưu, phạm vi quyền và chính sách lưu/xóa được áp dụng; không suy ra sự đồng ý hoặc tuân thủ từ dòng pháp lý trong HTML. Không tự cam kết thời hạn lưu chưa có căn cứ.
  - **Ưu tiên:** Rất cao. **Nguồn:** S-02; DEC-CSKH01-006/009/011. **PUC:** 01/02/03.


### 8.3 Hợp đồng UI

| DR | Yêu cầu |
|---|---|
| DR-01 | Bốn màn Portal và C-05 responsive; dùng shell/token Operation Portal DS v0.3 theo 4.26; C-05 dùng nhận diện HIUH, kiểm tra 360/390/768/1280/1440/1920 và viewport người dùng; không scale khung 1920 |
| DR-02 | Các phần Website ngoài khung AI chat giữ nguyên; hiển thị tên người liên hệ/người đi khám đúng ngữ cảnh; lịch sử theo số có nhãn chưa kết luận danh tính |
| DR-03 | Giữ hai menu tương lai disabled. Cột giữa dành cho nguồn và ghi chú nội bộ; bỏ hai tab placeholder Hành trình khám/Thông báo để dành không gian đọc. Không triển khai các chức năng đó |
| DR-04 | Giữ 11 overlay, mở rộng thành 51 frame M-01..51 và 16 trạng thái W/L tại prototype-portal-v0.9.0/review-ai.html. C-02 ai-log.html là route review phần bổ sung, không là module mới |
| DR-06 | D-05 theo 4.12; filter theo 4.6.1/4.25; keyboard và mobile theo 4.13; badge/preview theo 4.23/4.24 |
| DR-07 | Menu Tiếp nhận & Xử lý → Phiếu yêu cầu → CSKH log; cột câu cuối có màu, nhãn chữ và thời gian, che trước nhận; DS và dữ liệu mẫu theo 4.26 |
| DR-05 | Không có checklist đối chiếu thường trực; một thao tác bổ sung/sửa; danh bạ thu gọn; hành động kế tiếp rõ theo nhu cầu |

## 9. Phụ thuộc và phần cần xác minh khi tích hợp

| Mã | Chủ thể | Việc cần xác minh / điều kiện |
|---|---|---|
| V-01..08 | Chủ kênh, IAM, danh bạ, tích hợp | Các bằng chứng nguồn, consent, quyền, dedupe, payload và kiểm tra dữ liệu của baseline v0.2.0 vẫn còn; không coi mock đã giải quyết |
| V-09 | AI/Website/App | Quyền quay lại đúng phiên, thông tin liên hệ và đường yêu cầu nguồn bổ sung khi hết phiên |
| V-10 | Chủ lịch | API/route gửi nhu cầu, idempotency, mã yêu cầu/lịch, callback/version và quyền thực hiện; không tự phát minh endpoint |
| V-11 | Chủ CRM/PO | Theo Sale CRM v0.4.2 do người dùng chỉ định: hợp đồng nhận Cơ hội khám đoàn, xử lý trùng danh bạ ở CRM, người phụ trách đích, mã cơ hội, callback và quyền; không lấy ưu tiên P1 làm bằng chứng đã triển khai |
| V-12 | Chủ dữ liệu/CSKH | Quyền xem lịch sử theo số dùng chung; xác nhận luồng không lộ yêu cầu hỗ trợ ngoài quyền |
| V-13 | IAM / nền tảng | API view riêng theo tài khoản và scope; mất quyền không dùng cấu hình để vượt quyền |
| V-14 | Chủ dữ liệu / nền tảng | Lưu log bền vững, nguyên tử với thay đổi, thời hạn lưu, quyền xuất và bảo vệ trước/sau; chưa xác minh từ prototype |
| V-15 | Dev AI/Web/App | Presence, last_activity/expiry/server clock, ACK dừng bot, transport, thứ tự/idempotency; mặc định 10 phút, tham số theo V-18 |
| V-16 | CSKH / IAM / đơn vị thụ lý | Danh mục loại/đơn vị thật, quyền cập nhật của đơn vị, giao nhận/notification, API phiếu và quan hệ source bất biến |
| V-17 | Nền tảng | Lưu bền vững message/phiếu, retry sau timeout, chống trùng server, nhật ký nguyên tử và revoke realtime |
| V-18 | Dev AI/Web/App + PO | Chốt idle/warning có cấu hình, hoạt động chủ động được tính; ngôn ngữ hỗ trợ, độ tin cậy và người duyệt bản dịch; khôi phục phiên an toàn |
| V-19 | Chủ dữ liệu/bệnh viện | Duyệt copy thông báo, cơ chế đồng ý phù hợp, phiên bản chính sách, thời hạn lưu/xóa, phạm vi AI-only và dữ liệu đến nhà cung cấp; banner không tự chứng minh tuân thủ |
| V-20 | Chủ kênh + CSKH + IAM | API bàn giao/case/ACK bot, khóa một chiều server, xử lý không có nhân viên, mapping validation soft/server, quyền hai phía và retry mất ACK; chưa có endpoint thật được xác minh |
| V-21 | Dev AI/Web/App + nền tảng | Hợp đồng `expires_at/server_now/session_revision`, đồng bộ đồng hồ/refresh và tính nhóm 15 phút tại nguồn có thẩm quyền; xử lý thiếu/sai mốc, event đến muộn và thu quyền. Quy tắc 15 phút đã chốt, tích hợp chưa nghiệm thu |
| V-22 | Chủ kênh + CSKH + IAM | Cấp tin công khai cuối đúng ca/phiên, thứ tự `server_sequence`, ACK/trùng/mức đầy đủ và ẩn dữ liệu trước nhận; quyền phải áp dụng cả payload/tooltip/cache, không chỉ che CSS. Prototype mới chứng minh với dữ liệu mẫu |
| V-23 | Nền tảng + IAM | Hợp đồng truy vấn mảng giá trị OR/AND, tổng số/phân trang/xuất theo quyền; lưu view riêng và khôi phục điều kiện động; danh mục/giá trị cũ khi quyền đổi. Chưa có API thật được xác minh |

**Các điểm cần phân biệt:** B2B vào Cơ hội khám đoàn; B2C ở CRM là Hồ sơ tư vấn (Consultation Case). CSKH dùng ca tiếp nhận trong Tiếp nhận & Xử lý; công việc cần theo dõi riêng là Phiếu yêu cầu. BOOKED của CRM chỉ là cam kết ngày/khung giờ dự kiến, không tự là lịch khám chính thức. Nguồn Website/App đã vào CRM cần giữ tham chiếu và một bên chủ trì chăm sóc, tránh hai nhóm cùng liên hệ hoặc tạo bản trùng; không tự tạo thêm Hồ sơ tư vấn khi chỉ gửi nhu cầu từ CSKH. Các hợp đồng tích hợp chưa được xác minh.

## 10. Cổng quản trị và bàn giao

| Cổng | Kết luận |
|---|---|
| SCOPE-01 | GO cho BRD và prototype mới theo S-11; bản cũ giữ nguyên |
| TRACE-01 | Giữ 3 BUC nguồn; 44 FR, 36 BR; thêm FR-42..44/BR-34..36; phần mới 4.23–4.26 và 10.7 |
| UI-01 | Đối chiếu prototype v0.9.0 và QA hiện có; báo cáo đồng bộ tài liệu tại 10.7. Không coi tiêu chí đích là đã kiểm thử tích hợp |
| INTEGRATION-01 | CONDITIONAL GO; V-09..23 và các V nền chưa xác minh; không nghiệm thu production bằng dữ liệu mẫu |

Các kiểm tra bắt buộc: khách mới không có bản ghi danh bạ khách hàng gửi được nhu cầu lịch; nhiều người cùng số không bị gộp; sửa số giữ gốc/lý do; đang chờ lịch không đóng support; B2B pending không đóng handoff; accepted có mã/bên nhận mới được đóng; lỗi lưu không mất draft; quyền bị thu không ghi được; callback cũ/lặp bị bỏ qua.

[Decision Log v0.3.0](decision-log-additions-v0.3.0.md) · Quyết định cập nhật đã nhúng tại mục 10.1 · [prototype v0.6.0](prototype-portal-v0.6.0/README.md).


### 10.1 Quyết định phiên bản v0.4.0 — lịch sử (nhúng trong BRD)

| Mã | Quyết định | Căn cứ |
|---|---|---|
| DEC-CSKH-022 | Dùng Yêu cầu hỗ trợ / Nhận xử lý; giữ CSKH, danh bạ và ranh giới CRM ở 4.1.1 | S-15; cần rõ hành động và tránh lẫn hồ sơ |
| DEC-CSKH-023 | Lọc nhiều giá trị, sort ổn định, cột và view cá nhân theo 4.6–4.7 | S-15; đối chiếu trực tiếp CRM |
| DEC-CSKH-024 | CSKH log có phạm vi quyền, trước/sau an toàn, xuất có vết | S-15; mở rộng FR-22, bổ sung FR-30 |
| DEC-CSKH-025 | BRD là nguồn chuẩn thuật ngữ; báo cáo terminology cũ chỉ là bằng chứng | S-15; tránh quản lý hai đặc tả song song |

### 10.2 Truy vết UI và kiểm chứng — lịch sử v0.6

| Yêu cầu | Bề mặt | Frame / bằng chứng |
|---|---|---|
| FR-19/29 | C-01 Yêu cầu hỗ trợ | M-01..03, M-30 quá hẹn, M-31 lưu view; kiểm tra nhiều bộ lọc, sort, reload, tên trùng, cột, quyền |
| FR-22/30 | C-03 CSKH log | M-32 danh sách, M-33 chi tiết; sự kiện ghi/lỗi/thu quyền/xuất |
| FR-01..28 còn lại | C-02 và 10 overlay | M-04..29 giữ; kiểm tra hồi quy luồng mới từ AI, đặt hẹn, bàn giao CRM, thông tin liên hệ |

Xem [QA của prototype v0.6.0](prototype-portal-v0.6.0/QA.md). Bản v0.6 gồm 3 màn, 10 overlay nghiệp vụ, form lưu view nội tuyến và panel log, 39 frame. Tất cả thao tác nghiệp vụ/log trong bộ nhớ; tải lại đặt lại dữ liệu mẫu. View cá nhân lưu cấu hình localStorage. Chưa có backend, database, IAM, CRM/HIS thật; không nghiệm thu production bằng kiểm tra prototype. Không thay đổi CRM cổng 8080.


### 10.3 Quyết định v0.5.0 và ma trận thay đổi

| Quyết định | Nội dung | Truy vết |
|---|---|---|
| DEC-CSKH-026 | Học nhóm 1/2/4 theo 4.9; chỉ 3 BUC, không dùng vòng đời Case rộng của handoff | S-16; FR-11/17/18/19 |
| DEC-CSKH-027 | AI summary cần nguồn, phiên bản, đầy đủ/trạng thái và quyền | S-16; FR-31 |
| DEC-CSKH-028 | Ghi chú nội bộ ở giữa, giữ dữ liệu khách và điều phối hai bên | S-16; FR-13/15/22 |
| DEC-CSKH-029 | Giữ nguyên v0.5, tạo prototype v0.6; BRD không ghi đè | S-16 |

| Frame | Mục tiêu |
|---|---|
| M-04 | Khách mới AI, summary có dẫn chiếu, ghi chú nội bộ và case |
| M-05/M-06/M-25 | Lời nhắn, lịch và nhu cầu B2B giữ đúng nhánh, không có summary AI giả |
| M-20/M-37 | Nguồn một phần và summary chỉ nội dung đã nhận |
| M-21/M-38 | Nguồn không tải được, không tạo summary |
| M-34 | Summary cần cập nhật |
| M-35 | Tạo summary lỗi, thử lại |
| M-36 | Chưa có summary |
| M-39 | Lọc Hội thoại AI trong Của tôi bằng bộ lọc Nguồn hiện hữu |

Đã tạo 39 frame, 3 màn C-01/C-02/C-03; giữ 10 overlay nghiệp vụ. LOADING là trạng thái chuyển tiếp khi thao tác tạo/cập nhật, không gán thêm frame tĩnh. Tài liệu UI cũ chỉ là tham khảo khi khác với mục 4.9–4.13 và prototype v0.6.0.

Phụ thuộc mới V-15: API AI summary, kiểm soát nguồn/phiên bản/quyền/nhà cung cấp và kiểm thử chất lượng cần xác minh trước tích hợp. Prototype không chứng minh AI thật đã được triển khai hoặc bot nguồn đã ngừng phản hồi.

### 10.4 Quyết định v0.6.0 và nghiệm thu

| Mã | Quyết định | Truy vết |
|---|---|---|
| DEC-CSKH-030 | D-05 gộp nội dung; ngày bắt buộc, tháng/năm giờ hệ thống, giờ tùy chọn; bỏ kiểm tra tương lai riêng D-05 | S-17; FR-18/28; BR-18; 4.12 |
| DEC-CSKH-031 | CRM là chuẩn component/spacing/token; năm filter cùng component, giữ option/query; Người phụ trách vào Bộ lọc khác riêng Của nhóm | S-17; FR-19/29; 4.6.1 |
| DEC-CSKH-032 | Cho phép khung responsive, filter ngang có scroll, giữ table/pagination; bổ sung mobile, không thu nhỏ bằng zoom | S-17; DR-01/06; 4.13 |
| DEC-CSKH-033 | Bỏ lọc nhanh focus của bản nháp khỏi scope; giữ source/AI summary/ghi chú/Case đã chọn; sort toolbar + header cùng tồn tại | S-17; FR-19/31; 4.9.1 |
| DEC-CSKH-034 | Hoàn thiện folder prototype v0.6, giữ prototype v0.5; tạo BRD v0.6 từ v0.5, không ghi đè; cùng URL prototype 4802 | S-17; bảo toàn phiên bản |

Bộ nghiệm thu và ảnh ở [QA v0.6](prototype-portal-v0.6.0/QA.md). Ảnh bắt buộc: Chờ nhận/Của tôi tại 1440 và1280, ít nhất một trạng thái filter active; bổ sung mobile 390, form Chờ phản hồi và AI summary. Kiểm tra hồi quy filter/sort/cột/view, keyboard, ngày chỉ có DATE và ngày có MINUTE, giữ nháp khi lỗi, nguồn một phần/cũ/lỗi/thu quyền, điều kiện đóng lịch/CRM. Hash bảo toàn bản v0.5 và BRD cũ được kiểm tra khi bàn giao.

Open question không chặn v0.6: hai cách sort cùng tồn tại theo yêu cầu; cân nhắc đơn giản sau khi có phản hồi sử dụng. Tích hợp thật vẫn theo mục 9; AI summary hiện là fixture, dữ liệu nghiệp vụ local và CSKH log đặt lại khi tải trang.


### 10.5 Quyết định v0.7.0 và bàn giao — lịch sử

| ID | Quyết định | Thay thế / truy vết |
|---|---|---|
| DEC-CSKH-034 | Cột [tùy nguồn] / source / identity; AI trái danh sách, phải khách + xử lý | 4.11/4.13; thay thứ tự v0.6 |
| DEC-CSKH-035 | 10 phút idle từ khách, không từ lúc mở phiên hoặc tin CSKH | S-19; BR-23; FR-32/33 |
| DEC-CSKH-036 | Cho chat công khai đúng phiên và quyền, phải có ACK bàn giao | Thay giới hạn no-reply của FR-03 v0.6; không mở kênh mới |
| DEC-CSKH-037 | Nút Tạo phiếu yêu cầu; module Phiếu yêu cầu CSKH | Thay quyết định chưa tạo phiếu riêng ở 4.9 v0.6; FR-34 |
| DEC-CSKH-038 | Menu Tiếp nhận & Xử lý; ca CS-… khác phiếu REQ-… | Thuật ngữ nằm trong 4.1.1, không tách file quyết định riêng |
| DEC-CSKH-039 | Chọn lọc mẫu HTML, không tự nhập cấp cứu/CTI/dashboard | Giữ 3 BUC nguồn; 4.9/4.15 |

| Màn/frame mới | Nội dung |
|---|---|
| M-40 / C-01 | Cảnh báo phiên còn mở, ưu tiên và lọc |
| M-41..43 / C-02 | Chat AI còn phiên / hết phiên / chưa rõ kết nối |
| M-44..45 / C-04 | Danh sách phiếu và chi tiết/lịch sử |
| M-46 / D-11 | Form Tạo phiếu yêu cầu |

Bộ v0.7 gồm **46 frame, 4 màn, 11 overlay**; kế thừa M-01..39, giữ D-05 của v0.6. Kiểm chứng thực tế và ảnh nằm ở [QA v0.7](prototype-portal-v0.7.0/QA.md), hướng dẫn chạy ở [README v0.7](prototype-portal-v0.7.0/README.md), [review các trạng thái](prototype-portal-v0.7.0/review.html), [HTML độc lập](handoff/CSKH-Operation-Portal-v0.7.0.html).

Prototype minh họa hành vi bằng bộ nhớ và sự kiện giả, chưa nối transport chat, backend phiếu, IAM hoặc đơn vị thật; tải lại reset ca/chat/phiếu. View cá nhân lưu cấu hình localStorage riêng v0.7. Không coi một lần mô phỏng ACK là bằng chứng đã tạm dừng bot thật. Giữ v0.5/v0.6 và BRD cũ; kiểm chứng hash trước bàn giao. Mục 10.2–10.4 mô tả các bản tiền nhiệm, không phải số lượng/giới hạn của v0.7.


### 10.6 Quyết định và nghiệm thu v0.8.0 — lịch sử, nền được kế thừa

| ID | Quyết định | Căn cứ / trạng thái |
|---|---|---|
| DEC-CSKH-040 | VI mặc định; thông báo ban đầu có VI, cảnh báo khác theo ngôn ngữ khách | S-20; yêu cầu trực tiếp |
| DEC-CSKH-041 | Giữ idle mặc định 10 phút của v0.7; dev chốt cấu hình/hoạt động trước triển khai | S-19/20; ngưỡng 2 phút và nút tiếp tục là đề xuất UI |
| DEC-CSKH-042 | Thiếu/sai tên/số: cảnh báo, cho Vẫn kết nối CSKH, gắn cờ chất lượng | S-21; đã xác nhận |
| DEC-CSKH-043 | Khóa quay lại AI sau khi yêu cầu chuyển được lưu; ACK bot trước nhân viên gửi | S-20; mốc khóa sớm ở REQUESTED là thiết kế đề xuất |
| DEC-CSKH-044 | Giữ dữ liệu gốc; metadata mới hiện trong C-02, không biến CSKH log thành transcript | S-20; kế thừa FR-21/22/30 |
| DEC-CSKH-045 | Thông báo hiển thị khác consent; không áp dụng loại dòng import cho chat | S-20/21; kế thừa BR-06 |
| DEC-CSKH-046 | Bản mới v0.8 giữ nguyên v0.7; demo local với dữ liệu mô phỏng, không publish/deploy | C-GOV-01 và yêu cầu phiên hiện tại |

| Trạng thái / bề mặt | Nghiệm thu chính |
|---|---|
| W-01 bắt đầu | Có thông báo VI/link trước tin đầu; fallback VI; toggle dễ tìm |
| W-02 khai báo | Tên/số, giải thích một chiều, đóng form chưa gửi vẫn dùng AI |
| W-03 cảnh báo | Ba mã lỗi, focus/lỗi theo trường; tiếp tục dù thiếu cả tên và số |
| W-04 sắp hết | mm:ss, cảnh báo và tiếp tục; nhân viên không gia hạn |
| W-05 chờ CSKH | Đã lưu ca, không bịa ETA; tin khách tiếp tục cùng phiên |
| W-06 đã kết nối | Đúng nhân viên, bot dừng; không switch lại AI kể cả refresh |
| W-07 hết phiên | Khóa gửi, giữ log/nháp, phiên mới có ID riêng |
| W-08 English | Nhãn/lỗi/countdown/chờ/hết phiên EN; thông báo ban đầu vẫn có VI |
| W-09 mất kết nối | Thử lại, không báo gửi thành công khi chưa có ACK |
| W-10 App/mobile | Cùng quy tắc; thao tác form/gửi không tràn hoặc bị cắt |
| L-01 chờ nhận | Chỉ metadata; nhận ca rồi bắt đầu, chờ ACK tiếp quản |
| L-02 chất lượng liên hệ | Cần bổ sung thông tin, mã lỗi, bản gốc; sửa riêng có lịch sử |
| L-03 đang chat | Tin khách/nhân viên đồng bộ, nội bộ riêng; không reset idle bởi staff |
| L-04 log một phần | PARTIAL; tóm tắt chỉ nguồn có thật; UNAVAILABLE không bịa nội dung |
| L-05 hết phiên | Case vẫn tồn tại, log đọc được, chặn send |
| L-06 mất kết nối | UNKNOWN; nháp còn, chặn send; quyền bị thu gỡ nội dung |

Kiểm tra thêm: double click/retry chống trùng; cùng timestamp giữ đúng thứ tự; cùng số khác phiên không gộp; link chính sách giữ nháp; thay ngôn ngữ không đổi text lịch sử; mất ACK không gửi thành công giả; không lộ text/tên/số trước nhận; tương tác bàn phím và 360/390/768/1280/1440/1920px. Thực tế đã chạy tới đâu được ghi riêng tại [QA v0.8](prototype-portal-v0.8.0/QA.md), không suy ra từ danh sách nghiệm thu đích này.

Bàn giao: [hướng dẫn](prototype-portal-v0.8.0/README.md), [review 16 trạng thái](prototype-portal-v0.8.0/review-ai.html), [phía khách](prototype-portal-v0.8.0/customer-chat.html), [AI log/C-02](prototype-portal-v0.8.0/ai-log.html), [đặc tả thiết kế](CSKH-ai-chat-design-spec-v0.8.0.md). Phần mở rộng chạy song song với 46 frame nền; chưa tích hợp hai mô hình demo thành một backend. Tên/số/tin trong demo là dữ liệu mẫu local; không gửi tới bệnh viện. Chưa nghiệm thu transport, API, IAM, consent hoặc AI thật.

### 10.7 Quyết định, truy vết và nghiệm thu v0.9.0 — hiện hành

#### 10.7.1 Quyết định của bản này

| ID | Quyết định | Thay thế / căn cứ |
|---|---|---|
| DEC-CSKH-047 | Tách EXPIRED thành hai nhóm tra cứu: vừa hết dưới 15 phút và đã hết từ 15 phút; tính từ hết hạn, không gia hạn gửi | S-24/26; mở rộng DEC-CSKH-035, BR-34, FR-42 |
| DEC-CSKH-048 | Thêm cột câu thoại công khai gần nhất, nhãn/màu ba vai; trước nhận che nội dung, log thiếu nói rõ | S-24/26; BR-35, FR-43 |
| DEC-CSKH-049 | Checkbox chọn nhiều cho các trường phân loại ở C-01/C-03/C-04; OR cùng nhóm, AND giữa nhóm, áp dụng ngay | S-24/25/26; cập nhật 4.6–4.8/4.15, BR-36, FR-44 |
| DEC-CSKH-050 | C-04 mang tên Phiếu yêu cầu, đứng trước CSKH log; giữ mã và vòng đời ca/phiếu riêng | S-24; thay tên trong DEC-CSKH-037, giữ nghiệp vụ FR-34 |
| DEC-CSKH-051 | Portal đối chiếu DS v0.3; dữ liệu mẫu phủ các module CSKH đang hoạt động; giữ 3 BUC và menu future | S-24/25; 4.26, không mở rộng tích hợp |
| DEC-CSKH-052 | BRD v0.9 là bản hiện hành khớp prototype v0.9; giữ nguyên v0.8 và xác nhận cảnh báo rồi cho tiếp tục | S-21/26; không đổi các quy tắc AI chat còn hiệu lực |

#### 10.7.2 Truy vết yêu cầu → prototype

| Phần thay đổi | Quy tắc / FR | Màn/frame review | Nguồn đối chiếu |
|---|---|---|---|
| Cửa sổ 15 phút, nhãn, phạm vi, số lượng, khóa gửi | 4.23; BR-34; FR-42 (mở rộng FR-32/33) | C-01/M-47, C-02/M-42, AI log/L-05 | `operations.js`, `operations-ui.js`, `operations-controller.js`, `ai-log.js`, `chat-model.js` |
| Câu thoại cuối, màu vai gửi, quyền và mức đầy đủ | 4.24; BR-35; FR-43 (mở rộng FR-19/40) | C-01/M-48, hàng chờ M-40, chi tiết M-41 | `conversation-preview.js`, `context.js`, `workbench-ui.js` |
| Checkbox, OR/AND, view, cột, phân trang | 4.25; BR-36; FR-44 (mở rộng FR-19/29/30/34) | C-01/M-51, C-04/M-49, C-03/M-50 | `filter-ui.js`, `filter-model.js`, `workbench.js`, `workbench-ui.js`, `operations-ui.js` |
| Menu, DS, bộ dữ liệu | 4.26; kế thừa BR-15 và FR-34 | M-47..51 và 46 frame nền | `DESIGN.md`, `portal-tokens.css`, `portal-v09.css`, `mock-data-v09.js`, `chat-fixtures-v09.js` |

Mã nguồn trong bảng thuộc `prototype-portal-v0.9.0/`. [Review tổng](prototype-portal-v0.9.0/review-ai.html) dẫn đến M-47..51. C-01..04 vẫn là bốn màn Portal; C-05 là chat phía khách. 51 frame Portal và 16 trạng thái W/L là các tình huống review, không phải 67 module nghiệp vụ.

#### 10.7.3 Tiêu chí nghiệm thu đích

| Mã AC | Tình huống / thao tác | Kết quả cần đạt | FR |
|---|---|---|---|
| AC-09-01 | Kiểm tra cùng phiên trước hết hạn, đúng hết hạn, sau 14:59.999 và đúng 15:00 | Trước hạn không thuộc nhóm; hai mốc giữa thuộc vừa hết; đúng 15:00 thuộc nhóm cũ, không chồng lấn | 42 |
| AC-09-02 | Để bộ lọc vừa hết mở qua mốc; tải lại/mở view đã lưu sau đó | Tính lại theo thời điểm hiện tại; phiên ra/vào nhóm đúng, bỏ lọc vẫn đọc được lịch sử | 42/44 |
| AC-09-03 | STAFF/SUPERVISOR mở các phạm vi; có ca đã đóng và phiên vừa hết | Đếm đúng phạm vi/quyền; ca đã đóng trong quyền vẫn tra cứu được; không lộ ca của người khác cho STAFF | 42 |
| AC-09-04 | Áp thêm chủ đề/tìm kiếm rồi bấm vừa hết; đổi sang phiên còn mở | Nút vừa hết đếm theo phạm vi, bảng theo tất cả điều kiện; giữ bộ lọc khác, không giữ hai điều kiện nhanh xung đột | 42/44 |
| AC-09-05 | Phiên vừa hết nhận tin muộn, reconnect, refresh hoặc thử gửi/tiếp quản | Không hồi sinh, không gửi, không mở AI; nháp/log và tiến độ ca/phiếu giữ đúng quy tắc cũ | 33/41/42 |
| AC-09-06 | Xem tin công khai cuối lần lượt từ khách, CSKH, AI | Đúng nội dung/giờ, chấm xanh lá/xanh dương/tím và nhãn chữ; cột sau Chủ đề, mặc định bật | 43 |
| AC-09-07 | Gửi tin công khai thành công rồi thêm ghi chú nội bộ/tin lỗi/nháp | Preview cập nhật sau thành công; nội bộ/lỗi/nháp không thay câu cuối và không thành transcript trong CSKH log | 43 |
| AC-09-08 | Nguồn có tin cùng timestamp, tin lặp/cũ đến muộn hoặc khác phiên | Thứ tự theo nguồn/sequence, không đảo theo vai, không lặp/ghép sai phiên; cần tích hợp V-22 | 40/43 |
| AC-09-09 | Mở Chờ nhận bằng hai vai; chuyển owner/thu quyền khi đang xem ca | Chờ nhận không lộ nội dung; quyền thay đổi gỡ dữ liệu cũ, kể cả tooltip/cache/payload ngoài quyền | 23/43 |
| AC-09-10 | Xem PARTIAL, UNAVAILABLE, không có tin; lời nhắn Website | PARTIAL nói rõ mới nhất đã nhận; lỗi/rỗng có đúng nhãn; Website lấy lời nhắn gốc, không bịa phản hồi | 43 |
| AC-09-11 | Chọn hai chủ đề, kết hợp nguồn và trạng thái | OR hai chủ đề, AND nhóm còn lại; bỏ hết một nhóm chỉ gỡ giới hạn nhóm đó; kết hợp không giao trả rỗng | 44 |
| AC-09-12 | Chọn liên tiếp bằng chuột/bàn phím; Bỏ chọn, Xong, Escape, click ngoài | Kết quả đổi ngay, giữ menu/focus khi chọn; Bỏ chọn chỉ xóa nhóm; đóng không hoàn tác; Escape trả focus | 44 |
| AC-09-13 | Đang trang sau, đổi filter; chọn thời gian/hẹn; thử khoảng ngày đảo ngược | Về trang 1, tổng số trong quyền; thời gian/hẹn chọn một; khoảng đảo ngược báo lỗi, giữ cấu hình | 19/44 |
| AC-09-14 | Lưu/mở view C-01 chứa hai chủ đề, nhóm vừa hết và ẩn cột câu thoại | Khôi phục đủ mảng/cột; tính lại dữ liệu, quyền và thời điểm; không lưu ảnh chụp kết quả | 29/42/43/44 |
| AC-09-15 | Lọc nhiều trạng thái/đơn vị phiếu; nhiều kết quả/tác nhân nhật ký | C-04/C-03 dùng cùng OR/AND và thao tác menu; không vượt quyền đọc/xuất, không tự thêm saved view | 30/34/44 |
| AC-09-16 | Bật/tắt/Mặc định cột; cuộn bảng trên 1280px và mobile 390px | Cột câu thoại hoạt động; mã/thao tác luôn có; tới được phân trang, menu không bị cắt, không tràn ngang toàn trang | 19/43/44 |
| AC-09-17 | Mở menu, các module đang hoạt động và frame dữ liệu mới | Tên/thứ tự đúng, token DS v0.3; mẫu đủ loại theo 4.26; future vẫn chưa hoạt động | 34/42..44 |
| AC-09-18 | Hồi quy chat khách nhập sai tên/số, chuyển CSKH, đổi ngôn ngữ, hết phiên | Cảnh báo vẫn cho tiếp tục; khóa AI một chiều, countdown/ACK/quyền giữ như v0.8 | 35..41 |

Đây là tiêu chí nghiệm thu đích. Bằng chứng prototype hiện có tại [QA v0.9](prototype-portal-v0.9.0/QA.md): model v0.9 14/14; model AI 18/18; luồng Portal 15/15; hồi quy AI 15/15; 16/16 cấu hình bố cục không tràn ngang. Các kết quả này được ghi nhận ở lượt xây prototype, **không phải chạy lại trong lượt cập nhật BRD** và không chứng minh toàn bộ AC/tích hợp production đã đạt. Payload thật, đồng hồ server, sequence, IAM và lưu bền vững còn theo V-21..23 cùng các phụ thuộc kế thừa.

#### 10.7.4 Bàn giao

[BRD v0.8 nền](CSKH-01-brd-v0.8.0.md) · [Prototype v0.9](prototype-portal-v0.9.0/review-ai.html) · [Hướng dẫn và phạm vi](prototype-portal-v0.9.0/README.md) · [Design](prototype-portal-v0.9.0/DESIGN.md) · [Báo cáo đồng bộ BRD](reviews/CSKH-v0.9-brd-alignment-20261102.md).

Lượt này hoàn thiện tài liệu và liên kết tới BRD hiện hành; không sửa logic prototype, không gọi hệ thống bệnh viện, không publish/deploy/push. Bản v0.9 giữ **In Review** cho đến khi được duyệt; các điểm tích hợp chưa xác minh vẫn được ghi rõ ở mục 9.
