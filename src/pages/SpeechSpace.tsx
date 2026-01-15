import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Settings, Star, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { SpaceCharacter } from '@/components/SpeechSpace/SpaceCharacter';
import { LevelSelector } from '@/components/SpeechSpace/LevelSelector';
import { PracticeCard } from '@/components/SpeechSpace/PracticeCard';
import { FeedbackDisplay } from '@/components/SpeechSpace/FeedbackDisplay';
import { ProgressRewards } from '@/components/SpeechSpace/ProgressRewards';
import { FloatingElements } from '@/components/SpeechSpace/FloatingElements';
import { LevelCompleteModal } from '@/components/SpeechSpace/LevelCompleteModal';
import { Button } from '@/components/ui/button';
import levelsData from '@/data/speechSpaceLevels.json';

type GameState = 'menu' | 'playing' | 'feedback' | 'levelComplete';
type CharacterMood = 'happy' | 'encouraging' | 'celebrating' | 'thinking' | 'idle';

interface PracticeItem {
  id: string;
  text: string;
  type: 'letter' | 'word' | 'sentence';
  hint: string;
  emoji?: string;
}

interface Level {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  items: PracticeItem[];
  starsRequired: number;
}

const levels = levelsData.levels as Level[];

interface LevelProgress {
  levelId: number;
  completed: boolean;
  starsEarned: number;
}

