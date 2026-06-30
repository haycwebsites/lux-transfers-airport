import { useEffect, useRef } from 'react';

export default function ReviewsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const widget = document.createElement('div');
    widget.className = 'ti-widget';
    container.appendChild(widget);

    const script = document.createElement('script');
    script.src = 'https://cdn.trustindex.io/loader.js?wp-widget';
    script.async = true;
    script.dataset.trustindexLoader = 'true';
    document.body.appendChild(script);

    return () => {
      widget.remove();
      script.remove();
      document.querySelectorAll('.ti-widget').forEach((el) => el.remove());
    };
  }, []);

  return (
    <section>
      <div className="container py-4" ref={containerRef} />
    </section>
  );
}
