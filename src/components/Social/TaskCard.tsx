import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SocialTask {
  id: number;
  task: string;
  image: string;
  description: string;
  instruction: string;
  category: string;
}

interface TaskCardProps {
  task: SocialTask;
  isCompleted: boolean;
  onComplete: (taskId: number) => void;
}

export default function TaskCard({ task, isCompleted, onComplete }: TaskCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCardClick = () => {
    if (isAnimating || isCompleted) return;
    
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted) {
      onComplete(task.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative"
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className={`flip-card-inner relative w-full h-64 transition-transform duration-600 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front of card */}
        <Card
          className={`flip-card-front absolute inset-0 therapy-card p-6 cursor-pointer transition-all duration-200 ${
            isCompleted ? 'bg-therapy-success/10 border-therapy-success/30' : 'hover:scale-105'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
          onClick={handleCardClick}
        >
          <div className="h-full flex flex-col items-center justify-center text-center relative">
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-8 h-8 bg-therapy-success rounded-full flex items-center justify-center"
              >
                <Check className="w-5 h-5 text-white" />
              </motion.div>
            )}
            
            <div className="text-6xl mb-4">
              {task.image}
            </div>
            
            <h3 className="text-therapy-lg text-primary font-semibold mb-2">
              {task.task}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {task.description}
            </p>
            
            <div className="mt-auto">
              <div className="inline-block px-3 py-1 bg-secondary-soft rounded-full text-xs text-muted-foreground capitalize">
                {task.category}
              </div>
            </div>
            
            {!isCompleted && (
              <p className="text-xs text-primary mt-2 font-medium">
                Tap to learn how!
              </p>
            )}
          </div>
        </Card>

        {/* Back of card */}
        <Card
          className="flip-card-back absolute inset-0 therapy-card p-6 cursor-pointer"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
          onClick={handleCardClick}
        >
          <div className="h-full flex flex-col justify-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isFlipped ? 1 : 0, scale: isFlipped ? 1 : 0.8 }}
              transition={{ duration: 0.3, delay: isFlipped ? 0.3 : 0 }}
            >
              <div className="text-4xl mb-4">
                {task.image}
              </div>
              
              <h3 className="text-therapy-lg text-primary font-semibold mb-4">
                How to: {task.task}
              </h3>
              
              <p className="text-sm text-foreground mb-6 leading-relaxed">
                {task.instruction}
              </p>
              
              <Button
                onClick={handleComplete}
                disabled={isCompleted}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                  isCompleted
                    ? 'bg-therapy-success text-white'
                    : 'bg-primary-soft hover:bg-primary text-foreground hover:text-primary-foreground'
                }`}
              >
                {isCompleted ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Completed!
                  </>
                ) : (
                  'Mark as Practiced'
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground mt-3">
                Tap anywhere to flip back
              </p>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}