"use client";
import React, { useState } from 'react';
import { X, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { apiClient } from '@/infrastructure/api/clients/api-client';
import { useAuth } from '@/core/store/auth-context';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import GoogleLoginButton from '@/components/ui/GoogleLoginButton';
import Divider from '@/components/ui/Divider';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const response = await apiClient.login(formData.email, formData.password);
        if (response.success && response.data) {
          login(response.data.user, response.data.token);
          onSuccess?.();
          onClose();
        } else {
          setError(response.message || 'Login failed. Please try again.');
        }
      } else {
        // Signup
        const response = await apiClient.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'guest'
        });
        if (response.success && response.data) {
          login(response.data.user, response.data.token);
          onSuccess?.();
          onClose();
        } else {
          setError(response.message || 'Signup failed. Please try again.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Log in' : 'Sign up'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {isLogin ? 'Welcome back to TripMe' : 'Create your TripMe account'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                required
              />
            )}

            <Input
              label="Email address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
              leftIcon={<Mail size={20} />}
              required
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
              leftIcon={<Lock size={20} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
              required
            />

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white"
              disabled={loading}
            >
              {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Log in' : 'Sign up')}
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </form>

          <Divider text="or continue with" />

          <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={(err) => setError(err)} />

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ email: '', password: '', name: '' });
              }}
              className="text-sm text-gray-600"
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="text-[#4285F4] hover:text-[#3367D6] font-semibold hover:underline">
                {isLogin ? 'Sign up' : 'Log in'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
