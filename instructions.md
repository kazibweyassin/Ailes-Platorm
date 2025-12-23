Here is a **complete, production-ready prompt** you can paste directly into **Cursor, Copilot, Replit Agent, GitHub Copilot Workspace, or any AI coding environment** to build your **entire new AILES Global website**.

This prompt includes your goals, the structure I recommend, design guidelines, copy guidelines, and technical requirements.

You can **copy-paste this whole document as one prompt**.

---

# ✅ **MASTER PROMPT FOR BUILDING THE NEW AILES GLOBAL WEBSITE**

*(Copy & paste the whole thing into Cursor or Copilot)*

---

## **PROJECT TITLE:**


**AILES Global – Premium Study Abroad & Scholarship Consulting Platform**

---

## **PROJECT DESCRIPTION:**


Build a **modern, premium, high-trust, high-conversion website** for **AILES Global**, a study-abroad and scholarship consulting brand focused on helping African students (especially women) access global opportunities.

The site must feel **world-class, trustworthy, and elegant**, like a premium international education brand.

The goal is to outperform sites like AilesGlobal.com, MSM Unify, Manya Group, Leap Scholar, and ApplyBoard.

---

## **KEY OBJECTIVES:**

1. Establish AILES Global as a **premium and trustworthy** study-abroad brand.
2. Convert visitors into **leads** using strong CTAs and strategic forms.
3. Clearly communicate **services, pricing, processes, success stories**, and brand values.
4. Make the website **SEO-optimized**, elegant, and extremely easy to navigate.
5. Build a structure that supports future product additions:

   * Scholarship Finder (Enhanced with AI-powered matching)
   * Jobs Abroad
   * AI Scholarship Assistant (Accelerated - build now)
   * Pre-Departure Courses
   * AI-Powered University Matching (Inspired by Craydel)
   * Student Dashboard & Application Tracker
   * Financial Planning Tools

---

## **TONE & BRAND STYLE:**

* Trustworthy
* Expert
* Modern
* Clean
* Human
* Minimalistic

Design inspiration:

* ApplyBoard
* Leap Scholar
* **Craydel EdTech** (AI matching, dashboard design, user experience)
* African Leadership University
* YC Startup aesthetic
* Mastercard Foundation scholarship pages

---

## **TARGET AUDIENCE:**

* Students (16–35) in Africa
* Parents seeking opportunities for their children
* Working professionals wanting to study abroad
* Scholarship seekers from low-income backgrounds
* High-potential female scholars

---

# **STRUCTURE – BUILD THESE PAGES**

---

## **1. Home Page**

A hero section with:

* A bold headline (you generate options)
* Subheadline
* A strong CTA button (Book Free Consultation)
* Secondary CTA (Explore Scholarships)

Sections to include:

* Why AILES Global
* Destinations (US, UK, Canada, Germany, Australia, etc.)
* Scholarship Opportunities
* Success Stories
* How It Works (4-step process)
* Testimonials
* CTA: Book Consultation

---

## **2. About Us**

Tell the brand story:

* Who we are
* Our mission
* Our values
* Why we focus on Africa
* Why we prioritize female scholars
* Founder’s message (generic placeholder)
* Credibility markers (accreditations, partnerships – placeholders)

---

## **3. Study Abroad Services**

Break into sections:

* **AI-Powered University Matching** (NEW - inspired by Craydel)
  * Interactive matching tool at `/university-matcher`
  * Student profile form (academics, interests, budget, goals)
  * AI-generated university recommendations with match scores
  * Detailed match results pages
* Application Guidance
* Statement of Purpose Editing
* Visa Application Assistance
* Pre-Departure Orientation
* **Application Status Tracker** (NEW - real-time tracking)

Each with short descriptions.

---

## **4. Scholarships Page**

A **dynamic, searchable list design** with advanced filtering (inspired by Craydel).
Include:

* Featured scholarship cards
* **Advanced Filters:**
  * Country
  * Degree level (Bachelor's, Master's, PhD)
  * Field of study
  * Deadline range
  * Amount range
  * Eligibility (gender, nationality, etc.)
