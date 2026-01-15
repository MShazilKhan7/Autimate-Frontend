import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import SpeakingCharacter from './SpeakingCharacter';
import ChildRecordingPanel from './ChildRecordingPanel';

interface SpeechQuestion {
  id: number;
  word: string;
  image: string;
  category: string;
  difficulty: number;
}

interface SpeechTherapyPanelProps {
  question: SpeechQuestion;
  onScore: (score: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function SpeechTherapyPanel({
  question,
  onScore,
  questionNumber,
  totalQuestions,
}: SpeechTherapyPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const progressPercentage = (questionNumber / totalQuestions) * 100;

  const handlePlay = useCallback(() => {
    if (isPlaying) return;
    setIsPlaying(true);
    setHasPlayed(true);
    
    // Use Web Speech API for pronunciation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(question.word);
      utterance.rate = 0.6; // Slow for therapy
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      // Try to find a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.lang.startsWith('en') && v.name.includes('Female')
      ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  }, [isPlaying, question.word]);

  const handlePlayComplete = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleRecordingComplete = useCallback((score: number) => {
    onScore(score);
  }, [onScore]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-5xl mx-auto"
    >
      {/* Progress Bar */}
      <div className="mb-6 px-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <img src={question.image} alt={question.word} className="w-8 h-8 object-cover rounded-lg" />
            <span className="text-sm font-medium text-muted-foreground">
              Word {questionNumber} of {totalQuestions}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[...Array(totalQuestions)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < questionNumber 
                    ? 'bg-primary' 
                    : 'bg-secondary-soft'
                }`}
                initial={i === questionNumber - 1 ? { scale: 0 } : false}
                animate={i === questionNumber - 1 ? { scale: 1 } : {}}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            ))}
          </div>
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

      {/* Two Panel Layout */}
      <Card className="therapy-card p-4 md:p-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 min-h-[500px]">
          {/* Left Panel - Speaking Character */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-secondary-soft/50 to-accent-soft/30 rounded-2xl p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Watch & Learn
              </h3>
              <Button
                size="sm"
                onClick={handlePlay}
                disabled={isPlaying}
                className="gap-2 rounded-xl bg-primary hover:bg-primary/90"
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    Playing...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    Play Sound
                  </>
                )}
              </Button>
            </div>

            {/* Big Image Display */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="flex flex-col items-center justify-center mb-4"
            >
              <img 
                src={question.image} 
                alt={question.word} 
                className="w-40 h-40 object-cover rounded-3xl shadow-xl"
              />
              <p className="text-sm text-muted-foreground capitalize mt-2">
                {question.category}
              </p>
            </motion.div>
            
            <div className="flex-1 flex items-center justify-center">
              <SpeakingCharacter
                word={question.word}
                isPlaying={isPlaying}
                onPlayComplete={handlePlayComplete}
              />
            </div>
          </motion.div>

          {/* Right Panel - Child Recording */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-primary-soft/30 to-therapy-success/20 rounded-2xl p-6"
          >
            <div className="mb-6 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Your Turn!
              </h3>
              {/* Big Image for Child Panel */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                className="mb-2"
              >
                <img 
                  src={question.image} 
                  alt={question.word} 
                  className="w-32 h-32 object-cover rounded-2xl shadow-lg mx-auto"
                />
              </motion.div>
              <h2 className="text-3xl font-bold text-primary mb-1">
                {question.word}
              </h2>
              <p className="text-sm text-muted-foreground capitalize">
                {question.category}
              </p>
            </div>

            <ChildRecordingPanel
              word={question.word}
              category={question.category}
              onRecordingComplete={handleRecordingComplete}
              disabled={!hasPlayed}
            />
            
            {!hasPlayed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-muted-foreground mt-4"
              >
                👈 First, tap "Play Sound" to hear the word
              </motion.p>
            )}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
