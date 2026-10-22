export const metadata = {
  title: 'Approver Workspace · Action Guard',
  description: 'TideCloak Gatekeeper approver workspace',
};

export default function ApproverPage() {
  return (
    <main style={{ width: '100%', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      <iframe
        title="Action Guard Approver Workspace"
        src="/action-guard/index.html?role=approver"
        style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
      />
    </main>
  );
}
