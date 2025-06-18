'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/Tabs';
import { Button } from '@/components/atoms/Button';
import { PhotoUploadField } from '@/components/molecules/PhotoUploadField';
import { PhotoGallery } from '@/components/molecules/PhotoGallery';
import { MessageDisplay } from '@/components/molecules/MessageDisplay';
import { usePhotoUpload } from '@/features/photo-upload/hooks/usePhotoUpload';
import { PHOTO_UPLOAD_CONFIG } from '@/shared/constants';
import { Upload, Images } from 'lucide-react';
import type { PhotoUploadOptions } from '@/features/photo-upload/types';

interface PhotoUploadManagerProps {
  user: User;
}

export function PhotoUploadManager({ user }: PhotoUploadManagerProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadOptions] = useState<PhotoUploadOptions>({
    maxSizeBytes: PHOTO_UPLOAD_CONFIG.MAX_FILE_SIZE,
    allowedTypes: [...PHOTO_UPLOAD_CONFIG.ALLOWED_TYPES],
  });
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  const {
    photos,
    loading,
    uploading,
    uploadProgress,
    error,
    loadUserPhotos,
    uploadMultiplePhotos,
    deletePhoto,
    updatePhotoMetadata,
    validateFile
  } = usePhotoUpload(user);

  // Load user photos on component mount
  useEffect(() => {
    loadUserPhotos();
  }, [loadUserPhotos]);

  // Handle file selection
  const handleFilesSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate each file
    fileArray.forEach((file) => {
      const validation = validateFile(file, uploadOptions);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      setMessage(`Algunos archivos no son válidos: ${errors.join(', ')}`);
      setMessageType('error');
    } else {
      setMessage('');
    }

    setSelectedFiles(validFiles);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const results = await uploadMultiplePhotos(selectedFiles, uploadOptions);

      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;

      if (successCount > 0 && errorCount === 0) {
        setMessage(`¡${successCount} imagen${successCount > 1 ? 'es' : ''} subida${successCount > 1 ? 's' : ''} exitosamente!`);
        setMessageType('success');
        setSelectedFiles([]);
      } else if (successCount > 0 && errorCount > 0) {
        setMessage(`${successCount} imágenes subidas correctamente, ${errorCount} fallaron.`);
        setMessageType('info');
        setSelectedFiles([]);
      } else {
        setMessage('Error al subir las imágenes. Inténtalo de nuevo.');
        setMessageType('error');
      }
    } catch {
      setMessage('Error inesperado al subir las imágenes.');
      setMessageType('error');
    }
  };

  // Handle photo deletion
  const handleDeletePhoto = async (photoId: string, storageRefPath: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      const success = await deletePhoto(photoId, storageRefPath);
      if (success) {
        setMessage('Imagen eliminada correctamente.');
        setMessageType('success');
      } else {
        setMessage('Error al eliminar la imagen.');
        setMessageType('error');
      }
    }
  };

  // Handle photo metadata update
  const handleEditPhoto = async (photoId: string, metadata: { alt?: string; caption?: string }) => {
    const success = await updatePhotoMetadata(photoId, metadata);
    if (success) {
      setMessage('Información de la imagen actualizada correctamente.');
      setMessageType('success');
    } else {
      setMessage('Error al actualizar la información de la imagen.');
      setMessageType('error');
    }
  };

  // Clear selected files
  const handleClearFiles = () => {
    setSelectedFiles([]);
    setMessage('');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Images className="h-5 w-5" />
            Gestión de Imágenes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <strong>Tamaño máximo:</strong> {formatFileSize(PHOTO_UPLOAD_CONFIG.MAX_FILE_SIZE)}
            </div>
            <div>
              <strong>Tipos permitidos:</strong> JPG, PNG, WebP, GIF
            </div>
            <div>
              <strong>Total de imágenes:</strong> {photos.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Subir Imágenes
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <Images className="h-4 w-4" />
            Mi Galería ({photos.length})
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subir nuevas imágenes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <PhotoUploadField
                label="Seleccionar imágenes"
                multiple={true}
                loading={uploading}
                progress={uploadProgress}
                error={error || undefined}
                maxFiles={PHOTO_UPLOAD_CONFIG.MAX_FILES_PER_UPLOAD}
                onFilesSelect={handleFilesSelect}
                onClear={handleClearFiles}
                showProgress={true}
              />

              {selectedFiles.length > 0 && (
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-sm text-gray-600">
                    {selectedFiles.length} archivo{selectedFiles.length > 1 ? 's' : ''} seleccionado{selectedFiles.length > 1 ? 's' : ''}
                  </span>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || selectedFiles.length === 0}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Subiendo...' : 'Subir Imágenes'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages */}
          {message && (
            <MessageDisplay message={message} type={messageType} />
          )}
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-6">
          <PhotoGallery
            photos={photos}
            loading={loading}
            onDeletePhoto={handleDeletePhoto}
            onEditPhoto={handleEditPhoto}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
