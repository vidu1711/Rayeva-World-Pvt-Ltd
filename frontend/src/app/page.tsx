'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDashboardStats, type DashboardStats } from '@/lib/api';

function StatCard({ title, value, sub }: { title: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        Unable to load dashboard. Is the backend running on port 3000? {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of sustainability impact and activity</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Proposals created" value={stats.proposalCount} />
        <StatCard title="Impact reports" value={stats.impactReportCount} />
        <StatCard title="Plastic saved" value={`${stats.totalPlasticSavedKg} kg`} />
        <StatCard title="Carbon avoided" value={`${stats.totalCarbonAvoidedKg} kg`} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-card">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Recent proposals</h2>
          <p className="text-sm text-gray-500">Latest generated proposals</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-5 py-3 text-left font-medium text-gray-600">Event / Company</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Budget</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Goal</th>
                <th className="px-5 py-3 text-right font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentProposals.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                    No proposals yet. <Link href="/generate-proposal" className="text-primary hover:underline">Generate one</Link>.
                  </td>
                </tr>
              ) : (
                stats.recentProposals.map((p) => (
                  <tr key={p._id} className="border-b border-gray-100">
                    <td className="px-5 py-3 text-gray-900">{p.event_type}</td>
                    <td className="px-5 py-3 text-gray-600">${p.budget}</td>
                    <td className="px-5 py-3 text-gray-600">{p.sustainability_goal}</td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/proposals?id=${p._id}`} className="text-primary hover:underline">View</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-card">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Recent impact reports</h2>
          <p className="text-sm text-gray-500">Latest impact reports</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-5 py-3 text-left font-medium text-gray-600">Plastic saved</th>
                <th className="px-5 py-3 text-left font-medium text-gray-600">Carbon avoided</th>
                <th className="px-5 py-3 text-right font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentImpactReports.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-gray-500">
                    No impact reports yet. Generate one from the Impact Reports page.
                  </td>
                </tr>
              ) : (
                stats.recentImpactReports.map((r) => (
                  <tr key={r._id} className="border-b border-gray-100">
                    <td className="px-5 py-3 text-gray-900">{r.plastic_saved}</td>
                    <td className="px-5 py-3 text-gray-600">{r.carbon_avoided}</td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/impact-reports/${r._id}`} className="text-primary hover:underline">View</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
