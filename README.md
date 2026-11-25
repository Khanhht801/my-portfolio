# Portfolio React

Cài Node.js và chạy `npm ci` để cài phụ thuộc.

- `npm run dev`: chạy trang để phát triển tại địa chỉ được Vite hiển thị.
- `npm test`: kiểm tra các section và tương tác chính.
- `npm run build`: tạo bản tĩnh trong `dist/`, bao gồm ảnh, CV và CNAME.
- `npm run build:preview`: tạo bản xem trước có `noindex`, không có sitemap và CNAME; dùng bản này khi đưa lên staging/preview.
- `npm run preview`: xem thử bản build sau khi chạy `npm run build`.

Các component nằm trong `src/sections/`, dùng lại CSS hiện có. Tệp `script.js` giữ các tương tác cũ và được khởi tạo sau khi React render. Các fragment trong `sections/` được giữ làm bản đối chiếu cho kiểm thử.

Khi xuất bản, máy chủ tĩnh cần phục vụ nội dung thư mục `dist/` sau bước build. Nếu GitHub Pages đang phục vụ trực tiếp thư mục gốc của nhánh, cần cấu hình quy trình build và xuất bản `dist/` trước khi cập nhật trang; mã nguồn JSX không chạy trực tiếp trên hosting tĩnh. Không có thay đổi cấu hình triển khai tự động trong dự án này.

Technical SEO được tạo qua plugin Vite trong `scripts/technical-seo.mjs`, sử dụng domain đã xác nhận trong `CNAME`. Chỉ bản build ở mode `production` với CNAME hợp lệ mới giữ `index, follow`, tạo canonical và đưa trang chủ vào sitemap. Các mục `#work`, `#about` và hộp thoại case study không phải trang riêng. Khi bổ sung trang HTML mới, cần khai báo URL đại diện trong danh sách `pages` của plugin; không tự canonical tất cả trang về trang chủ.

Các mode khác (gồm `preview`, `staging`, development) hoặc khi chưa có CNAME đều dùng `noindex, follow`, không xuất canonical, sitemap và CNAME. robots.txt vẫn cho phép crawling để crawler đọc được yêu cầu noindex; không đặt chỉ thị noindex trong robots.txt. Server dev và `npm run preview` có thêm `X-Robots-Tag: noindex, follow`; server preview cũng thay metadata trong response và trả 404 cho sitemap production, kể cả khi đang xem một bản build production. Đây không phải cơ chế bảo vệ bản sao production được tải lên một hosting preview khác: phải dùng `npm run build:preview` hoặc cấu hình noindex trên hosting đó.

Vite dùng `appType: 'mpa'` để URL không tồn tại trả HTTP 404 thay vì fallback về trang chủ. Hosting thật cũng phải giữ HTTP 404, không cấu hình rewrite mọi đường dẫn về index.html. Sau triển khai, kiểm tra `/`, `/robots.txt`, `/sitemap.xml` và một URL không tồn tại; cấu hình trong repository không tự thay đổi trạng thái HTTP của hosting đang chạy.
