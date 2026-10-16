import { build } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function exportSingleHtml() {
  console.log('🚀 Đang đóng gói Sale CRM Prototype thành single standalone HTML...');

  // 1. Tạo file HTML tạm thời làm đầu vào cho Vite
  const tempEntryPath = path.resolve(rootDir, '.temp-single-entry.html');
  const tempHtml = `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="/src/styles.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/standalone.tsx"></script>
  </body>
</html>`;
  fs.writeFileSync(tempEntryPath, tempHtml, 'utf-8');

  try {
    // 2. Chạy Vite build trong bộ nhớ (write: false)
    const result = await build({
      root: rootDir,
      configFile: false,
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: { '@': path.resolve(rootDir, 'src') }
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production')
      },
      build: {
        write: false,
        minify: true,
        cssMinify: true,
        rollupOptions: {
          input: tempEntryPath
        }
      }
    });

    const output = Array.isArray(result) ? result[0].output : result.output;
    const jsChunk = output.find(o => o.type === 'chunk');
    const cssAsset = output.find(o => o.type === 'asset' && o.fileName.endsWith('.css'));

    if (!jsChunk || !cssAsset) {
      throw new Error('Không tìm thấy JS chunk hoặc CSS asset trong kết quả build của Vite!');
    }

    // 3. Đọc icon để nhúng data:image URI
    const iconPath = path.resolve(rootDir, 'public/icon.png');
    let iconBase64 = '';
    if (fs.existsSync(iconPath)) {
      iconBase64 = fs.readFileSync(iconPath).toString('base64');
    }

    // 4. Tạo file Single HTML hoàn chỉnh
    const timestamp = new Date().toISOString();
    const finalHtml = `<!DOCTYPE html>
<!--
  ================================================================================
  HIUH OPERATION PORTAL — SALE CRM PROTOTYPE (HANDOFF BẢN DEV)
  Bệnh viện Đại học Quốc tế Hồng Bàng (HIUH · HBH)
  
  Mô tả:
  - Bản đóng gói Single Standalone HTML độc lập 100%, không cần Node.js hay local server.
  - Chạy trực tiếp qua file:/// trên mọi trình duyệt (Chrome, Safari, Edge, Firefox).
  - Đã tích hợp sẵn React 19 runtime, Lucide icons, Design System CSS tokens và Mock state.
  
  Các phân hệ chính:
  1. Dashboard Giám sát (Funnel & Pipeline phễu chuyển đổi, nguồn tiếp nhận & chiến dịch).
  2. Hồ sơ tư vấn B2C (Pipeline chuyển đổi, phân công CSKH, bộ lọc đa chiều & đặt hẹn).
  3. Khách hàng Doanh nghiệp & Đoàn B2B (Quy mô đoàn, giai đoạn Open/Confirmed/Won/Lost).
  4. Danh bạ Contact tập trung (Phân loại khách hàng, lịch sử liên hệ, cảnh báo trùng SĐT).
  5. Bảng giá dịch vụ & Tra cứu gói khám (Dữ liệu tham chiếu chuẩn).
  6. Nhật ký kiểm tra (Audit Log truy vết thay đổi dữ liệu).
  
  Thời điểm xuất: ${timestamp}
  ================================================================================
-->
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <meta name="theme-color" content="#0052D7" />
  <title>Sale CRM · Operation Portal | HIUH · HBH</title>
  <meta name="description" content="Prototype Sale CRM nội bộ Bệnh viện ĐHQT Hồng Bàng: giám sát hồ sơ tư vấn B2C, danh bạ Contact và cơ hội khám đoàn doanh nghiệp B2B." />
  
  ${iconBase64 ? `<link rel="icon" type="image/png" href="data:image/png;base64,${iconBase64}" />` : ''}
  
  <!-- Google Fonts: Plus Jakarta Sans (Heading/Display) + Lexend (Body/Content) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Lexend:wght@300;400;500;600;700&display=swap&subset=vietnamese">

  <!-- HIUH Hospital Design System & Compiled Tailwind CSS -->
  <style>
${cssAsset.source}
  </style>
</head>
<body class="bg-[#F8FAFC] text-[#101828] antialiased">
  <div id="root"></div>

  <!-- Compiled React 19 Application Bundle -->
  <script type="module">
${jsChunk.code}
  </script>
</body>
</html>`;

    const outPath = path.resolve(rootDir, 'sale-crm-prototype.html');
    fs.writeFileSync(outPath, finalHtml, 'utf-8');

    const stats = fs.statSync(outPath);
    const sizeKb = (stats.size / 1024).toFixed(1);
    console.log(`✅ Xuất thành công file standalone: ${outPath}`);
    console.log(`📦 Dung lượng file: ${sizeKb} KB`);
  } finally {
    if (fs.existsSync(tempEntryPath)) {
      fs.unlinkSync(tempEntryPath);
    }
  }
}

exportSingleHtml().catch(err => {
  console.error('❌ Lỗi khi xuất single HTML:', err);
  process.exit(1);
});
