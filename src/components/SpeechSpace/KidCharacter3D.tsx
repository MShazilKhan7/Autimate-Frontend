import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface KidCharacter3DProps {
  isSpeaking: boolean;   // user is speaking into mic
  isListening: boolean;  // user is listening to AI
  mood?: 'happy' | 'encouraging' | 'celebrating' | 'thinking' | 'idle';
  label?: string;
  size?: number;
}

/**
 * 3D kid character for the *customer/user* side.
 * Lip-sync is driven by `isSpeaking` flag; when true the mouth
 * animates rapidly to simulate talking.
 */
export function KidCharacter3D({
  isSpeaking,
  isListening,
  mood = 'happy',
  label = 'You',
  size = 220,
}: KidCharacter3DProps) {
  const [blinkState, setBlinkState] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0); // 0-1

  /* ── blink loop ──────────────────────────────────────────── */
  useEffect(() => {
    const id = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 120);
    }, 2800 + Math.random() * 1200);
    return () => clearInterval(id);
  }, []);

  /* ── lip-sync loop ───────────────────────────────────────── */
  useEffect(() => {
    if (!isSpeaking) { setMouthOpen(0); return; }
    const id = setInterval(() => {
      setMouthOpen(Math.random());
    }, 120);
    return () => clearInterval(id);
  }, [isSpeaking]);

  const halfW = size / 2;
  const scale  = size / 220;

  /* derived colours from mood */
  const skinLight = '#FFD9A0';
  const skinDark  = '#FFC170';
  const hairColor = mood === 'celebrating' ? '#FF6B6B' : '#4A3728';
  const shirtTop  = '#6C63FF';
  const shirtBot  = '#4C44CC';

  /* mouth path */
  const getMouth = () => {
    const open = isSpeaking ? mouthOpen * 18 : mood === 'celebrating' ? 12 : mood === 'encouraging' ? 6 : 4;
    const cy   = 145 * scale;
    const rx   = 22 * scale;
    const ry   = Math.max(2, open) * scale;

    if (blinkState) return null; // skip mouth during blink
    return (
      <g>
        {/* mouth outline */}
        <ellipse cx={halfW} cy={cy} rx={rx} ry={ry}
          fill={isSpeaking || mood === 'celebrating' ? '#CC3333' : '#CC6655'} />
        {/* teeth */}
        {(isSpeaking || mood === 'celebrating') && ry > 3 && (
          <ellipse cx={halfW} cy={cy - ry * 0.4} rx={rx * 0.7} ry={ry * 0.4}
            fill="white" opacity={0.9} />
        )}
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center select-none" style={{ width: size }}>
      {/* ── 3-D container: perspective gives depth illusion ── */}
      <motion.div
        style={{ perspective: 600, perspectiveOrigin: '50% 60%' }}
        animate={
          mood === 'celebrating'
            ? { y: [0, -14, 0], rotate: [0, 6, -6, 0] }
            : isSpeaking
            ? { scale: [1, 1.01, 1] }
            : { y: [0, -4, 0] }
        }
        transition={{
          duration: mood === 'celebrating' ? 0.45 : 2.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            {/* skin gradient – gives 3-D sphere illusion */}
            <radialGradient id="kidSkin" cx="38%" cy="28%" r="65%">
              <stop offset="0%" stopColor="#FFF0D0" />
              <stop offset="55%" stopColor={skinLight} />
              <stop offset="100%" stopColor={skinDark} />
            </radialGradient>
            {/* shirt */}
            <linearGradient id="kidShirt" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={shirtTop} />
              <stop offset="100%" stopColor={shirtBot} />
            </linearGradient>
            {/* shadow on bottom of head */}
            <radialGradient id="kidShadow" cx="50%" cy="100%" r="50%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.18)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            {/* cheek blush */}
            <radialGradient id="kidBlush" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0" />
            </radialGradient>
            <filter id="dropShadow3d">
              <feDropShadow dx="4" dy="6" stdDeviation="5" floodColor="rgba(0,0,0,0.25)" />
            </filter>
          </defs>

          {/* ── Body / torso ── */}
          <ellipse cx={halfW} cy={size * 0.87} rx={52 * scale} ry={28 * scale}
            fill={`url(#kidShirt)`} />
          {/* shirt collar detail */}
          <ellipse cx={halfW} cy={size * 0.78} rx={28 * scale} ry={14 * scale}
            fill="url(#kidShirt)" />

          {/* ── Neck ── */}
          <rect x={(halfW - 14 * scale)} y={size * 0.66} width={28 * scale} height={20 * scale}
            rx={6 * scale} fill={skinDark} />

          {/* ── Head (main sphere) ── */}
          <circle cx={halfW} cy={size * 0.46} r={72 * scale}
            fill="url(#kidSkin)" filter="url(#dropShadow3d)" />
          {/* bottom shadow for depth */}
          <ellipse cx={halfW} cy={size * 0.58} rx={55 * scale} ry={18 * scale}
            fill="url(#kidShadow)" />

          {/* ── Hair ── */}
          {/* main hair blob */}
          <ellipse cx={halfW} cy={size * 0.28} rx={68 * scale} ry={42 * scale}
            fill={hairColor} />
          {/* side hair left */}
          <ellipse cx={halfW - 58 * scale} cy={size * 0.42} rx={18 * scale} ry={28 * scale}
            fill={hairColor} />
          {/* side hair right */}
          <ellipse cx={halfW + 58 * scale} cy={size * 0.42} rx={18 * scale} ry={28 * scale}
            fill={hairColor} />
          {/* forehead visible */}
          <ellipse cx={halfW} cy={size * 0.34} rx={52 * scale} ry={22 * scale}
            fill="url(#kidSkin)" />

          {/* ── Ears ── */}
          <ellipse cx={halfW - 68 * scale} cy={size * 0.47} rx={10 * scale} ry={14 * scale}
            fill={skinLight} />
          <ellipse cx={halfW + 68 * scale} cy={size * 0.47} rx={10 * scale} ry={14 * scale}
            fill={skinLight} />

          {/* ── Cheeks ── */}
          <ellipse cx={halfW - 42 * scale} cy={size * 0.54} rx={18 * scale} ry={12 * scale}
            fill="url(#kidBlush)" />
          <ellipse cx={halfW + 42 * scale} cy={size * 0.54} rx={18 * scale} ry={12 * scale}
            fill="url(#kidBlush)" />

          {/* ── Eyes ── */}
          {blinkState ? (
            <>
              <path d={`M ${halfW - 28 * scale} ${size * 0.42} L ${halfW - 8 * scale} ${size * 0.42}`}
                stroke="#3D2B1F" strokeWidth={3 * scale} strokeLinecap="round" />
              <path d={`M ${halfW + 8 * scale} ${size * 0.42} L ${halfW + 28 * scale} ${size * 0.42}`}
                stroke="#3D2B1F" strokeWidth={3 * scale} strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Left eye */}
              <circle cx={halfW - 22 * scale} cy={size * 0.43} r={14 * scale} fill="white" />
              <circle cx={halfW - 22 * scale} cy={size * 0.43} r={8 * scale} fill="#3D2B1F" />
              <circle cx={halfW - 22 * scale} cy={size * 0.43} r={4 * scale} fill="#1a1208" />
              <circle cx={(halfW - 22 * scale) - 4 * scale} cy={(size * 0.43) - 4 * scale} r={2 * scale} fill="white" />
              {/* Right eye */}
              <circle cx={halfW + 22 * scale} cy={size * 0.43} r={14 * scale} fill="white" />
              <circle cx={halfW + 22 * scale} cy={size * 0.43} r={8 * scale} fill="#3D2B1F" />
              <circle cx={halfW + 22 * scale} cy={size * 0.43} r={4 * scale} fill="#1a1208" />
              <circle cx={(halfW + 22 * scale) - 4 * scale} cy={(size * 0.43) - 4 * scale} r={2 * scale} fill="white" />
            </>
          )}

          {/* ── Eyebrows ── */}
          <path
            d={`M ${halfW - 36 * scale} ${size * 0.37} Q ${halfW - 22 * scale} ${mood === 'encouraging' ? size * 0.33 : size * 0.35} ${halfW - 8 * scale} ${size * 0.37}`}
            stroke="#3D2B1F" strokeWidth={2.5 * scale} fill="none" strokeLinecap="round" />
          <path
            d={`M ${halfW + 8 * scale} ${size * 0.37} Q ${halfW + 22 * scale} ${mood === 'encouraging' ? size * 0.33 : size * 0.35} ${halfW + 36 * scale} ${size * 0.37}`}
            stroke="#3D2B1F" strokeWidth={2.5 * scale} fill="none" strokeLinecap="round" />

          {/* ── Nose ── */}
          <ellipse cx={halfW} cy={size * 0.50} rx={5 * scale} ry={4 * scale}
            fill={skinDark} opacity={0.6} />

          {/* ── Mouth / lip-sync ── */}
          {getMouth()}

          {/* ── Listening indicator ── */}
          {isListening && (
            <motion.circle cx={halfW - 28 * scale} cy={size * 0.43}
              r={16 * scale} fill="none" stroke="#6C63FF" strokeWidth={2 * scale}
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 1, repeat: Infinity }} />
          )}
        </svg>
      </motion.div>

      {/* mic pulse ring when speaking */}
      {isSpeaking && (
        <motion.div
          className="absolute rounded-full border-4 border-purple-400"
          style={{ width: size * 0.94, height: size * 0.94, top: 0 }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}

      {/* label badge */}
      <motion.div
        className="mt-2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg"
        style={{ background: 'linear-gradient(135deg,#6C63FF,#4C44CC)' }}
        animate={isSpeaking ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        {isSpeaking ? '🎤 Speaking…' : isListening ? '👂 Listening…' : `👦 ${label}`}
      </motion.div>

      {/* celebration sparks */}
      <AnimatePresence>
        {mood === 'celebrating' && (
          <>
            {['⭐', '🎉', '✨', '🌟', '💫', '🎊'].map((emoji, i) => (
              <motion.div key={i} className="absolute text-xl pointer-events-none"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                  x: Math.cos((i * 60 * Math.PI) / 180) * 90,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 90 - 20,
                }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.12 }}
              >
                {emoji}
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
