import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import {
  buildRouteSchema,
  notFoundMeta,
  routeMeta,
  siteUrl,
  socialImage,
} from '@/content/siteMeta';

const INDEX_ROBOTS = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

const SiteMeta = () => {
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const knownRoute = Boolean(routeMeta[normalizedPath]);
  const meta = routeMeta[normalizedPath] || notFoundMeta;
  const canonical = knownRoute
    ? `${siteUrl}${normalizedPath === '/' ? '/' : normalizedPath}`
    : null;
  const schema = knownRoute ? buildRouteSchema(normalizedPath) : null;

  return (
    <Helmet>
      <html lang="en" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta
        name="robots"
        content={knownRoute ? INDEX_ROBOTS : 'noindex,follow'}
      />
      {knownRoute && <link rel="canonical" href={canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Linart Construction Inc." />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      {knownRoute && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={socialImage.url} />
      <meta property="og:image:alt" content={socialImage.alt} />
      <meta property="og:image:width" content={socialImage.width} />
      <meta property="og:image:height" content={socialImage.height} />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={socialImage.url} />
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SiteMeta;
