'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { dashboardService, FormSubmissionWithDetails } from '@/lib/dashboard-service';

export default function SubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  
  const [submissions, setSubmissions] = useState<FormSubmissionWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormType, setSelectedFormType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const loadSubmissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await dashboardService.getFormSubmissions({
        formType: selectedFormType !== 'all' ? selectedFormType : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        searchTerm: searchTerm || undefined,
        page: currentPage,
        limit: 20
      });

      setSubmissions(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Failed to load submissions:', error);
      setError('فشل في تحميل الطلبات');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, selectedFormType, selectedStatus]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

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
              <h1 className="text-3xl font-bold text-gray-900">جميع طلبات النماذج</h1>
              <p className="text-gray-600">إدارة ومراجعة جميع الطلبات المرسلة</p>
            </div>
            <Button onClick={() => router.push(`/${locale}/dashboard`)}>
              ← العودة للوحة التحكم
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert className="mb-6" variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>فلترة الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="البحث في الطلبات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
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

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">جميع الحالات</option>
                <option value="new">جديد</option>
                <option value="inProgress">قيد العمل</option>
                <option value="completed">مكتمل</option>
                <option value="archived">أرشيف</option>
              </select>

              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFormType('all');
                  setSelectedStatus('all');
                  setCurrentPage(1);
                }}
                variant="outline"
              >
                مسح الفلاتر
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submissions List */}
        <div className="space-y-4">
          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <Card key={submission.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h4 className="font-semibold text-lg">{submission.submitterName}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {submission.status === 'new' ? 'جديد' : submission.status === 'inProgress' ? 'قيد العمل' : submission.status === 'completed' ? 'مكتمل' : 'أرشيف'}
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
                        </div>
                      </div>

                      <p className="text-sm text-gray-800 mb-3">
                        {submission.message.substring(0, 200)}
                        {submission.message.length > 200 && '...'}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => router.push(`/${locale}/dashboard/submissions/${submission.id}`)}
                      >
                        عرض التفاصيل
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">لا توجد طلبات تطابق المعايير المحددة</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {submissions.length > 0 && (
          <div className="mt-8 flex justify-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ← السابق
            </Button>
            <span className="px-4 py-2 text-sm text-gray-600">
              صفحة {currentPage} من {totalPages}
            </span>
            <Button 
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              التالي →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
