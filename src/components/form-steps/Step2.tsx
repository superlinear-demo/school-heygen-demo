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
    areaOfInterest: ''
  });

  const [errors, setErrors] = useState<Partial<Step2Data>>({});

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

  const handleSubmit = (e: React.FormEvent) => {
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
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    onSubmit(formData);
  };

  const handleChange = (field: keyof Step2Data, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">School Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="currentGrade" className="block text-sm font-medium text-gray-700 mb-2">
            Current Grade *
          </label>
          <select
            id="currentGrade"
            value={formData.currentGrade}
            onChange={(e) => handleChange('currentGrade', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.currentGrade ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select current grade</option>
            {gradeOptions.map(grade => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
          {errors.currentGrade && (
            <p className="mt-1 text-sm text-red-600">{errors.currentGrade}</p>
          )}
        </div>

        <div>
          <label htmlFor="currentSchool" className="block text-sm font-medium text-gray-700 mb-2">
            Current School *
          </label>
          <input
            type="text"
            id="currentSchool"
            value={formData.currentSchool}
            onChange={(e) => handleChange('currentSchool', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.currentSchool ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter current school name"
          />
          {errors.currentSchool && (
            <p className="mt-1 text-sm text-red-600">{errors.currentSchool}</p>
          )}
        </div>

        <div>
          <label htmlFor="placeOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
            Place of Study *
          </label>
          <input
            type="text"
            id="placeOfStudy"
            value={formData.placeOfStudy}
            onChange={(e) => handleChange('placeOfStudy', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.placeOfStudy ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter city/country of study"
          />
          {errors.placeOfStudy && (
            <p className="mt-1 text-sm text-red-600">{errors.placeOfStudy}</p>
          )}
        </div>

        <div>
          <label htmlFor="areaOfInterest" className="block text-sm font-medium text-gray-700 mb-2">
            Student&apos;s Area of Interest *
          </label>
          <select
            id="areaOfInterest"
            value={formData.areaOfInterest}
            onChange={(e) => handleChange('areaOfInterest', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.areaOfInterest ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select area of interest</option>
            {interestOptions.map(interest => (
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </select>
          {errors.areaOfInterest && (
            <p className="mt-1 text-sm text-red-600">{errors.areaOfInterest}</p>
          )}
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
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
}
