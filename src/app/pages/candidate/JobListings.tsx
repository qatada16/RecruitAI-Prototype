import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import {
  Search, X, Upload, ChevronDown, MapPin, Briefcase,
  Clock, DollarSign, Users, ArrowLeft, CheckCircle,
  Building, AlertCircle, FileText, Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  category: string;
  experience: string;
  salary: string;
  skills: string[];
  description: string;
  deadline: string;
  posted: string;
  openings: number;
}

interface Question {
  id: 'q1' | 'q2' | 'q3';
  label: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const JOBS: Job[] = [
  // Engineering
  { id: 'j1', title: 'Senior Frontend Engineer', company: 'Careem Pakistan', location: 'Karachi (Hybrid)', type: 'Full-time', category: 'Engineering', experience: '3–5 years', salary: 'PKR 350,000–450,000/mo', skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'], description: 'Join Careem\'s product team to build world-class frontend experiences for millions of users across Pakistan and the Middle East. You\'ll own key dashboard products end-to-end.', deadline: '2026-06-15', posted: '2026-05-01', openings: 2 },
  { id: 'j2', title: 'Backend Engineer', company: 'Daraz Pakistan', location: 'Lahore (On-site)', type: 'Full-time', category: 'Engineering', experience: '2–4 years', salary: 'PKR 280,000–380,000/mo', skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'], description: 'Scale Daraz\'s core e-commerce backend handling millions of daily orders. You\'ll design microservices, optimize database queries, and improve system reliability.', deadline: '2026-06-20', posted: '2026-05-02', openings: 3 },
  { id: 'j3', title: 'Full Stack Developer', company: 'Bykea', location: 'Karachi (On-site)', type: 'Full-time', category: 'Engineering', experience: '2–3 years', salary: 'PKR 200,000–300,000/mo', skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'], description: 'Build end-to-end features for Bykea\'s ride-hailing and delivery platform serving urban Pakistan with millions of daily rides.', deadline: '2026-06-10', posted: '2026-05-01', openings: 2 },
  { id: 'j4', title: 'DevOps Engineer', company: 'Systems Limited', location: 'Islamabad (Hybrid)', type: 'Full-time', category: 'Engineering', experience: '3–5 years', salary: 'PKR 300,000–420,000/mo', skills: ['AWS', 'Kubernetes', 'Terraform', 'Jenkins', 'Docker'], description: 'Own and scale cloud infrastructure for enterprise clients across banking and telecom sectors in Pakistan and internationally.', deadline: '2026-07-01', posted: '2026-05-03', openings: 1 },
  { id: 'j5', title: 'Mobile Developer (React Native)', company: 'Foodpanda Pakistan', location: 'Karachi (Hybrid)', type: 'Full-time', category: 'Engineering', experience: '2–4 years', salary: 'PKR 250,000–350,000/mo', skills: ['React Native', 'TypeScript', 'Redux', 'Firebase'], description: 'Develop and maintain Foodpanda\'s consumer mobile app used by 3M+ active users monthly across Pakistan.', deadline: '2026-06-25', posted: '2026-05-02', openings: 2 },
  { id: 'j6', title: 'QA Automation Engineer', company: 'NetSol Technologies', location: 'Lahore (On-site)', type: 'Full-time', category: 'Engineering', experience: '1–3 years', salary: 'PKR 150,000–250,000/mo', skills: ['Selenium', 'Cypress', 'Python', 'Jest', 'CI/CD'], description: 'Build and maintain automated test suites for NetSol\'s fleet management and financial software products used globally.', deadline: '2026-06-30', posted: '2026-05-04', openings: 2 },
  // Product & Design
  { id: 'j7', title: 'Product Manager', company: 'Jazz Digital', location: 'Islamabad (Hybrid)', type: 'Full-time', category: 'Product & Design', experience: '4–6 years', salary: 'PKR 400,000–550,000/mo', skills: ['Product Strategy', 'Agile', 'SQL', 'Figma', 'User Research'], description: 'Drive the roadmap for Jazz\'s digital financial services platform reaching 10M+ users across Pakistan.', deadline: '2026-06-15', posted: '2026-05-01', openings: 1 },
  { id: 'j8', title: 'UX/UI Designer', company: 'PTCL Group', location: 'Islamabad (On-site)', type: 'Full-time', category: 'Product & Design', experience: '2–4 years', salary: 'PKR 200,000–280,000/mo', skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'], description: 'Design user-centered experiences for PTCL\'s broadband and enterprise service portals, improving usability for millions of subscribers.', deadline: '2026-06-20', posted: '2026-05-02', openings: 2 },
  { id: 'j9', title: 'Product Analyst', company: 'Daraz Pakistan', location: 'Lahore (Hybrid)', type: 'Full-time', category: 'Product & Design', experience: '1–3 years', salary: 'PKR 180,000–260,000/mo', skills: ['SQL', 'Python', 'Tableau', 'A/B Testing', 'Excel'], description: 'Analyze product metrics and user behavior to drive data-informed decisions for Daraz\'s marketplace features.', deadline: '2026-07-05', posted: '2026-05-03', openings: 2 },
  // Data & AI
  { id: 'j10', title: 'Data Scientist', company: 'Careem Pakistan', location: 'Karachi (Remote-first)', type: 'Remote', category: 'Data & AI', experience: '3–5 years', salary: 'PKR 350,000–500,000/mo', skills: ['Python', 'TensorFlow', 'Scikit-learn', 'SQL', 'MLflow'], description: 'Build ML models for demand forecasting, pricing optimization, and fraud detection powering Careem\'s operations across 14 countries.', deadline: '2026-06-30', posted: '2026-05-01', openings: 2 },
  { id: 'j11', title: 'ML Engineer', company: 'Techlogix', location: 'Islamabad (Hybrid)', type: 'Full-time', category: 'Data & AI', experience: '2–4 years', salary: 'PKR 300,000–420,000/mo', skills: ['PyTorch', 'Python', 'MLOps', 'Docker', 'FastAPI'], description: 'Deploy and scale machine learning models into production for enterprise AI solutions serving the MENA and Pakistan markets.', deadline: '2026-07-10', posted: '2026-05-04', openings: 1 },
  { id: 'j12', title: 'Data Analyst', company: 'Foodpanda Pakistan', location: 'Karachi (Hybrid)', type: 'Full-time', category: 'Data & AI', experience: '1–3 years', salary: 'PKR 150,000–230,000/mo', skills: ['SQL', 'Python', 'Looker', 'Excel', 'Statistics'], description: 'Extract insights from operational data to improve delivery performance and customer satisfaction metrics across Pakistan.', deadline: '2026-06-25', posted: '2026-05-03', openings: 3 },
  // Marketing
  { id: 'j13', title: 'Digital Marketing Manager', company: 'Bykea', location: 'Karachi (On-site)', type: 'Full-time', category: 'Marketing', experience: '3–5 years', salary: 'PKR 200,000–300,000/mo', skills: ['Google Ads', 'Meta Ads', 'SEO', 'Content Strategy', 'Analytics'], description: 'Lead digital marketing campaigns to grow Bykea\'s user base across Pakistan\'s major cities including Karachi, Lahore, and Islamabad.', deadline: '2026-06-15', posted: '2026-05-02', openings: 1 },
  { id: 'j14', title: 'Content & Social Media Lead', company: 'Jazz Digital', location: 'Islamabad (Hybrid)', type: 'Full-time', category: 'Marketing', experience: '2–3 years', salary: 'PKR 120,000–180,000/mo', skills: ['Content Writing', 'Social Media', 'Copywriting', 'Urdu/English', 'Canva'], description: 'Create compelling bilingual (Urdu/English) content for Jazz Digital\'s social channels and digital campaigns targeting youth segments.', deadline: '2026-06-20', posted: '2026-05-01', openings: 2 },
  // Operations
  { id: 'j15', title: 'HR Business Partner', company: 'Systems Limited', location: 'Lahore / Karachi (On-site)', type: 'Full-time', category: 'Operations', experience: '4–6 years', salary: 'PKR 250,000–360,000/mo', skills: ['HR Strategy', 'Talent Acquisition', 'HRIS', 'Labor Law', 'L&D'], description: 'Partner with business leaders across Systems Limited\'s engineering and consulting divisions to drive people strategy.', deadline: '2026-07-01', posted: '2026-05-04', openings: 2 },
  { id: 'j16', title: 'Finance Analyst', company: 'NetSol Technologies', location: 'Lahore (On-site)', type: 'Full-time', category: 'Operations', experience: '2–4 years', salary: 'PKR 200,000–280,000/mo', skills: ['Financial Modeling', 'Excel', 'SAP', 'FP&A', 'Power BI'], description: 'Support financial planning, forecasting, and analysis for NetSol\'s global operations spanning 10+ countries.', deadline: '2026-06-30', posted: '2026-05-03', openings: 1 },
];

const CATEGORIES = ['All', 'Engineering', 'Product & Design', 'Data & AI', 'Marketing', 'Operations'];

const CATEGORY_QUESTIONS: Record<string, Question[]> = {
  Engineering: [
    { id: 'q1', label: 'Describe your most impactful technical project in 2–3 sentences.', type: 'textarea' },
    { id: 'q2', label: 'Which programming languages / frameworks are you most proficient in?', type: 'text' },
    { id: 'q3', label: 'Are you comfortable with the work arrangement listed for this role?', type: 'select', options: ['Yes, fully comfortable', 'Prefer hybrid if not specified', 'Need to discuss further'] },
  ],
  'Product & Design': [
    { id: 'q1', label: 'Describe a product or feature you shipped and its measurable impact.', type: 'textarea' },
    { id: 'q2', label: 'What design or product tools do you use most frequently?', type: 'text' },
    { id: 'q3', label: 'How comfortable are you leading cross-functional teams?', type: 'select', options: ['Very comfortable — have led teams', 'Somewhat — with some guidance', 'Still developing this skill'] },
  ],
  'Data & AI': [
    { id: 'q1', label: 'Describe a data or ML project you\'ve worked on and its outcome.', type: 'textarea' },
    { id: 'q2', label: 'Which data / ML frameworks have you used in production?', type: 'text' },
    { id: 'q3', label: 'Are you comfortable presenting findings to non-technical stakeholders?', type: 'select', options: ['Yes — do this regularly', 'Somewhat — working on it', 'Prefer technical audiences'] },
  ],
  Marketing: [
    { id: 'q1', label: 'Describe a successful marketing campaign you led or contributed to.', type: 'textarea' },
    { id: 'q2', label: 'Which marketing platforms and tools are you most proficient in?', type: 'text' },
    { id: 'q3', label: 'Do you have experience managing paid advertising budgets?', type: 'select', options: ['Yes — managed >PKR 1M budgets', 'Yes — small to mid-scale budgets', 'No, but keen to learn'] },
  ],
  Operations: [
    { id: 'q1', label: 'Describe your key responsibilities in your most recent role.', type: 'textarea' },
    { id: 'q2', label: 'What software or tools do you rely on most in your work?', type: 'text' },
    { id: 'q3', label: 'Are you open to working across multiple office locations?', type: 'select', options: ['Yes — fully flexible', 'Prefer one primary location', 'Need to discuss further'] },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const initialForm = (name = '', email = '') => ({
  name, email, phone: '', linkedin: '',
  experience: '', currentSalary: '', expectedSalary: '',
  noticePeriod: '', coverLetter: '',
  q1: '', q2: '', q3: '',
  cvFile: null as File | null,
});

type FormState = ReturnType<typeof initialForm>;
type Errors = Partial<Record<keyof FormState, string>>;

function validateForm(form: FormState): Errors {
  const e: Errors = {};
  if (!form.name.trim() || form.name.trim().length < 3) e.name = 'Full name must be at least 3 characters.';
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
  if (!form.phone.trim()) e.phone = 'Phone number is required.';
  else if (!/^(\+92|0|92)\s?[0-9]{3}\s?[0-9]{7}$/.test(form.phone.replace(/\s/g, '')))
    e.phone = 'Enter a valid Pakistani number (e.g. +92 300 1234567).';
  if (!form.experience.trim()) e.experience = 'Years of experience is required.';
  if (!form.expectedSalary.trim()) e.expectedSalary = 'Expected salary is required.';
  if (!form.noticePeriod) e.noticePeriod = 'Please select your notice period.';
  if (!form.coverLetter.trim() || form.coverLetter.trim().length < 100)
    e.coverLetter = 'Cover letter must be at least 100 characters.';
  if (!form.cvFile) e.cvFile = 'Please upload your CV (PDF or DOCX, max 5 MB).';
  if (!form.q1.trim()) e.q1 = 'This field is required.';
  if (!form.q2.trim()) e.q2 = 'This field is required.';
  if (!form.q3) e.q3 = 'Please select an option.';
  return e;
}

// ─── Sub-components ────────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-1 mt-1">
      <AlertCircle size={12} style={{ color: 'var(--error)', flexShrink: 0 }} />
      <p style={{ fontSize: '0.75rem', color: 'var(--error)' }}>{msg}</p>
    </div>
  );
}

function inputStyle(hasError: boolean) {
  return {
    width: '100%', padding: '8px 12px', borderRadius: 8, outline: 'none',
    fontSize: '0.875rem', color: 'var(--text-primary)',
    backgroundColor: 'var(--bg-input)',
    border: `1px solid ${hasError ? 'var(--error)' : 'var(--border-input)'}`,
    transition: 'border-color 0.15s',
  } as React.CSSProperties;
}

function CategoryBadge({ cat }: { cat: string }) {
  const colors: Record<string, [string, string]> = {
    Engineering:       ['var(--accent)',   'var(--accent-subtle)'],
    'Product & Design':['#A855F7',         'rgba(168,85,247,0.1)'],
    'Data & AI':       ['var(--success)',  'var(--success-bg)'],
    Marketing:         ['var(--warning)',  'var(--warning-bg)'],
    Operations:        ['var(--text-secondary)', 'var(--bg-elevated)'],
  };
  const [color, bg] = colors[cat] ?? ['var(--text-secondary)', 'var(--bg-elevated)'];
  return (
    <span style={{ fontSize: '0.7rem', fontWeight: 600, color, backgroundColor: bg, padding: '2px 8px', borderRadius: 9999, whiteSpace: 'nowrap' }}>
      {cat}
    </span>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function JobListings() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filter state
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Modal state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [form, setForm] = useState<FormState>(initialForm(user?.name, user?.email));
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [dragOver, setDragOver] = useState(false);

  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // ── Filtered jobs ──────────────────────────────────────────────────────────
  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return JOBS.filter(j => {
      const matchCat = activeCategory === 'All' || j.category === activeCategory;
      if (!q) return matchCat;
      return matchCat && (
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.skills.some(s => s.toLowerCase().includes(q))
      );
    });
  }, [search, activeCategory]);

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openModal = useCallback((job: Job) => {
    setSelectedJob(job);
    setForm(initialForm(user?.name, user?.email));
    setErrors({});
    setTouched({});
    setSubmitState('idle');
    setDragOver(false);
  }, [user]);

