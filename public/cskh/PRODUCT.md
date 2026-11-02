# Product

## Platform

web

## Users

Khách dùng Website/mobile app HIUH để hỏi thông tin dịch vụ; nhân viên CSKH tiếp tục nội dung đã trao đổi với AI.

## Product Purpose

Khách gặp nhân viên qua cùng phiên; nhân viên nhận đúng bối cảnh và biết thông tin liên hệ còn thiếu. Không bắt tạo Patient hoặc Contact trước hỗ trợ.

## Capabilities and Constraints

Đa ngôn ngữ, tiếng Việt mặc định; thông báo thu thập dữ liệu đầu phiên; timeout mặc định 10 phút idle; chuyển một chiều sang CSKH; đề nghị tên/số nhưng cảnh báo rồi vẫn cho tiếp tục. Nguồn yêu cầu: user ngày 02/11/2026 và xác nhận soft validation trong chat.

[BRD hiện hành v0.9](../CSKH-01-brd-v0.9.0.md) kế thừa v0.8 và đồng bộ các thay đổi prototype; 3 BUC nguồn được giữ. Không publish/deploy. Prototype không gọi backend, AI, IAM hoặc bệnh viện thật. VI/EN và response AI chỉ là mô phỏng. App được biểu diễn bằng khung responsive, chưa native.

## Brand Commitments

Giữ HIUH website và Operation Portal hiện có. Ảnh Rogers chỉ tham khảo cách đặt thông báo, không dùng thương hiệu hoặc điều khoản Rogers.

## Evidence on Hand

BRD 0.7; snapshot/ảnh Chrome Debug tại Website, chính sách bảo mật, Portal M-40/M-41; bằng chứng ở evidence/ai-chat. Nội dung mẫu để kiểm thử, không phải hồ sơ khách thật.

## Bổ sung v0.9 · 02/11/2026

Sắp xếp menu Phiếu yêu cầu trước CSKH log. Nhân viên cần truy lại phiên vừa hết trong 15 phút, đọc câu hội thoại cuối theo người gửi, lọc nhiều chủ đề và thử dữ liệu đa dạng ở mọi màn CSKH đang hoạt động. Không thay vòng đời gửi tin khi hết hạn. Mẫu có cả giá trị thiếu/sai và trạng thái lỗi, rỗng, không có quyền. Portal theo bộ design system v0.3 do người dùng chỉ định. Bằng chứng mới ở evidence/v09.
