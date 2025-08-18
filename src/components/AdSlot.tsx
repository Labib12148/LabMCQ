import React, { useEffect, useRef } from 'react';
import { PUBLISHER_ID } from '@/config/adsense';

type AdSlotProps = {
  slot?: string;
  height?: number;
};

const AdSlot: React.FC<AdSlotProps> = ({ slot = '1234567890', height = 250 }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);
  return (
    <ins
      className="adsbygoogle block w-full"
      style={{ display: 'block', height: `${height}px` }}
      data-ad-client={`ca-${PUBLISHER_ID}`}
      data-ad-slot={slot}
      ref={ref as any}
    />
  );
};

export default AdSlot;
