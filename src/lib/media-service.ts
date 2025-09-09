import { apiClient } from './api-client';
import { API_CONFIG, MediaFile, PaginatedResponse } from './api-config';

export class MediaService {
  /**
   * رفع ملف واحد
   */
  async uploadFile(file: File, category?: string, altText?: string): Promise<MediaFile> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (category) {
      formData.append('category', category);
    }
    
    if (altText) {
      formData.append('altText', altText);
    }

    return await apiClient.uploadFile(API_CONFIG.ENDPOINTS.MEDIA.UPLOAD, formData) as MediaFile;
  }

  /**
   * رفع عدة ملفات
   */
  async uploadMultipleFiles(files: File[], category?: string): Promise<MediaFile[]> {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    
    if (category) {
      formData.append('category', category);
    }

    return await apiClient.uploadFile(API_CONFIG.ENDPOINTS.MEDIA.UPLOAD_MULTIPLE, formData) as MediaFile[];
  }

  /**
   * الحصول على جميع الملفات المرفوعة (للإدارة فقط)
   */
  async getAllMediaFiles(params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    search?: string;
    fileType?: string;
  }): Promise<PaginatedResponse<MediaFile>> {
    return await apiClient.get<PaginatedResponse<MediaFile>>(
      API_CONFIG.ENDPOINTS.MEDIA.BASE,
      params
    );
  }

  /**
   * الحصول على ملف بواسطة المعرف
   */
  async getMediaFileById(id: number): Promise<MediaFile> {
    return await apiClient.get<MediaFile>(`${API_CONFIG.ENDPOINTS.MEDIA.BASE}/${id}`);
  }

  /**
   * الحصول على ملفات الوسائط المتاحة للعامة
   */
  async getPublicMediaFiles(category?: string): Promise<MediaFile[]> {
    const params: Record<string, string | number | boolean> = {};
    if (category) {
      params.category = category;
    }
    return await apiClient.get<MediaFile[]>(`${API_CONFIG.ENDPOINTS.MEDIA.BASE}/public`, params);
  }

  /**
   * تحديث معلومات الملف (للإدارة فقط)
   */
  async updateMediaFile(id: number, updates: {
    altText?: string;
    category?: string;
    isPublic?: boolean;
  }): Promise<MediaFile> {
    return await apiClient.put<MediaFile>(`${API_CONFIG.ENDPOINTS.MEDIA.BASE}/${id}`, updates);
  }

  /**
   * حذف ملف (للإدارة فقط)
   */
  async deleteMediaFile(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.MEDIA.BASE}/${id}`);
  }

  /**
   * حذف متعدد (للإدارة فقط)
   */
  async deleteMultipleFiles(fileIds: number[]): Promise<void> {
    await apiClient.post(`${API_CONFIG.ENDPOINTS.MEDIA.BASE}/bulk-delete`, {
      fileIds,
    });
  }

  /**
   * تحديث حالة العرض العام (للإدارة فقط)
   */
  async togglePublicStatus(id: number, isPublic: boolean): Promise<void> {
    await apiClient.patch(`${API_CONFIG.ENDPOINTS.MEDIA.BASE}/${id}/public-status`, { isPublic });
  }

  /**
   * الحصول على إحصائيات الملفات (للإدارة فقط)
   */
  async getMediaStatistics(): Promise<{
    totalFiles: number;
    totalSize: number;
    filesByCategory: Record<string, number>;
    filesByType: Record<string, number>;
  }> {
    return await apiClient.get(`${API_CONFIG.ENDPOINTS.MEDIA.BASE}/statistics`);
  }

  /**
   * تحسين الصورة (ضغط وتغيير الحجم)
   */
  async optimizeImage(id: number, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  }): Promise<MediaFile> {
    return await apiClient.post<MediaFile>(
      `${API_CONFIG.ENDPOINTS.MEDIA.BASE}/${id}/optimize`,
      options
    );
  }

  /**
   * إنشاء thumbnail للصورة
   */
  async createThumbnail(id: number, size: number = 150): Promise<string> {
    const response = await apiClient.post<{ thumbnailUrl: string }>(
      `${API_CONFIG.ENDPOINTS.MEDIA.BASE}/${id}/thumbnail`,
      { size }
    );
    return response.thumbnailUrl;
  }

  /**
   * البحث في الملفات بناءً على النص البديل والفئة
   */
  async searchMediaFiles(query: string, filters?: {
    category?: string;
    fileType?: string;
    isPublic?: boolean;
  }): Promise<MediaFile[]> {
    const params = {
      search: query,
      ...filters,
    };
    
    const response = await apiClient.get<PaginatedResponse<MediaFile>>(
      `${API_CONFIG.ENDPOINTS.MEDIA.BASE}/search`,
      params
    );
    
    return response.items;
  }

  /**
   * رفع صورة من URL (للإدارة فقط)
   */
  async uploadFromUrl(url: string, category?: string, altText?: string): Promise<MediaFile> {
    return await apiClient.post<MediaFile>(`${API_CONFIG.ENDPOINTS.MEDIA.BASE}/upload-from-url`, {
      url,
      category,
      altText,
    });
  }

  /**
   * الحصول على رابط التحميل المؤقت
   */
  async getDownloadLink(id: number, expiresIn: number = 3600): Promise<string> {
    const response = await apiClient.post<{ downloadUrl: string }>(
      `${API_CONFIG.ENDPOINTS.MEDIA.BASE}/${id}/download-link`,
      { expiresIn }
    );
    return response.downloadUrl;
  }

  /**
   * تحديد إذا كان الملف صورة
   */
  isImage(mediaFile: MediaFile): boolean {
    return mediaFile.fileType.startsWith('image/');
  }

  /**
   * تحديد إذا كان الملف فيديو
   */
  isVideo(mediaFile: MediaFile): boolean {
    return mediaFile.fileType.startsWith('video/');
  }

  /**
   * تحديد إذا كان الملف صوت
   */
  isAudio(mediaFile: MediaFile): boolean {
    return mediaFile.fileType.startsWith('audio/');
  }

  /**
   * تحديد إذا كان الملف مستند
   */
  isDocument(mediaFile: MediaFile): boolean {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
    ];
    
    return documentTypes.includes(mediaFile.fileType);
  }

  /**
   * تنسيق حجم الملف للعرض
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * استخراج اسم الملف بدون امتداد
   */
  getFileNameWithoutExtension(fileName: string): string {
    return fileName.replace(/\.[^/.]+$/, '');
  }

  /**
   * استخراج امتداد الملف
   */
  getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * إنشاء URL للمعاينة مع تحسين الحجم
   */
  getOptimizedImageUrl(mediaFile: MediaFile, options?: {
    width?: number;
    height?: number;
    quality?: number;
  }): string {
    if (!this.isImage(mediaFile)) {
      return mediaFile.url;
    }

    const params = new URLSearchParams();
    
    if (options?.width) {
      params.append('w', options.width.toString());
    }
    
    if (options?.height) {
      params.append('h', options.height.toString());
    }
    
    if (options?.quality) {
      params.append('q', options.quality.toString());
    }

    const queryString = params.toString();
    return queryString ? `${mediaFile.url}?${queryString}` : mediaFile.url;
  }

  /**
   * التحقق من صحة نوع الملف
   */
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  /**
   * التحقق من حجم الملف
   */
  validateFileSize(file: File, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }

  /**
   * إنشاء معاينة للملف قبل الرفع
   */
  createFilePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.validateFileType(file, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'])) {
        reject(new Error('نوع الملف غير مدعوم للمعاينة'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      
      reader.onerror = () => {
        reject(new Error('فشل في قراءة الملف'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  /**
   * ضغط الصورة قبل الرفع
   */
  compressImage(file: File, quality: number = 0.8, maxWidth: number = 1920): Promise<File> {
    return new Promise((resolve, reject) => {
      if (!this.isImage({ fileType: file.type } as MediaFile)) {
        resolve(file);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // حساب الأبعاد الجديدة
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // رسم الصورة المضغوطة
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('فشل في ضغط الصورة'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('فشل في تحميل الصورة'));
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

// إنشاء instance واحد للاستخدام في التطبيق
export const mediaService = new MediaService();
