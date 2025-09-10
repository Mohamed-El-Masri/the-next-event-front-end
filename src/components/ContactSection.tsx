'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Mail, Phone, Send, Loader2 } from 'lucide-react';

interface FormData {
  name: string;
  organization: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactSection() {
  const locale = useLocale();
  const t = useTranslations();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    organization: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // TODO: Integrate with backend API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setSubmitStatus('success');
      setFormData({
        name: '',
        organization: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact" 
      className="py-16 lg:py-20"
      style={{ backgroundColor: 'var(--navy)' }}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            {t('contact.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Email */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--coral)' }}
              >
                <Mail size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {t('contact.info.email')}
                </h3>
                <p 
                  className="text-lg"
                  style={{ color: 'var(--teal)' }}
                >
                  info@thenextevent.sa
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--coral)' }}
              >
                <Phone size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {t('contact.info.phone')}
                </h3>
                <p 
                  className="text-lg"
                  style={{ color: 'var(--teal)' }}
                >
                  +966 123 456 789
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {t('contact.info.followUs')}
              </h3>
              <div className="flex space-x-4 rtl:space-x-reverse">
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: 'var(--teal)' }}
                >
                  <span className="text-white text-xl">💼</span>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: 'var(--teal)' }}
                >
                  <span className="text-white text-xl">📷</span>
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: 'var(--teal)' }}
                >
                  <span className="text-white text-xl">🐦</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: 'var(--navy)' }}
                >
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('contact.form.namePlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label 
                  htmlFor="organization" 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: 'var(--navy)' }}
                >
                  {t('contact.form.organization')}
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder={t('contact.form.organizationPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: 'var(--navy)' }}
                >
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('contact.form.emailPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label 
                  htmlFor="phone" 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: 'var(--navy)' }}
                >
                  {t('contact.form.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t('contact.form.phonePlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label 
                  htmlFor="message" 
                  className="block text-sm font-semibold mb-2"
                  style={{ color: 'var(--navy)' }}
                >
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t('contact.form.messagePlaceholder')}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              {submitStatus === 'success' && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                  <p className="text-green-800 text-center font-medium">
                    {t('contact.form.successMessage')}
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-red-800 text-center font-medium">
                    {t('contact.form.errorMessage')}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 rtl:space-x-reverse shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>{t('contact.form.sendingMessage')}</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>{t('contact.form.submit')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
