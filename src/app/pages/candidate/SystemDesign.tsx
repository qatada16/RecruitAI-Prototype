import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Loader2, Check } from 'lucide-react';
import { useCandidateContext } from '../../context/CandidateContext';
import BackButton from '../../components/common/BackButton';
import { toast } from 'sonner';

const SCENARIO = `Design a URL shortening service (similar to bit.ly) that can handle 100 million requests per day. Your design should cover the write path (shortening a URL), the read path (expanding a short URL), the data model, caching strategy, and how you would scale the system to meet traffic demand. Discuss trade-offs where applicable.`;

const PLACEHOLDER = `Start with a brief overview of your approach, then walk through:

1. Write path — how a long URL becomes a short one
2. Read path — how a short URL is resolved
3. Data model — what you store and how
4. Caching strategy — where and what you cache
5. Scalability — how you handle 100M requests/day
6. Trade-offs — what you're sacrificing and why`;

const INITIAL_NODES = [
  { id: '1', label: 'Client',         x: 60,  y: 160, color: 'var(--accent)' },
  { id: '2', label: 'Load Balancer',  x: 220, y: 160, color: 'var(--text-primary)' },
  { id: '3', label: 'App Server',     x: 400, y: 80,  color: 'var(--text-primary)' },
  { id: '4', label: 'App Server',     x: 400, y: 200, color: 'var(--text-primary)' },
  { id: '5', label: 'Database',       x: 580, y: 130, color: 'var(--success)' },
  { id: '6', label: 'Redis Cache',    x: 580, y: 230, color: 'var(--warning)' },
  { id: '7', label: 'CDN',            x: 220, y: 280, color: 'var(--accent-hover)' },
];

const EDGES = [
  ['1', '2'], ['2', '3'], ['2', '4'], ['3', '5'], ['4', '5'],
  ['3', '6'], ['4', '6'], ['1', '7'],
];

