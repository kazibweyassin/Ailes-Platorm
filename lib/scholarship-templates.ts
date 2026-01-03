/**
 * Pre-generated Templates for Common Scholarships
 * These templates reduce API calls for standardized questions
 */

export interface ScholarshipTemplate {
  scholarshipId?: string;
  scholarshipName: string;
  provider: string;
  questionType: string;
  template: string;
  variables?: string[]; // Variables that can be replaced in template
}

/**
 * Standardized application steps template
 */
export const APPLICATION_STEPS_TEMPLATE = `## Application Steps

Most scholarship applications follow these standardized steps:

### 1. **Research & Preparation** (2-4 weeks before deadline)
- Review eligibility requirements carefully
- Gather all required documents
- Prepare your academic transcripts
- Get recommendation letters ready
- Take required language tests (IELTS/TOEFL) if needed

### 2. **Document Preparation** (1-2 weeks)
- **Personal Statement/Motivation Letter**: Write a compelling essay (500-1000 words) explaining:
  - Your academic goals and career aspirations
  - Why you need this scholarship
  - How you'll contribute to your field and community
  - Your leadership experience and achievements

- **CV/Resume**: Highlight academic achievements, work experience, volunteer work, and leadership roles

- **Academic Transcripts**: Official transcripts from all institutions attended

- **Recommendation Letters**: Usually 2-3 letters from professors or employers who know you well

### 3. **Online Application** (1-2 days)
- Create an account on the scholarship portal
- Fill out all required fields accurately
- Upload all documents in the specified format (PDF preferred)
- Double-check all information before submission

### 4. **Follow-up** (After submission)
- Save confirmation email/receipt
- Check application status regularly
- Respond promptly to any requests for additional information
- Prepare for interviews if required

### 💡 **Pro Tips:**
- Start early - don't wait until the deadline
- Proofread everything multiple times
- Customize your personal statement for each scholarship
- Keep copies of all submitted documents
- Track deadlines in a calendar

**Need help with a specific scholarship? Ask me about it!**`;

/**
 * Standardized eligibility advice template
 */
export const ELIGIBILITY_TEMPLATE = `## Eligibility Requirements

Most scholarships look for candidates with:

### **Academic Excellence**
- Strong GPA (usually 3.0+ for most, 3.5+ for competitive scholarships)
- Academic transcripts showing consistent performance
- Relevant field of study matching scholarship focus

### **Language Proficiency**
- **IELTS**: Usually 6.0-7.0 minimum (varies by scholarship)
- **TOEFL**: Usually 79-100 minimum
- Some scholarships accept other tests or waive requirements

### **Financial Need**
- Demonstrated financial need (varies by scholarship)
- Some scholarships are merit-based only
- Others prioritize students from low-income backgrounds

### **Additional Requirements** (varies)
- Age restrictions (often 18-35 for most scholarships)
- Citizenship/nationality requirements
- Work experience (for some postgraduate scholarships)
- Leadership experience and community involvement
- Research experience (for research-focused scholarships)

### **Common Documents Needed:**
- Academic transcripts
- Language test scores
- Personal statement/motivation letter
- CV/Resume
- Recommendation letters (2-3)
- Proof of financial need (if required)
- Passport copy
- Passport-sized photos

**Check the specific scholarship requirements for exact eligibility criteria!**`;

/**
 * Standardized tips template
 */
export const APPLICATION_TIPS_TEMPLATE = `## Scholarship Application Tips

### **Before You Apply:**

1. **Read Everything Carefully**
   - Review eligibility criteria thoroughly
   - Understand what the scholarship covers
   - Note all deadlines and requirements

2. **Start Early**
   - Begin preparing 2-3 months before deadline
   - Allow time for document preparation
   - Don't rush your personal statement

3. **Match Your Profile**
   - Only apply to scholarships you're eligible for
   - Focus on scholarships that match your field of study
   - Consider your country of origin and destination

### **Writing Your Personal Statement:**

- **Be Authentic**: Share your genuine story and motivations
- **Show Impact**: Explain how the scholarship will help you achieve your goals
- **Demonstrate Need**: Clearly explain your financial situation (if required)
- **Highlight Achievements**: Mention academic awards, leadership roles, community service
- **Connect to Future**: Explain how you'll use your education to make a difference
- **Proofread**: Check for grammar, spelling, and clarity

### **Common Mistakes to Avoid:**

❌ Missing the deadline
❌ Incomplete applications
❌ Generic personal statements (not customized)
❌ Poor grammar and spelling
❌ Missing required documents
❌ Not following instructions
❌ Applying to scholarships you're not eligible for

### **Maximize Your Chances:**

✅ Apply to multiple scholarships
✅ Customize each application
✅ Get strong recommendation letters
✅ Show leadership and community involvement
✅ Maintain a strong academic record
✅ Prepare for interviews if required

**Remember: Every scholarship is competitive. Put your best foot forward!**`;

/**
 * Pre-generated templates for specific common scholarships
 */
