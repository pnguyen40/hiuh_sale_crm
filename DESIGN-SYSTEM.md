# Áp dụng Design System HIUH vào prototype Sale CRM

Tài liệu này ghi lại **cách** bộ design system HIUH đã được áp vào prototype, để lần cập nhật sau không phải đoán.

## Nguồn design system

| Nội dung | Giá trị |
|---|---|
| Gói nguồn | `hiu-hospital-design-system-0d4df4fa-882d-47dc-a766-1b0f32f792ca` |
| Vị trí trong repo | `src/design-system/` |
| Readme gốc | `src/design-system/readme.md` |
| Token thực thi | `src/design-system/tokens/{colors,typography,spacing,themes,fonts,base}.css` |
| Entry point | `src/design-system/styles.css` |

Nguyên tắc: **giá trị token chỉ tồn tại trong `src/design-system/tokens/`**. Mọi token khác trong `src/styles.css` chỉ được `var()` trỏ về đó.

## Đã import những gì

Trong `src/styles.css`, phần đầu file:

```css
@import "./design-system/tokens/colors.css";
@import "./design-system/tokens/typography.css";
@import "./design-system/tokens/spacing.css";
@import "./design-system/tokens/themes.css";
```

Hai file **cố ý không import**:

- `tokens/fonts.css` — webfont thương hiệu (Plus Jakarta Sans + Lexend) đã được nạp bằng `<link>` trong `src/routes/__root.tsx`. Import thêm sẽ tạo request trùng.
- `tokens/base.css` — reset của nó xung đột với Tailwind preflight.

## Bảng ánh xạ token

Token gốc của prototype (tiền tố `--crm-*`, `--crm-tone-*`, `--brand-*`, `--surface-*`, `--text-*`, `--border-*`) nay trỏ về token DS:

| Prototype | Design System | Ghi chú |
|---|---|---|
| `--crm-primary-50…900` | `--blue-50…900` | Xanh logo `#0052D7` = `--blue-500` |
| `--crm-neutral-0…900`, `--crm-neutral-ink` | `--neutral-0…900`, `--neutral-ink` | Trung tính ngả xanh, không xám phẳng |
| `--crm-success/warning/error/info-*` | `--success/warning/error/info-100/500/700-800` | |
| `--crm-teal` | `--teal` | Điểm nhấn B2B |
| `--crm-radius-8/12/14/16/20` | `--radius-sm/md/lg/xl/2xl` | Trong scope `.hiu-portal` |
| `--crm-radius-pill` | `--radius-pill` | 999px |
| `--crm-shadow-sm/md/lg` | `--shadow-sm/md/lg` | |
| `--crm-ease-standard`, `--crm-dur-*` | `--ease-standard`, `--dur-fast/normal/slow` | Không bounce |
| `--crm-focus-ring` | `--focus-ring` | Vòng focus 3px xanh thương hiệu, 28% |
| `--crm-sidebar-w`, `--crm-header-h` | `--sidebar-w`, `--header-h` | 264px / 72px |
| `--crm-tone-1…60` | token DS tương ứng | Bảng đầy đủ nằm trong khối `:root{--crm-tone-…}` của `src/styles.css` |

Ngoài ra:

- Thang bo góc của Tailwind (`--radius-sm…2xl` trong `@theme inline`) được chỉnh về đúng thang DS: `10 / 14 / 16 / 20 / 24`.
- Chữ tiêu đề (`.heading-*`, `.title-*`, `.crm-prototype h1…h4`) dùng `--font-display` = **Plus Jakarta Sans**; chữ nội dung dùng `--font-body` = **Lexend**.
- Class `hiu-portal` được gắn vào phần tử gốc của prototype (`src/components/crm/CrmPrototype.jsx`) để kích hoạt scope doctor/admin của DS — mật độ dày hơn, bo góc chặt hơn.

### Vì sao phải khai lại trong `.hiu-portal`

