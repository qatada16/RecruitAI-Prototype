import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Mic, Loader2, HelpCircle, ExternalLink } from 'lucide-react';
import { useCandidateContext } from '../../context/CandidateContext';
import BackButton from '../../components/common/BackButton';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '../../components/ui/dialog';

const questions = [
  'Tell me about yourself and your background in software engineering.',
  'Describe your most technically challenging project and how you solved it.',
  'How do you approach code reviews and maintaining code quality in a team?',
  'Tell me about a time you had a disagreement with a technical decision.',
  'How do you stay current with new technologies and best practices?',
  'Describe a situation where you had to meet a tight deadline.',
  'Where do you see yourself in 3 years, and how does this role fit?',
];

type State = 'idle' | 'recording' | 'processing' | 'done';

const liveResponses = [
  'I have over five years of experience building scalable web applications...',
  'The most challenging project was at Stripe, where we had to redesign our dashboard for two million merchants...',
  'I think code reviews should be collaborative and constructive. I always focus on the why behind each suggestion...',
  'There was a time we debated between REST and GraphQL — I made my case clearly and we reached a compromise...',
  'I follow key engineering blogs, attend local meetups, and try to build a small project with any new framework...',
  'At Airbnb, we had a two-week sprint to ship a redesign. I prioritized ruthlessly and delegated effectively...',
  'I want to grow into a principal engineer role, leading architecture decisions. This position gives me that path...',
];

