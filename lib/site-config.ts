/**
 * Central place for business details used across the site (header, footer,
 * hero, JSON-LD, social proof section, etc).
 *
 * TO CHANGE CONTACT DETAILS: edit the values below — every component that
 * displays the phone number, booking link, website, or Instagram handle
 * imports from here, so a single edit updates the whole site.
 */
export const siteConfig = {
  businessName: "Desi Dollhouse",
  tagline: "Pflugerville Beauty Studio",
  location: "Pflugerville, Texas",
  phone: "(314) 307-9379",
  phoneHref: "tel:+13143079379",
  website: "https://www.dessidollhouse.com/",
  instagramUrl: "https://www.instagram.com/dessii314",
  instagramHandle: "@dessii314",
  bookingUrl:
    "https://book.squareup.com/appointments/yvhpd1fzn5mwxb/location/L0ZEZ8T485A7X/services",
  // Placeholder canonical domain — update once the production domain for
  // this landing page is finalized (see README "Canonical domain" section).
  canonicalUrl: "https://www.dessidollhouse.com/",
} as const;
