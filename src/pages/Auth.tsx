import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthCard from '@/components/Auth/AuthCard';

export default function Auth() {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    // Navigate to child info collection after successful auth
    navigate('/child-info');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 warm-gradient opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <AuthCard onAuthSuccess={handleAuthSuccess} />
      </motion.div>

      {/* Floating elements for visual appeal */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-20 left-10 text-4xl opacity-30"
      >
        🎈
      </motion.div>

      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute top-32 right-16 text-3xl opacity-30"
      >
        ✨
      </motion.div>

      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 3, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute bottom-20 left-20 text-3xl opacity-30"
      >
        🌟
      </motion.div>
    </div>
  );
}