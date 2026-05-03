import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Volume2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { TeacherCharacter3D } from '@/components/SpeechSpace/TeacherCharacter3D';
import { KidCharacter3D } from '@/components/SpeechSpace/KidCharacter3D';
import { LevelSelector } from '@/components/SpeechSpace/LevelSelector';
import { PracticeCard } from '@/components/SpeechSpace/PracticeCard';
import { FeedbackDisplay } from '@/components/SpeechSpace/FeedbackDisplay';
import { ProgressRewards } from '@/components/SpeechSpace/ProgressRewards';
import { FloatingElements } from '@/components/SpeechSpace/FloatingElements';
import { LevelCompleteModal } from '@/components/SpeechSpace/LevelCompleteModal';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { spaceAPI, SpeechSpaceLevel } from '@/api/space';
import { useAuth } from '@/hooks/useAuth';
import { playSuccessSound, playErrorSound } from '@/utils/sounds';


type GameState = 'menu' | 'playing' | 'feedback' | 'levelComplete';
type CharacterMood = 'happy' | 'encouraging' | 'celebrating' | 'thinking' | 'idle';

export default function SpeechSpace() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentLevelId, setCurrentLevelId] = useState<string | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [sessionStars, setSessionStars] = useState(0);
  const [totalStars, setTotalStars] = useState(() => {
    const saved = localStorage.getItem('speechSpace_totalStars');
    return saved ? parseInt(saved) : 0;
  });
  const [completedLevels, setCompletedLevels] = useState<string[]>(() => {
    const saved = localStorage.getItem('speechSpace_completedLevels');
    return saved ? JSON.parse(saved) : [];
  });
  const [streak, setStreak] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [characterMood, setCharacterMood] = useState<CharacterMood>('idle');
  const [characterMessage, setCharacterMessage] = useState<string>('');

  useEffect(() => {
    if (!isLoggedIn) navigate('/auth');
  }, [isLoggedIn, navigate]);

  // Fetch Data from Backend
  const { data: levelsData, isLoading } = useQuery({
    queryKey: ['speech-space'],
    queryFn: spaceAPI.getAll
  });

  const levels: SpeechSpaceLevel[] = levelsData?.data || [];
  const currentLevel = levels.find(l => l._id === currentLevelId);
  const currentItem = currentLevel?.items[currentItemIndex];

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('speechSpace_totalStars', totalStars.toString());
    localStorage.setItem('speechSpace_completedLevels', JSON.stringify(completedLevels));
  }, [totalStars, completedLevels]);

  // Character messages
  useEffect(() => {
    if (gameState === 'menu') {
      setCharacterMessage("Let's practice speaking! Pick a level! 🎯");
      setCharacterMood('happy');
    } else if (gameState === 'playing' && currentItem) {
      const messages = [
        `Say "${currentItem.text}" with me!`,
        `Can you say "${currentItem.text}"?`,
        `Let's try "${currentItem.text}"!`,
      ];
      setCharacterMessage(messages[Math.floor(Math.random() * messages.length)]);
      setCharacterMood('encouraging');
    }
  }, [gameState, currentItem]);

  const playAudio = useCallback(() => {
    if (!currentItem || isPlayingAudio) return;
    setIsPlayingAudio(true);
    setCharacterMood('thinking');
    const utterance = new SpeechSynthesisUtterance(currentItem.text);
    utterance.rate = 0.7;
    utterance.pitch = 1.1;
    utterance.onend = () => {
      setIsPlayingAudio(false);
      setCharacterMood('encouraging');
    };
    speechSynthesis.speak(utterance);
  }, [currentItem, isPlayingAudio]);

  const handleSelectLevel = (levelId: string) => {
    setCurrentLevelId(levelId);
    setCurrentItemIndex(0);
    setSessionStars(0);
    setStreak(0);
    setGameState('playing');
    setCharacterMessage("Great choice! Let's start! 🚀");
    setCharacterMood('happy');
  };

  const handlePracticeComplete = (score: number) => {
    setLastScore(score);
    let starsEarned = 0;
    if (score >= 9) starsEarned = 3;
    else if (score >= 7) starsEarned = 2;
    else if (score >= 5) starsEarned = 1;

    setSessionStars(prev => prev + starsEarned);
    setTotalStars(prev => prev + starsEarned);
    if (score >= 7) setStreak(prev => prev + 1); else setStreak(0);

    if (score >= 9) {
      setCharacterMood('celebrating');
      setCharacterMessage("WOW! Amazing! You're a superstar! 🌟");
      playSuccessSound();
    } else if (score >= 7) {
      setCharacterMood('happy');
      setCharacterMessage("Great job! Keep it up! 🎉");
      playSuccessSound();
    } else {
      setCharacterMood('encouraging');
      setCharacterMessage("Good try! You're getting better! 💪");
      playErrorSound();
    }

    setGameState('feedback');
  };

  const handleContinue = () => {
    if (!currentLevel) return;
    if (currentItemIndex >= currentLevel.items.length - 1) {
      if (!completedLevels.includes(currentLevelId!)) {
        setCompletedLevels(prev => [...prev, currentLevelId!]);
      }
      setGameState('levelComplete');
    } else {
      setCurrentItemIndex(prev => prev + 1);
      setGameState('playing');
      setLastScore(null);
    }
  };

  const handleNextLevel = () => {
    const currentIndex = levels.findIndex(l => l._id === currentLevelId);
    const nextLevel = levels[currentIndex + 1];
    if (nextLevel && totalStars >= nextLevel.starsRequired) {
      handleSelectLevel(nextLevel._id!);
    } else {
      setGameState('menu');
    }
  };

  const handleReplayLevel = () => {
    setCurrentItemIndex(0);
    setSessionStars(0);
    setStreak(0);
    setGameState('playing');
  };

  const handleBackToMenu = () => {
    setGameState('menu');
    setCurrentItemIndex(0);
    setSessionStars(0);
    setStreak(0);
    setLastScore(null);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-full bg-background relative">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-violet-200/20 blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] rounded-full bg-sky-200/15 blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>

        <FloatingElements />

        <header className="relative z-10 flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-xl border-b border-white/50 shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => gameState === 'menu' ? navigate('/dashboard') : handleBackToMenu()} className="bg-white/80 hover:bg-white shadow-md rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <motion.h1 className="text-xl font-extrabold text-foreground flex items-center gap-2" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <span className="text-2xl">🚀</span> Speech Space
            </motion.h1>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full shadow-sm">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="font-extrabold text-amber-700 text-sm">{totalStars} Stars</span>
          </div>
        </header>

        <main className="relative z-10 container mx-auto px-6 pt-6 pb-10">
          <AnimatePresence mode="wait">
            {gameState === 'menu' && (
              <motion.div key="menu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto">
                <div className="flex justify-center items-end gap-10 mb-6">
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Zara</p>
                    <TeacherCharacter3D isSpeaking={false} mood={characterMood} message={characterMessage} size={180} />
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">You</p>
                    <KidCharacter3D isSpeaking={false} isListening={false} mood="happy" size={160} />
                  </div>
                </div>
                <LevelSelector
                  levels={levels.map(l => ({
                    ...l,
                    id: l.levelNumber, // adapt to component's expected id type if needed
                    unlocked: totalStars >= l.starsRequired
                  }))}
                  currentLevel={currentLevel?.levelNumber || 0}
                  totalStars={totalStars}
                  completedLevels={completedLevels.map(id => levels.find(l => l._id === id)?.levelNumber || 0)}
                  onSelectLevel={(num) => {
                    const l = levels.find(lv => lv.levelNumber === num);
                    if (l) handleSelectLevel(l._id!);
                  }}
                />
              </motion.div>
            )}

            {(gameState === 'playing' || gameState === 'feedback') && currentLevel && currentItem && (
              <motion.div key="playing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <ProgressRewards currentIndex={currentItemIndex} totalItems={currentLevel.items.length} starsEarned={sessionStars} levelName={currentLevel.name} streak={streak} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-3xl p-6 flex flex-col items-center justify-center shadow-xl border border-cyan-400/20 relative overflow-hidden" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                    <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    <TeacherCharacter3D isSpeaking={isPlayingAudio} mood={characterMood} message={characterMessage} label="Zara" size={210} />
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={playAudio} disabled={isPlayingAudio} className={`mt-4 flex items-center gap-2 px-6 py-3 rounded-full font-bold border-2 transition-all ${isPlayingAudio ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 cursor-not-allowed' : 'bg-cyan-500/10 text-cyan-300 border-cyan-400/40 hover:bg-cyan-500/25 hover:border-cyan-400/80 shadow-lg'}`}>
                      <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-pulse' : ''}`} /> {isPlayingAudio ? '🔊 Speaking…' : 'Listen First! 🔊'}
                    </motion.button>
                  </motion.div>
                  <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4">
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-4 flex items-center gap-4 shadow-lg border border-purple-200/50">
                      <KidCharacter3D isSpeaking={isUserSpeaking} isListening={isPlayingAudio} mood={characterMood} label="You" size={110} />
                      <div className="flex-1">
                        <p className="font-bold text-purple-800 text-sm">Your turn to speak!</p>
                        <p className="text-xs text-purple-600 mt-1">{isUserSpeaking ? '🎤 I can hear you!' : isPlayingAudio ? '👂 Listen carefully…' : 'Tap the mic and say the word!'}</p>
                      </div>
                    </div>
                    <PracticeCard item={currentItem} onComplete={handlePracticeComplete} onPlayAudio={playAudio} isPlaying={isPlayingAudio} onRecordingChange={setIsUserSpeaking} />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <FeedbackDisplay score={lastScore} onContinue={handleContinue} isVisible={gameState === 'feedback'} />
        <LevelCompleteModal
          isOpen={gameState === 'levelComplete'}
          levelName={currentLevel?.name || ''}
          starsEarned={sessionStars}
          totalPossibleStars={(currentLevel?.items.length || 1) * 3}
          onNextLevel={handleNextLevel}
          onReplay={handleReplayLevel}
          hasNextLevel={levels.indexOf(currentLevel!) < levels.length - 1}
        />
      </div>
    </Layout>
  );
}
