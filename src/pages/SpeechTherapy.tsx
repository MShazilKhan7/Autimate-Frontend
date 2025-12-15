import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import SpeechTherapyPanel from '@/components/Therapy/SpeechTherapyPanel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import speechQuestions from '@/data/speechQuestions.json';
import { useAuth } from '@/hooks/useAuth';

export default function SpeechTherapy() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentScore, setCurrentScore] = useState<number | undefined>();

  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/auth');
      return;
    }
  }, [isLoggedIn, navigate]);

  const currentQuestion = speechQuestions[currentQuestionIndex];
  const totalQuestions = speechQuestions.length;

  const handleScore = (score: number) => {
    const newScores = [...scores, score];
    setScores(newScores);
    setCurrentScore(score);
    setIsComplete(true);

    // Auto-advance after showing score
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsComplete(false);
        setCurrentScore(undefined);
      } else {
        // Quiz complete
        completeQuiz(newScores);
      }
    }, 2500);
  };

  const completeQuiz = (finalScores: number[]) => {
    const totalScore = finalScores.reduce((sum, s) => sum + s, 0);
    const percentage = Math.round((totalScore / (totalQuestions * 10)) * 100);

    // Create session record
    const session = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: 'speech' as const,
      score: percentage,
      level: 10,
    };

    // Update level progress
    const progressIncrease = Math.max(10, percentage / 2); // At least 10% progress
    const newProgress = Math.min(100, 10 + progressIncrease);

    // Check for level up
    if (newProgress >= 100) {
      
      toast({
        title: '🎉 Level Up!',
        description: `Congratulations! You've reached Level 11!`,
      });
    } else {
      toast({
        title: 'Session Complete!',
        description: `Great job! Score: ${percentage}%`,
      });
    }

    setShowResults(true);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScores([]);
    setIsComplete(false);
    setShowResults(false);
    setCurrentScore(undefined);
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  if (showResults) {
    const totalScore = scores.reduce((sum, s) => sum + s, 0);
    const percentage = Math.round((totalScore / (totalQuestions * 10)) * 100);

    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-[calc(100vh-6rem)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg"
          >
            <Card className="therapy-card p-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="text-8xl mb-6">
                  {percentage >= 80 ? '🌟' : percentage >= 60 ? '🎉' : '💪'}
                </div>
                
                <h2 className="text-therapy-xl text-primary mb-4">
                  Session Complete!
                </h2>
                
                <div className="space-y-4 mb-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-therapy-success mb-2">
                      {percentage}%
                    </p>
                    <p className="text-muted-foreground">
                      Total Score: {totalScore}/{totalQuestions * 10}
                    </p>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {percentage >= 80 ? 'Outstanding performance! You\'re making excellent progress.' :
                       percentage >= 60 ? 'Great job! Keep practicing to improve even more.' :
                       'Good effort! Practice makes perfect.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleGoHome}
                    className="w-full py-3 rounded-xl bg-primary-soft hover:bg-primary text-foreground hover:text-primary-foreground font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Return to Dashboard
                  </Button>
                  
                  <Button
                    onClick={handleRestart}
                    variant="outline"
                    className="w-full py-3 rounded-xl"
                  >
                    Practice Again
                  </Button>
                </div>
              </motion.div>

              {/* Confetti animation */}
              {percentage >= 70 && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, y: 50 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0.5],
                        y: [50, -100],
                        x: [(Math.random() - 0.5) * 100],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                      className="absolute text-2xl"
                      style={{
                        left: `${20 + i * 10}%`,
                        bottom: 0,
                      }}
                    >
                      {['🎉', '🎊', '⭐', '🌟', '✨', '🎈', '🏆', '👏'][i]}
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (!currentQuestion) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 flex items-center justify-center min-h-[calc(100vh-6rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-therapy-xl text-primary mb-2">
              Speech Therapy Session
            </h1>
            <p className="text-muted-foreground">
              Practice pronunciation with your child
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            <SpeechTherapyPanel
              key={currentQuestionIndex}
              question={currentQuestion}
              onScore={handleScore}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
            />
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
}