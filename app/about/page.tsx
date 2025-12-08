import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Heart, Globe, Award, TrendingUp } from "lucide-react";
import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "About Us - Empowering African Students",
  description: "Learn about Ailes Global's mission to empower African students, especially women, to access world-class education through scholarships and expert guidance. Our story, values, and impact.",
  keywords: ["about Ailes Global", "education consulting mission", "African student support", "women empowerment education"],
  canonicalUrl: "/about",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light via-white to-primary-light/30 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6">
              Empowering African Students to Achieve Global Excellence
            </h1>
            <p className="text-lg text-gray-soft">
              AILES Global is dedicated to breaking down barriers and creating pathways for
              African students, especially women, to access world-class education opportunities
              worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <Target className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-soft leading-relaxed">
                  To empower African students, particularly women, by providing expert guidance,
                  cutting-edge technology, and personalized support to access premium study abroad
                  opportunities and scholarships globally. We believe every student deserves the
                  chance to pursue their educational dreams, regardless of their background.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-soft leading-relaxed">
                  To become Africa's leading study abroad platform, recognized for excellence in
                  student success, innovation in matching technology, and commitment to empowering
                  the next generation of African leaders through quality global education.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why We Focus on Africa */}
      <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Globe className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-4">
                Why We Focus on Africa
              </h2>
            </div>
            <div className="space-y-6 text-gray-soft">
              <p>
                Africa is home to the world's youngest population, with over 60% under the age of
                25. This demographic represents immense potential, but many talented students face
                significant barriers to accessing quality higher education.
              </p>
              <p>
                We understand the unique challenges African students face: limited information about
                international opportunities, complex application processes, financial constraints,
                and visa requirements. Our platform is specifically designed to address these
                challenges.
              </p>
              <p>
                By focusing on Africa, we can provide culturally relevant guidance, understand
                local education systems, and build partnerships that truly serve our students'
                needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why We Prioritize Women */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-4">
                Empowering Women Scholars
              </h2>
            </div>
            <div className="space-y-6 text-gray-soft">
              <p>
                Women in Africa face additional barriers to education, including cultural norms,
                financial constraints, and limited role models. Yet, when given the opportunity,
                African women excel globally and become powerful agents of change.
              </p>
              <p>
                We prioritize female scholars through:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Scholarship opportunities specifically for women</li>
                <li>Mentorship programs connecting students with successful alumnae</li>
                <li>Support networks and communities</li>
                <li>Resources addressing unique challenges women face</li>
                <li>Partnerships with organizations focused on women's education</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-4">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Users,
                title: "Student-Centered",
                description:
                  "Every decision we make prioritizes student success and well-being above all else.",
              },
              {
                icon: Award,
                title: "Excellence",
                description:
                  "We maintain the highest standards in our services, technology, and partnerships.",
              },
              {
                icon: Heart,
                title: "Integrity",
                description:
                  "Transparency, honesty, and ethical practices guide everything we do.",
              },
            ].map((value, index) => (
              <Card key={index}>
                <CardHeader>
                  <value.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
            {[
              { number: "500+", label: "Students Helped" },
              { number: "85%", label: "Success Rate" },
              { number: "50+", label: "Partner Universities" },
              { number: "30+", label: "Countries" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-soft">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}




