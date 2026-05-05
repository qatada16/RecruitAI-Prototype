import { Toaster } from 'sonner';
import { useTheme } from '../../context/ThemeContext';

export default function AppToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      theme={theme}
      duration={4000}
      toastOptions={{
        style: {
          background: 'var(--bg-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        },
      }}
    />
  );
}
