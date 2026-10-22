/** Input: không. Output: UI B cùng origin; auth và API do ứng dụng Next.js của A kiểm soát. */
export default function ActionGuardPage() {
  return <iframe title="Action Guard approval workspace" src="/action-guard/index.html" style={{ width: '100%', height: '100dvh', border: 0, display: 'block' }} />;
}
