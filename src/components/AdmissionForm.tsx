'use client';

import { useState } from 'react';
import { Step1Data, Step2Data } from '@/types/form';
import Step1 from './form-steps/Step1';
import Step2 from './form-steps/Step2';
import ProgressBar from './ProgressBar';
import SuccessScreen from './SuccessScreen';

export default function AdmissionForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setFormData] = useState<{
    step1?: Step1Data;
    step2?: Step2Data;
  }>({});
  const [formId, setFormId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);

  const handleStep1Submit = async (data: Step1Data) => {
    setFormData(prev => ({ ...prev, step1: data }));
    
    try {
      const response = await fetch('/api/submit-step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step1: data }),
      });

      if (response.ok) {
        const result = await response.json();
        setFormId(result.formId);
        console.log('Step 1 saved, HeyGen initiated:', result);
        setCurrentStep(2);
      } else {
        setSuccessMessage('Error saving step 1. Please try again.');
      }
    } catch (error) {
      console.error('Step 1 submission error:', error);
      setSuccessMessage('Error saving step 1. Please try again.');
    }
  };

  const handleStep2Submit = async (data: Step2Data) => {
    setFormData(prev => ({ ...prev, step2: data }));
    
    if (formId) {
      try {
        const response = await fetch('/api/update-step3', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formId, step3: { phoneNumber: data.phoneNumber, message: '' } }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Form completed successfully:', result);
          setIsCompleted(true);
        } else {
          setSuccessMessage('Error completing form. Please try again.');
        }
      } catch (error) {
        console.error('Step 2 submission error:', error);
        setSuccessMessage('Error completing form. Please try again.');
      }
    } else {
      setSuccessMessage('Form ID not found. Please start over.');
    }
  };



  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setFormData({});
    setFormId(null);
    setSuccessMessage('');
    setIsCompleted(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full mx-auto p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-200/30 relative overflow-hidden group">
      {/* Subtle animated border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-200/30 via-indigo-200/30 to-purple-200/30 p-[1px animate-pulse">
        <div className="w-full h-full bg-white/80 rounded-2xl"></div>
      </div>
      
      {/* Subtle border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-100/20 via-indigo-100/20 to-purple-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      
      {/* Subtle corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-300 to-transparent rounded-br-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-indigo-300 to-transparent rounded-tl-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-purple-300 to-transparent rounded-bl-2xl opacity-25 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-200 to-transparent rounded-tr-2xl opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      {/* Subtle floating particles */}
      <div className="absolute top-4 right-4 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-40"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-indigo-300 rounded-full animate-ping opacity-30" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-4 w-0.5 h-0.5 bg-purple-300 rounded-full animate-ping opacity-35" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 animate-pulse relative">
            School Admission Form
            {/* Subtle text effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-400/20 bg-clip-text text-transparent blur-sm animate-pulse">
              School Admission Form
            </div>
          </h1>
          <div className="text-slate-600 text-lg relative">
            <p className="relative">
              Welcome to Fortes Education! Please fill out the form below to get started.
              {/* Subtle glow effect */}
              <span className="absolute inset-0 text-blue-400/20 blur-sm animate-pulse">
                Welcome to Fortes Education! Please fill out the form below to get started.
              </span>
            </p>
          </div>
        </div>

            <ProgressBar currentStep={currentStep} totalSteps={2} />

        {/* Success Message - Only show errors */}
        {successMessage && successMessage.includes('Error') && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="mt-8">
          {isCompleted ? (
            <SuccessScreen 
              formId={formId!} 
              onRestart={handleRestart}
            />
          ) : (
            <>
              {currentStep === 1 && (
                <Step1 onSubmit={handleStep1Submit} />
              )}
              {currentStep === 2 && (
                <Step2 
                  onSubmit={handleStep2Submit} 
                  onPrevious={goToPreviousStep}
                />
              )}
            </>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
