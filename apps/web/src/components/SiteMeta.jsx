import React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

const siteUrl = 'https://linartinc.com';

const routeMeta = {
  '/': {
    title: 'Linart Construction Inc. | Residential Construction & Remodeling in South Jersey',
    description: 'Linart Construction Inc. provides residential additions, renovations, kitchens, bathrooms and structural remodeling throughout southern New Jersey. Family-owned since 2004.',
  },
  '/about': {
    title: 'About Linart Construction Inc. | Family-Owned Since 2004',
    description: 'Meet the family-owned South Jersey residential construction company building under the Linart name since 2004.',
  },
  '/services': {
    title: 'Residential Construction Services | Linart Construction Inc.',
    description: 'Home additions, whole-home renovations, kitchen and bathroom remodeling, basement finishing and structural remodeling in southern New Jersey.',
  },
  '/projects': {
    title: 'Projects | Linart Construction Inc.',
    description: 'Selected residential additions and renovation work by Linart Construction Inc. throughout southern New Jersey.',
  },
  '/service-areas': {
    title: 'South Jersey Service Areas | Linart Construction Inc.',
    description: 'Linart Construction serves homeowners across southern New Jersey — Burlington, Camden, Gloucester, Atlantic and Ocean counties, plus Mercer, Cumberland, Salem and Cape May.',
  },
  '/contact': {
    title: 'Start a Project | Linart Construction Inc.',
    description: 'Contact Linart Construction Inc. about a residential addition, renovation or remodeling project in southern New Jersey.',
  },
};

const SiteMeta = () => {
  const { pathname } = useLocation();
  const meta = routeMeta[pathname] || {
    title: 'Page Not Found | Linart Construction Inc.',
    description: 'Return to Linart Construction Inc. to explore residential construction services and project work in New Jersey.',
  };
  const canonicalPath = routeMeta[pathname] ? pathname : '/';
  const canonical = `${siteUrl}${canonicalPath === '/' ? '' : canonicalPath}`;

  return (
    <Helmet>
      <html lang="en" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {!routeMeta[pathname] && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Linart Construction Inc." />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${siteUrl}/images/home/linart-residence-hero.webp`} />
      <meta property="og:image:alt" content="Residential construction by Linart Construction Inc." />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={`${siteUrl}/images/home/linart-residence-hero.webp`} />
    </Helmet>
  );
};

export default SiteMeta;
