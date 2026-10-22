export const metadata = {
  title: 'Requester Workspace · Action Guard',
  description: 'AI Agent Action Guard requester workspace',
};

export default function RequesterPage() {
  return (
    <main style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        title="Action Guard Requester Workspace"
        src="/action-guard/index.html?role=requester"
        style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
      />
    </main>
  );
}
