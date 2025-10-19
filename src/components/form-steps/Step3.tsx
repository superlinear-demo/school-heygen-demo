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
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            WhatsApp Phone Number *
          </label>
          <select
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a demo phone number</option>
            {demoPhoneNumbers.map(phone => (
              <option key={phone.value} value={phone.value}>
                {phone.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-gray-500">
            For demo purposes, please select from the available phone numbers
          </p>
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Short Message *
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter a short message about your interest in Fortes Education..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">What happens next?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• You&apos;ll receive a personalized video message from our team</li>
            <li>• The video will be sent to your selected WhatsApp number</li>
            <li>• We&apos;ll schedule your interactive session at our Dubai campus</li>
            <li>• Our team will follow up with additional information</li>
          </ul>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onPrevious}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Previous
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Submit Form
          </button>
        </div>
      </form>
    </div>
  );
}
