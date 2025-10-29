import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  }, [isLoggedIn, navigate]);

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
