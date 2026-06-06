'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-white">{label}</label>}
      <input
        {...props}
        className={`px-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
          error
            ? 'border-red-500 focus:ring-red-500/30'
            : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/30'
        }`}
      />
      {error && <span className="text-sm text-red-400">{error}</span>}
    </div>
  );
}