* Real-time search functionality
* Save scholarships feature (requires auth)
* Call to action: Join Free Scholarship Alerts
* **Individual scholarship detail pages** (`/scholarships/[slug]`)

---

## **5. Pricing / Packages**

Three tiers:

* **Free Tier**
* **Standard Package**
* **Premium Mentorship Package**

Each with features listed.

---

## **6. Success Stories / Case Studies**

Create a layout for:

* Student name
* Country admitted
* Program
* Funding or scholarship (if any)
* Testimonial text
* Photo placeholder

---

## **7. Blog / Resources**

Templates for articles like:

* How to Study in Canada
* Top Scholarships for Africans
* Visa Requirements for Germany
* How to Write a Perfect SOP

---

## **8. Contact Page**

* Contact form
* WhatsApp CTA
* Phone
* Email
* Office location
* Google Map embed placeholder

---

## **9. AI University Matcher** (NEW - Craydel-Inspired)

**Priority: HIGH**

Interactive tool at `/university-matcher`:

* Student profile form:
  * Academic performance (GPA, test scores)
  * Interests and career goals
  * Budget range
  * Preferred destinations
  * Degree level
* AI matching algorithm (start with rule-based, can evolve to ML)
* Results page showing:
  * University cards with match percentage
  * Program recommendations
  * Admission probability estimates
  * Cost breakdowns
  * Available scholarships
  * Save matches to profile

---

## **10. Student Dashboard** (NEW - Craydel-Inspired)

**Priority: HIGH**

Protected route at `/dashboard` (requires authentication):

* **My Applications** - Track application status with visual timeline
* **Saved Universities** - Bookmarked matches
* **Saved Scholarships** - Favorite opportunities
* **Documents Library** - Upload and manage application documents
* **Messages/Consultations** - Communication hub with advisors
* **Progress Timeline** - Visual journey from profile to enrollment
* **Upcoming Deadlines** - Calendar view of important dates
* **AI Assistant** - Quick access to chat interface

**Sub-pages:**
* `/dashboard/applications` - Detailed application tracker
* `/dashboard/documents` - Document management
* `/dashboard/messages` - Communication center
* `/dashboard/settings` - Profile and preferences

---

## **11. AI Scholarship Assistant** (NEW - Accelerated from Future)

**Priority: MEDIUM**

Chat interface for student queries:

* Accessible via:
  * Floating chat widget (all pages)
  * Full-page at `/ai-assistant`
  * Dashboard integration
* Capabilities:
  * Scholarship recommendations based on profile
  * Application questions and guidance
  * University queries and comparisons
  * Visa information and requirements
  * General study abroad advice
* Integration: OpenAI/Claude API or custom model
* Context-aware responses using student profile data

---

## **12. Financial Planning Tools** (NEW - Craydel-Inspired)

**Priority: MEDIUM**

Page at `/financial-planning`:

* **Education Cost Calculator** - Interactive tool to estimate total costs
* **Scholarship vs Loan Comparison** - Decision-making tool
* **Savings Plan Recommendations** - Personalized ad
* **Funding Options Overview:**
  * Scholarships and grants
  * Education loans
  * Savings plans
  * Investment options
* **Financial Institution Partnerships** - Placeholder sections for future partnerships
* **Budget Planning Tools** - Monthly/yearly planning calculators

**Sub-pages:**
* `/cost-calculator` - Interactive cost calculator
* `/funding-options` - Comprehensive funding guide

---

## **13. Country-Specific Destination Pages** (NEW - Enhanced)

**Priority: LOW-MEDIUM**

Dynamic routes: `/destinations/[country]`

For each major destination (US, UK, Canada, Germany, Australia, etc.):

* Popular universities in that country
* Country-specific scholarship opportunities
* Visa requirements and process
* Cost of living breakdown
* Success stories from that destination
* Local partnerships and resources
* Application timeline for that country
* Cultural information and tips

