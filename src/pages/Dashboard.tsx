import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mic,
  Users,
  FileText,
  Trophy,
  TrendingUp,
  Star,
  Zap,
  ChevronRight,
  Flame,
  Heart,
  BookOpen,
  Sparkles,
  BarChart2,
} from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// ─── Helpers ────────────────────────────────────────────────────────────────

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  iconBg,
  delay = 0,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ scale: 1.03, y: -3 }}
      className={`relative overflow-hidden rounded-3xl p-6 shadow-lg ${gradient} cursor-default`}
    >
      {/* Decorative blob */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -right-1 -bottom-6 w-16 h-16 rounded-full bg-white/10" />

      <div className={`inline-flex p-3 rounded-2xl mb-4 ${iconBg}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-sm font-semibold text-white/80 mb-1">{title}</p>
      <p className="text-4xl font-extrabold text-white mb-1">{value}</p>
      <p className="text-xs text-white/70">{subtitle}</p>
    </motion.div>
  );
}

// ─── Activity Row ─────────────────────────────────────────────────────────────

function ActivityRow({
  icon: Icon,
  label,
  detail,
  time,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  detail: string;
  time: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay }}
      className="flex items-center gap-4 py-3 border-b border-muted/20 last:border-0"
    >
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
    </motion.div>
  );
}

// ─── Quick Action ─────────────────────────────────────────────────────────────

function QuickAction({
  icon: Icon,
  label,
  description,
  gradient,
  onClick,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  gradient: string;
  onClick: () => void;
  delay: number;
}) {
  return (
    <motion.button
      variants={fadeUp}
      transition={{ delay }}
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-5 rounded-2xl ${gradient} text-white shadow-lg hover:shadow-xl transition-shadow text-left`}
    >
      <div className="p-3 bg-white/20 rounded-xl">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-base">{label}</p>
        <p className="text-xs text-white/80">{description}</p>
      </div>
      <ChevronRight className="w-5 h-5 opacity-70" />
    </motion.button>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.firstName || 'Friend';

  useEffect(() => {
    if (!isLoggedIn) navigate('/auth');
  }, []);

  const stats = [
    {
      title: 'Current Level',
      value: 1,
      subtitle: 'Keep climbing! 🚀',
      icon: Trophy,
      gradient: 'bg-gradient-to-br from-amber-400 to-orange-500',
      iconBg: 'bg-amber-300/30',
    },
    {
      title: 'Speech Sessions',
      value: 4,
      subtitle: 'Sessions completed',
      icon: Mic,
      gradient: 'bg-gradient-to-br from-primary to-primary-soft',
      iconBg: 'bg-white/20',
    },
    {
      title: 'Social Tasks',
      value: 2,
      subtitle: 'Skills practiced',
      icon: Users,
      gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
      iconBg: 'bg-violet-300/30',
    },
    {
      title: 'Average Score',
      value: '80%',
      subtitle: 'Speech accuracy',
      icon: TrendingUp,
      gradient: 'bg-gradient-to-br from-emerald-400 to-teal-600',
      iconBg: 'bg-emerald-300/30',
    },
  ];

  const activities = [
    { icon: Mic, label: 'Speech Therapy', detail: 'Completed "B" sounds lesson', time: '2h ago', color: 'bg-primary', delay: 0.05 },
    { icon: Users, label: 'Social Skills', detail: 'Practiced greetings & turn-taking', time: 'Yesterday', color: 'bg-violet-500', delay: 0.1 },
    { icon: Trophy, label: 'Level Up!', detail: 'Reached Level 1 milestone', time: '2 days ago', color: 'bg-amber-500', delay: 0.15 },
    { icon: Star, label: 'Star Earned', detail: 'Perfect score on articulation', time: '3 days ago', color: 'bg-rose-400', delay: 0.2 },
  ];

  return (
    <Layout>
      <div className="min-h-full bg-background">
        {/* Background radial blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] rounded-full bg-primary-soft/10 blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="relative z-10 p-6 md:p-8 max-w-6xl mx-auto space-y-8">

          {/* ── Welcome Banner ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Therapy Journey
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
                Hello, {firstName}! 👋
              </h1>
              <p className="text-muted-foreground mt-1 text-base">
                Ready to practice today? Let's keep up the great work!
              </p>
            </div>

            {/* Streak badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 bg-gradient-to-br from-amber-400 to-orange-500 text-white px-5 py-3 rounded-2xl shadow-lg self-start md:self-auto cursor-default"
            >
              <Flame className="w-7 h-7" />
              <div>
                <p className="text-2xl font-extrabold leading-none">4</p>
                <p className="text-xs opacity-90 font-semibold">Day Streak 🔥</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <StatCard key={s.title} {...s} delay={0.1 + i * 0.08} />
            ))}
          </div>

          {/* ── Middle Row: Quick Actions + Level Progress ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Quick Actions — takes 3 cols */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-3 bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-7"
            >
              <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Continue Learning
              </h2>
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
                <QuickAction
                  icon={Mic}
                  label="Speech Therapy"
                  description="Practice sounds & pronunciation"
                  gradient="bg-gradient-to-r from-primary to-primary-soft"
                  onClick={() => navigate('/therapy')}
                  delay={0}
                />
                <QuickAction
                  icon={Users}
                  label="Social Skills"
                  description="Learn greetings & conversations"
                  gradient="bg-gradient-to-r from-violet-500 to-purple-600"
                  onClick={() => navigate('/social')}
                  delay={0.05}
                />
                <QuickAction
                  icon={FileText}
                  label="Progress Reports"
                  description="See your growth over time"
                  gradient="bg-gradient-to-r from-emerald-500 to-teal-600"
                  onClick={() => navigate('/reports')}
                  delay={0.1}
                />
              </motion.div>
            </motion.div>

            {/* Level Progress — takes 2 cols */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-7 flex flex-col items-center justify-center text-center"
            >
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-5">
                <Trophy className="w-3.5 h-3.5" />
                Level 1
              </div>

              {/* Circular progress SVG */}
              <div className="relative mb-5">
                <svg className="-rotate-90" width="140" height="140">
                  <circle cx="70" cy="70" r="58" strokeWidth="10" stroke="hsl(var(--muted))" fill="transparent" />
                  <motion.circle
                    cx="70" cy="70" r="58"
                    strokeWidth="10"
                    stroke="hsl(var(--primary))"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 58}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - 0.35) }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-primary">35%</span>
                  <span className="text-xs text-muted-foreground">Progress</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-foreground mb-1">Keep going! 🌟</h3>
              <p className="text-xs text-muted-foreground mb-4 max-w-[160px]">
                Complete 3 more sessions to level up!
              </p>

              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Sessions done</span><span className="font-bold text-foreground">4 / 10</span>
                </div>
                <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '40%' }}
                    transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-soft"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Bottom Row: Recent Activity + Achievements ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Recent Activity — 3 cols */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="lg:col-span-3 bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-7"
            >
              <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary" />
                Recent Activity
              </h2>
              <motion.div variants={stagger} initial="hidden" animate="show">
                {activities.map((a) => (
                  <ActivityRow key={a.label} {...a} />
                ))}
              </motion.div>
            </motion.div>

            {/* Achievements — 2 cols */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-7"
            >
              <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Achievements
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { emoji: '🌟', label: 'First Star', unlocked: true },
                  { emoji: '🎯', label: 'On Target', unlocked: true },
                  { emoji: '🔥', label: '4-Day Streak', unlocked: true },
                  { emoji: '🏆', label: 'Level Up', unlocked: false },
                  { emoji: '💬', label: 'Chatterbox', unlocked: false },
                  { emoji: '🎤', label: 'Voice Pro', unlocked: false },
                ].map((badge) => (
                  <motion.div
                    key={badge.label}
                    whileHover={{ scale: 1.1 }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl cursor-default transition-all duration-200 ${
                      badge.unlocked
                        ? 'bg-amber-50 border border-amber-200 shadow-sm'
                        : 'bg-muted/20 border border-muted/20 opacity-50 grayscale'
                    }`}
                  >
                    <span className="text-2xl">{badge.emoji}</span>
                    <span className="text-[10px] font-semibold text-center text-muted-foreground leading-tight">
                      {badge.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-muted/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-400" />Weekly Goal</span>
                  <span className="font-bold text-foreground">3 / 5 sessions</span>
                </div>
                <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1, delay: 0.7, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </Layout>
  );
}