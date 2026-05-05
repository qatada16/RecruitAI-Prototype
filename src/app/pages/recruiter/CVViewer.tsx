import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Mail, Phone, Calendar, FileText } from 'lucide-react';
import { candidates } from '../../data/mockData';

export default function CVViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const candidate = candidates.find(c => c.id === id) || candidates[0];
  const initials = candidate.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="p-4 sm:p-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/recruiter/candidates')}
        className="flex items-center gap-1.5 text-sm mb-6 transition-colors cursor-pointer"
        style={{ color: 'var(--text-secondary)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; }}
      >
        <ArrowLeft size={15} />
        ← Back to Candidates
      </button>

      {/* CV Document */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: '0 2px 12px rgba(124,106,239,0.08)' }}
      >
        {/* CV Header bar */}
        <div
          className="px-4 sm:px-8 py-5 flex items-center gap-3 border-b"
          style={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border-input)' }}
        >
          <FileText size={16} style={{ color: 'var(--text-primary)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Curriculum Vitae — {candidate.name}
          </span>
        </div>

        <div className="px-4 sm:px-10 py-6 sm:py-8">
          {/* Candidate Header */}
          <div className="flex flex-col sm:flex-row items-start gap-5 mb-8 pb-8 border-b" style={{ borderColor: 'var(--border)' }}>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold flex-shrink-0"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {initials}
            </div>
            <div className="flex-1">
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {candidate.name}
              </h1>
              <p className="mt-0.5" style={{ fontSize: '1rem', color: 'var(--accent)' }}>
                {candidate.role}
              </p>
              <div className="flex flex-wrap gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Mail size={13} style={{ color: 'var(--accent-hover)' }} />
                  {candidate.email}
                </span>
                <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Phone size={13} style={{ color: 'var(--accent-hover)' }} />
                  {candidate.phone}
                </span>
                <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Calendar size={13} style={{ color: 'var(--accent-hover)' }} />
                  Applied: {candidate.appliedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Education */}
          <section className="mb-8">
            <h2
              className="mb-4 pb-1.5 border-b"
              style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', borderColor: 'var(--accent)', borderBottomWidth: 2 }}
            >
              EDUCATION
            </h2>
            <div className="space-y-5">
              {candidate.education.map((e, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center pt-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: 'var(--accent)' }}
                    />
                    {i < candidate.education.length - 1 && (
                      <div className="w-px flex-1 mt-1.5" style={{ backgroundColor: 'var(--bg-elevated)', minHeight: 20 }} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-0.5">
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--accent)', fontWeight: 500 }}
                      >
                        {e.year}
                      </span>
                    </div>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
                      {e.degree}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{e.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Work Experience */}
          <section className="mb-8">
            <h2
              className="mb-4 pb-1.5 border-b"
              style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', borderColor: 'var(--accent)', borderBottomWidth: 2 }}
            >
              WORK EXPERIENCE
            </h2>
            <div className="space-y-6">
              {candidate.experience.map((e, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center pt-1">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: 'var(--accent-hover)' }}
                    />
                    {i < candidate.experience.length - 1 && (
                      <div className="w-px flex-1 mt-1.5" style={{ backgroundColor: 'var(--bg-elevated)', minHeight: 20 }} />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-start justify-between mb-0.5">
                      <p className="font-semibold" style={{ color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
                        {e.title}
                      </p>
                      <span
                        className="text-xs px-2 py-0.5 rounded ml-3 flex-shrink-0"
                        style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
                      >
                        {e.year}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1.5" style={{ color: 'var(--accent)' }}>{e.company}</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2
              className="mb-4 pb-1.5 border-b"
              style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', borderColor: 'var(--accent)', borderBottomWidth: 2 }}
            >
              SKILLS
            </h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map(skill => (
                <span
                  key={skill}
                  className="text-sm px-3 py-1.5 rounded border transition-colors"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
