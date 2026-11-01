// Single source of truth for verified centre details.
// Phone, WhatsApp, email and address are preserved from the original website.

export const SITE = {
  name: 'NEW LIFE CARE',
  phones: [
    { display: '+91 89256 20885', tel: '+918925620885' },
    { display: '+91 89256 20886', tel: '+918925620886' },
    { display: '+91 89256 20887', tel: '+918925620887' },
  ],
  whatsapp: { display: '+91 89256 20885', number: '918925620885' },
  email: 'newlifecarecbe@gmail.com',
  address: [
    'No. 3/3, Bajanai Kovil Street',
    'Udayampalayam, Coimbatore – 641049',
    'Tamil Nadu, India',
  ],
  mapQuery: 'No. 3/3, Bajanai Kovil Street, Udayampalayam, Coimbatore 641049, Tamil Nadu, India',
  // National emergency number in India.
  emergencyNumber: '112',
  /**
   * IMPORTANT: leave `false` until the centre confirms that enquiries are
   * genuinely monitored 24/7. When false, the site shows neutral wording such
   * as "Contact Us for Enquiries". Flip it with VITE_ENQUIRIES_247=true.
   */
  enquiries247Confirmed: import.meta.env?.VITE_ENQUIRIES_247 === 'true',
  social: [
    { id: 'facebook', icon: 'facebook', url: 'https://www.facebook.com/share/1FEtTz1n3V/?mibextid=wwXIfr' },
    { id: 'instagram', icon: 'instagram', url: 'https://www.instagram.com/newlifecarecbe?srtk=cDQ4b2dmcjc5cXN5' },
    { id: 'youtube', icon: 'youtube', url: 'https://youtube.com/@newlifedeaddictionrehabcbe?si=GDBlnm9WeqiMIaFa' },
  ],
};

export const whatsappUrl = (text) =>
  `https://wa.me/${SITE.whatsapp.number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const telUrl = (tel = SITE.phones[0].tel) => `tel:${tel}`;
export const mailUrl = () => `mailto:${SITE.email}`;

export const mapEmbedUrl = () =>
  `https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`;
export const mapLinkUrl = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapQuery)}`;