export const SCHOLARSHIP_SPECIFIC_TEMPLATES: Record<string, ScholarshipTemplate[]> = {
  'Mastercard Foundation Scholars Program': [
    {
      scholarshipName: 'Mastercard Foundation Scholars Program',
      provider: 'Mastercard Foundation',
      questionType: 'application_steps',
      template: `## Mastercard Foundation Scholars Program - Application Steps

### Step 1: Check Eligibility
- Must be a citizen of an African country
- Demonstrate financial need
- Show academic excellence (GPA 3.5+)
- Have leadership potential
- Age typically under 29

### Step 2: Prepare Documents
- Academic transcripts (official)
- Personal statement (explaining financial need and goals)
- Recommendation letters (2-3)
- IELTS (6.5+) or TOEFL (79+) scores
- CV/Resume highlighting leadership experience

### Step 3: Apply Online
- Visit: https://apply.mastercardfdn.org
- Create account and complete application
- Upload all required documents
- Submit before deadline (usually March 31)

### Step 4: Selection Process
- Initial screening
- Interview (if shortlisted)
- Final selection

**Deadline**: Usually March 31 annually
**Application Opens**: November 1

**Tip**: This is highly competitive. Emphasize your leadership experience and commitment to giving back to your community.`,
    },
    {
      scholarshipName: 'Mastercard Foundation Scholars Program',
      provider: 'Mastercard Foundation',
      questionType: 'eligibility',
      template: `## Mastercard Foundation Scholars Program - Eligibility

### Required:
- ✅ Citizen of an African country
- ✅ Academic excellence (GPA 3.5+)
- ✅ Demonstrated financial need
- ✅ Leadership potential
- ✅ Age under 29
- ✅ IELTS 6.5+ or TOEFL 79+

### Covers:
- Full tuition fees
- Living expenses
- Travel costs
- Books and materials
- Renewable for up to 4 years

### Fields of Study:
- Engineering
- Business
- Agriculture
- Health Sciences
- Technology

**This scholarship prioritizes students who demonstrate commitment to returning to Africa and contributing to their communities.**`,
    },
  ],
  'Chevening Scholarships': [
    {
      scholarshipName: 'Chevening Scholarships',
      provider: 'UK Government',
      questionType: 'application_steps',
      template: `## Chevening Scholarships - Application Steps

### Step 1: Check Eligibility
- Must have at least 2 years of work experience
- Meet English language requirements (IELTS 6.5+)
- Be a citizen of a Chevening-eligible country
- Return to your country for at least 2 years after studies

### Step 2: Prepare Documents
- Academic transcripts
- Two references (one academic, one professional)
- Personal statement (500 words)
- Work experience evidence
- IELTS/TOEFL scores

### Step 3: Apply Online
- Visit: https://www.chevening.org
- Application opens August 1
- Complete all sections carefully
- Submit before deadline (usually November 2)

### Step 4: Selection Process
- Application review
- Interview (if shortlisted)
- Final selection

**Deadline**: Usually November 2 annually
**Application Opens**: August 1

**Important**: Work experience is mandatory. Make sure you have at least 2 years before applying.`,
    },
    {
      scholarshipName: 'Chevening Scholarships',
      provider: 'UK Government',
      questionType: 'eligibility',
      template: `## Chevening Scholarships - Eligibility

### Required:
- ✅ At least 2 years of work experience (mandatory)
- ✅ IELTS 6.5+ (minimum, higher scores preferred)
- ✅ Citizen of Chevening-eligible country
- ✅ GPA 3.3+ (or equivalent)
- ✅ Commitment to return home for 2+ years after studies

### Covers:
- Full tuition fees
- Monthly living allowance
- Travel costs to/from UK
- Visa application fee
- One-year Master's degree only

### Eligible Countries (African):
- Kenya, Nigeria, Ghana, South Africa, Zimbabwe, and others

**Note**: This is one of the most competitive scholarships. Strong work experience and clear career goals are essential.`,
    },
  ],
  'DAAD Development-Related Postgraduate Courses': [
    {
      scholarshipName: 'DAAD Development-Related Postgraduate Courses',
      provider: 'DAAD (German Academic Exchange Service)',
      questionType: 'application_steps',
      template: `## DAAD Scholarships - Application Steps

### Step 1: Check Eligibility
- Citizen of a developing country
- At least 2 years of professional experience
- Relevant field of study
- IELTS 6.5+ or TOEFL 88+

### Step 2: Prepare Documents
- Academic transcripts
- CV/Resume (Europass format preferred)
- Motivation letter
- Work experience certificates
- Language test scores
- Research proposal (for some programs)

### Step 3: Apply
- Apply directly to German university first
- Then apply for DAAD scholarship
- Submit through DAAD portal or embassy
- Deadline usually April 30

### Step 4: Selection
- University admission decision
- DAAD scholarship selection
- Interview may be required

**Deadline**: Usually April 30 annually

**Tip**: Apply to the university program first, then the scholarship. Some programs require admission before scholarship application.`,
    },
  ],
};

/**
 * Get template for a specific scholarship and question type
 */
export function getScholarshipTemplate(
  scholarshipName: string,
  questionType: string
): string | null {
  const templates = SCHOLARSHIP_SPECIFIC_TEMPLATES[scholarshipName];
  if (!templates) return null;
  
  const template = templates.find((t) => t.questionType === questionType);
  return template?.template || null;
}

/**
 * Get general template by question type
 */
export function getGeneralTemplate(questionType: string): string | null {
  switch (questionType) {
    case 'application_steps':
      return APPLICATION_STEPS_TEMPLATE;
    case 'eligibility':
      return ELIGIBILITY_TEMPLATE;
    case 'tips':
      return APPLICATION_TIPS_TEMPLATE;
    default:
      return null;
  }
}

/**
 * Detect if a message matches a common scholarship name
 */
export function detectScholarshipName(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  const scholarshipNames = Object.keys(SCHOLARSHIP_SPECIFIC_TEMPLATES);
  for (const name of scholarshipNames) {
    if (lowerMessage.includes(name.toLowerCase())) {
      return name;
    }
  }
  
  return null;
}

