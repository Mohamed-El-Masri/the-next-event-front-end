import { apiClient } from './api-client';
import { API_CONFIG, ContentItem, PaginatedResponse } from './api-config';

export class ContentService {
  /**
   * الحصول على جميع المحتويات
   */
  async getAllContent(params?: {
    contentKey?: string;
    isActive?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<ContentItem> | ContentItem[]> {
    return await apiClient.get<PaginatedResponse<ContentItem> | ContentItem[]>(
      API_CONFIG.ENDPOINTS.CONTENT.BASE,
      params
    );
  }

  /**
   * الحصول على محتوى بواسطة المفتاح
   */
  async getContentByKey(contentKey: string): Promise<ContentItem> {
    return await apiClient.get<ContentItem>(
      `${API_CONFIG.ENDPOINTS.CONTENT.BY_KEY}/${contentKey}`
    );
  }

  /**
   * الحصول على المحتوى بواسطة اللغة
   */
  async getContentByLanguage(language: string): Promise<ContentItem[]> {
    return await apiClient.get<ContentItem[]>(
      `${API_CONFIG.ENDPOINTS.CONTENT.BY_LANGUAGE}/${language}`
    );
  }

  /**
   * الحصول على محتوى القسم
   */
  async getContentBySection(sectionKey: string): Promise<ContentItem[]> {
    return await apiClient.get<ContentItem[]>(
      `${API_CONFIG.ENDPOINTS.CONTENT.BY_SECTION}/${sectionKey}`
    );
  }

  /**
   * إنشاء محتوى جديد (للإدارة فقط)
   */
  async createContent(data: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentItem> {
    return await apiClient.post<ContentItem>(API_CONFIG.ENDPOINTS.CONTENT.BASE, data);
  }

  /**
   * تحديث محتوى (للإدارة فقط)
   */
  async updateContent(id: number, data: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentItem> {
    return await apiClient.put<ContentItem>(`${API_CONFIG.ENDPOINTS.CONTENT.BASE}/${id}`, data);
  }

  /**
   * حذف محتوى (للإدارة فقط)
   */
  async deleteContent(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.CONTENT.BASE}/${id}`);
  }

  /**
   * تحديث ترتيب المحتوى (للإدارة فقط)
   */
  async updateSortOrder(id: number, sortOrder: number): Promise<void> {
    await apiClient.put(`${API_CONFIG.ENDPOINTS.CONTENT.BASE}/${id}/sort-order`, { sortOrder });
  }

  /**
   * تبديل حالة النشاط (للإدارة فقط)
   */
  async toggleActiveStatus(id: number): Promise<ContentItem> {
    return await apiClient.put<ContentItem>(`${API_CONFIG.ENDPOINTS.CONTENT.BASE}/${id}/toggle-active`);
  }

  /**
   * تحديث متعدد للمحتوى (للإدارة فقط)
   */
  async bulkUpdateContent(contentItems: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<ContentItem[]> {
    return await apiClient.put<ContentItem[]>(API_CONFIG.ENDPOINTS.CONTENT.BULK_UPDATE, contentItems);
  }

  /**
   * تحويل مصفوفة المحتوى إلى كائن بالمفاتيح للوصول السهل
   */
  contentArrayToObject(contentItems: ContentItem[]): Record<string, string> {
    const contentObject: Record<string, string> = {};
    contentItems.forEach(item => {
      if (item.isActive) {
        contentObject[item.contentKey] = item.contentValue;
      }
    });
    return contentObject;
  }

  /**
   * تجميع المحتوى بواسطة الأقسام
   */
  groupContentBySection(contentItems: ContentItem[]): Record<string, ContentItem[]> {
    const grouped: Record<string, ContentItem[]> = {};
    contentItems.forEach(item => {
      if (item.isActive) {
        if (!grouped[item.sectionKey]) {
          grouped[item.sectionKey] = [];
        }
        grouped[item.sectionKey].push(item);
      }
    });

    // ترتيب المحتوى في كل قسم
    Object.keys(grouped).forEach(sectionKey => {
      grouped[sectionKey].sort((a, b) => a.sortOrder - b.sortOrder);
    });

    return grouped;
  }

  /**
   * البحث في المحتوى
   */
  searchContent(contentItems: ContentItem[], searchTerm: string): ContentItem[] {
    const term = searchTerm.toLowerCase();
    return contentItems.filter(item =>
      item.contentKey.toLowerCase().includes(term) ||
      item.contentValue.toLowerCase().includes(term) ||
      item.sectionKey.toLowerCase().includes(term)
    );
  }
}

// إنشاء instance واحد للاستخدام في التطبيق
export const contentService = new ContentService();
