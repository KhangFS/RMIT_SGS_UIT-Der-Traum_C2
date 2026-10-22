# Checklist phần B

## UI rehearsal (có thể kiểm tra local)
- [ ] Requester tạo được yêu cầu hợp lệ; số tiền 0/âm/lẻ bị chặn.
- [ ] Execute trước duyệt bị từ chối và chưa có receipt.
- [ ] Requester không tự duyệt qua API rehearsal.
- [ ] Approver thấy đúng người nhận/số tiền/mã yêu cầu; có hộp xác nhận.
- [ ] Approve không đồng nghĩa executed; Requester execute riêng.
- [ ] Execute lặp trả cùng receipt, không thêm giao dịch.
- [ ] Reject ngăn execute; không approve lại request đã reject.
- [ ] Refresh và hai tab đồng bộ trạng thái.
- [ ] Mobile, keyboard, error và empty states đọc được.

## Tích hợp thật (CHƯA xác minh)
- [ ] Hai tài khoản Tide riêng, vai trò lấy từ session.
- [ ] Approval ceremony và quyền execute được A xác nhận bảo vệ thật.
- [ ] POST không thể bị vượt quyền qua header/query do client tự chọn.
- [ ] Approval gắn với payload cố định, có chống execute lặp phía backend.
- [ ] Login/logout, session expiry, lỗi mạng, refresh được kiểm tra.
- [ ] README không tuyên bố vượt quá kết quả xác minh.

## Repo/video (CHƯA thực hiện khi chưa có repo A)
- [ ] Project overview đủ 5 mục và <=300 từ.
- [ ] Setup tách khỏi overview; `.env`/secret không được commit.
- [ ] `demo/final-demo.mp4` <=120 giây, <100 MB, âm thanh/hình kiểm tra đầy đủ.
- [ ] Repo public mở được từ phiên chưa đăng nhập.
- [ ] Code, README, video có đủ; kiểm tra trên máy khác do thành viên khác thực hiện.
- [ ] Tên nhóm `<university>_<campus>_<team>_C2`, campus theo BTC xác nhận.
- [ ] A nộp Google Form và giữ xác nhận. B không đánh dấu hoàn tất chỉ vì repo đã public.
