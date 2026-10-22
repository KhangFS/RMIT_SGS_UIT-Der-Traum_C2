# AGENTS.md

## Scope
Thư mục này chứa toàn bộ mã nguồn của Challenge 2 (AgentGuard - Tích hợp TideCloak cho AI Agent).
Giữ mọi thay đổi trong thư mục `challenge_2/` này.

## Quy ước phát triển
- Ứng dụng xây dựng trên nền tảng Next.js 14 (App Router), TypeScript và TailwindCSS.
- Cấu trúc API nằm trong `app/api/action-requests/` và `app/api/me/`.
- Quản lý trạng thái giả lập qua `app/api/_store.ts`.
- Mọi thao tác thực thi nhạy cảm bắt buộc phải kiểm tra `tideApprovalSignature` trước khi xử lý.

## Lệnh kiểm tra và khởi chạy
- Cài đặt dependency: `npm install`
- Khởi chạy development server: `npm run dev`
- Build kiểm tra: `npm run build`
