# Demo 120 giây — bản quay sau tích hợp

**Trạng thái:** kịch bản sẵn sàng, chưa có video MP4 cuối. Chỉ dùng lời dẫn TideCloak sau khi A xác nhận ceremony/enforcement thật. Nếu quay rehearsal, giữ banner và nói rõ mock; không nộp nó như bằng chứng tích hợp.

| Thời gian | Cảnh / thao tác | Lời dẫn tiếng Anh |
|---|---|---|
| 00–12 | Màn Requester, tiêu đề sản phẩm | AI agents can prepare business payments. But a malicious or mistaken instruction should not give them permission to execute one. |
| 12–25 | Điền hóa đơn 15 triệu, chỉ người nhận và ngưỡng | Action Guard separates proposals from execution. Here, a simulated agent proposes a fifteen-million-dong supplier payment, above our high-value threshold. |
| 25–40 | Send for approval, chọn request | The request is recorded with its exact recipient, amount and purpose. Its status is awaiting approval. No payment has happened. |
| 40–55 | Try execution, giữ lỗi và activity trên màn hình | Trying to execute it now is denied. The required independent authorization is missing. The agent cannot turn its own proposal into an approved payment. |
| 55–75 | Chuyển phiên Approver thật, mở cùng request | A separately authenticated approver reviews the same invoice, recipient and amount. Approval must apply to this specific request. |
| 75–95 | Review & approve, hoàn tất ceremony thật | The approver authorizes the request through our TideCloak-integrated workflow. The interface now shows approval, not a completed payment. |
| 95–110 | Requester refresh, Execute, hiện receipt | With authorization in place, execution succeeds. This is a simulated receipt: all invoice data is synthetic and no real funds are transferred. |
| 110–120 | Giữ activity/receipt, kết | The benefit is useful delegation with independent control: agents prepare the work, while sensitive actions still require the right authority. |

## Ý chính tiếng Việt để tập nói

AI chuẩn bị việc nhưng không có quyền tự thực thi. Đề xuất 15 triệu có người nhận và mục đích cố định. Thử thực thi trước duyệt bị backend từ chối. Người duyệt đăng nhập riêng kiểm tra đúng yêu cầu rồi phê duyệt. Requester thực thi sau duyệt; biên nhận giả lập xuất hiện. Không có tiền thật được chuyển.

## Chuẩn bị quay

1. Dùng hai browser profile/session thật khi ghép Tide; hai tab rehearsal chỉ để tập UI.
2. Reset dữ liệu, tạo đúng một yêu cầu mới. Không để trạng thái approved từ lần trước.
3. Test mic 10 giây; đóng thông báo và tab có thông tin cá nhân.
4. Quay màn hình bằng công cụ sẵn có, chọn 1080p nếu phù hợp; không quay env/token.
5. Hoàn tất chuỗi thật. Không dựng cảnh thành công thay cho lỗi thật.
6. Xuất `demo/final-demo.mp4`, 120 giây hoặc ngắn hơn, dưới 100 MB. Khuyến nghị khoảng 115–118 giây để có khoảng đệm.
7. Xem lại toàn bộ: đọc được số tiền, lỗi deny, danh tính approver, receipt; có tiếng, không secret.

Nếu ceremony mất lâu hơn, rút phần mở đầu và các khoảng im lặng, không thay ceremony bằng mock. Dùng tên sản phẩm, người nhận và số tiền nhất quán với README.
