// Single navigation model used by the header (desktop + mobile) and the footer.
export const NAV = [
  { type: 'link', to: '/', key: 'nav.home', end: true },
  {
    type: 'group',
    id: 'about',
    key: 'nav.aboutGroup',
    items: [
      { to: '/about', key: 'nav.about' },
      { to: '/team', key: 'nav.team' },
      { to: '/facilities', key: 'nav.facilities' },
      { to: '/gallery', key: 'nav.gallery' },
      { to: '/testimonials', key: 'nav.testimonials' },
    ],
  },
  {
    type: 'group',
    id: 'care',
    key: 'nav.careGroup',
    items: [
      { to: '/services', key: 'nav.services' },
      { to: '/treatment-programs', key: 'nav.programs' },
      { to: '/rehabilitation-journey', key: 'nav.journey' },
      { to: '/aftercare', key: 'nav.aftercare' },
    ],
  },
  { type: 'link', to: '/family-support', key: 'nav.family' },
  { type: 'link', to: '/faq', key: 'nav.faq' },
  { type: 'link', to: '/contact', key: 'nav.contact' },
];

export const CONFIDENTIAL_PATH = '/confidential-enquiry';
