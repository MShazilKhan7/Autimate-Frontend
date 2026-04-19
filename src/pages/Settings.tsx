import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Baby, Shield, Trash2, LogOut,
  Bell, Moon, Globe, ChevronRight, CheckCircle2,
} from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45 },
});

// ─── Section Card Wrapper ────────────────────────────────────────────────────
function Section({ title, icon: Icon, iconColor = 'bg-primary/10 text-primary', children }: {
  title: string; icon: React.ElementType; iconColor?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl rounded-3xl p-7">
      <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-3">
        <span className={`p-2.5 rounded-xl ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </span>
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-muted/10 rounded-2xl border border-muted/20">
      <div className="p-2.5 bg-primary/10 text-primary rounded-xl flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Toggle Row ───────────────────────────────────────────────────────────────
function ToggleRow({ icon: Icon, label, description, defaultOn = false }: {
  icon: React.ElementType; label: string; description: string; defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-muted/15 last:border-0">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-muted/20 text-muted-foreground rounded-lg">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        onClick={() => setOn(p => !p)}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${on ? 'bg-primary' : 'bg-muted/40'}`}
      >
        <motion.div
          animate={{ x: on ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
        />
      </button>
    </div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────
export default function Settings() {
  const { isLoggedIn, user, signout, authentication } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [childData, setChildData] = useState({ name: 'John Doe', age: '10' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) navigate('/auth');
  }, [isLoggedIn, navigate]);

  const handleChildUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childData.name.trim() || !childData.age.trim()) {
      toast({ title: 'Missing Information', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }
    const age = parseInt(childData.age);
    if (isNaN(age) || age < 1 || age > 18) {
      toast({ title: 'Invalid Age', description: 'Please enter a valid age between 1 and 18.', variant: 'destructive' });
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    toast({ title: 'Information Updated', description: 'Child information has been successfully updated.' });
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all therapy data? This action cannot be undone.')) {
      localStorage.removeItem('authentication');
      toast({ title: 'Data Cleared', description: 'All therapy progress has been reset.' });
      navigate('/dashboard');
    }
  };

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : 'A';

  return (
    <Layout>
      <div className="min-h-full bg-background">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[35rem] h-[35rem] rounded-full bg-primary/5 blur-3xl -translate-y-1/3 translate-x-1/4" />
        </div>

        <div className="relative z-10 p-6 md:p-8 max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <motion.div {...fadeUp(0)}>
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Shield className="w-3.5 h-3.5" /> Account Settings
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">Settings ⚙️</h1>
            <p className="text-muted-foreground mt-1">Manage your account and therapy preferences</p>
          </motion.div>

          {/* Profile Card */}
          <motion.div {...fadeUp(0.1)}>
            <div className="bg-gradient-to-br from-primary to-primary-soft rounded-3xl p-7 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
              <div className="absolute -right-2 -bottom-12 w-28 h-28 rounded-full bg-white/10" />
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-extrabold shadow-md">
                  {initials}
                </div>
                <div>
                  <p className="text-xl font-extrabold">{fullName}</p>
                  <p className="text-white/80 text-sm">Therapist Account</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span className="text-xs text-white/90">Email verified</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Info */}
          <motion.div {...fadeUp(0.15)}>
            <Section title="Account Information" icon={User}>
              <div className="space-y-3">
                <InfoRow icon={Mail} label="Email Address" value={user?.email ?? 'Not available'} />
                <InfoRow icon={User} label="Full Name" value={fullName} />
              </div>
            </Section>
          </motion.div>

          {/* Child Info */}
          <motion.div {...fadeUp(0.2)}>
            <Section title="Child Information" icon={Baby} iconColor="bg-violet-100 text-violet-600">
              <form onSubmit={handleChildUpdate} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="childName" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Child's Name
                    </Label>
                    <Input
                      id="childName"
                      value={childData.name}
                      onChange={e => setChildData({ ...childData, name: e.target.value })}
                      className="py-3 rounded-xl bg-muted/10 border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Enter child's name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="childAge" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Child's Age
                    </Label>
                    <Input
                      id="childAge"
                      type="number"
                      min="1" max="18"
                      value={childData.age}
                      onChange={e => setChildData({ ...childData, age: e.target.value })}
                      className="py-3 rounded-xl bg-muted/10 border-transparent focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Enter age"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className={`px-7 py-5 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                    saved
                      ? 'bg-emerald-500 hover:bg-emerald-500 text-white'
                      : 'bg-gradient-to-r from-primary to-primary-soft hover:from-primary/90 hover:to-primary-soft/90 text-primary-foreground shadow-primary/25 hover:-translate-y-0.5'
                  }`}
                >
                  {saved ? (
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Saved!</span>
                  ) : 'Update Information'}
                </Button>
              </form>
            </Section>
          </motion.div>

          {/* Preferences */}
          <motion.div {...fadeUp(0.25)}>
            <Section title="Preferences" icon={Bell} iconColor="bg-amber-100 text-amber-600">
              <ToggleRow icon={Bell} label="Session Reminders" description="Get notified before scheduled sessions" defaultOn={true} />
              <ToggleRow icon={Moon} label="Dark Mode" description="Switch to a dark interface theme" defaultOn={false} />
              <ToggleRow icon={Globe} label="Accessibility Mode" description="Larger fonts and higher contrast" defaultOn={false} />
            </Section>
          </motion.div>

          {/* Progress summary */}
          <motion.div {...fadeUp(0.3)}>
            <Section title="Progress Summary" icon={CheckCircle2} iconColor="bg-emerald-100 text-emerald-600">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Current Level', value: '10', color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Total Sessions', value: '10', color: 'text-primary', bg: 'bg-primary/5' },
                  { label: 'Social Skills', value: '10', color: 'text-violet-600', bg: 'bg-violet-50' },
                ].map(item => (
                  <div key={item.label} className={`text-center p-5 rounded-2xl ${item.bg}`}>
                    <p className={`text-3xl font-extrabold ${item.color} mb-1`}>{item.value}</p>
                    <p className="text-xs text-muted-foreground font-semibold">{item.label}</p>
                  </div>
                ))}
              </div>
            </Section>
          </motion.div>

          {/* Danger zone */}
          <motion.div {...fadeUp(0.35)}>
            <div className="bg-white/80 backdrop-blur-xl border border-rose-100 shadow-xl rounded-3xl p-7">
              <h2 className="text-lg font-bold text-rose-600 mb-5 flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-rose-100 text-rose-600"><Shield className="w-5 h-5" /></span>
                Account Actions
              </h2>
              <div className="flex flex-wrap gap-3 mb-5">
                <Button
                  onClick={handleClearData}
                  variant="outline"
                  className="flex items-center gap-2 border-2 border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl font-semibold"
                >
                  <Trash2 className="h-4 w-4" /> Clear All Progress Data
                </Button>
                <Button
                  onClick={() => signout({ refresh_token: authentication.refreshToken })}
                  variant="outline"
                  className="flex items-center gap-2 border-2 border-muted/40 hover:bg-muted/20 rounded-xl font-semibold"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              </div>
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-muted-foreground">
                <span className="text-amber-500 mt-0.5">⚠️</span>
                <p>Clearing progress data will remove all therapy sessions, scores, and social skills progress. Your account and child information will be preserved.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}