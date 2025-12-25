import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SessionProvider } from "@/components/session-provider";
import { GoogleAnalytics } from "@/components/google-analytics";
import { generateSEO, generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";
import dynamic from "next/dynamic";
import AICopilot from "@/components/ai-copilot";

const MobileBottomNav = dynamic(() => import("@/components/mobile-bottom-nav"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  ...generateSEO({
    title: "Ailes Global - Premium Study Abroad & Scholarship Consulting",
    description:
      "Africa's #1 scholarship-first platform. Find fully-funded scholarships, match with top universities, and get expert guidance for studying abroad. Empowering African students, especially women.",
    keywords: [
      "scholarship finder",
      "study abroad Africa",
      "women in education",
      "fully funded scholarships",
      "university matching",
      "African students scholarships",
      "international education consulting",
      "study in USA",
      "study in UK",
      "study in Canada",
    ],
    canonicalUrl: "/",
  }),
  icons: {
    icon: [
      { url: '/image.png', type: 'image/png' },
      { url: '/image.png', sizes: '32x32', type: 'image/png' },
      { url: '/image.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: '/image.png',
    shortcut: '/image.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
      <html lang="en" className={inter.variable}>
       <head>
         <meta name="google-site-verification" content="iaKmQyNu5cZoj9I84LsHRYK6jPR6hSEvkbi8JobjJxo" />
         <script
           type="application/ld+json"
           dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
         />
         <script
           type="application/ld+json"
           dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
         />
       </head>
      <body>
        <GoogleAnalytics />
        <AICopilot />
        <SessionProvider>
          <Navbar />
          <main className="min-h-screen pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
        </SessionProvider>
      </body>
    </html>
  );
}

