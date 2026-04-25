import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { QuestionWithAnswers } from '@/types/onboarding';

interface QuestionCardProps {
  question: QuestionWithAnswers;
  selectedAnswer?: string;
  onAnswerSelect: (answerId: string, answerText: string) => void;
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

  const handleAnswerClick = (answer: { _id: string; answerText: string }) => {
    onAnswerSelect(answer._id, answer.answerText);
  };

  const getAnswerButtonClass = (answerText: string) => {
    const baseClasses = "w-full p-5 text-left justify-start rounded-xl transition-all duration-300 border-2 ";
    
    if (selectedAnswer === answerText) {
      return baseClasses + "bg-primary/5 border-primary text-primary font-semibold shadow-sm scale-[1.02]";
    }
    
    return baseClasses + "bg-muted/10 hover:bg-muted/30 border-transparent hover:border-primary/30 text-foreground";
  };

  const getRadioClass = (answerText: string) => {
    const baseClasses = "w-5 h-5 rounded-full border-2 mr-4 transition-all duration-200 flex items-center justify-center ";
    
    if (selectedAnswer === answerText) {
      return baseClasses + "border-primary bg-primary";
    }
    
    return baseClasses + "border-muted-foreground bg-transparent";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="p-8 md:p-10 border-white/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-[2rem]">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion} of {totalQuestions}
            </span>
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-primary to-primary-soft"
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
          <div className="flex items-start mb-4">
            <div className="bg-primary-soft text-primary rounded-lg px-3 py-1 text-sm font-medium mr-3 mt-1">
              Q{currentQuestion}
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-primary leading-relaxed flex-1">
              {question.questionText}
            </h2>
          </div>
        </motion.div>

        {/* Answer Options */}
        <div className="space-y-4 mb-8">
          {question.answers.map((answer, index) => (
            <motion.div
              key={answer._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                variant="ghost"
                onClick={() => handleAnswerClick(answer)}
                className={getAnswerButtonClass(answer.answerText)}
                disabled={!!selectedAnswer && selectedAnswer !== answer.answerText}
              >
                <div className="flex items-center w-full">
                  <div className={getRadioClass(answer.answerText)}>
                    {selectedAnswer === answer.answerText && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </div>
                  <span className="text-base font-normal text-left flex-1">
                    {answer.answerText}
                  </span>
                  
                  {/* Selection indicator */}
                  {selectedAnswer === answer.answerText && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="ml-2 text-primary"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  )}
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
          className="flex justify-between items-center pt-8 border-t border-border/50"
        >
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="px-6 py-5 rounded-xl border-2 border-transparent bg-muted/20 hover:bg-muted/40 transition-all duration-300"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Button>

          <div className="flex items-center space-x-4">
            {selectedAnswer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Answer Selected
              </motion.div>
            )}
            
            <Button
              onClick={onNext}
              disabled={!canGoNext}
              className="px-8 py-5 rounded-xl bg-gradient-to-r from-primary to-primary-soft hover:from-primary/90 hover:to-primary-soft/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {currentQuestion === totalQuestions ? (
                <>
                  Complete Assessment
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              ) : (
                <>
                  Next Question
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center space-x-6 text-sm text-muted-foreground bg-muted/20 px-6 py-3 rounded-full">
            <span>Total: <strong className="text-foreground">{totalQuestions}</strong></span>
            <span>•</span>
            <span>Completed: <strong className="text-foreground">{currentQuestion - 1}</strong></span>
            <span>•</span>
            <span>Remaining: <strong className="text-foreground">{totalQuestions - currentQuestion + 1}</strong></span>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}