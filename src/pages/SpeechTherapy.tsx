import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Home, Mic, Sparkles } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import WordDisplay from '@/components/Therapy/WordDisplay';
import AudioControls from '@/components/Therapy/AudioControls';
import PhonemeBreakdown from '@/components/Therapy/PhonemeBreakdown';
import { Button } from '@/components/ui/button';
import { therapyWords } from '@/data/speechTherapyWords';
import type { SpeechAPIResponse } from '@/data/speechTherapyWords';

export default function SpeechTherapy() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordings, setRecordings] = useState<Record<number, SpeechAPIResponse>>({});
  const word = therapyWords[currentIndex];                  
  const navigate = useNavigate();
  const [speechPronunciationScore, setSpeechPronunciationScore] = useState<SpeechAPIResponse>(word.mockResponse);

  const currentRecording = recordings[word.id];
  const hasRecording = !!currentRecording;
  const progressPct = ((currentIndex + 1) / therapyWords.length) * 100;
  const completedCount = Object.keys(recordings).length;

  const handleRecordingComplete = useCallback(() => {
    setRecordings(prev => ({ ...prev, [word.id]: word.mockResponse }));
  }, [word]);

  const goNext = useCallback(() => {
    if (currentIndex < therapyWords.length - 1) setCurrentIndex(p => p + 1);
  }, [currentIndex]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex(p => p - 1);
  }, [currentIndex]);

  const resetCurrent = useCallback(() => {
    setRecordings(prev => { const n = { ...prev }; delete n[word.id]; return n; });
    setSpeechPronunciationScore(null);
  }, [word.id]);

  return (
    <Layout>
      <div className="min-h-full bg-background">
        {/* Background blobs */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[35rem] h-[35rem] rounded-full bg-primary/5 blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[25rem] h-[25rem] rounded-full bg-sky-200/20 blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="relative z-10 p-6 md:p-8 max-w-5xl mx-auto">

          {/* ── Top Header Row ── */}
          <div className="flex items-center justify-between mb-7">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="gap-2 rounded-xl hover:bg-muted/30 font-semibold"
            >
              <Home className="w-4 h-4" /> Dashboard
            </Button>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Mic className="w-3.5 h-3.5" /> Speech Therapy
              </div>
              <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow rounded-full px-4 py-1.5 text-sm font-bold text-foreground">
                {currentIndex + 1} <span className="text-muted-foreground font-normal">/ {therapyWords.length}</span>
              </div>
            </div>
          </div>

          {/* ── Progress Bar ── */}
          <div className="mb-7">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>{completedCount} of {therapyWords.length} words practiced</span>
              <span className="font-bold text-primary">{Math.round(progressPct)}%</span>
            </div>
            <div className="w-full h-2.5 bg-muted/20 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-soft"
              />
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-1.5 mt-3">
              {therapyWords.map((w, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`transition-all duration-200 rounded-full ${
                    i === currentIndex
                      ? 'w-5 h-2.5 bg-primary'
                      : recordings[therapyWords[i].id]
                      ? 'w-2.5 h-2.5 bg-emerald-400'
                      : 'w-2.5 h-2.5 bg-muted/40 hover:bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── Main Card ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={word.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl shadow-black/5 rounded-3xl p-8 md:p-10"
            >
              <div className="grid md:grid-cols-2 gap-10 items-start">
                {/* Left: Word visual */}
                <div className="flex flex-col items-center">
                  <WordDisplay
                    word={word.word}
                    image={word.image}
                    category={word.category}
                    phonemes={word.phonemes}
                    score={speechPronunciationScore?.text_score?.word_score_list?.[0]?.quality_score}
                    isCorrect={speechPronunciationScore?.text_score?.word_score_list?.[0]?.quality_class}
                  />
                </div>

                {/* Right: Recording + feedback */}
                <div className="space-y-6">
                  <AudioControls
                    word={word.word}
                    onRecordingComplete={handleRecordingComplete}
                    hasRecording={hasRecording}
                    setSpeechPronunciationScore={setSpeechPronunciationScore}
                  />

                  {speechPronunciationScore?.text_score.word_score_list?.[0]?.phone_score_list && (
                    <PhonemeBreakdown
                      phonemes={speechPronunciationScore.text_score.word_score_list[0].phone_score_list}
                      wordScore={speechPronunciationScore.text_score.word_score_list[0].quality_score}
                      isCorrect={speechPronunciationScore.text_score.word_score_list[0].quality_class}
                    />
                  )}

                  {hasRecording && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetCurrent}
                        className="gap-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      >
                        <RotateCcw className="w-4 h-4" /> Try Again
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Navigation ── */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="rounded-2xl gap-2 border-2 border-muted/40 hover:bg-muted/20 font-semibold px-6 py-5 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>

            {currentIndex === therapyWords.length - 1 && hasRecording ? (
              <motion.div whileHover={{ scale: 1.04 }}>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="rounded-2xl gap-2 px-8 py-5 bg-gradient-to-r from-primary to-primary-soft text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all"
                >
                  <Sparkles className="w-4 h-4" /> Finish Session
                </Button>
              </motion.div>
            ) : (
              <Button
                onClick={goNext}
                disabled={currentIndex === therapyWords.length - 1}
                className="rounded-2xl gap-2 px-8 py-5 bg-gradient-to-r from-primary to-primary-soft text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all disabled:opacity-30"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
