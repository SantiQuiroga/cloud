export interface PhotoUpload {
  id?: string;
  fileName: string;
  originalName: string;
  downloadURL: string;
  storageRef: string;
  size: number;
  contentType: string;
  uploadedBy: string;
  uploadedAt: Date;
  metadata?: {
    width?: number;
    height?: number;
    alt?: string;
    caption?: string;
  };
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
  state: 'running' | 'paused' | 'success' | 'error';
}

export interface PhotoUploadOptions {
  maxSizeBytes?: number;
  allowedTypes?: string[];
  generateThumbnail?: boolean;
  resizeWidth?: number;
  resizeHeight?: number;
}

export interface PhotoUploadResult {
  success: boolean;
  photo?: PhotoUpload;
  error?: string;
}
