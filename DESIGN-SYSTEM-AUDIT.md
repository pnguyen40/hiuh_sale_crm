# Ghi nhận Đánh giá & Độ lệch Design System (Design System Audit)

> **Mục đích**: Tài liệu này ghi nhận các điểm chưa nhất quán giữa **Bộ tài liệu Design System** (`/docs-ba/Design/operation_portal_design_system` qua symlink `./operation_portal_design_system`), **Bản chạy thực tế của Operation Portal Dev** (`https://operation-dev.hiuhospital.com/`), và **Prototype Sale CRM** (`http://127.0.0.1:8080/`), để phục vụ việc chuẩn hóa Design System tổng thể sau này.

---

## 1. Trạng thái Symlink
Thư mục Design System gốc đã được gắn symlink trực tiếp vào thư mục gốc của repository:
```bash
./operation_portal_design_system -> /Users/phongnguyen/workspace/Nexlab/docs-ba/Design/operation_portal_design_system
```

---

## 2. Các điểm lệch trọng tâm (Discrepancies)

### 2.1. Bo góc Button: Square-ish thực tế vs. Soft Rounding trong tài liệu vs. Pill trong Prototype

| Hạng mục | Tài liệu Design System (`readme.md` / `tokens`) | Thực tế Operation Portal Dev | Prototype Sale CRM (Ban đầu) | Đề xuất chuẩn hóa |
|---|---|---|---|---|
| **Primary Button** (Tạo mới, Lưu...) | `14px` (`--radius-md` Soft Clinical) | `11px` (`rounded-[11px]`) | `20px` (Dạng viên thuốc / Pill) | Thống nhất `8px` hoặc `10px` để vuông vắn, dứt khoát, chuyên nghiệp cho khối Admin/Portal. |
| **Secondary Button** (Sắp xếp, Bộ lọc, Xuất tệp...) | `14px` (`--radius-md`) | `8px` (`dsa-btn--secondary`) | `20px` | Thống nhất `8px`. |
| **Phân trang / Điều hướng** (Trước, Sau, Trang...) | `10px` (`--radius-sm`) | `14px` hoặc `8px` | `20px` | Thống nhất `8px` với chiều cao `34px`. |
| **Status Badges / Chips** | `9999px` (`--radius-pill`) | `9999px` / `14px` | `20px` | Giữ `9999px` (pill) cho badge trạng thái, tách bạch hoàn toàn với Button. |

> **Nhận xét BA**: Trong tài liệu gốc, triết lý "Soft Clinical" định nghĩa bo góc `14px` cho toàn bộ button để tạo cảm giác thân thiện với bệnh nhân. Tuy nhiên, trên giao diện bác sĩ & quản trị portal thực tế (`hiu-portal`), mật độ dữ liệu dày đặc đòi hỏi các nút bấm phải gọn gàng, góc vuông vắn hơn (`8px` – `11px`) để không tạo cảm giác lỏng lẻo hoặc chiếm nhiều diện tích.

---

### 2.2. Chiều cao & Mật độ (Height & Density)

- **Operation Portal Dev**:
  - Nút chính (Tạo mới): `h-[38px]`, padding ngang `14px`, `font-size: 13px`, `font-weight: 600`.
  - Nút phụ / Bộ lọc: `h-[38px]` hoặc `34px`, padding ngang `10.5px` – `21px`.
  - Ô tìm kiếm / Select: `h-[38px]`, border `1px solid #c7cce0` (`--border-default`), bo góc `10px` – `14px`.
- **Prototype CRM cũ**:
  - Nút chính và phụ dùng lẫn lộn `h: 34px`, `30px`, `28px`, padding `10px` – `14px`.

---

### 2.3. Màu sắc & Hệ màu (Color Ramps)

- **Màu thương hiệu chính (Primary Brand)**:
  - Cả hai đều dùng chuẩn mã xanh HIU `#0052D7` (`--blue-500` / `--brand-primary`).
- **Màu nền trang & Nền thẻ (Surfaces)**:
  - Nền trang Portal Dev: `#F6F8FD` (`--neutral-50` có ánh xanh nhẹ dịu mắt).
  - Nền bảng dữ liệu / thẻ: `#FFFFFF` nguyên chất, viền hairline `1px solid #E8EEF7` (`--border-subtle`).
  - Nền bảng trên CRM prototype trước đây có một số khu vực dùng xám nhạt chưa đồng nhất.

