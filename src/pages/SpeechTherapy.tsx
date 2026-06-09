// pages/SpeechTherapy/ModulesPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Home,
  Layers,
  Loader2,
  Mic,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Pill } from "@/components/ui/badge";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  therapyModulesAPI,
  SpeechTherapyModule,
} from "@/api/therapy";

/* ─── helpers ─── */
const EXERCISE_TYPE_COLORS: Record<string, string> = {
  imitation: "#3b82f6",
  identify:  "#8b5cf6",
  expressive:"#f59e0b",
  functional:"#10b981",
  checkpoint:"#ef4444",
};

function ModuleCard({
  mod,
  done,
  onSelect,
}: {
  mod: SpeechTherapyModule;
  done: boolean;
  onSelect: () => void;
}) {
  // count step types
  const typeCount: Record<string, number> = {};
  mod.steps.forEach((s) => {
    typeCount[s.type] = (typeCount[s.type] ?? 0) + 1;
  });

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="group text-left w-full rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all bg-white border border-white/70"
    >
      {/* color bar */}
      <div className="h-1.5 w-full" style={{ background: mod.color }} />

      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* top row */}
        <div className="flex items-start justify-between">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
            style={{ background: mod.colorLight }}
          >
            {mod.emoji}
          </div>
          <div className="flex items-center gap-2">
            {done && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            <div className="w-8 h-8 rounded-full bg-muted/10 group-hover:bg-muted/30 flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* text */}
        <div>
          <h3 className="font-bold text-lg text-foreground leading-snug">
            {mod.title}
          </h3>
          {mod.subtitle && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {mod.subtitle}
            </p>
          )}
        </div>

        {/* meta pills */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          <Pill className="bg-slate-100 text-slate-600 text-[11px]">
            <Layers className="h-2.5 w-2.5 mr-1" />
            {mod.steps.length} steps
          </Pill>
          {Object.entries(typeCount).map(([type, count]) => (
            <Pill
              key={type}
              className="text-[11px] text-white"
              // style={{ background: EXERCISE_TYPE_COLORS[type] ?? "#94a3b8" }}
            >
              {count} {type}
            </Pill>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

/* ─── page ─── */
export default function ModulesPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) navigate("/auth");
  }, [isLoggedIn, navigate]);

  const { data: modules = [], isLoading } = useQuery<SpeechTherapyModule[]>({
    queryKey: ["speech-therapy-modules"],
    queryFn: () => therapyModulesAPI.getAll().then((res) => res.data ?? res),
  });

  /* persisted completed set – could come from a hook in real app */
  const completedModules = new Set<string>();

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
        {/* decorative blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full bg-sky-200/20 blur-3xl" />
        </div>

        <div className="relative z-10 px-4 py-8 md:px-8 md:py-10 max-w-6xl mx-auto">
          {/* header */}
          <div className="flex items-center justify-between mb-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-2 rounded-xl font-semibold"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Button>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
              <Mic className="w-3.5 h-3.5" />
              Speech Therapy
            </div>
          </div>

          {/* hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Choose a Module
            </h1>
            <p className="text-muted-foreground mt-2 text-base max-w-xl">
              Each module is a curated set of exercises designed to build
              specific speech skills. Pick one to begin your session.
            </p>
          </motion.div>

          {/* grid */}
          {modules.length === 0 ? (
            <div className="flex flex-col items-center py-28 text-muted-foreground gap-4">
              <Layers className="h-12 w-12 opacity-20" />
              <p className="text-sm">No therapy modules found.</p>
              <Button onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07 } },
              }}
              className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {modules.map((mod) => (
                <motion.div
                  key={mod._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <ModuleCard
                    mod={mod}
                    done={completedModules.has(mod._id!)}
                    onSelect={() =>
                      navigate(`/therapy/${mod._id}/steps/0`)
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}