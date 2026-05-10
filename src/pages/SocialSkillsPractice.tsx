import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, Mic, Check, RotateCcw, Star } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { socialAPI } from '@/api/social';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { playSuccessSound, playErrorSound } from '@/utils/sounds';


export default function SocialSkillsPractice() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();

  const [isListening, setIsListening] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [stars, setStars] = useState(0);

  // Fetch from API
  const { data: skillData, isLoading } = useQuery({
    queryKey: ['social-skill', taskId],
    queryFn: () => socialAPI.getById(taskId!),
    enabled: !!taskId
  });

  const task = skillData?.data;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth');
    }
  }, [isLoggedIn, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="p-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading practice session...</p>
        </div>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <Card className="therapy-card p-8 text-center">
            <div className="text-6xl mb-4">🤔</div>
            <h2 className="text-2xl font-bold text-primary mb-2">Task Not Found</h2>
            <p className="text-muted-foreground mb-4">This task doesn't exist.</p>
            <Button onClick={() => navigate('/social-skills')}>
              Go Back
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(task.task);
      utterance.rate = 0.7;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRecord = () => {
    if (isCompleted) return;

    setIsListening(true);
    setFeedback(null);

    // Simulate recording for 2 seconds
    setTimeout(() => {
      setIsListening(false);
      setAttempts(prev => prev + 1);

      // Simulate feedback (random success for demo)
      const success = Math.random() > 0.3;
      
      if (success) {
        const earnedStars = attempts === 0 ? 3 : attempts === 1 ? 2 : 1;
        setStars(earnedStars);
        setIsCompleted(true);
        setFeedback('Amazing! Great job!');
        playSuccessSound();
        
        toast({
          title: '🌟 Wonderful!',
          description: `You said "${task.task}" perfectly!`,
        });
      } else {
        setFeedback('Almost there! Try again!');
        playErrorSound();
        toast({
          title: 'Keep Trying! 💪',
          description: "You're getting closer! Let's try one more time.",
          variant: "destructive"
        });
      }


    }, 2000);
  };

  const handleReset = () => {
    setIsCompleted(false);
    setAttempts(0);
    setFeedback(null);
    setStars(0);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/social-skills')}
            className="rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-primary">Practice Time!</h1>
            <p className="text-muted-foreground capitalize">{task.category}</p>
          </div>
        </motion.div>

        {/* Main Practice Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="therapy-card p-8 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-16 -left-16 w-32 h-32 bg-therapy-success/5 rounded-full"
              />
            </div>

            <div className="relative z-10">
              {/* Big Image Display */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="text-center mb-6"
              >
                <img 
                  src={task.image} 
                  alt={task.task} 
                  className="w-44 h-44 sm:w-52 sm:h-52 object-cover rounded-3xl shadow-xl mx-auto mb-4"
                />
                
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl sm:text-5xl font-bold text-primary mb-2"
                >
                  {task.task}
                </motion.h2>
                
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  {task.description}
                </p>
              </motion.div>

              {/* Instruction Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-secondary-soft/50 rounded-2xl p-6 mb-6"
              >
                <h3 className="text-lg font-semibold text-primary mb-2 flex items-center gap-2">
                  <span className="text-2xl">📝</span> How to do it:
                </h3>
                <p className="text-foreground text-lg leading-relaxed">
                  {task.instruction}
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                {/* Listen Button */}
                <Button
                  onClick={speakWord}
                  size="lg"
                  className="w-full sm:w-auto px-8 py-6 text-lg rounded-2xl bg-primary-soft hover:bg-primary text-foreground hover:text-primary-foreground transition-all duration-200 hover:scale-105"
                >
                  <Volume2 className="w-6 h-6 mr-3" />
                  Listen
                </Button>

                {/* Record Button */}
                <Button
                  onClick={handleRecord}
                  disabled={isListening || isCompleted}
                  size="lg"
                  className={`w-full sm:w-auto px-8 py-6 text-lg rounded-2xl transition-all duration-200 hover:scale-105 ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : isCompleted
                      ? 'bg-therapy-success text-white'
                      : 'bg-therapy-success/80 hover:bg-therapy-success text-white'
                  }`}
                >
                  {isListening ? (
                    <>
                      <Mic className="w-6 h-6 mr-3 animate-pulse" />
                      Listening...
                    </>
                  ) : isCompleted ? (
                    <>
                      <Check className="w-6 h-6 mr-3" />
                      Completed!
                    </>
                  ) : (
                    <>
                      <Mic className="w-6 h-6 mr-3" />
                      Say It!
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Feedback Display */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    className="mt-6 text-center"
                  >
                    <div className={`inline-block px-6 py-3 rounded-2xl text-xl font-bold ${
                      isCompleted 
                        ? 'bg-therapy-success/20 text-therapy-success' 
                        : 'bg-primary-soft text-primary'
                    }`}>
                      {feedback}
                    </div>

                    {/* Stars */}
                    {isCompleted && stars > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="flex justify-center gap-2 mt-4"
                      >
                        {[1, 2, 3].map((star) => (
                          <motion.div
                            key={star}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ 
                              scale: star <= stars ? 1 : 0.5, 
                              rotate: 0,
                              opacity: star <= stars ? 1 : 0.3
                            }}
                            transition={{ delay: 0.3 + star * 0.1, type: 'spring' }}
                          >
                            <Star 
                              className={`w-10 h-10 ${
                                star <= stars 
                                  ? 'text-yellow-400 fill-yellow-400' 
                                  : 'text-muted-foreground'
                              }`} 
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reset / Next Actions */}
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6"
                >
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto px-6 py-4 rounded-xl"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Try Again
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/social-skills')}
                    size="lg"
                    className="w-full sm:w-auto px-6 py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    More Tasks
                  </Button>
                </motion.div>
              )}

              {/* Attempts counter */}
              {attempts > 0 && !isCompleted && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm text-muted-foreground mt-4"
                >
                  Attempt {attempts} - You're doing great! Keep trying!
                </motion.p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Encouragement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-muted-foreground">
            🌈 Take your time! Practice makes perfect! 🌈
          </p>
        </motion.div>
      </div>
    </Layout>
  );
}
