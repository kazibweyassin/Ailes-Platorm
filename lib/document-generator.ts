import OpenAI from 'openai';

// Support both OPENAI_API_KEY and OPENAI_KEY
const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

/**
 * Generate application documents (motivation letter, CV, etc.) for a Copilot request.
 * Uses AI to create personalized, high-quality application materials.
 */
export async function generateDocuments(finderData: any, mapping: any): Promise<any> {
  if (!apiKey || !openai) {
    // Fallback to basic template if no API key
    return generateBasicDocuments(finderData, mapping);
  }

  try {
    // Generate personalized motivation letter using AI
    const motivationLetterPrompt = `Write a compelling scholarship motivation letter for a student with the following profile:
- Name: ${finderData.name || finderData.paymentName || "Student"}
- Nationality: ${finderData.nationality || "Not specified"}
- Field of Study: ${finderData.fieldOfStudy || "Not specified"}
- Degree Level: ${finderData.degreeLevel || "Not specified"}
- Destination: ${finderData.destination || "Not specified"}
- Funding Type: ${finderData.fundingType || "Not specified"}
${finderData.currentGPA ? `- Current GPA: ${finderData.currentGPA}` : ""}
${finderData.bio ? `- Background: ${finderData.bio}` : ""}

Write a professional, persuasive motivation letter (500-700 words) that:
1. Introduces the student and their academic background
2. Explains their passion for their field of study
3. Describes their career goals and how the scholarship will help
4. Highlights their unique qualities and contributions
5. Demonstrates financial need (if applicable)
6. Shows commitment to giving back to their community

Format as a formal letter with proper greeting and closing.`;

    const motivationResponse = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert scholarship application writer. Write compelling, authentic, and personalized motivation letters that help students win scholarships."
        },
        {
          role: "user",
          content: motivationLetterPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const motivationLetter = motivationResponse.choices[0]?.message?.content || generateBasicMotivationLetter(finderData);

    // Generate filled form preview
    const filledFormPreview = mapping?.map((m: any) => {
      const value = finderData[m.profileKey] || 
                   finderData[m.profileKey?.toLowerCase()] || 
                   "[To be filled]";
      return {
        selector: m.selector,
        profileKey: m.profileKey,
        inputType: m.inputType,
        value: value,
        confidence: m.confidence || 0.8,
      };
    }) || [];

    // Generate additional documents if needed
    const documents = {
      motivationLetter,
      filledFormPreview,
      personalStatement: motivationLetter, // Can be customized separately
      generatedAt: new Date().toISOString(),
      metadata: {
        fieldOfStudy: finderData.fieldOfStudy,
        destination: finderData.destination,
        degreeLevel: finderData.degreeLevel,
      }
    };

    return documents;
  } catch (error) {
    console.error("Error generating documents with AI:", error);
    // Fallback to basic generation
    return generateBasicDocuments(finderData, mapping);
  }
}

function generateBasicDocuments(finderData: any, mapping: any) {
  const name = finderData.name || finderData.paymentName || "[Name]";
  const motivationLetter = generateBasicMotivationLetter(finderData);
  
  const filledFormPreview = mapping?.map((m: any) => ({
    selector: m.selector,
    profileKey: m.profileKey,
    inputType: m.inputType,
    value: finderData[m.profileKey] || "[Sample]",
    confidence: m.confidence || 0.5,
  })) || [];

  return {
    motivationLetter,
    filledFormPreview,
    personalStatement: motivationLetter,
    generatedAt: new Date().toISOString(),
    metadata: {
      fieldOfStudy: finderData.fieldOfStudy,
      destination: finderData.destination,
      degreeLevel: finderData.degreeLevel,
    }
  };
}

function generateBasicMotivationLetter(finderData: any): string {
  const name = finderData.name || finderData.paymentName || "[Your Name]";
  const field = finderData.fieldOfStudy || "[Your Field of Study]";
  const destination = finderData.destination || "[Destination Country]";
  const degree = finderData.degreeLevel || "[Degree Level]";
  const nationality = finderData.nationality || "[Your Country]";

  return `Dear Scholarship Committee,

I am writing to express my sincere interest in applying for the scholarship program to pursue my ${degree} degree in ${field} in ${destination}. My name is ${name}, and I am a dedicated student from ${nationality} with a strong passion for academic excellence and a commitment to making a positive impact in my field.

ACADEMIC BACKGROUND AND ACHIEVEMENTS
Throughout my academic journey, I have consistently demonstrated excellence in my studies. My interest in ${field} has driven me to seek opportunities that will allow me to contribute meaningfully to this field while advancing my own knowledge and skills.

WHY THIS SCHOLARSHIP
This scholarship represents more than just financial support; it is an opportunity to pursue my academic dreams without the burden of financial constraints. Coming from ${nationality}, I understand the value of education and the transformative power it holds. This scholarship will enable me to focus entirely on my studies and research, allowing me to achieve my full potential.

CAREER GOALS AND FUTURE CONTRIBUTIONS
Upon completion of my ${degree} in ${field}, I plan to return to ${nationality} and apply the knowledge and skills I have gained to address critical challenges in my community. I am committed to using my education to create positive change and contribute to the development of my country.

FINANCIAL NEED
While I am highly motivated and academically capable, financial constraints present a significant barrier to achieving my educational goals. This scholarship would provide the necessary support to make my dreams a reality.

CONCLUSION
I am confident that with this scholarship, I will not only excel academically but also become a valuable contributor to the academic community and my home country. I am committed to maintaining high academic standards and using this opportunity to its fullest potential.

Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your program.

Sincerely,
${name}`;
}
