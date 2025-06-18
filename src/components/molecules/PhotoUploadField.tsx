'use client';

import { useState } from 'react';
import { FileUploadInput } from '@/components/atoms/FileUploadInput';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { MessageDisplay } from '@/components/molecules/MessageDisplay';
import { Label } from '@/components/atoms/Label';
import { Button } from '@/components/atoms/Button';
import { X } from 'lucide-react';
import type { UploadProgress } from '@/features/photo-upload/types';

interface PhotoUploadFieldProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  progress?: UploadProgress | null;
  error?: string;
  maxFiles?: number;
  onFilesSelect: (files: FileList | null) => void;
  onClear?: () => void;
  showProgress?: boolean;
  required?: boolean;
  className?: string;
}

export function PhotoUploadField({
  label = 'Seleccionar imágenes',
  accept = 'image/*',
  multiple = false,
  disabled = false,
  loading = false,
  progress = null,
  error,
  maxFiles = 10,
  onFilesSelect,
  onClear,
  showProgress = true,
  required = false,
  className
}: PhotoUploadFieldProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    // Limit number of files
    const limitedFiles = fileArray.slice(0, maxFiles);

    setSelectedFiles(limitedFiles);
    onFilesSelect(files);
  };

  const handleClear = () => {
    setSelectedFiles([]);
    onClear?.();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label */}
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {/* Upload Input */}
      <FileUploadInput
        accept={accept}
        multiple={multiple}
        disabled={disabled || loading}
        onChange={handleFilesSelect}
      />

      {/* Selected Files Display */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Archivos seleccionados ({selectedFiles.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={loading}
            >
              <X className="h-4 w-4" />
              Limpiar
            </Button>
          </div>

          <div className="space-y-1 max-h-32 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
              >
                <span className="truncate flex-1">{file.name}</span>
                <span className="text-gray-500 ml-2">
                  {formatFileSize(file.size)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {showProgress && progress && (
        <ProgressBar
          value={progress.percentage}
          variant={progress.state === 'error' ? 'error' : 'default'}
          showValue={true}
        />
      )}

      {/* Error Message */}
      {error && (
        <MessageDisplay message={error} type="error" />
      )}

      {/* Upload Status */}
      {loading && (
        <MessageDisplay
          message="Subiendo imágenes..."
          type="info"
        />
      )}
    </div>
  );
}
