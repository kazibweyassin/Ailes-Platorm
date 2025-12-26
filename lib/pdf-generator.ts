import jsPDF from 'jspdf';

interface StudentFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  currentCountry: string;
  city: string;
  address: string;
  
  // Academic Background
  currentDegree: string;
  fieldOfStudy: string;
  university: string;
  gpa: string;
  graduationYear: string;
  currentYear: string;
  
  // Test Scores
  hasTestScores: string;
  toeflScore: string;
  ieltsScore: string;
  greScore: string;
  gmatScore: string;
  satScore: string;
  
  // Study Preferences
  targetDegree: string;
  targetCountries: string;
  targetFields: string;
  preferredIntake: string;
  budgetRange: string;
  
  // Financial Information
  financialNeed: string;
  fundingSource: string;
  expectedFunding: string;
  
  // Additional Information
  workExperience: string;
  researchExperience: string;
  publications: string;
  awards: string;
  volunteerWork: string;
  languages: string;
  additionalInfo: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

export function generateStudentApplicationPDF(formData: StudentFormData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;
  const lineHeight = 7;
  const sectionSpacing = 10;

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Helper function to add a section header
  const addSectionHeader = (title: string) => {
    checkPageBreak(15);
    yPosition += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175); // Primary blue
    doc.text(title, margin, yPosition);
    yPosition += lineHeight;
    doc.setDrawColor(30, 64, 175);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += sectionSpacing;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
  };

  // Helper function to add a field
  const addField = (label: string, value: string, isRequired: boolean = false) => {
    if (!value || value.trim() === '') return;
    
    checkPageBreak(10);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}${isRequired ? ' *' : ''}:`, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(value, pageWidth - margin * 2 - 50);
    doc.text(lines, margin + 50, yPosition);
    yPosition += lines.length * lineHeight + 3;
  };

  // Header
  doc.setFillColor(30, 64, 175); // Primary blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('AILES GLOBAL', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Student Application Form', pageWidth / 2, 30, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  yPosition = 50;

  // Date
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Application Date: ${today}`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 10;

  // 1. Personal Information
  addSectionHeader('1. Personal Information');
  addField('First Name', formData.firstName, true);
  addField('Last Name', formData.lastName, true);
  addField('Email', formData.email, true);
  addField('Phone', formData.phone, true);
  addField('Date of Birth', formData.dateOfBirth, true);
  addField('Gender', formData.gender, true);
  addField('Nationality', formData.nationality, true);
  addField('Current Country', formData.currentCountry);
  addField('City', formData.city);
  addField('Address', formData.address);

  // 2. Academic Background
  addSectionHeader('2. Academic Background');
  addField('Current Degree Level', formData.currentDegree, true);
  addField('Field of Study', formData.fieldOfStudy, true);
  addField('University/Institution', formData.university, true);
  addField('Current GPA', formData.gpa, true);
  addField('Current Year', formData.currentYear);
  addField('Expected Graduation Year', formData.graduationYear, true);

  // 3. Test Scores
  if (formData.hasTestScores === 'yes') {
    addSectionHeader('3. Standardized Test Scores');
    addField('TOEFL Score', formData.toeflScore);
    addField('IELTS Score', formData.ieltsScore);
    addField('GRE Score', formData.greScore);
    addField('GMAT Score', formData.gmatScore);
    addField('SAT Score', formData.satScore);
  }

  // 4. Study Preferences
  addSectionHeader('4. Study Preferences');
  addField('Target Degree Level', formData.targetDegree, true);
  addField('Target Countries', formData.targetCountries, true);
  addField('Target Fields of Study', formData.targetFields, true);
  addField('Preferred Intake', formData.preferredIntake);
  addField('Budget Range', formData.budgetRange);

  // 5. Financial Information
  addSectionHeader('5. Financial Information');
  addField('Financial Need', formData.financialNeed, true);
  addField('Funding Source', formData.fundingSource);
  addField('Expected Funding Amount', formData.expectedFunding);

  // 6. Additional Information
  addSectionHeader('6. Additional Information');
  addField('Work Experience', formData.workExperience);
  addField('Research Experience', formData.researchExperience);
  addField('Publications', formData.publications);
  addField('Awards & Honors', formData.awards);
  addField('Volunteer Work', formData.volunteerWork);
  addField('Languages Spoken', formData.languages);
  addField('Additional Information', formData.additionalInfo);

  // 7. Emergency Contact
  addSectionHeader('7. Emergency Contact');
  addField('Contact Name', formData.emergencyContactName);
  addField('Contact Phone', formData.emergencyContactPhone);
  addField('Relationship', formData.emergencyContactRelation);

  // Footer
  const totalPages = (doc as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      'AILES Global - Premium Study Abroad & Scholarship Consulting',
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }

  // Declaration
  checkPageBreak(30);
  yPosition += 10;
  addSectionHeader('Declaration');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  const declarationText = [
    'I hereby declare that all the information provided in this application form is true and correct to the best of my knowledge.',
    'I understand that any false or misleading information may result in the rejection of my application.',
    'I authorize AILES Global to use this information for the purpose of processing my application and matching me with suitable opportunities.',
    '',
    `Signature: _________________________    Date: ${today}`,
  ];
  declarationText.forEach((line) => {
    checkPageBreak(10);
    const lines = doc.splitTextToSize(line, pageWidth - margin * 2);
    doc.text(lines, margin, yPosition);
    yPosition += lines.length * lineHeight + 3;
  });

  // Generate filename
  const filename = `AILES_Application_${formData.firstName}_${formData.lastName}_${new Date().toISOString().split('T')[0]}.pdf`;
  
  // Save the PDF
  doc.save(filename);
}

