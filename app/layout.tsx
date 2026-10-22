import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AgentGuard',
  description: 'AI Agent Action Guard powered by TideCloak Emergent Authority',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
