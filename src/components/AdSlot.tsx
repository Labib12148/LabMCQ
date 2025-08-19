import React, { useEffect } from 'react';
import { ADSENSE_PUB_ID } from '@/config/adsense';

interface AdSlotProps {
  slotId: string;
  className?: string;
  height?: number;
}

const AdSlot: React.FC<AdSlotProps> = ({ slotId, className, height = 250 }) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className={className} style={{ minHeight: height }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_PUB_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSlot;
