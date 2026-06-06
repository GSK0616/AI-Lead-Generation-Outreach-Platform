import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SignInForm from '@/components/auth/SignInForm';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} />
          Back to home
        </Link>

        {/* Card */}
        <div className="glass-dark p-8 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg"></div>
            <span className="text-xl font-bold text-white">LeadForge AI</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 mb-8">Sign in to your account to continue</p>

          <SignInForm />
        </div>
      </div>
    </div>
  );
}
