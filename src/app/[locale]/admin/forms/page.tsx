'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ClientOnly from '../../../../components/ClientOnly';

interface FormData {
  id: number;
  formType: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  message: string;
  status: 'new' | 'inProgress' | 'completed' | 'archived';
  isRead: boolean;
  submittedAt: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags?: string[];
  assignedTo?: string;
  adminNotes?: string;
  additionalData?: Record<string, any>;
}

export default function AdminFormsDataPage() {
  const params = useParams();
  const locale = params.locale as string;

  const [formData, setFormData] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormType, setSelectedFormType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data - in real app, this would come from API
  const mockFormData: FormData[] = [
    {
      id: 1,
      formType: 'contact',
      submitterName: 'أحمد محمد',
      submitterEmail: 'ahmed.mohamed@email.com',
      submitterPhone: '+966501234567',
      message: 'أرغب في الاستفسار عن خدمات تنظيم الفعاليات للشركات. نحن شركة ناشئة نبحث عن شريك موثوق لتنظيم فعالياتنا التقنية.',
      status: 'new',
      isRead: false,
      submittedAt: '2024-01-15T10:30:00Z',
      priority: 'high',
      tags: ['استفسار', 'شركات', 'تقنية'],
      additionalData: {
        organization: 'شركة التقنية المتقدمة',
        eventType: 'مؤتمر تقني',
        budget: '50000-100000'
      }
    },
    {
      id: 2,
      formType: 'event-planning',
      submitterName: 'فاطمة العلي',
      submitterEmail: 'fatima.ali@company.com',
      submitterPhone: '+966507654321',
      message: 'نحتاج لتنظيم مؤتمر تقني لشركتنا بحضور 200 شخص مع جميع التجهيزات التقنية والتصوير المباشر.',
      status: 'inProgress',
      isRead: true,
      submittedAt: '2024-01-14T14:45:00Z',
      priority: 'urgent',
      assignedTo: 'سارة أحمد',
      adminNotes: 'تم التواصل مع العميل وتحديد موعد للاجتماع يوم الأحد',
      tags: ['مؤتمر', 'تقني', 'شركات'],
      additionalData: {
        eventDate: '2024-03-15',
        guestCount: '200',
        location: 'الرياض'
      }
    },
    {
      id: 3,
      formType: 'service-provider',
      submitterName: 'محمد الشهري',
      submitterEmail: 'mohammed.alshehri@catering.com',
      submitterPhone: '+966501111111',
      message: 'أود التقدم كمقدم خدمات تموين للفعاليات. لدينا خبرة 10 سنوات في المجال وفريق متخصص.',
      status: 'completed',
      isRead: true,
      submittedAt: '2024-01-13T09:15:00Z',
      priority: 'medium',
      assignedTo: 'عبدالله محمد',
      adminNotes: 'تم قبول المقدم وإضافته للشبكة بعد مراجعة الوثائق',
      tags: ['مقدم خدمة', 'تموين', 'خبرة'],
      additionalData: {
        serviceType: 'تموين',
        experience: '10 سنوات',
        teamSize: '15'
      }
    },
    {
      id: 4,
      formType: 'partnership',
      submitterName: 'نوره السالم',
      submitterEmail: 'norah.salem@university.edu.sa',
      submitterPhone: '+966509999999',
      message: 'نود إقامة شراكة استراتيجية مع شركتكم لتنظيم فعاليات جامعية متميزة وورش عمل للطلاب.',
      status: 'new',
      isRead: false,
      submittedAt: '2024-01-15T16:20:00Z',
      priority: 'high',
      tags: ['شراكة', 'جامعة', 'طلاب'],
      additionalData: {
        organization: 'جامعة الملك سعود',
        partnershipType: 'استراتيجية',
        duration: 'سنة واحدة'
      }
    },
    {
      id: 5,
      formType: 'feedback',
      submitterName: 'عبدالله الحربي',
      submitterEmail: 'abdullah.alharbi@email.com',
      submitterPhone: '+966508888888',
      message: 'كان الحدث رائعاً جداً وتنظيم ممتاز، أتطلع للمشاركة في الفعاليات القادمة. شكراً لكم على الجهود المبذولة.',
      status: 'archived',
      isRead: true,
      submittedAt: '2024-01-12T19:30:00Z',
      priority: 'low',
      tags: ['تقييم إيجابي', 'شكر'],
      additionalData: {
        eventAttended: 'مؤتمر التقنية 2024',
        rating: '5/5'
      }
    },
    {
      id: 6,
      formType: 'contact',
      submitterName: 'سعد الغامدي',
      submitterEmail: 'saad.alghamdi@business.com',
      submitterPhone: '+966502222222',
      message: 'نحن شركة ناشئة في مجال التكنولوجيا المالية ونريد تنظيم فعالية إطلاق منتجنا الجديد.',
      status: 'inProgress',
      isRead: true,
      submittedAt: '2024-01-14T11:10:00Z',
      priority: 'medium',
      assignedTo: 'خالد أحمد',
      tags: ['إطلاق منتج', 'تكنولوجيا مالية'],
      additionalData: {
        productType: 'تطبيق دفع',
        launchDate: '2024-02-28'
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setFormData(mockFormData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Prevent hydration issues by not rendering until mounted
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  // Filter data based on search and filters
  const filteredData = formData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.submitterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.submitterEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFormType = selectedFormType === 'all' || item.formType === selectedFormType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;

    return matchesSearch && matchesFormType && matchesStatus && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleStatusChange = (id: number, newStatus: string) => {
    setFormData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: newStatus as any } : item
      )
    );
  };

  const handleMarkAsRead = (id: number) => {
    setFormData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isRead: true } : item
      )
    );
  };

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,نوع النموذج,اسم المرسل,البريد الإلكتروني,رقم الهاتف,الرسالة,الحالة,الأولوية,تاريخ الإرسال\n"
      + filteredData.map(item => 
          `${item.id},"${item.formType}","${item.submitterName}","${item.submitterEmail}","${item.submitterPhone}","${item.message}","${item.status}","${item.priority}","${item.submittedAt}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `form_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const getStatusColor = (status: string) => {
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
    if (typeof window === 'undefined') return dateString;
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
          <p className="mt-4 text-gray-600">جاري تحميل بيانات النماذج...</p>
        </div>
      </div>
    );
  }

  return (
    <ClientOnly fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div></div>}>
      <div className="min-h-screen bg-gray-50" suppressHydrationWarning={true}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <nav className="flex gap-2 text-sm text-gray-500 mb-2">
                <Link href={`/${locale}/admin`} className="hover:text-gray-700">
                  لوحة التحكم الإدارية
                </Link>
                <span>/</span>
                <span className="text-gray-900">بيانات النماذج</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">بيانات النماذج</h1>
              <p className="text-gray-600">عرض وإدارة جميع طلبات النماذج المرسلة</p>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleExportData} variant="outline">
                📊 تصدير البيانات
              </Button>
              <Link href={`/${locale}/admin`}>
                <Button variant="outline">
                  ← العودة للرئيسية
                </Button>
              </Link>
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

        {/* Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
              <div className="text-sm text-gray-600">إجمالي الطلبات</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredData.filter(item => item.status === 'new').length}
              </div>
              <div className="text-sm text-gray-600">جديد</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredData.filter(item => item.status === 'inProgress').length}
              </div>
              <div className="text-sm text-gray-600">قيد العمل</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredData.filter(item => item.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">مكتمل</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredData.filter(item => item.priority === 'urgent').length}
              </div>
              <div className="text-sm text-gray-600">عاجل</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>فلترة البيانات</CardTitle>
            <CardDescription>استخدم الفلاتر للبحث في البيانات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input
                placeholder="البحث في النصوص..."
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
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">جميع الأولويات</option>
                <option value="urgent">عاجل</option>
                <option value="high">عالية</option>
                <option value="medium">متوسطة</option>
                <option value="low">منخفضة</option>
              </select>
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFormType('all');
                  setSelectedStatus('all');
                  setSelectedPriority('all');
                  setCurrentPage(1);
                }}
                variant="outline"
              >
                إعادة تعيين
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>بيانات النماذج ({filteredData.length})</CardTitle>
                <CardDescription>عرض مفصل لجميع الطلبات والبيانات</CardDescription>
              </div>
              <div className="text-sm text-gray-500">
                صفحة {currentPage} من {totalPages}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {currentData.length > 0 ? (
                currentData.map((item) => (
                  <div
                    key={item.id}
                    className={`p-6 border-2 rounded-lg transition-all ${
                      item.isRead ? 'bg-white' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.submitterName}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(item.status)}`}>
                          {item.status === 'new' ? 'جديد' : 
                           item.status === 'inProgress' ? 'قيد العمل' : 
                           item.status === 'completed' ? 'مكتمل' : 'أرشيف'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(item.priority)}`}>
                          {item.priority === 'urgent' ? 'عاجل' : 
                           item.priority === 'high' ? 'عالية' : 
                           item.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                        </span>
                        {!item.isRead && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            غير مقروء
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: #{item.id}
                      </div>
                    </div>

                    {/* Form Type */}
                    <div className="mb-4">
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                        {getFormTypeLabel(item.formType)}
                      </span>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">البريد الإلكتروني:</p>
                        <p className="font-medium">{item.submitterEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">رقم الهاتف:</p>
                        <p className="font-medium">{item.submitterPhone}</p>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">الرسالة:</p>
                      <p className="text-gray-800 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
                        {item.message}
                      </p>
                    </div>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">الكلمات المفتاحية:</p>
                        <div className="flex flex-wrap gap-2">
                          {item.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Data */}
                    {item.additionalData && Object.keys(item.additionalData).length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">بيانات إضافية:</p>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          {Object.entries(item.additionalData).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-1 border-b border-gray-200 last:border-0">
                              <span className="text-sm text-gray-600">{key}:</span>
                              <span className="text-sm font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assignment and Notes */}
                    {item.assignedTo && (
                      <div className="mb-4">
                        <p className="text-sm text-blue-600">
                          👤 مُعيَّن إلى: {item.assignedTo}
                        </p>
                      </div>
                    )}

                    {item.adminNotes && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">ملاحظات الإدارة:</p>
                        <p className="text-gray-800 bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                          {item.adminNotes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      {!item.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(item.id)}
                        >
                          ✓ تمييز كمقروء
                        </Button>
                      )}
                      
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="new">جديد</option>
                        <option value="inProgress">قيد العمل</option>
                        <option value="completed">مكتمل</option>
                        <option value="archived">أرشيف</option>
                      </select>

                      <Button size="sm" variant="outline">
                        📄 التفاصيل الكاملة
                      </Button>
                      
                      <Button size="sm" variant="outline">
                        💬 إضافة رد
                      </Button>

                      <Button size="sm" variant="outline">
                        📧 إرسال بريد
                      </Button>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center text-sm text-gray-500 mt-4 pt-4 border-t">
                      <span>تاريخ الإرسال: {formatDate(item.submittedAt)}</span>
                      <span>نوع النموذج: {getFormTypeLabel(item.formType)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد بيانات</h3>
                  <p className="text-gray-500">لا توجد طلبات تطابق الفلاتر المحددة</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  ← السابق
                </Button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  التالي →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </ClientOnly>
  );
}