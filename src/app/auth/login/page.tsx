"use client";
import React, { useState } from 'react';
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, MapPin, Star, Shield, Compass } from 'lucide-react';
import { validateForm, loginSchema } from '@/shared/utils/validation';
import { LoginFormData } from '@/shared/types';
import { apiClient } from '@/infrastructure/api/clients/api-client';
import { useAuth } from '@/core/store/auth-context';
import Form from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/shared/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Divider from '@/components/ui/Divider';
import GoogleLoginButton from '@/components/ui/GoogleLoginButton';

const TRAVEL_STATS = [
  { value: '500+', label: 'Verified Stays' },
  { value: '50+', label: 'Cities' },
  { value: '10K+', label: 'Happy Travelers' },
];

const FEATURED_DESTINATIONS = [
  { name: 'Rajasthan', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80' },
  { name: 'Kerala', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80' },
  { name: 'Himalayas', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isAuthenticated, isLoading } = useAuth();
  
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const redirectTo = returnUrl || searchParams.get('redirect') || '/';
  const reason = searchParams.get('reason');
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleError, setGoogleError] = useState<string>('');

  React.useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === 'admin' || user.role === 'super-admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
     
  const handleGoogleError = (error: string) => setGoogleError(error);
  const handleGoogleSuccess = () => setGoogleError('');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C45D3E] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C45D3E] mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const validation = validateForm(loginSchema, formData);
    if (!validation.success) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.login(formData.email, formData.password);
      
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        
        if (response.data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push(redirectTo);
        }
      } else {
        setErrors({ general: response.message || 'Login failed. Please try again.' });
      }
    } catch (error: unknown) {
      const errorObj = error as { 
        status?: number; 
        message?: string; 
        errors?: Array<{ field?: string; message: string }>;
        details?: { errors?: Array<{ field?: string; message: string }> };
        response?: { errors?: Array<{ field?: string; message: string }> };
      };
      
      const backendErrors = errorObj.errors 
        || errorObj.details?.errors 
        || errorObj.response?.errors 
        || [];

      if (errorObj.status === 401) {
        setErrors({ general: 'Invalid email or password.' });
      } else if (backendErrors.length > 0) {
        const fieldErrors: Record<string, string> = {};
        backendErrors.forEach((err) => {
          if (err.field) fieldErrors[err.field] = err.message;
        });
        if (Object.keys(fieldErrors).length === 0) {
          setErrors({ general: backendErrors[0]?.message || 'Please check your input and try again.' });
        } else {
          setErrors(fieldErrors);
        }
      } else if (errorObj.status === 400) {
        setErrors({ general: errorObj.message || 'Please check your input and try again.' });
      } else if (errorObj.status === 0) {
        setErrors({ general: 'Network error. Please check your connection.' });
      } else {
        setErrors({ general: errorObj.message || 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* Left Panel — Travel Brand */}
      <div className="hidden lg:flex lg:w-[45%] flex-col relative overflow-hidden bg-[#1A1A1A]">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=85')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/60 via-[#1A1A1A]/40 to-[#1A1A1A]/80" />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <Link href="/" className="inline-block">
            <img src="/logo.png" alt="TripMe" className="h-12 w-auto brightness-0 invert" />
          </Link>

          {/* Main copy — pushed to middle */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm mb-6 w-fit">
              <Compass className="w-3.5 h-3.5 text-[#F5E6D3]" />
              <span className="text-[#F5E6D3] text-xs font-semibold tracking-wide">Discover India</span>
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Every journey<br />begins with a<br /><span className="text-[#F5A87C]">single step</span>
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              From royal desert forts to misty mountain valleys — find your perfect stay with TripMe.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mb-8">
            {TRAVEL_STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-white/60 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Destination thumbnails */}
          <div className="flex gap-3">
            {FEATURED_DESTINATIONS.map(({ name, img }) => (
              <div key={name} className="relative flex-1 h-20 rounded-2xl overflow-hidden">
                <img src={img} alt={name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-2 left-2">
                  <p className="text-white text-[10px] font-semibold flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />{name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badge */}
          <div className="mt-6 flex items-center gap-2 text-white/50 text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>100% verified listings · Secure payments · 24/7 support</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile top strip */}
        <div className="lg:hidden relative h-40 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80"
            alt="Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/50 to-[#1A1A1A]/70 flex flex-col items-center justify-center">
            <Link href="/">
              <img src="/logo.png" alt="TripMe" className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p className="text-white/80 text-sm mt-1">Welcome back, traveler</p>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center px-5 py-8 sm:px-8 lg:px-14 xl:px-20">
          <div className="w-full max-w-[420px] mx-auto">

            {/* Desktop heading */}
            <div className="hidden lg:block mb-8">
              <Link href="/">
                <img src="/logo.png" alt="TripMe" className="h-12 w-auto mb-6" />
              </Link>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Welcome back</h1>
              <p className="text-gray-500 mt-1 text-sm">Sign in to continue your journey</p>
            </div>

            {/* Mobile heading */}
            <div className="lg:hidden mb-6 text-center">
              <h1 className="text-xl font-bold text-[#1A1A1A]">Welcome back</h1>
              <p className="text-gray-500 mt-0.5 text-sm">Sign in to continue your journey</p>
            </div>

            {/* Rate banner */}
            <div className="flex items-center gap-2 mb-6 p-3 bg-[#FDF8F3] border border-[#F5E6D3] rounded-xl">
              <Star className="w-4 h-4 text-[#B8860B] fill-[#B8860B] flex-shrink-0" />
              <p className="text-xs text-gray-600">Join <span className="font-semibold text-[#1A1A1A]">10,000+</span> travelers discovering India with TripMe</p>
            </div>

            <Form variant="auth" onSubmit={handleSubmit} className="relative space-y-0">
              {reason === 'session_expired' && !errors.general && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-700 font-medium">⏱ Your session has expired. Please sign in again.</p>
                </div>
              )}

              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}

              {googleError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{googleError}</p>
                </div>
              )}

              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                leftIcon={<Mail size={18} />}
                error={errors.email}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
                leftIcon={<Lock size={18} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                error={errors.password}
                required
              />

              <div className="flex flex-wrap items-center justify-between gap-3 py-1">
                <Checkbox
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  label="Remember me"
                />
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[#C45D3E] hover:text-[#A84B32] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="w-full !bg-[#C45D3E] hover:!bg-[#A84B32] !rounded-xl !shadow-lg !shadow-[#C45D3E]/20"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
                <ArrowRight size={18} className="ml-2" />
              </Button>

              <Divider text="or continue with" />

              <div className="space-y-3">
                <GoogleLoginButton onError={handleGoogleError} onSuccess={handleGoogleSuccess} />
              </div>

              <p className="text-center text-gray-500 text-sm pt-2">
                Don&apos;t have an account?{' '}
                <Link href="/auth/signup" className="text-[#C45D3E] font-semibold hover:text-[#A84B32] hover:underline">
                  Create one
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
