# Hướng dẫn kỹ thuật và kế hoạch triển khai Challenge 2: TideCloak AI Agent Action Guard

Tài liệu đặc tả kiến trúc hệ thống, danh mục API, cấu trúc dữ liệu và kịch bản thực thi thống nhất cho Challenge 2 — UNLOCKED (RMIT Hackathon 2026). Tài liệu dùng làm prompt context cho coding agent trên máy cloud.

---

## 1. Thông tin chung và yêu cầu nộp bài

- **Cuộc thi:** RMIT GenAI & Cybersecurity Hackathon 2026 — Challenge 2 (Tide UNLOCKED).
- **Hạn nộp:** 18:00 (GMT+7) ngày 22/10/2026.
- **Sản phẩm nộp:** Link GitHub repository public chứa:
  1. Mã nguồn prototype chạy được, tích hợp TideCloak.
  2. File `README.md` với phần *Project Overview* trả lời 5 câu hỏi bắt buộc (tổng dưới 300 từ).
  3. Video demo thời lượng không quá 2 phút, định dạng `.mp4`, lưu trực tiếp trong repository, dung lượng dưới 100 MB.
- **Quy tắc đặt tên nhóm:** `<university>_<campus>_<team>_C2`.

---

## 2. Ý tưởng sản phẩm: AI Agent Action Guard

### 2.1. Rào cản niềm tin (Trust Constraint)
- Doanh nghiệp muốn dùng AI Agent để tự động hóa các tác vụ tài chính và dữ liệu (ví dụ: tạo và thực thi lệnh thanh toán hóa đơn).
- Rào cản: Nguy cơ prompt injection khiến AI Agent tự ý thực hiện các lệnh chuyển tiền ngoài phạm vi hoặc vượt hạn mức cho phép. Nếu hệ thống backend chỉ dùng phân quyền thông thường hoặc dựa vào một cờ boolean trong cơ sở dữ liệu, việc kiểm soát quyền thực thi dễ bị bỏ qua.

### 2.2. Vai trò của TideCloak
- Thao tác nhạy cảm (thanh toán vượt hạn mức quy định) chỉ được thực thi khi có bằng chứng phê duyệt được xác thực qua TideCloak.
- Backend không tự động tin cậy trạng thái nội bộ mà bắt buộc phải xác minh chữ ký hoặc token phê duyệt (`tideApprovalSignature`) do người kiểm soát cấp qua TideCloak trước khi thực hiện giao dịch giả lập.

---

## 3. Kiến trúc hệ thống và danh mục API thống nhất

### 3.1. Danh mục API Routes

| Method | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/me` | Trả về thông tin người dùng và vai trò đã xác thực qua TideCloak. |
| `POST` | `/api/action-requests` | Tạo đề xuất hành động (ví dụ: lệnh thanh toán). |
| `GET` | `/api/action-requests` | Lấy danh sách các yêu cầu trong hệ thống. |
| `GET` | `/api/action-requests/:id` | Xem chi tiết trạng thái của một yêu cầu. |
| `POST` | `/api/action-requests/:id/approve` | Xác thực người duyệt qua TideCloak, cấp chữ ký phê duyệt. |
| `POST` | `/api/action-requests/:id/reject` | Từ chối yêu cầu hành động. |
| `POST` | `/api/action-requests/:id/execute` | Thực thi hành động sau khi kiểm tra chữ ký TideCloak. |
| `POST` | `/api/dev/reset` | Xóa dữ liệu tạm trong RAM và nạp lại bản ghi demo mẫu. |

### 3.2. Cấu trúc dữ liệu yêu cầu (`ActionRequest`)

```json
{
  "id": "REQ-DEMO-001",
  "actionType": "PAYMENT",
  "status": "PENDING_APPROVAL",
  "requestedBy": "requester-demo",
  "amountVnd": 15000000,
  "approvalThresholdVnd": 10000000,
  "recipientId": "vendor-demo-001",
  "recipientName": "Demo Office Supplies",
  "invoiceId": "INV-DEMO-001",
  "reason": "Thanh toán hóa đơn thiết bị văn phòng giả lập",
  "executionMode": "SIMULATED",
  "tideApprovalSignature": null,
  "createdAt": "2026-10-22T10:00:00.000Z"
}
```

---

## 4. Đặc tả kỹ thuật cho từng thành phần

### 4.1. Môi trường và tài khoản demo
- **Môi trường chạy:** Next.js (App Router, TypeScript, TailwindCSS), cổng 3000 (`npm run dev`).
- **TideCloak Container:** Chạy trên cổng 8080 (`docker.io/tideorg/tidecloak-dev:latest`).
- **Endpoint đăng nhập OIDC:** `http://localhost:8080/realms/tide-realm/protocol/openid-connect/auth`.
- **Tài khoản người yêu cầu (Requester):** `requester-demo` / mật khẩu: `demo@123` (Role: `requester`).
- **Tài khoản người phê duyệt (Approver):** `approver-demo` / mật khẩu: `demo@123` (Role: `approver`).

### 4.2. Logic phân quyền và kiểm soát tại Backend

1. **`GET /api/me`**:
   ```json
   {
     "id": "usr_approver_01",
     "username": "approver-demo",
     "role": "approver",
     "tideAuthenticated": true
   }
   ```

2. **`POST /api/action-requests`**:
   - Nếu `amountVnd > approvalThresholdVnd` (ví dụ: $15.000.000 > 10.000.000$ VNĐ): Hệ thống đặt `status = "PENDING_APPROVAL"`.
   - Nếu $\le$ hạn mức: Hệ thống cho phép thực thi tự động.

