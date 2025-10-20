'use client';

import { useState } from 'react';
import { Step1Data } from '@/types/form';

interface Step1Props {
  onSubmit: (data: Step1Data) => void;
}

export default function Step1({ onSubmit }: Step1Props) {
  const [formData, setFormData] = useState<Step1Data>({
    parentName: '',
    studentName: '',
    studentAge: 5
  });

  const [errors, setErrors] = useState<Partial<Step1Data>>({});
  const [isLoading, setIsLoading] = useState(false);

  const ageOptions = Array.from({ length: 9 }, (_, i) => i + 2); // Ages 2 to 10

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<Step1Data> = {};
    
    if (!formData.parentName.trim()) {
      newErrors.parentName = 'Parent name is required';
    }
    
    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Student name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof Step1Data, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center relative">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 relative">
          Basic Information
          {/* Subtle text effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 bg-clip-text text-transparent blur-sm animate-pulse">
            Basic Information
          </div>
        </h2>
        <div className="text-slate-600 relative">
          <p className="relative">
            Let&apos;s start with the essential details
            {/* Subtle glow effect */}
            <span className="absolute inset-0 text-blue-400/20 blur-sm animate-pulse">
              Let&apos;s start with the essential details
            </span>
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="group">
          <label htmlFor="parentName" className="block text-sm font-semibold text-slate-700 mb-3 tracking-wide">
            Parent/Guardian Name *
          </label>
          <div className="relative">
            <input
              type="text"
              id="parentName"
              value={formData.parentName}
              onChange={(e) => handleChange('parentName', e.target.value)}
              className={`w-full px-4 py-3 bg-white/80 border-2 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none transition-all duration-300 ${
                errors.parentName 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' 
                  : 'border-slate-300 focus:border-blue-400 focus:ring-blue-500/20'
              } focus:ring-4 backdrop-blur-sm`}
              placeholder="Enter parent/guardian name"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          {errors.parentName && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              {errors.parentName}
            </p>
          )}
        </div>

        <div className="group">
          <label htmlFor="studentName" className="block text-sm font-semibold text-slate-700 mb-3 tracking-wide">
            Student Name *
          </label>
          <div className="relative">
            <input
              type="text"
              id="studentName"
              value={formData.studentName}
              onChange={(e) => handleChange('studentName', e.target.value)}
              className={`w-full px-4 py-3 bg-white/80 border-2 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none transition-all duration-300 ${
                errors.studentName 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' 
                  : 'border-slate-300 focus:border-blue-400 focus:ring-blue-500/20'
              } focus:ring-4 backdrop-blur-sm`}
              placeholder="Enter student name"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          {errors.studentName && (
            <p className="mt-2 text-sm text-red-500 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              {errors.studentName}
            </p>
          )}
        </div>

        <div className="group">
          <label htmlFor="studentAge" className="block text-sm font-semibold text-slate-700 mb-3 tracking-wide">
            Student Age *
          </label>
          <div className="relative">
            <select
              id="studentAge"
              value={formData.studentAge}
              onChange={(e) => handleChange('studentAge', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-white/80 border-2 border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
            >
              {ageOptions.map(age => (
                <option key={age} value={age} className="bg-white text-slate-800">
                  {age} years old
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="relative z-10 flex items-center">
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Next Step
                  <svg className="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </span>
            {/* Subtle background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>
      </form>
    </div>
  );
}
