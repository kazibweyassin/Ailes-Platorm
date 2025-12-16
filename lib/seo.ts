import { Metadata } from 'next'

interface SEOProps {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  noIndex?: boolean
  article?: {
    publishedTime: string
    modifiedTime?: string
    author?: string
  }
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ailesglobal.com'
// Use dynamic OG image generator, fallback to static image
const defaultOgImage = `${baseUrl}/og?title=${encodeURIComponent('Ailes Global')}&description=${encodeURIComponent('Premium Study Abroad & Scholarship Consulting for African Students')}`
const fallbackOgImage = `${baseUrl}/og-image.jpg`

export function generateSEO({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  noIndex = false,
  article,
}: SEOProps): Metadata {
  const fullTitle = title.includes('Ailes Global') ? title : `${title} | Ailes Global`
  const url = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl
  
  // Generate dynamic OG image URL if no custom image provided
  let image = ogImage
  if (!image) {
    // Use dynamic OG image generator with title and description
    const ogTitle = encodeURIComponent(fullTitle)
    const ogDescription = encodeURIComponent(description.substring(0, 150)) // Limit description length
    image = `${baseUrl}/og?title=${ogTitle}&description=${ogDescription}`
  }

  const defaultKeywords = [
    'study abroad',
    'scholarships',
    'African students',
    'women scholarships',
    'university matching',
    'education consulting',
    'scholarship finder',
    'study overseas',
    'international education',
  ]

  return {
    title: fullTitle,
    description,
    keywords: [...defaultKeywords, ...keywords],
    authors: [{ name: 'Ailes Global', url: baseUrl }],
    creator: 'Ailes Global',
    publisher: 'Ailes Global',
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    openGraph: {
      type: article ? 'article' : 'website',
      locale: 'en_US',
      url,
      title: fullTitle,
      description,
      siteName: 'Ailes Global',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      ...(article && {
        publishedTime: article.publishedTime,
        modifiedTime: article.modifiedTime,
        authors: article.author ? [article.author] : undefined,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@AilesGlobal',
      site: '@AilesGlobal',
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'iaKmQyNu5cZoj9I84LsHRYK6jPR6hSEvkbi8JobjJxo',
    },
    metadataBase: new URL(baseUrl),
  }
}

// JSON-LD Schema Generator
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Ailes Global',
    description: 'Premium study abroad and scholarship consulting for African students',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://facebook.com/ailesglobal',
      'https://twitter.com/ailesglobal',
      'https://linkedin.com/company/ailesglobal',
      'https://instagram.com/ailesglobal',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Kenya',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'info@ailesglobal.com',
    },
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ailes Global',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/scholarships?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  }
}

export function generateScholarshipSchema(scholarship: {
  name: string
  provider: string
  amount: number
  currency: string
  deadline: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MonetaryGrant',
    name: scholarship.name,
    description: scholarship.description,
    funder: {
      '@type': 'Organization',
      name: scholarship.provider,
    },
    amount: {
      '@type': 'MonetaryAmount',
      value: scholarship.amount,
      currency: scholarship.currency,
    },
    url: `${baseUrl}${scholarship.url}`,
    validThrough: scholarship.deadline,
  }
}
