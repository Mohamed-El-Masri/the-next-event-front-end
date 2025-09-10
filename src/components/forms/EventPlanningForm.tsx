'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { formsService } from '@/lib/forms-service';
import { EventPlanningFormData } from '@/lib/api-config';

interface EventPlanningFormProps {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

export default function EventPlanningForm({ onSuccess, onError }: EventPlanningFormProps) {
  const t = useTranslations('forms.eventPlanning');
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
    { value: 'corporate', label: t('eventTypes.corporate') },
    { value: 'wedding', label: t('eventTypes.wedding') },
    { value: 'cultural', label: t('eventTypes.cultural') },
    { value: 'innovation', label: t('eventTypes.innovation') },
    { value: 'conference', label: t('eventTypes.conference') },
    { value: 'other', label: t('eventTypes.other') },
  ];

  const serviceOptions = [
    t('services.eventManagement'),
    t('services.venuesPlaces'),
    t('services.foodHospitality'),
    t('services.entertainmentShows'),
    t('services.designDecoration'),
    t('services.technologyAudio'),
    t('services.photographyVideo'),
    t('services.securityProtection'),
    t('services.transportation'),
    t('services.marketingAdvertising'),
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
      const validation = formsService.validateFormData('event-planning', formData as EventPlanningFormData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      const result = await formsService.submitEventPlanningForm(formData as EventPlanningFormData);
      
      if (onSuccess) {
        onSuccess(result);
      }
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
      const errorMessage = error instanceof Error ? error.message : t('messages.submitError');
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
          {t('title')}
        </h2>
        <p className="text-gray-600">
          {t('subtitle')}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('fields.submitterName.label')}
            </label>
            <input
              type="text"
              value={formData.submitterName}
              onChange={(e) => handleInputChange('submitterName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
              placeholder={t('fields.submitterName.placeholder')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('fields.organization.label')}
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
              placeholder={t('fields.organization.placeholder')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('fields.submitterEmail.label')}
            </label>
            <input
              type="email"
              value={formData.submitterEmail}
              onChange={(e) => handleInputChange('submitterEmail', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
              placeholder={t('fields.submitterEmail.placeholder')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('fields.submitterPhone.label')}
            </label>
            <input
              type="tel"
              value={formData.submitterPhone}
              onChange={(e) => handleInputChange('submitterPhone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
              placeholder={t('fields.submitterPhone.placeholder')}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-[var(--navy)] border-b border-gray-200 pb-2">
            {t('sections.eventDetails')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.eventType.label')}
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
                {t('fields.eventDate.label')}
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
              {t('fields.eventTitle.label')}
            </label>
            <input
              type="text"
              value={formData.eventTitle}
              onChange={(e) => handleInputChange('eventTitle', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
              placeholder={t('fields.eventTitle.placeholder')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('fields.eventDescription.label')}
            </label>
            <textarea
              value={formData.eventDescription}
              onChange={(e) => handleInputChange('eventDescription', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
              placeholder={t('fields.eventDescription.placeholder')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('fields.eventDuration.label')}
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
                {t('fields.guestCount.label')}
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
                {t('fields.budget.label')}
              </label>
              <select
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
              >
                <option value="">{t('budget.placeholder')}</option>
                <option value="less-than-50k">{t('budget.lessThan50k')}</option>
                <option value="50k-100k">{t('budget.50kTo100k')}</option>
                <option value="100k-250k">{t('budget.100kTo250k')}</option>
                <option value="250k-500k">{t('budget.250kTo500k')}</option>
                <option value="more-than-500k">{t('budget.moreThan500k')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('fields.venue.label')}
            </label>
            <input
              type="text"
              value={formData.venue}
              onChange={(e) => handleInputChange('venue', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
              placeholder={t('fields.venue.placeholder')}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-[var(--navy)] border-b border-gray-200 pb-2">
            {t('sections.requiredServices')}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('fields.specialRequirements.label')}
          </label>
          <textarea
            value={formData.specialRequirements}
            onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-[var(--coral)] focus:border-[var(--coral)] transition-colors"
            placeholder={t('fields.specialRequirements.placeholder')}
          />
        </div>

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
            {isSubmitting ? t('buttons.submitting') : t('buttons.submit')}
          </button>
        </div>
      </form>
    </div>
  );
}