// New function for Student Intake Form PDF
export async function generateStudentIntakePDF(intake: any): Promise<Buffer> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;
  const lineHeight = 7;
  const sectionSpacing = 10;

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // Helper function to add a section header
  const addSectionHeader = (title: string) => {
    checkPageBreak(15);
    yPosition += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175); // Primary blue
    doc.text(title, margin, yPosition);
    yPosition += lineHeight;
    doc.setDrawColor(30, 64, 175);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += sectionSpacing;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
  };

  // Helper function to add a field
  const addField = (label: string, value: any, isRequired: boolean = false) => {
    if (!value || value.toString().trim() === '') return;
    
    checkPageBreak(10);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}${isRequired ? ' *' : ''}:`, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    const valueStr = typeof value === 'object' && value instanceof Date 
      ? value.toLocaleDateString() 
      : value.toString();
    const lines = doc.splitTextToSize(valueStr, pageWidth - margin * 2 - 50);
    doc.text(lines, margin + 50, yPosition);
    yPosition += lines.length * lineHeight + 3;
  };

  // Header
  doc.setFillColor(30, 64, 175); // Primary blue
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('AILES GLOBAL', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Student Intake Form', pageWidth / 2, 30, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  yPosition = 50;

  // Reference ID and Date
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Reference ID: ${intake.id}`, margin, yPosition);
  doc.text(`Submission Date: ${new Date(intake.createdAt).toLocaleDateString()}`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 15;

  // Status Badge
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const statusColors: Record<string, [number, number, number]> = {
    NEW: [34, 197, 94],
    IN_REVIEW: [234, 179, 8],
    CONTACTED: [59, 130, 246],
    IN_PROGRESS: [168, 85, 247],
    COMPLETED: [16, 185, 129],
    ARCHIVED: [107, 114, 128],
  };
  const statusColor = statusColors[intake.status] || [100, 100, 100];
  doc.setFillColor(...statusColor);
  doc.roundedRect(margin, yPosition, 35, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text(intake.status, margin + 17.5, yPosition + 5.5, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  yPosition += 20;

  // 1. Personal Information
  addSectionHeader('1. Personal Information');
  addField('First Name', intake.firstName, true);
  addField('Last Name', intake.lastName, true);
  addField('Email', intake.email, true);
  addField('Phone', intake.phone, true);
  addField('Date of Birth', intake.dateOfBirth, true);
  addField('Gender', intake.gender, true);
  addField('Nationality', intake.nationality, true);
  addField('Current Country', intake.currentCountry, true);
  addField('City', intake.city, true);
  addField('Address', intake.address);

  // 2. Academic Background
  addSectionHeader('2. Academic Background');
  addField('Current Degree Level', intake.currentDegree, true);
  addField('Field of Study', intake.fieldOfStudy, true);
  addField('University/Institution', intake.university, true);
  addField('Current GPA', intake.gpa, true);
  addField('Current Year', intake.currentYear, true);
  addField('Expected Graduation Year', intake.graduationYear, true);

  // 3. Test Scores
  if (intake.hasTestScores) {
    addSectionHeader('3. Standardized Test Scores');
    addField('TOEFL Score', intake.toeflScore);
    addField('IELTS Score', intake.ieltsScore);
    addField('GRE Score', intake.greScore);
    addField('GMAT Score', intake.gmatScore);
    addField('SAT Score', intake.satScore);
  }

  // 4. Study Preferences
  addSectionHeader('4. Study Preferences');
  addField('Target Degree Level', intake.targetDegree, true);
  addField('Target Countries', intake.targetCountries, true);
  addField('Target Fields of Study', intake.targetFields, true);
  addField('Preferred Intake', intake.preferredIntake, true);
  addField('Budget Range', intake.budgetRange, true);

  // 5. Financial Information
  addSectionHeader('5. Financial Information');
  addField('Financial Need', intake.financialNeed, true);
  addField('Funding Source', intake.fundingSource, true);
  addField('Expected Funding Amount', intake.expectedFunding, true);

  // 6. Additional Information
  const hasAdditionalInfo = intake.workExperience || intake.researchExperience || 
                           intake.publications || intake.awards || 
                           intake.volunteerWork || intake.languages;
  
  if (hasAdditionalInfo) {
    addSectionHeader('6. Additional Information');
    addField('Work Experience', intake.workExperience);
    addField('Research Experience', intake.researchExperience);
    addField('Publications', intake.publications);
    addField('Awards & Honors', intake.awards);
    addField('Volunteer Work', intake.volunteerWork);
    addField('Languages Spoken', intake.languages);
  }

  if (intake.additionalInfo) {
    addSectionHeader('7. Additional Notes');
    addField('Notes', intake.additionalInfo);
  }

  // 8. Consent & Preferences
  addSectionHeader('8. Consent & Preferences');
  addField('Data Usage Consent', intake.consentDataUsage ? 'Yes' : 'No', true);
  addField('Marketing Emails', intake.marketingEmails ? 'Yes' : 'No');

  // Internal Notes (if any)
  if (intake.notes) {
    addSectionHeader('Internal Notes (Admin)');
    doc.setFillColor(250, 250, 250);
    checkPageBreak(30);
    const notesLines = doc.splitTextToSize(intake.notes, pageWidth - margin * 2 - 4);
    const notesHeight = notesLines.length * lineHeight + 8;
    doc.roundedRect(margin, yPosition - 2, pageWidth - margin * 2, notesHeight, 3, 3, 'F');
    doc.setFontSize(9);
    doc.text(notesLines, margin + 2, yPosition + 3);
    yPosition += notesHeight + 5;
  }

  // Footer on all pages
  const totalPages = (doc as any).getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      'AILES Global - Premium Study Abroad & Scholarship Consulting',
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }

  // Declaration
  doc.setPage(totalPages);
  checkPageBreak(35);
  yPosition += 10;
  addSectionHeader('Declaration');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  const declarationLines = doc.splitTextToSize(
    'I hereby declare that all the information provided in this intake form is true and correct to the best of my knowledge. ' +
    'I understand that any false or misleading information may affect the consultation services provided. ' +
    'I authorize AILES Global to use this information for the purpose of educational consultation and scholarship matching.',
    pageWidth - margin * 2
  );
  declarationLines.forEach((line: string) => {
    checkPageBreak(10);
    doc.text(line, margin, yPosition);
    yPosition += lineHeight;
  });
  
  yPosition += 10;
  checkPageBreak(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${new Date(intake.createdAt).toLocaleDateString()}`, margin, yPosition);

  // Convert PDF to buffer for API response
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}

