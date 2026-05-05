import { useEffect, useRef, useState } from 'react';

interface Props {
  value: number;
  durationMs?: number;
  format?: (n: number) => string;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export default function AnimatedCounter({
  value,
  durationMs = 800,
  format,
  className,
  suffix = '',
  prefix = '',
}: Props) {
  const [display, setDisplay] = useState(0);
  const start = useRef<number | null>(null);
  const from = useRef(0);

  useEffect(() => {
    start.current = null;
    from.current = display;
    let raf = 0;
    const step = (ts: number) => {
      if (start.current === null) start.current = ts;
      const elapsed = ts - start.current;
      const t = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from.current + (value - from.current) * eased;
      setDisplay(Math.round(next));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const text = format ? format(display) : display.toLocaleString();
  return <span className={`ra-tabular ${className ?? ''}`}>{prefix}{text}{suffix}</span>;
}
