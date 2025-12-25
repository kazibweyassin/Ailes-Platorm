import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import HomeClient from './page-client';

export const metadata: Metadata = generateSEO({
  title: 'Ailes Global - Find Scholarships First, Then Your University',
  description: "Africa's #1 scholarship-first platform. Discover fully-funded scholarships, match with top universities, and get expert guidance for studying abroad. Empowering African students, especially women.",
  keywords: [
    'scholarship finder',
    'study abroad Africa',
    'women in education',
    'fully funded scholarships',
    'university matching',
    'African students scholarships',
    'international education consulting',
    'study in USA',
    'study in UK',
    'study in Canada',
    'scholarship-first platform',
    'find scholarships',
  ],
  canonicalUrl: '/',
});

export default function Home() {
  return <HomeClient />;
}
