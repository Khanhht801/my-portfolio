# Portfolio React

Cài Node.js và chạy `npm ci` để cài phụ thuộc.

- `npm run dev`: chạy trang để phát triển tại địa chỉ được Vite hiển thị.
- `npm test`: kiểm tra các section và tương tác chính.
- `npm run build`: tạo bản tĩnh trong `dist/`, bao gồm ảnh, CV và CNAME.
- `npm run build:preview`: tạo bản xem trước có `noindex`, không có sitemap và CNAME; dùng bản này khi đưa lên staging/preview.
- `npm run preview`: xem thử bản build sau khi chạy `npm run build`.

Các component nằm trong `src/sections/`, dùng lại CSS hiện có. Tệp `script.js` giữ các tương tác cũ và được khởi tạo sau khi React render. Các fragment trong `sections/` được giữ làm bản đối chiếu cho kiểm thử.

Khi xuất bản, máy chủ tĩnh cần phục vụ nội dung thư mục `dist/` sau bước build. Không phục vụ thư mục gốc của nhánh: `index.html` nguồn gọi `src/main.jsx`, trình duyệt không chạy trực tiếp JSX nên trang sẽ trắng.

Workflow `.github/workflows/deploy-pages.yml` dùng Node.js 24, chạy `npm ci`, `npm test`, `npm run build`, rồi chỉ upload và deploy `dist/` bằng GitHub Pages Actions. Trong repository trên GitHub, chọn **Settings → Pages → Build and deployment → Source → GitHub Actions** để dùng workflow này; giữ nguyên custom domain `khanhht.tech`. Workflow chạy khi push lên `main` hoặc chọn **Actions → Build and deploy portfolio to GitHub Pages → Run workflow**. Nếu build/test thất bại, job deploy không chạy. Việc thêm file workflow cục bộ không tự thay đổi thiết lập Pages hay xác nhận website đã được triển khai.

Technical SEO được tạo qua plugin Vite trong `scripts/technical-seo.mjs`, sử dụng domain đã xác nhận trong `CNAME`. Chỉ bản build ở mode `production` với CNAME hợp lệ mới giữ `index, follow`, tạo canonical và đưa trang chủ vào sitemap. Các mục `#work`, `#about` và hộp thoại case study không phải trang riêng. Khi bổ sung trang HTML mới, cần khai báo URL đại diện trong danh sách `pages` của plugin; không tự canonical tất cả trang về trang chủ.

Các mode khác (gồm `preview`, `staging`, development) hoặc khi chưa có CNAME đều dùng `noindex, follow`, không xuất canonical, sitemap và CNAME. robots.txt vẫn cho phép crawling để crawler đọc được yêu cầu noindex; không đặt chỉ thị noindex trong robots.txt. Server dev và `npm run preview` có thêm `X-Robots-Tag: noindex, follow`; server preview cũng thay metadata trong response và trả 404 cho sitemap production, kể cả khi đang xem một bản build production. Đây không phải cơ chế bảo vệ bản sao production được tải lên một hosting preview khác: phải dùng `npm run build:preview` hoặc cấu hình noindex trên hosting đó.

Vite dùng `appType: 'mpa'` để URL không tồn tại trả HTTP 404 thay vì fallback về trang chủ. Hosting thật cũng phải giữ HTTP 404, không cấu hình rewrite mọi đường dẫn về index.html. Sau triển khai, kiểm tra `/`, `/robots.txt`, `/sitemap.xml` và một URL không tồn tại; cấu hình trong repository không tự thay đổi trạng thái HTTP của hosting đang chạy.

Ảnh chia sẻ mặc định cho trang portfolio nằm tại `public/og/portfolio.png` (PNG, 1200×630), được Vite sao chép thành `/og/portfolio.png` khi build. Ảnh dùng chân dung sẵn có trong dự án, nhận diện nền kem/xanh và chữ tiếng Việt; prompt ImageGen được lưu tại `scripts/og-image-prompt.txt`. Trang chủ là trang nội dung duy nhất và dùng ảnh này; nếu có trang thực sự mới, khai báo ảnh phù hợp ở thuộc tính `image` của trang trong plugin, dùng ảnh mặc định khi chưa có ảnh riêng.

Open Graph và Twitter Card được tạo trong cùng helper technical SEO từ title/description của từng trang; không khai báo thêm một bộ thẻ ở component React. Production dùng og:url khớp canonical và URL ảnh HTTPS theo CNAME. Dev/preview không tự tạo domain: bỏ og:url và dùng đường dẫn ảnh cục bộ, giữ chính sách noindex. Ảnh có alt, MIME type và kích thước trong metadata; Twitter dùng summary_large_image. Sau triển khai cần kiểm tra URL ảnh bằng bot và trình kiểm tra chia sẻ của nền tảng; việc test HTTP với user-agent của bot cục bộ không xác nhận preview Facebook, LinkedIn hoặc X đã được cập nhật.

