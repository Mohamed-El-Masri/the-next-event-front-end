'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface DashboardStats {
  totalSubmissions: number;
  pendingReviews: number;
  completedForms: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export default function AdminHomePage() {
  const params = useParams();
  const locale = params.locale as string;
  
  const [stats, setStats] = useState<DashboardStats>({
    totalSubmissions: 45,
    pendingReviews: 12,
    completedForms: 33,
    activeUsers: 156,
    totalRevenue: 125000,
    monthlyGrowth: 15.2
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
              <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم الإدارية</h1>
              <p className="text-gray-600">الصفحة الرئيسية</p>
            </div>
            <div className="flex gap-4">
              <Link href={`/${locale}/admin/forms`}>
                <Button variant="outline">
                  📊 بيانات النماذج
                </Button>
              </Link>
              <Button>
                ⚙️ الإعدادات
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl">مرحباً بك في لوحة التحكم</CardTitle>
              <CardDescription className="text-blue-100">
                إدارة موقع الفعاليات التالية - نظرة شاملة على النشاطات والإحصائيات
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
              <span className="text-2xl">📝</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
              <p className="text-xs text-green-600">+{stats.monthlyGrowth}% من الشهر الماضي</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">قيد المراجعة</CardTitle>
              <span className="text-2xl">⏳</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingReviews}</div>
              <p className="text-xs text-gray-500">يحتاج مراجعة عاجلة</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">النماذج المكتملة</CardTitle>
              <span className="text-2xl">✅</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedForms}</div>
              <p className="text-xs text-gray-500">تمت معالجتها بنجاح</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">المستخدمين النشطين</CardTitle>
              <span className="text-2xl">👥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-gray-500">خلال الشهر الحالي</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
              <span className="text-2xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} ر.س</div>
              <p className="text-xs text-green-600">+{stats.monthlyGrowth}% هذا الشهر</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">معدل النمو</CardTitle>
              <span className="text-2xl">📈</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+{stats.monthlyGrowth}%</div>
              <p className="text-xs text-gray-500">نمو شهري ممتاز</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">الإجراءات السريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href={`/${locale}/admin/forms`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <span className="text-lg">بيانات النماذج</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">عرض وإدارة جميع طلبات النماذج</p>
                </CardContent>
              </Card>
            </Link>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">👥</span>
                  <span className="text-lg">إدارة المستخدمين</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">إدارة حسابات المستخدمين والصلاحيات</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <span className="text-lg">إدارة المحتوى</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">تحرير محتوى الموقع والصفحات</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">⚙️</span>
                  <span className="text-lg">إعدادات النظام</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">إعدادات عامة وتكوين النظام</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>النشاطات الأخيرة</CardTitle>
            <CardDescription>آخر الأحداث في النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <span className="text-2xl">📝</span>
                <div className="flex-1">
                  <p className="font-medium">طلب جديد لتنظيم فعالية</p>
                  <p className="text-sm text-gray-600">أحمد محمد - منذ 5 دقائق</p>
                </div>
                <Link href={`/${locale}/admin/forms`}>
                  <Button size="sm" variant="outline">عرض</Button>
                </Link>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <span className="text-2xl">✅</span>
                <div className="flex-1">
                  <p className="font-medium">تم اكمال معالجة طلب شراكة</p>
                  <p className="text-sm text-gray-600">فاطمة العلي - منذ 15 دقيقة</p>
                </div>
                <Button size="sm" variant="outline">عرض</Button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
                <span className="text-2xl">⏳</span>
                <div className="flex-1">
                  <p className="font-medium">طلب مقدم خدمة قيد المراجعة</p>
                  <p className="text-sm text-gray-600">محمد الشهري - منذ ساعة</p>
                </div>
                <Button size="sm" variant="outline">مراجعة</Button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                <span className="text-2xl">💭</span>
                <div className="flex-1">
                  <p className="font-medium">تقييم جديد للخدمات</p>
                  <p className="text-sm text-gray-600">نوره السالم - منذ ساعتين</p>
                </div>
                <Button size="sm" variant="outline">قراءة</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}