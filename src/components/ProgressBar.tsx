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
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/50'
                  : 'bg-slate-700 text-slate-400 border-slate-600'
              }`}
            >
              {index + 1}
            </div>
            {index + 1 <= currentStep && (
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
            )}
          </div>
        ))}
      </div>
      
      <div className="relative">
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              animation: 'shimmer 2s infinite'
            }}></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full h-3 blur-sm"></div>
        {/* Holographic scan line */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-transparent to-purple-400/30 rounded-full h-3 animate-pulse" style={{
          background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(6, 182, 212, 0.3) 10px, rgba(6, 182, 212, 0.3) 20px)'
        }}></div>
      </div>
      
      <div className="flex justify-between mt-4 text-sm">
        <span className="text-cyan-300 font-medium">Basic Info</span>
        <span className="text-cyan-300 font-medium">School Details</span>
        <span className="text-cyan-300 font-medium">Contact</span>
      </div>
    </div>
  );
}
