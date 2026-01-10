import { PrismaClient } from "@prisma/client";
import { getAllEmailTemplates } from "../lib/email-templates";

const prisma = new PrismaClient();

/**
 * Seed email templates to database
 * Run this once to initialize templates
 */
async function seedEmailTemplates() {
  try {
    console.log("🌱 Seeding email templates...");

    const templates = getAllEmailTemplates();

    for (const template of templates) {
      const exists = await prisma.emailTemplate.findUnique({
        where: { name: template.name },
      });

      if (exists) {
        console.log(`✓ Template "${template.name}" already exists`);
        continue;
      }

      await prisma.emailTemplate.create({
        data: {
          name: template.name,
          subject: template.subject,
          htmlContent: template.htmlContent,
          textContent: template.textContent,
          variables: template.variables,
          type: template.type,
        },
      });

      console.log(`✓ Created template: ${template.name}`);
    }

    console.log("✅ Email templates seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding email templates:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedEmailTemplates();
