'use client';

import { useState } from 'react';
import { formsService } from '@/lib/forms-service';
import { EventPlanningFormData } from '@/lib/api-config';

interface EventPlanningFormProps {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

export default function EventPlanningForm({ onSuccess, onError }: EventPlanningFormProps) {
  const [formData, setFormData] = useState<Partial<EventPlanningFormData>>({
    formType: 'event-planning',
    submitterName: '',
    submitterEmail: '',
    submitterPhone: '',
    organization: '',
    eventType: 'corporate',
    eventTitle: '',
    eventDescription: '',
    eventDate: '',
    eventDuration: 8,
    guestCount: 50,
    venue: '',
    budget: '',
    services: [],
    specialRequirements: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const eventTypes = [
    { value: 'corporate', label: 'فعاليات مؤسسية' },
    { value: 'wedding', label: 'حفلات الزفاف' },
    { value: 'cultural', label: 'فعاليات ثقافية' },
    { value: 'innovation', label: 'فعاليات الابتكار' },
    { value: 'conference', label: 'مؤتمرات' },
    { value: 'other', label: 'أخرى' },
  ];

  const serviceOptions = [
    'إدارة الفعاليات',
    'القاعات والأماكن',
    'الطعام والضيافة',
    'الترفيه والعروض',
    'التصميم والديكور',
    'التكنولوجيا والصوتيات',
    'التصوير والفيديو',
    'الأمن والحماية',
    'النقل والمواصلات',
    'التسويق والإعلان',
  ];

  const handleInputChange = (field: keyof EventPlanningFormData, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleServiceToggle = (service: string) => {
    const currentServices = formData.services || [];
    const newServices = currentServices.includes(service)
      ? currentServices.filter(s => s !== service)
      : [...currentServices, service];
    
    handleInputChange('services', newServices);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    try {
      // التحقق من صحة البيانات
      const validation = formsService.validateFormData('event-planning', formData as EventPlanningFormData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      // إرسال البيانات
      const result = await formsService.submitEventPlanningForm(formData as EventPlanningFormData);
      
      if (onSuccess) {
        onSuccess(result);
      }

      // إعادة تعيين النموذج
      setFormData({
        formType: 'event-planning',
        submitterName: '',
        submitterEmail: '',
        submitterPhone: '',
        organization: '',
        eventType: 'corporate',
        eventTitle: '',
        eventDescription: '',
        eventDate: '',
        eventDuration: 8,
        guestCount: 50,
        venue: '',
        budget: '',
        services: [],
        specialRequirements: '',
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء إرسال النموذج';
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
          نموذج تخطيط الفعاليات
        </h2>
        <p className="text-gray-600">
          املأ هذا النموذج للحصول على استشارة مجانية لتخطيط فعاليتك
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
              المؤسسة أو الشركة *
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
              placeholder="اسم المؤسسة أو الشركة"
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
        </div>

        {/* تفاصيل الفعالية */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-[var(--navy)] border-b border-gray-200 pb-2">
            تفاصيل الفعالية
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع الفعالية *
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => handleInputChange('eventType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
                required
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ الفعالية *
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => handleInputChange('eventDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان الفعالية *
            </label>
            <input
              type="text"
              value={formData.eventTitle}
              onChange={(e) => handleInputChange('eventTitle', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
              placeholder="عنوان الفعالية"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف الفعالية
            </label>
            <textarea
              value={formData.eventDescription}
              onChange={(e) => handleInputChange('eventDescription', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
              placeholder="اكتب وصفاً تفصيلياً للفعالية..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مدة الفعالية (بالساعات) *
              </label>
              <input
                type="number"
                min="1"
                max="72"
                value={formData.eventDuration}
                onChange={(e) => handleInputChange('eventDuration', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عدد الضيوف المتوقع *
              </label>
              <input
                type="number"
                min="1"
                value={formData.guestCount}
                onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الميزانية المتوقعة
              </label>
              <select
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
              >
                <option value="">اختر الميزانية</option>
                <option value="less-than-50k">أقل من 50,000 ريال</option>
                <option value="50k-100k">50,000 - 100,000 ريال</option>
                <option value="100k-250k">100,000 - 250,000 ريال</option>
                <option value="250k-500k">250,000 - 500,000 ريال</option>
                <option value="more-than-500k">أكثر من 500,000 ريال</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المكان المقترح (اختياري)
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => handleInputChange('venue', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
              placeholder="اسم المكان أو المنطقة المفضلة"
            />
          </div>
        </div>

        {/* الخدمات المطلوبة */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[var(--navy)] border-b border-gray-200 pb-2">
            الخدمات المطلوبة
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {serviceOptions.map(service => (
              <label key={service} className="flex items-center space-x-2 rtl:space-x-reverse">
                <input
                  type="checkbox"
                  checked={(formData.services || []).includes(service)}
                  onChange={() => handleServiceToggle(service)}
                  className="rounded border-gray-300 text-[var(--coral)] focus:ring-[var(--coral)]"
                />
                <span className="text-sm text-gray-700">{service}</span>
              </label>
            ))}
          </div>
        </div>

        {/* متطلبات خاصة */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            متطلبات خاصة أو ملاحظات إضافية
          </label>
          <textarea
            value={formData.specialRequirements}
            onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
            placeholder="أي متطلبات خاصة أو تفاصيل إضافية..."
          />
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
            {isSubmitting ? 'جارٍ الإرسال...' : 'إرسال طلب التخطيط'}
          </button>
        </div>
      </form>
    </div>
  );
}
