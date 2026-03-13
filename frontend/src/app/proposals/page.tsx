'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getProposals, type Proposal } from '@/lib/api';

export default function ProposalsPage() {
  const searchParams = useSearchParams();
  const createdId = searchParams.get('created');
  const [list, setList] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProposals()
      .then(setList)
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Proposals</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage generated proposals</p>
        </div>
        <Link
          href="/generate-proposal"
          className="rounded-lg bg-primary px-4 py-2.5 font-medium text-white shadow-card hover:bg-primary/90"
        >
          New proposal
        </Link>
      </div>

      {createdId && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          Proposal created successfully. It appears in the table below.
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              <th className="px-5 py-3 text-left font-medium text-gray-600">Event / Company</th>
              <th className="px-5 py-3 text-left font-medium text-gray-600">Budget</th>
              <th className="px-5 py-3 text-left font-medium text-gray-600">Sustainability goal</th>
              <th className="px-5 py-3 text-right font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-gray-500">
                  No proposals yet. <Link href="/generate-proposal" className="text-primary hover:underline">Generate one</Link>.
                </td>
              </tr>
            ) : (
              list.map((p) => (
                <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-gray-900">{p.event_type}</td>
                  <td className="px-5 py-3 text-gray-600">${p.budget}</td>
                  <td className="px-5 py-3 text-gray-600">{p.sustainability_goal}</td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/proposals/${p._id}`} className="text-primary hover:underline">View proposal</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
