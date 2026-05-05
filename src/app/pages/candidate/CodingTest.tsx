import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Play, CheckCircle, XCircle, ChevronDown, RotateCcw, Loader2 } from 'lucide-react';
import { useCandidateContext } from '../../context/CandidateContext';
import BackButton from '../../components/common/BackButton';
import { useIsMobile } from '../../components/common/useMediaQuery';
import { toast } from 'sonner';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../../components/ui/alert-dialog';

const problem = {
  title: 'Two Sum',
  difficulty: 'Easy',
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
  constraints: [
    '2 ≤ nums.length ≤ 10^4',
    '-10^9 ≤ nums[i] ≤ 10^9',
    '-10^9 ≤ target ≤ 10^9',
    'Only one valid answer exists.',
  ],
  examples: [
    { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9' },
    { input: 'nums = [3,2,4], target = 6',     output: '[1,2]', explanation: 'nums[1] + nums[2] == 6' },
  ],
};

const starterCode: Record<string, string> = {
  Python: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
  JavaScript: `var twoSum = function(nums, target) {
    const seen = {};
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (complement in seen) return [seen[complement], i];
        seen[nums[i]] = i;
    }
    return [];
};`,
  Java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), i};
            }
            seen.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
};

const testCases = [
  { input: '[2,7,11,15], target=9', expected: '[0,1]', actual: '[0,1]', passed: true },
  { input: '[3,2,4], target=6',     expected: '[1,2]', actual: '[1,2]', passed: true },
  { input: '[3,3], target=6',       expected: '[0,1]', actual: '[0,1]', passed: true },
  { input: '[1,5,3,7], target=10',  expected: '[1,3]', actual: '[1,3]', passed: true },
];

