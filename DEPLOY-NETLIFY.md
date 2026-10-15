# Hướng dẫn deploy prototype Sale CRM lên Netlify

Prototype này là app **TanStack Start** (có SSR + server runtime), không phải site tĩnh thuần,
nên cần deploy qua **Git trên Netlify** (không dùng kéo–thả thư mục tĩnh).

## Cách deploy

1. Đưa mã nguồn này lên một repo Git (GitHub/GitLab/Bitbucket).
2. Trên Netlify: **Add new site → Import an existing project** → chọn repo.
3. Giữ nguyên các thiết lập đã có trong `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node.js version: 22
4. Bấm **Deploy**.

## Cấu hình build

`vite.config.ts` khai báo đích deploy cho Nitro:

```ts
export default defineConfig({
  nitro: { preset: "netlify" },
  tanstackStart: { server: { entry: "server" } },
});
```

Nitro vốn tự nhận diện môi trường build của Netlify, nên dòng preset là **không bắt buộc trên
Netlify**. Giữ nó vì lý do kiểm chứng: mặc định của `@lovable.dev/vite-tanstack-config` là
`cloudflare-module`, khi đó `npm run build` **ở máy** chỉ sinh ra `.output/` kèm `wrangler.json`
và không có `dist/`. Khai preset tường minh giúp bản build ở máy trùng đúng bản Netlify sẽ dựng,
nên kiểm tra được trước khi push.

Với preset `netlify`, build sinh ra đúng hai phần:

| Đường dẫn | Vai trò |
|---|---|
| `dist/` | Tài nguyên tĩnh + `_headers` — khớp `publish = "dist"` |
| `.netlify/functions-internal/server/` | Netlify Function chạy SSR |

Theo tài liệu Nitro, `_redirects` rỗng là bình thường — Netlify tự định tuyến SSR qua function.
Chỉ thêm `_redirects` vào `public/` khi cần rule chuyển hướng riêng.

## Cập nhật

Mỗi lần push code mới lên repo, Netlify tự build và deploy lại.

## Lưu ý

- Dữ liệu trong prototype là **mock data** (giữ trong React state) — không cần biến môi trường hay database.
- Font thương hiệu (Plus Jakarta Sans + Lexend) nạp từ Google Fonts bằng `<link>` trong
  `src/routes/__root.tsx`, không cần asset cục bộ.
- Bộ design system dùng trong prototype nằm ở `src/design-system/` — xem `DESIGN-SYSTEM.md`.
- Nếu muốn bản chạy thử nhanh không cần Git: chạy `npm install && npm run dev` tại máy,
  hoặc dùng chức năng **Download codebase** của Lovable.
