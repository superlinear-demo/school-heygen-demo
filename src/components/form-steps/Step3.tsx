'use client';

import { useState } from 'react';
import { Step3Data } from '@/types/form';

interface Step3Props {
  onSubmit: (data: Step3Data) => void;
  onPrevious: () => void;
}

export default function Step3({ onSubmit, onPrevious }: Step3Props) {
  const [formData, setFormData] = useState<Step3Data>({
    phoneNumber: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<Step3Data>>({});

  const demoPhoneNumbers = [
    { value: '919538055505', label: '+91 95380 55505' },
    { value: '919876543210', label: '+91 98765 43210' },
    { value: '919123456789', label: '+91 91234 56789' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Partial<Step3Data> = {};
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    onSubmit(formData);
  };

  const handleChange = (field: keyof Step3Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Contact Information
        </h2>
        <p className="text-slate-300">Final step - let&apos;s get in touch</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="group">
          <label htmlFor="phoneNumber" className="block text-sm font-semibold text-cyan-300 mb-3 tracking-wide">
            WhatsApp Phone Number *
          </label>
          <div className="relative">
            <select
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              className={`w-full px-4 py-3 bg-slate-700/50 border-2 rounded-xl text-white focus:outline-none transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer ${
                errors.phoneNumber 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' 
                  : 'border-slate-600 focus:border-cyan-400 focus:ring-cyan-500/20'
              } focus:ring-4`}
            >
              <option value="" className="bg-slate-700">Select a demo phone number</option>
              {demoPhoneNumbers.map(phone => (
                <option key={phone.value} value={phone.value} className="bg-slate-700">
                  {phone.label}
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
          <p className="mt-2 text-sm text-slate-400 flex items-center">
            <svg className="w-4 h-4 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            For demo purposes, please select from the available phone numbers
          </p>
          {errors.phoneNumber && (
            <p className="mt-2 text-sm text-red-400 flex items-center">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
              {errors.phoneNumber}
            </p>
          )}
        </div>

        <div className="group">
          <label htmlFor="message" className="block text-sm font-semibold text-cyan-300 mb-3 tracking-wide">
            Short Message *
          </label>
          <div className="relative">
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 bg-slate-700/50 border-2 rounded-xl text-white placeholder-slate-400 focus:outline-none transition-all duration-300 backdrop-blur-sm resize-none ${
                errors.message 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-500/20' 
                  : 'border-slate-600 focus:border-cyan-400 focus:ring-cyan-500/20'
              } focus:ring-4`}
              placeholder="Enter a short message about your interest in Fortes Education..."
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          {errors.message && (
            <p className="mt-2 text-sm text-red-400 flex items-center">
              <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
              {errors.message}
            </p>
          )}
        </div>

        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-6 rounded-xl border border-cyan-500/20 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            What happens next?
          </h3>
          <ul className="text-sm text-slate-300 space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
              You&apos;ll receive a personalized video message from our team
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              The video will be sent to your selected WhatsApp number
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
              We&apos;ll schedule your interactive session at our Dubai campus
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
              Our team will follow up with additional information
            </li>
          </ul>
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
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
          >
            <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Submit Form
          </button>
        </div>
      </form>
    </div>
  );
}