  const closeModal = useCallback(() => {
    setSelectedJob(null);
    setSubmitState('idle');
  }, []);

  // Escape key & focus
  useEffect(() => {
    if (!selectedJob) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); };
    document.addEventListener('keydown', handleKey);
    // Focus first input after paint
    const t = window.setTimeout(() => firstInputRef.current?.focus(), 50);
    return () => { document.removeEventListener('keydown', handleKey); clearTimeout(t); };
  }, [selectedJob, closeModal]);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selectedJob ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedJob]);

  // ── Form helpers ───────────────────────────────────────────────────────────
  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function touchField(key: keyof FormState) {
    setTouched(prev => ({ ...prev, [key]: true }));
    // Validate immediately on blur
    const errs = validateForm({ ...form });
    setErrors(prev => ({ ...prev, [key]: errs[key] }));
  }

  function getError(key: keyof FormState): string | undefined {
    return touched[key] ? errors[key] : undefined;
  }

  function handleFileInput(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      toast.error('Only PDF or DOCX files are accepted.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5 MB.');
      return;
    }
    setField('cvFile', file);
    setTouched(p => ({ ...p, cvFile: true }));
    setErrors(p => ({ ...p, cvFile: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Touch all fields to show errors
    const allTouched: Partial<Record<keyof FormState, boolean>> = {};
    (Object.keys(form) as (keyof FormState)[]).forEach(k => { allTouched[k] = true; });
    setTouched(allTouched);
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Scroll to first error
      const firstErr = modalRef.current?.querySelector('[data-field-error]') as HTMLElement;
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast.error('Please fix the errors before submitting.');
      return;
    }
    setSubmitState('submitting');
    // Simulate API call
    await new Promise(r => setTimeout(r, 1800));
    setSubmitState('success');
    toast.success(`Application for "${selectedJob?.title}" submitted!`);
  }

  // ── Questions for current job ──────────────────────────────────────────────
  const questions = selectedJob ? (CATEGORY_QUESTIONS[selectedJob.category] ?? CATEGORY_QUESTIONS.Engineering) : [];

  // ── Category counts ────────────────────────────────────────────────────────
  const catCounts = useMemo(() => {
    const counts: Record<string, number> = { All: JOBS.length };
    CATEGORIES.slice(1).forEach(c => {
      counts[c] = JOBS.filter(j => j.category === c).length;
    });
    return counts;
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Page header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/candidate')}
          className="inline-flex items-center gap-1.5 text-sm mb-4 cursor-pointer transition-colors"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          <ArrowLeft size={15} /> Back to Assessment Hub
        </button>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.625rem)', fontWeight: 700, color: 'var(--text-primary)' }}>
              Open Positions
            </h1>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Browse and apply for roles at Pakistan's leading tech companies
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}>
            <Briefcase size={14} />
            {JOBS.length} open roles
          </div>
        </div>
      </div>

      {/* Search + filter bar */}
      <div
        className="rounded-xl p-4 mb-4 border flex flex-col sm:flex-row gap-3"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, company, skill…"
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm outline-none"
            style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-input)', color: 'var(--text-primary)' }}
            onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-input)'; }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer rounded p-0.5"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span className="hidden sm:inline whitespace-nowrap">{filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => {
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all whitespace-nowrap flex-shrink-0"
              style={{
                backgroundColor: active ? 'var(--accent)' : 'var(--bg-surface)',
                color: active ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
            >
              {cat}
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: active ? 'rgba(255,255,255,0.2)' : 'var(--bg-elevated)', color: active ? '#fff' : 'var(--text-secondary)' }}
              >
                {catCounts[cat]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredJobs.length === 0 && (
        <div className="py-16 text-center">
          <Search size={36} className="mx-auto mb-3" style={{ color: 'var(--text-disabled)' }} />
          <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>No jobs found</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Try a different keyword or category.
          </p>
        </div>
      )}

      {/* Desktop table */}
      {filteredJobs.length > 0 && (
        <div className="hidden md:block rounded-xl border overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-card)' }}>
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-elevated)' }}>
                {['Role & Company', 'Category', 'Location', 'Experience', 'Salary', 'Openings', ''].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(job => (
                <tr
                  key={job.id}
                  className="border-t cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; }}
                  onClick={() => openModal(job)}
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{job.title}</p>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Building size={11} /> {job.company}
                    </div>
                  </td>
                  <td className="px-5 py-4"><CategoryBadge cat={job.category} /></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <MapPin size={13} />{job.location}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{job.experience}</td>
                  <td className="px-5 py-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{job.salary}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <Users size={13} /> {job.openings}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={e => { e.stopPropagation(); openModal(job); }}
                      className="text-xs px-4 py-2 rounded-lg font-medium cursor-pointer transition-all"
                      style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      Apply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {filteredJobs.length > 0 && (
        <div className="md:hidden grid gap-4">
          {filteredJobs.map(job => (
            <div
              key={job.id}
              className="rounded-xl border p-5 cursor-pointer transition-all"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-card)' }}
              onClick={() => openModal(job)}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold mb-0.5" style={{ color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{job.title}</p>
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <Building size={11} /> {job.company}
                  </div>
                </div>
                <CategoryBadge cat={job.category} />
              </div>
              <div className="flex flex-wrap gap-3 text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                <span className="flex items-center gap-1"><Clock size={11} />{job.experience}</span>
                <span className="flex items-center gap-1"><DollarSign size={11} />{job.salary}</span>
                <span className="flex items-center gap-1"><Users size={11} />{job.openings} opening{job.openings > 1 ? 's' : ''}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {job.skills.slice(0, 4).map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}>{s}</span>
                ))}
              </div>
              <button
                className="w-full py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all"
                style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--accent-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Application Modal ─────────────────────────────────────────── */}
      {selectedJob && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'var(--backdrop)', backdropFilter: 'blur(4px)' }}
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl flex flex-col"
              style={{
                backgroundColor: 'var(--bg-surface)',
                boxShadow: 'var(--shadow-modal)',
                pointerEvents: 'auto',
                border: '1px solid var(--border)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {submitState === 'success' ? (
                // ── Success state ────────────────────────────────────────
                <div className="flex flex-col items-center justify-center text-center px-8 py-16">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: 'var(--success-bg)' }}>
                    <CheckCircle size={32} style={{ color: 'var(--success)' }} />
                  </div>
                  <h2 className="mb-2 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Application Submitted!</h2>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                    Your application for <strong style={{ color: 'var(--text-primary)' }}>{selectedJob.title}</strong> at <strong style={{ color: 'var(--text-primary)' }}>{selectedJob.company}</strong> has been received.
                  </p>
                  <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
                    We'll review it and get back to you within 3–5 business days.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all"
                      style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--accent-hover)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
                    >
                      Browse More Jobs
                    </button>
                    <button
                      onClick={() => navigate('/candidate')}
                      className="px-6 py-2.5 rounded-lg text-sm font-medium cursor-pointer border"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      Go to Assessment Hub
                    </button>
                  </div>
                </div>
              ) : (
                // ── Application form ────────────────────────────────────
                <form onSubmit={handleSubmit} noValidate>
                  {/* Modal header */}
                  <div
                    className="flex items-start justify-between gap-4 px-6 py-5 sticky top-0 z-10"
                    style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border)' }}
                  >
                    <div>
                      <h2 id="modal-title" className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                        Apply — {selectedJob.title}
                      </h2>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <Building size={13} /> {selectedJob.company}
                        </span>
                        <span className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <MapPin size={13} /> {selectedJob.location}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={closeModal}
                      aria-label="Close"
                      className="p-2 rounded-lg cursor-pointer flex-shrink-0 transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="px-6 py-5 space-y-5">
                    {/* Job overview pills */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { icon: Clock, text: selectedJob.experience },
                        { icon: DollarSign, text: selectedJob.salary },
                        { icon: Users, text: `${selectedJob.openings} opening${selectedJob.openings > 1 ? 's' : ''}` },
                        { icon: Briefcase, text: selectedJob.type },
                      ].map(({ icon: Icon, text }) => (
                        <span key={text} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                          <Icon size={12} />{text}
                        </span>
                      ))}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.skills.map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}>{s}</span>
                      ))}
                    </div>

                    {/* Section: Personal Info */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>Personal Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div data-field-error={getError('name') ? '' : undefined}>
                          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                            Full Name <span style={{ color: 'var(--error)' }}>*</span>
                          </label>
                          <input
                            ref={firstInputRef}
                            type="text"
                            value={form.name}
                            onChange={e => setField('name', e.target.value)}
                            onBlur={() => touchField('name')}
                            onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; }}
                            style={inputStyle(!!getError('name'))}
                            placeholder="e.g. Hamza Tariq"
                          />
                          <FieldError msg={getError('name')} />
                        </div>
                        {/* Email */}
                        <div data-field-error={getError('email') ? '' : undefined}>
                          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                            Email Address <span style={{ color: 'var(--error)' }}>*</span>
                          </label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={e => setField('email', e.target.value)}
                            onBlur={() => touchField('email')}
                            onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; }}
                            style={inputStyle(!!getError('email'))}
                            placeholder="you@example.com"
                          />
                          <FieldError msg={getError('email')} />
                        </div>
                        {/* Phone */}
                        <div data-field-error={getError('phone') ? '' : undefined}>
                          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                            Phone Number <span style={{ color: 'var(--error)' }}>*</span>
                          </label>
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={e => setField('phone', e.target.value)}
                            onBlur={() => touchField('phone')}
                            onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; }}
                            style={inputStyle(!!getError('phone'))}
                            placeholder="+92 300 1234567"
                          />
                          <FieldError msg={getError('phone')} />
                        </div>
                        {/* LinkedIn */}
                        <div>
                          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                            LinkedIn Profile <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>(optional)</span>
                          </label>
                          <input
                            type="url"
                            value={form.linkedin}
                            onChange={e => setField('linkedin', e.target.value)}
                            onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; }}
                            onBlur={e => { e.target.style.borderColor = 'var(--border-input)'; }}
                            style={inputStyle(false)}
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section: Experience & Salary */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>Experience & Compensation</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Experience */}
                        <div data-field-error={getError('experience') ? '' : undefined}>
                          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                            Years of Experience <span style={{ color: 'var(--error)' }}>*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="40"
                            value={form.experience}
                            onChange={e => setField('experience', e.target.value)}
                            onBlur={() => touchField('experience')}
                            onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; }}
                            style={inputStyle(!!getError('experience'))}
                            placeholder="e.g. 4"
                          />
                          <FieldError msg={getError('experience')} />
                        </div>
                        {/* Notice period */}
                        <div data-field-error={getError('noticePeriod') ? '' : undefined}>
                          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                            Notice Period <span style={{ color: 'var(--error)' }}>*</span>
                          </label>
                          <div className="relative">
                            <select
                              value={form.noticePeriod}
                              onChange={e => { setField('noticePeriod', e.target.value); setTouched(p => ({ ...p, noticePeriod: true })); }}
                              onBlur={() => touchField('noticePeriod')}
                              style={{ ...inputStyle(!!getError('noticePeriod')), appearance: 'none', paddingRight: 32 }}
                            >
                              <option value="">Select…</option>
                              {['Immediately', '1 week', '2 weeks', '1 month', '2 months', '3 months'].map(o => <option key={o}>{o}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
                          </div>
                          <FieldError msg={getError('noticePeriod')} />
                        </div>
                        {/* Current salary */}
                        <div>
                          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                            Current Salary (PKR/mo) <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>(optional)</span>
                          </label>
                          <input
                            type="text"
                            value={form.currentSalary}
                            onChange={e => setField('currentSalary', e.target.value)}
                            onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; }}
                            onBlur={e => { e.target.style.borderColor = 'var(--border-input)'; }}
                            style={inputStyle(false)}
                            placeholder="e.g. 250,000"
                          />
                        </div>
                        {/* Expected salary */}
                        <div data-field-error={getError('expectedSalary') ? '' : undefined}>
                          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                            Expected Salary (PKR/mo) <span style={{ color: 'var(--error)' }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={form.expectedSalary}
                            onChange={e => setField('expectedSalary', e.target.value)}
                            onBlur={() => touchField('expectedSalary')}
                            onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; }}
                            style={inputStyle(!!getError('expectedSalary'))}
                            placeholder="e.g. 350,000"
                          />
                          <FieldError msg={getError('expectedSalary')} />
                        </div>
                      </div>
                    </div>

                    {/* Section: Short Questions */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
                        Short Questions — {selectedJob.category}
                      </h3>
                      <div className="space-y-4">
                        {questions.map((q, qi) => (
                          <div key={q.id} data-field-error={getError(q.id) ? '' : undefined}>
                            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                              {qi + 1}. {q.label} <span style={{ color: 'var(--error)' }}>*</span>
                            </label>
                            {q.type === 'textarea' ? (
                              <textarea
                                rows={3}
                                value={form[q.id]}
                                onChange={e => setField(q.id, e.target.value)}
                                onBlur={() => touchField(q.id)}
                                onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; }}
                                style={{ ...inputStyle(!!getError(q.id)), resize: 'vertical', fontFamily: 'inherit' }}
                                placeholder="Write your answer here…"
                              />
                            ) : q.type === 'select' ? (
                              <div className="relative">
                                <select
                                  value={form[q.id]}
                                  onChange={e => { setField(q.id, e.target.value); setTouched(p => ({ ...p, [q.id]: true })); }}
                                  onBlur={() => touchField(q.id)}
                                  style={{ ...inputStyle(!!getError(q.id)), appearance: 'none', paddingRight: 32 }}
                                >
                                  <option value="">Select an option…</option>
                                  {q.options?.map(o => <option key={o}>{o}</option>)}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={form[q.id]}
                                onChange={e => setField(q.id, e.target.value)}
                                onBlur={() => touchField(q.id)}
                                onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; }}
                                style={inputStyle(!!getError(q.id))}
                                placeholder="Your answer…"
                              />
                            )}
                            <FieldError msg={getError(q.id)} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section: Cover Letter */}
                    <div data-field-error={getError('coverLetter') ? '' : undefined}>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                        Cover Letter <span style={{ color: 'var(--error)' }}>*</span>
                        <span className="ml-2 text-xs font-normal" style={{ color: form.coverLetter.length >= 100 ? 'var(--success)' : 'var(--text-secondary)' }}>
                          {form.coverLetter.length}/100 min chars
                        </span>
                      </label>
                      <textarea
                        rows={5}
                        value={form.coverLetter}
                        onChange={e => setField('coverLetter', e.target.value)}
                        onBlur={() => touchField('coverLetter')}
                        onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; }}
                        style={{ ...inputStyle(!!getError('coverLetter')), resize: 'vertical', fontFamily: 'inherit' }}
                        placeholder="Introduce yourself and explain why you're a strong fit for this role…"
                      />
                      <FieldError msg={getError('coverLetter')} />
                    </div>

                    {/* Section: CV Upload */}
                    <div data-field-error={getError('cvFile') ? '' : undefined}>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                        Upload CV <span style={{ color: 'var(--error)' }}>*</span>
                        <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-secondary)' }}>PDF or DOCX · max 5 MB</span>
                      </label>
                      <div
                        className="rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all"
                        style={{
                          borderColor: dragOver ? 'var(--accent)' : getError('cvFile') ? 'var(--error)' : 'var(--border-input)',
                          backgroundColor: dragOver ? 'var(--accent-subtle)' : form.cvFile ? 'var(--success-bg)' : 'var(--bg-input)',
                        }}
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={e => { e.preventDefault(); setDragOver(false); handleFileInput(e.dataTransfer.files); }}
                        onClick={() => document.getElementById('cv-file-input')?.click()}
                      >
                        {form.cvFile ? (
                          <div className="flex items-center justify-center gap-3">
                            <FileText size={20} style={{ color: 'var(--success)' }} />
                            <div className="text-left">
                              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{form.cvFile.name}</p>
                              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{(form.cvFile.size / 1024).toFixed(0)} KB</p>
                            </div>
                            <button
                              type="button"
                              onClick={e => { e.stopPropagation(); setField('cvFile', null); }}
                              className="ml-2 p-1 rounded cursor-pointer"
                              style={{ color: 'var(--text-secondary)' }}
                              aria-label="Remove file"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload size={24} className="mx-auto mb-2" style={{ color: dragOver ? 'var(--accent)' : 'var(--text-secondary)' }} />
                            <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>
                              {dragOver ? 'Drop to upload' : 'Drop your CV here, or click to browse'}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>PDF, DOC, DOCX accepted</p>
                          </>
                        )}
                      </div>
                      <input
                        id="cv-file-input"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={e => handleFileInput(e.target.files)}
                      />
                      <FieldError msg={getError('cvFile')} />
                    </div>
                  </div>

                  {/* Modal footer */}
                  <div
                    className="flex items-center justify-between gap-3 px-6 py-4 sticky bottom-0"
                    style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}
                  >
                    <p className="text-xs hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
                      Fields marked <span style={{ color: 'var(--error)' }}>*</span> are required
                    </p>
                    <div className="flex gap-3 ml-auto">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer border transition-colors"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitState === 'submitting'}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                        onMouseEnter={e => { if (submitState !== 'submitting') e.currentTarget.style.backgroundColor = 'var(--accent-hover)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
                      >
                        {submitState === 'submitting' ? (
                          <><Loader2 size={15} className="animate-spin" /> Submitting…</>
                        ) : (
                          <>Submit Application</>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
