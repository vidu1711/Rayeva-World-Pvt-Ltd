'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getImpactReports, generateImpactReport, type ImpactReport } from '@/lib/api';

export default function ImpactReportsPage() {
  const [list, setList] = useState<ImpactReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [product, setProduct] = useState('bamboo toothbrush');
  const [quantity, setQuantity] = useState('100');
  const [material, setMaterial] = useState('bamboo');

  const load = () => getImpactReports().then(setList).catch((e) => setError(e.message));

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setGenError(null);
    setGenLoading(true);
    try {
      await generateImpactReport({
        order_items: [{ product: product.trim(), quantity: Number(quantity) || 0, material: material.trim() || undefined }],
      });
      setShowForm(false);
      setProduct('bamboo toothbrush');
      setQuantity('100');
      setMaterial('bamboo');
      await load();
    } catch (e) {
      setGenError(e instanceof Error ? e.message : 'Failed to generate report');
    } finally {
      setGenLoading(false);
    }
  }

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
          <h1 className="text-2xl font-semibold text-gray-900">Impact reports</h1>
          <p className="mt-1 text-sm text-gray-500">Sustainability impact per report</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-primary px-4 py-2.5 font-medium text-white shadow-card hover:bg-primary/90"
        >
          {showForm ? 'Cancel' : 'Generate impact report'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleGenerate} className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
          <h2 className="font-semibold text-gray-900">New impact report</h2>
          <p className="mt-1 text-sm text-gray-500">Add one order item. Plastic saved = quantity × 10g, Carbon avoided = quantity × 25g.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Material</label>
              <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" placeholder="e.g. bamboo" />
            </div>
          </div>
          {genError && <p className="mt-3 text-sm text-red-600">{genError}</p>}
          <button type="submit" disabled={genLoading} className="mt-4 rounded-lg bg-primary px-4 py-2.5 font-medium text-white hover:bg-primary/90 disabled:opacity-60">
            {genLoading ? 'Generating…' : 'Generate report'}
          </button>
        </form>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">{error}</div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              <th className="px-5 py-3 text-left font-medium text-gray-600">Plastic saved</th>
              <th className="px-5 py-3 text-left font-medium text-gray-600">Carbon avoided</th>
              <th className="px-5 py-3 text-left font-medium text-gray-600">Local sourcing</th>
              <th className="px-5 py-3 text-right font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-gray-500">
                  No impact reports yet. Create one by calling the impact API with order items (e.g. from the old single-page tool or API).
                </td>
              </tr>
            ) : (
              list.map((r) => (
                <tr key={r._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-medium text-gray-900">{r.plastic_saved}</td>
                  <td className="px-5 py-3 text-gray-600">{r.carbon_avoided}</td>
                  <td className="px-5 py-3 text-gray-600">{r.local_sourcing_impact || '—'}</td>
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
  );
}