3. **`POST /api/action-requests/:id/approve`**:
   - Chỉ người dùng có vai trò `approver` đã xác thực qua TideCloak mới có quyền gọi.
   - Backend sinh mã xác thực `tideApprovalSignature = "TIDE_SIG_" + hash(...)`, cập nhật `status = "APPROVED"`.

4. **`POST /api/action-requests/:id/execute`**:
   - **Tách rời bước duyệt và thực thi:** Sau khi duyệt, hệ thống yêu cầu gọi execute riêng để thể hiện rõ ràng trên video demo.
   - **Khi chưa được duyệt hoặc thiếu chữ ký:**
     - HTTP Status: `403 Forbidden`
     - Response:
       ```json
       {
         "error": "EXECUTION_DENIED",
         "message": "Từ chối thực thi: Thao tác chưa có phê duyệt hợp lệ từ TideCloak."
       }
       ```
   - **Khi đã có phê duyệt hợp lệ:**
     - HTTP Status: `200 OK`
     - Response:
       ```json
       {
         "status": "SUCCESS",
         "message": "Phê duyệt TideCloak hợp lệ. Giao dịch giả lập đã thực thi.",
         "executedAt": "2026-10-22T10:45:00.000Z"
       }
       ```

5. **`POST /api/dev/reset`**:
   - Xóa bộ nhớ RAM và đặt lại 1 bản ghi `REQ-DEMO-001` ở trạng thái `PENDING_APPROVAL` để sẵn sàng cho lần quay video mới.

---

## 5. Kịch bản Video Demo 2 phút (Khung thời gian chuẩn)

- **0:00 – 0:30 (Đặt vấn đề & Rào cản niềm tin):**
  - Trình bày bài toán: AI Agent tự động tạo lệnh thanh toán tài chính cho doanh nghiệp.
  - Rủi ro: Nguy cơ prompt injection thao túng agent tạo lệnh chuyển tiền vượt hạn mức.
- **0:30 – 1:10 (Thao tác bị từ chối - 403 Forbidden):**
  - Đăng nhập tài khoản `requester-demo`.
  - Nhập prompt: *"Chuyển 15.000.000 VND cho nhà cung cấp thiết bị văn phòng"*.
  - Hệ thống tạo yêu cầu vượt hạn mức 10.000.000 VND, trạng thái `PENDING_APPROVAL`.
  - Nhấn nút "Thực thi ngay" $\rightarrow$ Backend trả về lỗi **403 Forbidden**: Từ chối thực thi vì thiếu chữ ký phê duyệt từ TideCloak.
- **1:10 – 1:45 (Phê duyệt qua TideCloak & Thực thi thành công):**
  - Đăng nhập tài khoản `approver-demo` qua TideCloak.
  - Xem chi tiết yêu cầu `REQ-DEMO-001`.
  - Bấm "Phê duyệt qua TideCloak" $\rightarrow$ Gán chữ ký xác thực vào yêu cầu.
  - Bấm "Thực thi" $\rightarrow$ Backend kiểm tra chữ ký thành công, trả về mã **200 OK**, hoàn tất giao dịch giả lập.
- **1:45 – 2:00 (Tóm tắt giá trị):**
  - Khẳng định: Cơ chế phê duyệt qua TideCloak bảo đảm các lệnh nhạy cảm của AI bắt buộc phải có sự kiểm soát của con người, không thể tự ý vượt rào.

---

## 6. Nội dung bắt buộc trong README.md (< 300 từ)

Nội dung dưới đây được rút gọn còn 284 từ, trả lời đủ 5 câu hỏi trọng tâm theo tiêu chí chấm của ban tổ chức:

```markdown
# AgentGuard: AI Agent Action Guard via TideCloak Emergent Authority

AgentGuard là lớp kiểm soát thực thi cho AI Agent, đảm bảo hành động nhạy cảm chỉ hoàn tất khi có phê duyệt đồng thuận qua TideCloak mà không lưu master key tập trung.

### 1. Vision & Originality
Hệ thống cho phép AI Agent thực hiện tác vụ tài chính và dữ liệu quan trọng mà không trao quyền kiểm soát tuyệt đối cho mô hình hay server. Quyền thực thi chỉ kích hoạt khi có xác nhận độc lập từ nhiều bên qua TideCloak.

### 2. Trust Constraint Insight
Rào cản khi giao quyền cho AI là nguy cơ prompt injection và chiếm quyền server. Hiện nay hệ thống dùng API key tập trung; nếu bị xâm nhập, kẻ tấn công nắm toàn quyền. Khi loại bỏ rào cản này, doanh nghiệp an tâm tự động hóa các tác vụ rủi ro cao.

### 3. Value & Impact
Doanh nghiệp và người dùng tránh được gian lận hoặc sai lệch từ AI. Ví dụ: AI Agent thanh toán không thể chuyển tiền vượt hạn mức nếu thiếu chữ ký số của kế toán trưởng.

### 4. Why TideCloak Matters
TideCloak áp dụng Emergent Authority: quyền thực thi không nằm ở một node hay server. Không quản trị viên hay kẻ tấn công chiếm quyền backend nào có thể tự giải mã hay cấp quyền nếu chưa thỏa mãn chính sách.

### 5. Prototype & Storytelling
Prototype thể hiện hai trạng thái: khi AI nhận prompt tấn công, hành động bị chặn với mã 403; khi người kiểm soát ký duyệt qua TideCloak, thẩm quyền mới được cấp và giao dịch hoàn tất.
```
