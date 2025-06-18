'use client';

import { useState, useCallback } from 'react';
import { User } from 'firebase/auth';
import { PhotoUploadService } from '../services/photoUploadService';
import type { PhotoUpload, PhotoUploadOptions, UploadProgress, PhotoUploadResult } from '../types';

export const usePhotoUpload = (user: User | null) => {
  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUserPhotos = useCallback(async () => {
    if (!user?.uid) {
      setPhotos([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userPhotos = await PhotoUploadService.getUserPhotos(user.uid);
      setPhotos(userPhotos);
    } catch (err) {
      setError('Error al cargar las imágenes');
      console.error('Error loading photos:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const uploadPhoto = useCallback(async (
    file: File,
    options: PhotoUploadOptions = {}
  ): Promise<PhotoUploadResult> => {
    if (!user?.uid) {
      const result: PhotoUploadResult = {
        success: false,
        error: 'Usuario no autenticado'
      };
      setError(result.error || 'Usuario no autenticado');
      return result;
    }

    try {
      setUploading(true);
      setError(null);
      setUploadProgress(null);

      const photo = await PhotoUploadService.uploadPhoto(
        file,
        user.uid,
        options,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      // Add to local state
      setPhotos(prev => [photo, ...prev]);

      const result: PhotoUploadResult = {
        success: true,
        photo
      };

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al subir la imagen';
      setError(errorMessage);

      const result: PhotoUploadResult = {
        success: false,
        error: errorMessage
      };

      return result;
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  }, [user?.uid]);

  const uploadMultiplePhotos = useCallback(async (
    files: File[],
    options: PhotoUploadOptions = {}
  ): Promise<PhotoUploadResult[]> => {
    const results: PhotoUploadResult[] = [];

    for (const file of files) {
      const result = await uploadPhoto(file, options);
      results.push(result);
    }

    return results;
  }, [uploadPhoto]);

  const deletePhoto = useCallback(async (photoId: string, storageRefPath: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await PhotoUploadService.deletePhoto(photoId, storageRefPath);

      // Remove from local state
      setPhotos(prev => prev.filter(photo => photo.id !== photoId));

      return true;
    } catch (err) {
      setError('Error al eliminar la imagen');
      console.error('Error deleting photo:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePhotoMetadata = useCallback(async (
    photoId: string,
    metadata: { alt?: string; caption?: string }
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      await PhotoUploadService.updatePhotoMetadata(photoId, metadata);

      // Update local state
      setPhotos(prev => prev.map(photo =>
        photo.id === photoId
          ? { ...photo, metadata: { ...photo.metadata, ...metadata } }
          : photo
      ));

      return true;
    } catch (err) {
      setError('Error al actualizar la imagen');
      console.error('Error updating photo metadata:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const validateFile = useCallback((file: File, options: PhotoUploadOptions = {}) => {
    return PhotoUploadService.validateFile(file, options);
  }, []);

  return {
    photos,
    loading,
    uploading,
    uploadProgress,
    error,
    loadUserPhotos,
    uploadPhoto,
    uploadMultiplePhotos,
    deletePhoto,
    updatePhotoMetadata,
    validateFile
  };
};
