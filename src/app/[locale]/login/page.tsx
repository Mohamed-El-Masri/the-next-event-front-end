'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { authService } from '@/lib/auth-service';
import { LoginRequest } from '@/lib/api-config';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Checkbox } from '../../../components/ui/checkbox';
import Link from 'next/link';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = t('errors.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('errors.invalidEmail');
    }

    if (!formData.password) {
      newErrors.password = t('errors.required');
    } else if (formData.password.length < 6) {
      newErrors.password = t('errors.minPassword');
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await authService.login(formData);
      
      // إذا كان المستخدم اختار "تذكرني"، سنحفظ البيانات
      if (rememberMe && typeof window !== 'undefined') {
        localStorage.setItem('remember_me', 'true');
      }

      // التوجيه إلى لوحة التحكم مع مراعاة اللغة
      router.push(`/${locale}/dashboard`);
    } catch (error: unknown) {
      console.error('Login error:', error);
      
      if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
        setErrors({ general: t('errors.loginFailed') });
      } else {
        setErrors({ general: t('errors.networkError') });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // إزالة الخطأ عند الكتابة
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {t('title')}
          </CardTitle>
          <CardDescription>
            {t('subtitle')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <Alert variant="destructive">
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t('email')}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={formData.email}
                onChange={handleInputChange('email')}
                className={errors.email ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                {t('password')}
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  className={errors.password ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <span className="text-sm text-gray-400">🙈</span>
                  ) : (
                    <span className="text-sm text-gray-400">👁️</span>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  disabled={isLoading}
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  {t('rememberMe')}
                </label>
              </div>
              
              <Link 
                href="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                {t('forgotPassword')}
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2">⏳</span>
                  {t('signInLoading')}
                </>
              ) : (
                t('signInButton')
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('noAccount')}{' '}
              <Link 
                href="/register" 
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                {t('signUp')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
