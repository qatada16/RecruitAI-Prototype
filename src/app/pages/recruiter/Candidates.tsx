import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, ChevronDown, ChevronUp, ChevronsUpDown, Star, X, Download } from 'lucide-react';
import { candidates } from '../../data/mockData';

function getScoreColor(score: number) {
  if (score >= 80) return 'var(--success)';
  if (score >= 65) return 'var(--warning)';
  return 'var(--error)';
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  shortlisted: { label: 'Shortlisted', color: 'var(--accent)', bg: 'var(--bg-elevated)' },
  under_review: { label: 'Under Review', color: 'var(--warning)', bg: 'var(--warning-bg)' },
  rejected: { label: 'Rejected', color: 'var(--error)', bg: 'var(--error-bg)' },
  hired: { label: 'Hired', color: 'var(--success)', bg: 'var(--success-bg)' },
};

const roles = ['All Roles', 'Senior Frontend Engineer', 'Backend Engineer', 'Full Stack Developer', 'DevOps Engineer'];
const rounds = ['All Rounds', 'Coding', 'Voice', 'All'];

export default function Candidates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [roundFilter, setRoundFilter] = useState('All Rounds');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = candidates
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'All Roles' || c.role === roleFilter;
      return matchSearch && matchRole;
    })
    .sort((a, b) =>
      sortDir === 'desc' ? b.overallScore - a.overallScore : a.overallScore - b.overallScore
    );

  const allSelected = filtered.length > 0 && filtered.every(c => selected.has(c.id));
  const someSelected = filtered.some(c => selected.has(c.id));

  function toggleAll() {
    if (allSelected) {
      setSelected(prev => {
        const next = new Set(prev);
        filtered.forEach(c => next.delete(c.id));
        return next;
      });
    } else {
      setSelected(prev => {
        const next = new Set(prev);
        filtered.forEach(c => next.add(c.id));
        return next;
      });
    }
  }

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  const selectedCount = selected.size;

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Candidate Ranking Leaderboard
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{filtered.length} candidates across all roles</p>
      </div>

      {/* Filter bar */}
      <div
        className="rounded-lg p-4 border mb-4 flex items-center gap-3 flex-wrap"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
      >
        {/* Search */}
        <div className="relative flex-1 min-w-0 sm:min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search candidate nameâ€¦"
            className="w-full pl-8 pr-3 py-2 text-sm rounded border outline-none"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-elevated)' }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.backgroundColor = 'var(--bg-surface)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.backgroundColor = 'var(--bg-elevated)'; }}
          />
        </div>

        {/* Role filter */}
        <div className="relative w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="appearance-none w-full sm:w-auto pl-3 pr-7 py-2 text-sm rounded border outline-none cursor-pointer"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-elevated)' }}
          >
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
        </div>

        {/* Round filter */}
        <div className="relative w-full sm:w-auto">
          <select
            value={roundFilter}
            onChange={e => setRoundFilter(e.target.value)}
            className="appearance-none w-full sm:w-auto pl-3 pr-7 py-2 text-sm rounded border outline-none cursor-pointer"
            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-elevated)' }}
          >
            {rounds.map(r => <option key={r}>{r}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
        </div>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {filtered.map((c, i) => {
          const status = statusConfig[c.status];
          const isSelected = selected.has(c.id);
          return (
            <div
              key={c.id}
              className="rounded-lg p-4 border transition-colors"
              style={{
                backgroundColor: isSelected ? 'var(--accent-active)' : 'var(--bg-surface)',
                borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleOne(c.id)}
                  className="cursor-pointer w-4 h-4 rounded flex-shrink-0"
                  style={{ accentColor: 'var(--accent)' }}
                  aria-label={`Select ${c.name}`}
                />
                <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>#{i + 1}</span>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {c.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{c.role}</p>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded flex-shrink-0"
                  style={{ color: status.color, backgroundColor: status.bg }}
                >
                  {status.label}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[
                  { label: 'CV', score: c.cvScore },
                  { label: 'Code', score: c.codingScore },
                  { label: 'Comm', score: c.communicationScore },
                  { label: 'Overall', score: c.overallScore },
                ].map(({ label, score }) => (
                  <div key={label} className="text-center p-2 rounded" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                    <p className="text-sm font-semibold" style={{ color: getScoreColor(score) }}>{score}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/recruiter/candidates/${c.id}`)}
                  className="flex-1 text-xs py-2 rounded border transition-colors cursor-pointer text-center"
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                >
                  View Profile
                </button>
                <button
                  onClick={() => navigate(`/recruiter/candidates/${c.id}/cv`)}
                  className="flex-1 text-xs py-2 rounded border transition-colors cursor-pointer text-center"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-elevated)' }}
                >
                  View CV
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div
        className="rounded-lg border overflow-hidden hidden md:block"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-elevated)' }}>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={el => { if (el) el.indeterminate = someSelected && !allSelected; }}
                  onChange={toggleAll}
                  className="cursor-pointer w-4 h-4 rounded"
                  style={{ accentColor: 'var(--accent)' }}
                  aria-label="Select all candidates"
                />
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Rank
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Candidate
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Applied Role
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                CV Score
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Coding
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Communication
              </th>
              <th
                className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
              >
                <span className="flex items-center gap-1">
                  Overall
                  {sortDir === 'desc' ? <ChevronDown size={12} /> : sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronsUpDown size={12} />}
                </span>
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => {
              const status = statusConfig[c.status];
              const isSelected = selected.has(c.id);
              return (
                <tr
                  key={c.id}
                  className="border-t transition-colors"
                  style={{ borderColor: 'var(--border)', backgroundColor: isSelected ? 'var(--accent-active)' : '' }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
                >
                  <td className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleOne(c.id)}
                      className="cursor-pointer w-4 h-4 rounded"
                      style={{ accentColor: 'var(--accent)' }}
                      aria-label={`Select ${c.name}`}
                    />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      #{i + 1}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                        style={{ backgroundColor: 'var(--accent)' }}
                      >
                        {c.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {c.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{c.role}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold" style={{ color: getScoreColor(c.cvScore) }}>
                      {c.cvScore}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold" style={{ color: getScoreColor(c.codingScore) }}>
                      {c.codingScore}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold" style={{ color: getScoreColor(c.communicationScore) }}>
                      {c.communicationScore}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold" style={{ color: getScoreColor(c.overallScore) }}>
                      {c.overallScore}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{ color: status.color, backgroundColor: status.bg }}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/recruiter/candidates/${c.id}`)}
                        className="text-xs px-3 py-1.5 rounded border transition-colors cursor-pointer"
                        style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-elevated)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => navigate(`/recruiter/candidates/${c.id}/cv`)}
                        className="text-xs px-3 py-1.5 rounded border transition-colors cursor-pointer"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-elevated)' }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-hover)';
                          (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                          (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                        }}
                      >
                        View CV
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Floating action bar */}
      {selectedCount > 0 && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl border"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-hover)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
            animation: 'slideUp 0.2s ease',
          }}
        >
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {selectedCount} selected
          </span>
          <div className="w-px h-5" style={{ backgroundColor: 'var(--border)' }} />
          <button
            onClick={() => alert(`Shortlisting ${selectedCount} candidate(s)…`)}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-all"
            style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-active)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-subtle)'; }}
          >
            <Star size={14} />
            Shortlist Selected
          </button>
          <button
            onClick={() => alert(`Rejecting ${selectedCount} candidate(s)…`)}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-all"
            style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            <X size={14} />
            Reject Selected
          </button>
          <button
            onClick={() => alert(`Exporting ${selectedCount} candidate(s)…`)}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-all"
            style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
            }}
          >
            <Download size={14} />
            Export Selected
          </button>
          <button
            onClick={clearSelection}
            aria-label="Clear selection"
            className="p-1.5 rounded-lg cursor-pointer transition-all"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-surface)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(20px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
