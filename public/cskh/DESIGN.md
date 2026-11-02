---
name: HIUH CSKH — extension v0.9
description: Khung chat phía khách và phần bổ sung AI log trong Portal hiện có
colors:
  primary: '#0052d7'
  primary-deep: '#0044b3'
  surface: '#ffffff'
  customer-page: '#eef2f7'
  customer-ink: '#1c2940'
  customer-muted: '#59657b'
  portal-muted: '#6e7699'
  portal-heading: '#16205c'
  portal-body: '#3b4177'
  portal-page: '#f6f8fd'
  portal-border: '#e8eef7'
  speaker-patient: '#22c55e'
  speaker-cskh: '#0052d7'
  speaker-ai: '#7c3aed'
  warning-text: '#80500a'
  warning-background: '#fff5df'
  error: '#b42318'
  success: '#196441'
typography:
  customer-body:
    fontFamily: 'Montserrat, Arial, sans-serif'
    fontSize: '14px'
    fontWeight: 400
    lineHeight: 1.55
  customer-heading:
    fontFamily: 'Montserrat, Arial, sans-serif'
    fontSize: '20px'
    fontWeight: 700
    lineHeight: 1.3
  portal-body:
    fontFamily: 'Lexend, system-ui, sans-serif'
    fontSize: '14px'
    fontWeight: 400
    lineHeight: 1.5
  portal-display:
    fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif'
    fontSize: '22px'
    fontWeight: 600
    lineHeight: 1.3
rounded:
  control: '8px'
  action: '20px'
  panel: '12px'
  message: '14px'
spacing:
  xs: '8px'
  sm: '12px'
  md: '16px'
  lg: '24px'
components:
  customer-primary-button:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.surface}'
    rounded: '{rounded.control}'
    height: '44px'
---

## Overview

Phần mở rộng giữ nhận diện Website và Portal được khảo sát. Người dùng cần hoàn thành trao đổi; trạng thái và đường tiếp tục quan trọng hơn trang trí. Không thay token gốc của v0.7.

## Colors

Xanh dùng cho hành động và tin khách; trắng/xám xanh làm nền đọc. Amber dùng cho hết phiên sớm hoặc chất lượng liên hệ; đỏ cho lỗi gửi/nhập. Mọi trạng thái có chữ, không chỉ màu.

## Typography

Website dùng Montserrat lấy từ tài sản public HIUH đã kiểm tra. Portal dùng Lexend cho nội dung và Plus Jakarta Sans cho tiêu đề theo `--font-body` / `--font-display` trong `portal-tokens.css`. Tiêu đề trang review dùng token display kế thừa, không thêm font mới. Văn bản hội thoại 12–15px tùy bề mặt/viewport, tên trường và nội dung chính rõ hơn metadata. Trường nhập trên điện thoại 16px để tránh zoom tự động; metadata nhỏ không thay thế thông tin hành động.

## Layout

Khách: header → thanh chuyển CSKH/countdown → transcript cuộn → ô soạn. Form chuyển CSKH nằm nội tuyến, có đường đóng trước gửi. Mobile toàn chiều rộng, không thu nhỏ desktop.

Portal: giữ sidebar/header, ba cột 210px / co giãn / 285px ở desktop; dưới 1024px chuyển thành ba tab. Khách & Xử lý luôn cạnh nguồn trên desktop. Các cột cuộn độc lập, composer neo cuối vùng nguồn.

## Elevation & Depth

Khung chat khách có shadow nhẹ `0 12px 40px #162b4a12`; Portal chủ yếu phân vùng bằng viền. Focus dùng outline. Không dùng glow trang trí; focus token kế thừa được giữ.

## Shapes

Panel 12–14px, input/button 8–9px. Bubble góc khác theo bên gửi để đọc nhanh, luôn có nhãn người gửi.

## Components

Toggle chuyển CSKH khóa sau yêu cầu được lưu, không biến trở lại thành chọn AI. Cảnh báo tên/số có nút tiếp tục. Nội bộ và trả lời công khai có tab riêng. Countdown dùng số tabular. Lỗi/mất mạng/hết phiên giữ nháp; trạng thái loading phản hồi rõ.

## Do's and Don'ts

Giữ thông báo đầu tiên VI và link đúng URL. Dịch các cảnh báo khi đổi locale, giữ nguyên lịch sử. Không dùng lỗi import để từ chối chat. Không hiển thị dữ liệu khách trước nhận ca, không ghi nội dung chat vào metadata nhật ký. Không dùng bản demo làm bằng chứng AI/backend đã triển khai.

## Chuẩn v0.9

Nguồn ràng buộc: Operation Portal Design System v0.3. Token được chép nguyên vào `design-system/tokens` và import từ `portal-tokens.css`; lớp `portal-v09.css` sửa các giá trị hardcode lệch khỏi bộ chuẩn. Portal: heading Jakarta 22/600, section 15/600; body Lexend 14, dữ liệu/action 13, badge 12, nhãn 11. Sidebar 264px, header 64px, input/menu radius8, action radius20, panel radius12, nền #f6f8fd. Website/customer widget giữ Montserrat và nhận diện của HIUH public web.

Cột câu thoại cuối dùng chấm 8px cùng nhãn và giờ: bệnh nhân xanh lá, CSKH xanh dương, AI tím. Màu biểu diễn người gửi, không biểu diễn mức cảnh báo. Preview một dòng có dấu rút gọn; đọc toàn văn tại ca. Không dùng nội dung ghi chú nội bộ.

Bộ lọc: checkbox cho thuộc tính có thể chọn nhiều; radio cho một khoảng thời gian hoặc một kiểu hẹn theo dõi. Có tiêu đề “Chọn nhiều/Chọn một”, Bỏ chọn/Xong, điều kiện đang lọc và focus bàn phím. Menu dùng native popover để thoát vùng cuộn. Mobile giữ bảng cuộn ngang theo DS.

Phiên mới hết dùng amber có chữ trong cửa sổ 15 phút, sau đó trung tính; hết phiên luôn khóa gửi. Font theo nhận diện hiện có và bộ chuẩn được chỉ định.
