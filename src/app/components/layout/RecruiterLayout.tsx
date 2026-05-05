import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import {
  LayoutDashboard, Users, Mic, Code2, Settings, LogOut, Bell, Menu, X,
  ChevronLeft, ChevronRight, HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import PageTransition from '../common/PageTransition';
import { useIsMobile } from '../common/useMediaQuery';
import { toast } from 'sonner';

const navItems = [
  { label: 'Dashboard',   icon: LayoutDashboard, to: '/recruiter' },
  { label: 'Candidates',  icon: Users,           to: '/recruiter/candidates' },
  { label: 'Interviews',  icon: Mic,             to: '/recruiter/interviews' },
  { label: 'Assessments', icon: Code2,           to: '/recruiter/assessments' },
  { label: 'Settings',    icon: Settings,        to: '/recruiter/settings' },
];

const SIDEBAR_KEY = 'recruitai_sidebar_collapsed';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function RecruiterLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try { return localStorage.getItem(SIDEBAR_KEY) === '1'; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0'); } catch {}
  }, [collapsed]);

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/');
  };

  const sidebarWidth = collapsed ? 64 : 240;

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: 'var(--backdrop)' }}
          onClick={closeSidebar}
        />
      )}

      {/* Desktop / tablet sidebar */}
      {!isMobile && (
        <aside
          className="flex flex-col h-full flex-shrink-0"
          style={{
            width: sidebarWidth,
            backgroundColor: 'var(--bg-sidebar)',
            borderRight: '1px solid var(--border)',
            transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          {/* Logo */}
          <div
            className="px-4 py-4 flex items-center"
            style={{ borderBottom: '1px solid var(--border)', minHeight: 60 }}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <span className="text-white text-sm font-semibold">R</span>
              </div>
              {!collapsed && (
                <span
                  className="text-base font-semibold tracking-tight whitespace-nowrap"
                  style={{ color: 'var(--sidebar-text)' }}
                >
                  RecruitAI
                </span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/recruiter'}
                title={collapsed ? label : undefined}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm cursor-pointer"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--accent)' : 'var(--sidebar-text-muted)',
                  backgroundColor: isActive ? 'rgba(79,142,247,0.18)' : 'transparent',
                  fontWeight: isActive ? 500 : 400,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                })}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  if (el.style.backgroundColor === 'transparent' || el.style.backgroundColor === '') {
                    el.style.backgroundColor = 'rgba(79,142,247,0.12)';
                    el.style.color = 'var(--sidebar-text)';
                  }
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  const hasActive = el.getAttribute('aria-current') === 'page';
                  if (!hasActive) {
                    el.style.backgroundColor = 'transparent';
                    el.style.color = 'var(--sidebar-text-muted)';
                  }
                }}
              >
                <Icon size={17} className="flex-shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">{label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* Collapse toggle */}
          <div className="px-2 pb-2">
            <button
              onClick={() => setCollapsed(c => !c)}
              className="w-full flex items-center justify-center py-2 rounded-md cursor-pointer"
              style={{
                color: 'var(--sidebar-text-muted)',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.09)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--sidebar-text)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--sidebar-text-muted)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
              }}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* User at bottom */}
          <div className="px-2 py-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-2 py-2`}>
              <button
                onClick={() => navigate('/recruiter/profile')}
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold cursor-pointer"
                style={{ backgroundColor: 'var(--accent)' }}
                title="View profile"
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; }}
                aria-label="View profile"
              >
                {user ? getInitials(user.name) : 'U'}
              </button>
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--sidebar-text)' }}>
                      {user?.name || 'Recruiter'}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--sidebar-text-muted)' }}>
                      {user?.email || ''}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer p-1.5 rounded-md"
                    style={{ color: 'var(--sidebar-text-muted)' }}
                    title="Log out"
                    aria-label="Log out"
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#F2605C';
                      e.currentTarget.style.backgroundColor = 'rgba(242,96,92,0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'var(--sidebar-text-muted)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <LogOut size={15} />
                  </button>
                </>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* Mobile slide-in sidebar */}
      {isMobile && sidebarOpen && (
        <aside
          className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col"
          style={{ backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)' }}
        >
          <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent)' }}>
                <span className="text-white text-sm font-semibold">R</span>
              </div>
              <span className="text-base font-semibold" style={{ color: 'var(--sidebar-text)' }}>RecruitAI</span>
            </div>
            <button onClick={closeSidebar} className="cursor-pointer rounded-md p-1" style={{ color: 'var(--sidebar-text-muted)' }} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/recruiter'}
                onClick={closeSidebar}
                className="flex items-center gap-3 px-3 py-3 rounded-md text-sm cursor-pointer"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--accent)' : 'var(--sidebar-text-muted)',
                  backgroundColor: isActive ? 'rgba(79,142,247,0.18)' : 'transparent',
                })}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="px-2 py-3" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer"
              style={{ color: 'var(--sidebar-text-muted)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#F2605C'; e.currentTarget.style.backgroundColor = 'rgba(242,96,92,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--sidebar-text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <LogOut size={15} /> Log out
            </button>
          </div>
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header bar */}
        <header
          className="h-14 flex items-center justify-between px-4 sm:px-6 flex-shrink-0"
          style={{ backgroundColor: 'var(--bg-header)', borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="cursor-pointer rounded-md p-2"
                style={{ color: 'var(--text-secondary)' }}
                aria-label="Open menu"
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--accent-subtle)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Menu size={20} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              className="w-9 h-9 rounded-full hidden sm:inline-flex items-center justify-center cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Help"
              title="Help & FAQ"
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--accent-subtle)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <HelpCircle size={17} />
            </button>
            <button
              className="relative w-9 h-9 rounded-full inline-flex items-center justify-center cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Notifications"
              title="Notifications"
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--accent-subtle)';
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <Bell size={17} />
              <span
                className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--accent)' }}
              />
            </button>
            <button
              onClick={() => navigate('/recruiter/profile')}
              className="ml-1 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
              style={{ backgroundColor: 'var(--accent)' }}
              title="View profile"
              aria-label="View profile"
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; }}
            >
              {user ? getInitials(user.name) : 'U'}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ paddingBottom: isMobile ? 64 : 0 }}
        >
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>

        {/* Mobile bottom tab bar */}
        {isMobile && (
          <nav
            className="fixed bottom-0 left-0 right-0 z-30 flex items-stretch"
            style={{
              backgroundColor: 'var(--bg-sidebar)',
              borderTop: '1px solid var(--border)',
              height: 60,
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            {navItems.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/recruiter'}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 cursor-pointer"
                style={({ isActive }) => ({
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: 10,
                })}
                aria-label={label}
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
