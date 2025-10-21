'use client';

import { useState } from 'react';
import { Step2Data } from '@/types/form';

interface Step2Props {
  onSubmit: (data: Step2Data) => void;
  onPrevious: () => void;
}

export default function Step2({ onSubmit, onPrevious }: Step2Props) {
  const [formData, setFormData] = useState<Step2Data>({
    currentGrade: '',
    currentSchool: '',
    placeOfStudy: '',
    areaOfInterest: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState<Partial<Step2Data>>({});
  const [isLoading, setIsLoading] = useState(false);

  const gradeOptions = [
    'Pre-K', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 
    'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'
  ];

  const interestOptions = [
    'Science & Technology',
    'Arts & Music',
    'Sports & Athletics',
    'Languages',
    'Mathematics',
    'Literature & Reading',
    'Environmental Studies',
    'Leadership & Public Speaking',
    'Creative Writing',
    'Robotics & Coding'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<Step2Data> = {};
    
    if (!formData.currentGrade) {
      newErrors.currentGrade = 'Current grade is required';
    }
    
    if (!formData.currentSchool.trim()) {
      newErrors.currentSchool = 'Current school is required';
    }
    
    if (!formData.placeOfStudy.trim()) {
      newErrors.placeOfStudy = 'Place of study is required';
    }
    
    if (!formData.areaOfInterest) {
      newErrors.areaOfInterest = 'Area of interest is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
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

  const handleChange = (field: keyof Step2Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          School Information
        </h2>
        <p className="text-slate-300">Tell us about the student&apos;s educational background</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="group">
          <label htmlFor="currentGrade" className="block text-sm font-semibold text-cyan-300 mb-3 tracking-wide">
            Current Grade *
          </label>
          <div className="relative">
            <select
              id="currentGrade"
              value={formData.currentGrade}
              onChange={(e) => handleChange('currentGrade', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700/50 border-2 rounded-xl text-white focus:outline-none transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer ${
                errors.currentGrade 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' 
                  : 'border-slate-600 focus:border-cyan-400 focus:ring-cyan-500/20'
              } focus:ring-4`}
            >
              <option value="" className="bg-slate-700">Select current grade</option>
              {gradeOptions.map(grade => (
                <option key={grade} value={grade} className="bg-slate-700">
                  {grade}
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
          {errors.currentGrade && (
            <p className="mt-2 text-sm text-red-400 flex items-center">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
              {errors.currentGrade}
            </p>
          )}
        </div>

        <div className="group">
          <label htmlFor="currentSchool" className="block text-sm font-semibold text-cyan-300 mb-3 tracking-wide">
            Current School *
          </label>
          <div className="relative">
            <input
              type="text"
              id="currentSchool"
              value={formData.currentSchool}
              onChange={(e) => handleChange('currentSchool', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700/50 border-2 rounded-xl text-white placeholder-slate-400 focus:outline-none transition-all duration-300 ${
                errors.currentSchool 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' 
                  : 'border-slate-600 focus:border-cyan-400 focus:ring-cyan-500/20'
              } focus:ring-4 backdrop-blur-sm`}
              placeholder="Enter current school name"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          {errors.currentSchool && (
            <p className="mt-2 text-sm text-red-400 flex items-center">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
              {errors.currentSchool}
            </p>
          )}
        </div>

        <div className="group">
          <label htmlFor="placeOfStudy" className="block text-sm font-semibold text-cyan-300 mb-3 tracking-wide">
            Place of Study *
          </label>
          <div className="relative">
            <input
              type="text"
              id="placeOfStudy"
              value={formData.placeOfStudy}
              onChange={(e) => handleChange('placeOfStudy', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700/50 border-2 rounded-xl text-white placeholder-slate-400 focus:outline-none transition-all duration-300 ${
                errors.placeOfStudy 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' 
                  : 'border-slate-600 focus:border-cyan-400 focus:ring-cyan-500/20'
              } focus:ring-4 backdrop-blur-sm`}
              placeholder="Enter city/country of study"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          {errors.placeOfStudy && (
            <p className="mt-2 text-sm text-red-400 flex items-center">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
              {errors.placeOfStudy}
            </p>
          )}
        </div>

        <div className="group">
          <label htmlFor="areaOfInterest" className="block text-sm font-semibold text-cyan-300 mb-3 tracking-wide">
            Student&apos;s Area of Interest *
          </label>
          <div className="relative">
            <select
              id="areaOfInterest"
              value={formData.areaOfInterest}
              onChange={(e) => handleChange('areaOfInterest', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700/50 border-2 rounded-xl text-white focus:outline-none transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer ${
                errors.areaOfInterest 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' 
                  : 'border-slate-600 focus:border-cyan-400 focus:ring-cyan-500/20'
              } focus:ring-4`}
            >
              <option value="" className="bg-slate-700">Select area of interest</option>
              {interestOptions.map(interest => (
                <option key={interest} value={interest} className="bg-slate-700">
                  {interest}
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
          {errors.areaOfInterest && (
            <p className="mt-2 text-sm text-red-400 flex items-center">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
              {errors.areaOfInterest}
            </p>
          )}
        </div>

        <div className="group">
          <label htmlFor="phoneNumber" className="block text-sm font-semibold text-cyan-300 mb-3 tracking-wide">
            WhatsApp Phone Number *
          </label>
          <div className="relative">
            <input
              type="tel"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700/50 border-2 rounded-xl text-white placeholder-slate-400 focus:outline-none transition-all duration-300 ${
                errors.phoneNumber 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' 
                  : 'border-slate-600 focus:border-cyan-400 focus:ring-cyan-500/20'
              } focus:ring-4 backdrop-blur-sm`}
              placeholder="Enter WhatsApp number (e.g., +919538055505)"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          {errors.phoneNumber && (
            <p className="mt-2 text-sm text-red-400 flex items-center">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
              {errors.phoneNumber}
            </p>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onPrevious}
            className="px-6 py-3 bg-slate-700 text-slate-300 font-semibold rounded-xl hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500/20 transition-all duration-300 border border-slate-600"
          >
            <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
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
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit Application
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
