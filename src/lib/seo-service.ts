import { apiClient } from './api-client';
import { API_CONFIG, SEOConfiguration, PaginatedResponse } from './api-config';

export class SEOService {
  /**
   * الحصول على جميع إعدادات SEO (public endpoint)
   */
  async getAllSEOConfigs(): Promise<SEOConfiguration[]> {
    return await apiClient.get<SEOConfiguration[]>(`${API_CONFIG.ENDPOINTS.SEO.BASE}/public`);
  }

  /**
   * الحصول على إعدادات SEO لصفحة معينة (public endpoint)
   */
  async getSEOConfigByPage(pageName: string, language?: string): Promise<SEOConfiguration | null> {
    try {
      const params: Record<string, string | number | boolean> = {};
      if (language) {
        params.language = language;
      }
      return await apiClient.get<SEOConfiguration>(
        `${API_CONFIG.ENDPOINTS.SEO.BASE}/public/page/${encodeURIComponent(pageName)}`,
        params
      );
    } catch {
      console.warn(`No SEO config found for page: ${pageName}`);
      return null;
    }
  }

  /**
   * الحصول على جميع إعدادات SEO (للإدارة فقط)
   */
  async getAllSEOConfigsAdmin(params?: {
    page?: number;
    pageSize?: number;
    language?: string;
    search?: string;
  }): Promise<PaginatedResponse<SEOConfiguration>> {
    return await apiClient.get<PaginatedResponse<SEOConfiguration>>(
      API_CONFIG.ENDPOINTS.SEO.BASE,
      params
    );
  }

  /**
   * الحصول على إعدادات SEO بواسطة المعرف (للإدارة فقط)
   */
  async getSEOConfigById(id: number): Promise<SEOConfiguration> {
    return await apiClient.get<SEOConfiguration>(`${API_CONFIG.ENDPOINTS.SEO.BASE}/${id}`);
  }

  /**
   * إنشاء إعدادات SEO جديدة (للإدارة فقط)
   */
  async createSEOConfig(seoConfig: Omit<SEOConfiguration, 'id' | 'createdAt' | 'updatedAt'>): Promise<SEOConfiguration> {
    return await apiClient.post<SEOConfiguration>(API_CONFIG.ENDPOINTS.SEO.BASE, seoConfig);
  }

  /**
   * تحديث إعدادات SEO (للإدارة فقط)
   */
  async updateSEOConfig(id: number, seoConfig: Partial<SEOConfiguration>): Promise<SEOConfiguration> {
    return await apiClient.put<SEOConfiguration>(`${API_CONFIG.ENDPOINTS.SEO.BASE}/${id}`, seoConfig);
  }

