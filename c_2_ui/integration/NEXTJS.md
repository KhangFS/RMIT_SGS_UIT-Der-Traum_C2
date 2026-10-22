# Ghép giao diện B vào Next.js của A

Không thay repo A hoặc cấu hình TideCloak. Gói B dùng ES modules/CSS thuần, không thêm framework hoặc dependency vào repo.

1. Copy nội dung `public/` của B vào `public/action-guard/` trong repo A.
2. Giữ `apiBase: '/api'` nếu routes của A dùng contract; adapter dùng API cùng origin.
3. A tích hợp flow đăng nhập và phê duyệt thật trong `api.js`, cấu hình `loginUrl` theo route thực tế. Không chép `server.mjs`/`domain.mjs` vào routes thật.
4. Copy `page.tsx` vào `app/guard/page.tsx`. Có thể đặt sau auth middleware/layout hiện tại.
5. Kiểm thử hai session thật trước khi đổi config sang `live`; ở live không dùng query role làm phân quyền.
6. Mở `/guard`. Nếu muốn render trực tiếp thay iframe, dùng `/action-guard/index.html`; cùng origin và cookie vẫn cần được A kiểm soát.

Wrapper iframe là lựa chọn tích hợp ít phụ thuộc, không phải trang React viết lại toàn bộ. Nếu CSP của A hạn chế iframe, dùng đường dẫn trực tiếp hoặc port UI sang components theo conventions của repo A. Không nới CSP chỉ để che lỗi tích hợp.
