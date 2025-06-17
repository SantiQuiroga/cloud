'use client';

import { ReactNode } from 'react';
import { AppLayout } from '@/layouts/AppLayout';

interface AuthPageTemplateProps {
  children: ReactNode;
}

export function AuthPageTemplate({ children }: AuthPageTemplateProps) {
  return (
    <AppLayout showHeader={true}>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </AppLayout>
  );
}
