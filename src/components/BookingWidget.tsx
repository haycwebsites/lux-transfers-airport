import { useState, useEffect } from 'react';

// TODO: Replace with the booking widget URL from the HAYC booking dashboard
const WIDGET_SRC = '';

export default function BookingWidget() {
  const [height, setHeight] = useState(600);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const allowed = ['booking.hayc.gr', 'frontend-staging-0139.up.railway.app'];
      if (!allowed.some(o => event.origin.includes(o))) return;
      if (event.data?.type === 'HAYC_BOOKING_WIDGET_RESIZE') {
        setHeight(Math.ceil(event.data.height));
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (!WIDGET_SRC) return null;

  return (
    <iframe
      src={WIDGET_SRC}
      style={{ width: '100%', height: `${height}px`, border: 'none', backgroundColor: '#F1F0F5' }}
      loading="lazy"
    />
  );
}