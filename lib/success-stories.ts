// Shared success stories data source
// Used by both homepage and success-stories page

export interface SuccessStory {
  name: string;
  country: string;
  university?: string;
  program: string;
  scholarship: string;
  testimonial: string;
  image: string;
  stats?: {
    gpa?: string;
    testScore?: string;
    duration?: string;
  };
}

export const successStories: SuccessStory[] = [
  {
    name: "Patrick NSAMBA",
    country: "United States",
    program: "Master's in Computer Science",
    scholarship: "Full Scholarship",
    testimonial:
      "Ailes Global helped me secure a full scholarship to study in the US. Their guidance was invaluable throughout the entire process.",
    image: "/testimonials/LUTALO_MURSHID_VISA_PHOTO[1].jpg"
  },
  {
    name: "Nansamba Olivia",
    country: "Canada",
    program: "MBA",
    scholarship: "Partial Scholarship",
    testimonial:
      "The team's expertise and personalized support made my dream of studying in Canada a reality. Highly recommended!",
    image: "/testimonials/NAMATO_VALLY_VISA_PHOTO[1].jpg"
  },
  {
    name: "AKandwanaho Marvin",
    country: "Germany",
    program: "BS in Engineering",
    scholarship: "Scholarship",
    testimonial:
      "From application to visa, Ailes Global was with me every step. I'm now pursuing my Bachelors Degree in Germany!",
    image: "/testimonials/SSEGONJA_SHAFICK_VISA_PHOTO[1].jpg"
  },
  {
    name: "Amina Hassan",
    country: "United States",
    university: "Harvard University",
    program: "Master's in Computer Science",
    scholarship: "Full Scholarship - $120,000",
    testimonial:
      "AILES Global helped me secure a full scholarship to study at Harvard. Their guidance was invaluable throughout the entire process. From university matching to application review, they were with me every step of the way. I couldn't have done it without them!",
    image: "👩‍💼",
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
    testimonial:
      "The team's expertise and personalized support made my dream of studying in Canada a reality. They helped me identify the right programs, craft compelling applications, and navigate the visa process. Highly recommended!",
    image: "👩‍🎓",
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
    testimonial:
      "From application to visa, AILES Global was with me every step. I'm now pursuing my PhD in Engineering at one of Europe's top universities. The scholarship they helped me secure covers all my expenses!",
    image: "👩‍🔬",
    stats: {
      gpa: "3.9/4.0",
      testScore: "IELTS: 8.0",
      duration: "4 years",
    },
  },
];

// Get featured stories for homepage (first 3)
export function getFeaturedStories(): SuccessStory[] {
  return successStories.slice(0, 3);
}

// Get all stories for success-stories page
export function getAllStories(): SuccessStory[] {
  return successStories;
}

