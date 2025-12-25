import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, MapPin, GraduationCap, Star, Quote } from "lucide-react";
import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";

export const metadata: Metadata = generateSEO({
  title: "Success Stories - Students Who Achieved Their Study Abroad Dreams",
  description: "Real success stories from African students who secured scholarships and studied at top universities worldwide. Harvard, Oxford, Cambridge, MIT graduates share their journeys with Ailes Global.",
  keywords: ["scholarship success stories", "student testimonials", "study abroad reviews", "scholarship winners"],
  canonicalUrl: "/success-stories",
});

import { getAllStories } from '@/lib/success-stories';

export default function SuccessStoriesPage() {
  const stories = getAllStories();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light via-white to-primary-light/30 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-dark mb-6">
              Success Stories
            </h1>
            <p className="text-lg text-gray-soft">
              Real students, real results. See how we've helped transform lives and
              open doors to global education opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="text-4xl">{story.image}</div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{story.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {story.country}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center text-sm mb-1">
                      <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-semibold">{story.university}</span>
                    </div>
                    <p className="text-sm text-gray-soft ml-6">{story.program}</p>
                  </div>
                  <div className="flex items-center text-sm">
                    <Award className="h-4 w-4 mr-2 text-success" />
                    <span className="text-success font-medium">{story.scholarship}</span>
                  </div>
                  <div className="bg-primary-light p-4 rounded-lg">
                    <Quote className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm text-gray-soft italic">"{story.testimonial}"</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                    <div>
                      <p className="text-xs text-gray-soft">GPA</p>
                      <p className="text-sm font-semibold">{story.stats.gpa}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-soft">Test Score</p>
                      <p className="text-sm font-semibold">{story.stats.testScore}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-soft">Duration</p>
                      <p className="text-sm font-semibold">{story.stats.duration}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-dark mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-lg text-gray-soft mb-8 max-w-2xl mx-auto">
            Join hundreds of students who have achieved their study abroad dreams with
            AILES Global.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact">
              <button className="bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-colors">
                Book Free Consultation
              </button>
            </a>
            <a href="/university-matcher">
              <button className="bg-white text-primary border-2 border-primary px-8 py-3 rounded-md font-semibold hover:bg-primary-light transition-colors">
                Find Your University
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}





