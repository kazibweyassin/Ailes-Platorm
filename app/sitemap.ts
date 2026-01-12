import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ailesglobal.com'
  
  // Static pages with priorities
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/scholarships`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/scholarships/match`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/scholarships/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/scholarships/deadlines`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/find-scholarships`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/university-matcher`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/success-stories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pricing/success-based`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sponsor`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Country destination pages
  const countries = [
    'united-states',
    'united-kingdom',
    'canada',
    'germany',
    'australia',
    'netherlands',
    'france',
    'sweden',
    'norway',
    'denmark',
    'switzerland',
    'new-zealand',
    'south-korea',
    'japan',
    'singapore',
  ]

  const countryPages: MetadataRoute.Sitemap = countries.map((country) => ({
    url: `${baseUrl}/destinations/${country}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Dynamic scholarship pages
  let scholarshipPages: MetadataRoute.Sitemap = []
  try {
    // Fetch featured and verified scholarships first (higher priority)
    const featuredScholarships = await prisma.scholarship.findMany({
      where: {
        OR: [
          { featured: true },
          { verified: true },
        ],
      },
      select: {
        id: true,
        updatedAt: true,
        featured: true,
        verified: true,
      },
      take: 500,
    })

    // Fetch other active scholarships (not expired or no deadline)
    const activeScholarships = await prisma.scholarship.findMany({
      where: {
        AND: [
          { featured: false },
          { verified: false },
          {
            OR: [
              { deadline: { gte: new Date() } },
              { deadline: null },
            ],
          },
        ],
      },
      select: {
        id: true,
        updatedAt: true,
        featured: true,
        verified: true,
      },
      take: 500,
    })

    // Combine and create sitemap entries
    const allScholarships = [...featuredScholarships, ...activeScholarships]
    
    scholarshipPages = allScholarships.map((scholarship) => ({
      url: `${baseUrl}/scholarships/${scholarship.id}`,
      lastModified: scholarship.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: (scholarship.featured || scholarship.verified) ? 0.85 : 0.8,
    }))
  } catch (error) {
    console.error('Error fetching scholarships for sitemap:', error)
    // Continue without scholarship pages if DB fails
  }

  return [...staticPages, ...countryPages, ...scholarshipPages]
}
