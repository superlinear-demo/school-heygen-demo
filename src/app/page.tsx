import AdmissionForm from '@/components/AdmissionForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-cyan-300 rounded-full animate-ping opacity-30" style={{animationDelay: '3s'}}></div>
        
        {/* Holographic lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-50 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-pink-400 to-transparent opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-50 animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>
      
      {/* Enhanced grid pattern overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.15) 1px, transparent 0)`,
          backgroundSize: '20px 20px'
        }}></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Holographic scan lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent animate-pulse" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.1) 2px, rgba(6, 182, 212, 0.1) 4px)'
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 py-8">
        <AdmissionForm />
      </div>
    </div>
  );
}
