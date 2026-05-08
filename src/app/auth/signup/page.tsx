"use client";
import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Phone, MapPin, Sparkles, Shield } from 'lucide-react';
import { validateForm, signupSchema } from '@/shared/utils/validation';
import { SignupFormData } from '@/shared/types';
import { apiClient } from '@/infrastructure/api/clients/api-client';
import { useAuth } from '@/core/store/auth-context';
import Form from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/shared/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Divider from '@/components/ui/Divider';
import GoogleLoginButton from '@/components/ui/GoogleLoginButton';

const PERKS = [
  { icon: '🏡', title: 'Handpicked stays', desc: 'Verified homes, villas & boutique hotels across India' },
  { icon: '💰', title: 'Best price guarantee', desc: 'Find the lowest rates — always' },
  { icon: '🛡️', title: 'Secure & trusted', desc: '100% safe bookings with 24/7 support' },
];

const DESTINATION_COLLAGE = [
  { name: 'Taj Mahal', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80', span: 'row-span-2' },
  { name: 'Kerala', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=80', span: '' },
  { name: 'Himalayas', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', span: '' },
  { name: 'Jaisalmer', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80', span: 'col-span-2' },
];

export default function SignupPage() {
  const router = useRouter();
  const { login, user, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
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

    const validation = validateForm(signupSchema, formData);
    if (!validation.success) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone,
        acceptTerms: formData.agreeToTerms,
        role: 'guest',
      });
      
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        if (response.data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      } else {
        setErrors({ general: response.message || 'Signup failed. Please try again.' });
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

      if (backendErrors.length > 0) {
        const fieldErrors: Record<string, string> = {};
        backendErrors.forEach((err) => {
          let fieldName = err.field;
          if (fieldName === 'acceptTerms') fieldName = 'agreeToTerms';
          if (fieldName) fieldErrors[fieldName] = err.message;
        });
        if (Object.keys(fieldErrors).length === 0) {
          setErrors({ general: backendErrors[0]?.message || 'Please check your input and try again.' });
        } else {
          setErrors(fieldErrors);
        }
      } else if (errorObj.status === 409) {
        setErrors({ email: errorObj.message || 'An account with this email already exists.' });
      } else if (errorObj.status === 400) {
        setErrors({ general: errorObj.message || 'Please check your input and try again.' });
      } else if (errorObj.status === 0) {
        setErrors({ general: 'Network error. Please check your connection.' });
      } else {
        setErrors({ general: errorObj.message || 'Signup failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">

      {/* Left Panel — Brand Panel */}
      <div className="hidden lg:flex lg:w-[42%] flex-col relative overflow-hidden bg-[#1A1A1A]">
        {/* BG pattern layer */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 20%, #C45D3E 0%, transparent 50%), radial-gradient(circle at 80% 80%, #2D5F3A 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <Link href="/">
            <img src="/logo.png" alt="TripMe" className="h-12 w-auto brightness-0 invert" />
          </Link>

          {/* Destination collage */}
          <div className="flex-1 flex flex-col justify-center my-8">
            <div className="grid grid-cols-3 grid-rows-2 gap-2.5 h-72 mb-8">
              <div className="row-span-2 rounded-2xl overflow-hidden">
                <img src={DESTINATION_COLLAGE[0].img} alt={DESTINATION_COLLAGE[0].name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img src={DESTINATION_COLLAGE[1].img} alt={DESTINATION_COLLAGE[1].name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img src={DESTINATION_COLLAGE[2].img} alt={DESTINATION_COLLAGE[2].name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="col-span-2 rounded-2xl overflow-hidden relative">
                <img src={DESTINATION_COLLAGE[3].img} alt={DESTINATION_COLLAGE[3].name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-white" />
                  <span className="text-white text-xs font-semibold">Jaisalmer, Rajasthan</span>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm mb-5 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-[#F5A87C]" />
              <span className="text-[#F5E6D3] text-xs font-semibold">Why travelers love TripMe</span>
            </div>

            <div className="space-y-4">
              {PERKS.map(({ icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 text-base">
                    {icon}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{title}</p>
                    <p className="text-white/55 text-xs mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust footer */}
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>Trusted by 10,000+ travelers · Your data is always safe</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile top strip */}
        <div className="lg:hidden relative h-36 overflow-hidden flex-shrink-0">
          <div className="flex gap-1 h-full">
            {DESTINATION_COLLAGE.slice(0, 3).map(({ name, img }) => (
              <div key={name} className="flex-1 overflow-hidden">
                <img src={img} alt={name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1A1A1A]/80 flex flex-col items-center justify-end pb-4">
            <Link href="/">
              <img src="/logo.png" alt="TripMe" className="h-8 w-auto brightness-0 invert" />
            </Link>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-16 overflow-y-auto">
          <div className="w-full max-w-[420px] mx-auto">

            {/* Desktop heading */}
            <div className="hidden lg:block mb-6">
              <Link href="/">
                <img src="/logo.png" alt="TripMe" className="h-11 w-auto mb-6" />
              </Link>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Create your account</h1>
              <p className="text-gray-500 mt-1 text-sm">Join thousands of travelers exploring India</p>
            </div>

            {/* Mobile heading */}
            <div className="lg:hidden mb-5 text-center">
              <h1 className="text-xl font-bold text-[#1A1A1A]">Create your account</h1>
              <p className="text-gray-500 mt-0.5 text-sm">Join thousands of travelers exploring India</p>
            </div>

            <Form variant="auth" onSubmit={handleSubmit} className="relative space-y-0">
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

              <div className="grid grid-cols-1 gap-0">
                <Input
                  label="Full name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                  leftIcon={<User size={18} />}
                  error={errors.name}
                  required
                />

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
                  label="Phone number"
                  type="tel"
                  placeholder="+91 9999999999"
                  value={formData.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                  leftIcon={<Phone size={18} />}
                  error={errors.phone}
                />

                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
                  leftIcon={<Lock size={18} />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  error={errors.password}
                  helperText="Min 8 chars with uppercase, number & special character"
                  required
                />

                <Input
                  label="Confirm password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('confirmPassword', e.target.value)}
                  leftIcon={<Lock size={18} />}
                  rightIcon={
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  error={errors.confirmPassword}
                  required
                />
              </div>

              <Checkbox
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                label="I agree to the"
                error={errors.agreeToTerms}
              >
                {' '}
                <Link href="/terms" className="text-[#C45D3E] hover:text-[#A84B32] hover:underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-[#C45D3E] hover:text-[#A84B32] hover:underline">
                  Privacy Policy
                </Link>
              </Checkbox>

              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="w-full !bg-[#C45D3E] hover:!bg-[#A84B32] !rounded-xl !shadow-lg !shadow-[#C45D3E]/20"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create account'}
                <ArrowRight size={18} className="ml-2" />
              </Button>

              <Divider text="or continue with" />

              <div className="space-y-3">
                <GoogleLoginButton onError={handleGoogleError} onSuccess={handleGoogleSuccess} />
              </div>

              <p className="text-center text-gray-500 text-sm pt-2">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-[#C45D3E] font-semibold hover:text-[#A84B32] hover:underline">
                  Sign in
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
