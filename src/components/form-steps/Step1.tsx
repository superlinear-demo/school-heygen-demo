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

  const ageOptions = Array.from({ length: 9 }, (_, i) => i + 2); // Ages 2 to 10

  const handleSubmit = (e: React.FormEvent) => {
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
    onSubmit(formData);
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
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2 relative">
          Basic Information
          {/* Holographic text effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 bg-clip-text text-transparent blur-sm animate-pulse">
            Basic Information
          </div>
        </h2>
        <div className="text-slate-300 relative">
          <p className="relative">
            Let&apos;s start with the essential details
            {/* Subtle glow effect */}
            <span className="absolute inset-0 text-cyan-100/20 blur-sm animate-pulse">
              Let&apos;s start with the essential details
            </span>
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="group">
          <label htmlFor="parentName" className="block text-sm font-semibold text-cyan-300 mb-3 tracking-wide">
            Parent/Guardian Name *
          </label>
          <div className="relative">
            <input
              type="text"
              id="parentName"
              value={formData.parentName}
              onChange={(e) => handleChange('parentName', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700/50 border-2 rounded-xl text-white placeholder-slate-400 focus:outline-none transition-all duration-300 ${
                errors.parentName 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' 
                  : 'border-slate-600 focus:border-cyan-400 focus:ring-cyan-500/20'
              } focus:ring-4 backdrop-blur-sm`}
              placeholder="Enter parent/guardian name"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          {errors.parentName && (
            <p className="mt-2 text-sm text-red-400 flex items-center">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
              {errors.parentName}
            </p>
          )}
        </div>

        <div className="group">
          <label htmlFor="studentName" className="block text-sm font-semibold text-cyan-300 mb-3 tracking-wide">
            Student Name *
          </label>
          <div className="relative">
            <input
              type="text"
              id="studentName"
              value={formData.studentName}
              onChange={(e) => handleChange('studentName', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700/50 border-2 rounded-xl text-white placeholder-slate-400 focus:outline-none transition-all duration-300 ${
                errors.studentName 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' 
                  : 'border-slate-600 focus:border-cyan-400 focus:ring-cyan-500/20'
              } focus:ring-4 backdrop-blur-sm`}
              placeholder="Enter student name"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          {errors.studentName && (
            <p className="mt-2 text-sm text-red-400 flex items-center">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
              {errors.studentName}
            </p>
          )}
        </div>

        <div className="group">
          <label htmlFor="studentAge" className="block text-sm font-semibold text-cyan-300 mb-3 tracking-wide">
            Student Age *
          </label>
          <div className="relative">
            <select
              id="studentAge"
              value={formData.studentAge}
              onChange={(e) => handleChange('studentAge', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-slate-700/50 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
            >
              {ageOptions.map(age => (
                <option key={age} value={age} className="bg-slate-700">
                  {age} years old
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25 relative overflow-hidden holographic-button"
          >
            <span className="relative z-10 flex items-center">
              Next Step
              <svg className="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            {/* Animated background shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>
      </form>
    </div>
  );
}
