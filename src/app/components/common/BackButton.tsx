import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

interface Props {
  to?: string;
  label?: string;
  className?: string;
}

export default function BackButton({ to, label = 'Back', className = '' }: Props) {
  const navigate = useNavigate();

  const handle = () => {
    if (to) navigate(to);
    else navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={handle}
      className={`inline-flex items-center gap-1.5 text-sm cursor-pointer ${className}`}
      style={{
        color: 'var(--text-secondary)',
        padding: '6px 10px',
        borderRadius: 'var(--radius-sm)',
        background: 'transparent',
        border: '1px solid transparent',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.color = 'var(--text-primary)';
        el.style.background = 'var(--accent-subtle)';
        el.style.borderColor = 'var(--border)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.color = 'var(--text-secondary)';
        el.style.background = 'transparent';
        el.style.borderColor = 'transparent';
      }}
    >
      <ArrowLeft size={15} />
      <span>{label}</span>
    </button>
  );
}
