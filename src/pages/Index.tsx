import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

const Index = () => {
  const { state } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on user state
    if (!state.user?.isAuthenticated) {
      navigate('/auth');
    } else if (!state.child) {
      navigate('/child-info');
    } else if (!state.onboardingCompleted) {
      navigate('/onboarding');
    } else {
      navigate('/dashboard');
    }
  }, [state, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-4 animate-pulse-soft">🌈</div>
        <h1 className="text-therapy-xl text-primary mb-2">Loading TherapyPal...</h1>
      </div>
    </div>
  );
};

export default Index;
