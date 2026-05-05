import type { CSSProperties } from 'react';

interface Props {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
  style?: CSSProperties;
}

export default function Skeleton({ width, height = 12, radius = 6, className = '', style }: Props) {
  return (
    <div
      className={`ra-skeleton ${className}`}
      aria-hidden="true"
      style={{
        width: width ?? '100%',
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}