---

### 2.4. Khung cấu trúc Sidebar & Header

- **Header Portal Dev**:
  - Chiều cao cố định `56px` (`h-14` / `h-16`), nền trắng `#fff`, viền dưới `1px solid #E1E5F2`.
  - Không chứa các nhãn kỹ thuật (như "MOCKED" hay "Dữ liệu giả lập").
- **Sidebar Portal Dev**:
  - Chiều rộng `264px` (`w-sidebar`).
  - Chia 4 phân nhóm rõ ràng bằng chữ hoa nhỏ (`VẬN HÀNH`, `THU NGÂN & LÂM SÀNG`, `NỘI DUNG & KHÁCH HÀNG`, `HỆ THỐNG`).
  - **Phân cấp màu sắc Parent Button vs. Child Button**:
    - **Parent Button ("Quản lý nội dung" / "Sale CRM")**: Nền xanh nhạt trong suốt `#EEF3FD` (`--surface-brand-soft`), chữ và icon xanh thương hiệu `#0052D7`.
    - **Child Button Active (Sub-item đang chọn e.g. "Tin tức & Truyền thông" / "Danh bạ Contact")**: Nền xanh đặc đậm `#0052D7` (`bg-primary-500`), **chữ trắng `#FFFFFF`**, icon trắng, count badge nền trắng mờ `rgba(255, 255, 255, 0.22)`.
    - **Child Button Inactive**: Nền trong suốt `transparent`, chữ trung tính `var(--neutral-600)`.
  - **Vị trí Module Sale CRM**: Định vị nằm ngay bên dưới `Quản lý bác sĩ` trong nhóm `NỘI DUNG & KHÁCH HÀNG`.

---

### 2.5. Pattern Tab điều hướng: Elevated Segmented Control Tabs (Floating Card Tab)

- **Operation Portal Dev Baseline**:
  - `role="tablist"`: Đóng vai trò là rãnh trượt (Segmented Well / Track) có nền xám/xanh nhạt `#F1F4F9` (`bg-neutral-100`), padding `4px` (`p-1`), bo góc `11px` (`rounded-[11px]`), viền mảnh `1px solid #E8EEF7`.
  - `role="tab"` (Active): Nổi lên dạng thẻ card độc lập (**Elevation**): `bg-white` (`#FFFFFF`), `shadow-sm`, bo góc `rounded-[9px]`, padding `8px 14px` (`px-3.5 py-2`), font-size `13px`, font-weight `600`, màu chữ `text-primary-900` (`#002663`), hoàn toàn không dùng border gạch chân bên dưới.
  - `role="tab"` (Inactive): Nền `transparent`, màu chữ `var(--neutral-600)`, hover nhẹ `bg-white/60`.
- **Prototype CRM cũ**:
  - Dùng dạng Line/Underline Tabs với border gạch chân bên dưới (`border-b-2`), không có elevation và không có rãnh trượt đệm.

---

## 3. Kiến nghị điều chỉnh Design System cho giai đoạn sau

1. **Bổ sung Theme Scope cho Button**:
   - Khai báo token `--btn-radius` theo từng scope:
     - `.hiu-web` (Cổng thông tin/Marketing): `14px` (thân thiện, bo tròn mềm mại).
     - `.hiu-app` (Bệnh nhân/Kiosk): `14px` – `16px`.
     - `.hiu-portal` (Quản trị/Bác sĩ/CRM): `8px` – `10px` (vuông vắn, mật độ cao).
2. **Quy chuẩn chiều cao nút bấm (Button Sizing Tokens)**:
   - `--btn-h-sm`: `30px` (nút mini trong bảng dữ liệu).
   - `--btn-h-md`: `34px` (nút phụ, phân trang, công cụ).
   - `--btn-h-lg`: `38px` (nút hành động chính trang).
3. **Loại bỏ CSS chết**:
   - Dọn sạch các class `.hds-*` và Material Symbols còn sót lại từ các bản dựng cũ.
