import { apiClient } from './api-client';
import { API_CONFIG, LoginRequest, LoginResponse, User } from './api-config';

export class AuthService {
  /**
   * تسجيل الدخول
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      // حفظ التوكن في API Client
      apiClient.setToken(response.token);

      // حفظ بيانات المستخدم
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * تسجيل الخروج
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // حتى لو فشل الطلب، سنقوم بحذف البيانات المحلية
      console.warn('Logout request failed:', error);
    } finally {
      // حذف التوكن وبيانات المستخدم
      apiClient.removeToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_data');
      }
    }
  }

  /**
   * الحصول على بيانات المستخدم الحالي من الخادم
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(API_CONFIG.ENDPOINTS.AUTH.ME);
    
    // تحديث البيانات المحفوظة محلياً
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(response));
    }
    
    return response;
  }

  /**
   * الحصول على بيانات المستخدم من localStorage
   */
  getLocalUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userData = localStorage.getItem('user_data');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData) as User;
    } catch {
      return null;
    }
  }

  /**
   * تحقق من تسجيل دخول المستخدم
   */
  isAuthenticated(): boolean {
    return apiClient.hasValidToken() && !!this.getLocalUser();
  }

  /**
   * تغيير كلمة المرور
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> {
    await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  }

  /**
   * تسجيل مستخدم جديد (للإدارة فقط)
   */
  async register(data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
  }): Promise<User> {
    return await apiClient.post<User>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
  }

  /**
   * الحصول على جميع المستخدمين (للإدارة فقط)
   */
  async getAllUsers(): Promise<User[]> {
    return await apiClient.get<User[]>(API_CONFIG.ENDPOINTS.AUTH.USERS);
  }

  /**
   * تحديث بيانات مستخدم (للإدارة فقط)
   */
  async updateUser(id: number, data: {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    return await apiClient.put<User>(`${API_CONFIG.ENDPOINTS.AUTH.USERS}/${id}`, data);
  }

  /**
   * حذف مستخدم (للإدارة فقط)
   */
  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.AUTH.USERS}/${id}`);
  }
}

// إنشاء instance واحد للاستخدام في التطبيق
export const authService = new AuthService();
