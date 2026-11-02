# Kiểm chứng prototype CSKH v0.9

02/11/2026 · Đạt các kiểm tra trong phạm vi prototype local.

| Bộ kiểm tra | Kết quả | Bằng chứng |
|---|---|---|
| Model v0.9 | 14/14 đạt | [Kết quả](evidence/v09/model-results.json) |
| Model AI chat kế thừa | 18/18 đạt | [Kết quả](evidence/ai-chat/model-results.json) |
| Luồng Portal v0.9 trên Chrome | 15/15 đạt | [Kết quả](evidence/v09/browser-results.json) |
| Hồi quy AI chat hai phía | 15/15 đạt | [Kết quả](evidence/ai-chat/browser-results.json) |
| Bố cục | 16/16 cấu hình không tràn ngang toàn trang | [Số đo](evidence/v09/layout-results.json) |
| Frame kế thừa và mới | 51/51 render được | Nằm trong bộ kiểm tra browser v0.9; không đồng nghĩa đã thao tác toàn bộ workflow của 51 frame |
| Bảo toàn v0.8 | 83 file nguồn, không thay đổi | [Hash và liên kết](evidence/v09/preservation-and-links.json) |
| Token DS v0.3 | 10 file chép nguyên, không sai khác | [Đối chiếu](evidence/v09/preservation-and-links.json) |
| Tài nguyên entry | Không có href/src nội bộ bị thiếu ở 4 entry chính | Cùng báo cáo đối chiếu |

[Bộ ảnh](evidence/v09/gallery.html) · [Bao phủ dữ liệu mẫu](evidence/v09/mock-coverage.json) · [Rà soát thiết kế](evidence/v09/design-review.md).

## Đã xác nhận

- Menu: Tiếp nhận & Xử lý → Phiếu yêu cầu → CSKH log.
- Phiên mới hết: mốc 0, 14:59.999 và 15:00 được kiểm tra bằng đồng hồ cố định; không gia hạn quyền gửi. Bộ lọc trượt theo đồng hồ, vẫn giữ lịch sử ngoài cửa sổ. Phiên mới hết khác có thể vào nhóm khi các phiên trước ra khỏi nhóm.
- Checkbox chọn hai chủ đề bằng native click; menu giữ mở, dữ liệu OR, kết hợp nguồn AND; Bỏ chọn/Xong/Escape và focus hoạt động. Trường thời gian vẫn radio.
- Cột câu thoại cuối cập nhật thành CSKH sau gửi tin; loại tin riêng tư/lỗi; ẩn nội dung hàng chờ kể cả ở tab Chờ nhận của trưởng nhóm; không tự tạo nội dung khi log chưa có.
- Phiếu có dữ liệu trên entry thông thường; mở chi tiết, đọc mã nguồn/người tạo/lịch sử, nhập nội dung và chuyển trạng thái được.
- CSKH log lọc nhiều kết quả, mở thay đổi trước/sau. Control ngoài vùng nhìn được cuộn vào vùng nhìn trước native click.
- Kết quả computed CSS: heading Jakarta 22px, #16205c; body Lexend; nền #f6f8fd; action radius20, filter radius8; sidebar264 và header64.
- Hồi quy AI: cảnh báo dữ liệu vẫn cho tiếp tục, nhận ca/bắt đầu/ACK, chat hai phía, nội bộ, giữ nháp khi lỗi, retry, reload, VI/EN, countdown, hết phiên, mất kết nối, log thiếu, sửa liên hệ có lý do và thu quyền.

## Bố cục và rà trực quan

Đã xem ảnh desktop 1920×1080, 1440×900, 1280×800; tablet768×1024; mobile390×844 và360×800. Bảng cuộn ngang bên trong vùng bảng theo DS. Nội dung danh sách cuộn được khi nhiều bộ lọc chiếm chiều cao; đã đo khả năng tới phân trang ở1280×800 và390×844. Menu checkbox nổi khỏi vùng cuộn; không bị cắt ở mobile.

Vùng cuộn danh sách và bảng có vai trò riêng. Ở màn nhỏ cần cuộn để tới bảng/chi tiết và phân trang. Kiểm tra không chỉ dựa vào `scrollWidth` toàn trang: đã xem ảnh và đo chiều rộng nội dung, vị trí footer khi cuộn.

## Cách chạy và giới hạn

Chrome Debug qua agent-browser 0.27.0. Native click/fill/keyboard đã dùng trong bộ Portal v0.9; cuộn DOM trước click cho control đang ở ngoài vùng nhìn. Hồi quy AI hai phía dùng control DOM/input/submit theo bộ kiểm tra kế thừa. Không coi đây là kiểm chứng toàn bộ touch, screen reader hoặc thiết bị iOS/Android thật.

Các lỗi extension có sẵn trong Chrome được phân biệt với lỗi ứng dụng. Không tắt extension hoặc sửa phiên CRM. Tab v0.8 và các file nền giữ nguyên. Không gọi dịch vụ AI/bệnh viện thật; backend, transport, IAM và dữ liệu production chưa tích hợp. Nội dung mẫu và hai kho demo được mô tả trong README.

Tự rà soát theo yêu cầu không dùng subagent. Không dùng Sites/visualize, không publish/deploy/push.
