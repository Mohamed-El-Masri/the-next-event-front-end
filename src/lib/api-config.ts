// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://thenextevent.runasp.net/api',
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      ME: '/auth/me',
      LOGOUT: '/auth/logout',
      CHANGE_PASSWORD: '/auth/change-password',
      USERS: '/auth/users',
    },
    // Content Management
    CONTENT: {
      BASE: '/content',
      BY_KEY: '/content/by-key',
      BY_LANGUAGE: '/content/by-language',
      BY_SECTION: '/content/section',
      BULK_UPDATE: '/content/bulk-update',
    },
    // Forms
    FORMS: {
      BASE: '/forms',
      SUBMIT: '/forms/submit',
      STATISTICS: '/forms/statistics',
      EXPORT_CSV: '/forms/export/csv',
    },
    // Email
    EMAIL: {
      BASE: '/email',
      SEND: '/email/send',
      SEND_TEMPLATE: '/email/send-template',
      SEND_BULK: '/email/send-bulk',
      TEMPLATES: '/email/templates',
      LOGS: '/email/logs',
      STATISTICS: '/email/statistics',
      WEBHOOKS: '/email/webhooks',
      CONFIGURATION: '/email/configuration',
      TEST: '/email/test',
    },
    // Media
    MEDIA: {
      BASE: '/media',
      UPLOAD: '/media/upload',
      UPLOAD_MULTIPLE: '/media/upload-multiple',
      SIGNATURE: '/media/signature',
      ALL: '/media/all',
    },
    // SEO
    SEO: {
      BASE: '/seo',
      BY_URL: '/seo/by-url',
      SITEMAP: '/seo/sitemap',
      ROBOTS: '/seo/robots',
      VALIDATE: '/seo/validate',
      ANALYTICS: '/seo/analytics',
    },
  },
} as const;

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

// Content Types
export interface ContentItem {
  id: number;
  contentKey: string;
  sectionKey: string;
  contentValue: string;
  language: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Form Types
export interface FormSubmission {
  id?: number;
  formType: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  message: string;
  status?: string;
  isRead?: boolean;
  adminNotes?: string;
  submittedAt?: string;
  updatedAt?: string;
  additionalData?: Record<string, string | number | boolean | string[]>;
}

export interface ContactFormData {
  formType: 'contact';
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  message: string;
  additionalData?: {
    organization?: string;
    eventType?: string;
    eventDate?: string;
    guestCount?: string;
    budget?: string;
    services?: string[];
  };
}

export interface EventPlanningFormData {
  formType: 'event-planning';
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  organization: string;
  eventType: 'corporate' | 'wedding' | 'cultural' | 'innovation' | 'conference' | 'other';
  eventTitle: string;
  eventDescription: string;
  eventDate: string;
  eventDuration: number; // in hours
  guestCount: number;
  venue?: string;
  budget: string;
  services: string[];
  specialRequirements?: string;
  additionalData?: Record<string, string | number | boolean | string[]>;
}

export interface ServiceProviderApplicationFormData {
  formType: 'service-provider';
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  companyName: string;
  serviceCategory: 'venue' | 'catering' | 'entertainment' | 'design' | 'technology' | 'photography' | 'security' | 'transportation' | 'other';
  businessLicense: string;
  experience: string;
  portfolioUrl?: string;
  servicesOffered: string[];
  coverageAreas: string[];
  description: string;
  additionalData?: Record<string, string | number | boolean | string[]>;
}

export interface PartnershipFormData {
  formType: 'partnership';
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  organizationName: string;
  organizationType: 'government' | 'corporate' | 'ngo' | 'startup' | 'university' | 'other';
  partnershipType: 'sponsorship' | 'collaboration' | 'venue-partner' | 'technology-partner' | 'strategic-alliance' | 'other';
  proposalDescription: string;
  expectedBenefits: string;
  resources: string;
  timeline: string;
  additionalData?: Record<string, string | number | boolean | string[]>;
}

export interface FeedbackFormData {
  formType: 'feedback';
  submitterName?: string;
  submitterEmail?: string;
  eventName: string;
  rating: number; // 1-5
  feedbackCategory: 'event-quality' | 'service' | 'venue' | 'organization' | 'suggestion' | 'complaint' | 'other';
  feedbackText: string;
  recommendationScore: number; // 1-10 NPS score
  additionalData?: Record<string, string | number | boolean | string[]>;
}

// SEO Types
export interface SEOConfiguration {
  id?: number;
  pageName: string;
  language: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  isActive: boolean;
  additionalMetaTags?: MetaTag[];
  structuredData?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
}

export interface SeoMetadata {
  id?: number;
  pageUrl: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  robots?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Media Types
export interface MediaFile {
  id: number;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  url: string;
  altText?: string;
  category?: string;
  isPublic: boolean;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
}

export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  api_key: string;
  cloud_name: string;
}

// Email Types
export interface EmailTemplate {
  id?: number;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  language: string;
  category: string;
  isActive: boolean;
  variables?: Array<{
    name: string;
    description: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmailLog {
  id: number;
  recipient: string;
  subject: string;
  status: string;
  messageId?: string;
  sentAt: string;
  deliveredAt?: string;
  errorMessage?: string;
  templateId?: number;
}

// Statistics Types
export interface FormStatistics {
  totalSubmissions: number;
  newSubmissions: number;
  inProgressSubmissions: number;
  completedSubmissions: number;
  todaySubmissions: number;
  weekSubmissions: number;
  monthSubmissions: number;
}

export interface EmailStatistics {
  totalSent: number;
  totalFailed: number;
  successRate: number;
  todaySent: number;
  weekSent: number;
  monthSent: number;
}