Hai tối ưu performance cho ảnh chân dung (26/11/2026): hero dùng WebP 420/840/1086px, slider About dùng WebP 480/768/1024px kèm srcset/sizes theo breakpoint CSS. Giữ eager/high priority cho hero, lazy-loading cho About, aspect ratio và cách crop hiện có. Ảnh gốc được giữ làm nguồn và fallback; khi lỗi ảnh responsive, bỏ srcset trước khi chuyển sang ảnh gốc. Chạy `python scripts/optimize-portraits.py` để tạo lại các biến thể bằng Pillow đã có trong môi trường; không cần thêm dependency vào ứng dụng.

Đo trước/sau trên bản production tại `http://127.0.0.1:5187/` bằng Node v24.22.1 fetch: GET từng tài nguyên, Accept-Encoding identity, không throttling, không có HTTP cache bền vững của trình duyệt. Đây là phép đo dung lượng HTTP, không có viewport hay renderer; không phải waterfall tải trang. Có thể lặp lại với `node scripts/measure-portrait-payload.mjs http://127.0.0.1:5187/` sau khi build và chạy preview ở port đó. Tất cả tài nguyên đo được trả 200 với MIME type đúng.

| Nhóm tài nguyên | Trước (byte) | Sau, biến thể lớn nhất (byte) | Giảm |
| --- | ---: | ---: | ---: |
| Hero | 1.558.185 | 130.786 (1086px) | 91,6% |
| Tổng năm ảnh About | 4.512.534 | 1.190.270 (1024px/ảnh) | 73,6% |

Biến thể hero 840px có 98.636 byte; tổng năm ảnh About 768px có 718.626 byte, 480px có 308.702 byte. Lựa chọn thực tế phụ thuộc viewport/DPR của trình duyệt, chưa được đo. Đã xem đối chiếu ảnh thu nhỏ và xác minh giữ alpha trong suốt của hero. Bundle JavaScript sau sửa khoảng 315,81 kB (88,51 kB gzip); nguồn vẫn dùng ba họ Google Fonts với display=swap. Chưa có phép đo rendering đủ để xác định font/JavaScript gây chậm, nên không đổi chúng trong hai tối ưu này.

Giới hạn kiểm chứng: Browser Use không có host kết nối; Computer Use dừng vì không xác định được URL trình duyệt đủ chắc chắn. Chưa xác định phần tử/thời gian LCP, CLS, độ trễ tương tác hoặc kiểm tra trực quan responsive trong trình duyệt thật. Kiểm thử tự động xác nhận cấu trúc, responsive attributes, chuyển ảnh, menu, hộp thoại, focus và fallback; chúng không thay thế số đo trình duyệt. Không có kết luận đạt Core Web Vitals hoặc INP người dùng thực tế.

JSON-LD: trang chủ portfolio tập trung vào một cá nhân, nên dùng `ProfilePage` với `mainEntity` là `Person`, theo [hướng dẫn Google](https://developers.google.com/search/docs/appearance/structured-data/profile-page) và định nghĩa [ProfilePage](https://schema.org/ProfilePage), [Person](https://schema.org/Person). Khối `portfolio-profile-schema` được tạo trong helper technical SEO hiện có, chỉ cho production có canonical và được phép index. Dev/staging/preview hoặc khi thiếu CNAME không xuất khối này; response preview cũng gỡ khối có sẵn từ bản production để tránh giữ schema nhầm môi trường. Biến đổi lặp lại thay thế khối được quản lý, không tạo thêm bản trùng.

Dữ liệu hiện có: tên lấy từ meta author và khớp H1; biệt danh Khanhht có trên navbar; sameAs dùng liên kết GitHub được hiển thị ở phần liên hệ; image dùng đúng chân dung hero, không dùng ảnh OG mặc định. URL lấy từ canonical, không tự đặt domain. Không khai báo Review, điểm đánh giá, Product/Offer, Organization/LocalBusiness, giá, địa chỉ, chứng nhận hoặc số liệu tương tác. Chưa có dữ liệu xác nhận ngày tạo/sửa hồ sơ, nên không thêm dateCreated/dateModified; không dùng ngày build để thay thế.

Kiểm chứng cục bộ gồm JSON.parse, các trường bắt buộc ProfilePage.mainEntity và Person.name, tính khớp với HTML render, URL ảnh có thể phục vụ qua HTTP, và chính sách không có schema ở môi trường noindex. Đây không phải kết quả của Schema Markup Validator hoặc Google Rich Results Test: chưa chạy hai validator đó. Schema đúng cú pháp và đủ trường kiểm tra không tự bảo đảm đủ điều kiện hoặc được Google hiển thị rich result. Sau khi xuất bản dist cần kiểm tra truy cập Googlebot, Rich Results Test và URL Inspection/Search Console; kết quả trên Google chưa được xác minh. Xem thêm [chính sách structured data của Google](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).
