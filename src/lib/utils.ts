/**
 * API Utilities - مساعدات للتعامل مع API
 */

/**
 * تهيئة الخدمات عند بدء التطبيق
 */
export async function initializeApp(): Promise<void> {
  try {
    // محاولة استعادة بيانات المستخدم من localStorage
    // لا نحتاج لاستدعاء restoreSession لأنها غير موجودة
    console.log('App initialized successfully');
  } catch (error) {
    console.warn('App initialization failed:', error);
    // لا نرمي خطأ هنا لأن التطبيق يجب أن يعمل حتى بدون تسجيل دخول
  }
}

/**
 * تنظيف الموارد عند إغلاق التطبيق
 */
export function cleanupApp(): void {
  // مسح البيانات المؤقتة
  if (typeof window !== 'undefined') {
    // يمكن إضافة تنظيف إضافي هنا
  }
}

/**
 * التحقق من حالة الاتصال بالإنترنت
 */
export function checkInternetConnection(): boolean {
  if (typeof window === 'undefined') {
    return true; // افتراض وجود اتصال في بيئة الخادم
  }
  
  return navigator.onLine;
}

/**
 * مراقب حالة الاتصال بالإنترنت
 */
export function setupConnectionMonitor(
  onOnline?: () => void,
  onOffline?: () => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {}; // لا يوجد مراقب في بيئة الخادم
  }

  const handleOnline = () => {
    console.log('Internet connection restored');
    onOnline?.();
  };

  const handleOffline = () => {
    console.log('Internet connection lost');
    onOffline?.();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // إرجاع دالة لإلغاء المراقب
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * معالج الأخطاء العامة
 */
export function handleGlobalError(error: unknown): {
  message: string;
  type: 'network' | 'auth' | 'validation' | 'server' | 'unknown';
  shouldRetry: boolean;
} {
  if (error instanceof Error) {
    // خطأ في الشبكة
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return {
        message: 'فشل في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.',
        type: 'network',
        shouldRetry: true,
      };
    }

    // خطأ في المصادقة
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      return {
        message: 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.',
        type: 'auth',
        shouldRetry: false,
      };
    }

    // خطأ في التحقق من البيانات
    if (error.message.includes('400') || error.message.includes('validation')) {
      return {
        message: 'البيانات المدخلة غير صحيحة. يرجى المراجعة والمحاولة مرة أخرى.',
        type: 'validation',
        shouldRetry: false,
      };
    }

    // خطأ في الخادم
    if (error.message.includes('500') || error.message.includes('server')) {
      return {
        message: 'حدث خطأ في الخادم. يرجى المحاولة لاحقاً.',
        type: 'server',
        shouldRetry: true,
      };
    }
  }

  // خطأ غير معروف
  return {
    message: 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    type: 'unknown',
    shouldRetry: true,
  };
}

/**
 * إعداد retry للطلبات الفاشلة
 */
export async function retryRequest<T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      const errorInfo = handleGlobalError(error);
      
      if (!errorInfo.shouldRetry || i === maxRetries - 1) {
        throw error;
      }

      // انتظار قبل المحاولة التالية
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }

  throw lastError;
}

/**
 * تنسيق التاريخ للعرض
 */
export function formatDate(date: string | Date, locale: string = 'ar-SA'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * تنسيق الأرقام للعرض
 */
export function formatNumber(number: number, locale: string = 'ar-SA'): string {
  return new Intl.NumberFormat(locale).format(number);
}

/**
 * تحويل النص إلى slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // إزالة الأحرف الخاصة
    .replace(/[\s_-]+/g, '-') // استبدال المسافات والشرطات بشرطة واحدة
    .replace(/^-+|-+$/g, ''); // إزالة الشرطات من البداية والنهاية
}

/**
 * التحقق من صحة البريد الإلكتروني
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * التحقق من صحة رقم الهاتف السعودي
 */
export function validateSaudiPhone(phone: string): boolean {
  // إزالة المسافات والأحرف الخاصة
  const cleanPhone = phone.replace(/\s|-|\(|\)/g, '');
  
  // التحقق من الأنماط السعودية
  const saudiPatterns = [
    /^(\+966|966|0)?5[0-9]{8}$/, // أرقام الجوال
    /^(\+966|966|0)?1[0-9]{7}$/, // أرقام الرياض
    /^(\+966|966|0)?2[0-9]{7}$/, // أرقام مكة والمدينة
    /^(\+966|966|0)?3[0-9]{7}$/, // أرقام الدمام
    /^(\+966|966|0)?4[0-9]{7}$/, // أرقام أخرى
    /^(\+966|966|0)?7[0-9]{7}$/, // أرقام أخرى
  ];

  return saudiPatterns.some(pattern => pattern.test(cleanPhone));
}

/**
 * تنسيق رقم الهاتف السعودي للعرض
 */
export function formatSaudiPhone(phone: string): string {
  const cleanPhone = phone.replace(/\s|-|\(|\)/g, '');
  
  // إضافة رمز البلد إذا لم يكن موجوداً
  let formattedPhone = cleanPhone;
  if (!cleanPhone.startsWith('+966') && !cleanPhone.startsWith('966')) {
    if (cleanPhone.startsWith('0')) {
      formattedPhone = '+966' + cleanPhone.substring(1);
    } else {
      formattedPhone = '+966' + cleanPhone;
    }
  } else if (cleanPhone.startsWith('966')) {
    formattedPhone = '+' + cleanPhone;
  }

  // تنسيق العرض
  if (formattedPhone.startsWith('+9665')) {
    // أرقام الجوال
    return formattedPhone.replace(/(\+966)(\d)(\d{4})(\d{4})/, '$1 $2 $3 $4');
  } else {
    // أرقام أخرى
    return formattedPhone.replace(/(\+966)(\d)(\d{3})(\d{4})/, '$1 $2 $3 $4');
  }
}

/**
 * إنشاء معرف فريد
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * تأخير التنفيذ (debounce)
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * تحديد التنفيذ (throttle)
 */
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}

/**
 * نسخ النص إلى الحافظة
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // fallback للمتصفحات القديمة
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
}

/**
 * تحميل ملف
 */
export function downloadFile(url: string, fileName: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * التحقق من دعم المتصفح لميزة معينة
 */
export function checkBrowserSupport(): {
  supportsWebP: boolean;
  supportsIntersectionObserver: boolean;
  supportsServiceWorker: boolean;
  supportsLocalStorage: boolean;
} {
  return {
    supportsWebP: typeof window !== 'undefined' && 
      (function() {
        const canvas = document.createElement('canvas');
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      })(),
    supportsIntersectionObserver: typeof window !== 'undefined' && 
      'IntersectionObserver' in window,
    supportsServiceWorker: typeof window !== 'undefined' && 
      'serviceWorker' in navigator,
    supportsLocalStorage: typeof window !== 'undefined' && 
      (function() {
        try {
          localStorage.setItem('test', 'test');
          localStorage.removeItem('test');
          return true;
        } catch {
          return false;
        }
      })(),
  };
}
