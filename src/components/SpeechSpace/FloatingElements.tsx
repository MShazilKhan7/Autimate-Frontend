import { motion } from 'framer-motion';

export function FloatingElements() {
  const elements = [
    { emoji: '⭐', delay: 0, x: '10%', duration: 15 },
    { emoji: '🌈', delay: 2, x: '85%', duration: 18 },
    { emoji: '☁️', delay: 1, x: '25%', duration: 20 },
    { emoji: '🎈', delay: 3, x: '70%', duration: 16 },
    { emoji: '🦋', delay: 0.5, x: '45%', duration: 14 },
    { emoji: '🌸', delay: 2.5, x: '92%', duration: 17 },
    { emoji: '💫', delay: 1.5, x: '5%', duration: 19 },
    { emoji: '🎀', delay: 4, x: '60%', duration: 15 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl opacity-40"
          style={{ left: el.x }}
          initial={{ y: '110vh', rotate: 0 }}
          animate={{
            y: '-10vh',
            rotate: 360,
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {el.emoji}
        </motion.div>
      ))}

      {/* Gradient overlays for depth */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
