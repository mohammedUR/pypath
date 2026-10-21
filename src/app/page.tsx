'use client';

import { useEffect } from 'react';
import nextDynamic from 'next/dynamic';
import { AppShell } from '@/components/shell/AppShell';
import { useRouter, useRouterSync } from '@/lib/router';
import { useManifestStore } from '@/lib/content/registry';

/**
 * R-ARC-07 performance budget: initial JS ≤ 200 KB gzip. The shell stays eager
 * so nav paints immediately; every view is a lazy chunk loaded on first visit
 * (LessonView pulls the editor/runner/dnd-kit only when a lesson opens).
 * Fallback: the skeleton-shaped splash below keeps CLS at zero.
 */
function ViewFallback() {
  // Mirrors the dashboard's real structure (the initial view) so the lazy-swap
  // causes no layout shift (R-ARC-07 CLS ≤ 0.1). In-app navigations are
  // input-triggered and excluded from CLS anyway.
  return (
    <div className="flex animate-pulse flex-col gap-6" aria-hidden="true">
      <header>
        <div className="h-9 w-64 rounded bg-muted" />
        <div className="mt-2 h-4 w-44 rounded bg-muted" />
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 md:col-span-2">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="mt-4 h-6 w-56 rounded bg-muted" />
          <div className="mt-2 h-4 w-full max-w-md rounded bg-muted" />
          <div className="mt-6 h-12 w-40 rounded-2xl bg-muted" />
        </div>
        <div className="rounded-xl border bg-card p-6">
          <div className="h-16 w-16 rounded-full bg-muted" />
          <div className="mt-4 h-4 w-24 rounded bg-muted" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-28 rounded-xl border bg-card p-6" />
        <div className="h-28 rounded-xl border bg-card p-6" />
      </div>
      <div className="h-52 rounded-xl border bg-card p-6" />
    </div>
  );
}

import { DashboardView } from '@/views/DashboardView'; // eager: the landing view SSRs real content (no CLS swap)
const PathView = nextDynamic(() => import('@/views/PathView'), { loading: ViewFallback });
const LessonView = nextDynamic(() => import('@/views/LessonView'), { loading: ViewFallback });
const CoverageView = nextDynamic(() => import('@/views/CoverageView'), { loading: ViewFallback });
const SourcesView = nextDynamic(() => import('@/views/SourcesView'), { loading: ViewFallback });
const SettingsView = nextDynamic(() => import('@/views/SettingsView'), { loading: ViewFallback });
const ExamView = nextDynamic(() => import('@/views/ExamView'), { loading: ViewFallback });
const CapstoneView = nextDynamic(() => import('@/views/CapstoneView'), { loading: ViewFallback });
const AuthView = nextDynamic(() => import('@/views/AuthView').then((m) => m.AuthView), { loading: ViewFallback });
const AccountView = nextDynamic(() => import('@/views/AccountView').then((m) => m.AccountView), { loading: ViewFallback });

export default function Home() {
  useRouterSync();
  const { view, param } = useRouter();

  useEffect(() => {
    document.title = 'PyPath — بايثون إلى الاحتراف';
  }, []);

  useEffect(() => {
    void useManifestStore.getState().hydrate();
    // Engine is module-singleton + idempotent: probes the session once and
    // wires store→cloud pushes. Safe on every mount (StrictMode double-run).
    void import('@/lib/sync/engine').then((m) => m.startSync());
  }, []);

  return (
    <AppShell>
      {view === 'dashboard' && <DashboardView />}
      {view === 'path' && <PathView />}
      {view === 'lesson' && <LessonView lessonId={param ?? 'py4e.ch1.l1'} />}
      {view === 'coverage' && <CoverageView />}
      {view === 'sources' && <SourcesView />}
      {view === 'settings' && <SettingsView />}
      {view === 'exam' && <ExamView />}
      {view === 'capstone' && <CapstoneView />}
      {view === 'auth' && <AuthView />}
      {view === 'account' && <AccountView />}
    </AppShell>
  );
}
