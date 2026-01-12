import { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle2, 
  MessageCircle, 
  FileText, 
  Users, 
  Star, 
  Clock, 
  Video,
  Calendar,
  ArrowRight,
  Sparkles
} from "lucide-react";

export const metadata: Metadata = generateSEO({
  title: "Scholarship Application Consulting - Expert Help for African Students",
  description:
    "Get personalized scholarship application help from experts. Essay reviews, mock interviews, and application strategy for Chevening, Commonwealth, Mastercard Foundation, and more.",
  keywords: [
    "scholarship consulting",
    "essay review service",
    "scholarship application help",
    "chevening essay review",
    "scholarship interview prep",
  ],
  canonicalUrl: "/consulting",
});

const services = [
  {
    id: "essay-review",
    name: "Essay Review & Feedback",
    description: "Get detailed feedback on your scholarship essays with specific suggestions for improvement",
    price: 50,
    duration: "2-3 days turnaround",
    includes: [
      "Line-by-line feedback",
      "Structure & flow analysis",
      "Content strength assessment",
      "Specific improvement suggestions",
      "One round of revisions",
    ],
    popular: false,
    icon: FileText,
  },
  {
    id: "mock-interview",
    name: "Mock Interview Session",
    description: "Practice your scholarship interview with realistic questions and expert feedback",
    price: 100,
    duration: "60-minute session",
    includes: [
      "Video call interview simulation",
      "Common questions practice",
      "Body language tips",
      "Detailed written feedback",
      "Recording for self-review",
    ],
    popular: true,
    icon: Video,
  },
  {
    id: "full-application",
    name: "Full Application Package",
    description: "Complete support for your entire scholarship application from start to finish",
    price: 300,
    duration: "4-6 weeks support",
    includes: [
      "All essays reviewed (up to 4)",
      "Application strategy session",
      "Mock interview preparation",
      "Document review & checklist",
      "Unlimited email support",
      "University selection guidance",
    ],
    popular: false,
    icon: Sparkles,
  },
  {
    id: "strategy-call",
    name: "Strategy Consultation",
    description: "One-on-one call to discuss your scholarship strategy and answer all your questions",
    price: 75,
    duration: "45-minute call",
    includes: [
      "Personalized scholarship recommendations",
      "Application timeline planning",
      "Profile strength assessment",
      "Q&A on any scholarship",
      "Follow-up email summary",
    ],
    popular: false,
    icon: MessageCircle,
  },
];

const testimonials = [
  {
    name: "Amara K.",
    country: "Ghana",
    scholarship: "Chevening Scholar 2025",
    quote: "The essay review completely transformed my application. The feedback was so detailed and actionable. I wouldn't have won without this help!",
    image: "🇬🇭",
  },
  {
    name: "David M.",
    country: "Kenya",
    scholarship: "Commonwealth Scholar 2025",
    quote: "The mock interview prepared me for exactly what they asked. I felt so confident walking into the real interview.",
    image: "🇰🇪",
  },
  {
    name: "Fatima A.",
    country: "Nigeria",
    scholarship: "Mastercard Foundation Scholar",
    quote: "Best investment I made in my education. The full package helped me apply strategically and win my dream scholarship.",
    image: "🇳🇬",
  },
];

const stats = [
  { value: "500+", label: "Students Helped" },
  { value: "85%", label: "Success Rate" },
  { value: "50+", label: "Countries" },
  { value: "$2M+", label: "Scholarships Won" },
];

export default function ConsultingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm mb-6">
              <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
              <span>Trusted by 500+ African Students</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Win Your Dream Scholarship
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Get expert help with your scholarship applications. Essay reviews, mock interviews, 
              and personalized strategy from consultants who've been there.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#services">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  View Services
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="#book">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Book Free Consultation
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the support that fits your needs. All services include personalized attention 
              from scholarship experts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                  service.popular ? 'border-2 border-primary ring-2 ring-primary/20' : ''
                }`}
              >
                {service.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{service.name}</CardTitle>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold text-gray-900">${service.price}</span>
                    <span className="text-gray-500">USD</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {service.includes.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a 
                    href={`https://calendly.com/ailesglobal/${service.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="w-full" variant={service.popular ? "default" : "outline"}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Book Now
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Simple process, powerful results</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Choose Service", desc: "Select the support that fits your needs and budget" },
              { step: 2, title: "Book Session", desc: "Pick a convenient time on our calendar" },
              { step: 3, title: "Get Expert Help", desc: "Work with our consultants on your application" },
              { step: 4, title: "Win Scholarship", desc: "Submit a stronger application and get results" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from students who won scholarships with our help
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{testimonial.image}</div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-primary">{testimonial.scholarship}</p>
                      <p className="text-xs text-gray-500">{testimonial.country}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Scholarships We Help With */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Scholarships We Specialize In
            </h2>
            <p className="text-xl text-gray-600">
              Deep expertise in the most competitive scholarships
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Chevening", country: "🇬🇧 UK" },
              { name: "Commonwealth", country: "🇬🇧 UK" },
              { name: "Mastercard Foundation", country: "🌍 Global" },
              { name: "Rhodes", country: "🇬🇧 UK" },
              { name: "Fulbright", country: "🇺🇸 USA" },
              { name: "DAAD", country: "🇩🇪 Germany" },
              { name: "Erasmus Mundus", country: "🇪🇺 Europe" },
              { name: "Gates Cambridge", country: "🇬🇧 UK" },
            ].map((scholarship, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <p className="font-semibold text-gray-900">{scholarship.name}</p>
                  <p className="text-sm text-gray-500">{scholarship.country}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="book" className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Win Your Scholarship?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Book a free 15-minute consultation to discuss your goals and how we can help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://calendly.com/ailesglobal/free-consultation"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                <Calendar className="mr-2 h-5 w-5" />
                Book Free Consultation
              </Button>
            </a>
            <a href="mailto:support@ailesglobal.com">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <MessageCircle className="mr-2 h-5 w-5" />
                Email Us
              </Button>
            </a>
          </div>
          <p className="text-white/70 text-sm mt-6">
            No payment required • 15 minutes • Get personalized advice
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Who are your consultants?",
                a: "Our consultants are former scholarship winners (Chevening, Commonwealth, Mastercard Foundation, etc.) who have successfully navigated the application process and now help others do the same."
              },
              {
                q: "How long does essay review take?",
                a: "Standard essay review takes 2-3 business days. We also offer express 24-hour review for urgent deadlines at an additional fee."
              },
              {
                q: "Do you guarantee I'll win a scholarship?",
                a: "We can't guarantee results as scholarship decisions depend on many factors. However, our clients have an 85% success rate, significantly higher than the average."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept PayPal, credit/debit cards, and mobile money (M-Pesa, MTN Mobile Money). Payments are processed securely."
              },
              {
                q: "Can I get a refund?",
                a: "Yes, we offer a full refund if you cancel at least 24 hours before your scheduled session. For essay reviews, refunds are available if we haven't started working on your documents."
              },
            ].map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-gray-600 mb-4">
            Have more questions? We're here to help.
          </p>
          <a href="mailto:support@ailesglobal.com">
            <Button variant="outline">
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
