import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Question {
  id: number;
  question: string;
  options: string[];
}

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentQuestion: number;
  totalQuestions: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  currentQuestion,
  totalQuestions,
  canGoNext,
  canGoPrevious,
}: QuestionCardProps) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="therapy-card p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion} of {totalQuestions}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-secondary-soft rounded-full h-3">
            <motion.div
              className="h-3 rounded-full therapy-progress"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-therapy-xl text-primary mb-4 leading-relaxed">
            {question.question}
          </h2>
        </motion.div>

        {/* Answer Options */}
        <div className="space-y-4 mb-8">
          {question.options.map((option, index) => (
            <motion.div
              key={option}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            >
              <Button
                variant="outline"
                onClick={() => onAnswerSelect(option)}
                className={`w-full p-4 text-left justify-start rounded-xl transition-all duration-200 ${
                  selectedAnswer === option
                    ? 'bg-primary-soft border-primary text-primary font-medium shadow-sm'
                    : 'bg-card hover:bg-secondary-soft border-border hover:border-primary-soft'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-4 transition-all duration-200 ${
                      selectedAnswer === option
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}
                  >
                    {selectedAnswer === option && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 bg-primary-foreground rounded-full m-0.5"
                      />
                    )}
                  </div>
                  <span className="text-sm">{option}</span>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex justify-between"
        >
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="px-6 py-2 rounded-xl"
          >
            Previous
          </Button>

          <Button
            onClick={onNext}
            disabled={!canGoNext}
            className="px-6 py-2 rounded-xl bg-primary-soft hover:bg-primary text-foreground hover:text-primary-foreground font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            {currentQuestion === totalQuestions ? 'Complete' : 'Next'}
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
}