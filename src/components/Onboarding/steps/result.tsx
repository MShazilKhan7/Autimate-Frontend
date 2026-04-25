import { AssessmentProfile, ChildInfo } from "@/types/onboarding";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Database,
  Layers,
  Mic2,
  Sparkles,
  Timer,
  Volume2,
  ClipboardList,
  AlertTriangle,
  Copy,
} from "lucide-react";
import { useState } from "react";

// --- Sub-Components ---

const ScoreRow = ({
  icon,
  label,
  score,
  max,
  color,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  score: number;
  max: number;
  color: string;
  delay: number;
}) => {
  const pct = Math.round((score / max) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <span style={{ color }}>{icon}</span>
          {label}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-base" style={{ color }}>
            {score}
          </span>
          <span className="text-muted-foreground text-xs">/ {max}</span>
        </div>
      </div>
      <div className="h-2.5 w-full bg-muted/30 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
};

const PlanCard = ({
  icon,
  label,
  value,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="flex items-start gap-4 p-5 bg-muted/10 border border-muted/20 rounded-2xl hover:bg-muted/20 hover:border-primary/20 transition-all duration-300 group"
  >
    <div className="p-2.5 bg-primary/10 text-primary rounded-xl group-hover:bg-primary/15 transition-colors">
      {icon}
    </div>
    <div>
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-sm font-bold text-foreground">{value}</div>
    </div>
  </motion.div>
);

// --- Main Component ---

const ResultsStep: React.FC<{
  profile: AssessmentProfile;
  getChildInfo: () => ChildInfo;
  showDB: boolean;
  setShowDB: React.Dispatch<React.SetStateAction<boolean>>;
  resetAll: () => void;
  twCardCls?: string;
  twH2Cls?: string;
}> = ({ profile, getChildInfo, showDB, setShowDB }) => {
  const navigate = useNavigate();
  const { tier, scores, total } = profile;
  const childInfo = getChildInfo();
  const name = childInfo.name || "Your child";
  const dbOutput = JSON.stringify(profile.dbProfile, null, 2);
  const [copied, setCopied] = useState(false);

  const tierEmoji: Record<number, string> = {
    1: "🌱",
    2: "🌿",
    3: "🌳",
    4: "🚀",
    5: "⭐",
  };

  const planItems = [
    {
      icon: <Layers className="w-4 h-4" />,
      label: "Difficulty Level",
      value: tier.difficultyLevel,
    },
    {
      icon: <Timer className="w-4 h-4" />,
      label: "Session Length",
      value: tier.sessionLength,
    },
    {
      icon: <Volume2 className="w-4 h-4" />,
      label: "Target Phonemes",
      value: tier.phonemeTargets.join(", "),
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      label: "Vocabulary Target",
      value: tier.vocab,
    },
  ];

  const handleCopy = () => {
    navigator.clipboard?.writeText(dbOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const glassCard =
    "bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-black/5 rounded-3xl p-8 mb-6";

  const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  return (
    <div className="min-h-screen w-full bg-background relative">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary-soft/20 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto py-14 px-4 sm:px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-5"
        >
          {/* ── Hero Header Card ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${glassCard} relative overflow-hidden text-center`}
          >
            {/* Coloured accent line at top */}
            <div
              className="absolute top-0 left-0 w-full h-1.5 rounded-t-3xl"
              style={{ backgroundColor: tier.color }}
            />

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-5 mt-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Assessment Complete
            </div>

            {/* Emoji */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.55, delay: 0.3 }}
              className="text-7xl mb-5 leading-none"
            >
              {tierEmoji[tier.id]}
            </motion.div>

            {/* Name & tier */}
            <p className="text-lg text-muted-foreground mb-1">
              {name} is a
            </p>
            <h1
              className="text-4xl font-extrabold mb-4 leading-tight"
              style={{ color: tier.color }}
            >
              {tier.label}
            </h1>

            {/* Score pill */}
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white font-bold text-sm shadow-lg mb-6"
              style={{ backgroundColor: tier.color }}
            >
              <Sparkles className="w-4 h-4" />
              Total Score: {total}/100
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed bg-muted/20 rounded-2xl px-6 py-4 max-w-xl mx-auto">
              {tier.description}
            </p>
          </motion.div>

          {/* ── Domain Scores Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className={glassCard}
          >
            <div className="flex items-center gap-3 mb-7">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Communication Domain Scores
              </h2>
            </div>
            <div className="space-y-5">
              <ScoreRow
                icon={<Mic2 className="w-4 h-4" />}
                label="Expressive Language"
                score={scores.expressive}
                max={30}
                color="#4A90D9"
                delay={0.2}
              />
              <ScoreRow
                icon={<Volume2 className="w-4 h-4" />}
                label="Receptive Language"
                score={scores.receptive}
                max={20}
                color="#7B61FF"
                delay={0.3}
              />
              <ScoreRow
                icon={<Brain className="w-4 h-4" />}
                label="Speech Articulation"
                score={scores.articulation}
                max={30}
                color="#F97316"
                delay={0.4}
              />
              <ScoreRow
                icon={<Sparkles className="w-4 h-4" />}
                label="Social Communication"
                score={scores.social}
                max={20}
                color="#22C55E"
                delay={0.5}
              />
            </div>
          </motion.div>

          {/* ── Personalised Therapy Plan ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className={glassCard}
          >
            <div className="flex items-center gap-3 mb-7">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Personalised Therapy Plan
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {planItems.map((item, i) => (
                <PlanCard
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  delay={0.3 + i * 0.08}
                />
              ))}
            </div>

            <div className="pt-6 border-t border-muted/20">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Recommended Starting Exercises
              </p>
              <div className="flex flex-wrap gap-2">
                {tier.exercises.map((ex) => (
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    key={ex}
                    className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full py-1.5 px-4 text-xs font-semibold shadow-sm cursor-default"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {ex}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Database Profile ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className={glassCard}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                  <Database className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  Database Profile Object
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-2 border-muted/40 hover:bg-muted/20 font-semibold text-xs"
                onClick={() => setShowDB((p) => !p)}
              >
                {showDB ? "Hide JSON" : "Show JSON"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              This object is ready to be stored in your DB (MongoDB / PostgreSQL). It contains
              all scoring data, tier classification, recommended exercises, phoneme targets,
              and preference settings.
            </p>
            {showDB && (
              <motion.div
                initial={{ opacity: 0, scaleY: 0.95, transformOrigin: "top" }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.25 }}
                className="relative mt-3"
              >
                <div className="absolute top-3 right-3 z-10">
                  <Button
                    size="sm"
                    variant={copied ? "default" : "secondary"}
                    onClick={handleCopy}
                    className="rounded-lg text-xs gap-1.5 h-7 px-3"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <pre className="bg-slate-950 text-emerald-400 rounded-2xl p-5 pt-10 text-xs leading-relaxed overflow-auto max-h-80 font-mono shadow-inner">
                  {dbOutput}
                </pre>
              </motion.div>
            )}
          </motion.div>

          {/* ── Actions ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex flex-col items-center gap-4 pt-2 pb-14"
          >
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="w-full sm:w-auto px-14 py-6 rounded-2xl bg-gradient-to-r from-primary to-primary-soft hover:from-primary/90 hover:to-primary-soft/90 text-primary-foreground font-bold shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 text-base gap-2"
            >
              Go to Dashboard
              <ChevronRight className="w-5 h-5" />
            </Button>

            <div className="flex items-start gap-2 max-w-xl text-center text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 mt-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p>
                This assessment is a <strong className="text-foreground">screening tool</strong> to
                personalise the platform experience — it does not constitute a clinical diagnosis.
                Always involve a qualified Speech-Language Pathologist for therapeutic decisions.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsStep;