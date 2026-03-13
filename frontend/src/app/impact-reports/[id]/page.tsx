'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getImpactReport, type ImpactReport } from '@/lib/api';

export default function ImpactReportDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [report, setReport] = useState<ImpactReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getImpactReport(id)
      .then(setReport)
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

  if (error || !report) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        {error || 'Report not found.'} <Link href="/impact-reports" className="text-primary hover:underline">Back to impact reports</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link href="/impact-reports" className="text-sm text-gray-500 hover:text-primary">← Impact reports</Link>
        <h1 className="mt-1 text-2xl font-semibold text-gray-900">Order impact report</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-card">
          <p className="text-sm font-medium text-gray-500">Plastic saved</p>
          <p className="mt-1 text-2xl font-semibold text-primary">{report.plastic_saved}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-card">
          <p className="text-sm font-medium text-gray-500">Carbon avoided</p>
          <p className="mt-1 text-2xl font-semibold text-primary">{report.carbon_avoided}</p>
        </div>
      </div>

      {report.local_sourcing_impact && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-card">
          <p className="text-sm font-medium text-gray-500">Local sourcing</p>
          <p className="mt-1 text-gray-900">{report.local_sourcing_impact}</p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
        <h2 className="font-semibold text-gray-900">Impact statement</h2>
        <p className="mt-3 text-gray-600 leading-relaxed">{report.impact_statement}</p>
      </div>

      {report.order_items?.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
          <h2 className="font-semibold text-gray-900">Order items</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            {report.order_items.map((item, i) => (
              <li key={i}>{item.product} × {item.quantity}{item.material ? ` (${item.material})` : ''}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3">
        <Link href="/impact-reports" className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50">
          Back to impact reports
        </Link>
      </div>
    </div>
  );
}
