import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecordingButtonProps {
  onRecordingComplete: (score: number) => void;
  disabled?: boolean;
}

export default function RecordingButton({ onRecordingComplete, disabled }: RecordingButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

  const startRecording = async () => {
    if (isRecording || disabled) return;

    setIsRecording(true);
    setRecordingProgress(0);

    // Simulate recording progress
    const duration = 3000; // 3 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const progressStep = 100 / steps;

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      currentStep++;
      const progress = Math.min(currentStep * progressStep, 100);
      setRecordingProgress(progress);

      if (progress >= 100) {
        clearInterval(progressInterval);
        
        // Complete recording and generate random score
        setTimeout(() => {
          const score = Math.floor(Math.random() * 4) + 7; // Score between 7-10
          setIsRecording(false);
          setRecordingProgress(0);
          onRecordingComplete(score);
        }, 200);
      }
    }, interval);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        className="relative"
      >
        <Button
          onClick={startRecording}
          disabled={disabled || isRecording}
          className={`relative w-24 h-24 rounded-full transition-all duration-200 ${
            isRecording
              ? 'bg-destructive hover:bg-destructive text-destructive-foreground'
              : 'bg-primary-soft hover:bg-primary text-foreground hover:text-primary-foreground'
          }`}
          size="lg"
        >
          {isRecording ? (
            <Square className="h-8 w-8" />
          ) : (
            <Mic className="h-8 w-8" />
          )}
        </Button>

        {/* Recording animation ring */}
        {isRecording && (
          <motion.div
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.3, 0.7]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute inset-0 rounded-full border-4 border-destructive"
          />
        )}

        {/* Progress ring */}
        {isRecording && (
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              stroke="hsl(var(--primary-soft))"
              strokeWidth="4"
              fill="transparent"
              opacity="0.3"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="48"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 48}`}
              strokeDashoffset={`${2 * Math.PI * 48 * (1 - recordingProgress / 100)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - recordingProgress / 100) }}
              transition={{ duration: 0.1, ease: 'linear' }}
            />
          </svg>
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm text-muted-foreground text-center max-w-xs"
      >
        {isRecording ? (
          <span className="text-destructive font-medium">
            Recording... {Math.round(recordingProgress)}%
          </span>
        ) : disabled ? (
          'Recording disabled'
        ) : (
          'Tap to record your pronunciation'
        )}
      </motion.p>
    </div>
  );
}