Custom property khai ở `:root` được tính giá trị ngay tại `:root`, rồi mới kế thừa xuống. Nếu chỉ khai alias ở `:root`, scope `.hiu-portal` sẽ không bao giờ tác động. Vì vậy các alias bo góc/đổ bóng được **khai lại** trong khối `.hiu-portal` ở `src/styles.css` để chúng phân giải theo giá trị của scope.

## Icon

DS chuẩn hóa **Lucide**, nét mảnh (stroke 1.5, trạng thái active 1.8). Prototype đã dùng đúng qua `src/components/crm/icons.tsx`.

Đã gỡ bỏ:

- `@font-face` Material Symbols và class `.material-symbols-outlined`.
- `public/fonts/97013d25-fac1-44c1-9a98-63238e838611.woff2` (**4,0 MB**) cùng 7 file mô tả asset trong `src/assets/`.

## Kết quả kiểm chứng

| Hạng mục | Kết quả |
|---|---|
| `npm run build` | Thành công, 1963 module |
| `npm test` | 1/1 test pass |
| CSS build ra (`dist/assets/styles-*.css`) | Có `--blue-500`, `.hiu-portal` với bo góc 8/12/14/16/20, tiêu đề dùng `var(--font-display)` |
| Hex lạ trong rule | **0** — toàn bộ hex còn lại nằm trong khối khai báo token DS |
| Trang SSR (`http=200`) | Có `crm-prototype hiu-portal`, icon Lucide, font thương hiệu, không còn woff2 cục bộ |

## Điểm cần BA quyết (chưa tự chốt)

1. **`readme.md` của DS mâu thuẫn với `tokens/colors.css`.** Readme mô tả palette v2 "Clinical Sky" (`--neutral-50 #F5F8FF`, viền `#E1E7F4`, chữ `#374056`); `colors.css` lại ghi rõ là palette gốc đã khôi phục (`--neutral-50 #f6f8fd`, `#3b4177`). Bản thực thi là `colors.css` — đã dùng theo đó. Cần chốt nguồn chuẩn.
2. **Trùng tên token giữa hai hệ.** DS có `--text-muted` = `--neutral-500`, prototype dùng `--text-muted` = `--neutral-700`; DS có `--border-default` = `--neutral-300`, prototype dùng `= --border-subtle`; DS có `--surface-page` = `--neutral-50`, prototype dùng `= trắng`. Bản prototype thắng vì khai sau. Đã ghi chú tại chỗ trong `src/styles.css`. Cần chốt giữ hay đổi tên.
3. **`html { font-size: 1vw }` khi ≥1200px** (khối HDS trong `src/styles.css`) làm mọi kích thước `rem` co giãn theo bề rộng màn hình, khác với mốc 16px của DS. Chưa đổi vì sẽ làm xô lệch toàn bộ prototype. Cần chốt bỏ hay giữ.
4. **Lớp CSS `.hds-*` là code chết.** 1027 selector trong `src/styles.css` không xuất hiện ở bất kỳ file `.jsx/.tsx` nào. Còn 10 chỗ trỏ tới font Material Symbols đã gỡ (vô hại, chỉ còn fallback). Nên xoá — giảm khoảng 45% dung lượng CSS.
5. **Chưa có bộ asset của DS.** Gói xuất không kèm `assets/` (logo H monogram, app icon, favicon). `public/favicon.ico` hiện vẫn là favicon cũ. DS quy định H monogram làm favicon.
6. **`--radius-sm` của Tailwind là 10px, của DS cũng 10px — nhưng `--radius-4/8` (alias HDS) nay bằng 8px trong scope `.hiu-portal`.** Hai cách đặt tên song song; nên hợp nhất khi có dịp.

## Cách cập nhật khi có bản DS mới

1. Thay nội dung `src/design-system/` bằng gói mới.
2. Đối chiếu tên token mới với bảng ánh xạ ở trên; sửa các alias trong `src/styles.css` nếu tên đổi.
3. Chạy `npm run build` và kiểm tra `dist/assets/styles-*.css` còn đủ token.
4. Cập nhật lại tài liệu này nếu bảng ánh xạ thay đổi.
