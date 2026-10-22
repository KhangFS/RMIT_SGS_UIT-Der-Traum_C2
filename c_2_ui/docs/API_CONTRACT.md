# Hợp đồng UI ↔ backend A (đề xuất, không phải Tide SDK API)

## Nguyên tắc

Frontend gọi cùng origin qua `fetch(..., credentials: 'same-origin')`. A quản lý cookie HttpOnly, session và cơ chế chống CSRF cho các thao tác POST. Không lưu secret/Tide token trong localStorage. Không tin role/query/header do client gửi. `GET /me` phải trả identity đã xác thực. Route approver không thay thế enforcement tại API.

`public/config.js`: đổi `mode` thành `live` CHỈ sau khi đã ghép API thật. Live adapter không gửi X-Demo-Role; workspace lấy role từ `/api/me`, không từ URL. `apiBase` mặc định `/api`. Nếu ứng dụng A có prefix khác, sửa cấu hình. Chế độ live cũng KHÔNG tự chứng minh Tide được tích hợp.

## Routes

| Method / route | Body | Success |
|---|---|---|
| GET /api/me | — | `{id,name,role: 'requester' hoặc 'approver'}` |
| GET /api/action-requests | — | `{items: Request[]}`; server lọc theo quyền |
| POST /api/action-requests | `{recipientId,amountVnd,reason}` | 201, Request; server lấy requestedBy từ session |
| POST /api/action-requests/:id/approve | `{}` | Request SAU khi quy trình phê duyệt thực sự hoàn tất |
| POST /api/action-requests/:id/reject | `{}` | Request REJECTED |
| POST /api/action-requests/:id/execute | `{}` | Request EXECUTED cùng receipt; lặp lại trả cùng receipt |

Các mutation chỉ gửi ID; server lấy payload đã cố định, không nhận lại số tiền/người nhận từ UI. Thay đổi nội dung cần tạo yêu cầu mới và duyệt lại. A phải xử lý chống double-execution bằng giao dịch/idempotency ở backend thật.

Nếu Tide SDK cần redirect, popup hoặc ceremony nhiều bước, A triển khai trong `api.js` hoặc auth bridge của app; `approve` chỉ resolve thành công khi backend xác nhận hoàn tất. Không giả định có thể thay ceremony bằng một POST đơn giản. UI hiện fail closed nếu API trả `authorizationRequired: true`.

## Request schema

Xem `domain.mjs` và `demo/demo-data.json`. Trường cần có: id, actionType, status, requestedBy, amountVnd, approvalThresholdVnd, recipientId, recipientName, invoiceId, reason, executionMode, createdAt, events, receipt.

`events`: `[{id, at: ISO8601, message}]`; `receipt`: null hoặc `{id,executedAt,amountVnd,recipientName}`. Không trả token/secret trong events. Backend cần dùng các trạng thái PENDING_APPROVAL, APPROVED, EXECUTING, EXECUTED, REJECTED, FAILED; không dùng APPROVED để báo giao dịch đã xong.

## Errors

JSON `{message: string}` với 400 (input), 401 (chưa đăng nhập), 403 (không đủ quyền/chưa duyệt), 404, 409 (state conflict), 5xx (lỗi server). Không trả 200 để báo lỗi. Từ chối execute không đổi pending thành approved hoặc executed.

## Chính sách demo cần A xác nhận

- Mọi payment cần phê duyệt độc lập; >10 triệu gắn cờ high value. Nếu A chỉ duyệt khoản vượt ngưỡng, phải thay UI và test cùng nhau.
- Người tạo không tự duyệt, người duyệt phải nhìn đúng payload gắn với approval.
- Chỉ execute khi quyền hợp lệ, không thể bypass bằng API khác.
- Không tuyên bố chống server takeover trước khi xác minh enforcement thực sự nằm ngoài quyền đơn phương của server.
- `/api/demo/reset` và header X-Demo-Role CHỈ tồn tại trong rehearsal; không đưa vào production.
