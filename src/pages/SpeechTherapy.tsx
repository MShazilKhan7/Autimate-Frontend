import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Home } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import WordDisplay from '@/components/Therapy/WordDisplay';
import AudioControls from '@/components/Therapy/AudioControls';
import PhonemeBreakdown from '@/components/Therapy/PhonemeBreakdown';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { therapyWords } from '@/data/speechTherapyWords';
import type { SpeechAPIResponse } from '@/data/speechTherapyWords';

export default function SpeechTherapy() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordings, setRecordings] = useState<Record<number, SpeechAPIResponse>>({});
  const [speechPronunciationScore, setSpeechPronunciationScore] = useState<SpeechAPIResponse>(null);
  const navigate = useNavigate();

  const word = therapyWords[currentIndex];
  const currentRecording = recordings[word.id];
  const hasRecording = !!currentRecording;

  const handleRecordingComplete = useCallback(() => {
    // Simulate API response with mock data
    setRecordings(prev => ({
      ...prev,
      [word.id]: word.mockResponse,
    }));
  }, [word]);

  const goNext = useCallback(() => {
    if (currentIndex < therapyWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const resetCurrent = useCallback(() => {
    setRecordings(prev => {
      const next = { ...prev };
      delete next[word.id];
      return next;
    });
  }, [word.id]);

  const wordScore = currentRecording?.text_score;
  // const phonemeList = wordScore?.word_score_list?.[0]?.phone_score_list;

  return (
    <Layout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="gap-1 rounded-xl">
            <Home className="w-4 h-4" /> Dashboard
          </Button>
          <h1 className="text-therapy-xl text-primary">Speech Therapy</h1>
          <span className="text-sm text-muted-foreground font-medium">
            {currentIndex + 1} / {therapyWords.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-secondary/40 rounded-full h-2.5 mb-6">
          <motion.div
            className="h-2.5 rounded-full therapy-progress"
            animate={{ width: `${((currentIndex + 1) / therapyWords.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={word.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="therapy-card p-6 sm:p-8 space-y-8">
              {/* Word + Image */}
              <WordDisplay
                word={word.word}
                image={word.image}
                category={word.category}
                phonemes={word.phonemes}
                score={speechPronunciationScore?.text_score?.word_score_list?.[0]?.quality_score}
                isCorrect={speechPronunciationScore?.text_score?.word_score_list?.[0]?.quality_class}
              />

              {/* Audio Controls */}
              <AudioControls
                word={word.word}
                onRecordingComplete={handleRecordingComplete}
                hasRecording={hasRecording}
                setSpeechPronunciationScore={setSpeechPronunciationScore}
              />

              {/* Phoneme Breakdown (after recording) */}
              {speechPronunciationScore?.text_score.word_score_list?.[0]?.phone_score_list && (
                <PhonemeBreakdown
                  phonemes={speechPronunciationScore?.text_score.word_score_list[0].phone_score_list}
                  wordScore={speechPronunciationScore?.text_score.word_score_list[0].quality_score}
                  isCorrect={speechPronunciationScore?.text_score.word_score_list[0].quality_class}
                />
              )}

              {/* Reset button */}
              {hasRecording && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <Button variant="ghost" size="sm" onClick={resetCurrent} className="gap-2 rounded-xl text-muted-foreground">
                    <RotateCcw className="w-4 h-4" /> Try Again
                  </Button>
                </motion.div>
              )}
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="rounded-xl gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>

              <div className="flex gap-1.5">
                {therapyWords.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === currentIndex ? 'bg-primary scale-125' : recordings[therapyWords[i].id] ? 'bg-primary-soft' : 'bg-secondary/60'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                onClick={goNext}
                disabled={currentIndex === therapyWords.length - 1}
                className="rounded-xl gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  );
}
