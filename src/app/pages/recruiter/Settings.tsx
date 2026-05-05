import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { cvKeywordRules } from '../../data/mockData';

// â”€â”€â”€ Job Posting Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function JobPostingTab() {
  const [weights, setWeights] = useState({ cv: 35, coding: 40, voice: 25 });
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js']);
  const [skillInput, setSkillInput] = useState('');
  const [questions, setQuestions] = useState([
    'Describe your most technically challenging project.',
    'How do you approach debugging a performance issue in production?',
    'Tell me about a time you had to learn a new technology quickly.',
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  const total = weights.cv + weights.coding + weights.voice;

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      setSkills(s => [...s, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions(q => [...q, newQuestion.trim()]);
      setNewQuestion('');
    }
  };

  const setWeight = (key: keyof typeof weights, val: number) => {
    setWeights(w => ({ ...w, [key]: val }));
  };

  return (
    <div className="space-y-5">
      {/* Job Details */}
      <div
        className="rounded-lg p-6 border"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
      >
        <h3 className="mb-5" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Job Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              Job Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-3 py-2.5 text-sm rounded border outline-none"
              style={{ borderColor: 'var(--border-input)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-header)' }}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.backgroundColor = 'var(--bg-surface)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border-input)'; e.target.style.backgroundColor = 'var(--bg-header)'; }}
            />
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              Department
            </label>
            <select
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded border outline-none appearance-none cursor-pointer"
              style={{ borderColor: 'var(--border-input)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-header)' }}
            >
              {['Engineering', 'Product', 'Design', 'Infrastructure', 'Data Science'].map(d => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              Required Skills
            </label>
            <div
              className="flex flex-wrap gap-1.5 p-2 rounded border min-h-10"
              style={{ borderColor: 'var(--border-input)', backgroundColor: 'var(--bg-header)' }}
            >
              {skills.map(s => (
                <span
                  key={s}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded border"
                  style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  {s}
                  <button
                    onClick={() => setSkills(sk => sk.filter(x => x !== s))}
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                placeholder="Add skill, press Enter…"
                className="text-sm outline-none border-none flex-1 min-w-24 px-1 bg-transparent"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Weights */}
      <div
        className="rounded-lg p-6 border"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Assessment Weights
          </h3>
          <span
            className="text-sm font-semibold"
            style={{ color: total === 100 ? 'var(--success)' : 'var(--error)' }}
          >
            Total: {total}%
          </span>
        </div>
        <p className="text-xs mb-5" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>Weights must add up to 100%.</p>
        <div className="space-y-4">
          {[
            { key: 'cv' as const, label: 'CV Score Weight' },
            { key: 'coding' as const, label: 'Coding Score Weight' },
            { key: 'voice' as const, label: 'Voice Score Weight' },
          ].map(({ key, label }) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {label}
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={weights[key]}
                    onChange={e => setWeight(key, Number(e.target.value))}
                    className="w-14 text-center px-2 py-1 text-sm rounded border outline-none"
                    style={{ borderColor: 'var(--border-input)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-header)' }}
                    onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.backgroundColor = 'var(--bg-surface)'; }}
                    onBlur={e => { e.target.style.borderColor = 'var(--border-input)'; e.target.style.backgroundColor = 'var(--bg-header)'; }}
                  />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>%</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={weights[key]}
                onChange={e => setWeight(key, Number(e.target.value))}
                className="w-full cursor-pointer"
                style={{ accentColor: 'var(--accent)' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Question Bank */}
      <div
        className="rounded-lg p-6 border"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
      >
        <h3 className="mb-4" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Interview Question Bank
        </h3>
        <div className="space-y-2 mb-4">
          {questions.map((q, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded border"
              style={{ borderColor: 'var(--border)' }}
            >
              <span className="text-xs font-medium mt-0.5 flex-shrink-0" style={{ color: 'var(--text-secondary)' }}>
                Q{i + 1}
              </span>
              <span className="flex-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{q}</span>
              <button
                onClick={() => setQuestions(qs => qs.filter((_, j) => j !== i))}
                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            placeholder="Add a new interview question…"
            className="flex-1 px-3 py-2 text-sm rounded border outline-none"
            style={{ borderColor: 'var(--border-input)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-header)' }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.backgroundColor = 'var(--bg-surface)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-input)'; e.target.style.backgroundColor = 'var(--bg-header)'; }}
            onKeyDown={e => e.key === 'Enter' && addQuestion()}
          />
          <button
            onClick={addQuestion}
            className="px-3 py-2 text-white rounded flex items-center gap-1 text-sm transition-colors cursor-pointer"
            style={{ backgroundColor: 'var(--accent)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-hover)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent)'; }}
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      <button
        className="px-6 py-2.5 text-sm text-white rounded transition-colors cursor-pointer"
        style={{ backgroundColor: 'var(--accent)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-hover)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent)'; }}
      >
        Save & Publish
      </button>
    </div>
  );
}

// â”€â”€â”€ CV Parsing Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CVParsingTab() {
  const [rules, setRules] = useState(cvKeywordRules);
  const [showAdd, setShowAdd] = useState(false);
  const [newRule, setNewRule] = useState({ skill: '', department: 'Engineering', weight: 'Medium' });

  const toggleActive = (id: string) => {
    setRules(rs => rs.map(r => (r.id === id ? { ...r, active: !r.active } : r)));
  };

  const addRule = () => {
    if (!newRule.skill.trim()) return;
    setRules(rs => [
      ...rs,
      { id: String(Date.now()), ...newRule, active: true },
    ]);
    setNewRule({ skill: '', department: 'Engineering', weight: 'Medium' });
    setShowAdd(false);
  };

  const weightColor: Record<string, string> = {
    High: 'var(--accent)',
    Medium: 'var(--warning)',
    Low: 'var(--text-secondary)',
  };

  return (
    <div>
      <div
        className="rounded-lg border overflow-hidden"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              CV Parsing Keyword Rules
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)', opacity: 0.6 }}>
              Configure which skills and keywords affect candidate CV scores.
            </p>
          </div>
          <button
            onClick={() => setShowAdd(s => !s)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-white rounded transition-colors cursor-pointer"
            style={{ backgroundColor: 'var(--accent)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-hover)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent)'; }}
          >
            <Plus size={13} />
            Add New Rule
          </button>
        </div>

        {/* Add rule row */}
        {showAdd && (
          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-5 py-3 border-b"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}
          >
            <input
              type="text"
              value={newRule.skill}
              onChange={e => setNewRule(r => ({ ...r, skill: e.target.value }))}
              placeholder="Skill / Keyword"
              className="flex-1 px-3 py-2 text-sm rounded border outline-none"
              style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border-input)', color: 'var(--text-primary)' }}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border-input)'; }}
            />
            <select
              value={newRule.department}
              onChange={e => setNewRule(r => ({ ...r, department: e.target.value }))}
              className="px-3 py-2 text-sm rounded border outline-none appearance-none cursor-pointer"
              style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border-input)', color: 'var(--text-primary)' }}
            >
              {['Engineering', 'Frontend Engineering', 'Backend Engineering', 'DevOps', 'Infrastructure', 'Product'].map(d => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select
              value={newRule.weight}
              onChange={e => setNewRule(r => ({ ...r, weight: e.target.value }))}
              className="px-3 py-2 text-sm rounded border outline-none appearance-none cursor-pointer"
              style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border-input)', color: 'var(--text-primary)' }}
            >
              {['High', 'Medium', 'Low'].map(w => <option key={w}>{w}</option>)}
            </select>
            <button
              onClick={addRule}
              className="px-4 py-2 text-sm text-white rounded cursor-pointer transition-colors"
              style={{ backgroundColor: 'var(--success)' }}
            >
              Save
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-3 py-2 text-sm rounded border cursor-pointer transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-elevated)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              Cancel
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-elevated)' }}>
              {['Skill / Keyword', 'Department', 'Weight / Priority', 'Active'].map(h => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rules.map(rule => (
              <tr
                key={rule.id}
                className="border-t"
                style={{ borderColor: 'var(--border)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
              >
                <td className="px-4 py-3 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {rule.skill}
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{rule.department}</td>
                <td className="px-4 py-3">
                  <span
                    className="text-xs font-medium"
                    style={{ color: weightColor[rule.weight] }}
                  >
                    {rule.weight}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(rule.id)}
                    className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer"
                    style={{ backgroundColor: rule.active ? 'var(--accent)' : 'var(--bg-elevated)' }}
                  >
                    <span
                      className="inline-block w-3.5 h-3.5 rounded-full bg-white transition-transform"
                      style={{ transform: rule.active ? 'translateX(18px)' : 'translateX(2px)' }}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Main Settings Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function Settings() {
  const [tab, setTab] = useState<'job-posting' | 'cv-parsing'>('job-posting');

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--text-primary)' }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Configure job postings, assessments, and parsing rules.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
        {[
          { key: 'job-posting', label: 'Job Posting & Assessment Creator' },
          { key: 'cv-parsing', label: 'CV Parsing Rules' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as typeof tab)}
            className="px-4 sm:px-5 py-3 text-sm transition-colors border-b-2 -mb-px cursor-pointer whitespace-nowrap"
            style={{
              borderColor: tab === key ? 'var(--accent)' : 'transparent',
              color: tab === key ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: tab === key ? 500 : 400,
            }}
            onMouseEnter={e => {
              if (tab !== key) (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
            }}
            onMouseLeave={e => {
              if (tab !== key) (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'job-posting' ? <JobPostingTab /> : <CVParsingTab />}
    </div>
  );
}