function DiagramCanvas() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const dragging = useRef<{ id: string; ox: number; oy: number } | null>(null);

  const onMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const node = nodes.find(n => n.id === id)!;
    dragging.current = { id, ox: e.clientX - node.x, oy: e.clientY - node.y };
  };

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const { id, ox, oy } = dragging.current;
    setNodes(ns => ns.map(n => n.id === id ? { ...n, x: e.clientX - ox, y: e.clientY - oy } : n));
  }, []);

  const onMouseUp = () => { dragging.current = null; };
  const getNode = (id: string) => nodes.find(n => n.id === id)!;

  return (
    <svg
      className="w-full h-full"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{ cursor: dragging.current ? 'grabbing' : 'default' }}
    >
      {EDGES.map(([a, b], i) => {
        const na = getNode(a);
        const nb = getNode(b);
        return (
          <line
            key={i}
            x1={na.x + 50}
            y1={na.y + 18}
            x2={nb.x + 50}
            y2={nb.y + 18}
            stroke="var(--border-hover)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
        );
      })}
      {nodes.map(node => (
        <g
          key={node.id}
          transform={`translate(${node.x}, ${node.y})`}
          style={{ cursor: 'grab' }}
          onMouseDown={e => onMouseDown(e, node.id)}
        >
          <rect width={100} height={36} rx={6} fill={node.color} />
          <text
            x={50} y={22}
            textAnchor="middle"
            fill="#fff"
            style={{ fontSize: 11, fontWeight: 500, userSelect: 'none' }}
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

type SaveState = 'idle' | 'saving' | 'saved';

export default function SystemDesign() {
  const navigate = useNavigate();
  const { setDesignStatus } = useCandidateContext();
  const [tab, setTab] = useState<'written' | 'diagram'>('written');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const saveTimerRef = useRef<number | null>(null);
  const savedTimerRef = useRef<number | null>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const meetsMinChars = charCount >= 50;

  // Debounced auto-save indicator
  useEffect(() => {
    if (!text) { setSaveState('idle'); return; }
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    if (savedTimerRef.current) window.clearTimeout(savedTimerRef.current);
    setSaveState('saving');
    saveTimerRef.current = window.setTimeout(() => {
      setSaveState('saved');
      savedTimerRef.current = window.setTimeout(() => setSaveState('idle'), 1600);
    }, 800);
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      if (savedTimerRef.current) window.clearTimeout(savedTimerRef.current);
    };
  }, [text]);

  const handleSubmit = () => {
    if (tab === 'written' && !meetsMinChars) {
      toast.error('Write at least 50 characters before submitting.');
      return;
    }
    setSubmitting(true);
    toast.info('Submitting response...');
    setTimeout(() => {
      setDesignStatus('completed');
      toast.success('Response submitted');
      navigate('/candidate/confirmation');
    }, 1400);
  };

  const submitDisabled = submitting || (tab === 'written' && !meetsMinChars);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
      <div className="mb-3"><BackButton to="/candidate" label="Back to Dashboard" /></div>

      <div
        className="rounded-lg px-5 py-4 mb-6"
        style={{
          border: '1px solid var(--border)',
          borderLeft: '4px solid var(--accent)',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <p className="text-xs font-semibold mb-1.5 tracking-wide" style={{ color: 'var(--accent)' }}>
          SYSTEM DESIGN CHALLENGE
        </p>
        <h1 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          URL Shortening Service
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {SCENARIO}
        </p>
      </div>

      <div className="border-b mb-5" style={{ borderColor: 'var(--border)' }} role="tablist">
        {[
          { key: 'written', label: 'Written Response' },
          { key: 'diagram', label: 'Diagram' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as typeof tab)}
            className="px-5 py-2.5 text-sm cursor-pointer"
            role="tab"
            aria-selected={tab === key}
            style={{
              borderBottom: tab === key ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: '-1px',
              color: tab === key ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: tab === key ? 500 : 400,
            }}
            onMouseEnter={e => { if (tab !== key) e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { if (tab !== key) e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'written' ? (
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={PLACEHOLDER}
          className="w-full rounded-lg p-5 text-sm outline-none resize-y leading-relaxed"
          style={{
            border: '1px solid var(--border-input)',
            color: 'var(--text-primary)',
            backgroundColor: 'var(--bg-input)',
            minHeight: 360,
            fontFamily: "'DM Sans', sans-serif",
          }}
          onFocus={e => {
            e.target.style.borderColor = 'var(--border-focus)';
            e.target.style.boxShadow = '0 0 0 3px var(--accent-subtle)';
            e.target.style.backgroundColor = 'var(--bg-input-focus)';
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--border-input)';
            e.target.style.boxShadow = 'none';
            e.target.style.backgroundColor = 'var(--bg-input)';
          }}
          aria-label="Written response"
        />
      ) : (
        <div
          className="rounded-lg overflow-hidden"
          style={{ border: '1px solid var(--border)', height: 380, backgroundColor: 'var(--bg-surface)' }}
        >
          <div
            className="px-4 py-2.5 text-xs"
            style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}
          >
            Drag components to build your architecture diagram
          </div>
          <div style={{ height: 332, position: 'relative' }}>
            <DiagramCanvas />
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span>{tab === 'written' ? `${wordCount} words · ${charCount} characters` : 'Drag to connect components'}</span>
          {tab === 'written' && (
            <span aria-live="polite" className="inline-flex items-center gap-1">
              {saveState === 'saving' && (
                <>
                  <Loader2 size={11} className="animate-spin" />
                  Auto-saving...
                </>
              )}
              {saveState === 'saved' && (
                <span style={{ color: 'var(--success)' }} className="inline-flex items-center gap-1">
                  <Check size={11} /> Saved
                </span>
              )}
            </span>
          )}
        </div>

        <div className="relative group">
          <button
            onClick={handleSubmit}
            disabled={submitDisabled}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm text-white rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 font-medium"
            style={{ backgroundColor: 'var(--accent)' }}
            onMouseEnter={e => { if (!submitDisabled) e.currentTarget.style.backgroundColor = 'var(--accent-hover)'; }}
            onMouseLeave={e => { if (!submitDisabled) e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {submitting ? 'Processing...' : 'Submit Response'}
          </button>
          {!meetsMinChars && tab === 'written' && !submitting && (
            <div
              className="absolute bottom-full right-0 mb-2 px-2.5 py-1.5 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-elevated)',
                zIndex: 10,
              }}
              role="tooltip"
            >
              Write at least 50 characters before submitting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
