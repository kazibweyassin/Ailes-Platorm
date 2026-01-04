"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  FileText,
  Plane,
  BookOpen,
  Search,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ServicesPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const services = [
    {
      icon: Search,
      title: "AI-Powered University Matching",
      description:
        "Our advanced AI system analyzes your profile, academic background, and goals to match you with the perfect universities and programs worldwide.",
      features: [
        "Personalized university recommendations",
        "Match score based on multiple factors",
        "Program-specific suggestions",
        "Scholarship availability indicators",
      ],
      link: "/university-matcher",
    },
    {
      icon: FileText,
      title: "Application Guidance",
      description:
        "Expert guidance through every step of the application process, from document preparation to submission deadlines.",
      features: [
        "Application strategy development",
        "Document checklist and review",
        "Deadline management",
        "Application submission support",
      ],
      link: "/contact",
    },
    {
      icon: FileText,
      title: "Statement of Purpose Editing",
      description:
        "Professional editing and feedback on your SOP to make it stand out to admissions committees.",
      features: [
        "Expert review and feedback",
        "Content enhancement",
        "Grammar and style correction",
        "Multiple revision rounds",
      ],
      link: "/contact",
    },
    {
      icon: Plane,
      title: "Visa Application Assistance",
      description:
        "Comprehensive support for visa applications, including document preparation, interview preparation, and follow-up.",
      features: [
        "Visa requirement analysis",
        "Document preparation guide",
        "Interview preparation",
        "Application tracking",
      ],
      link: "/contact",
    },
    {
      icon: BookOpen,
      title: "Pre-Departure Orientation",
      description:
        "Prepare for your journey with comprehensive orientation sessions covering everything you need to know.",
      features: [
        "Cultural orientation",
        "Academic preparation",
        "Living arrangements guidance",
        "Health and safety information",
      ],
      link: "/contact",
    },
    {
      icon: GraduationCap,
      title: "Application Status Tracker",
      description:
        "Real-time tracking of your application status with visual timelines and automated notifications.",
      features: [
        "Visual progress timeline",
        "Status updates",
        "Deadline reminders",
        "Document management",
      ],
      link: "/dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light via-white to-primary-light/30 py-20 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-gray-dark mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Get Admitted with a Scholarship
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-soft mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              We handle everything: applications, essays, scholarships, and admissions.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-6 justify-center text-gray-dark font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div>📊 <span className="text-primary">85%</span> Admission Rate</div>
              <div>💰 <span className="text-primary">$18,000</span> Avg Scholarship</div>
              <div>⏱️ Save <span className="text-primary">55+ hours</span></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Pricing Overview */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-dark mb-6">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-2 border-transparent hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">Free</CardTitle>
                <div className="text-3xl font-bold text-gray-dark">$0</div>
                <CardDescription>Explore opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-soft mb-4">Browse 10K+ scholarships</p>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary shadow-lg">
              <CardHeader>
                <div className="text-xs font-semibold text-primary mb-2">MOST POPULAR</div>
                <CardTitle className="text-lg">Standard</CardTitle>
                <div className="text-3xl font-bold text-gray-dark">$299</div>
                <CardDescription>Get admitted with scholarship</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-soft mb-4">85% success rate • $18K avg scholarship</p>
                <Link href="/pricing">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-2 border-transparent hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">Premium</CardTitle>
                <div className="text-3xl font-bold text-gray-dark">$799</div>
                <CardDescription>Maximum success rate</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-soft mb-4">92% success rate • $25K+ scholarship</p>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-dark mb-4">What's Included in Our Service</h2>
            <p className="text-lg text-gray-soft">Everything you need to get admitted and funded</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                  {/* Animated background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  
                  <CardHeader className="relative z-10">
                    <motion.div
                      animate={{
                        scale: hoveredIndex === index ? 1.1 : 1,
                        rotate: hoveredIndex === index ? 5 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <service.icon className="h-12 w-12 text-primary mb-4" />
                    </motion.div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <motion.li 
                          key={idx} 
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                        >
                          <motion.div
                            animate={{
                              x: hoveredIndex === index ? 5 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowRight className="h-4 w-4 text-primary mr-2 mt-1 flex-shrink-0" />
                          </motion.div>
                          <span className="text-sm text-gray-soft">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                    <Link href={service.link}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button variant="outline" className="w-full group/btn">
                          Learn More
                          <motion.div
                            animate={{
                              x: hoveredIndex === index ? 5 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className="ml-2"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </motion.div>
                        </Button>
                      </motion.div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-light overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-dark mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Start Your Journey Today
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-soft mb-2 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join 127+ students who got admitted with scholarships.
            </motion.p>
            <motion.p
              className="text-2xl font-bold text-primary mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Starting at just $299 • 50% refund guarantee
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/pricing">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button size="lg">View Packages & Pricing</Button>
                </motion.div>
              </Link>
              <Link href="/find-scholarships">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button size="lg" variant="outline">
                    Browse Scholarships Free
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}





