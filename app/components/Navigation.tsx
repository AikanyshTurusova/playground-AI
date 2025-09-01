'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function Navigation() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return null;
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/notes', label: 'Notes', icon: '📝' },
    { href: '/ideas', label: 'Ideas', icon: '💡' },
    { href: '/library', label: 'Library', icon: '📚' },
    { href: '/videos', label: 'Videos', icon: '🎥' },
    { href: '/ai-tools', label: 'AI Tools Hub', icon: '🚀' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Playground
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user.firstName || user.emailAddresses[0]?.emailAddress}
            </span>
            <Link
              href="/"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
