import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_ORIGIN = import.meta.env.VITE_SITE_ORIGIN || 'https://labmcq.com';

export default function Seo({ title, description }) {
  const { pathname } = useLocation();
  const url = SITE_ORIGIN + pathname;
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
