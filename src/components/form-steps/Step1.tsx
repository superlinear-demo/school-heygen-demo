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
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Basic Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
            Parent/Guardian Name *
          </label>
          <input
            type="text"
            id="parentName"
            value={formData.parentName}
            onChange={(e) => handleChange('parentName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.parentName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter parent/guardian name"
          />
          {errors.parentName && (
            <p className="mt-1 text-sm text-red-600">{errors.parentName}</p>
          )}
        </div>

        <div>
          <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
            Student Name *
          </label>
          <input
            type="text"
            id="studentName"
            value={formData.studentName}
            onChange={(e) => handleChange('studentName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.studentName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter student name"
          />
          {errors.studentName && (
            <p className="mt-1 text-sm text-red-600">{errors.studentName}</p>
          )}
        </div>

        <div>
          <label htmlFor="studentAge" className="block text-sm font-medium text-gray-700 mb-2">
            Student Age *
          </label>
          <select
            id="studentAge"
            value={formData.studentAge}
            onChange={(e) => handleChange('studentAge', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {ageOptions.map(age => (
              <option key={age} value={age}>
                {age} years old
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
}
