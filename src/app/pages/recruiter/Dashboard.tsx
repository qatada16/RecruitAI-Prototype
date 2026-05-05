import { useNavigate } from 'react-router';
import { Briefcase, Users, Mic, Award, TrendingUp } from 'lucide-react';
import { recentActivity } from '../../data/mockData';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import { useIsMobile } from '../../components/common/useMediaQuery';

function getScoreColor(score: number) {
  if (score >= 80) return 'var(--success)';
  if (score >= 65) return 'var(--warning)';
  return 'var(--error)';
}

const kpiCards = [
  { label: 'Active Job Postings',   value: 4,   icon: Briefcase, change: '+1 this week' },
  { label: 'Total Applicants',      value: 159, icon: Users,     change: '+12 this week' },
  { label: 'Interviews Completed',  value: 63,  icon: Mic,       change: '+8 this week' },
  { label: 'Candidates Ranked',     value: 41,  icon: Award,     change: '+5 this week' },
];

const funnelStages = [
  { label: 'Resumes Received',   count: 159, pct: 100 },
  { label: 'Resumes Processed',  count: 134, pct: 84  },
  { label: 'Interview Done',     count: 63,  pct: 40  },
  { label: 'Ranked',             count: 41,  pct: 26  },
];

const funnelColors = ['var(--accent)', 'var(--accent-hover)', 'var(--success)', 'var(--warning)'];

export default function Dashboard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', fontWeight: 600, color: 'var(--text-primary)' }}>
          Recruitment Overview
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Here's what's happening with your hiring pipeline.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {kpiCards.map(({ label, value, icon: Icon, change }) => (
          <div
            key={label}
            className="rounded-lg p-5 ra-card-interactive"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderTop: '3px solid var(--accent)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                <p
                  className="ra-tabular"
                  style={{
                    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                  }}
                >
                  <AnimatedCounter value={value} />
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent-subtle)' }}
              >
                <Icon size={17} style={{ color: 'var(--accent)' }} />
              </div>
            </div>
            <p className="text-xs inline-flex items-center gap-1" style={{ color: 'var(--success)' }}>
              <TrendingUp size={11} /> {change}
            </p>
          </div>
        ))}
      </div>

      {/* Recruitment Funnel */}
      <div
        className="rounded-lg p-5 sm:p-6 mb-6"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <h2 className="mb-5" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Recruitment Funnel
        </h2>
        <div className="space-y-3">
          {funnelStages.map((stage, i) => (
            <div key={stage.label} className="flex items-center gap-2 sm:gap-4">
              <span
                className="text-xs sm:text-sm w-24 sm:w-40 flex-shrink-0"
                style={{ color: 'var(--text-secondary)' }}
              >
                {stage.label}
              </span>
              <div
                className="flex-1 h-7 rounded-md relative overflow-hidden"
                style={{ backgroundColor: 'var(--bg-elevated)' }}
              >
                <div
                  className="h-full rounded-md flex items-center px-3"
                  style={{
                    width: `${stage.pct}%`,
                    backgroundColor: funnelColors[i],
                    transition: 'width 0.6s ease-out',
                  }}
                >
                  <span className="text-white text-xs font-medium ra-tabular">
                    <AnimatedCounter value={stage.count} />
                  </span>
                </div>
              </div>
              <span
                className="text-sm w-10 text-right ra-tabular"
                style={{ color: 'var(--text-secondary)' }}
              >
                {stage.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div className="px-5 sm:px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Recent Activity
          </h2>
          <button
            onClick={() => navigate('/recruiter/candidates')}
            className="text-xs cursor-pointer"
            style={{ color: 'var(--accent)' }}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
          >
            View all →
          </button>
        </div>

        {isMobile ? (
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {recentActivity.map((row, i) => (
              <button
                key={i}
                onClick={() => navigate('/recruiter/candidates')}
                className="w-full text-left px-5 py-4 cursor-pointer"
                style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--accent-subtle)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    {row.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-sm font-medium flex-1" style={{ color: 'var(--text-primary)' }}>
                    {row.name}
                  </span>
                  <span
                    className="text-sm font-semibold ra-tabular"
                    style={{ color: getScoreColor(row.score) }}
                  >
                    {row.score}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: 'var(--text-secondary)' }}>{row.role}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{row.date}</span>
                </div>
                <span
                  className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full"
                  style={{
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {row.stage}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-elevated)' }}>
                  {['Candidate', 'Job Role', 'Stage', 'Score', 'Date'].map(h => (
                    <th
                      key={h}
                      className="px-4 sm:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((row, i) => (
                  <tr
                    key={i}
                    className="cursor-pointer"
                    style={{ borderTop: '1px solid var(--border)' }}
                    onClick={() => navigate('/recruiter/candidates')}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--accent-subtle)'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <td className="px-4 sm:px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                          style={{ backgroundColor: 'var(--accent)' }}
                        >
                          {row.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {row.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{row.role}</td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                      >
                        {row.stage}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <span className="text-sm font-semibold ra-tabular" style={{ color: getScoreColor(row.score) }}>
                        {row.score}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
