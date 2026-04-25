import AuthCard from '@/components/Auth/AuthCard';

export default function Auth() {
  return (
    <div className="h-screen w-full flex bg-background overflow-hidden">
      {/* Left Panel - Image Background (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-start p-16">
        <img 
          src="/auth-bg.jpg" 
          alt="Autism Speech Therapy" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Black overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
        
        <div className="relative z-10 mt-8">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
            Empowering Every Voice, <br /> One Step at a Time
          </h1>
          <p className="text-lg text-white/90 max-w-md leading-relaxed drop-shadow-md">
            Personalized speech therapy tools designed to support children with autism on their unique journey to communication.
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle background element for mobile */}
        <div className="absolute inset-0 lg:hidden bg-gradient-to-br from-primary-soft/30 to-background z-0" />
        
        <div className="relative z-10 w-full max-w-md">
          <AuthCard />
        </div>
      </div>
    </div>
  );
}