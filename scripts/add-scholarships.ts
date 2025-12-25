import { PrismaClient, ScholarshipType, DegreeLevel } from '@prisma/client';
import { createPromptModule } from 'inquirer';
import chalk from 'chalk';

const prisma = new PrismaClient();
const prompt = createPromptModule();

// Helper function to check for duplicates
async function checkDuplicate(name: string, provider: string): Promise<boolean> {
  const existing = await prisma.scholarship.findFirst({
    where: {
      OR: [
        { name: { equals: name, mode: 'insensitive' } },
        { provider: { equals: provider, mode: 'insensitive' } }
      ]
    }
  });
  return !!existing;
}

// Main function to add scholarships
async function addScholarships() {
  console.log(chalk.blue('🎓 AILES Scholarship Addition Tool 🎓'));
  console.log(chalk.gray('Add new scholarships to the database\n'));

  const { action } = await prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: 'Add a single scholarship', value: 'single' },
        { name: 'Add multiple scholarships from a predefined list', value: 'multiple' },
        { name: 'Exit', value: 'exit' }
      ]
    }
  ]);

  if (action === 'exit') {
    console.log(chalk.yellow('👋 Exiting...'));
    await prisma.$disconnect();
    process.exit(0);
  }

  if (action === 'single') {
    await addSingleScholarship();
  } else if (action === 'multiple') {
    await addMultipleScholarships();
  }
}

