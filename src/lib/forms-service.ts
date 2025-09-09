import { apiClient } from './api-client';
import { API_CONFIG, FormSubmission, ContactFormData, EventPlanningFormData, ServiceProviderApplicationFormData, PartnershipFormData, FeedbackFormData, PaginatedResponse, FormStatistics } from './api-config';

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
   * إرسال نموذج تخطيط الفعاليات (public endpoint)
   */
  async submitEventPlanningForm(formData: EventPlanningFormData): Promise<FormSubmission> {
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
   * إرسال نموذج تطبيق مقدم الخدمة (public endpoint)
   */
  async submitServiceProviderApplication(formData: ServiceProviderApplicationFormData): Promise<FormSubmission> {
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
   * إرسال نموذج الشراكة (public endpoint)
   */
  async submitPartnershipForm(formData: PartnershipFormData): Promise<FormSubmission> {
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
   * إرسال نموذج الملاحظات والتقييم (public endpoint)
   */
  async submitFeedbackForm(formData: FeedbackFormData): Promise<FormSubmission> {
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

  /**
   * الحصول على النماذج المرسلة بحسب النوع (للإدارة فقط)
   */
  async getFormSubmissionsByType(formType: string, params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }): Promise<PaginatedResponse<FormSubmission>> {
    return await apiClient.get<PaginatedResponse<FormSubmission>>(
      API_CONFIG.ENDPOINTS.FORMS.BASE,
      { ...params, formType }
    );
  }

  /**
   * الحصول على إحصائيات الفورم بحسب النوع (للإدارة فقط)
   */
  async getFormStatisticsByType(formType?: string): Promise<FormStatistics & { byType: Record<string, number> }> {
    const response = await apiClient.get<FormStatistics & { byType: Record<string, number> }>(
      API_CONFIG.ENDPOINTS.FORMS.STATISTICS,
      formType ? { formType } : undefined
    );
    return response;
  }

  /**
   * الحصول على أنواع الفورم المتاحة
   */
  getAvailableFormTypes(): string[] {
    return ['contact', 'event-planning', 'service-provider', 'partnership', 'feedback'];
  }

  /**
   * الحصول على تسميات أنواع الفورم باللغة العربية
   */
  getFormTypeLabels(): Record<string, string> {
    return {
      'contact': 'نموذج الاتصال',
      'event-planning': 'نموذج تخطيط الفعاليات',
      'service-provider': 'نموذج مقدم الخدمة',
      'partnership': 'نموذج الشراكة',
      'feedback': 'نموذج الملاحظات والتقييم'
    };
  }

  /**
   * التحقق من صحة البيانات بحسب نوع الفورم
   */
  validateFormData(formType: string, formData: ContactFormData | EventPlanningFormData | ServiceProviderApplicationFormData | PartnershipFormData | FeedbackFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // التحقق من الحقول الأساسية المشتركة
    if (!formData.submitterName?.trim()) {
      errors.push('اسم المرسل مطلوب');
    }
    if (!formData.submitterEmail?.trim()) {
      errors.push('البريد الإلكتروني مطلوب');
    }

    // التحقق حسب نوع الفورم
    switch (formType) {
      case 'contact':
        const contactData = formData as ContactFormData;
        if (!contactData.message?.trim()) {
          errors.push('الرسالة مطلوبة');
        }
        break;

      case 'event-planning':
        const eventData = formData as EventPlanningFormData;
        if (!eventData.eventTitle?.trim()) {
          errors.push('عنوان الفعالية مطلوب');
        }
        if (!eventData.eventDate) {
          errors.push('تاريخ الفعالية مطلوب');
        }
        if (!eventData.guestCount || eventData.guestCount < 1) {
          errors.push('عدد الضيوف يجب أن يكون أكبر من صفر');
        }
        break;

      case 'service-provider':
        const serviceData = formData as ServiceProviderApplicationFormData;
        if (!serviceData.companyName?.trim()) {
          errors.push('اسم الشركة مطلوب');
        }
        if (!serviceData.serviceCategory) {
          errors.push('فئة الخدمة مطلوبة');
        }
        break;

      case 'partnership':
        const partnerData = formData as PartnershipFormData;
        if (!partnerData.organizationName?.trim()) {
          errors.push('اسم المؤسسة مطلوب');
        }
        if (!partnerData.proposalDescription?.trim()) {
          errors.push('وصف المقترح مطلوب');
        }
        break;

      case 'feedback':
        const feedbackData = formData as FeedbackFormData;
        if (!feedbackData.eventName?.trim()) {
          errors.push('اسم الفعالية مطلوب');
        }
        if (!feedbackData.rating || feedbackData.rating < 1 || feedbackData.rating > 5) {
          errors.push('التقييم يجب أن يكون بين 1 و 5');
        }
        break;
    }

    return { isValid: errors.length === 0, errors };
  }
}

// إنشاء instance واحد للاستخدام في التطبيق
export const formsService = new FormsService();
