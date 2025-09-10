'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { Alert, AlertDescription } from '../../../../../components/ui/alert';
import { dashboardService, FormSubmissionWithDetails } from '@/lib/dashboard-service';

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const submissionId = parseInt(params.id as string);
  
  const [submission, setSubmission] = useState<FormSubmissionWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadSubmissionDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dashboardService.getSubmissionById(submissionId);
      setSubmission(data);
    } catch (error) {
      console.error('Failed to load submission details:', error);
      setError('فشل في تحميل تفاصيل الطلب');
    } finally {
      setIsLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    if (submissionId) {
      loadSubmissionDetails();
    }
  }, [submissionId, loadSubmissionDetails]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!submission?.id) return;

    try {
      setIsUpdating(true);
      await dashboardService.updateSubmissionStatus(submission.id, newStatus);
      await loadSubmissionDetails(); // إعادة تحميل البيانات
    } catch (error) {
      console.error('Failed to update status:', error);
      setError('فشل في تحديث حالة الطلب');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkAsRead = async () => {
    if (!submission?.id || submission.isRead) return;

    try {
      setIsUpdating(true);
      await dashboardService.markAsRead(submission.id);
      await loadSubmissionDetails();
    } catch (error) {
      console.error('Failed to mark as read:', error);
      setError('فشل في تمييز الطلب كمقروء');
    } finally {
      setIsUpdating(false);
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'inProgress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-SA');
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

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'لم يتم العثور على الطلب'}</p>
          <Button onClick={() => router.push(`/${locale}/dashboard`)}>
            العودة للوحة التحكم
          </Button>
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
              <h1 className="text-3xl font-bold text-gray-900">تفاصيل الطلب #{submission.id}</h1>
              <p className="text-gray-600">{getFormTypeLabel(submission.formType)}</p>
            </div>
            <div className="flex space-x-4">
              <Button 
                onClick={() => router.push(`/${locale}/dashboard/submissions`)}
                variant="outline"
              >
                ← العودة للطلبات
              </Button>
              <Button onClick={() => router.push(`/${locale}/dashboard`)}>
                لوحة التحكم
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Submission Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{submission.submitterName}</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      {getFormTypeLabel(submission.formType)}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(submission.status)}`}>
                      {submission.status === 'new' ? 'جديد' : submission.status === 'inProgress' ? 'قيد العمل' : submission.status === 'completed' ? 'مكتمل' : 'أرشيف'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(submission.priority)}`}>
                      {submission.priority === 'urgent' ? 'عاجل' : submission.priority === 'high' ? 'عالية' : submission.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">معلومات الاتصال</h4>
                    <p className="text-sm text-gray-600">📧 {submission.submitterEmail}</p>
                    <p className="text-sm text-gray-600">📱 {submission.submitterPhone}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">التوقيت</h4>
                    <p className="text-sm text-gray-600">
                      تاريخ الإرسال: {submission.submittedAt && formatDate(submission.submittedAt)}
                    </p>
                    {submission.lastUpdated && (
                      <p className="text-sm text-gray-600">
                        آخر تحديث: {formatDate(submission.lastUpdated)}
                      </p>
                    )}
                  </div>
                </div>

                {submission.assignedTo && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">المُعيَّن إليه</h4>
                    <p className="text-sm text-blue-600">👤 {submission.assignedTo}</p>
                  </div>
                )}

                {submission.tags && submission.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">العلامات</h4>
                    <div className="flex flex-wrap gap-2">
                      {submission.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Message Content */}
            <Card>
              <CardHeader>
                <CardTitle>محتوى الرسالة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
                  <p className="text-gray-800 whitespace-pre-wrap">{submission.message}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>إجراءات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!submission.isRead && (
                  <Button 
                    onClick={handleMarkAsRead}
                    disabled={isUpdating}
                    className="w-full"
                    variant="outline"
                  >
                    ✓ تمييز كمقروء
                  </Button>
                )}

                <Button 
                  onClick={() => router.push(`/${locale}/dashboard/reply/${submission.id}`)}
                  className="w-full"
                >
                  💬 إرسال رد
                </Button>

                <Button 
                  onClick={() => window.print()}
                  variant="outline"
                  className="w-full"
                >
                  🖨️ طباعة
                </Button>
              </CardContent>
            </Card>

            {/* Status Management */}
            <Card>
              <CardHeader>
                <CardTitle>إدارة الحالة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تغيير حالة الطلب
                  </label>
                  <select
                    value={submission.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={isUpdating}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="new">جديد</option>
                    <option value="inProgress">قيد العمل</option>
                    <option value="completed">مكتمل</option>
                    <option value="archived">أرشيف</option>
                  </select>
                </div>

                {isUpdating && (
                  <div className="text-center text-sm text-gray-500">
                    جاري التحديث...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submission Stats */}
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات الطلب</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">الحالة:</span>
                  <span className="font-medium">{submission.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">الأولوية:</span>
                  <span className="font-medium">{submission.priority}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">مقروء:</span>
                  <span className="font-medium">{submission.isRead ? 'نعم' : 'لا'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">النوع:</span>
                  <span className="font-medium">{getFormTypeLabel(submission.formType)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