async function addSingleScholarship() {
  console.log(chalk.blue('\n📝 Add a New Scholarship'));
  
  const answers = await prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Scholarship Name:',
      validate: input => input.trim() ? true : 'Name is required'
    },
    {
      type: 'input',
      name: 'provider',
      message: 'Provider/Organization:',
      validate: input => input.trim() ? true : 'Provider is required'
    },
    {
      type: 'input',
      name: 'country',
      message: 'Country (or "Multiple" for international):',
      default: 'Multiple Countries'
    },
    {
      type: 'list',
      name: 'type',
      message: 'Scholarship Type:',
      choices: Object.values(ScholarshipType)
    },
    {
      type: 'input',
      name: 'amount',
      message: 'Amount (enter 0 if full scholarship):',
      default: '0',
      validate: input => !isNaN(Number(input)) ? true : 'Please enter a valid number'
    },
    {
      type: 'input',
      name: 'currency',
      message: 'Currency (e.g., USD, EUR, GBP):',
      default: 'USD'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description:',
      validate: input => input.trim() ? true : 'Description is required'
    },
    {
      type: 'input',
      name: 'eligibility',
      message: 'Eligibility Criteria:',
      default: 'Open to all eligible candidates'
    },
    {
      type: 'input',
      name: 'deadline',
      message: 'Application Deadline (YYYY-MM-DD):',
      validate: input => {
        const date = new Date(input);
        return !isNaN(date.getTime()) ? true : 'Please enter a valid date (YYYY-MM-DD)';
      }
    },
    {
      type: 'input',
      name: 'applicationLink',
      message: 'Application Link:',
      validate: input => input.trim() ? true : 'Application link is required'
    },
    {
      type: 'input',
      name: 'website',
      message: 'Official Website:',
      validate: input => input.trim() ? true : 'Website is required'
    },
    {
      type: 'input',
      name: 'contactEmail',
      message: 'Contact Email (optional):',
      default: ''
    },
    {
      type: 'checkbox',
      name: 'degreeLevels',
      message: 'Eligible Degree Levels:',
      choices: Object.values(DegreeLevel),
      default: [DegreeLevel.BACHELOR, DegreeLevel.MASTER, DegreeLevel.PHD]
    },
    {
      type: 'input',
      name: 'fieldsOfStudy',
      message: 'Fields of Study (comma-separated, e.g., Engineering, Business, Medicine):',
      default: 'All'
    },
    {
      type: 'confirm',
      name: 'isActive',
      message: 'Is this scholarship currently active?',
      default: true
    }
  ]);

  // Check for duplicates
  const duplicate = await checkDuplicate(answers.name, answers.provider);
  if (duplicate) {
    console.log(chalk.yellow('⚠️  A similar scholarship already exists in the database.'));
    const { proceed } = await prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Do you want to add it anyway?',
        default: false
      }
    ]);
    
    if (!proceed) {
      console.log(chalk.yellow('❌ Scholarship not added.'));
      await prisma.$disconnect();
      process.exit(0);
    }
  }

  // Create the scholarship
  try {
    const scholarship = await prisma.scholarship.create({
      data: {
        name: answers.name,
        provider: answers.provider,
        country: answers.country,
        amount: parseFloat(answers.amount) || 0,
        currency: answers.currency,
        type: answers.type as ScholarshipType,
        description: answers.description,
        eligibility: answers.eligibility,
        deadline: new Date(answers.deadline),
        applicationOpenDate: new Date(), // Default to now
        applicationLink: answers.applicationLink,
        website: answers.website,
        contactEmail: answers.contactEmail || null,
        fieldOfStudy: answers.fieldsOfStudy.split(',').map((f: string) => f.trim()),
        degreeLevel: answers.degreeLevels as DegreeLevel[],
        // isActive field removed as it doesn't exist in the schema
      }
    });

    console.log(chalk.green(`\n✅ Successfully added scholarship: ${scholarship.name}`));
    console.log(chalk.blue(`🔗 View in database: ${chalk.underline(`http://localhost:5555/scholarships/${scholarship.id}`)}`));
    
  } catch (error) {
    console.error(chalk.red('❌ Error adding scholarship:'), error);
  }

  await prisma.$disconnect();
}

async function addMultipleScholarships() {
  console.log(chalk.blue('\n📝 Add Multiple Scholarships'));
  
  // Example predefined scholarships (you can add more here)
  const predefinedScholarships = [
    {
      name: "African Leadership University Mastercard Foundation Scholars Program",
      provider: "African Leadership University",
      country: "Rwanda, Mauritius",
      amount: 0,
      currency: "USD",
      type: ScholarshipType.FULL,
      description: "A leadership development program that provides comprehensive scholarships to young African leaders.",
      eligibility: "African citizens, demonstrated leadership potential, academic excellence, and commitment to giving back to their communities.",
      deadline: "2026-03-15",
      applicationOpenDate: new Date().toISOString(),
      applicationLink: "https://alueducation.com/mastercard-foundation-scholars-program/",
      website: "https://alueducation.com",
      contactEmail: "admissions@alueducation.com",
      fieldOfStudy: ["All"],
      degreeLevel: [DegreeLevel.BACHELOR, DegreeLevel.MASTER]
    },
    {
      name: "Aga Khan Foundation International Scholarship Programme",
      provider: "Aga Khan Foundation",
      country: "Multiple Countries",
      amount: 50000,
      currency: "USD",
      type: ScholarshipType.PARTIAL,
      description: "The Aga Khan Foundation provides a limited number of scholarships each year for postgraduate studies to outstanding students from select developing countries.",
      eligibility: "Outstanding students from developing countries with no other means of financing their studies.",
      deadline: "2026-03-31",
      applicationOpenDate: new Date().toISOString(),
      applicationLink: "https://www.akdn.org/our-agencies/aga-khan-foundation/international-scholarship-programme",
      website: "https://www.akdn.org",
      contactEmail: "akf.scholarships@akdn.org",
      fieldOfStudy: ["All"],
      degreeLevel: [DegreeLevel.MASTER, DegreeLevel.PHD]
    }
  ];

  console.log(chalk.yellow(`\n📋 Found ${predefinedScholarships.length} predefined scholarships.`));
  
  for (const scholarship of predefinedScholarships) {
    console.log(chalk.blue(`\n📝 Adding: ${scholarship.name}`));
    
    // Check for duplicates
    const duplicate = await checkDuplicate(scholarship.name, scholarship.provider);
    if (duplicate) {
      console.log(chalk.yellow(`⚠️  Skipping duplicate: ${scholarship.name}`));
      continue;
    }

    try {
      const created = await prisma.scholarship.create({
        data: {
          ...scholarship,
          deadline: new Date(scholarship.deadline),
          applicationOpenDate: new Date()
        }
      });
      console.log(chalk.green(`✅ Added: ${created.name}`));
    } catch (error) {
      console.error(chalk.red(`❌ Error adding ${scholarship.name}:`), error);
    }
  }

  console.log(chalk.green('\n🎉 Finished adding predefined scholarships!'));
  await prisma.$disconnect();
}

// Run the script
addScholarships().catch(console.error);
