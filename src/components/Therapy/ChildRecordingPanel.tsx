import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChildRecordingPanelProps {
  word: string;
  category: string;
  onRecordingComplete: (score: number) => void;
  disabled?: boolean;
}

type RecordingState = 'idle' | 'recording' | 'complete';

export default function ChildRecordingPanel({
  word,
  category,
  onRecordingComplete,
  disabled = false,
}: ChildRecordingPanelProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [progress, setProgress] = useState(0);

  const startRecording = async () => {
    if (disabled || recordingState !== 'idle') return;
    
    setRecordingState('recording');
    setProgress(0);

    // Simulate recording progress
    const duration = 3000;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(progressInterval);
        completeRecording();
      }
    }, interval);
  };

  const completeRecording = () => {
    setRecordingState('complete');
    
    // Simulate score calculation
    setTimeout(() => {
      const score = Math.floor(Math.random() * 4) + 7; // 7-10
      onRecordingComplete(score);
    }, 1000);
  };

  const resetRecording = () => {
    setRecordingState('idle');
    setProgress(0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      {/* Category Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <span className="px-4 py-1.5 bg-accent-soft text-foreground rounded-full text-sm font-medium capitalize">
          {category}
        </span>
      </motion.div>

      {/* Target Word */}
      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold text-primary mb-8 text-center"
      >
        {word}
      </motion.h2>

      {/* Recording Button Area */}
      <div className="relative mb-8">
        {/* Pulsing rings when recording */}
        <AnimatePresence>
          {recordingState === 'recording' && (
            <>
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute inset-0 rounded-full border-4 border-primary"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.5 + ring * 0.3, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: ring * 0.3,
                  }}
                  style={{
                    width: '120px',
                    height: '120px',
                    left: '50%',
                    top: '50%',
                    marginLeft: '-60px',
                    marginTop: '-60px',
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Progress ring */}
        <svg className="absolute inset-0 w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="hsl(var(--secondary-soft))"
            strokeWidth="8"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={339.292}
            animate={{ strokeDashoffset: 339.292 - (339.292 * progress) / 100 }}
            transition={{ duration: 0.05 }}
          />
        </svg>

        {/* Main button */}
        <motion.button
          onClick={recordingState === 'idle' ? startRecording : undefined}
          disabled={disabled}
          className={`
            relative w-32 h-32 rounded-full flex items-center justify-center
            transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/30
            ${disabled 
              ? 'bg-muted cursor-not-allowed' 
              : recordingState === 'recording'
                ? 'bg-destructive'
                : recordingState === 'complete'
                  ? 'bg-therapy-success'
                  : 'bg-primary hover:bg-primary/90'
            }
          `}
          whileHover={!disabled && recordingState === 'idle' ? { scale: 1.05 } : {}}
          whileTap={!disabled && recordingState === 'idle' ? { scale: 0.95 } : {}}
          aria-label={
            recordingState === 'recording' 
              ? 'Recording in progress' 
              : recordingState === 'complete'
                ? 'Recording complete'
                : 'Tap to record'
          }
        >
          <AnimatePresence mode="wait">
            {recordingState === 'idle' && (
              <motion.div
                key="mic"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Mic className="w-12 h-12 text-primary-foreground" />
              </motion.div>
            )}
            {recordingState === 'recording' && (
              <motion.div
                key="recording"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <Square className="w-10 h-10 text-white fill-white" />
                <span className="text-white text-xs mt-1 font-medium">
                  {Math.round(progress)}%
                </span>
              </motion.div>
            )}
            {recordingState === 'complete' && (
              <motion.div
                key="complete"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <CheckCircle className="w-12 h-12 text-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Status Text */}
      <motion.p
        key={recordingState}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-muted-foreground text-lg mb-6"
      >
        {recordingState === 'idle' && (
          <>
            Tap the <span className="text-primary font-medium">microphone</span> to record
          </>
        )}
        {recordingState === 'recording' && (
          <span className="text-primary font-medium">Listening... Say "{word}"</span>
        )}
        {recordingState === 'complete' && (
          <span className="text-primary font-medium">Great job! 🎉</span>
        )}
      </motion.p>

      {/* Retry Button */}
      <AnimatePresence>
        {recordingState === 'complete' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Button
              variant="outline"
              onClick={resetRecording}
              className="gap-2 rounded-xl px-6 py-3"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Encouraging message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-muted-foreground">
          Take your time and speak clearly 💚
        </p>
      </motion.div>
    </div>
  );
}
