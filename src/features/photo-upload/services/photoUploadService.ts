import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot
} from 'firebase/storage';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import type { PhotoUpload, PhotoUploadOptions, UploadProgress } from '../types';

export class PhotoUploadService {
  private static collectionName = 'photoUploads';
  private static storagePath = 'photos';

  static validateFile(file: File, options: PhotoUploadOptions = {}): { valid: boolean; error?: string } {
    const maxSize = options.maxSizeBytes || 5 * 1024 * 1024; // 5MB default
    const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `El archivo es demasiado grande. Máximo ${Math.round(maxSize / (1024 * 1024))}MB permitido.`
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Tipo de archivo no permitido. Solo se permiten: ${allowedTypes.join(', ')}`
      };
    }

    return { valid: true };
  }

  static generateFileName(originalName: string, userId: string): string {
    const timestamp = Date.now();
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
    return `${userId}_${timestamp}_${sanitizedName}${extension}`;
  }

  static async uploadPhoto(
    file: File,
    userId: string,
    options: PhotoUploadOptions = {},
    onProgress?: (progress: UploadProgress) => void
  ): Promise<PhotoUpload> {
    // Validate file
    const validation = this.validateFile(file, options);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Generate unique filename
    const fileName = this.generateFileName(file.name, userId);
    const storageRef = ref(storage, `${this.storagePath}/${fileName}`);

    // Upload file with progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress: UploadProgress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            percentage: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            state: snapshot.state as UploadProgress['state']
          };
          onProgress?.(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          reject(new Error(`Error al subir la imagen: ${error.message}`));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Create PhotoUpload object
            const photoUpload: Omit<PhotoUpload, 'id'> = {
              fileName,
              originalName: file.name,
              downloadURL,
              storageRef: uploadTask.snapshot.ref.fullPath,
              size: file.size,
              contentType: file.type,
              uploadedBy: userId,
              uploadedAt: new Date(),
              metadata: {
                alt: '',
                caption: ''
              }
            };

            // Save to Firestore
            const docRef = await addDoc(collection(db, this.collectionName), {
              ...photoUpload,
              uploadedAt: serverTimestamp()
            });

            resolve({
              id: docRef.id,
              ...photoUpload
            });
          } catch (error) {
            console.error('Error saving photo metadata:', error);
            reject(new Error('Error al guardar los metadatos de la imagen'));
          }
        }
      );
    });
  }

  static async getUserPhotos(userId: string): Promise<PhotoUpload[]> {
    try {
      const photosCollection = collection(db, this.collectionName);
      const q = query(
        photosCollection,
        where('uploadedBy', '==', userId),
        orderBy('uploadedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const photos: PhotoUpload[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        photos.push({
          id: doc.id,
          fileName: data.fileName,
          originalName: data.originalName,
          downloadURL: data.downloadURL,
          storageRef: data.storageRef,
          size: data.size,
          contentType: data.contentType,
          uploadedBy: data.uploadedBy,
          uploadedAt: data.uploadedAt instanceof Timestamp
            ? data.uploadedAt.toDate()
            : new Date(data.uploadedAt),
          metadata: data.metadata || {}
        });
      });

      return photos;
    } catch (error) {
      console.error('Error getting user photos:', error);
      return [];
    }
  }

  static async deletePhoto(photoId: string, storageRefPath: string): Promise<void> {
    try {
      // Delete from Firebase Storage
      const storageRef = ref(storage, storageRefPath);
      await deleteObject(storageRef);

      // Delete from Firestore
      const photoDoc = doc(db, this.collectionName, photoId);
      await deleteDoc(photoDoc);
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw new Error('Error al eliminar la imagen');
    }
  }

  static async updatePhotoMetadata(
    photoId: string,
    metadata: { alt?: string; caption?: string }
  ): Promise<void> {
    try {
      const photoDoc = doc(db, this.collectionName, photoId);
      await updateDoc(photoDoc, {
        'metadata.alt': metadata.alt || '',
        'metadata.caption': metadata.caption || '',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating photo metadata:', error);
      throw new Error('Error al actualizar los metadatos de la imagen');
    }
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
