import { serviceDetails } from './serviceDetails.js';

export const siteUrl = 'https://linartinc.com';
export const siteName = 'Linart Construction Inc.';

export const socialImage = {
  url: `${siteUrl}/branding/linart-home-social.webp`,
  alt: 'Brick and stone residence by Linart Construction Inc.',
  width: '1200',
  height: '630',
};

const LASTMOD = '2026-09-20';

const coreRouteMeta = {
  '/': {
    title: 'New Jersey Custom Homes & Remodeling | Linart Construction',
    description:
      'Family-owned since 2004. Linart Construction builds custom homes, additions, renovations, kitchens, bathrooms, basements, decks and patios across New Jersey.',
    priority: '1.0',
    changefreq: 'weekly',
    lastmod: LASTMOD,
    breadcrumbs: [{ name: 'Home', path: '/' }],
  },
  '/about': {
    title: 'About Linart Construction | New Jersey Builder Since 2004',
    description:
      'Learn about Linart Construction Inc., a family-owned New Jersey residential construction company building custom homes and renovations since 2004.',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: LASTMOD,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'About', path: '/about' },
    ],
  },
  '/services': {
    title: 'Residential Construction Services in New Jersey | Linart',
    description:
      'Explore Linart Construction services for custom homes, additions, whole-home renovations, kitchens, bathrooms, basements, decks and patios in New Jersey.',
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: LASTMOD,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
    ],
  },
  '/projects': {
    title: 'New Jersey Home Construction & Remodeling Projects | Linart',
    description:
      'View selected custom home, addition, renovation, kitchen, bathroom, deck, patio and concrete work completed by Linart Construction in New Jersey.',
    priority: '0.9',
    changefreq: 'monthly',
    lastmod: LASTMOD,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' },
    ],
  },
  '/service-areas': {
    title: 'New Jersey Construction Service Areas | Linart Construction',
    description:
      'Linart Construction serves New Jersey homeowners, with core service across Atlantic, Burlington, Camden, Gloucester and Ocean counties and select projects beyond.',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: LASTMOD,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Service Areas', path: '/service-areas' },
    ],
  },
  '/contact': {
    title: 'Start a Residential Construction Project | Linart Construction',
    description:
      'Contact Linart Construction about a custom home, addition, renovation, kitchen, bathroom, basement, deck or patio project in New Jersey.',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: LASTMOD,
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Start a Project', path: '/contact' },
    ],
  },
};

const serviceRouteMeta = Object.fromEntries(
  serviceDetails.map((service) => {
    const path = `/services/${service.slug}`;
    return [
      path,
      {
        title: service.seoTitle,
        description: service.seoDescription,
        priority: '0.85',
        changefreq: 'monthly',
        lastmod: LASTMOD,
        serviceName: service.title,
        breadcrumbs: [
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: service.title, path },
        ],
      },
    ];
  }),
);

export const routeMeta = {
  ...coreRouteMeta,
  ...serviceRouteMeta,
};

export const notFoundMeta = {
  title: 'Page Not Found | Linart Construction Inc.',
  description:
    'Return to Linart Construction Inc. to explore residential construction services and project work in New Jersey.',
};

const absoluteUrl = (path) => `${siteUrl}${path === '/' ? '/' : path}`;

export const buildRouteSchema = (path) => {
  const meta = routeMeta[path];
  if (!meta) return null;

  const canonical = absoluteUrl(path);
  const webpageId = `${canonical}#webpage`;

  const graph = [
    {
      '@type': 'WebPage',
      '@id': webpageId,
      url: canonical,
      name: meta.title,
      description: meta.description,
      isPartOf: { '@id': `${siteUrl}/#website` },
      about: { '@id': `${siteUrl}/#business` },
      inLanguage: 'en-US',
    },
  ];

  if (meta.breadcrumbs?.length > 1) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: meta.breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    });
  }

  if (meta.serviceName) {
    graph.push({
      '@type': 'Service',
      '@id': `${canonical}#service`,
      name: meta.serviceName,
      description: meta.description,
      url: canonical,
      provider: { '@id': `${siteUrl}/#business` },
      areaServed: { '@type': 'State', name: 'New Jersey' },
      mainEntityOfPage: { '@id': webpageId },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
};