  /**
   * حذف إعدادات SEO (للإدارة فقط)
   */
  async deleteSEOConfig(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.SEO.BASE}/${id}`);
  }

  /**
   * تنشيط/إلغاء تنشيط إعدادات SEO (للإدارة فقط)
   */
  async toggleSEOConfigStatus(id: number, isActive: boolean): Promise<void> {
    await apiClient.patch(`${API_CONFIG.ENDPOINTS.SEO.BASE}/${id}/status`, { isActive });
  }

  /**
   * إنشاء meta tags HTML من إعدادات SEO
   */
  generateMetaTags(seoConfig: SEOConfiguration): string {
    const tags: string[] = [];

    // Basic meta tags
    if (seoConfig.metaTitle) {
      tags.push(`<title>${this.escapeHtml(seoConfig.metaTitle)}</title>`);
    }

    if (seoConfig.metaDescription) {
      tags.push(`<meta name="description" content="${this.escapeHtml(seoConfig.metaDescription)}" />`);
    }

    if (seoConfig.metaKeywords) {
      tags.push(`<meta name="keywords" content="${this.escapeHtml(seoConfig.metaKeywords)}" />`);
    }

    // Open Graph tags
    if (seoConfig.ogTitle) {
      tags.push(`<meta property="og:title" content="${this.escapeHtml(seoConfig.ogTitle)}" />`);
    }

    if (seoConfig.ogDescription) {
      tags.push(`<meta property="og:description" content="${this.escapeHtml(seoConfig.ogDescription)}" />`);
    }

    if (seoConfig.ogImage) {
      tags.push(`<meta property="og:image" content="${this.escapeHtml(seoConfig.ogImage)}" />`);
    }

    if (seoConfig.ogUrl) {
      tags.push(`<meta property="og:url" content="${this.escapeHtml(seoConfig.ogUrl)}" />`);
    }

    tags.push(`<meta property="og:type" content="website" />`);

    // Twitter Card tags
    tags.push(`<meta name="twitter:card" content="summary_large_image" />`);

    if (seoConfig.ogTitle) {
      tags.push(`<meta name="twitter:title" content="${this.escapeHtml(seoConfig.ogTitle)}" />`);
    }

    if (seoConfig.ogDescription) {
      tags.push(`<meta name="twitter:description" content="${this.escapeHtml(seoConfig.ogDescription)}" />`);
    }

    if (seoConfig.ogImage) {
      tags.push(`<meta name="twitter:image" content="${this.escapeHtml(seoConfig.ogImage)}" />`);
    }

    // Additional meta tags
    if (seoConfig.additionalMetaTags) {
      seoConfig.additionalMetaTags.forEach(tag => {
        if (tag.name && tag.content) {
          tags.push(`<meta name="${this.escapeHtml(tag.name)}" content="${this.escapeHtml(tag.content)}" />`);
        } else if (tag.property && tag.content) {
          tags.push(`<meta property="${this.escapeHtml(tag.property)}" content="${this.escapeHtml(tag.content)}" />`);
        }
      });
    }

    // Canonical URL
    if (seoConfig.canonicalUrl) {
      tags.push(`<link rel="canonical" href="${this.escapeHtml(seoConfig.canonicalUrl)}" />`);
    }

    return tags.join('\n');
  }

  /**
   * إنشاء structured data JSON-LD
   */
  generateStructuredData(seoConfig: SEOConfiguration, additionalData?: Record<string, unknown>): string | null {
    if (!seoConfig.structuredData && !additionalData) {
      return null;
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'The Next Event',
      url: 'https://thenextevent.com',
      logo: 'https://thenextevent.com/logo.png',
      description: seoConfig.metaDescription || 'شركة سعودية رائدة في تنظيم الفعاليات',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'SA',
        addressLocality: 'Riyadh'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'info@thenextevent.com'
      },
      ...seoConfig.structuredData,
      ...additionalData
    };

    return JSON.stringify(structuredData, null, 2);
  }

  /**
   * إنشاء Next.js metadata object
   */
  generateNextJSMetadata(seoConfig: SEOConfiguration): Record<string, unknown> {
    const metadata: Record<string, unknown> = {};

    if (seoConfig.metaTitle) {
      metadata.title = seoConfig.metaTitle;
    }

    if (seoConfig.metaDescription) {
      metadata.description = seoConfig.metaDescription;
    }

    if (seoConfig.metaKeywords) {
      metadata.keywords = seoConfig.metaKeywords.split(',').map(k => k.trim());
    }

    // Open Graph
    metadata.openGraph = {
      title: seoConfig.ogTitle || seoConfig.metaTitle,
      description: seoConfig.ogDescription || seoConfig.metaDescription,
      url: seoConfig.ogUrl,
      siteName: 'The Next Event',
      images: seoConfig.ogImage ? [{ url: seoConfig.ogImage }] : [],
      locale: seoConfig.language === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    };

    // Twitter
    metadata.twitter = {
      card: 'summary_large_image',
      title: seoConfig.ogTitle || seoConfig.metaTitle,
      description: seoConfig.ogDescription || seoConfig.metaDescription,
      images: seoConfig.ogImage ? [seoConfig.ogImage] : [],
    };

    // Canonical URL
    if (seoConfig.canonicalUrl) {
      metadata.alternates = {
        canonical: seoConfig.canonicalUrl,
      };
    }

    // Additional meta tags
    if (seoConfig.additionalMetaTags && seoConfig.additionalMetaTags.length > 0) {
      metadata.other = {} as Record<string, string>;
      seoConfig.additionalMetaTags.forEach(tag => {
        if (tag.name && tag.content) {
          (metadata.other as Record<string, string>)[tag.name] = tag.content;
        }
      });
    }

    return metadata;
  }

  /**
   * إنشاء تكوين افتراضي لصفحة
   */
  createDefaultSEOConfig(pageName: string, language: string = 'ar'): Omit<SEOConfiguration, 'id' | 'createdAt' | 'updatedAt'> {
    const isArabic = language === 'ar';
    
    const defaultConfigs: Record<string, { metaTitle: string; metaDescription: string; metaKeywords?: string }> = {
      home: {
        metaTitle: isArabic ? 'The Next Event - شركة تنظيم الفعاليات الرائدة في السعودية' : 'The Next Event - Leading Event Management Company in Saudi Arabia',
        metaDescription: isArabic 
          ? 'شركة سعودية رائدة في تنظيم الفعاليات والمؤتمرات والمعارض. نقدم خدمات متكاملة لتنظيم فعاليات استثنائية تواكب رؤية 2030'
          : 'Leading Saudi company in organizing events, conferences, and exhibitions. We provide comprehensive services for exceptional events aligned with Vision 2030',
        metaKeywords: isArabic 
          ? 'تنظيم فعاليات, مؤتمرات, معارض, السعودية, رؤية 2030, إدارة فعاليات'
          : 'event management, conferences, exhibitions, Saudi Arabia, Vision 2030, event planning'
      },
      about: {
        metaTitle: isArabic ? 'عن الشركة - The Next Event' : 'About Us - The Next Event',
        metaDescription: isArabic 
          ? 'تعرف على The Next Event، الشركة السعودية الرائدة في تنظيم الفعاليات مع فريق محترف وخبرة واسعة'
          : 'Learn about The Next Event, the leading Saudi event management company with professional team and extensive experience'
      },
      services: {
        metaTitle: isArabic ? 'خدماتنا - The Next Event' : 'Our Services - The Next Event',
        metaDescription: isArabic 
          ? 'اكتشف خدماتنا المتنوعة في تنظيم الفعاليات من مؤتمرات ومعارض وحفلات وفعاليات الشركات'
          : 'Discover our diverse event management services including conferences, exhibitions, parties, and corporate events'
      },
      contact: {
        metaTitle: isArabic ? 'اتصل بنا - The Next Event' : 'Contact Us - The Next Event',
        metaDescription: isArabic 
          ? 'تواصل معنا لتنظيم فعاليتك القادمة. فريقنا مستعد لتقديم استشارة مجانية وتحويل أفكارك لواقع'
          : 'Contact us to organize your next event. Our team is ready to provide free consultation and turn your ideas into reality'
      }
    };

    const pageConfig = defaultConfigs[pageName] || defaultConfigs.home;

    return {
      pageName,
      language,
      metaTitle: pageConfig.metaTitle,
      metaDescription: pageConfig.metaDescription,
      metaKeywords: pageConfig.metaKeywords,
      ogTitle: pageConfig.metaTitle,
      ogDescription: pageConfig.metaDescription,
      ogImage: 'https://thenextevent.com/og-image.jpg',
      ogUrl: `https://thenextevent.com/${language === 'ar' ? 'ar' : 'en'}/${pageName}`,
      canonicalUrl: `https://thenextevent.com/${language === 'ar' ? 'ar' : 'en'}/${pageName}`,
      isActive: true,
      additionalMetaTags: [
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'The Next Event' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { property: 'og:locale', content: language === 'ar' ? 'ar_SA' : 'en_US' }
      ],
      structuredData: {
        '@type': 'WebPage',
        name: pageConfig.metaTitle,
        description: pageConfig.metaDescription,
        url: `https://thenextevent.com/${language === 'ar' ? 'ar' : 'en'}/${pageName}`,
        inLanguage: language === 'ar' ? 'ar-SA' : 'en-US'
      }
    };
  }

  /**
   * تنظيف HTML للحماية من XSS
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * دمج إعدادات SEO الافتراضية مع المخصصة
   */
  mergeSEOConfigs(defaultConfig: SEOConfiguration, customConfig?: Partial<SEOConfiguration>): SEOConfiguration {
    if (!customConfig) return defaultConfig;

    return {
      ...defaultConfig,
      ...customConfig,
      additionalMetaTags: [
        ...(defaultConfig.additionalMetaTags || []),
        ...(customConfig.additionalMetaTags || [])
      ],
      structuredData: {
        ...defaultConfig.structuredData,
        ...customConfig.structuredData
      }
    };
  }
}

// إنشاء instance واحد للاستخدام في التطبيق
export const seoService = new SEOService();
