'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { FormSubmission } from '@/lib/api-config';
import Link from 'next/link';

export default function FormsManagementPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormType, setSelectedFormType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadSubmissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Mock data - replace with actual API call
      const mockSubmissions: FormSubmission[] = [
        {
          id: 1,
          formType: 'contact',
          submitterName: 'أحمد محمد',
          submitterEmail: 'ahmed@example.com',
          submitterPhone: '+966501234567',
          message: 'أرغب في الاستفسار عن خدمات تنظيم الفعاليات للشركات. نحن شركة ناشئة نبحث عن شريك موثوق لتنظيم فعالياتنا.',
          status: 'new',
          isRead: false,
          submittedAt: new Date().toISOString(),
          additionalData: {
            organization: 'شركة التقنية المتقدمة',
            eventType: 'مؤتمر تقني',
            eventDate: '2024-03-15',
            guestCount: '100',
            budget: '50000-100000'
          }
        },
        {
          id: 2,
          formType: 'event-planning',
          submitterName: 'فاطمة العلي',
          submitterEmail: 'fatima@company.com',
          submitterPhone: '+966507654321',
          message: 'نحتاج لتنظيم مؤتمر تقني لشركتنا بحضور 200 شخص مع جميع التجهيزات التقنية والتصوير المباشر.',
          status: 'inProgress',
          isRead: true,
          submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          adminNotes: 'تم التواصل مع العميل وتحديد موعد للاجتماع'
        },
        {
          id: 3,
          formType: 'service-provider',
          submitterName: 'محمد الشهري',
          submitterEmail: 'mohammed@catering.com',
          submitterPhone: '+966501111111',
          message: 'أود التقدم كمقدم خدمات تموين للفعاليات. لدينا خبرة 10 سنوات في المجال.',
          status: 'completed',
          isRead: true,
          submittedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          adminNotes: 'تم قبول المقدم وإضافته للشبكة'
        },
        {
          id: 4,
          formType: 'partnership',
          submitterName: 'نوره السالم',
          submitterEmail: 'norah@university.edu.sa',
          submitterPhone: '+966509999999',
          message: 'نود إقامة شراكة استراتيجية مع شركتكم لتنظيم فعاليات جامعية متميزة.',
          status: 'new',
          isRead: false,
          submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 5,
          formType: 'feedback',
          submitterName: 'عبدالله الحربي',
          submitterEmail: 'abdullah@email.com',
          submitterPhone: '+966508888888',
          message: 'كان الحدث رائعاً جداً وتنظيم ممتاز، أتطلع للمشاركة في الفعاليات القادمة. شكراً لكم.',
          status: 'archived',
          isRead: true,
          submittedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
        }
      ];

      // Filter submissions based on search and filters
      let filteredSubmissions = mockSubmissions;

      if (searchTerm) {
        filteredSubmissions = filteredSubmissions.filter(s => 
          s.submitterName.includes(searchTerm) || 
          s.submitterEmail.includes(searchTerm) || 
          s.message.includes(searchTerm)
        );
      }

      if (selectedFormType !== 'all') {
        filteredSubmissions = filteredSubmissions.filter(s => s.formType === selectedFormType);
      }

      if (selectedStatus !== 'all') {
        filteredSubmissions = filteredSubmissions.filter(s => s.status === selectedStatus);
      }

      setSubmissions(filteredSubmissions);
      setTotalPages(Math.ceil(filteredSubmissions.length / 10));

    } catch (error) {
      console.error('Failed to load submissions:', error);
      setError('فشل في تحميل الطلبات');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedFormType, selectedStatus]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const handleMarkAsRead = async (id: number) => {
    try {
      setSubmissions(prev => 
        prev.map(submission => 
          submission.id === id ? { ...submission, isRead: true } : submission
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      setSubmissions(prev => 
        prev.map(submission => 
          submission.id === id ? { ...submission, status: newStatus } : submission
        )
      );
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'inProgress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <nav className="flex space-x-4 text-sm text-gray-500 mb-2">
                <Link href="/dashboard" className="hover:text-gray-700">لوحة التحكم</Link>
                <span>/</span>
                <span className="text-gray-900">إدارة النماذج</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">إدارة النماذج</h1>
              <p className="text-gray-600">إدارة ومراجعة جميع طلبات النماذج</p>
            </div>
            <Button onClick={() => window.print()}>
              🖨️ طباعة التقرير
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
              <Input
                placeholder="البحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedFormType('all');
                setSelectedStatus('all');
              }}>
                إعادة تعيين
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{submissions.length}</div>
              <div className="text-sm text-gray-600">إجمالي الطلبات</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {submissions.filter(s => s.status === 'new').length}
              </div>
              <div className="text-sm text-gray-600">جديد</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {submissions.filter(s => s.status === 'inProgress').length}
              </div>
              <div className="text-sm text-gray-600">قيد العمل</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {submissions.filter(s => s.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">مكتمل</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {submissions.filter(s => s.status === 'archived').length}
              </div>
              <div className="text-sm text-gray-600">أرشيف</div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle>قائمة الطلبات ({submissions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.length > 0 ? (
                submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`p-6 border-2 rounded-lg ${
                      submission.isRead ? 'bg-white' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold">{submission.submitterName}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(submission.status)}`}>
                          {submission.status === 'new' ? 'جديد' : 
                           submission.status === 'inProgress' ? 'قيد العمل' : 
                           submission.status === 'completed' ? 'مكتمل' : 'أرشيف'}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {getFormTypeLabel(submission.formType)}
                        </span>
                        {!submission.isRead && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            غير مقروء
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <select
                          value={submission.status}
                          onChange={(e) => submission.id && handleStatusChange(submission.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="new">جديد</option>
                          <option value="inProgress">قيد العمل</option>
                          <option value="completed">مكتمل</option>
                          <option value="archived">أرشيف</option>
                        </select>
                        {!submission.isRead && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => submission.id && handleMarkAsRead(submission.id)}
                          >
                            تمييز كمقروء
                          </Button>
                        )}
                        <Button size="sm">
                          رد
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">البريد الإلكتروني:</p>
                        <p className="font-medium">{submission.submitterEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">رقم الهاتف:</p>
                        <p className="font-medium">{submission.submitterPhone}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">الرسالة:</p>
                      <p className="text-gray-800 bg-gray-50 p-3 rounded">{submission.message}</p>
                    </div>

                    {submission.adminNotes && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">ملاحظات الإدارة:</p>
                        <p className="text-gray-800 bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                          {submission.adminNotes}
                        </p>
                      </div>
                    )}

                    {submission.additionalData && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">بيانات إضافية:</p>
                        <div className="bg-gray-50 p-3 rounded">
                          {Object.entries(submission.additionalData).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-1">
                              <span className="text-sm text-gray-600">{key}:</span>
                              <span className="text-sm font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>تاريخ الإرسال: {formatDate(submission.submittedAt || '')}</span>
                      <span>ID: #{submission.id}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
                  <p className="text-gray-500">لا توجد طلبات تطابق المعايير المحددة</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  السابق
                </Button>
                <span className="flex items-center px-4">
                  صفحة {currentPage} من {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  التالي
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
