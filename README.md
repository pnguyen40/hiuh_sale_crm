# HIUH Operation Portal — Sale CRM Prototype

Phân hệ Sale CRM nội bộ phục vụ quản lý hồ sơ tư vấn khách hàng cá nhân (B2C), danh bạ Contact và xúc tiến cơ hội khám đoàn doanh nghiệp (B2B) tại **Bệnh viện Đại học Quốc tế Hồng Bàng (HIUH · HBH)**.

---

## 🌟 Tính năng chính

- **Hồ sơ tư vấn (B2C Pipeline)**: Theo dõi phễu chuyển đổi từ tiếp nhận, tư vấn, hẹn khám đến chăm sóc sau khám. Phân loại theo nguồn tiếp nhận (Website, App, Nhập tay, Import) và chiến dịch.
- **Khám đoàn & Hợp đồng Doanh nghiệp (B2B)**: Quản lý khách hàng doanh nghiệp, deal quy mô đoàn, giai đoạn chốt hợp đồng và tổ chức khám sức khỏe định kỳ.
- **Danh bạ Contact**: Danh bạ tập trung hỗ trợ phân loại khách hàng, lịch sử tương tác và gắn nhãn nhanh.
- **Bảng giá & Danh mục Dịch vụ**: Tra cứu thông tin dịch vụ, gói khám tầm soát và báo giá y tế.
- **Audit Log**: Nhật ký thao tác hệ thống đảm bảo truy vết thay đổi dữ liệu minh bạch.

---

## 🎨 Design System

Giao diện áp dụng đồng bộ theo **HIU Hospital Design System** (bản quyền HIUH):
- **Bảng màu**: Clinical Sky (`--hb-brand: #0052D7`, `--hb-brand-soft: #EEF3FD`, `--hb-ink: #101828`).
- **Typography**: 
  - Tiêu đề & Heading: **Plus Jakarta Sans** (Google Fonts).
  - Nội dung & Bảng dữ liệu: **Lexend** (Google Fonts).
- **Iconography**: **Lucide Icons** (stroke 1.5).
- **Controls & Radius**: Elevated Segmented Control (`rounded-[9px]` trên rãnh `rounded-[11px]`), buttons chuẩn `8px` – `10px`.

---

## 🛠️ Công nghệ

- **Framework**: TanStack Start + React 19
- **Ngôn ngữ**: TypeScript
- **Styling**: Tailwind CSS + Custom Design System CSS Tokens
- **Icons**: Lucide React
- **Engine / SSR**: Nitro (Netlify preset)
- **Kiểm thử**: Vitest

---

## 💻 Hướng dẫn chạy môi trường cục bộ (Local Development)

Yêu cầu môi trường: **Node.js >= 20** và **npm >= 10**.

```bash
# Cài đặt thư viện
npm install

# Khởi chạy dev server (mặc định cổng 8080)
npm run dev -- --port 8080

# Chạy kiểm thử tự động
npm test

# Build production bundle
npm run build
```

---

## 🚀 Triển khai (Deployment)

Dự án được cấu hình sẵn sàng triển khai tự động qua **Netlify** với runtime Edge/SSR thông qua Nitro.
Chi tiết xem thêm tại [DEPLOY-NETLIFY.md](DEPLOY-NETLIFY.md).
