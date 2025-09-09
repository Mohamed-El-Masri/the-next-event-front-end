import { apiClient } from './api-client';
import { API_CONFIG, EmailTemplate, EmailLog, PaginatedResponse } from './api-config';

export interface EmailData {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  isHtml?: boolean;
  attachments?: Array<{
    fileName: string;
    content: string; // base64 encoded
    contentType: string;
  }>;
}

export interface BulkEmailData {
  recipients: Array<{
    email: string;
    name?: string;
    customData?: Record<string, string>;
  }>;
  templateId: number;
  subject: string;
  scheduledDate?: string;
}

export class EmailService {
  /**
   * إرسال بريد إلكتروني فردي (للإدارة فقط)
   */
  async sendEmail(emailData: EmailData): Promise<{ messageId: string; status: string }> {
    return await apiClient.post<{ messageId: string; status: string }>(
      API_CONFIG.ENDPOINTS.EMAIL.SEND,
      emailData
    );
  }

  /**
   * إرسال بريد إلكتروني باستخدام قالب (للإدارة فقط)
   */
  async sendTemplateEmail(
    templateId: number,
    to: string[],
    templateData: Record<string, string>,
    subject?: string
  ): Promise<{ messageId: string; status: string }> {
    return await apiClient.post<{ messageId: string; status: string }>(
      API_CONFIG.ENDPOINTS.EMAIL.SEND_TEMPLATE,
      {
        templateId,
        to,
        templateData,
        subject,
      }
    );
  }

  /**
   * إرسال بريد إلكتروني جماعي (للإدارة فقط)
   */
  async sendBulkEmail(bulkEmailData: BulkEmailData): Promise<{ campaignId: string; status: string }> {
    return await apiClient.post<{ campaignId: string; status: string }>(
      API_CONFIG.ENDPOINTS.EMAIL.SEND_BULK,
      bulkEmailData
    );
  }

  /**
   * الحصول على جميع قوالب البريد الإلكتروني (للإدارة فقط)
   */
  async getAllEmailTemplates(params?: {
    page?: number;
    pageSize?: number;
    category?: string;
    language?: string;
    search?: string;
  }): Promise<PaginatedResponse<EmailTemplate>> {
    return await apiClient.get<PaginatedResponse<EmailTemplate>>(
      API_CONFIG.ENDPOINTS.EMAIL.TEMPLATES,
      params
    );
  }

  /**
   * الحصول على قالب بريد إلكتروني بواسطة المعرف (للإدارة فقط)
   */
  async getEmailTemplateById(id: number): Promise<EmailTemplate> {
    return await apiClient.get<EmailTemplate>(`${API_CONFIG.ENDPOINTS.EMAIL.TEMPLATES}/${id}`);
  }

  /**
   * إنشاء قالب بريد إلكتروني جديد (للإدارة فقط)
   */
  async createEmailTemplate(template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate> {
    return await apiClient.post<EmailTemplate>(API_CONFIG.ENDPOINTS.EMAIL.TEMPLATES, template);
  }

  /**
   * تحديث قالب بريد إلكتروني (للإدارة فقط)
   */
  async updateEmailTemplate(id: number, template: Partial<EmailTemplate>): Promise<EmailTemplate> {
    return await apiClient.put<EmailTemplate>(`${API_CONFIG.ENDPOINTS.EMAIL.TEMPLATES}/${id}`, template);
  }

  /**
   * حذف قالب بريد إلكتروني (للإدارة فقط)
   */
  async deleteEmailTemplate(id: number): Promise<void> {
    await apiClient.delete(`${API_CONFIG.ENDPOINTS.EMAIL.TEMPLATES}/${id}`);
  }

  /**
   * الحصول على سجلات البريد الإلكتروني (للإدارة فقط)
   */
  async getEmailLogs(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    recipient?: string;
  }): Promise<PaginatedResponse<EmailLog>> {
    return await apiClient.get<PaginatedResponse<EmailLog>>(
      API_CONFIG.ENDPOINTS.EMAIL.LOGS,
      params
    );
  }

