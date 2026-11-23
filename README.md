# Portfolio React

Cài Node.js và chạy `npm ci` để cài phụ thuộc.

- `npm run dev`: chạy trang để phát triển tại địa chỉ được Vite hiển thị.
- `npm test`: kiểm tra các section và tương tác chính.
- `npm run build`: tạo bản tĩnh trong `dist/`, bao gồm ảnh, CV và CNAME.
- `npm run preview`: xem thử bản build sau khi chạy `npm run build`.

Các component nằm trong `src/sections/`, dùng lại CSS hiện có. Tệp `script.js` giữ các tương tác cũ và được khởi tạo sau khi React render. Các fragment trong `sections/` được giữ làm bản đối chiếu cho kiểm thử.

Khi xuất bản, máy chủ tĩnh cần phục vụ nội dung thư mục `dist/` sau bước build. Nếu GitHub Pages đang phục vụ trực tiếp thư mục gốc của nhánh, cần cấu hình quy trình build và xuất bản `dist/` trước khi cập nhật trang; mã nguồn JSX không chạy trực tiếp trên hosting tĩnh. Không có thay đổi cấu hình triển khai tự động trong dự án này.
