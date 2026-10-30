# Quy tắc làm việc trong my-portfolio

## Tự động commit

- Sau mỗi yêu cầu có thay đổi file, hoàn tất chỉnh sửa và chạy các kiểm tra phù hợp, rồi tự tạo một Git commit trước khi trả lời cuối cùng. Không cần hỏi lại quyền commit.
- Gộp các chỉnh sửa thuộc cùng một yêu cầu thành một commit; không commit sau từng thao tác sửa file trung gian.
- Kiểm tra trạng thái Git trước khi sửa và trước khi commit. Chỉ stage các thay đổi thuộc yêu cầu đang thực hiện. Nếu một file có thay đổi có sẵn, chỉ stage các phần do mình sửa; không gom thay đổi không liên quan của người dùng vào commit.
- Không commit thông tin bí mật, file tạm, cache hoặc sản phẩm build không được dự án theo dõi.
- Dùng thông điệp commit ngắn gọn, mô tả đúng thay đổi, ưu tiên dạng Conventional Commits (`feat:`, `fix:`, `style:`, `docs:`, `chore:`).
- Mỗi commit phải có message rõ ràng bằng tiếng Việt: tiêu đề nêu hành động và phần được thay đổi; không dùng thông điệp chung chung như `update`, `fix bug` hoặc `changes`. Khi có nhiều thay đổi hoặc cần giải thích, thêm phần nội dung mô tả các thay đổi chính, lý do và kết quả kiểm tra thực tế.
- Không tạo commit rỗng nếu không có thay đổi. Không tự amend commit cũ, reset hoặc hoàn tác thay đổi của người dùng.
- Nếu kiểm tra thất bại, sửa lỗi thuộc phạm vi yêu cầu và kiểm tra lại. Nếu vẫn không thể commit hoặc xác minh do lỗi môi trường, báo rõ lý do; không báo đã commit khi chưa thành công.
- Sau khi commit, báo mã commit và tóm tắt ngắn gọn. Không tự push, force push hoặc triển khai trừ khi người dùng yêu cầu.