  /**
   * الحصول على سجل بريد إلكتروني بواسطة المعرف (للإدارة فقط)
   */
  async getEmailLogById(id: number): Promise<EmailLog> {
    return await apiClient.get<EmailLog>(`${API_CONFIG.ENDPOINTS.EMAIL.LOGS}/${id}`);
  }

  /**
   * إعادة إرسال بريد إلكتروني فاشل (للإدارة فقط)
   */
  async resendFailedEmail(logId: number): Promise<{ messageId: string; status: string }> {
    return await apiClient.post<{ messageId: string; status: string }>(
      `${API_CONFIG.ENDPOINTS.EMAIL.LOGS}/${logId}/resend`
    );
  }

  /**
   * الحصول على إحصائيات البريد الإلكتروني (للإدارة فقط)
   */
  async getEmailStatistics(period: 'day' | 'week' | 'month' = 'week'): Promise<{
    totalSent: number;
    totalDelivered: number;
    totalFailed: number;
    totalBounced: number;
    deliveryRate: number;
    bounceRate: number;
    chartData: Array<{
      date: string;
      sent: number;
      delivered: number;
      failed: number;
    }>;
  }> {
    return await apiClient.get(`${API_CONFIG.ENDPOINTS.EMAIL.STATISTICS}`, { period });
  }

  /**
   * تحديث حالة البريد الإلكتروني (webhook endpoint - للنظام فقط)
   */
  async updateEmailStatus(messageId: string, status: string, details?: string): Promise<void> {
    await apiClient.post(`${API_CONFIG.ENDPOINTS.EMAIL.WEBHOOKS}/status`, {
      messageId,
      status,
      details,
    });
  }

  /**
   * معالج webhook للارتداد (للنظام فقط)
   */
  async handleBounce(bounceData: {
    messageId: string;
    recipient: string;
    bounceType: string;
    bounceSubType: string;
    timestamp: string;
  }): Promise<void> {
    await apiClient.post(`${API_CONFIG.ENDPOINTS.EMAIL.WEBHOOKS}/bounce`, bounceData);
  }

  /**
   * معالج webhook للشكاوى (للنظام فقط)
   */
  async handleComplaint(complaintData: {
    messageId: string;
    recipient: string;
    complaintType: string;
    timestamp: string;
  }): Promise<void> {
    await apiClient.post(`${API_CONFIG.ENDPOINTS.EMAIL.WEBHOOKS}/complaint`, complaintData);
  }

  /**
   * إنشاء قالب بريد إلكتروني افتراضي
   */
  createDefaultTemplate(
    name: string,
    type: 'welcome' | 'contact' | 'notification' | 'newsletter',
    language: 'ar' | 'en' = 'ar'
  ): Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'> {
    const isArabic = language === 'ar';

    const templates = {
      welcome: {
        name: isArabic ? `${name} - ترحيب` : `${name} - Welcome`,
        subject: isArabic ? 'مرحباً بك في The Next Event' : 'Welcome to The Next Event',
        htmlContent: isArabic ? this.getArabicWelcomeTemplate() : this.getEnglishWelcomeTemplate(),
        textContent: isArabic 
          ? 'مرحباً بك في The Next Event، شركتك الموثوقة لتنظيم الفعاليات.'
          : 'Welcome to The Next Event, your trusted event management company.',
        category: 'welcome',
      },
      contact: {
        name: isArabic ? `${name} - رد على الاستفسار` : `${name} - Contact Reply`,
        subject: isArabic ? 'شكراً لتواصلك معنا' : 'Thank you for contacting us',
        htmlContent: isArabic ? this.getArabicContactTemplate() : this.getEnglishContactTemplate(),
        textContent: isArabic 
          ? 'شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.'
          : 'Thank you for contacting us. We will get back to you as soon as possible.',
        category: 'contact',
      },
      notification: {
        name: isArabic ? `${name} - إشعار` : `${name} - Notification`,
        subject: isArabic ? 'إشعار من The Next Event' : 'Notification from The Next Event',
        htmlContent: isArabic ? this.getArabicNotificationTemplate() : this.getEnglishNotificationTemplate(),
        textContent: isArabic 
          ? 'لديك إشعار جديد من The Next Event.'
          : 'You have a new notification from The Next Event.',
        category: 'notification',
      },
      newsletter: {
        name: isArabic ? `${name} - نشرة إخبارية` : `${name} - Newsletter`,
        subject: isArabic ? 'آخر أخبار The Next Event' : 'Latest News from The Next Event',
        htmlContent: isArabic ? this.getArabicNewsletterTemplate() : this.getEnglishNewsletterTemplate(),
        textContent: isArabic 
          ? 'اطلع على آخر أخبار وفعاليات The Next Event.'
          : 'Check out the latest news and events from The Next Event.',
        category: 'newsletter',
      },
    };

