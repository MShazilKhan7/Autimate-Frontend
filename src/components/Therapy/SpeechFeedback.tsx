import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Volume2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PhonemeScore {
  sound: string;
  score: number;
  icon: string;
}

interface WordScore {
  word: string;
  score: number;
  phonemes: PhonemeScore[];
  tip?: string;
}

interface SpeechFeedbackProps {
  targetPhrase: string;
  overallScore: number;
  wordScores: WordScore[];
  onNext: () => void;
  onTryAgain: () => void;
  onPlayRecording: () => void;
  progressStars: number;
  maxStars: number;
}

export default function SpeechFeedback({
  targetPhrase,
  overallScore,
  wordScores,
  onNext,
  onTryAgain,
  onPlayRecording,
  progressStars,
  maxStars,
}: SpeechFeedbackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    // Show tips after a brief delay for dramatic effect
    const timer = setTimeout(() => setShowTips(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayRecording = () => {
    setIsPlaying(true);
    onPlayRecording();
    // Simulate playback duration
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-therapy-success text-white';
    if (score >= 60) return 'bg-therapy-warning text-therapy-warning-foreground';
    return 'bg-therapy-error text-white';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { emoji: '🌟', text: 'Amazing!' };
    if (score >= 80) return { emoji: '🎉', text: 'Great!' };
    if (score >= 70) return { emoji: '👏', text: 'Good!' };
    if (score >= 60) return { emoji: '💪', text: 'Keep trying!' };
    return { emoji: '🌱', text: 'Growing!' };
  };

  const badge = getScoreBadge(overallScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-6 space-y-6"
    >
      {/* Header with target phrase */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h2 className="text-sm text-muted-foreground mb-2">You were asked to say:</h2>
        <div className="text-3xl font-bold text-primary mb-4 leading-relaxed">
          "{targetPhrase}"
        </div>
      </motion.div>

      {/* Animated waveform and play button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="therapy-card p-6 text-center">
          {/* Cute waveform character */}
          <div className="relative mb-6">
            <motion.div
              animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: isPlaying ? Infinity : 0, duration: 0.5 }}
              className="text-8xl mb-4"
            >
              🎤
            </motion.div>
            
            {/* Animated waveform bars */}
            <div className="flex justify-center items-end space-x-1 mb-4">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-primary rounded-full"
                  style={{ width: '4px' }}
                  animate={isPlaying ? {
                    height: [8, 20 + Math.random() * 20, 8],
                  } : { height: 8 }}
                  transition={{
                    repeat: isPlaying ? Infinity : 0,
                    duration: 0.5,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>

            <Button
              onClick={handlePlayRecording}
              disabled={isPlaying}
              size="lg"
              className="rounded-full w-16 h-16 bg-primary-soft hover:bg-primary text-primary hover:text-primary-foreground"
            >
              {isPlaying ? (
                <Volume2 className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Overall score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="therapy-card p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring", bounce: 0.6 }}
            className="text-6xl mb-4"
          >
            {badge.emoji}
          </motion.div>
          
          <h3 className="text-2xl font-bold text-primary mb-2">{badge.text}</h3>
          <div className="text-4xl font-bold text-therapy-success mb-4">
            {overallScore}%
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={overallScore} 
              className="h-3 rounded-full"
            />
            <div className="flex justify-center space-x-1">
              {[...Array(maxStars)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: i < progressStars ? 1 : 0.3,
                    scale: 1 
                  }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <Star 
                    className={`h-6 w-6 ${
                      i < progressStars 
                        ? 'fill-therapy-warning text-therapy-warning' 
                        : 'text-muted-foreground'
                    }`}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Word breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-center text-muted-foreground">
          Let's see how you did with each word:
        </h3>
        
        <div className="grid gap-4">
          {wordScores.map((wordScore, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.2 }}
            >
              <Card className="therapy-card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`px-4 py-2 rounded-full font-bold text-lg ${getScoreColor(wordScore.score)}`}>
                      {wordScore.word}
                    </div>
                    <div className="text-2xl font-bold text-muted-foreground">
                      {wordScore.score}%
                    </div>
                  </div>
                </div>

                {/* Phonemes */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {wordScore.phonemes.map((phoneme, pIndex) => (
                    <motion.div
                      key={pIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.4 + index * 0.2 + pIndex * 0.1 }}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                        phoneme.score >= 80 ? 'bg-therapy-success/20 text-therapy-success' :
                        phoneme.score >= 60 ? 'bg-therapy-warning/20 text-therapy-warning-foreground' :
                        'bg-therapy-error/20 text-therapy-error'
                      }`}
                    >
                      <span>{phoneme.icon}</span>
                      <span>{phoneme.sound}</span>
                      <span className="text-xs">({phoneme.score}%)</span>
                    </motion.div>
                  ))}
                </div>

                {/* Tip bubble */}
                <AnimatePresence>
                  {showTips && wordScore.tip && wordScore.score < 80 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="bg-accent p-3 rounded-lg border-l-4 border-primary"
                    >
                      <div className="flex items-start space-x-2">
                        <span className="text-lg">💡</span>
                        <p className="text-sm text-accent-foreground font-medium">
                          {wordScore.tip}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="flex space-x-4"
      >
        <Button
          onClick={onTryAgain}
          variant="outline"
          size="lg"
          className="flex-1 py-6 rounded-xl text-lg font-medium"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Try Again
        </Button>
        
        <Button
          onClick={onNext}
          size="lg"
          className="flex-1 py-6 rounded-xl text-lg font-medium bg-primary-soft hover:bg-primary text-foreground hover:text-primary-foreground"
        >
          Next Word 
          <Star className="h-5 w-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
}