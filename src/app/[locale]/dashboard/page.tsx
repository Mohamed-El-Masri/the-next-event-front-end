'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { authService } from '@/lib/auth-service';
import { dashboardService, FormSubmissionWithDetails, DashboardFilters } from '@/lib/dashboard-service';

interface DashboardStats {
  totalSubmissions: number;
  pendingReviews: number;
  activeUsers: number;
  systemStatus: 'online' | 'maintenance' | 'error';
  completedForms: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalSubmissions: 0,
    pendingReviews: 0,
    activeUsers: 0,
    systemStatus: 'online',
    completedForms: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState<FormSubmissionWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormType, setSelectedFormType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadSubmissions = useCallback(async () => {
    try {
      const filters: DashboardFilters = {
        formType: selectedFormType !== 'all' ? selectedFormType : undefined,
        searchTerm: searchTerm || undefined,
        page: currentPage,
        limit: 10
      };

      const response = await dashboardService.getFormSubmissions(filters);
      setRecentSubmissions(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load submissions:', error);
      setError('فشل في تحميل الطلبات');
    }
  }, [selectedFormType, searchTerm, currentPage]);

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // جلب الإحصائيات
      const statsData = await dashboardService.getDashboardStats();
      setStats(statsData);

      // جلب الطلبات مع الفلاتر
      await loadSubmissions();

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('فشل في تحميل بيانات لوحة التحكم');
    } finally {
      setIsLoading(false);
    }
  }, [loadSubmissions]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const handleMarkAsRead = async (id: number) => {
    try {
      setIsUpdating(true);
      await dashboardService.markAsRead(id);
      await loadSubmissions(); // إعادة تحميل البيانات
    } catch (error) {
      console.error('Failed to mark as read:', error);
      setError('فشل في تمييز الطلب كمقروء');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      setIsUpdating(true);
      await dashboardService.updateSubmissionStatus(id, newStatus);
      await loadSubmissions(); // إعادة تحميل البيانات
      await loadDashboardData(); // إعادة تحميل الإحصائيات
    } catch (error) {
      console.error('Failed to update status:', error);
      setError('فشل في تحديث حالة الطلب');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSubmission = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      return;
    }

    try {
      setIsUpdating(true);
      await dashboardService.deleteSubmission(id);
      await loadSubmissions();
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to delete submission:', error);
      setError('فشل في حذف الطلب');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportData = async () => {
    try {
      setIsUpdating(true);
      const filters: DashboardFilters = {
        formType: selectedFormType !== 'all' ? selectedFormType : undefined,
        searchTerm: searchTerm || undefined
      };

      const blob = await dashboardService.exportSubmissions(filters, 'excel');
      
      // إنشاء رابط للتحميل
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `submissions_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Failed to export data:', error);
      setError('فشل في تصدير البيانات');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error('Logout failed:', error);
      // حتى لو فشل الطلب، نوجه للصفحة الرئيسية
      router.push(`/${locale}/login`);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل';
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return priority;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'inProgress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormTypeLabel = (formType: string) => {
    switch (formType) {
      case 'contact': return 'نموذج التواصل';
      case 'event-planning': return 'تخطيط الفعاليات';
      case 'service-provider': return 'مقدمي الخدمات';
      case 'partnership': return 'الشراكات';
      case 'feedback': return 'التقييمات';
      default: return formType;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
              <p className="text-gray-600">مرحباً بعودتك</p>
            </div>
            <div className="flex space-x-4">
              <Button 
                onClick={handleExportData} 
                variant="outline"
                disabled={isUpdating}
              >
                {isUpdating ? '⏳' : '📊'} تصدير البيانات
              </Button>
              <Button onClick={handleLogout}>
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الطلبات
              </CardTitle>
              <span className="text-2xl">📝</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
              <p className="text-xs text-gray-500">+12% من الشهر الماضي</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                قيد المراجعة
              </CardTitle>
              <span className="text-2xl">⏳</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReviews}</div>
              <p className="text-xs text-gray-500">يحتاج مراجعة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                المستخدمين النشطين
              </CardTitle>
              <span className="text-2xl">👥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedForms}</div>
              <p className="text-xs text-gray-500">نموذج مكتمل</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                إجمالي الإيرادات
              </CardTitle>
              <span className="text-2xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} ر.س</div>
              <p className="text-xs text-gray-500">+{stats.monthlyGrowth}% هذا الشهر</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                حالة النظام
              </CardTitle>
              <span className="text-2xl">
                {stats.systemStatus === 'online' ? '✅' : stats.systemStatus === 'maintenance' ? '🔧' : '❌'}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{stats.systemStatus}</div>
              <p className="text-xs text-gray-500">آخر تحديث: منذ دقيقة</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📋</span>
                <span>طلبات النماذج</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">إدارة طلبات النماذج</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📄</span>
                <span>إدارة المحتوى</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">تحرير محتوى الموقع</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🖼️</span>
                <span>مكتبة الوسائط</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">إدارة الصور والملفات</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📈</span>
                <span>التحليلات</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">تقارير وإحصائيات</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>طلبات النماذج</CardTitle>
                <CardDescription>أحدث الطلبات المرسلة</CardDescription>
              </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="البحث في الطلبات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                      <select
                        value={selectedFormType}
                        onChange={(e) => setSelectedFormType(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="all">جميع النماذج</option>
                        <option value="contact">التواصل</option>
                        <option value="event-planning">تخطيط الفعاليات</option>
                        <option value="service-provider">مقدمي الخدمات</option>
                        <option value="partnership">الشراكات</option>
                        <option value="feedback">التقييمات</option>
                      </select>
                      <Button 
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedFormType('all');
                          setCurrentPage(1);
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        مسح الفلاتر
                      </Button>
                    </div>
                  </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubmissions.length > 0 ? (
                recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`p-6 border rounded-lg transition-all hover:shadow-md ${
                      submission.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <h4 className="font-semibold text-lg">{submission.submitterName}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                            {submission.status === 'new' ? 'جديد' : submission.status === 'inProgress' ? 'قيد العمل' : submission.status === 'completed' ? 'مكتمل' : 'أرشيف'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(submission.priority)}`}>
                            {getPriorityLabel(submission.priority)}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {getFormTypeLabel(submission.formType)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">📧 {submission.submitterEmail}</p>
                            <p className="text-sm text-gray-600">📱 {submission.submitterPhone}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">
                              تاريخ الإرسال: {submission.submittedAt && formatDate(submission.submittedAt)}
                            </p>
                            {submission.lastUpdated && (
                              <p className="text-xs text-gray-500">
                                آخر تحديث: {formatDate(submission.lastUpdated)}
                              </p>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-800 mb-3 bg-white p-3 rounded border-l-4 border-blue-400">
                          {submission.message.substring(0, 200)}
                          {submission.message.length > 200 && '...'}
                        </p>

                        {submission.tags && submission.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {submission.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {submission.assignedTo && (
                          <p className="text-xs text-blue-600 mb-2">
                            👤 مُعيَّن إلى: {submission.assignedTo}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      {!submission.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => submission.id && handleMarkAsRead(submission.id)}
                          disabled={isUpdating}
                        >
                          ✓ تمييز كمقروء
                        </Button>
                      )}
                      
                      <select
                        value={submission.status}
                        onChange={(e) => submission.id && handleUpdateStatus(submission.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                        disabled={isUpdating}
                      >
                        <option value="new">جديد</option>
                        <option value="inProgress">قيد العمل</option>
                        <option value="completed">مكتمل</option>
                        <option value="archived">أرشيف</option>
                      </select>

                      <Button
                        size="sm"
                        onClick={() => router.push(`/${locale}/dashboard/submissions/${submission.id}`)}
                      >
                        📄 التفاصيل
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/${locale}/dashboard/reply/${submission.id}`)}
                      >
                        💬 رد
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => submission.id && handleDeleteSubmission(submission.id)}
                        disabled={isUpdating}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️ حذف
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">لا توجد طلبات حديثة</p>
                </div>
              )}
            </div>
            
            
            {recentSubmissions.length > 0 && (
              <div className="mt-6 flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || isUpdating}
                  >
                    ← السابق
                  </Button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    صفحة {currentPage} من {totalPages}
                  </span>
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || isUpdating}
                  >
                    التالي →
                  </Button>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => router.push(`/${locale}/dashboard/submissions`)}
                >
                  عرض جميع الطلبات
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
