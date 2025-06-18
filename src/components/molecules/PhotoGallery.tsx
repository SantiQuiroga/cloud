'use client';

import { useState } from 'react';
import { ImagePreview } from '@/components/atoms/ImagePreview';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { MessageDisplay } from '@/components/molecules/MessageDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Grid, List, Search } from 'lucide-react';
import type { PhotoUpload } from '@/features/photo-upload/types';

interface PhotoGalleryProps {
  photos: PhotoUpload[];
  loading?: boolean;
  onDeletePhoto?: (photoId: string, storageRefPath: string) => void;
  onEditPhoto?: (photoId: string, metadata: { alt?: string; caption?: string }) => void;
  className?: string;
  showSearch?: boolean;
  showViewToggle?: boolean;
}

export function PhotoGallery({
  photos,
  loading = false,
  onDeletePhoto,
  onEditPhoto,
  className,
  showSearch = true,
  showViewToggle = true
}: PhotoGalleryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPhoto, setEditingPhoto] = useState<PhotoUpload | null>(null);
  const [editData, setEditData] = useState({ alt: '', caption: '' });

  // Filter photos based on search term
  const filteredPhotos = photos.filter(photo =>
    photo.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.metadata?.alt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.metadata?.caption?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStart = (photo: PhotoUpload) => {
    setEditingPhoto(photo);
    setEditData({
      alt: photo.metadata?.alt || '',
      caption: photo.metadata?.caption || ''
    });
  };

  const handleEditSave = () => {
    if (editingPhoto && onEditPhoto) {
      onEditPhoto(editingPhoto.id!, editData);
      setEditingPhoto(null);
      setEditData({ alt: '', caption: '' });
    }
  };

  const handleEditCancel = () => {
    setEditingPhoto(null);
    setEditData({ alt: '', caption: '' });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center text-gray-500">
          <div className="text-4xl mb-4">📷</div>
          <p>No tienes imágenes aún.</p>
          <p className="text-sm mt-2">¡Sube tu primera imagen!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        {showSearch && (
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar imágenes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* View Toggle */}
        {showViewToggle && (
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Mostrando {filteredPhotos.length} de {photos.length} imágenes
      </div>

      {/* Gallery */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredPhotos.map((photo) => (
            <ImagePreview
              key={photo.id}
              src={photo.downloadURL}
              alt={photo.metadata?.alt || photo.originalName}
              onDelete={() => onDeletePhoto?.(photo.id!, photo.storageRef)}
              onEdit={() => handleEditStart(photo)}
              size="md"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <ImagePreview
                    src={photo.downloadURL}
                    alt={photo.metadata?.alt || photo.originalName}
                    size="sm"
                    showActions={false}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{photo.originalName}</h3>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(photo.size)} • {photo.contentType}
                    </p>
                    <p className="text-sm text-gray-500">
                      {photo.uploadedAt.toLocaleDateString()}
                    </p>
                    {photo.metadata?.alt && (
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Alt:</strong> {photo.metadata.alt}
                      </p>
                    )}
                    {photo.metadata?.caption && (
                      <p className="text-sm text-gray-600">
                        <strong>Descripción:</strong> {photo.metadata.caption}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditStart(photo)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeletePhoto?.(photo.id!, photo.storageRef)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Editar imagen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="alt">Texto alternativo</Label>
                <Input
                  id="alt"
                  value={editData.alt}
                  onChange={(e) => setEditData(prev => ({ ...prev, alt: e.target.value }))}
                  placeholder="Describe la imagen..."
                />
              </div>
              <div>
                <Label htmlFor="caption">Descripción</Label>
                <Input
                  id="caption"
                  value={editData.caption}
                  onChange={(e) => setEditData(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Agrega una descripción..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleEditCancel}>
                  Cancelar
                </Button>
                <Button onClick={handleEditSave}>
                  Guardar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No results */}
      {filteredPhotos.length === 0 && searchTerm && (
        <MessageDisplay
          message={`No se encontraron imágenes que coincidan con "${searchTerm}"`}
          type="info"
        />
      )}
    </div>
  );
}
