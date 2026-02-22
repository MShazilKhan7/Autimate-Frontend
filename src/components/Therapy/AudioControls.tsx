import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mic, Square, Play, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioControlsProps {
  word: string;
  onRecordingComplete: () => void;
  hasRecording: boolean;
}

export default function AudioControls({ word, onRecordingComplete, hasRecording }: AudioControlsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [isPlayingChild, setIsPlayingChild] = useState(false);
  const [isPlayingRef, setIsPlayingRef] = useState(false);

  const startRecording = useCallback(() => {
    if (isRecording) return;
    setIsRecording(true);
    setRecordingProgress(0);

    const duration = 3000;
    const interval = 50;
    const steps = duration / interval;
    const progressStep = 100 / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step * progressStep, 100);
      setRecordingProgress(progress);
      if (progress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsRecording(false);
          setRecordingProgress(0);
          onRecordingComplete();
        }, 200);
      }
    }, interval);
  }, [isRecording, onRecordingComplete]);

  const playChildRecording = useCallback(() => {
    if (!hasRecording || isPlayingChild) return;
    setIsPlayingChild(true);
    // Simulate playback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.7;
      utterance.pitch = 1.3; // higher pitch to simulate child voice
      utterance.onend = () => setIsPlayingChild(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingChild(false), 1500);
    }
  }, [hasRecording, isPlayingChild, word]);

  const playReference = useCallback(() => {
    if (isPlayingRef) return;
    setIsPlayingRef(true);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.5;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'))
        || voices.find(v => v.lang.startsWith('en')) || voices[0];
      if (preferred) utterance.voice = preferred;
      utterance.onend = () => setIsPlayingRef(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingRef(false), 1500);
    }
  }, [isPlayingRef, word]);

  return (
    <div className="space-y-4">
      {/* Record Button */}
      <div className="flex flex-col items-center">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
          <Button
            onClick={startRecording}
            disabled={isRecording}
            className={`relative w-20 h-20 rounded-full transition-all duration-200 ${
              isRecording
                ? 'bg-destructive hover:bg-destructive text-destructive-foreground'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
            size="lg"
          >
            {isRecording ? <Square className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
          </Button>

          {isRecording && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-4 border-destructive"
              />
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" stroke="hsl(var(--secondary-soft))" strokeWidth="4" fill="transparent" opacity="0.3" />
                <motion.circle
                  cx="50" cy="50" r="46"
                  stroke="hsl(var(--primary))" strokeWidth="4" fill="transparent" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 46}
                  strokeDashoffset={2 * Math.PI * 46 * (1 - recordingProgress / 100)}
                  transition={{ duration: 0.1 }}
                />
              </svg>
            </>
          )}
        </motion.div>

        <p className="text-sm text-muted-foreground mt-2">
          {isRecording ? (
            <span className="text-destructive font-medium">Recording... {Math.round(recordingProgress)}%</span>
          ) : (
            'Tap to record'
          )}
        </p>
      </div>

      {/* Playback Buttons */}
      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={playChildRecording}
          disabled={!hasRecording || isPlayingChild}
          className="rounded-xl gap-2"
        >
          <Play className="w-4 h-4" />
          {isPlayingChild ? 'Playing...' : 'My Voice'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={playReference}
          disabled={isPlayingRef}
          className="rounded-xl gap-2"
        >
          <Volume2 className="w-4 h-4" />
          {isPlayingRef ? 'Playing...' : 'Correct Sound'}
        </Button>
      </div>
    </div>
  );
}
