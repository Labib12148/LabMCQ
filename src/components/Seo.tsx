import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ADSENSE_PUB_ID } from '@/config/adsense';

interface SeoProps {
  title: string;
  description: string;
  canonical: string;
  noIndex?: boolean;
  noAds?: boolean;
}

const Seo: React.FC<SeoProps> = ({ title, description, canonical, noIndex, noAds }) => (
  <Helmet>
    <html lang="bn" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    {noIndex && <meta name="robots" content="noindex" />}
    {!noIndex && !noAds && (
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`}
        crossOrigin="anonymous"
      />
    )}
  </Helmet>
);

export default Seo;
