import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [pulse, setPulse] = useState(false);

  const handle = () => {
    setPulse(true);
    toggleTheme();
    window.setTimeout(() => setPulse(false), 180);
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full cursor-pointer ${className}`}
      style={{
        color: 'var(--text-secondary)',
        backgroundColor: 'transparent',
        border: '1px solid transparent',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.backgroundColor = 'var(--accent-subtle)';
        el.style.color = 'var(--accent)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.backgroundColor = 'transparent';
        el.style.color = 'var(--text-secondary)';
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          transition: 'transform 0.18s ease',
          transform: pulse ? 'scale(1.18) rotate(20deg)' : 'scale(1) rotate(0)',
        }}
      >
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </span>
    </button>
  );
}
