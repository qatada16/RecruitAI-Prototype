import { useNavigate } from 'react-router';
import { Mic, Code2, FileText, ArrowRight, CheckCircle, Briefcase, Users, Award, Layers } from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';

export default function Homepage() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Top navigation */}
      <header className="border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-header)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <span className="text-white text-sm font-semibold">R</span>
            </div>
            <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>RecruitAI</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm rounded border transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-subtle)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 text-sm text-white rounded transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--accent)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-hover)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent)'; }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-3xl text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded text-sm mb-6 border"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
          >
            <CheckCircle size={13} />
            Trusted by 500+ companies worldwide
          </div>
          <h1
            className="mb-4"
            style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}
          >
            Hire Smarter with AI-Powered Recruitment
          </h1>
          <p className="mb-2" style={{ fontSize: '1.125rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Automate your entire hiring pipeline â€” from CV parsing to voice interviews
          </p>
          <p className="mb-10" style={{ fontSize: '1rem', color: 'var(--text-secondary)', opacity: 0.75 }}>
            Score candidates objectively, reduce time-to-hire by 70%, and focus on people who matter most.
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-3 text-white rounded flex items-center gap-2 text-sm transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--accent)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-hover)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent)'; }}
            >
              Get Started
              <ArrowRight size={15} />
            </button>
            <button
              onClick={scrollToHowItWorks}
              className="px-6 py-3 rounded border text-sm transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-surface)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--accent-subtle)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-surface)'; }}
            >
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-4 sm:px-6 pb-12 sm:pb-20">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-center mb-2"
            style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Everything you need to hire better, faster
          </h2>
          <p className="text-center mb-10 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Three assessment pillars, one unified platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Mic,
                title: 'AI Voice Interviews',
                description:
                  'Conduct structured voice interviews with AI scoring on communication clarity, confidence, and relevance. Full transcripts with per-line insights.',
                metrics: ['7-question structured format', 'Real-time transcription', 'Communication scoring'],
              },
              {
                icon: Code2,
                title: 'Coding Assessments',
                description:
                  'Evaluate technical skills with live coding challenges. AI reviews correctness, efficiency, and coding standards â€” no manual grading needed.',
                metrics: ['50+ problem library', 'Multi-language support', 'Automated evaluation'],
              },
              {
                icon: FileText,
                title: 'Intelligent CV Parsing',
                description:
                  'Automatically extract skills, experience, and education from CVs. Score candidates against job requirements with configurable keyword weights.',
                metrics: ['95% extraction accuracy', 'Custom keyword rules', 'Instant ranking'],
              },
            ].map(({ icon: Icon, title, description, metrics }) => (
              <div
                key={title}
                className="rounded-lg p-6 border transition-colors cursor-pointer"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', borderTop: '3px solid var(--accent)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
              >
                <div
                  className="w-10 h-10 rounded flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'var(--accent-subtle)' }}
                >
                  <Icon size={18} style={{ color: 'var(--accent)' }} />
                </div>
                <h3
                  className="mb-3"
                  style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}
                >
                  {title}
                </h3>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{description}</p>
                <ul className="space-y-1.5">
                  {metrics.map(m => (
                    <li key={m} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--success)' }} />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-t border-b py-10" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '70%', label: 'Reduction in time-to-hire' },
            { value: '500+', label: 'Companies using RecruitAI' },
            { value: '98%', label: 'Candidate satisfaction rate' },
            { value: '2M+', label: 'Assessments completed' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="mb-1" style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--accent)' }}>
                {value}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works section */}
      <section id="how-it-works" className="px-4 sm:px-6 py-12 sm:py-20" style={{ backgroundColor: 'var(--bg-base)' }}>
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-center mb-3"
            style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            How RecruitAI Works
          </h2>
          <p className="text-center mb-12 text-sm" style={{ color: 'var(--text-secondary)' }}>
            From job posting to ranked results â€” fully automated, end-to-end.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line */}
            <div
              className="absolute top-8 left-[12.5%] right-[12.5%] h-px hidden lg:block"
              style={{ backgroundColor: 'var(--accent-active)' }}
            />

            {[
              {
                icon: Briefcase,
                step: 1,
                title: 'Post a Job',
                desc: 'Recruiter creates a job posting and sets assessment weights for CV, coding, and voice scores.',
              },
              {
                icon: Users,
                step: 2,
                title: 'Candidates Apply & Assess',
                desc: 'Applicants complete the voice interview, coding test, and system design challenge on their own time.',
              },
              {
                icon: Layers,
                step: 3,
                title: 'AI Evaluates',
                desc: 'RecruitAI automatically scores CVs, code quality, and communication â€” no manual grading needed.',
              },
              {
                icon: Award,
                step: 4,
                title: 'Ranked Results',
                desc: 'Recruiters receive a ranked leaderboard and review detailed candidate profiles with full insights.',
              },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center relative">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4 relative z-10"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '2px solid var(--accent)', boxShadow: '0 2px 8px var(--accent-subtle)' }}
                >
                  <Icon size={22} style={{ color: 'var(--accent)' }} />
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    {step}
                  </div>
                </div>
                <h3 className="mb-2" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center" style={{ backgroundColor: 'var(--bg-sidebar)' }}>
        <p className="text-gray-400 text-sm">
          &copy; 2026 RecruitAI, Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
