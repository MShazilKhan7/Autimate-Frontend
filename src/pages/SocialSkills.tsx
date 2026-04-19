import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, RotateCcw, Users, Star, ChevronRight, CheckCircle2,
  Trophy, Sparkles, ArrowRight,
} from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import TaskCard from '@/components/Social/TaskCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import socialTasks from '@/data/socialTasks.json';
import { useAuth } from '@/hooks/useAuth';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Category colours & icons
const categoryMeta: Record<string, { color: string; bg: string; dot: string }> = {
  all:            { color: 'text-white',         bg: 'bg-primary',         dot: 'bg-primary' },
  greetings:      { color: 'text-emerald-700',   bg: 'bg-emerald-100',     dot: 'bg-emerald-500' },
  sharing:        { color: 'text-violet-700',    bg: 'bg-violet-100',      dot: 'bg-violet-500' },
  conversation:   { color: 'text-sky-700',       bg: 'bg-sky-100',         dot: 'bg-sky-500' },
  emotions:       { color: 'text-rose-700',      bg: 'bg-rose-100',        dot: 'bg-rose-500' },
  cooperation:    { color: 'text-amber-700',     bg: 'bg-amber-100',       dot: 'bg-amber-500' },
};
const getMeta = (cat: string) =>
  categoryMeta[cat.toLowerCase()] ?? { color: 'text-slate-700', bg: 'bg-slate-100', dot: 'bg-slate-400' };

export default function SocialSkills() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate('/auth');
  }, [isLoggedIn, navigate]);

  const categories = ['all', ...Array.from(new Set(socialTasks.map(t => t.category)))];
  const filteredTasks =
    selectedCategory === 'all'
      ? socialTasks
      : socialTasks.filter(t => t.category === selectedCategory);

  const isTaskCompleted = (id: number) => completedToday.includes(id.toString());

  const handleTaskComplete = (taskId: number) => {
    const str = taskId.toString();
    if (!completedToday.includes(str)) {
      setCompletedToday(p => [...p, str]);
      const task = socialTasks.find(t => t.id === taskId);
      toast({ title: '🎉 Great job!', description: `You practiced "${task?.task}". Keep it up!` });
    }
  };

  const handleReset = () => {
    setCompletedToday([]);
    toast({ title: 'Session Reset', description: 'Practice all tasks again!' });
  };

  const completedCount = filteredTasks.filter(t => isTaskCompleted(t.id)).length;
  const totalCount = filteredTasks.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allDone = completedCount === totalCount && totalCount > 0;

  return (
    <Layout>
      <div className="min-h-full bg-background">
        {/* Background blobs */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[35rem] h-[35rem] rounded-full bg-violet-200/20 blur-3xl -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[25rem] h-[25rem] rounded-full bg-primary/5 blur-3xl translate-y-1/3 -translate-x-1/4" />
        </div>

        <div className="relative z-10 p-6 md:p-8 max-w-6xl mx-auto space-y-7">

          {/* ── Header ── */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Users className="w-3.5 h-3.5" /> Social Skills
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Social Skills Practice 🤝
            </h1>
            <p className="text-muted-foreground mt-1">
              Help your child build important communication and social skills
            </p>
          </motion.div>

          {/* ── Progress + Controls row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Progress card — 2 cols */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-7"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500" />
                      Today's Progress
                    </h2>
                    <span className="text-2xl font-extrabold text-foreground">
                      {completedCount}
                      <span className="text-muted-foreground font-normal text-lg">/{totalCount}</span>
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-3 bg-muted/20 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{pct}% complete</span>
                    {completedCount > 0 && (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {completedCount} done!
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex items-center gap-2 rounded-xl border-2 border-muted/40 hover:bg-muted/20 font-semibold flex-shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </motion.div>

            {/* Stats mini card — 1 col */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-7 text-white shadow-xl shadow-violet-500/20 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
              <div className="absolute -right-1 -bottom-6 w-16 h-16 rounded-full bg-white/10" />
              <div className="p-3 bg-white/20 rounded-2xl inline-flex mb-4">
                <Trophy className="w-6 h-6" />
              </div>
              <p className="text-white/80 text-sm font-semibold mb-1">Tasks Available</p>
              <p className="text-5xl font-extrabold mb-1">{totalCount}</p>
              <p className="text-white/70 text-xs">in {categories.length - 1} categories</p>
            </motion.div>
          </div>

          {/* ── Category filter ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Filter by Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => {
                const meta = getMeta(cat);
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 capitalize border-2 ${
                      active
                        ? `${meta.bg} ${meta.color} border-transparent shadow-md scale-105`
                        : 'border-muted/30 text-muted-foreground hover:border-primary/30 hover:text-foreground hover:bg-muted/10'
                    }`}
                  >
                    {active && <div className={`w-2 h-2 rounded-full ${meta.dot}`} />}
                    {cat}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ── Task Grid ── */}
          <AnimatePresence mode="wait">
            {filteredTasks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-16 text-center"
              >
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-xl font-bold text-foreground mb-2">No tasks found</h3>
                <p className="text-muted-foreground">Try selecting a different category</p>
              </motion.div>
            ) : (
              <motion.div
                key={selectedCategory}
                variants={stagger}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {filteredTasks.map(task => (
                  <motion.div key={task.id} variants={fadeUp}>
                    <TaskCard
                      task={task}
                      isCompleted={isTaskCompleted(task.id)}
                      onComplete={handleTaskComplete}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── All Done Banner ── */}
          <AnimatePresence>
            {allDone && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-10 text-white text-center shadow-2xl shadow-emerald-500/20 relative overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-white/10" />
                <div className="text-7xl mb-4">🎉</div>
                <h2 className="text-3xl font-extrabold mb-2">Fantastic Work!</h2>
                <p className="text-white/90 text-lg mb-6">
                  All social skills practiced for today!
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="bg-white text-emerald-700 hover:bg-white/90 font-bold px-8 py-5 rounded-2xl shadow-lg transition-all hover:-translate-y-1"
                  >
                    <Trophy className="w-5 h-5 mr-2" />
                    Back to Dashboard
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-2 border-white/50 text-white hover:bg-white/20 font-bold px-8 py-5 rounded-2xl"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Practice Again
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </Layout>
  );
}