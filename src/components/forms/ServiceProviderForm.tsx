'use client';

import { useState } from 'react';
import { formsService } from '@/lib/forms-service';
import { ServiceProviderApplicationFormData } from '@/lib/api-config';

interface ServiceProviderFormProps {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

export default function ServiceProviderForm({ onSuccess, onError }: ServiceProviderFormProps) {
  const [formData, setFormData] = useState<Partial<ServiceProviderApplicationFormData>>({
    formType: 'service-provider',
    submitterName: '',
    submitterEmail: '',
    submitterPhone: '',
    companyName: '',
    serviceCategory: 'venue',
    businessLicense: '',
    experience: '',
    portfolioUrl: '',
    servicesOffered: [],
    coverageAreas: [],
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const serviceCategories = [
    { value: 'venue', label: 'قاعات وأماكن الفعاليات' },
    { value: 'catering', label: 'التموين والضيافة' },
    { value: 'entertainment', label: 'الترفيه والعروض' },
    { value: 'design', label: 'التصميم والديكور' },
    { value: 'technology', label: 'التكنولوجيا والصوتيات' },
    { value: 'photography', label: 'التصوير والفيديو' },
    { value: 'security', label: 'الأمن والحماية' },
    { value: 'transportation', label: 'النقل والمواصلات' },
    { value: 'other', label: 'أخرى' },
  ];

  const saudiCities = [
    'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الظهران',
    'تبوك', 'بريدة', 'خميس مشيط', 'حائل', 'المجمعة', 'الجبيل', 'الطائف', 'ينبع',
    'الأحساء', 'القطيف', 'أبها', 'نجران', 'جازان', 'الباحة', 'سكاكا', 'عرعر'
  ];

  const handleInputChange = (field: keyof ServiceProviderApplicationFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleServiceToggle = (service: string) => {
    const currentServices = formData.servicesOffered || [];
    const newServices = currentServices.includes(service)
      ? currentServices.filter(s => s !== service)
      : [...currentServices, service];
    
    handleInputChange('servicesOffered', newServices);
  };

  const handleCityToggle = (city: string) => {
    const currentCities = formData.coverageAreas || [];
    const newCities = currentCities.includes(city)
      ? currentCities.filter(c => c !== city)
      : [...currentCities, city];
    
    handleInputChange('coverageAreas', newCities);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      // التحقق من صحة البيانات
      const validation = formsService.validateFormData('service-provider', formData as ServiceProviderApplicationFormData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      // إرسال البيانات
      const result = await formsService.submitServiceProviderApplication(formData as ServiceProviderApplicationFormData);
      
      if (onSuccess) {
        onSuccess(result);
      }

      // إعادة تعيين النموذج
      setFormData({
        formType: 'service-provider',
        submitterName: '',
        submitterEmail: '',
        submitterPhone: '',
        companyName: '',
        serviceCategory: 'venue',
        businessLicense: '',
        experience: '',
        portfolioUrl: '',
        servicesOffered: [],
        coverageAreas: [],
        description: '',
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال الطلب';
      setErrors([errorMessage]);
      
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[var(--navy)] mb-4">
          طلب الانضمام كمقدم خدمة
        </h2>
        <p className="text-gray-600">
          انضم إلى منصتنا كمقدم خدمة وكن جزءاً من النظام البيئي للفعاليات في السعودية
        </p>
      </div>

      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <ul className="text-red-600 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* معلومات المرسل */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-[var(--navy)] border-b border-gray-200 pb-2">
            المعلومات الشخصية
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل *
              </label>
              <input
                type="text"
                value={formData.submitterName}
                onChange={(e) => handleInputChange('submitterName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
                placeholder="اسمك الكامل"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                value={formData.submitterEmail}
                onChange={(e) => handleInputChange('submitterEmail', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف *
              </label>
              <input
                type="tel"
                value={formData.submitterPhone}
                onChange={(e) => handleInputChange('submitterPhone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
                placeholder="+966 XXX XXX XXX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم الشركة أو المؤسسة *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
                placeholder="اسم الشركة"
                required
              />
            </div>
          </div>
        </div>

        {/* معلومات الخدمة */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-[var(--navy)] border-b border-gray-200 pb-2">
            معلومات الخدمة
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                فئة الخدمة *
              </label>
              <select
                value={formData.serviceCategory}
                onChange={(e) => handleInputChange('serviceCategory', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
                required
              >
                {serviceCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم السجل التجاري *
              </label>
              <input
                type="text"
                value={formData.businessLicense}
                onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
                placeholder="رقم السجل التجاري"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                سنوات الخبرة *
              </label>
              <select
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
                required
              >
                <option value="">اختر سنوات الخبرة</option>
                <option value="less-than-1">أقل من سنة</option>
                <option value="1-3">1-3 سنوات</option>
                <option value="3-5">3-5 سنوات</option>
                <option value="5-10">5-10 سنوات</option>
                <option value="more-than-10">أكثر من 10 سنوات</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رابط المعرض (اختياري)
              </label>
              <input
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
                placeholder="https://your-portfolio.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              الخدمات المقدمة (يمكن اختيار أكثر من خدمة)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {serviceCategories.map(service => (
                <label key={service.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={(formData.servicesOffered || []).includes(service.label)}
                    onChange={() => handleServiceToggle(service.label)}
                    className="rounded border-gray-300 text-[var(--coral)] focus:ring-[var(--coral)]"
                  />
                  <span className="text-sm text-gray-700">{service.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              المناطق المخدومة (يمكن اختيار أكثر من منطقة)
            </label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {saudiCities.map(city => (
                <label key={city} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={(formData.coverageAreas || []).includes(city)}
                    onChange={() => handleCityToggle(city)}
                    className="rounded border-gray-300 text-[var(--coral)] focus:ring-[var(--coral)]"
                  />
                  <span className="text-sm text-gray-700">{city}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف الخدمات والخبرات *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
              placeholder="اكتب وصفاً تفصيلياً عن خدماتك وخبراتك السابقة..."
              required
            />
          </div>
        </div>

        {/* زر الإرسال */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-4 rounded-full font-semibold text-white transition-all transform hover:scale-105 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[var(--coral)] hover:bg-opacity-90 shadow-lg hover:shadow-xl'
            }`}
          >
            {isSubmitting ? 'جارٍ الإرسال...' : 'تقديم طلب الانضمام'}
          </button>
        </div>
      </form>
    </div>
  );
}
