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
  const [formId, setFormId] = useState<string | null>(null);

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
        alert('Error saving step 1. Please try again.');
      }
    } catch (error) {
      console.error('Step 1 submission error:', error);
      alert('Error saving step 1. Please try again.');
    }
  };

  const handleStep2Submit = async (data: Step2Data) => {
    setFormData(prev => ({ ...prev, step2: data }));
    
    if (formId) {
      try {
        const response = await fetch('/api/update-step2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formId, step2: data }),
        });

        if (response.ok) {
          console.log('Step 2 updated successfully');
          setCurrentStep(3);
        } else {
          alert('Error updating step 2. Please try again.');
        }
      } catch (error) {
        console.error('Step 2 update error:', error);
        alert('Error updating step 2. Please try again.');
      }
    } else {
      alert('Form ID not found. Please start over.');
    }
  };

  const handleStep3Submit = async (data: Step3Data) => {
    setFormData(prev => ({ ...prev, step3: data }));
    
    if (formId) {
      try {
        const response = await fetch('/api/update-step3', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formId, step3: data }),
        });

        if (response.ok) {
          const result = await response.json();
          alert(result.message);
          setCurrentStep(1);
          setFormData({});
          setFormId(null);
        } else {
          alert('Error completing form. Please try again.');
        }
      } catch (error) {
        console.error('Step 3 submission error:', error);
        alert('Error completing form. Please try again.');
      }
    } else {
      alert('Form ID not found. Please start over.');
    }
  };


  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/20 relative overflow-hidden group">
      {/* Enhanced animated border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 p-[1px animate-pulse">
        <div className="w-full h-full bg-slate-800/50 rounded-2xl"></div>
      </div>
      
      {/* Holographic border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      
      {/* Enhanced glowing corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-cyan-400 to-transparent rounded-br-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-purple-400 to-transparent rounded-tl-3xl opacity-40 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-pink-400 to-transparent rounded-bl-2xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-cyan-300 to-transparent rounded-tr-2xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      {/* Floating inner particles */}
      <div className="absolute top-4 right-4 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-4 w-0.5 h-0.5 bg-pink-400 rounded-full animate-ping opacity-50" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse relative">
            School Admission Form
            {/* Holographic text effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 bg-clip-text text-transparent blur-sm animate-pulse">
              School Admission Form
            </div>
          </h1>
          <div className="text-cyan-200 text-lg relative">
            <p className="relative">
              Welcome to Fortes Education! Please fill out the form below to get started.
              {/* Subtle glow effect */}
              <span className="absolute inset-0 text-cyan-100/30 blur-sm animate-pulse">
                Welcome to Fortes Education! Please fill out the form below to get started.
              </span>
            </p>
          </div>
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
    </div>
  );
}