    return {
      ...templates[type],
      language,
      isActive: true,
      variables: [
        { name: 'recipientName', description: isArabic ? 'اسم المستقبل' : 'Recipient Name' },
        { name: 'companyName', description: isArabic ? 'اسم الشركة' : 'Company Name' },
        { name: 'eventName', description: isArabic ? 'اسم الفعالية' : 'Event Name' },
        { name: 'eventDate', description: isArabic ? 'تاريخ الفعالية' : 'Event Date' },
      ],
    };
  }

  /**
   * معالجة المتغيرات في القالب
   */
  processTemplate(template: string, variables: Record<string, string>): string {
    let processedTemplate = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      processedTemplate = processedTemplate.replace(regex, value);
    });

    return processedTemplate;
  }

  /**
   * التحقق من صحة البريد الإلكتروني
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * تنظيف قائمة البريد الإلكتروني
   */
  cleanEmailList(emails: string[]): string[] {
    return emails
      .map(email => email.trim().toLowerCase())
      .filter(email => this.validateEmail(email))
      .filter((email, index, arr) => arr.indexOf(email) === index); // إزالة المكررات
  }

  /**
   * تنسيق بيانات البريد الإلكتروني للعرض
   */
  formatEmailForDisplay(email: EmailLog): {
    recipient: string;
    subject: string;
    status: string;
    statusColor: string;
    sentDate: string;
    deliveredDate?: string;
  } {
    const statusColors: Record<string, string> = {
      sent: 'blue',
      delivered: 'green',
      failed: 'red',
      bounced: 'orange',
      complained: 'purple',
    };

    return {
      recipient: email.recipient,
      subject: email.subject,
      status: email.status,
      statusColor: statusColors[email.status] || 'gray',
      sentDate: new Date(email.sentAt).toLocaleString('ar-SA'),
      deliveredDate: email.deliveredAt ? new Date(email.deliveredAt).toLocaleString('ar-SA') : undefined,
    };
  }

  // قوالب HTML
  private getArabicWelcomeTemplate(): string {
    return `
      <div style="font-family: 'Cairo', Arial, sans-serif; direction: rtl; text-align: right;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="{{logoUrl}}" alt="The Next Event" style="max-width: 200px;">
          </div>
          <h1 style="color: #1B2B50; margin-bottom: 20px;">مرحباً بك {{recipientName}}</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            نحن سعداء لانضمامك إلى عائلة The Next Event، الشركة الرائدة في تنظيم الفعاليات في المملكة العربية السعودية.
          </p>
          <div style="background-color: #F4F4F4; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="color: #1B2B50; margin-bottom: 15px;">ماذا يمكننا أن نقدم لك؟</h3>
            <ul style="color: #333; line-height: 1.8;">
              <li>تنظيم المؤتمرات والندوات</li>
              <li>إدارة المعارض التجارية</li>
              <li>تنسيق الفعاليات الثقافية</li>
              <li>خدمات التسويق والترويج</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{contactUrl}}" style="background-color: #2AC7E0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">تواصل معنا</a>
          </div>
          <div style="border-top: 1px solid #ddd; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>The Next Event - نحو مستقبل أفضل للفعاليات</p>
            <p>{{companyAddress}} | {{companyPhone}} | {{companyEmail}}</p>
          </div>
        </div>
      </div>
    `;
  }

  private getEnglishWelcomeTemplate(): string {
    return `
      <div style="font-family: 'Montserrat', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="{{logoUrl}}" alt="The Next Event" style="max-width: 200px;">
          </div>
          <h1 style="color: #1B2B50; margin-bottom: 20px;">Welcome {{recipientName}}</h1>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            We're excited to have you join The Next Event family, the leading event management company in Saudi Arabia.
          </p>
          <div style="background-color: #F4F4F4; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="color: #1B2B50; margin-bottom: 15px;">What can we offer you?</h3>
            <ul style="color: #333; line-height: 1.8;">
              <li>Conference and seminar organization</li>
              <li>Trade exhibition management</li>
              <li>Cultural event coordination</li>
              <li>Marketing and promotion services</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{contactUrl}}" style="background-color: #2AC7E0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Contact Us</a>
          </div>
          <div style="border-top: 1px solid #ddd; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
            <p>The Next Event - Towards a Better Future for Events</p>
            <p>{{companyAddress}} | {{companyPhone}} | {{companyEmail}}</p>
          </div>
        </div>
      </div>
    `;
  }

  private getArabicContactTemplate(): string {
    return `
      <div style="font-family: 'Cairo', Arial, sans-serif; direction: rtl; text-align: right;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1B2B50;">شكراً لتواصلك معنا</h1>
          <p>عزيزي {{recipientName}}،</p>
          <p>شكراً لك على التواصل مع The Next Event. لقد تم استلام رسالتك وسيقوم فريقنا بالرد عليك خلال 24 ساعة.</p>
          <div style="background-color: #F4F4F4; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <strong>رقم الطلب:</strong> {{ticketNumber}}
          </div>
          <p>نحن متحمسون لمساعدتك في تحقيق فعاليتك المثالية.</p>
        </div>
      </div>
    `;
  }

  private getEnglishContactTemplate(): string {
    return `
      <div style="font-family: 'Montserrat', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1B2B50;">Thank you for contacting us</h1>
          <p>Dear {{recipientName}},</p>
          <p>Thank you for reaching out to The Next Event. We have received your message and our team will respond within 24 hours.</p>
          <div style="background-color: #F4F4F4; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <strong>Ticket Number:</strong> {{ticketNumber}}
          </div>
          <p>We're excited to help you create your perfect event.</p>
        </div>
      </div>
    `;
  }

  private getArabicNotificationTemplate(): string {
    return `
      <div style="font-family: 'Cairo', Arial, sans-serif; direction: rtl; text-align: right;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1B2B50;">{{notificationTitle}}</h1>
          <p>{{notificationMessage}}</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="{{actionUrl}}" style="background-color: #2AC7E0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">{{actionText}}</a>
          </div>
        </div>
      </div>
    `;
  }

  private getEnglishNotificationTemplate(): string {
    return `
      <div style="font-family: 'Montserrat', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1B2B50;">{{notificationTitle}}</h1>
          <p>{{notificationMessage}}</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="{{actionUrl}}" style="background-color: #2AC7E0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">{{actionText}}</a>
          </div>
        </div>
      </div>
    `;
  }

  private getArabicNewsletterTemplate(): string {
    return `
      <div style="font-family: 'Cairo', Arial, sans-serif; direction: rtl; text-align: right;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1B2B50;">{{newsletterTitle}}</h1>
          <div style="margin: 20px 0;">
            {{newsletterContent}}
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{unsubscribeUrl}}" style="color: #666; font-size: 12px;">إلغاء الاشتراك</a>
          </div>
        </div>
      </div>
    `;
  }

  private getEnglishNewsletterTemplate(): string {
    return `
      <div style="font-family: 'Montserrat', Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1B2B50;">{{newsletterTitle}}</h1>
          <div style="margin: 20px 0;">
            {{newsletterContent}}
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{unsubscribeUrl}}" style="color: #666; font-size: 12px;">Unsubscribe</a>
          </div>
        </div>
      </div>
    `;
  }
}

// إنشاء instance واحد للاستخدام في التطبيق
export const emailService = new EmailService();
