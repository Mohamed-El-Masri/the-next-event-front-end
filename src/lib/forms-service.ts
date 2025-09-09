import { apiClient } from './api-client';
import { API_CONFIG, FormSubmission, ContactFormData, PaginatedResponse, FormStatistics } from './api-config';

export class FormsService {
  /**
   * إرسال نموذج الاتصال (public endpoint)
   */
  async submitContactForm(formData: ContactFormData): Promise<FormSubmission> {
    try {
      const response = await apiClient.post<FormSubmission>(
        API_CONFIG.ENDPOINTS.FORMS.SUBMIT,
        formData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * إرسال نموذج عام (public endpoint)
   */
  async submitForm(formData: FormSubmission): Promise<FormSubmission> {
    try {
      const response = await apiClient.post<FormSubmission>(
        API_CONFIG.ENDPOINTS.FORMS.SUBMIT,
        formData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * الحصول على جميع النماذج المرسلة (للإدارة فقط)
   */
  async getAllFormSubmissions(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<PaginatedResponse<FormSubmission>> {
    return await apiClient.get<PaginatedResponse<FormSubmission>>(
      API_CONFIG.ENDPOINTS.FORMS.BASE,
      params
    );
  }

  /**
   * الحصول على نموذج مرسل بواسطة المعرف (للإدارة فقط)
   */
  async getFormSubmissionById(id: number): Promise<FormSubmission> {
    return await apiClient.get<FormSubmission>(`${API_CONFIG.ENDPOINTS.FORMS.BASE}/${id}`);
  }

  /**
   * تحديث حالة النموذج (للإدارة فقط)
   */
  async updateFormStatus(id: number, status: string, adminNotes?: string): Promise<void> {
    await apiClient.patch(`${API_CONFIG.ENDPOINTS.FORMS.BASE}/${id}/status`, {
      status,
      adminNotes,
    });
  }

  /**
   * تحديث حالة القراءة (للإدارة فقط)
   */
  async markAsRead(id: number, isRead: boolean = true): Promise<void> {
    await apiClient.patch(`${API_CONFIG.ENDPOINTS.FORMS.BASE}/${id}/read-status`, isRead);
  }

  /**
   * حذف نموذج مرسل (للإدارة فقط)
   */
  async deleteFormSubmission(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.FORMS.BASE}/${id}`);
  }

  /**
   * تصدير النماذج إلى CSV (للإدارة فقط)
   */
  async exportToCSV(params?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<Blob> {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FORMS.EXPORT_CSV}?${new URLSearchParams(params || {}).toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${apiClient.getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('فشل في تصدير البيانات');
    }

    return await response.blob();
  }

  /**
   * الحصول على إحصائيات النماذج (للإدارة فقط)
   */
  async getFormStatistics(): Promise<FormStatistics> {
    return await apiClient.get<FormStatistics>(API_CONFIG.ENDPOINTS.FORMS.STATISTICS);
  }

  /**
   * الحصول على عدد النماذج اليومية (للإدارة فقط)
   */
  async getDailyFormCounts(days: number = 30): Promise<Array<{ date: string; count: number }>> {
    return await apiClient.get<Array<{ date: string; count: number }>>(
      `${API_CONFIG.ENDPOINTS.FORMS.BASE}/daily-counts`,
      { days }
    );
  }

  /**
   * تحديث متعدد للحالة (للإدارة فقط)
   */
  async bulkUpdateStatus(formIds: number[], status: string, adminNotes?: string): Promise<void> {
    await apiClient.patch(`${API_CONFIG.ENDPOINTS.FORMS.BASE}/bulk-update`, {
      formIds,
      status,
      adminNotes,
    });
  }

  /**
   * حذف متعدد (للإدارة فقط)
   */
  async bulkDelete(formIds: number[]): Promise<void> {
    await apiClient.post(`${API_CONFIG.ENDPOINTS.FORMS.BASE}/bulk-delete`, {
      formIds,
    });
  }

  /**
   * إنشاء نموذج اتصال من البيانات المرسلة
   */
  createContactFormData(formData: {
    name: string;
    email: string;
    phone: string;
    organization?: string;
    message: string;
    eventType?: string;
    eventDate?: string;
    guestCount?: string;
    budget?: string;
    services?: string[];
  }): ContactFormData {
    return {
      formType: 'contact',
      submitterName: formData.name,
      submitterEmail: formData.email,
      submitterPhone: formData.phone,
      message: formData.message,
      additionalData: {
        organization: formData.organization,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        guestCount: formData.guestCount,
        budget: formData.budget,
        services: formData.services,
      },
    };
  }

  /**
   * تنسيق بيانات النموذج للعرض
   */
  formatFormSubmissionForDisplay(submission: FormSubmission): {
    basicInfo: Record<string, string>;
    additionalInfo: Record<string, string>;
  } {
    const basicInfo: Record<string, string> = {
      'الاسم': submission.submitterName,
      'البريد الإلكتروني': submission.submitterEmail,
      'رقم الهاتف': submission.submitterPhone,
      'الرسالة': submission.message,
    };

    const additionalInfo: Record<string, string> = {};
    
    if (submission.additionalData) {
      Object.entries(submission.additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          const arabicKeys: Record<string, string> = {
            organization: 'المؤسسة',
            eventType: 'نوع الفعالية',
            eventDate: 'تاريخ الفعالية',
            guestCount: 'عدد الضيوف',
            budget: 'الميزانية',
            services: 'الخدمات المطلوبة',
          };
          
          const displayKey = arabicKeys[key] || key;
          additionalInfo[displayKey] = Array.isArray(value) ? value.join(', ') : value.toString();
        }
      });
    }

    return { basicInfo, additionalInfo };
  }
}

// إنشاء instance واحد للاستخدام في التطبيق
export const formsService = new FormsService();
