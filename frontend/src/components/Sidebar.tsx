'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/', label: 'Dashboard', icon: '📊' },
  { href: '/generate-proposal', label: 'Generate Proposal', icon: '📑' },
  { href: '/proposals', label: 'Proposals', icon: '📋' },
  { href: '/orders', label: 'Orders', icon: '📦' },
  { href: '/impact-reports', label: 'Impact Reports', icon: '🌱' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white py-6">
      <nav className="flex flex-col gap-0.5 px-3">
        {items.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