**Example pages:**
* `/destinations/united-states`
* `/destinations/united-kingdom`
* `/destinations/canada`
* `/destinations/germany`
* `/destinations/australia`

---

# **TECHNICAL REQUIREMENTS TO IMPLEMENT**

---

## **Tech stack:**

**Next.js 14 (App Router)**
**TailwindCSS**
**ShadCN UI**
**Typescript**
**SEO-friendly**
**Responsive for mobile, tablet, and desktop**

**Additional Stack for Enhanced Features:**

* **Authentication:** NextAuth.js v5
* **Database:** Prisma ORM + PostgreSQL (or Supabase)
* **AI Integration:** OpenAI API / Claude API (for AI assistant)
* **File Storage:** AWS S3 / Cloudinary / Vercel Blob (for documents)
* **Email/SMS:** Resend (emails) + Twilio (SMS notifications)
* **Real-time:** Server-Sent Events or WebSockets (for notifications)
* **Analytics:** Vercel Analytics + PostHog (user analytics)

---

## **Design Guidelines:**

* Large white spaces
* Soft gradients
* Rounded corners (xl or 2xl)
* Hero with illustration or vector shapes
* Clean fonts: Inter, Poppins, or Manrope
* ShadCN reusable components
* Subtle animations using Framer Motion

---

## **SEO Requirements:**

* Meta tags for all pages
* OpenGraph images
* Schema markup for services
* Fast load speed
* ALT text for all images
* Blog with proper headings

---

## **Copywriting Guidelines:**

You (the AI) should generate:

* Professional and persuasive copy
* Clear messaging
* Simple English for African audience
* No exaggerations like “guaranteed visa"
* Focus on transparency and credibility

---

# 🔥 **YOUR TASK (Cursor / Copilot):**

**Using this entire prompt, generate:**
✔ A complete Next.js + Tailwind site
✔ All pages in a clean folder structure
✔ SEO meta tags for each page
✔ A homepage hero with strong copy (include mini matching tool in hero)
✔ Placeholder images and illustrations
✔ Reusable components:
   * Navbar, Footer
   * CTA button, Testimonial cards
   * Scholarship card, Blog card
   * **University match card** (with match score)
   * **Application status timeline** component
   * **AI chat widget** (floating assistant)
   * **Filter panel** (for scholarships)
   * **Dashboard sidebar** and widgets
✔ Sample copy for all pages
✔ Responsive design
✔ Clean, premium UI
✔ **Authentication system** (NextAuth.js setup)
✔ **Database schema** (Prisma models for users, applications, scholarships, etc.)
✔ **AI University Matcher** (MVP with rule-based matching)
✔ **Enhanced Scholarship Finder** (with filters and search)
✔ **Student Dashboard** (basic structure with all sections)
✔ **AI Assistant** (chat interface - can use mock responses initially)

---

# 🔧 **FOLDER STRUCTURE YOU MUST IMPLEMENT:**

```
/app
   /components
      /ui (ShadCN components)
      /dashboard (Dashboard-specific components)
      /ai (AI assistant components)
   /(auth) (Authentication routes)
      /login
      /register
      /forgot-password
   /university-matcher (AI University Matcher)
   /dashboard (Student Dashboard - protected)
      /applications
      /documents
      /messages
      /settings
   /ai-assistant (AI Scholarship Assistant)
   /financial-planning
      /cost-calculator
      /funding-options
   /destinations
      /[country] (Dynamic country pages)
   /about
   /services
   /scholarships
      /[slug] (Individual scholarship pages)
   /pricing
   /success-stories
   /blog
   /contact
/lib
   /auth (NextAuth configuration)
   /db (Prisma client)
   /ai (AI integration utilities)
   /utils (Helper functions)
/public
   /images
   /documents (Template files)
```

---


Below is a **premium, trustworthy, global-education color palette** you can plug directly into Tailwind, 

This palette is designed to make **AILES Global** look like a *world-class brand*—clean, modern, trusted, and premium.

---

