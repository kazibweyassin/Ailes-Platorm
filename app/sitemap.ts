import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ailesglobal.com'
  
  const routes = [
    '',
    '/about',
    '/services',
    '/scholarships',
    '/scholarships/match',
    '/scholarships/compare',
    '/scholarships/deadlines',
    '/university-matcher',
    '/success-stories',
    '/blog',
    '/pricing',
    '/contact',
    '/sponsor',
  ]

  const staticPages: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : route.includes('blog') ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route.includes('scholarships') ? 0.9 : 0.8,
  }))

  // Add country destination pages
  const countries = [
    'united-states',
    'united-kingdom', 
    'canada',
    'germany',
    'australia',
    'netherlands',
  ]

  const countryPages: MetadataRoute.Sitemap = countries.map((country) => ({
    url: `${baseUrl}/destinations/${country}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...countryPages]
}
