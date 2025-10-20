interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-4">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 ${
                index + 1 <= currentStep
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-400 shadow-lg shadow-blue-500/50'
                  : 'bg-slate-200 text-slate-500 border-slate-300'
              }`}
            >
              {index + 1}
            </div>
            {index + 1 <= currentStep && (
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 animate-pulse"></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="relative">
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            {/* Subtle shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: 'shimmer 2s infinite'
            }}></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-full h-3 blur-sm"></div>
        {/* Subtle scan line */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-indigo-400/20 rounded-full h-3 animate-pulse" style={{
          background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(59, 130, 246, 0.2) 10px, rgba(59, 130, 246, 0.2) 20px)'
        }}></div>
      </div>
      
        <div className="flex justify-between mt-4 text-sm">
          <span className="text-slate-600 font-medium">Basic Info</span>
          <span className="text-slate-600 font-medium">School & Contact</span>
        </div>
    </div>
  );
}
