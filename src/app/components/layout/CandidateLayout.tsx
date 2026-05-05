import { Outlet, useNavigate, useLocation } from 'react-router';
import { LogOut, HelpCircle, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import PageTransition from '../common/PageTransition';
import { toast } from 'sonner';

const stages = [
  { label: 'Voice Interview', path: '/candidate/voice-interview' },
  { label: 'Coding Test',     path: '/candidate/coding-test' },
  { label: 'System Design',   path: '/candidate/system-design' },
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function CandidateLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/');
  };

  const isLobby = location.pathname === '/candidate' || location.pathname === '/candidate/';
  const isConfirmation = location.pathname === '/candidate/confirmation';
  const isProfile = location.pathname === '/candidate/profile';
  const isJobs = location.pathname === '/candidate/jobs';

  const currentStageIndex = stages.findIndex(s => location.pathname.startsWith(s.path));

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-base)' }}>
      <header
        style={{
          backgroundColor: 'var(--bg-header)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/candidate')}
            className="flex items-center gap-2 cursor-pointer rounded-md"
            aria-label="RecruitAI home"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <span className="text-white text-sm font-semibold">R</span>
            </div>
            <span className="text-base font-semibold hidden sm:inline" style={{ color: 'var(--text-primary)' }}>
              RecruitAI
            </span>
          </button>

          {!isLobby && !isConfirmation && !isProfile && !isJobs && (
            <div className="hidden sm:flex items-center gap-2">
              {stages.map((stage, i) => (
                <div key={stage.path} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                      style={
                        i === currentStageIndex
                          ? { backgroundColor: 'var(--accent)', color: '#fff' }
                          : i < currentStageIndex
                          ? { backgroundColor: 'var(--success)', color: '#fff' }
                          : { backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)' }
                      }
                    >
                      {i + 1}
                    </div>
                    <span
                      className="text-sm hidden md:inline"
                      style={{
                        color:
                          i === currentStageIndex ? 'var(--text-primary)' :
                          i < currentStageIndex ? 'var(--success)' : 'var(--text-secondary)',
                      }}
                    >
                      {stage.label}
                    </span>
                  </div>
                  {i < stages.length - 1 && (
                    <div className="w-6 h-px" style={{ backgroundColor: 'var(--border)' }} />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate('/candidate/jobs')}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-all mr-1"
              style={{
                backgroundColor: isJobs ? 'var(--accent-subtle)' : 'transparent',
                color: isJobs ? 'var(--accent)' : 'var(--text-secondary)',
                border: `1px solid ${isJobs ? 'var(--accent)' : 'transparent'}`,
              }}
              aria-label="Browse open positions"
              onMouseEnter={e => { if (!isJobs) { e.currentTarget.style.backgroundColor = 'var(--accent-subtle)'; e.currentTarget.style.color = 'var(--accent)'; } }}
              onMouseLeave={e => { if (!isJobs) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
            >
              <Briefcase size={14} />
              Jobs
            </button>
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
              onClick={() => navigate('/candidate/profile')}
              className="ml-1 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
              style={{ backgroundColor: 'var(--accent)' }}
              title="View profile"
              aria-label="View profile"
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; }}
            >
              {user ? getInitials(user.name) : 'U'}
            </button>
            <button
              onClick={handleLogout}
              className="ml-1 cursor-pointer p-2 rounded-md"
              style={{ color: 'var(--text-secondary)' }}
              title="Log out"
              aria-label="Log out"
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--error)';
                e.currentTarget.style.backgroundColor = 'var(--error-bg)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>

      <footer
        className="px-4 sm:px-6 py-3 text-xs"
        style={{
          borderTop: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--bg-header)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span>© RecruitAI</span>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="hover:underline"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              Help &amp; FAQ
            </a>
            <a
              href="#"
              className="hover:underline"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
