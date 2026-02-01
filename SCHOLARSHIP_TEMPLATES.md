# Scholarship Quick Add Template

Copy this template for each scholarship you want to add to `scripts/add-scholarships-bulk.ts`

```javascript
{
  name: "Scholarship Name Here",
  provider: "Organization/University Name",
  country: "Country or 'Multiple Countries'",
  amount: 25000, // Annual amount
  currency: "USD", // USD, EUR, GBP, etc.
  type: "FULL", // FULL, PARTIAL, or TUITION_ONLY
  
  description: "Full description of the scholarship, what it covers, goals, etc.",
  
  eligibility: "Who can apply? Requirements, restrictions, etc.",
  
  deadline: new Date("2026-12-31"), // Format: YYYY-MM-DD
  applicationOpenDate: new Date("2026-06-01"),
  
  website: "https://scholarship-website.com",
  applicationLink: "https://apply-here.com",
  contactEmail: "contact@example.com",
  
  // Fields of study (choose from list or add "All Fields")
  fieldOfStudy: ["Engineering", "Medicine", "Business", "Computer Science"],
  // Options: Engineering, Medicine, Business, Computer Science, Arts, 
  //          Social Sciences, Agriculture, Education, Health Sciences, etc.
  
  // Degree levels
  degreeLevel: ["BACHELORS", "MASTERS"], 
  // Options: BACHELORS, MASTERS, PHD, DIPLOMA, CERTIFICATE
  
  minGPA: 3.0, // Minimum GPA (4.0 scale)
  maxAge: 30,
  minAge: 18,
  
  // Target demographics
  forWomen: false, // true if specifically for women
  forAfrican: true, // true if for African students
  forUnderrepresented: false, // true if for underrepresented groups
  
  // Countries students must be from (empty array = all countries)
  targetCountries: ["Uganda", "Kenya", "Nigeria"],
  
  // English tests
  requiresIELTS: true,
  minIELTS: 6.5,
  requiresTOEFL: false,
  minTOEFL: 80,
  
  requiresGRE: false,
  requiresGMAT: false,
  
  // Scholarship details
  numberOfAwards: 100, // How many scholarships available
  renewableYears: 4, // Can be renewed for X years
  
  // What it covers
  coversTuition: true,
  coversLiving: true,
  coversTravel: true,
  coversBooks: false,
  
  // Visibility
  featured: true, // Show on homepage
  verified: true, // Verified by admin
},
```

## Quick Copy Templates

### Template 1: Fully Funded University Scholarship
```javascript
{
  name: "University Excellence Scholarship",
  provider: "XYZ University",
  country: "United States",
  amount: 60000,
  currency: "USD",
  type: "FULL",
  description: "Full scholarship covering tuition, accommodation, and living expenses for outstanding international students.",
  eligibility: "International students with excellent academic records. Minimum GPA 3.5. Strong leadership experience required.",
  deadline: new Date("2026-03-15"),
  applicationOpenDate: new Date("2026-01-01"),
  website: "https://university.edu/scholarships",
  applicationLink: "https://university.edu/apply",
  contactEmail: "scholarships@university.edu",
  fieldOfStudy: ["All Fields"],
  degreeLevel: ["BACHELORS", "MASTERS"],
  minGPA: 3.5,
  maxAge: 25,
  forWomen: false,
  forAfrican: true,
  forUnderrepresented: false,
  targetCountries: ["All African Countries"],
  requiresIELTS: true,
  minIELTS: 7.0,
  numberOfAwards: 50,
  renewableYears: 4,
  coversTuition: true,
  coversLiving: true,
  coversTravel: true,
  coversBooks: true,
  featured: true,
  verified: true,
},
```

### Template 2: Women in STEM Scholarship
```javascript
{
  name: "Women in STEM Scholarship",
  provider: "Tech Foundation",
  country: "Canada",
  amount: 30000,
  currency: "CAD",
  type: "PARTIAL",
  description: "Supporting women pursuing STEM degrees in Canadian universities.",
  eligibility: "Female students from Africa pursuing Computer Science, Engineering, or Mathematics degrees.",
  deadline: new Date("2026-05-30"),
  applicationOpenDate: new Date("2026-02-01"),
  website: "https://techfoundation.org/scholarships",
  applicationLink: "https://apply.techfoundation.org",
  contactEmail: "stem@techfoundation.org",
  fieldOfStudy: ["Computer Science", "Engineering", "Mathematics"],
  degreeLevel: ["BACHELORS", "MASTERS"],
  minGPA: 3.2,
  maxAge: 30,
  forWomen: true,
  forAfrican: true,
  forUnderrepresented: true,
  targetCountries: ["Uganda", "Kenya", "Nigeria", "Ghana", "Tanzania"],
  requiresIELTS: true,
  minIELTS: 6.5,
  requiresTOEFL: true,
  minTOEFL: 90,
  numberOfAwards: 25,
  renewableYears: 2,
  coversTuition: true,
  coversLiving: false,
  coversTravel: false,
  coversBooks: true,
  featured: true,
  verified: true,
},
```

### Template 3: Partial Tuition Scholarship
```javascript
{
  name: "Academic Merit Award",
  provider: "International University",
  country: "Australia",
  amount: 15000,
  currency: "AUD",
  type: "PARTIAL",
  description: "Merit-based scholarship covering 50% of tuition fees for international students.",
  eligibility: "International students with GPA above 3.0. No age restrictions.",
  deadline: new Date("2026-08-31"),
  applicationOpenDate: new Date("2026-04-01"),
  website: "https://international-uni.edu.au",
  applicationLink: "https://apply.international-uni.edu.au",
  contactEmail: "admissions@international-uni.edu.au",
  fieldOfStudy: ["All Fields"],
  degreeLevel: ["MASTERS"],
  minGPA: 3.0,
  forWomen: false,
  forAfrican: false,
  forUnderrepresented: false,
  targetCountries: [],
  requiresIELTS: true,
  minIELTS: 6.5,
  numberOfAwards: 200,
  renewableYears: 2,
  coversTuition: true,
  coversLiving: false,
  coversTravel: false,
  coversBooks: false,
  featured: false,
  verified: true,
},
```

## How to Use

1. Open `scripts/add-scholarships-bulk.ts`
2. Copy one of the templates above
3. Fill in the details
4. Add it to the `scholarships` array
5. Run: `npx ts-node scripts/add-scholarships-bulk.ts`

## Fields of Study Options
- Engineering
- Medicine
- Computer Science
- Business
- Finance
- Law
- Arts
- Social Sciences
- Agriculture
- Education
- Health Sciences
- Environmental Studies
- Mathematics
- Physics
- Chemistry
- Biology
- Psychology
- All Fields

## Countries Options
- Uganda
- Kenya
- Nigeria
- Ghana
- Tanzania
- Rwanda
- Ethiopia
- South Africa
- Zimbabwe
- Zambia
- Or: "All African Countries"
- Or: "Multiple Countries"

## Quick Data Entry Tips

**Need to add 100 scholarships fast?**
1. Create a Google Sheet with columns matching the fields
2. Fill in the data
3. Export as CSV
4. Use this converter (I can create it for you)
5. Bulk import!

Ready to add more? Share the scholarship details and I'll format them for you!
