'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, signInWithGoogle } from '@/lib/auth';
import { validateEmail } from '@/utils/validation';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Chrome } from 'lucide-react';

export default function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!validateEmail(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const { user, error } = await signIn(formData.email, formData.password);
      if (error) {
        setErrors({ submit: error.message });
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { url, error } = await signInWithGoogle();
      if (error) {
        setErrors({ submit: error.message });
      } else if (url) {
        window.location.href = url;
      }
    } catch (error) {
      setErrors({ submit: 'Google sign in failed' });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {errors.submit}
        </div>
      )}

      <Input
        type="email"
        name="email"
        label="Email Address"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />

      <Input
        type="password"
        name="password"
        label="Password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="w-4 h-4 rounded" />
          <span className="text-sm text-slate-400">Remember me</span>
        </label>
        <Link href="/auth/forgot-password" className="text-sm text-cyan-500 hover:text-cyan-400">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-slate-900 text-slate-500">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full"
      >
        <Chrome size={18} className="mr-2" />
        {googleLoading ? 'Connecting...' : 'Google'}
      </Button>

      <p className="text-center text-slate-400 text-sm">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="text-cyan-500 hover:text-cyan-400">
          Create one
        </Link>
      </p>
    </form>
  );
}
