'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthPage } from '@/features/auth/Components';
import { ProfilePage } from '@/features/profile/Components';
import { AppLayout } from '@/layouts/AppLayout';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Cargando...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <>
      {user ? <ProfilePage user={user} /> : <AuthPage />}
    </>
  );
}
