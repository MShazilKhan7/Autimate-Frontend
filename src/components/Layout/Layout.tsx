import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Search, Brain } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/therapy': 'Speech Therapy',
  '/speech-space': 'Speech Space',
  '/social': 'Social Skills',
  '/reports': 'Progress Reports',
  '/settings': 'Settings',
};

export default function Layout({ children }: LayoutProps) {
  const { user, isUserLoading } = useAuth();
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? 'Autimate';
  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : 'A';

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="p-5 bg-gradient-to-br from-primary to-primary-soft rounded-3xl inline-flex mb-5 shadow-2xl shadow-primary/30">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Loading Autimate…</h1>
          <div className="mt-4 flex gap-1.5 justify-center">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 rounded-full bg-primary"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top header */}
          <header className="h-16 flex items-center gap-4 px-6 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm sticky top-0 z-30">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" />

            {/* Page title */}
            <motion.h1
              key={pageTitle}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-bold text-foreground flex-1 truncate"
            >
              {pageTitle}
            </motion.h1>

            {/* Right actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Notification bell */}
              <button className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              </button>

              {/* Avatar */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-soft flex items-center justify-center text-white text-sm font-bold shadow-md cursor-default">
                {initials}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}