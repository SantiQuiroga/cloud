'use client';

import { ReactNode } from 'react';
import { AppLayout } from '@/layouts/AppLayout';

interface ProfilePageTemplateProps {
  children: ReactNode;
}

export function ProfilePageTemplate({ children }: ProfilePageTemplateProps) {
  return (
    <AppLayout showHeader={true}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {children}
        </div>
      </div>
    </AppLayout>
  );
}
