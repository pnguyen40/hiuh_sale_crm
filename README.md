# HIUH Operation Portal — Prototypes (Sale CRM & CSKH)

Kho mã nguồn nguyên mẫu (prototype) tập trung cho các phân hệ vận hành nội bộ của **Bệnh viện Đại học Quốc tế Hồng Bàng (HIUH · HBH)**:
1. **Phân hệ Sale CRM**: Giám sát hồ sơ tư vấn khách hàng cá nhân (B2C), danh bạ Contact và xúc tiến cơ hội khám đoàn doanh nghiệp (B2B).
2. **Phân hệ CSKH (Customer Service v0.9)**: Tiếp nhận & xử lý yêu cầu đa kênh, phiếu yêu cầu liên phòng ban, nhật ký CSKH log và bộ mô phỏng AI chat & log truy vết.

---

## 🌟 Các phân hệ chính

### 1. Phân hệ Sale CRM
- **Hồ sơ tư vấn (B2C Pipeline)**: Theo dõi phễu chuyển đổi từ tiếp nhận, tư vấn, hẹn khám đến chăm sóc sau khám. Phân loại theo nguồn tiếp nhận (Website, App, Nhập tay, Import) và chiến dịch.
- **Khám đoàn & Hợp đồng Doanh nghiệp (B2B)**: Quản lý khách hàng doanh nghiệp, deal quy mô đoàn, giai đoạn chốt hợp đồng và tổ chức khám sức khỏe định kỳ.
- **Danh bạ Contact**: Danh bạ tập trung hỗ trợ phân loại khách hàng, lịch sử tương tác và gắn nhãn nhanh.
- **Bảng giá & Danh mục Dịch vụ**: Tra cứu thông tin dịch vụ, gói khám tầm soát và báo giá y tế.
- **Audit Log**: Nhật ký thao tác hệ thống đảm bảo truy vết thay đổi dữ liệu minh bạch.

### 2. Phân hệ Chăm sóc khách hàng (CSKH v0.9)
- **Tiếp nhận & Xử lý (C-01 / C-02)**: Tiếp nhận ca từ AI chat, website, app; điều phối nhân viên, tiếp quản trò chuyện trực tiếp (Takeover), liên kết Contact và chuyển giao nhu cầu sang CRM.
- **Phiếu yêu cầu (C-04)**: Quản lý 25+ phiếu mẫu đa dạng trạng thái, mức độ ưu tiên, phòng ban phụ trách và lịch sử xử lý.
- **CSKH log (C-03)**: Nhật ký kiểm toán thao tác CSKH toàn diện (thành công, thất bại, từ chối, diff trước/sau, tác nhân).
- **Bộ review AI & Khách hàng**: Thử nghiệm tương tác 2 chiều giữa khách hàng (`customer-chat.html`) và nhân viên/AI log (`review-ai.html` / `ai-log.html`).

---

## 🎨 Design System

Giao diện áp dụng đồng bộ theo **HIU Hospital Design System v0.3** (bản quyền HIUH):
- **Bảng màu**: Clinical Sky (`--hb-brand: #0052D7`, `--hb-brand-soft: #EEF3FD`, `--hb-ink: #101828`).
- **Typography**: 
  - Tiêu đề & Heading: **Plus Jakarta Sans** (Google Fonts).
  - Nội dung & Bảng dữ liệu: **Lexend** (Google Fonts).
- **Iconography**: **Lucide Icons** (stroke 1.5).
- **Controls & Radius**: Elevated Segmented Control (`rounded-[9px]` trên rãnh `rounded-[11px]`), buttons chuẩn `8px` – `10px`.

---

## 🛠️ Công nghệ

- **Sale CRM**: TanStack Start + React 19 + TypeScript + Tailwind CSS
- **CSKH Module**: Vanilla ES Modules + CSS tokens đồng bộ + Node.js Mock State & Runtime
- **Engine / SSR**: Nitro (Netlify preset) + Vite
- **Kiểm thử**: Vitest (CRM) + Tự động hóa kiểm thử nghiệp vụ CSKH (`cskh/scripts/qa-*.mjs`)

---

## 💻 Hướng dẫn chạy và bảo trì (Local Development)

Yêu cầu môi trường: **Node.js >= 20** và **npm >= 10**.

### 1. Khởi chạy toàn bộ hệ thống (Recommended)
```bash
# Cài đặt thư viện
npm install

# Khởi chạy dev server (mặc định cổng 8080)
npm run dev -- --port 8080
```
Khi chạy máy chủ dev:
- **Sale CRM**: Truy cập `http://localhost:8080/`
- **CSKH Portal**: Truy cập `http://localhost:8080/cskh/index.html`
- **CSKH Review & AI chat**: Truy cập `http://localhost:8080/cskh/review-ai.html`

### 2. Chạy CSKH qua máy chủ độc lập
```bash
npm run cskh:start
# Mở: http://127.0.0.1:4809/review-ai.html
```

### 3. Kiểm thử tự động (Test suites)
```bash
# Kiểm thử đơn vị Sale CRM (Vitest)
npm test

# Kiểm thử mô hình ca, phiên 15 phút và AI của CSKH
npm run cskh:qa
```

### 4. Đóng gói Standalone Single HTML (Dành cho Handoff offline)
```bash
# Xuất cả 2 file standalone HTML:
npm run export:all

# Hoặc xuất riêng từng phân hệ:
npm run export:html    # Sinh ra sale-crm-prototype.html (673 KB)
npm run cskh:export    # Sinh ra cskh-prototype.html (2.8 MB)
```
Hai file HTML này có thể mở trực tiếp bằng trình duyệt (double-click hoặc mở bằng Chrome/Edge) mà không cần cài đặt Node.js hay Internet.

Đặt `sale-crm-prototype.html` và `cskh-prototype.html` cùng thư mục để menu CSKH trong bản CRM offline mở đúng màn tương ứng, gồm **Phiếu yêu cầu (M-49)**. Trên web, menu tiếp tục dùng đường dẫn `/cskh/`.

### 5. Đồng bộ khi sửa code CSKH
Nếu bạn chỉnh sửa file trong thư mục `cskh/`:
```bash
npm run cskh:sync
```
Lệnh này sẽ cập nhật các thay đổi vào thư mục `public/cskh/` để dev server và bản build Netlify tự động nhận file mới.

---

## 🚀 Triển khai (Deployment)

Dự án được cấu hình sẵn sàng triển khai tự động qua **Netlify** với runtime Edge/SSR thông qua Nitro. Cả Sale CRM và CSKH đều được đóng gói và phục vụ trực tuyến.
Chi tiết xem thêm tại [DEPLOY-NETLIFY.md](DEPLOY-NETLIFY.md).
