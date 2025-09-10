import { API_CONFIG, ApiError } from './api-config';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    // استرجاع التوكن من localStorage عند التهيئة
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  /**
   * تعيين JWT Token
   */
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      // أيضاً حفظ في cookies للـ middleware
      document.cookie = `auth_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
    }
  }

  /**
   * حذف JWT Token
   */
  removeToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      // حذف من cookies أيضاً
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }

  /**
   * إعداد Request Headers
   */
  private getHeaders(contentType = 'application/json'): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': contentType,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * معالجة Response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    let data;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const error: ApiError = {
        message: data.message || `HTTP Error: ${response.status}`,
        errors: data.errors || {},
      };
      throw error;
    }

    return data;
  }

  /**
   * GET Request
   */
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    let url = `${this.baseURL}${endpoint}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * POST Request
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PUT Request
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * PATCH Request
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  /**
   * DELETE Request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  /**
   * File Upload (for Cloudinary)
   */
  async uploadFile(url: string, formData: FormData): Promise<unknown> {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    return this.handleResponse(response);
  }

  /**
   * تحقق من صحة التوكن
   */
  hasValidToken(): boolean {
    return !!this.token;
  }

  /**
   * استرجاع التوكن الحالي
   */
  getToken(): string | null {
    return this.token;
  }
}

// إنشاء instance واحد للاستخدام في التطبيق
export const apiClient = new ApiClient();

// Helper function للتعامل مع أخطاء API
export const handleApiError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'message' in error) {
    const apiError = error as ApiError;
    return apiError.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'حدث خطأ غير متوقع';
};

// Helper function لعرض رسائل الأخطاء المفصلة
export const getDetailedErrorMessage = (error: unknown): string[] => {
  if (error && typeof error === 'object' && 'errors' in error) {
    const apiError = error as ApiError;
    const messages: string[] = [];
    
    if (apiError.errors) {
      Object.values(apiError.errors).forEach(fieldErrors => {
        messages.push(...fieldErrors);
      });
    }
    
    if (messages.length === 0 && apiError.message) {
      messages.push(apiError.message);
    }
    
    return messages;
  }
  
  return [handleApiError(error)];
};
