'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-card">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl font-semibold text-primary">EcoProcure</span>
        <span className="text-sm text-gray-500">AI</span>
      </Link>
      <nav className="hidden items-center gap-6 md:flex">
        <Link href="/" className="text-sm text-gray-600 hover:text-primary">Dashboard</Link>
        <Link href="/generate-proposal" className="text-sm text-gray-600 hover:text-primary">Generate Proposal</Link>
        <Link href="/proposals" className="text-sm text-gray-600 hover:text-primary">Proposals</Link>
        <Link href="/orders" className="text-sm text-gray-600 hover:text-primary">Orders</Link>
        <Link href="/impact-reports" className="text-sm text-gray-600 hover:text-primary">Impact Reports</Link>
      </nav>
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary-light/30 flex items-center justify-center text-primary text-sm font-medium">A</div>
        <span className="text-sm text-gray-600">Admin</span>
      </div>
    </header>
  );
}
