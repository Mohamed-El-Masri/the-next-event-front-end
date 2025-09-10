'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('dashboard');
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
      setError(t('errors.loadSubmissions'));
    }
  }, [selectedFormType, searchTerm, currentPage]);

  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch statistics
      const statsData = await dashboardService.getDashboardStats();
      setStats(statsData);

      // Fetch submissions with filters
      await loadSubmissions();

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError(t('errors.loadDashboard'));
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
      await loadSubmissions(); // Reload data
    } catch (error) {
      console.error('Failed to mark as read:', error);
      setError(t('errors.markAsRead'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      setIsUpdating(true);
      await dashboardService.updateSubmissionStatus(id, newStatus);
      await loadSubmissions(); // Reload data
      await loadDashboardData(); // Reload statistics
    } catch (error) {
      console.error('Failed to update status:', error);
      setError(t('errors.updateStatus'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSubmission = async (id: number) => {
    if (!confirm(t('confirmations.deleteSubmission'))) {
      return;
    }

    try {
      setIsUpdating(true);
      await dashboardService.deleteSubmission(id);
      await loadSubmissions();
      await loadDashboardData();
    } catch (error) {
      console.error('Failed to delete submission:', error);
      setError(t('errors.deleteSubmission'));
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
      
      // Create download link
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
      setError(t('errors.exportData'));
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
      // Even if request fails, redirect to login
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
      case 'urgent': return t('forms.priority.urgent');
      case 'high': return t('forms.priority.high');
      case 'medium': return t('forms.priority.medium');
      case 'low': return t('forms.priority.low');
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
      case 'contact': return t('forms.formTypes.contact');
      case 'event-planning': return t('forms.formTypes.eventPlanning');
      case 'service-provider': return t('forms.formTypes.serviceProvider');
      case 'partnership': return t('forms.formTypes.partnership');
      case 'feedback': return t('forms.formTypes.feedback');
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
          <p className="mt-4 text-gray-600">{t('loading')}</p>
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
              <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-gray-600">{t('welcome')}</p>
            </div>
            <div className="flex space-x-4">
              <Button 
                onClick={handleExportData} 
                variant="outline"
                disabled={isUpdating}
              >
                {isUpdating ? '⏳' : '📊'} {t('exportData')}
              </Button>
              <Button onClick={handleLogout}>
                {t('logout')}
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
                {t('overview.totalSubmissions')}
              </CardTitle>
              <span className="text-2xl">📝</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
              <p className="text-xs text-gray-500">+12% {t('overview.monthlyGrowth')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('overview.pendingReviews')}
              </CardTitle>
              <span className="text-2xl">⏳</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReviews}</div>
              <p className="text-xs text-gray-500">{t('overview.needsReview')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('overview.completedForms')}
              </CardTitle>
              <span className="text-2xl">👥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedForms}</div>
              <p className="text-xs text-gray-500">{t('overview.completedForm')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('overview.totalRevenue')}
              </CardTitle>
              <span className="text-2xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}{locale === 'ar' ? ' ر.س' : ' SAR'}</div>
              <p className="text-xs text-gray-500">+{stats.monthlyGrowth}% {t('overview.thisMonth')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('overview.systemStatus')}
              </CardTitle>
              <span className="text-2xl">
                {stats.systemStatus === 'online' ? '✅' : stats.systemStatus === 'maintenance' ? '🔧' : '❌'}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{stats.systemStatus}</div>
              <p className="text-xs text-gray-500">{t('overview.lastUpdate')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📋</span>
                <span>{t('quickActions.formSubmissions.title')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{t('quickActions.formSubmissions.description')}</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📄</span>
                <span>{t('quickActions.contentManagement.title')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{t('quickActions.contentManagement.description')}</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🖼️</span>
                <span>{t('quickActions.mediaLibrary.title')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{t('quickActions.mediaLibrary.description')}</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📈</span>
                <span>{t('quickActions.analytics.title')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{t('quickActions.analytics.description')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{t('forms.title')}</CardTitle>
                <CardDescription>{t('forms.description')}</CardDescription>
              </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder={t('searchPlaceholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                      <select
                        value={selectedFormType}
                        onChange={(e) => setSelectedFormType(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="all">{t('allForms')}</option>
                        <option value="contact">{t('forms.contact')}</option>
                        <option value="event-planning">{t('forms.eventPlanning')}</option>
                        <option value="service-provider">{t('forms.serviceProvider')}</option>
                        <option value="partnership">{t('forms.partnership')}</option>
                        <option value="feedback">{t('forms.feedback')}</option>
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
                        {t('clearFilters')}
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
                            {submission.status === 'new' ? t('forms.status.new') : submission.status === 'inProgress' ? t('forms.status.inProgress') : submission.status === 'completed' ? t('forms.status.completed') : t('forms.status.archived')}
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
                              {t('forms.submittedAt')} {submission.submittedAt && formatDate(submission.submittedAt)}
                            </p>
                            {submission.lastUpdated && (
                              <p className="text-xs text-gray-500">
                                {t('forms.lastUpdated')} {formatDate(submission.lastUpdated)}
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
                            👤 {t('forms.assignedTo')} {submission.assignedTo}
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
                          ✓ {t('forms.markAsRead')}
                        </Button>
                      )}
                      
                      <select
                        value={submission.status}
                        onChange={(e) => submission.id && handleUpdateStatus(submission.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                        disabled={isUpdating}
                      >
                        <option value="new">{t('forms.status.new')}</option>
                        <option value="inProgress">{t('forms.status.inProgress')}</option>
                        <option value="completed">{t('forms.status.completed')}</option>
                        <option value="archived">{t('forms.status.archived')}</option>
                      </select>

                      <Button
                        size="sm"
                        onClick={() => router.push(`/${locale}/dashboard/submissions/${submission.id}`)}
                      >
                        📄 {t('forms.details')}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/${locale}/dashboard/reply/${submission.id}`)}
                      >
                        💬 {t('forms.reply')}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => submission.id && handleDeleteSubmission(submission.id)}
                        disabled={isUpdating}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️ {t('forms.delete')}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">{t('forms.noSubmissions')}</p>
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
                    {t('forms.pagination.previous')}
                  </Button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    {t('forms.pagination.page')} {currentPage} {t('forms.pagination.of')} {totalPages}
                  </span>
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || isUpdating}
                  >
                    {t('forms.pagination.next')}
                  </Button>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => router.push(`/${locale}/dashboard/submissions`)}
                >
                  {t('forms.viewAll')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
