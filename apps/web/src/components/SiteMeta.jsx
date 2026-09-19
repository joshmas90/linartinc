import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { notFoundMeta, routeMeta, siteUrl, socialImage } from '@/content/siteMeta';

const SiteMeta = () => {
  const { pathname } = useLocation();
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  const meta = routeMeta[normalizedPath] || notFoundMeta;
  const canonicalPath = routeMeta[normalizedPath] ? normalizedPath : '/';
  const canonical = `${siteUrl}${canonicalPath === '/' ? '/' : canonicalPath}`;

  return (
    <Helmet>
      <html lang="en" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {!routeMeta[normalizedPath] && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Linart Construction Inc." />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={socialImage.url} />
      <meta property="og:image:alt" content={socialImage.alt} />
      <meta property="og:image:width" content={socialImage.width} />
      <meta property="og:image:height" content={socialImage.height} />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={socialImage.url} />
    </Helmet>
  );
};

export default SiteMeta;
