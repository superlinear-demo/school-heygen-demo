'use client';

import { useState } from 'react';
import { Step1Data, Step2Data, Step3Data } from '@/types/form';
import Step1 from './form-steps/Step1';
import Step2 from './form-steps/Step2';
import Step3 from './form-steps/Step3';
import ProgressBar from './ProgressBar';

export default function AdmissionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{
    step1?: Step1Data;
    step2?: Step2Data;
    step3?: Step3Data;
  }>({});

  const handleStep1Submit = (data: Step1Data) => {
    setFormData(prev => ({ ...prev, step1: data }));
    setCurrentStep(2);
  };

  const handleStep2Submit = (data: Step2Data) => {
    setFormData(prev => ({ ...prev, step2: data }));
    setCurrentStep(3);
  };

  const handleStep3Submit = (data: Step3Data) => {
    setFormData(prev => ({ ...prev, step3: data }));
    // Submit the complete form
    submitCompleteForm({ ...formData, step3: data });
  };

  const submitCompleteForm = async (completeData: any) => {
    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeData),
      });

      if (response.ok) {
        alert('Form submitted successfully! You will receive a personalized video message shortly.');
        setCurrentStep(1);
        setFormData({});
      } else {
        alert('There was an error submitting the form. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting the form. Please try again.');
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
          School Admission Form
        </h1>
        <p className="text-center text-gray-600">
          Welcome to Fortes Education! Please fill out the form below to get started.
        </p>
      </div>

      <ProgressBar currentStep={currentStep} totalSteps={3} />

      <div className="mt-8">
        {currentStep === 1 && (
          <Step1 onSubmit={handleStep1Submit} />
        )}
        {currentStep === 2 && (
          <Step2 
            onSubmit={handleStep2Submit} 
            onPrevious={goToPreviousStep}
          />
        )}
        {currentStep === 3 && (
          <Step3 
            onSubmit={handleStep3Submit} 
            onPrevious={goToPreviousStep}
          />
        )}
      </div>
    </div>
  );
}
