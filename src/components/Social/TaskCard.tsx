import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';

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

const categoryColors: Record<string, string> = {
  greetings:    'bg-emerald-100 text-emerald-700',
  sharing:      'bg-violet-100 text-violet-700',
  conversation: 'bg-sky-100 text-sky-700',
  emotions:     'bg-rose-100 text-rose-700',
  cooperation:  'bg-amber-100 text-amber-700',
};

export default function TaskCard({ task, isCompleted }: TaskCardProps) {
  const navigate = useNavigate();
  const catStyle = categoryColors[task.category.toLowerCase()] ?? 'bg-muted/30 text-muted-foreground';

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/social/practice/${task.id}`)}
      className={`relative cursor-pointer rounded-3xl overflow-hidden border transition-all duration-300 group shadow-lg hover:shadow-xl ${
        isCompleted
          ? 'border-emerald-200 bg-emerald-50/80'
          : 'border-white/60 bg-white/80 backdrop-blur-xl'
      }`}
    >
      {/* Completed badge */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-md shadow-emerald-500/30"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}

      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-muted/10">
        <img
          src={task.image}
          alt={task.task}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isCompleted ? 'opacity-80' : ''}`}
        />
        {/* gradient overlay at bottom of image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-foreground leading-snug flex-1">{task.task}</h3>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full capitalize flex-shrink-0 ${catStyle}`}>
            {task.category}
          </span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
          {task.description}
        </p>

        <div className={`flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
          isCompleted
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
        }`}>
          {isCompleted ? (
            <><Check className="w-3.5 h-3.5" /> Completed!</>
          ) : (
            <>Tap to practice <ChevronRight className="w-3.5 h-3.5" /></>
          )}
        </div>
      </div>
    </motion.div>
  );
}