import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TeacherCharacter3DProps {
  isSpeaking: boolean;  // Teacher is speaking (TTS)
  mood?: 'happy' | 'encouraging' | 'celebrating' | 'thinking' | 'idle';
  message?: string;
  label?: string;
  size?: number;
}

/**
 * Friendly human teacher character named Zara for the AI/computer side.
 * Appears as a warm, cheerful adult with animated lip-sync,
 * so kids feel they are talking to a real friendly person.
 */
export function TeacherCharacter3D({
  isSpeaking,
  mood = 'idle',
  message,
  label = 'Zara',
  size = 220,
}: TeacherCharacter3DProps) {
  const [blinkState, setBlinkState] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0);

  const halfW = size / 2;
  const s = size / 220; // uniform scale factor

  /* ── blink ── */
  useEffect(() => {
    const id = setInterval(() => {
      setBlinkState(true);
      setTimeout(() => setBlinkState(false), 130);
    }, 3000 + Math.random() * 1500);
    return () => clearInterval(id);
  }, []);

  /* ── lip-sync ── */
  useEffect(() => {
    if (!isSpeaking) { setMouthOpen(0); return; }
    const id = setInterval(() => {
      setMouthOpen(Math.random());
    }, 110);
    return () => clearInterval(id);
  }, [isSpeaking]);

  /* ── colour palette: warm, teacher-like ── */
  const skinLight = '#FDDBB4';
  const skinDark  = '#F5B97A';
  const hairColor = '#8B4513'; // warm brown
  const shirtColor = '#E8556D'; // cheerful coral/rose

  /* mouth geometry */
  const getMouth = () => {
    const open = isSpeaking
      ? mouthOpen * 18
      : mood === 'celebrating'
      ? 12
      : mood === 'happy' || mood === 'encouraging'
      ? 6
      : 3;

    if (blinkState) return null;

    const cx = halfW;
    const cy = 150 * s;
    const rx = 20 * s;
    const ry = Math.max(2, open) * s;

    return (
      <g>
        {/* lips */}
        <ellipse cx={cx} cy={cy} rx={rx + 3 * s} ry={ry + 4 * s}
          fill="#C0524A" />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
          fill={isSpeaking || mood === 'celebrating' ? '#8B1A1A' : '#B04040'} />
        {/* teeth */}
        {(isSpeaking || mood === 'celebrating') && ry > 3 && (
          <ellipse cx={cx} cy={cy - ry * 0.4} rx={rx * 0.7} ry={ry * 0.5}
            fill="white" opacity={0.95} />
        )}
        {/* upper lip curve */}
        <path
          d={`M ${cx - rx - 2 * s} ${cy - 2 * s} Q ${cx - rx * 0.4} ${cy - ry - 5 * s} ${cx} ${cy - ry - 3 * s} Q ${cx + rx * 0.4} ${cy - ry - 5 * s} ${cx + rx + 2 * s} ${cy - 2 * s}`}
          stroke="#A03030" strokeWidth={1.5 * s} fill="none" strokeLinecap="round"
        />
      </g>
    );
  };

  /* eye expression */
  const getEyes = () => {
    if (blinkState) {
      return (
        <>
          <path d={`M ${halfW - 30 * s} ${108 * s} L ${halfW - 10 * s} ${108 * s}`}
            stroke="#4A2C0A" strokeWidth={3.5 * s} strokeLinecap="round" />
          <path d={`M ${halfW + 10 * s} ${108 * s} L ${halfW + 30 * s} ${108 * s}`}
            stroke="#4A2C0A" strokeWidth={3.5 * s} strokeLinecap="round" />
        </>
      );
    }

    if (mood === 'celebrating') {
      return (
        <>
          <path d={`M ${halfW - 34 * s} ${102 * s} L ${halfW - 18 * s} ${115 * s} L ${halfW - 2 * s} ${102 * s}`}
            stroke="#4A2C0A" strokeWidth={3 * s} fill="none" strokeLinecap="round" />
          <path d={`M ${halfW + 2 * s} ${102 * s} L ${halfW + 18 * s} ${115 * s} L ${halfW + 34 * s} ${102 * s}`}
            stroke="#4A2C0A" strokeWidth={3 * s} fill="none" strokeLinecap="round" />
        </>
      );
    }

    return (
      <>
        {/* Left eye */}
        <ellipse cx={halfW - 22 * s} cy={110 * s} rx={15 * s} ry={14 * s} fill="white" />
        <circle cx={halfW - 22 * s} cy={110 * s} r={9 * s} fill="#4A2C0A" />
        <circle cx={halfW - 22 * s} cy={110 * s} r={5 * s} fill="#2A1005" />
        <circle cx={halfW - 27 * s} cy={106 * s} r={2.5 * s} fill="white" />
        {/* eyelashes */}
        <path d={`M ${halfW - 36 * s} ${102 * s} Q ${halfW - 22 * s} ${95 * s} ${halfW - 8 * s} ${102 * s}`}
          stroke="#2A1005" strokeWidth={2 * s} fill="none" strokeLinecap="round" />

        {/* Right eye */}
        <ellipse cx={halfW + 22 * s} cy={110 * s} rx={15 * s} ry={14 * s} fill="white" />
        <circle cx={halfW + 22 * s} cy={110 * s} r={9 * s} fill="#4A2C0A" />
        <circle cx={halfW + 22 * s} cy={110 * s} r={5 * s} fill="#2A1005" />
        <circle cx={halfW + 17 * s} cy={106 * s} r={2.5 * s} fill="white" />
        {/* eyelashes */}
        <path d={`M ${halfW + 8 * s} ${102 * s} Q ${halfW + 22 * s} ${95 * s} ${halfW + 36 * s} ${102 * s}`}
          stroke="#2A1005" strokeWidth={2 * s} fill="none" strokeLinecap="round" />
      </>
    );
  };

  return (
    <div className="flex flex-col items-center select-none relative" style={{ width: size }}>
      {/* speech bubble */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            className="absolute -top-20 bg-white/95 rounded-2xl px-4 py-2 shadow-xl border-2 border-rose-300/60 max-w-[210px] text-center z-10 backdrop-blur-sm"
          >
            <p className="text-sm font-semibold text-slate-700">{message}</p>
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-rose-300/60 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{ perspective: 700, perspectiveOrigin: '50% 55%' }}
        animate={
          mood === 'celebrating'
            ? { y: [0, -14, 0], rotate: [0, 5, -5, 0] }
            : isSpeaking
            ? { y: [0, -2, 0] }
            : { y: [0, -5, 0] }
        }
        transition={{
          duration: mood === 'celebrating' ? 0.4 : 2.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            {/* skin */}
            <radialGradient id="teacherSkin" cx="38%" cy="25%" r="68%">
              <stop offset="0%" stopColor="#FFF5E0" />
              <stop offset="50%" stopColor={skinLight} />
              <stop offset="100%" stopColor={skinDark} />
            </radialGradient>
            {/* hair */}
            <radialGradient id="teacherHair" cx="40%" cy="20%" r="70%">
              <stop offset="0%" stopColor="#C07840" />
              <stop offset="100%" stopColor={hairColor} />
            </radialGradient>
            {/* shirt */}
            <linearGradient id="teacherShirt" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F06070" />
              <stop offset="100%" stopColor={shirtColor} />
            </linearGradient>
            {/* blush */}
            <radialGradient id="teacherBlush" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0" />
            </radialGradient>
            {/* shadow */}
            <radialGradient id="teacherShadow" cx="50%" cy="100%" r="50%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.15)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="teacherDropShadow">
              <feDropShadow dx="3" dy="6" stdDeviation="6" floodColor="rgba(0,0,0,0.22)" />
            </filter>
          </defs>

          {/* ── Body / shirt ── */}
          <ellipse cx={halfW} cy={196 * s} rx={55 * s} ry={30 * s}
            fill="url(#teacherShirt)" />
          <ellipse cx={halfW} cy={178 * s} rx={38 * s} ry={20 * s}
            fill="url(#teacherShirt)" />

          {/* collar */}
          <path d={`M ${halfW - 24 * s} ${170 * s} Q ${halfW} ${185 * s} ${halfW + 24 * s} ${170 * s}`}
            stroke="white" strokeWidth={2 * s} fill="none" strokeLinecap="round" opacity={0.6} />

          {/* ── Neck ── */}
          <rect x={halfW - 15 * s} y={158 * s} width={30 * s} height={20 * s}
            rx={7 * s} fill={skinDark} />

          {/* ── Head ── */}
          <ellipse cx={halfW} cy={100 * s} rx={72 * s} ry={80 * s}
            fill="url(#teacherSkin)" filter="url(#teacherDropShadow)" />
          {/* bottom depth shadow */}
          <ellipse cx={halfW} cy={150 * s} rx={54 * s} ry={14 * s}
            fill="url(#teacherShadow)" />

          {/* ── Hair (women teacher style - bun/longer) ── */}
          {/* back hair volume */}
          <ellipse cx={halfW} cy={48 * s} rx={78 * s} ry={52 * s}
            fill="url(#teacherHair)" />
          {/* bun on top-right */}
          <circle cx={halfW + 52 * s} cy={30 * s} r={20 * s}
            fill="url(#teacherHair)" />
          <circle cx={halfW + 52 * s} cy={30 * s} r={12 * s}
            fill="#9A5520" />
          {/* side strands */}
          <ellipse cx={halfW - 66 * s} cy={105 * s} rx={14 * s} ry={32 * s}
            fill="url(#teacherHair)" />
          <ellipse cx={halfW + 66 * s} cy={105 * s} rx={14 * s} ry={32 * s}
            fill="url(#teacherHair)" />
          {/* forehead reveal */}
          <ellipse cx={halfW - 10 * s} cy={55 * s} rx={54 * s} ry={28 * s}
            fill="url(#teacherSkin)" />

          {/* ── Ears ── */}
          <ellipse cx={halfW - 70 * s} cy={108 * s} rx={10 * s} ry={14 * s}
            fill={skinLight} />
          <ellipse cx={halfW + 70 * s} cy={108 * s} rx={10 * s} ry={14 * s}
            fill={skinLight} />
          {/* small earring dots */}
          <circle cx={halfW - 70 * s} cy={114 * s} r={3 * s} fill="#FFD700" />
          <circle cx={halfW + 70 * s} cy={114 * s} r={3 * s} fill="#FFD700" />

          {/* ── Cheeks ── */}
          <ellipse cx={halfW - 46 * s} cy={128 * s} rx={20 * s} ry={14 * s}
            fill="url(#teacherBlush)" />
          <ellipse cx={halfW + 46 * s} cy={128 * s} rx={20 * s} ry={14 * s}
            fill="url(#teacherBlush)" />

          {/* ── Eyebrows (arched, expressive) ── */}
          <path
            d={`M ${halfW - 38 * s} ${90 * s} Q ${halfW - 22 * s} ${mood === 'encouraging' ? 82 * s : 85 * s} ${halfW - 6 * s} ${91 * s}`}
            stroke="#5A3010" strokeWidth={3 * s} fill="none" strokeLinecap="round"
          />
          <path
            d={`M ${halfW + 6 * s} ${91 * s} Q ${halfW + 22 * s} ${mood === 'encouraging' ? 82 * s : 85 * s} ${halfW + 38 * s} ${90 * s}`}
            stroke="#5A3010" strokeWidth={3 * s} fill="none" strokeLinecap="round"
          />

          {/* ── Eyes ── */}
          {getEyes()}

          {/* ── Nose ── */}
          <path d={`M ${halfW - 4 * s} ${122 * s} Q ${halfW + 8 * s} ${128 * s} ${halfW + 4 * s} ${122 * s}`}
            stroke={skinDark} strokeWidth={2 * s} fill="none" strokeLinecap="round" opacity={0.7} />

          {/* ── Mouth ── */}
          {getMouth()}

          {/* ── Freckles (optional cute touch) ── */}
          <circle cx={halfW - 38 * s} cy={122 * s} r={2 * s} fill="#D4956A" opacity={0.5} />
          <circle cx={halfW - 32 * s} cy={125 * s} r={1.5 * s} fill="#D4956A" opacity={0.5} />
          <circle cx={halfW + 32 * s} cy={122 * s} r={2 * s} fill="#D4956A" opacity={0.5} />
          <circle cx={halfW + 38 * s} cy={125 * s} r={1.5 * s} fill="#D4956A" opacity={0.5} />

          {/* ── Speaking sound waves (when talking) ── */}
          {isSpeaking && (
            <>
              <motion.ellipse cx={halfW - 90 * s} cy={100 * s} rx={6 * s} ry={18 * s}
                fill="none" stroke="#E8556D" strokeWidth={2 * s} opacity={0.6}
                animate={{ rx: [6, 10, 6], opacity: [0.6, 0.1, 0.6] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <motion.ellipse cx={halfW + 90 * s} cy={100 * s} rx={6 * s} ry={18 * s}
                fill="none" stroke="#E8556D" strokeWidth={2 * s} opacity={0.6}
                animate={{ rx: [6, 10, 6], opacity: [0.6, 0.1, 0.6] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
              />
            </>
          )}
        </svg>
      </motion.div>

      {/* speaking pulse ring */}
      {isSpeaking && (
        <motion.div
          className="absolute rounded-full border-4 border-rose-400 pointer-events-none"
          style={{ width: size * 0.93, height: size * 0.93, top: 0 }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.65, 0, 0.65] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}

      {/* label badge */}
      <motion.div
        className="mt-2 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg"
        style={{ background: 'linear-gradient(135deg,#E8556D,#C0392B)' }}
        animate={isSpeaking ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        {isSpeaking ? `🔊 ${label} is talking…` : `👩‍🏫 ${label}`}
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
                  x: Math.cos((i * 60 * Math.PI) / 180) * 95,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 95 - 20,
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
