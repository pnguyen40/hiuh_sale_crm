# Phiếu yêu cầu — kiểm chứng ngày 03/11/2026

Mã phiếu, mô hình nghiệp vụ, màn M-49 và 25 phiếu mẫu đã có trong repo trước sửa. Các vấn đề xác nhận được:

- Sidebar CRM không giới hạn theo chiều cao cửa sổ; menu CSKH nằm dưới khung nhìn trên màn hình thấp. Đã thêm vùng cuộn menu riêng, giữ phần nhận diện và tài khoản.
- Menu trong file CRM offline dùng `/cskh/index.html`, dẫn tới đường dẫn không tồn tại trên máy. Đã dùng file `cskh-prototype.html` cùng thư mục và giữ frame tương ứng.
- Menu dùng “Phiếu yêu cầu” nhưng nút tạo, phần liên quan và hướng dẫn còn dùng “Phiếu xử lý”. Đã thống nhất nhãn trong nguồn, bản public, tài liệu đi kèm và bản HTML xuất lại.

## Kết quả

- `npm test`: 6/6 đạt, gồm 5 kiểm tra phiếu và 1 kiểm tra routing có sẵn.
- `npm run cskh:qa`: 14 kiểm tra CSKH v0.9 và 18 kiểm tra AI đạt.
- `npx tsc --noEmit`, kiểm tra ESLint cho các file kiểm thử/điều hướng mới, `npm run build`, `git diff --check`: đạt.
- Xuất lại cả hai file HTML; bản CSKH được đồng bộ vào `public/cskh/`.
- Browser riêng: 5/5 luồng đạt, chi tiết tại [browser-results.json](browser-results.json). Desktop 1280×600 và offline 1440×900; mobile 390×844.
- Đã xem ảnh desktop/mobile/offline. Bộ dò Impeccable chỉ ghi nhận các kiểu có sẵn, không có cảnh báo tại phần CSS sidebar vừa thêm.

Các thao tác browser dùng nút, input và checkbox trên UI. Riêng `datetime-local` được gán giá trị qua DOM và phát sự kiện input/change vì `agent-browser fill` để trống trường này; việc gửi form vẫn qua nút thật và validation của ứng dụng.

Dữ liệu và hành động vẫn là mô phỏng; kiểm tra này không xác nhận tích hợp backend.