export default function SpeechSpace() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [sessionStars, setSessionStars] = useState(0);
  const [totalStars, setTotalStars] = useState(() => {
    const saved = localStorage.getItem('speechSpace_totalStars');
    return saved ? parseInt(saved) : 0;
  });
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    const saved = localStorage.getItem('speechSpace_completedLevels');
    return saved ? JSON.parse(saved) : [];
  });
  const [streak, setStreak] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [characterMood, setCharacterMood] = useState<CharacterMood>('idle');
  const [characterMessage, setCharacterMessage] = useState<string>('');

  const currentLevel = levels.find(l => l.id === currentLevelId);
  const currentItem = currentLevel?.items[currentItemIndex];

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('speechSpace_totalStars', totalStars.toString());
    localStorage.setItem('speechSpace_completedLevels', JSON.stringify(completedLevels));
  }, [totalStars, completedLevels]);

  // Character messages based on state
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
    
    // Use Web Speech API
    const utterance = new SpeechSynthesisUtterance(currentItem.text);
    utterance.rate = 0.7; // Slower for clarity
    utterance.pitch = 1.1; // Slightly higher for child-friendly
    
    utterance.onend = () => {
      setIsPlayingAudio(false);
      setCharacterMood('encouraging');
    };
    
    speechSynthesis.speak(utterance);
  }, [currentItem, isPlayingAudio]);

  const handleSelectLevel = (levelId: number) => {
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
    
    // Calculate stars (3 stars for 9-10, 2 for 7-8, 1 for 5-6, 0 for below)
    let starsEarned = 0;
    if (score >= 9) starsEarned = 3;
    else if (score >= 7) starsEarned = 2;
    else if (score >= 5) starsEarned = 1;

    setSessionStars(prev => prev + starsEarned);
    setTotalStars(prev => prev + starsEarned);

    // Update streak
    if (score >= 7) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    // Set character mood based on score
    if (score >= 9) {
      setCharacterMood('celebrating');
      setCharacterMessage("WOW! Amazing! You're a superstar! 🌟");
    } else if (score >= 7) {
      setCharacterMood('happy');
      setCharacterMessage("Great job! Keep it up! 🎉");
    } else if (score >= 5) {
      setCharacterMood('encouraging');
      setCharacterMessage("Good try! You're getting better! 💪");
    } else {
      setCharacterMood('encouraging');
      setCharacterMessage("Keep practicing! You can do it! 🌱");
    }

    setGameState('feedback');
  };

  const handleContinue = () => {
    if (!currentLevel) return;

    if (currentItemIndex >= currentLevel.items.length - 1) {
      // Level complete
      if (!completedLevels.includes(currentLevelId)) {
        setCompletedLevels(prev => [...prev, currentLevelId]);
      }
      setGameState('levelComplete');
    } else {
      setCurrentItemIndex(prev => prev + 1);
      setGameState('playing');
      setLastScore(null);
    }
  };

  const handleNextLevel = () => {
    const nextLevel = levels.find(l => l.id === currentLevelId + 1);
    if (nextLevel && totalStars >= nextLevel.starsRequired) {
      setCurrentLevelId(currentLevelId + 1);
      setCurrentItemIndex(0);
      setSessionStars(0);
      setStreak(0);
      setGameState('playing');
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 relative overflow-hidden">
        <FloatingElements />

        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-10 p-4 flex items-center justify-between"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => gameState === 'menu' ? navigate('/dashboard') : handleBackToMenu()}
            className="bg-white/80 hover:bg-white shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <motion.h1 
            className="text-2xl font-bold text-primary flex items-center gap-2"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-3xl">🚀</span>
            Speech Space
          </motion.h1>

          <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1.5 rounded-full shadow-md">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-yellow-700">{totalStars}</span>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="relative z-10 container mx-auto px-4 pb-8">
          <AnimatePresence mode="wait">
            {/* Menu State */}
            {gameState === 'menu' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                {/* Character */}
                <div className="flex justify-center mb-6">
                  <SpaceCharacter
                    isSpeaking={false}
                    isListening={false}
                    mood={characterMood}
                    message={characterMessage}
                  />
                </div>

                {/* Level Selection */}
                <LevelSelector
                  levels={levels}
                  currentLevel={currentLevelId}
                  totalStars={totalStars}
                  completedLevels={completedLevels}
                  onSelectLevel={handleSelectLevel}
                />
              </motion.div>
            )}

            {/* Playing State */}
            {(gameState === 'playing' || gameState === 'feedback') && currentLevel && currentItem && (
              <motion.div
                key="playing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                {/* Progress */}
                <div className="mb-6">
                  <ProgressRewards
                    currentIndex={currentItemIndex}
                    totalItems={currentLevel.items.length}
                    starsEarned={sessionStars}
                    levelName={currentLevel.name}
                    streak={streak}
                  />
                </div>

                {/* Two-panel layout */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left: Character */}
                  <motion.div 
                    className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 flex flex-col items-center justify-center shadow-xl border border-white/50"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <SpaceCharacter
                      isSpeaking={isPlayingAudio}
                      isListening={false}
                      mood={characterMood}
                      message={characterMessage}
                    />

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={playAudio}
                      disabled={isPlayingAudio}
                      className={`
                        mt-4 flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white
                        ${isPlayingAudio 
                          ? 'bg-primary/70' 
                          : 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl'
                        }
                      `}
                    >
                      <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                      {isPlayingAudio ? 'Speaking...' : 'Listen First! 🔊'}
                    </motion.button>
                  </motion.div>

                  {/* Right: Practice Card */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <PracticeCard
                      item={currentItem}
                      onComplete={handlePracticeComplete}
                      onPlayAudio={playAudio}
                      isPlaying={isPlayingAudio}
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Feedback Modal */}
        <FeedbackDisplay
          score={lastScore}
          onContinue={handleContinue}
          isVisible={gameState === 'feedback'}
        />

        {/* Level Complete Modal */}
        <LevelCompleteModal
          isOpen={gameState === 'levelComplete'}
          levelName={currentLevel?.name || ''}
          starsEarned={sessionStars}
          totalPossibleStars={(currentLevel?.items.length || 1) * 3}
          onNextLevel={handleNextLevel}
          onReplay={handleReplayLevel}
          hasNextLevel={
            !!levels.find(l => l.id === currentLevelId + 1) &&
            totalStars >= (levels.find(l => l.id === currentLevelId + 1)?.starsRequired || Infinity)
          }
        />
      </div>
    </Layout>
  );
}
