import { Home, Mic, Rocket, Users, FileText, Settings, LogOut, Brain } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Speech Therapy', url: '/therapy', icon: Mic },
  { title: 'Speech Space', url: '/speech-space', icon: Rocket },
  { title: 'Social Skills', url: '/social', icon: Users },
  { title: 'Reports', url: '/reports', icon: FileText },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { signout, authentication, user } = useAuth();
  const isCollapsed = state === 'collapsed';
  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : 'A';
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User';

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-white/90 backdrop-blur-xl border-r border-white/60 shadow-xl flex flex-col">
        {/* Logo area */}
        <div className={`flex items-center gap-3 px-5 py-5 border-b border-muted/20 ${isCollapsed ? 'justify-center px-3' : ''}`}>
          <div className="p-2 bg-gradient-to-br from-primary to-primary-soft rounded-xl shadow-md flex-shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-extrabold text-foreground tracking-tight">Autimate</span>
          )}
        </div>

        {/* Nav items */}
        <SidebarGroup className="flex-1 py-4">
          {!isCollapsed && (
            <p className="px-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Navigation
            </p>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <div key={item.title}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                            isActive
                              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 font-semibold'
                              : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                          } ${isCollapsed ? 'justify-center' : ''}`}
                        >
                          <item.icon className={`h-4.5 w-4.5 flex-shrink-0 transition-transform duration-200 ${!isActive && 'group-hover:scale-110'}`} />
                          {!isCollapsed && (
                            <span className="text-sm">{item.title}</span>
                          )}
                          {!isCollapsed && isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/70" />
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User + Logout */}
        <div className="p-3 border-t border-muted/20 space-y-1">
          {!isCollapsed && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-soft flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{fullName}</p>
                <p className="text-[11px] text-muted-foreground">Therapist Account</p>
              </div>
            </div>
          )}
          <button
            onClick={() => signout({ refresh_token: authentication.refreshToken })}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-all duration-200 text-muted-foreground hover:bg-rose-50 hover:text-rose-600 group ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
            {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}