const difficultyConfig: Record<string, { color: string; bg: string }> = {
  Easy:   { color: 'var(--success)', bg: 'var(--success-bg)' },
  Medium: { color: 'var(--warning)', bg: 'var(--warning-bg)' },
  Hard:   { color: 'var(--error)',   bg: 'var(--error-bg)' },
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function CodingTest() {
  const navigate = useNavigate();
  const { setCodingStatus } = useCandidateContext();
  const isMobile = useIsMobile();

  const [language, setLanguage] = useState('Python');
  const [code, setCode] = useState(starterCode['Python']);
  const [consoleOutput, setConsoleOutput] = useState('');
  const [ran, setRan] = useState(false);
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [submitting, setSubmitting] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [problemOpen, setProblemOpen] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const handleRun = () => {
    if (running) return;
    setRunning(true);
    setConsoleOutput('Running test cases...\n');
    setTimeout(() => {
      setConsoleOutput(`Running test cases...

[PASS] Test 1: twoSum([2,7,11,15], 9) -> [0, 1]  ✓
[PASS] Test 2: twoSum([3,2,4], 6)     -> [1, 2]  ✓
[PASS] Test 3: twoSum([3,3], 6)       -> [0, 1]  ✓
[PASS] Test 4: twoSum([1,5,3,7], 10)  -> [1, 3]  ✓

All 4/4 test cases passed.
Runtime: 0.003s  |  Memory: 14.2 MB`);
      setRan(true);
      setRunning(false);
      toast.success('All 4 test cases passed');
    }, 900);
  };

  const handleSubmit = () => {
    if (!ran || submitting) return;
    setSubmitting(true);
    toast.info('Submitting solution...');
    setTimeout(() => {
      setCodingStatus('completed');
      toast.success('Solution submitted');
      navigate('/candidate');
    }, 1400);
  };

  const handleReset = () => {
    setCode(starterCode[language]);
    setConsoleOutput('');
    setRan(false);
    setResetOpen(false);
    toast.info('Code reset to default');
  };

  // Keyboard shortcut: Ctrl/Cmd+Enter to run
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const isRedTime = timeLeft < 5 * 60;
  const submitDisabled = !ran || submitting;

  return (
    <div className="flex flex-col" style={{ backgroundColor: 'var(--bg-base)', minHeight: 'calc(100vh - 6rem)' }}>
      {/* Header strip with Back, title, timer, reset */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-5 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <BackButton to="/candidate" label="Dashboard" />
          <span className="hidden sm:inline" style={{ color: 'var(--text-disabled)' }}>/</span>
          <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>Coding Test · Two Sum</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-semibold px-2.5 py-1 rounded-md ra-tabular"
            style={{
              color: isRedTime ? 'var(--error)' : 'var(--text-primary)',
              backgroundColor: isRedTime ? 'var(--error-bg)' : 'var(--bg-elevated)',
              border: `1px solid ${isRedTime ? 'var(--error-border)' : 'var(--border)'}`,
            }}
            title="Time remaining"
          >
            ⏱ {formatTime(timeLeft)}
          </span>
          <button
            onClick={() => setResetOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-md cursor-pointer"
            style={{
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.borderColor = 'var(--border-hover)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
            title="Reset to default code"
            aria-label="Reset to default code"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Problem panel */}
        <div
          className="w-full lg:w-80 lg:flex-shrink-0 lg:overflow-y-auto"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRight: isMobile ? 'none' : '1px solid var(--border)',
            borderBottom: isMobile ? '1px solid var(--border)' : 'none',
            maxHeight: isMobile ? (problemOpen ? '60vh' : '50px') : 'none',
            transition: 'max-height 0.25s ease',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setProblemOpen(o => !o)}
            className="lg:hidden w-full flex items-center justify-between px-4 py-3 text-sm font-medium cursor-pointer"
            style={{ color: 'var(--text-primary)' }}
            aria-expanded={problemOpen}
          >
            <span>Problem · {problem.title}</span>
            <ChevronDown size={16} style={{ transform: problemOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          <div className="p-5 lg:block" style={{ display: !isMobile || problemOpen ? 'block' : 'none' }}>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {problem.title}
              </h2>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  color: difficultyConfig[problem.difficulty].color,
                  backgroundColor: difficultyConfig[problem.difficulty].bg,
                }}
              >
                {problem.difficulty}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4 whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
              {problem.description}
            </p>
            <div className="mb-4">
              <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Constraints</p>
              <ul className="space-y-1">
                {problem.constraints.map(c => (
                  <li key={c} className="text-xs flex gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--accent)' }}>•</span>{c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Examples</p>
              {problem.examples.map((ex, i) => (
                <div
                  key={i}
                  className="mb-3 p-3 rounded-md text-xs font-mono"
                  style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)' }}
                >
                  <p className="mb-1" style={{ color: 'var(--text-primary)' }}>Input: {ex.input}</p>
                  <p className="mb-1" style={{ color: 'var(--text-primary)' }}>Output: {ex.output}</p>
                  <p style={{ color: 'var(--text-secondary)' }}>{ex.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col min-w-0" style={{ backgroundColor: 'var(--editor-bg)' }}>
          <div
            className="flex items-center justify-between px-4 py-2"
            style={{ borderBottom: '1px solid var(--editor-border)' }}
          >
            <div className="relative">
              <select
                value={language}
                onChange={e => {
                  setLanguage(e.target.value);
                  setCode(starterCode[e.target.value]);
                  setRan(false);
                  setConsoleOutput('');
                }}
                className="appearance-none pl-3 pr-7 py-1.5 text-sm rounded-md cursor-pointer font-mono"
                style={{
                  border: '1px solid var(--editor-border)',
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--editor-text)',
                }}
                aria-label="Programming language"
              >
                {['Python', 'JavaScript', 'Java'].map(l => <option key={l}>{l}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
            </div>
            <button
              onClick={handleRun}
              disabled={running}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-white rounded-md cursor-pointer disabled:opacity-70"
              style={{ backgroundColor: 'var(--success)' }}
              onMouseEnter={e => { if (!running) e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              title="Run Code (Ctrl+Enter)"
              aria-label="Run code"
            >
              {running ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
              {running ? 'Running...' : 'Run Code'}
              <span className="hidden md:inline opacity-80 text-xs ml-1">⌘↵</span>
            </button>
          </div>

          <div className="flex-1" style={{ minHeight: isMobile ? 320 : 'auto' }}>
            <div className="flex h-full">
              <div
                className="px-3 py-3 text-right select-none flex-shrink-0 font-mono"
                style={{
                  color: 'var(--editor-line-num)',
                  backgroundColor: 'var(--editor-line-bg)',
                  fontSize: '0.8125rem',
                  minWidth: '2.5rem',
                }}
              >
                {code.split('\n').map((_, i) => (
                  <div key={i} style={{ lineHeight: '1.6' }}>{i + 1}</div>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={code}
                onChange={e => setCode(e.target.value)}
                className="flex-1 p-3 outline-none resize-none font-mono"
                style={{
                  backgroundColor: 'var(--editor-bg)',
                  color: 'var(--editor-text)',
                  fontSize: '0.8125rem',
                  lineHeight: '1.6',
                  caretColor: 'var(--accent)',
                  minHeight: 300,
                }}
                spellCheck={false}
                aria-label="Code editor"
              />
            </div>
          </div>

          <div
            className="flex-shrink-0"
            style={{ borderTop: '1px solid var(--editor-border)', backgroundColor: 'var(--console-bg)', height: 150 }}
          >
            <div
              className="px-4 py-1.5 text-xs font-medium font-mono"
              style={{ borderBottom: '1px solid var(--editor-border)', color: 'var(--editor-line-num)' }}
            >
              Console Output
            </div>
            <pre
              className="px-4 py-3 text-xs overflow-auto font-mono"
              style={{
                color: consoleOutput.includes('[PASS]') ? 'var(--success)' : 'var(--console-text)',
                height: 115,
              }}
            >
              {consoleOutput || 'Click "Run Code" (or press Ctrl+Enter) to see output...'}
            </pre>
          </div>
        </div>

        {/* Test cases */}
        <div
          className="w-full lg:w-60 flex flex-col flex-shrink-0"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderLeft: isMobile ? 'none' : '1px solid var(--border)',
            borderTop: isMobile ? '1px solid var(--border)' : 'none',
          }}
        >
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Test Cases</p>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {testCases.map((tc, i) => (
              <div
                key={i}
                className="p-2.5 rounded-md text-xs"
                style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)' }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  {ran ? (
                    tc.passed
                      ? <CheckCircle size={12} style={{ color: 'var(--success)' }} />
                      : <XCircle    size={12} style={{ color: 'var(--error)' }} />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full" style={{ border: '1px solid var(--text-disabled)' }} />
                  )}
                  <span className="font-medium" style={{ color: ran ? (tc.passed ? 'var(--success)' : 'var(--error)') : 'var(--text-secondary)' }}>
                    Case {i + 1}
                  </span>
                </div>
                <p className="font-mono mb-0.5" style={{ color: 'var(--text-secondary)' }}>{tc.input}</p>
                <p style={{ color: 'var(--text-secondary)' }}>Expected: {tc.expected}</p>
                {ran && <p style={{ color: tc.passed ? 'var(--success)' : 'var(--error)' }}>Got: {tc.actual}</p>}
              </div>
            ))}
          </div>
          <div className="p-3" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="relative group">
              <button
                onClick={handleSubmit}
                disabled={submitDisabled}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-white rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                style={{ backgroundColor: 'var(--accent)' }}
                onMouseEnter={e => { if (!submitDisabled) e.currentTarget.style.backgroundColor = 'var(--accent-hover)'; }}
                onMouseLeave={e => { if (!submitDisabled) e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
                aria-label="Submit solution"
                aria-describedby="submit-help"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {submitting ? 'Processing...' : 'Submit Solution'}
              </button>
              {!ran && !submitting && (
                <div
                  id="submit-help"
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-elevated)',
                    zIndex: 10,
                  }}
                  role="tooltip"
                >
                  Run your code at least once before submitting.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset code to default?</AlertDialogTitle>
            <AlertDialogDescription>
              This will erase your current code and restore the starter template. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReset}
              style={{ backgroundColor: 'var(--error)', color: '#fff' }}
            >
              Reset code
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
