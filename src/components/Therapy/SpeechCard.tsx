import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import RecordingButton from './RecordingButton';

interface SpeechQuestion {
  id: number;
  word: string;
  image: string;
  category: string;
  difficulty: number;
}

interface SpeechCardProps {
  question: SpeechQuestion;
  onScore: (score: number) => void;
  questionNumber: number;
  totalQuestions: number;
  isComplete?: boolean;
  score?: number;
}

export default function SpeechCard({
  question,
  onScore,
  questionNumber,
  totalQuestions,
  isComplete = false,
  score,
}: SpeechCardProps) {
  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg mx-auto"
    >
      <Card className="therapy-card p-8 text-center">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-secondary-soft rounded-full h-2">
            <motion.div
              className="h-2 rounded-full therapy-progress"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Word Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <img 
            src={question.image} 
            alt={question.word} 
            className="w-40 h-40 object-cover rounded-3xl shadow-xl mx-auto mb-4"
          />
          
          <h2 className="text-4xl font-bold text-primary mb-2">
            {question.word}
          </h2>
          
          <p className="text-sm text-muted-foreground capitalize">
            {question.category}
          </p>
        </motion.div>

        {/* Recording Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-6"
        >
          {isComplete && score !== undefined ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="text-6xl">
                {score >= 9 ? '🌟' : score >= 7 ? '👏' : '💪'}
              </div>
              
              <div>
                <p className="text-2xl font-bold text-therapy-success mb-2">
                  {score}/10
                </p>
                <p className="text-sm text-muted-foreground">
                  {score >= 9 ? 'Excellent pronunciation!' : 
                   score >= 7 ? 'Great job! Keep practicing!' : 
                   'Good effort! Try again!'}
                </p>
              </div>
            </motion.div>
          ) : (
            <RecordingButton
              onRecordingComplete={onScore}
              disabled={isComplete}
            />
          )}
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <p className="text-sm text-muted-foreground">
            {isComplete ? 
              'Well done! Get ready for the next word.' :
              `Look at the ${question.category} and say "${question.word}" clearly`
            }
          </p>
        </motion.div>
      </Card>
    </motion.div>
  );
}