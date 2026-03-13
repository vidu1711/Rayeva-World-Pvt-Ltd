'use client';

import Link from 'next/link';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">Orders can be created by converting a proposal or via API.</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-card">
        <p className="text-gray-500">Orders are linked to impact reports. Create a proposal first, then generate an impact report from the Impact Reports page.</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/proposals" className="text-primary hover:underline">View proposals</Link>
          <Link href="/impact-reports" className="text-primary hover:underline">Impact reports</Link>
        </div>
      </div>
    </div>
  );
}