# 🎨 **AILES GLOBAL — OFFICIAL COLOR PALETTE 

## **1. Primary Brand Color (Trust & Premium Feel)**

### **Deep Royal Blue**

Hex: **#1A4D8F**
Meaning: trust, intelligence, global brand authority
Usage: buttons, links, highlights, hero accents, CTAs

A softer shade for background sections:
Hex: **#E8F0FA**

---

## **2. Secondary Color (Energy + Optimism)**

### **Warm Gold**

Hex: **#F7B500**
Meaning: opportunity, success, global ambition
Usage: icons, accent lines, badges, subtle highlights

---

## **3. Neutral Palette (Clean, Professional)**

### **Dark Gray**

Hex: **#1B1B1B**
Text, headings, strong contrast.

### **Soft Gray**

Hex: **#6D6D6D**
Body text, muted icons.

### **Ultra Light Gray**

Hex: **#F7F9FC**
Background sections, forms, cards.

---

## **4. Success / Positive Indicators**

### **Emerald Green**

Hex: **#2ECC71**
Used for: scholarship success, admissions success, badges, small labels.

---

## **5. Error / Warning**

### **Red**

Hex: **#E63946**
Use rarely—form errors only.

---

# 🟦🟨 **Full Brand Palette Summary**

| Name             | Hex         | Usage               |
| ---------------- | ----------- | ------------------- |
| Primary Blue     | **#1A4D8F** | CTAs, hero, buttons |
| Light Blue       | **#E8F0FA** | Background sections |
| Gold             | **#F7B500** | Accents, highlights |
| Dark Gray        | **#1B1B1B** | Headings            |
| Soft Gray        | **#6D6D6D** | Body text           |
| Ultra Light Gray | **#F7F9FC** | Cards, backgrounds  |
| Emerald          | **#2ECC71** | Success indicators  |
| Error Red        | **#E63946** | Errors              |

---

# 🖌️ **Design Notes**

* Blue establishes **trust** (critical for study abroad brands).
* Gold gives you a **premium scholarship look** without looking flashy.
* Grays make everything feel **clean and modern**.
* Lots of white space = global, high-end consulting feel.

This palette is basically:
**African elegance + global professionalism + premium education aesthetic.**

---
*


# **CRAYDEL-INSPIRED ENHANCEMENTS:**

## **Key Features Inspired by Craydel EdTech:**

1. **AI-Powered University Matching** - Personalized recommendations based on student profile
2. **Dynamic Scholarship Finder** - Advanced filtering and real-time search
3. **Student Dashboard** - Comprehensive portal for tracking applications and managing journey
4. **Application Status Tracker** - Visual timeline of application progress
5. **AI Scholarship Assistant** - Chat interface for instant guidance
6. **Financial Planning Tools** - Cost calculators and funding advice
7. **Country-Specific Pages** - Tailored content for each destination

## **Design Principles from Craydel:**

* **Interactive Hero** - Include matching tool in homepage hero section
* **Card-Based Layouts** - University and scholarship cards with key info at a glance
* **Progress Indicators** - Visual journey representation
* **Dashboard Design** - Sidebar navigation with widget-based layout
* **Advanced Filters** - Intuitive filter panels for scholarships
* **Trust-Building Elements** - Success metrics, testimonials, partnerships

## **Implementation Priority:**

**Phase 1 (MVP):**
- Base website with all core pages
- Authentication system
- Basic AI University Matcher (rule-based)
- Enhanced Scholarship Finder with filters
- Student Dashboard structure

**Phase 2 (Enhanced):**
- AI Assistant integration
- Application Tracker with real-time updates
- Financial Planning tools
- Document management

**Phase 3 (Advanced):**
- Country-specific pages
- Advanced analytics
- Notification system
- Partnership integrations

---

# **FINAL REQUIREMENT:**

The output should be **production-quality**, clean, and ready for deployment.

**Note:** See `CRAYDEL_ANALYSIS.md` for detailed feature comparison, integration roadmap, and technical specifications.

---

# END OF PROMPT
