[![Built with TideCloak](https://tide.org/badges/built-with-tidecloak.svg)](https://tide.org/tidecloak?utm_source=github&utm_medium=readme&utm_campaign=unlocked)

## Project overview

AgentGuard là lớp kiểm soát thực thi cho AI Agent, đảm bảo hành động nhạy cảm chỉ hoàn tất khi có phê duyệt đồng thuận qua TideCloak mà không lưu master key tập trung.

Built with [TideCloak](https://tide.org/tidecloak?utm_source=github&utm_medium=readme&utm_campaign=unlocked).

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

---

## Hướng dẫn cài đặt và chạy ứng dụng

### 1. Khởi chạy TideCloak Container
Chạy container TideCloak ở chế độ development trên cổng 8080:

```bash
docker run -d --name tidecloak -p 8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=password \
  docker.io/tideorg/tidecloak-dev:latest
```

### 2. Cài đặt và khởi chạy Next.js
Yêu cầu Node.js v18 trở lên:

```bash
npm install
npm run dev
```

Ứng dụng chạy tại địa chỉ: `http://localhost:3000`.

* **Trang chủ điều hướng:** `http://localhost:3000/`
* **Workspace Requester (AI Agent):** `http://localhost:3000/requester`
* **Workspace Approver (TideCloak Gatekeeper):** `http://localhost:3000/approver`

---

## Tài khoản và Kịch bản Demo 2 phút

### 1. Tài khoản thử nghiệm
* **Requester (Người tạo lệnh):** `requester-demo` / Mật khẩu: `demo@123` (Role: `requester`).
* **Approver (Người phê duyệt):** `approver-demo` / Mật khẩu: `demo@123` (Role: `approver`).

### 2. Kịch bản thao tác trong video (chia 2 tab trình duyệt song song)
1. **Bước 1 (Mở tab `http://localhost:3000/requester`):** AI Agent chuẩn bị yêu cầu thanh toán hóa đơn giả lập 15.000.000 VND (vượt hạn mức 10.000.000 VND). Bấm "Execute" $\rightarrow$ Hệ thống lập tức trả về lỗi **403 Forbidden** do chưa có chữ ký phê duyệt từ TideCloak.
2. **Bước 2 (Mở tab `http://localhost:3000/approver`):** Người duyệt xem chi tiết nhà cung cấp, hóa đơn và lý do. Bấm "Approve" $\rightarrow$ Thẩm quyền TideCloak hình thành, cấp mã xác thực phê duyệt.
3. **Bước 3 (Quay lại tab `requester`):** Bấm "Execute" $\rightarrow$ Hệ thống xác minh chữ ký hợp lệ, trả về mã **200 OK** và hiển thị biên nhận thanh toán giả lập.
4. **Bước 4 (Reset):** Bấm nút "Reset rehearsal" để làm sạch dữ liệu phục vụ lượt kiểm thử tiếp theo.
