'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, ShoppingBag } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-white hover:text-white/80 transition-colors">
            <BarChart3 className="w-6 h-6" />
            <span>PowerBI Shop</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/'
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Store
            </Link>
            <Link
              href="/analyze"
              className={`text-sm font-medium transition-colors ${
                pathname === '/analyze'
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Analyze Data
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}






