# Bàn giao phần B — AI Agent Action Guard

## Đã chuẩn bị

UI Requester/Approver, dữ liệu hóa đơn giả lập, server rehearsal không dependency, adapter API, wrapper Next.js, README trung thực dưới 300 từ, kịch bản 120 giây và checklist nghiệm thu. Các hàm có ghi chú Input/Output bằng tiếng Việt. Node built-ins phục vụ HTTP/test/UUID; không thêm thư viện frontend. Fonts tải từ Google có fallback system nếu offline.

## A cần cung cấp để kết thúc công việc

Repo/branch của app, route đăng nhập, `/api/me`, routes request/approve/reject/execute, ceremony SDK thật, chính sách phê duyệt đã triển khai, tài khoản demo riêng và cách reset. Không gửi password/token trong chat hoặc commit.

## Phần chưa thể đánh dấu hoàn tất

Không có repo/API của A trong workspace khi tạo gói. Chưa tích hợp TideCloak, chưa quay video nộp chính thức, chưa kiểm tra repo public trên máy khác, chưa xác nhận tên nhóm/campus hoặc nộp form. Video mock không thay thế phần này.

## Điểm cần thống nhất

Prototype B yêu cầu mọi payment phải duyệt; >10 triệu là high-value. Không khẳng định backend chống chiếm quyền admin chỉ dựa trên mock/login. A phải xác minh Tide bảo vệ đúng thao tác thực thi, không chỉ UI. Checklist integration độc lập với test rehearsal.

## Chạy

`node server.mjs` → http://127.0.0.1:4317 . Mở workspace Approver bằng link trên banner. `node --test tests/workflow.test.mjs` kiểm tra model state và API rehearsal. Reset chỉ xóa dữ liệu RAM của server local.
