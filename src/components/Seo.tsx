import React from 'react';
import { Helmet } from 'react-helmet-async';

type SeoProps = {
  title: string;
  description: string;
  canonical: string;
  noindex?: boolean;
};

const Seo: React.FC<SeoProps> = ({ title, description, canonical, noindex }) => (
  <Helmet>
    <html lang="bn" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    {noindex && <meta name="robots" content="noindex" />}
  </Helmet>
);

export default Seo;
