import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

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

export default function TaskCard({ task, isCompleted }: TaskCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/social/practice/${task.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={`therapy-card p-6 cursor-pointer transition-all duration-200 h-64 ${
          isCompleted ? 'bg-therapy-success/10 border-therapy-success/30' : 'hover:shadow-lg'
        }`}
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
          
          <p className="text-xs text-primary mt-2 font-medium">
            Tap to practice!
          </p>
        </div>
      </Card>
    </motion.div>
  );
}