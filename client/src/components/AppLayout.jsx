import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { LayoutDashboard, Settings as SettingsIcon, Moon, Sun, Activity } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme.jsx';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function AppLayout({ children }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <NavLink to={'/'} className="flex h-16 items-center gap-2 border-b border-border px-6">
          <img src="/logo.png" className='w-10' alt='cornwatch app logo for detecting api endpoint failed'/>
          <span className="font-semibold">CronWatch</span>
        </NavLink>

        <nav className="flex-1 space-y-1 p-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-4 md:px-8">
<NavLink to={'/'} className="flex h-16 items-center gap-2 border-b border-border px-6">
          <img src="/logo.png" className='w-10' alt='cornwatch app logo for detecting api endpoint failed'/>
          <span className="font-semibold">CronWatch</span>
        </NavLink>
          <div className="ml-auto flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>

        <nav className="flex items-center justify-around border-t border-border bg-card p-2 md:hidden">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-md px-3 py-1.5 text-xs',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
