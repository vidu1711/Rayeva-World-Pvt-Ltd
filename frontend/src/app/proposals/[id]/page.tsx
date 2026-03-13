'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProposals, type Proposal } from '@/lib/api';

export default function ProposalDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProposals()
      .then((list) => {
        const p = list.find((x) => x._id === id);
        setProposal(p ?? null);
        if (!p) setError('Proposal not found');
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        {error || 'Proposal not found.'} <Link href="/proposals" className="text-primary hover:underline">Back to proposals</Link>
      </div>
    );
  }

  const gp = proposal.generated_proposal;
  const mix = gp?.suggested_product_mix || [];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/proposals" className="text-sm text-gray-500 hover:text-primary">← Proposals</Link>
          <h1 className="mt-1 text-2xl font-semibold text-gray-900">{proposal.event_type}</h1>
          <p className="text-sm text-gray-500">Budget: ${proposal.budget} · {proposal.sustainability_goal}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
        <h2 className="font-semibold text-gray-900">Recommended products</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-2 font-medium text-gray-600">Product</th>
                <th className="pb-2 font-medium text-gray-600">Quantity</th>
                <th className="pb-2 font-medium text-gray-600">Cost</th>
              </tr>
            </thead>
            <tbody>
              {mix.map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 text-gray-900">{item.product_name}</td>
                  <td className="py-2 text-gray-600">{item.quantity}</td>
                  <td className="py-2 text-gray-600">{item.estimated_cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {gp?.budget_allocation && Object.keys(gp.budget_allocation).length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
          <h2 className="font-semibold text-gray-900">Budget allocation</h2>
          <ul className="mt-3 space-y-1 text-sm text-gray-600">
            {Object.entries(gp.budget_allocation).map(([k, v]) => (
              <li key={k}>{k}: {String(v)}</li>
            ))}
          </ul>
        </div>
      )}

      {gp?.impact_summary && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
          <h2 className="font-semibold text-gray-900">Impact summary</h2>
          <p className="mt-3 text-gray-600">{gp.impact_summary}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Link href="/proposals" className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50">
          Back to proposals
        </Link>
        <Link href="/generate-proposal" className="rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-primary/90">
          New proposal
        </Link>
      </div>
    </div>
  );
}
