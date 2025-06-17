'use client';

import { ReactNode } from 'react';
import { APP_CONFIG } from '@/shared/constants';

interface AppLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export function AppLayout({ children, showHeader = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && (
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center py-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {APP_CONFIG.defaultTitle}
              </h1>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
