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

export default function SuccessStoriesPage() {
  const stories = [
    {
      name: "Amina Hassan",
      country: "United States",
      university: "Harvard University",
      program: "Master's in Computer Science",
      scholarship: "Full Scholarship - $120,000",
      image: "👩‍💼",
      testimonial:
        "AILES Global helped me secure a full scholarship to study at Harvard. Their guidance was invaluable throughout the entire process. From university matching to application review, they were with me every step of the way. I couldn't have done it without them!",
      stats: {
        gpa: "3.8/4.0",
        testScore: "GRE: 330",
        duration: "2 years",
      },
    },
    {
      name: "Chinwe Okafor",
      country: "Canada",
      university: "University of Toronto",
      program: "MBA",
      scholarship: "Partial Scholarship - $40,000",
      image: "👩‍🎓",
      testimonial:
        "The team's expertise and personalized support made my dream of studying in Canada a reality. They helped me identify the right programs, craft compelling applications, and navigate the visa process. Highly recommended!",
      stats: {
        gpa: "3.6/4.0",
        testScore: "GMAT: 720",
        duration: "2 years",
      },
    },
    {
      name: "Fatima Diallo",
      country: "Germany",
      university: "Technical University of Munich",
      program: "PhD in Engineering",
      scholarship: "Research Grant - €50,000",
      image: "👩‍🔬",
      testimonial:
        "From application to visa, AILES Global was with me every step. I'm now pursuing my PhD in Engineering at one of Europe's top universities. The scholarship they helped me secure covers all my expenses!",
      stats: {
        gpa: "3.9/4.0",
        testScore: "IELTS: 8.0",
        duration: "4 years",
      },
    },
    {
      name: "Kemi Adebayo",
      country: "United Kingdom",
      university: "University of Oxford",
      program: "Master's in Public Policy",
      scholarship: "Chevening Scholarship",
      image: "👩‍💻",
      testimonial:
        "I never thought I could get into Oxford, but AILES Global believed in me. Their mentorship and support throughout the Chevening application process was exceptional. I'm now studying at one of the world's best universities!",
      stats: {
        gpa: "3.7/4.0",
        testScore: "IELTS: 7.5",
        duration: "1 year",
      },
    },
    {
      name: "Zainab Mohammed",
      country: "Australia",
      university: "University of Melbourne",
      program: "Master's in Public Health",
      scholarship: "Australia Awards Scholarship",
      image: "👩‍⚕️",
      testimonial:
        "The Australia Awards Scholarship application was complex, but AILES Global made it manageable. They helped me highlight my experience and passion for public health. I'm now studying in beautiful Melbourne!",
      stats: {
        gpa: "3.8/4.0",
        testScore: "IELTS: 7.5",
        duration: "2 years",
      },
    },
    {
      name: "Sarah Mensah",
      country: "Netherlands",
      university: "University of Amsterdam",
      program: "Master's in Data Science",
      scholarship: "Holland Scholarship - €5,000",
      image: "👩‍💼",
      testimonial:
        "AILES Global helped me discover amazing opportunities in the Netherlands. The application process was smooth, and the scholarship they helped me secure made it affordable. I'm loving my experience in Amsterdam!",
      stats: {
        gpa: "3.6/4.0",
        testScore: "IELTS: 7.0",
        duration: "2 years",
      },
    },
  ];

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





