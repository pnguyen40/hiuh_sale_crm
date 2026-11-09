# Tài liệu nghiệp vụ Sale CRM

Phiên bản hiện tại: **v1.1.0 — CR-MOB-01: mapping tài khoản HIUH Connect vào B2C**, ngày 09/11/2026.

| Tài liệu | Phiên bản hiện tại | Bản gốc giữ nguyên |
|---|---|---|
| BRD | [BRD v1.1.0](./brd-sale-crm-presale-stage-v1.1.0.md) | [BRD v1.0.0](./brd-sale-crm-presale-stage-v1.0.0.md) |
| PRD | [PRD v1.1.0](./prd-sale-crm-phase1-mvp-v1.1.0.md) | [PRD v1.0.0](./prd-sale-crm-phase1-mvp-v1.0.0.md) |

## Nội dung thay đổi

- Mapping theo tài khoản đăng nhập HIUH Connect, qua nguồn “Tài khoản bệnh nhân”; không tạo hồ sơ B2C riêng cho người thân.
- Dùng `source = MOBILE_APP` đã có, nhãn “Dữ liệu di động”; hồ sơ cũ được liên kết cũng đổi nguồn, có Audit. Chức năng và công thức dashboard giữ nguyên.
- Hồ sơ mới ở `NEW`; hồ sơ đã liên kết giữ nguyên stage, PIC và dữ liệu tư vấn. Lần đầu khớp SĐT/email cần xác nhận đúng Contact và hồ sơ đích.
- Thêm **Xác thực OTP** sau **Họ và tên**, thành 12 cột. Lưu đúng hai giá trị đã/chưa xác thực; chưa OTP vẫn tiếp nhận nếu đủ dữ liệu.
- Họ tên/SĐT cập nhật theo dữ liệu mobile mới nhất. Thiếu tên hiển thị “Chưa cập nhật”; thiếu SĐT chờ bổ sung.
- Đồng bộ dữ liệu ban đầu và cập nhật trong tối đa 5 phút theo điểm đo tại PRD §29.5; chạy lại không sinh trùng.
- Tài khoản bị khóa vẫn mapping; tài khoản nguồn bị xóa thì dừng đồng bộ, giữ hồ sơ và lịch sử CRM.

## Cách đọc

BRD §10 ghi quyết định nghiệp vụ và tiêu chí nghiệm thu. PRD §5.2 cập nhật ERD; §6.7 ghi quy tắc; US-INT-02 ghi 32 tiêu chí nghiệm thu; §16.1 ghi 12 cột; §29 có bằng chứng khảo sát, bảng mapping, ngoại lệ, đồng bộ và kịch bản kiểm thử.

Quy tắc CR đã được người yêu cầu xác nhận. Hợp đồng nguồn đầy đủ, revision/xác nhận xóa và cơ chế tích hợp vẫn cần đội kỹ thuật hoàn tất tại PRD §29.8. Bản tài liệu này không xác nhận phần mềm đã được triển khai hoặc dữ liệu đã được đồng bộ.

## Nguồn và phiên bản

Hai tệp v1.0.0 được nhập nguyên vẹn từ tài liệu do người yêu cầu chỉ định. Các đường dẫn EPIC, Visual, Plan, Constitution, UI contract, AI log và bản BRD v0.4.1 trong tài liệu gốc thuộc kho tài liệu trước đó, không được nhập cùng vào repo này. Giữ bản gốc để truy vết; không coi những đường dẫn lịch sử đó là tệp hiện có trong repo.

Bản v1.1.0 dùng BRD cùng phiên bản làm nguồn nghiệp vụ hiện tại; các dẫn chiếu lịch sử được ghi rõ. Phạm vi CR có ưu tiên khi khác quy tắc cũ về nguồn bất biến, dữ liệu hoàn toàn giả lập hoặc việc mọi lượt tiếp nhận đều tạo hồ sơ `NEW`.

Không đưa thông tin đăng nhập, token, mã OTP hoặc dữ liệu tài khoản/bệnh nhân thật vào tài liệu và dữ liệu kiểm thử trong Git.
