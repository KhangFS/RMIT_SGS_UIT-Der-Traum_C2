'use client';

import Link from 'next/link';
import { ShieldCheck, UserCheck, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  async function handleReset() {
    setResetting(true);
    try {
      const res = await fetch('/api/dev/reset', { method: 'POST' });
      const data = await res.json();
      setResetMessage(data.message || 'Đã reset dữ liệu thành công.');
    } catch {
      setResetMessage('Lỗi khi gọi reset API.');
    } finally {
      setResetting(false);
      setTimeout(() => setResetMessage(null), 4000);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_40%),linear-gradient(to_bottom,_#020817,_#0f172a)] px-4 py-12 text-slate-100 flex flex-col justify-between">
      <div className="mx-auto max-w-4xl w-full">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-800 bg-cyan-950/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-3">
            Challenge 2: Tide UNLOCKED · RMIT Hackathon 2026
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            AgentGuard: AI Agent Action Guard
          </h1>
          <p className="mt-3 text-base text-slate-300 max-w-2xl mx-auto">
            Phân tách quyền tạo đề xuất của AI Agent và thẩm quyền thực thi nhạy cảm qua cơ chế phê duyệt TideCloak Emergent Authority.
          </p>
        </header>

        {/* 2 Independent Route Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Requester */}
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-cyan-500/10 p-2.5 text-cyan-400 border border-cyan-500/20">
                  <UserCheck className="h-6 w-6" />
                </span>
                <span className="text-xs font-mono font-medium text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  /requester
                </span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">Requester Workspace</h2>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Dành cho AI Agent và người đề xuất thanh toán. Cho phép chuẩn bị yêu cầu thanh toán giả lập và thử bấm thực thi để chứng minh hành động bị khóa (HTTP 403) khi chưa có phê duyệt.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800">
              <Link
                href="/requester"
                className="flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-cyan-500 transition"
              >
                Mở Requester Workspace <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Approver */}
          <div className="rounded-2xl border border-violet-500/30 bg-slate-900/90 p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-violet-500/10 p-2.5 text-violet-400 border border-violet-500/20">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <span className="text-xs font-mono font-medium text-violet-300 bg-violet-950 px-2 py-0.5 rounded border border-violet-800">
                  /approver
                </span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">Approver Workspace</h2>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Dành cho người kiểm duyệt có thẩm quyền qua TideCloak. Cho phép xem xét khoản chi vượt hạn mức, ký duyệt để cấp chữ ký số TideCloak hoặc từ chối hành động.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800">
              <Link
                href="/approver"
                target="_blank"
                className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-violet-500 transition"
              >
                Mở Approver Workspace (Tab mới) <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Utility / Reset & TideCloak info */}
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span>TideCloak Identity Engine:</span>
            <a
              href="http://localhost:8080"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
            >
              http://localhost:8080 <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              disabled={resetting}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-medium text-slate-200 hover:border-slate-600 transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${resetting ? 'animate-spin' : ''}`} />
              Reset dữ liệu Rehearsal
            </button>
          </div>
        </div>

        {resetMessage && (
          <div className="mt-3 rounded-lg bg-emerald-950/80 border border-emerald-800 p-2.5 text-center text-xs text-emerald-300 font-medium">
            {resetMessage}
          </div>
        )}
      </div>

      <footer className="mt-12 text-center text-xs text-slate-500">
        RMIT GenAI & Cybersecurity Hackathon 2026 · Challenge 2 Submission Prototype
      </footer>
    </main>
  );
}
