import { Home, Mic, Rocket, Users, FileText, Settings, LogOut } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Speech Therapy',
    url: '/therapy',
    icon: Mic,
  },
  {
    title: 'Speech Space',
    url: '/speech-space',
    icon: Rocket,
  },
  {
    title: 'Social Skills',
    url: '/social',
    icon: Users,
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: FileText,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { signout, authentication } = useAuth();
  
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-card gentle-shadow">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6"
        >
          {!isCollapsed && (
            <h2 className="text-therapy-xl text-primary font-bold mb-2">
              🌈 TherapyPal
            </h2>
          )}
          {isCollapsed && (
            <div className="text-2xl text-center">🌈</div>
          )}
        </motion.div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? 'sr-only' : ''}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActive
                              ? 'bg-primary-soft text-primary font-medium shadow-sm'
                              : 'text-muted-foreground hover:bg-secondary-soft hover:text-foreground'
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <span className="text-sm font-medium">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: menuItems.length * 0.1 }}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => signout({ refresh_token: authentication.refreshToken })}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-200 text-muted-foreground hover:bg-accent-soft hover:text-foreground"
                    >
                      <LogOut className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">Logout</span>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}