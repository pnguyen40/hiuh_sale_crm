# CSKH prototype v0.9

[BRD v0.9](../CSKH-01-brd-v0.9.0.md) · [Mở bộ review](review-ai.html) · [Tiếp nhận & Xử lý](index.html?frame=M-03) · [Phiếu yêu cầu](index.html?frame=M-49) · [CSKH log](index.html?frame=M-50) · [AI chat log](ai-log.html?scenario=human) · [QA](QA.md)

URL trên server hiện tại: `http://127.0.0.1:4802/CSKH/prototype-portal-v0.9.0/review-ai.html`.

## Thay đổi

- Menu CSKH: Tiếp nhận & Xử lý → Phiếu yêu cầu → CSKH log. Tên phiếu được đổi đồng nhất trong tiêu đề, breadcrumb và nhật ký.
- Nhãn “Phiên vừa hết trong 15'” và nút lọc nhanh. Cửa sổ tính từ thời điểm phiên hết hạn; đủ 15 phút chuyển sang “Đã hết hơn 15'”. Thời gian chạy thật, không cố định nhãn trên mọi phiên hết hạn.
- Cột “Câu hội thoại cuối cùng”: xanh lá = bệnh nhân, xanh dương = CSKH, tím = AI. Có nhãn chữ, giờ và nội dung rút gọn; mở ca để đọc đầy đủ. Chỉ lấy tin công khai đã nhận/gửi thành công; ghi chú nội bộ không vào cột này.
- Trạng thái, nguồn, chủ đề, phụ trách và trạng thái phiên chọn nhiều bằng checkbox. Phiếu và CSKH log dùng cùng control cho các trường phân loại. Khoảng thời gian và hẹn theo dõi vẫn chọn một.
- Đồng bộ token, màu chữ/nền/viền, bo góc, typography, button, input, sidebar và bảng theo Operation Portal Design System v0.3.

## Quy tắc bộ lọc

Trong cùng nhóm dùng OR; giữa các nhóm dùng AND. Không chọn nghĩa là không giới hạn nhóm đó. Kết quả cập nhật ngay, menu giữ mở để chọn tiếp; “Bỏ chọn” chỉ xóa nhóm hiện tại, “Xong” đóng menu. Escape đóng và trả focus về nút mở. C-01 hiển thị chip điều kiện và lưu view giữ cả danh sách giá trị/cột. C-03/C-04 hiển thị số lựa chọn và dấu đang lọc trên nút, chưa có view cá nhân.

