import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isUserLoading } = useAuth();
  const name = user ? `${user?.firstName} ${user?.lastName}` : '';

  if (isUserLoading) {
    return <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-4 animate-pulse-soft">🌈</div>
        <h1 className="text-therapy-xl text-primary mb-2">Loading Autimate...</h1>
      </div>
    </div>
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 flex items-center justify-between px-6 bg-card/80 backdrop-blur-sm border-b border-border gentle-shadow">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-therapy-lg text-primary font-semibold"
            >
              {name}
            </motion.div>
          </header>
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}