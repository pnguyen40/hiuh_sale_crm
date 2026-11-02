# Rà soát thiết kế v0.9

Phạm vi: bổ sung prototype CSKH hiện hữu. Tự rà soát trong agent hiện tại theo yêu cầu không dùng subagent; không phải đánh giá độc lập.

Đối chiếu: CRM localhost:8080 qua Chrome Debug, hộp thư đa kênh trong file tham chiếu và token Operation Portal DS v0.3. Hai đoạn HTML user gửi đều là radio; CRM thật dùng checkbox. Chọn control theo khả năng chọn nhiều/chọn một.

Đã sửa:

- Token màu, radius, typography, chiều cao control bị lệch với DS v0.3.
- Nhãn hết phiên trước đây áp dụng cho tất cả phiên; nay tách cửa sổ 15 phút và lịch sử cũ, có lọc động.
- Thiếu dữ liệu phiếu trên các entry khác; seed thường trực và đầy đủ enum.
- Preview lấy đúng người gửi công khai, không lấy ghi chú hoặc tin gửi thất bại; che ở hàng chờ.
- Menu đa chọn giữ mở, có hướng dẫn/chip/clear, Escape trả focus.
- Thanh ưu tiên gọn hơn để dành không gian đọc bảng.
- Pagination ở viewport thấp được bảo đảm truy cập qua cuộn nội dung; bảng vẫn cuộn ngang theo DS.

Giữ: nhận diện HIUH public web và Portal, thứ tự/logic nhận ca – bắt đầu – tiếp quản, thông báo dữ liệu, soft validation, chuyển một chiều, quyền xem. Khách vẫn dùng Montserrat; Portal Lexend/Plus Jakarta Sans theo DS được chỉ định. Không dùng font mới ngoài hệ thống.

Giới hạn: dữ liệu mô phỏng; các màn Thông báo/Mẫu thông báo chưa triển khai trong baseline không có workflow mới. Desktop/mobile kiểm tra qua Chrome emulation, chưa thiết bị iOS/Android hoặc screen reader thực.
