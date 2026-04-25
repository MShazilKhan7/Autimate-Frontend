import { motion } from 'framer-motion';
import {
  Calendar,
  TrendingUp,
  Mic,
  Users,
  Trophy,
  Star,
  BarChart2,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';
import Layout from '@/components/Layout/Layout';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  title, value, subtitle, icon: Icon, gradient, iconBg, delay = 0,
}: {
  title: string; value: string | number; subtitle: string;
  icon: React.ElementType; gradient: string; iconBg: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ scale: 1.03, y: -3 }}
      className={`relative overflow-hidden rounded-3xl p-6 shadow-lg cursor-default ${gradient}`}
    >
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

// ─── Session Row ──────────────────────────────────────────────────────────────
function SessionRow({
  icon: Icon, type, detail, date, score, level, iconColor, delay,
}: {
  icon: React.ElementType; type: string; detail: string; date: string;
  score: number; level: number; iconColor: string; delay: number;
}) {
  const scoreColor = score >= 80 ? 'text-emerald-600 bg-emerald-50' : score >= 60 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50';
  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay }}
      className="flex items-center gap-4 py-3.5 border-b border-muted/15 last:border-0 group"
    >
      <div className={`p-2.5 rounded-xl ${iconColor}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{type}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-muted-foreground hidden sm:block">{date}</span>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${scoreColor}`}>
          {score}%
        </span>
        <span className="text-xs text-muted-foreground bg-muted/20 px-2 py-1 rounded-lg">
          Lvl {level}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Reports Page ─────────────────────────────────────────────────────────────
export default function Reports() {
  const stats = [
    { title: 'Current Level', value: 10, subtitle: '10% to next level 🚀', icon: Trophy, gradient: 'bg-gradient-to-br from-amber-400 to-orange-500', iconBg: 'bg-amber-300/30', delay: 0.1 },
    { title: 'Speech Sessions', value: 10, subtitle: 'Avg score: 80%', icon: Mic, gradient: 'bg-gradient-to-br from-primary to-primary-soft', iconBg: 'bg-white/20', delay: 0.18 },
    { title: 'Social Tasks', value: 10, subtitle: 'Skills practiced', icon: Users, gradient: 'bg-gradient-to-br from-violet-500 to-purple-600', iconBg: 'bg-violet-300/30', delay: 0.26 },
    { title: 'Total Sessions', value: 10, subtitle: 'All activities', icon: TrendingUp, gradient: 'bg-gradient-to-br from-emerald-400 to-teal-600', iconBg: 'bg-emerald-300/30', delay: 0.34 },
  ];

  const sessions = [
    { icon: Mic, type: 'Speech Therapy', detail: '"B" & "P" consonant drills', date: 'Today', score: 92, level: 2, iconColor: 'bg-primary', delay: 0.05 },
    { icon: Users, type: 'Social Skills', detail: 'Greeting & turn-taking practice', date: 'Yesterday', score: 78, level: 1, iconColor: 'bg-violet-500', delay: 0.1 },
    { icon: Mic, type: 'Speech Therapy', detail: 'Vowel sounds articulation', date: 'Apr 21', score: 85, level: 2, iconColor: 'bg-primary', delay: 0.15 },
    { icon: Users, type: 'Social Skills', detail: 'Eye contact exercises', date: 'Apr 20', score: 65, level: 1, iconColor: 'bg-violet-500', delay: 0.2 },
    { icon: Mic, type: 'Speech Therapy', detail: '"S" & "Sh" sound production', date: 'Apr 19', score: 70, level: 1, iconColor: 'bg-primary', delay: 0.25 },
  ];

  const insights = [
    { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', title: 'Performance', text: 'Great progress! Consistently scoring above 75% in speech therapy this week.' },
    { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', title: 'Consistency', text: 'Averaging 2 sessions per day. Keep up the regular practice for the best results!' },
    { icon: Sparkles, color: 'text-violet-600', bg: 'bg-violet-50', title: 'Highlight', text: 'Scored 92% on "B & P" sounds — a personal best! 🎉' },
  ];

  return (
    <Layout>
      <div className="min-h-full bg-background">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[35rem] h-[35rem] rounded-full bg-primary/5 blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[25rem] h-[25rem] rounded-full bg-violet-200/20 blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="relative z-10 p-6 md:p-8 max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <BarChart2 className="w-3.5 h-3.5" /> Progress Reports
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">Your Journey 📈</h1>
              <p className="text-muted-foreground mt-1">Track every milestone, session, and achievement.</p>
            </div>
          </motion.div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(s => <StatCard key={s.title} {...s} />)}
          </div>

          {/* Middle row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Session history — 2 cols */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-7"
            >
              <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Recent Session History
              </h2>
              <motion.div variants={stagger} initial="hidden" animate="show">
                {sessions.map((s, i) => <SessionRow key={i} {...s} />)}
              </motion.div>
              <button className="mt-4 w-full py-2.5 rounded-xl border-2 border-dashed border-muted/40 text-muted-foreground text-sm font-semibold hover:border-primary/40 hover:text-primary transition-all duration-200 flex items-center justify-center gap-1">
                View all sessions <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Weekly progress — 1 col */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-7 flex flex-col"
            >
              <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                This Week
              </h2>
              {[
                { day: 'Mon', done: true, score: 85 },
                { day: 'Tue', done: true, score: 92 },
                { day: 'Wed', done: true, score: 78 },
                { day: 'Thu', done: true, score: 70 },
                { day: 'Fri', done: false, score: 0 },
                { day: 'Sat', done: false, score: 0 },
                { day: 'Sun', done: false, score: 0 },
              ].map(({ day, done, score }) => (
                <div key={day} className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-muted-foreground w-7 font-semibold">{day}</span>
                  <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden">
                    {done && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-400' : 'bg-rose-400'}`}
                      />
                    )}
                  </div>
                  <span className="text-xs font-bold text-foreground w-8 text-right">
                    {done ? `${score}%` : '—'}
                  </span>
                </div>
              ))}
              <div className="mt-auto pt-4 border-t border-muted/20 text-center">
                <p className="text-2xl font-extrabold text-primary">81%</p>
                <p className="text-xs text-muted-foreground">Weekly average</p>
              </div>
            </motion.div>
          </div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-7"
          >
            <h2 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-500" />
              Progress Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.map(({ icon: Icon, color, bg, title, text }) => (
                <div key={title} className={`${bg} rounded-2xl p-5`}>
                  <div className={`flex items-center gap-2 mb-2 font-bold text-sm ${color}`}>
                    <Icon className="w-4 h-4" />{title}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}