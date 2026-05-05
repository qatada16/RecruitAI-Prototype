import { useNavigate } from 'react-router';
import { Mic, Code2, Layout, CheckCircle, Globe, Camera, AlertCircle, ExternalLink, Briefcase, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCandidateContext } from '../../context/CandidateContext';

function HardwareStatus({
  icon: Icon, label, ok, helpUrl,
}: { icon: any; label: string; ok: boolean; helpUrl?: string }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-md flex-wrap"
      style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)' }}
    >
      <Icon size={16} style={{ color: ok ? 'var(--success)' : 'var(--error)' }} />
      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{label}</span>
      <span
        className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
        style={{
          color: ok ? 'var(--success)' : 'var(--error)',
          backgroundColor: ok ? 'var(--success-bg)' : 'var(--error-bg)',
        }}
      >
        {ok ? '✓ Ready' : '✗ Not accessible'}
      </span>
      {!ok && helpUrl && (
        <a
          href={helpUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs inline-flex items-center gap-1 ml-1 underline"
          style={{ color: 'var(--accent)' }}
        >
          Check browser permissions <ExternalLink size={11} />
        </a>
      )}
    </div>
  );
}

type TaskStatus = 'not_started' | 'in_progress' | 'completed';

function TaskCard({
  icon: Icon,
  title,
  duration,
  status,
  disabled,
  disabledReason,
  onBegin,
}: {
  icon: any;
  title: string;
  duration: string;
  status: TaskStatus;
  disabled?: boolean;
  disabledReason?: string;
  onBegin: () => void;
}) {
  const statusConfig = {
    not_started: { label: 'Not Started', color: 'var(--text-secondary)', bg: 'var(--bg-elevated)' },
    in_progress: { label: 'In Progress', color: 'var(--warning)', bg: 'var(--warning-bg)' },
    completed: { label: 'Completed', color: 'var(--success)', bg: 'var(--success-bg)' },
  };
  const s = statusConfig[status];

  return (
    <div
      className="rounded-lg p-6 flex flex-col ra-card-interactive"
      style={{
        border: '1px solid var(--border)',
        borderTop: '3px solid var(--accent)',
        boxShadow: 'var(--shadow-card)',
        backgroundColor: 'var(--bg-surface)',
        opacity: disabled && status !== 'completed' ? 0.7 : 1,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-md flex items-center justify-center"
          style={{ backgroundColor: 'var(--accent-subtle)' }}
        >
          <Icon size={19} style={{ color: 'var(--accent)' }} />
        </div>
        {status === 'completed' ? (
          <CheckCircle size={18} style={{ color: 'var(--success)' }} />
        ) : (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ color: s.color, backgroundColor: s.bg }}
          >
            {s.label}
          </span>
        )}
      </div>
      <h3 className="mb-1" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>Est. {duration}</p>

      {status === 'completed' ? (
        <div className="mt-auto flex items-center gap-2 text-sm" style={{ color: 'var(--success)' }}>
          <CheckCircle size={14} />
          Submitted
        </div>
      ) : (
        <div className="mt-auto relative">
          <button
            onClick={onBegin}
            disabled={disabled}
            className="w-full py-2.5 text-sm font-medium text-white rounded-md disabled:cursor-not-allowed cursor-pointer"
            style={{
              backgroundColor: disabled ? 'var(--bg-elevated)' : 'var(--accent)',
              color: disabled ? 'var(--text-disabled)' : '#fff',
            }}
            title={disabled ? disabledReason : 'Start this section'}
            onMouseEnter={e => {
              if (!disabled) {
                e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={e => {
              if (!disabled) {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
            aria-describedby={disabled ? `disabled-${title}` : undefined}
          >
            Begin
          </button>
          {disabled && disabledReason && (
            <div
              id={`disabled-${title}`}
              className="mt-2 flex items-start gap-1.5 text-xs"
              style={{ color: 'var(--error)' }}
            >
              <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
              {disabledReason}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AssessmentLobby() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { voiceStatus, codingStatus, designStatus, micAvailable, setMicAvailable } =
    useCandidateContext();

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Welcome */}
      <div className="mb-8">
        <h1
          className="mb-1"
          style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}
        >
          Welcome back, {firstName}
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Applied for:{' '}
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            Senior Frontend Engineer
          </span>
        </p>
      </div>

      {/* Browse Jobs banner */}
      <div
        className="flex items-center justify-between gap-4 p-4 rounded-xl border mb-8 cursor-pointer transition-all"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-card)' }}
        onClick={() => navigate('/candidate/jobs')}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.backgroundColor = 'var(--accent-active)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--bg-surface)'; }}
        role="button"
        tabIndex={0}
        aria-label="Browse open positions"
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/candidate/jobs'); }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent-subtle)' }}>
            <Briefcase size={18} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Browse Open Positions</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>16 roles available at top Pakistani tech companies</p>
          </div>
        </div>
        <ArrowRight size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
      </div>

      {/* Hardware check */}
      <div
        className="rounded-lg p-5 mb-8"
        style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)', backgroundColor: 'var(--bg-surface)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            System Check
          </h2>
          <button
            onClick={() => setMicAvailable(v => !v)}
            className="text-xs cursor-pointer rounded-md px-2 py-1"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--accent)';
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
            title="Demo only — toggle simulated microphone state"
          >
            Toggle mic (demo)
          </button>
        </div>
        <div className="space-y-2">
          <HardwareStatus icon={Mic} label="Microphone" ok={micAvailable} helpUrl="chrome://settings/content/microphone" />
          <HardwareStatus icon={Globe} label="Browser Compatibility" ok={true} />
          <HardwareStatus icon={Camera} label="Camera" ok={true} />
        </div>
      </div>

      {/* Task cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <TaskCard
          icon={Mic}
          title="Voice Interview"
          duration="20 minutes"
          status={voiceStatus}
          disabled={!micAvailable}
          disabledReason="Microphone access required."
          onBegin={() => navigate('/candidate/voice-interview')}
        />
        <TaskCard
          icon={Code2}
          title="Coding Test"
          duration="45 minutes"
          status={codingStatus}
          onBegin={() => navigate('/candidate/coding-test')}
        />
        <TaskCard
          icon={Layout}
          title="System Design"
          duration="30 minutes"
          status={designStatus}
          onBegin={() => navigate('/candidate/system-design')}
        />
      </div>

      {/* Timeline note */}
      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-lg text-sm"
        style={{
          border: '1px solid var(--border)',
          backgroundColor: 'var(--accent-subtle)',
          color: 'var(--text-secondary)',
        }}
      >
        <AlertCircle size={15} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
        Your results will be reviewed by the recruiter within 48 hours. You'll receive an email
        notification once a decision has been made.
      </div>
    </div>
  );
}
