import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Mic, MicOff, RotateCcw, ArrowRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

interface PracticeItem {
  id: string;
  text: string;
  type: 'letter' | 'word' | 'sentence';
  hint: string;
  image?: string;
}

interface PracticeCardProps {
  item: PracticeItem;
  onComplete: (score: number) => void;
  onPlayAudio: () => void;
  isPlaying: boolean;
  onRecordingChange?: (isRecording: boolean) => void;
}

export function PracticeCard({ item, onComplete, onPlayAudio, isPlaying, onRecordingChange }: PracticeCardProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingProgress(0);
    setHasRecorded(false);
    onRecordingChange?.(true);
  }, [onRecordingChange]);

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingProgress(prev => {
          if (prev >= 100) {
            setIsRecording(false);
            setHasRecorded(true);
            onRecordingChange?.(false);
            // Simulate scoring
            const simulatedScore = Math.floor(Math.random() * 4) + 7; // 7-10
            setTimeout(() => onComplete(simulatedScore), 500);
            return 100;
          }
          return prev + 3.33; // ~3 seconds
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRecording, onComplete, onRecordingChange]);

  const resetPractice = () => {
    setHasRecorded(false);
    setRecordingProgress(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-card to-secondary/20 rounded-3xl p-6 shadow-xl border-2 border-primary/20"
    >
      {/* Item display */}
      <div className="text-center mb-6">
        {item.image && (
          <motion.div
            className="mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img 
              src={item.image} 
              alt={item.text} 
              className="w-32 h-32 object-cover rounded-2xl shadow-lg mx-auto"
            />
          </motion.div>
        )}
        
        <motion.div
          className={`
            font-bold text-foreground mb-2
            ${item.type === 'letter' ? 'text-6xl' : item.type === 'word' ? 'text-4xl' : 'text-2xl'}
          `}
          animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
        >
          {item.text}
        </motion.div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="capitalize px-2 py-1 bg-primary/10 rounded-full">
            {item.type}
          </span>
        </div>
      </div>

      {/* Hint toggle */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-yellow-50 rounded-xl p-3 mb-4 border border-yellow-200"
          >
            <p className="text-sm text-yellow-800 flex items-center gap-2">
              <span className="text-xl">💡</span>
              {item.hint}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setShowHint(!showHint)}
        className="w-full text-center text-sm text-primary mb-4 hover:underline"
      >
        {showHint ? 'Hide hint' : 'Need a hint? 💡'}
      </button>

      {/* Listen button */}
      <div className="flex justify-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayAudio}
          disabled={isPlaying}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-full font-medium
            ${isPlaying 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-primary/20 text-primary hover:bg-primary/30'
            }
          `}
        >
          <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
          <span>{isPlaying ? 'Playing...' : 'Listen 🔊'}</span>
        </motion.button>
      </div>

      {/* Recording section */}
      <div className="relative">
        {/* Recording button */}
        <div className="flex justify-center mb-4">
          <motion.button
            whileHover={{ scale: isRecording ? 1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRecording ? undefined : startRecording}
            disabled={hasRecorded}
            className={`
              relative w-24 h-24 rounded-full flex items-center justify-center
              transition-all duration-300
              ${isRecording 
                ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                : hasRecorded
                  ? 'bg-green-500'
                  : 'bg-gradient-to-br from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50'
              }
            `}
          >
            {/* Recording ring */}
            {isRecording && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-red-300"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
            
            {isRecording ? (
              <MicOff className="w-10 h-10 text-white" />
            ) : (
              <Mic className={`w-10 h-10 ${hasRecorded ? 'text-white' : 'text-primary-foreground'}`} />
            )}
          </motion.button>
        </div>

        {/* Progress bar */}
        {isRecording && (
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${recordingProgress}%` }}
            />
          </div>
        )}

        {/* Instructions */}
        <p className="text-center text-sm text-muted-foreground">
          {isRecording 
            ? '🎤 Listening... Keep talking!' 
            : hasRecorded 
              ? '✅ Great job! Processing...' 
              : 'Tap the microphone and say the word!'
          }
        </p>
      </div>

      {/* Action buttons */}
      {hasRecorded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-3 mt-4"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={resetPractice}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
