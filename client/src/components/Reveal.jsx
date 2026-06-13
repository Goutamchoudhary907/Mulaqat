import { useEffect, useRef } from 'react';

/**
 * Reveals its children once, when they scroll into view — a rise with a
 * focus-pull (blur → sharp). `delay` (ms) staggers siblings.
 */
export default function Reveal({ delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in');
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ '--rd': `${delay}ms` }} {...rest}>
      {children}
    </div>
  );
}
