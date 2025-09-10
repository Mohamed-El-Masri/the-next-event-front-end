import { apiClient } from './api-client';
import { 
  FormSubmission, 
  User, 
  ContactFormData,
  EventPlanningFormData,
  ServiceProviderApplicationFormData,
  PartnershipFormData,
  FeedbackFormData
} from './api-config';

export interface DashboardStats {
  totalSubmissions: number;
  pendingReviews: number;
  activeUsers: number;
  completedForms: number;
  totalRevenue: number;
  systemStatus: 'online' | 'maintenance' | 'error';
  monthlyGrowth: number;
}

export interface FormSubmissionWithDetails extends FormSubmission {
  formData?: ContactFormData | EventPlanningFormData | ServiceProviderApplicationFormData | PartnershipFormData | FeedbackFormData;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  attachments?: string[];
  lastUpdated: string;
}

export interface DashboardFilters {
  formType?: string;
  status?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
  assignedTo?: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class DashboardService {
  // إحصائيات لوحة التحكم
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<DashboardStats>('/admin/dashboard/stats');
      return response;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Fallback mock data
      return {
        totalSubmissions: 127,
        pendingReviews: 23,
        activeUsers: 45,
        completedForms: 89,
        totalRevenue: 125000,
        systemStatus: 'online',
        monthlyGrowth: 12.5
      };
    }
  }

  // جلب جميع طلبات النماذج مع الفلترة والصفحات
  async getFormSubmissions(filters: DashboardFilters = {}): Promise<PaginatedResponse<FormSubmissionWithDetails>> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get<PaginatedResponse<FormSubmissionWithDetails>>(`/admin/submissions?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch form submissions:', error);
      // Mock data للاختبار
      return this.getMockSubmissions(filters);
    }
  }

  // جلب تفاصيل طلب محدد
  async getSubmissionById(id: number): Promise<FormSubmissionWithDetails> {
    try {
      const response = await apiClient.get<FormSubmissionWithDetails>(`/admin/submissions/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch submission details:', error);
      throw new Error('فشل في جلب تفاصيل الطلب');
    }
  }

  // تحديث حالة الطلب
  async updateSubmissionStatus(id: number, status: string, notes?: string): Promise<void> {
    try {
      await apiClient.put(`/admin/submissions/${id}/status`, {
        status,
        notes,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to update submission status:', error);
      throw new Error('فشل في تحديث حالة الطلب');
    }
  }

  // تمييز الطلب كمقروء
  async markAsRead(id: number): Promise<void> {
    try {
      await apiClient.put(`/admin/submissions/${id}/read`);
    } catch (error) {
      console.error('Failed to mark submission as read:', error);
      throw new Error('فشل في تمييز الطلب كمقروء');
    }
  }

  // تعيين الطلب لمستخدم
  async assignSubmission(id: number, userId: string): Promise<void> {
    try {
      await apiClient.put(`/admin/submissions/${id}/assign`, {
        assignedTo: userId,
        assignedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to assign submission:', error);
      throw new Error('فشل في تعيين الطلب');
    }
  }

  // إضافة ملاحظة للطلب
  async addNote(id: number, note: string): Promise<void> {
    try {
      await apiClient.post(`/admin/submissions/${id}/notes`, {
        note,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to add note:', error);
      throw new Error('فشل في إضافة الملاحظة');
    }
  }

  // حذف الطلب
  async deleteSubmission(id: number): Promise<void> {
    try {
      await apiClient.delete(`/admin/submissions/${id}`);
    } catch (error) {
      console.error('Failed to delete submission:', error);
      throw new Error('فشل في حذف الطلب');
    }
  }

  // تصدير البيانات
  async exportSubmissions(filters: DashboardFilters = {}, format: 'csv' | 'excel' = 'excel'): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      params.append('format', format);

      const response = await apiClient.get<Blob>(`/admin/submissions/export?${params.toString()}`, {
        responseType: 'blob'
      });
      
      return response;
    } catch (error) {
      console.error('Failed to export submissions:', error);
      throw new Error('فشل في تصدير البيانات');
    }
  }

  // جلب المستخدمين للتعيين
  async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>('/admin/users');
      return response;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return [];
    }
  }

  // إحصائيات متقدمة
  async getAdvancedAnalytics(period: 'week' | 'month' | 'quarter' | 'year' = 'month') {
    try {
      const response = await apiClient.get<Record<string, unknown>>(`/admin/analytics?period=${period}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return null;
    }
  }

  // إرسال رد على الطلب
  async replyToSubmission(id: number, replyData: {
    subject: string;
    message: string;
    attachments?: string[];
  }): Promise<void> {
    try {
      await apiClient.post(`/admin/submissions/${id}/reply`, replyData);
    } catch (error) {
      console.error('Failed to send reply:', error);
      throw new Error('فشل في إرسال الرد');
    }
  }

  // Mock data للاختبار (سيتم إزالتها عند ربط API الحقيقي)
  private getMockSubmissions(filters: DashboardFilters): PaginatedResponse<FormSubmissionWithDetails> {
    const mockData: FormSubmissionWithDetails[] = [
      {
        id: 1,
        formType: 'contact',
        submitterName: 'أحمد محمد السالم',
        submitterEmail: 'ahmed.salem@email.com',
        submitterPhone: '+966501234567',
        message: 'أرغب في الاستفسار عن خدمات تنظيم الفعاليات للشركات. نحن شركة تقنية ونحتاج لتنظيم مؤتمر سنوي.',
        status: 'new',
        isRead: false,
        submittedAt: new Date().toISOString(),
        priority: 'high',
        tags: ['مؤتمر', 'شركة تقنية'],
        lastUpdated: new Date().toISOString()
      },
      {
        id: 2,
        formType: 'event-planning',
        submitterName: 'فاطمة العلي',
        submitterEmail: 'fatima.ali@company.com',
        submitterPhone: '+966507654321',
        message: 'نحتاج لتنظيم مؤتمر تقني لشركتنا بحضور 200 شخص مع ضيوف متحدثين دوليين.',
        status: 'inProgress',
        isRead: true,
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'admin@example.com',
        priority: 'medium',
        tags: ['مؤتمر تقني', '200 شخص'],
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        formType: 'feedback',
        submitterName: 'محمد الشهري',
        submitterEmail: 'mohammed.alshahri@email.com',
        submitterPhone: '+966501111111',
        message: 'كان الحدث رائعاً جداً وتنظيم ممتاز، أتطلع للمشاركة مرة أخرى. فريق العمل كان محترف جداً.',
        status: 'completed',
        isRead: true,
        submittedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        priority: 'low',
        tags: ['تقييم إيجابي'],
        lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        formType: 'service-provider',
        submitterName: 'شركة الأضواء الذهبية',
        submitterEmail: 'info@goldenlights.com',
        submitterPhone: '+966502222222',
        message: 'نحن شركة متخصصة في الإضاءة والصوتيات ونرغب في الانضمام كمقدمي خدمات.',
        status: 'new',
        isRead: false,
        submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        tags: ['إضاءة', 'صوتيات', 'مقدم خدمة'],
        lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 5,
        formType: 'partnership',
        submitterName: 'مجموعة الرياض للفعاليات',
        submitterEmail: 'partnerships@riyadhevents.com',
        submitterPhone: '+966503333333',
        message: 'نتطلع لشراكة استراتيجية في تنظيم الفعاليات الكبرى في منطقة الرياض.',
        status: 'inProgress',
        isRead: true,
        submittedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'partnerships@example.com',
        priority: 'urgent',
        tags: ['شراكة', 'الرياض', 'فعاليات كبرى'],
        lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];

    // تطبيق الفلاتر
    let filteredData = mockData;

    if (filters.formType && filters.formType !== 'all') {
      filteredData = filteredData.filter(item => item.formType === filters.formType);
    }

    if (filters.status && filters.status !== 'all') {
      filteredData = filteredData.filter(item => item.status === filters.status);
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => 
        item.submitterName.toLowerCase().includes(searchLower) ||
        item.submitterEmail.toLowerCase().includes(searchLower) ||
        item.message.toLowerCase().includes(searchLower)
      );
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      data: filteredData.slice(startIndex, endIndex),
      total: filteredData.length,
      page,
      limit,
      totalPages: Math.ceil(filteredData.length / limit)
    };
  }
}

export const dashboardService = new DashboardService();