Lựa chọn control dựa trên khả năng chọn nhiều/chọn một, nhất quán với CRM thực tế tại localhost:8080. Tham chiếu chính thức: [GOV.UK Checkboxes](https://design-system.service.gov.uk/components/checkboxes/) và [Radios](https://design-system.service.gov.uk/components/radios/), đọc ngày 02/11/2026. Hai đoạn HTML trong yêu cầu đều là radio; khảo sát trình duyệt xác nhận CRM dùng menuitemcheckbox với Bỏ chọn / Xong.

## Cửa sổ 15 phút

`expiresAt = lastCustomerActivity + 10 phút`. Trong prototype Portal, phiên thuộc nhóm mới hết khi `0 ≤ now − expiresAt < 15 phút`. Hết cửa sổ chỉ đổi nhóm/nhãn; dữ liệu lịch sử không bị xóa. Bộ lọc được cập nhật khi đồng hồ vượt mốc. Phiên đã hết vẫn khóa gửi, không mở lại AI hoặc kéo dài phiên do nhân viên gửi tin. Tiến độ ca và phiếu độc lập với phiên chat.

Phạm vi Chờ nhận/Của tôi/Của nhóm và quyền đọc tiếp tục được áp dụng. Ở tab Chờ nhận, cột câu thoại hiển thị “Nhận xử lý để xem”, kể cả khi đang review bằng trưởng nhóm. Log một phần ghi rõ “Mới nhất đã nhận”; không tải được log không tự tạo preview.

## Dữ liệu mẫu

| Màn đang hoạt động | Mẫu và trường hợp |
|---|---|
| Tiếp nhận & Xử lý | 63 ca, 3 nguồn, Web/App, 6 chủ đề, 5 trạng thái, 3 người phụ trách và chưa phân công; tên dài, thiếu tên/số, số sai, email có/không, người đại diện, chờ khách/nội bộ, hẹn quá hạn/tương lai, lịch nguồn và bàn giao CRM |
| Hội thoại/AI log | 21 ca AI trong Portal; kho chat tương tác có thêm 14 phiên mẫu: 2 kênh, VI/EN, đủ/một phần/không tải được log, lỗi liên hệ, chờ nhận/người thật, mới hết/quá 15 phút, mất kết nối, ghi chú |
| Phiếu yêu cầu | 25 phiếu thường trực; 5 loại, 5 trạng thái, 3 ưu tiên, 4 đơn vị, quá hạn/tương lai, mô tả dài, người tạo, mã ca/nguồn/phiên, lịch sử xử lý. Frame M-44..46 có thêm phiếu phục vụ kịch bản cũ |
| CSKH log | 128 sự kiện nền; nhiều hành động, 5 tác nhân, 3 kết quả, trước/sau, lý do và mã tương quan. Thao tác thực trong demo bổ sung sự kiện |

[Dữ liệu bao phủ](evidence/v09/mock-coverage.json). Các mẫu đều giả lập, địa chỉ email dùng `example.test`. Reload Portal đặt lại dữ liệu; kho AI chat giữ theo origin. Menu Thông báo/Mẫu thông báo vẫn là mục tương lai chưa có luồng hoạt động trong BRD/prototype nền; các module ngoài CSKH là điều hướng tham chiếu.

## Design system và nguồn

Nguồn chuẩn: `docs-ba/Design/operation_portal_design_system/hiu-hospital-design-system-v0.3`. Bản sao token trong `design-system/tokens` được giữ nguyên. `portal-tokens.css` nhập token chuẩn, `portal-v09.css` ánh xạ vào component CSKH. Website/customer widget tiếp tục dùng Montserrat theo website HIUH; Portal dùng Lexend / Plus Jakarta Sans theo bộ chuẩn.

Tham khảo bố cục preview hội thoại từ `/Volumes/workspace/Nexlab/artifacts/prototypes/hiuh-cskh-5-feature-groups.html`. Chỉ lấy cách đọc nội dung gần nhất; nhận diện theo Operation Portal v0.3.

## Chạy độc lập

Trong thư mục prototype: `node server.mjs`, mở `http://127.0.0.1:4809/review-ai.html`. Chat khách/nhân viên cần cùng origin. Không mở các trang ES module bằng `file://`.

Kiểm tra model: `node scripts/qa-v09-model.mjs` và `node scripts/qa-ai-model.mjs`. Bộ kiểm tra browser dùng Chrome Debug qua session `ab-hiuh-ai-1102`, các tab được ghi trong script. Không chạy đồng thời nhiều script điều khiển cùng session.

## Phạm vi

Giữ nguyên bản v0.8 và [BRD v0.8](../CSKH-01-brd-v0.8.0.md). [BRD hiện hành v0.9](../CSKH-01-brd-v0.9.0.md) được cập nhật theo yêu cầu tiếp theo ngày 02/11/2026, đồng bộ quy tắc 15 phút, câu thoại cuối và bộ lọc chọn nhiều; xem [báo cáo đồng bộ](../reviews/CSKH-v0.9-brd-alignment-20261102.md). Kho Portal và kho AI chat tương tác vẫn là hai bộ dữ liệu demo riêng. AI, ACK, mạng và phân quyền đều mô phỏng; chưa có backend/IAM hoặc native app. Không publish/deploy/push.
