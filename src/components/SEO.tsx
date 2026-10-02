import { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  schema?: object | object[];
}

const DEFAULT_TITLE = 'Melodiva Skin Care - Authentic Nigerian Black Soap & Pure Kernel Oil';
const DEFAULT_DESCRIPTION = 'Discover authentic African black soaps and 100% pure cold-pressed natural palm kernel oil by Melodiva Skin Care. Handcrafted for healthy, glowing skin across Nigeria.';
const DEFAULT_KEYWORDS = 'Melodiva skin care, natural black soap Nigeria, pure palm kernel oil, organic skincare Africa, African black soap, cold pressed kernel oil, glowing skin products';
const DOMAIN = 'https://melodivaproducts.com';
const DEFAULT_OG_IMAGE = `${DOMAIN}/og-image.jpg`;

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  schema,
}: SEOProps) {
  const fullTitle = title ? `${title} | Melodiva Skin Care` : DEFAULT_TITLE;
  const canonicalUrl = canonical ? (canonical.startsWith('http') ? canonical : `${DOMAIN}${canonical}`) : DOMAIN;
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${DOMAIN}${ogImage}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);
    setMetaTag('meta[name="author"]', 'name', 'author', 'Melodiva Skin Care');

    // 3. Open Graph Meta Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', imageUrl);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Melodiva Skin Care');
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_NG');

    // 4. Twitter Card Meta Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);

    // 5. Canonical Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 6. JSON-LD Structured Data Script
    let jsonLdScript = document.querySelector('#seo-json-ld');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.setAttribute('type', 'application/ld+json');
      jsonLdScript.setAttribute('id', 'seo-json-ld');
      document.head.appendChild(jsonLdScript);
    }

    const defaultOrganizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      'name': 'Melodiva Skin Care',
      'url': DOMAIN,
      'logo': `${DOMAIN}/melodiva-logo.png`,
      'image': `${DOMAIN}/og-image.jpg`,
      'description': DEFAULT_DESCRIPTION,
      'telephone': '+2348000000000',
      'email': 'hello@melodivaproducts.com',
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'NG',
      },
      'sameAs': [
        'https://chat.whatsapp.com/HZcUsXKZ6d75MTXa5CjqCR',
      ],
      'priceRange': '₦3,500 - ₦25,000',
    };

    const schemasToInject = schema
      ? (Array.isArray(schema) ? [defaultOrganizationSchema, ...schema] : [defaultOrganizationSchema, schema])
      : [defaultOrganizationSchema];

    jsonLdScript.textContent = JSON.stringify(schemasToInject);

  }, [fullTitle, description, keywords, canonicalUrl, imageUrl, ogType, schema]);

  return null;
}