export default function VoiceInterview() {
  const navigate = useNavigate();
  const { setVoiceStatus } = useCandidateContext();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [state, setState] = useState<State>('idle');
  const [transcript, setTranscript] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [useTextMode, setUseTextMode] = useState(false);
  const [textInput, setTextInput] = useState('');
  const processingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePushToTalk = () => {
    if (state === 'idle') {
      setState('recording');
      setTranscript('');
      let idx = 0;
      const response = liveResponses[questionIndex] + ' ';
      const timer = setInterval(() => {
        idx += 3;
        setTranscript(response.slice(0, idx));
        if (idx >= response.length) clearInterval(timer);
      }, 60);
    } else if (state === 'recording') {
      setState('processing');
      processingTimer.current = setTimeout(() => {
        setState('done');
      }, 1500);
    }
  };

  const handleNext = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(i => i + 1);
      setState('idle');
      setTranscript('');
      setTextInput('');
    } else {
      setVoiceStatus('completed');
      toast.success('Voice interview completed');
      navigate('/candidate');
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    setTranscript(textInput);
    setState('done');
  };

  useEffect(() => {
    return () => {
      if (processingTimer.current) clearTimeout(processingTimer.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-base)' }}>
      <div className="px-4 sm:px-8 pt-4">
        <BackButton to="/candidate" label="Back to Dashboard" />
      </div>

      <div
        className="flex items-center justify-between px-4 sm:px-8 py-3 mt-3"
        style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
      >
        <div
          className="text-sm font-medium px-3 py-1 rounded-md"
          style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}
        >
          Question {questionIndex + 1} of {questions.length}
        </div>
        <div className="hidden sm:flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all"
              style={{
                width: i === questionIndex ? 24 : 8,
                height: 8,
                backgroundColor:
                  i < questionIndex ? 'var(--success)' :
                  i === questionIndex ? 'var(--accent)' :
                  'var(--bg-elevated)',
              }}
              aria-label={`Question ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setShowHelpModal(true)}
          className="flex items-center gap-1.5 text-sm cursor-pointer rounded-md px-2 py-1"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--accent)';
            e.currentTarget.style.backgroundColor = 'var(--accent-subtle)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <HelpCircle size={15} />
          Having issues?
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-8">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-7"
          style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        >
          {state === 'recording' ? (
            <div className="flex items-end gap-0.5">
              {[12, 20, 14, 22, 10, 18, 16].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 rounded-full"
                  style={{
                    height: `${h}px`,
                    backgroundColor: 'var(--error)',
                    animation: `ra-bar 0.${i + 4}s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>
          ) : (
            <Mic size={32} style={{ color: 'var(--accent)' }} />
          )}
        </div>

        <div
          className="w-full max-w-2xl rounded-lg p-6 mb-6"
          style={{
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-surface)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <p className="text-xs mb-2 uppercase font-medium tracking-wide" style={{ color: 'var(--text-secondary)' }}>
            Current Question
          </p>
          <p style={{ fontSize: '1.0625rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
            {questions[questionIndex]}
          </p>
        </div>

        {useTextMode ? (
          <div className="w-full max-w-2xl mb-6">
            <textarea
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder="Type your response here..."
              rows={4}
              className="w-full px-4 py-3 text-sm rounded-lg outline-none resize-none"
              style={{
                border: '1px solid var(--border-input)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'var(--border-focus)';
                e.target.style.boxShadow = '0 0 0 3px var(--accent-subtle)';
              }}
              onBlur={e => {
                e.target.style.borderColor = 'var(--border-input)';
                e.target.style.boxShadow = 'none';
              }}
              aria-label="Text response"
            />
            <button
              onClick={handleTextSubmit}
              disabled={!textInput.trim()}
              className="mt-2 px-4 py-2 text-sm text-white rounded-md disabled:opacity-50 cursor-pointer"
              style={{ backgroundColor: 'var(--accent)' }}
              onMouseEnter={e => { if (textInput.trim()) e.currentTarget.style.backgroundColor = 'var(--accent-hover)'; }}
              onMouseLeave={e => { if (textInput.trim()) e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
            >
              Submit Response
            </button>
          </div>
        ) : transcript ? (
          <div
            className="w-full max-w-2xl rounded-lg p-4 mb-6 text-sm leading-relaxed"
            style={{
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              minHeight: 72,
            }}
          >
            {transcript}
            {state === 'recording' && (
              <span
                className="inline-block w-0.5 h-4 ml-0.5 align-text-bottom"
                style={{ backgroundColor: 'var(--accent)', animation: 'ra-blink 1s step-end infinite' }}
              />
            )}
          </div>
        ) : null}

        {!useTextMode && (
          <div className="flex flex-col items-center gap-3">
            {state === 'processing' ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 size={28} className="animate-spin" style={{ color: 'var(--accent)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Processing response...</span>
              </div>
            ) : state === 'done' ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 text-white rounded-md text-sm font-medium cursor-pointer"
                style={{ backgroundColor: 'var(--success)' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.92'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                {questionIndex < questions.length - 1 ? 'Next Question →' : 'Complete Interview'}
              </button>
            ) : (
              <button
                onMouseDown={handlePushToTalk}
                onMouseUp={state === 'recording' ? handlePushToTalk : undefined}
                onTouchStart={handlePushToTalk}
                onTouchEnd={state === 'recording' ? handlePushToTalk : undefined}
                className="min-w-44 py-3.5 px-6 text-white rounded-md text-sm font-medium cursor-pointer"
                style={{
                  backgroundColor: state === 'recording' ? 'var(--error)' : 'var(--accent)',
                  minHeight: 44,
                }}
                onMouseEnter={e => { if (state === 'idle') e.currentTarget.style.backgroundColor = 'var(--accent-hover)'; }}
                onMouseLeave={e => { if (state === 'idle') e.currentTarget.style.backgroundColor = 'var(--accent)'; }}
                aria-pressed={state === 'recording'}
              >
                {state === 'recording' ? 'Recording... Release' : '● Push to Talk'}
              </button>
            )}
            {state === 'idle' && (
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Hold the button while speaking, release to submit.
              </p>
            )}
          </div>
        )}
      </div>

      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Microphone not working?</DialogTitle>
            <DialogDescription>
              If your microphone isn't accessible, switch to text-based responses for this
              interview. Your typed answers will be evaluated the same way.
            </DialogDescription>
          </DialogHeader>
          <div
            className="rounded-md p-3 text-sm"
            style={{
              backgroundColor: 'var(--error-bg)',
              border: '1px solid var(--error-border)',
              color: 'var(--text-primary)',
            }}
          >
            <p className="font-medium mb-1" style={{ color: 'var(--error)' }}>Quick fix</p>
            <p style={{ color: 'var(--text-secondary)' }}>
              Click the lock icon in your browser's address bar and ensure microphone access
              is allowed for this site.{' '}
              <a
                href="chrome://settings/content/microphone"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1"
                style={{ color: 'var(--accent)' }}
              >
                Open browser settings <ExternalLink size={12} />
              </a>
            </p>
          </div>
          <DialogFooter>
            <button
              onClick={() => setShowHelpModal(false)}
              className="px-4 py-2 text-sm rounded-md cursor-pointer"
              style={{
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent',
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => {
                setUseTextMode(true);
                setState('idle');
                setShowHelpModal(false);
                toast.info('Switched to text responses');
              }}
              className="px-4 py-2 text-sm text-white rounded-md cursor-pointer font-medium"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Switch to Text Responses
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes ra-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes ra-bar { from { transform: scaleY(0.5); } to { transform: scaleY(1.2); } }
      `}</style>
    </div>
  );
}
