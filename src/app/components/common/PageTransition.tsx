import { useLocation } from 'react-router';
import { useEffect, useState, type ReactNode } from 'react';

export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [key, setKey] = useState(location.pathname);

  useEffect(() => {
    setKey(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return (
    <div key={key} className="ra-page-enter">
      {children}
    </div>
  );
}
