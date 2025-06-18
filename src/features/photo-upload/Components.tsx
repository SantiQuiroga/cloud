'use client';

import { PhotoUploadManager } from '@/components/organisms/PhotoUploadManager';
import type { User } from 'firebase/auth';

interface PhotoUploadPageProps {
  user: User;
}

export function PhotoUploadPage({ user }: PhotoUploadPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Imágenes</h1>
          <p className="mt-2 text-gray-600">
            Sube, organiza y gestiona tus imágenes de forma fácil y segura.
          </p>
        </div>

        <PhotoUploadManager user={user} />
      </div>
    </div>
  );
}

// Export the main components
export { PhotoUploadManager } from '@/components/organisms/PhotoUploadManager';
export { PhotoGallery } from '@/components/molecules/PhotoGallery';
export { PhotoUploadField } from '@/components/molecules/PhotoUploadField';
