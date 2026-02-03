/**
 * Smart Email Digest Service
 * Sends curated scholarship matches instead of overwhelming individual emails
 */

import { prisma } from "@/lib/prisma";
import { calculateMatchScore } from "@/lib/matching-engine";
import nodemailer from "nodemailer";

interface DigestEmail {
  userEmail: string;
  userName: string;
  topMatches: Array<{
    score: number;
    scholarship: {
      name: string;
      provider: string;
      amount: number;
      country: string;
      deadline: string;
      description: string;
    };
  }>;
  hiddenGems: Array<{
    score: number;
    scholarship: {
      name: string;
      provider: string;
      amount: number;
      country: string;
    };
  }>;
  recommendationLink: string;
}

/**
 * Generate weekly digest of top matches for a user
 */
export async function generateWeeklyDigest(userId: string): Promise<DigestEmail | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        currentGPA: true,
        ieltsScore: true,
        toeflScore: true,
        greScore: true,
        gmatScore: true,
        fieldOfStudy: true,
        degreeLevel: true,
        country: true,
        interestedCountries: true,
        dateOfBirth: true,
        gender: true,
        emailPreferences: {
          select: { matchNotifications: true }
        }
      }
    });

    if (!user || !user.emailPreferences?.matchNotifications) {
      return null;
    }

    // Get scholarships from last 7 days (new or expiring soon)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const scholarships = await prisma.scholarship.findMany({
      where: {
        deadline: {
          gte: new Date(), // Future deadlines
          lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // Within 90 days
        },
        OR: [
          { createdAt: { gte: sevenDaysAgo } }, // New scholarships
          { updatedAt: { gte: sevenDaysAgo } } // Recently updated
        ]
      },
      select: {
        id: true,
        name: true,
        provider: true,
        country: true,
        amount: true,
        currency: true,
        type: true,
        description: true,
        deadline: true,
        minGPA: true,
        degreeLevel: true,
        fieldOfStudy: true,
        forWomen: true,
        forAfrican: true,
        requiresIELTS: true,
        minIELTS: true,
        requiresTOEFL: true,
        minTOEFL: true,
        requiresGRE: true,
        requiresGMAT: true,
        views: true,
        featured: true
      },
      take: 100 // Get top 100 to find best matches
    });

    if (scholarships.length === 0) {
      return null;
    }

    // Calculate scores for all scholarships
    const scoredMatches = scholarships
      .map((scholarship) =>
        calculateMatchScore(user as any, scholarship as any)
      )
      .filter((match) => match.overallScore >= 60) // Only good matches
      .sort((a, b) => b.overallScore - a.overallScore);

    if (scoredMatches.length === 0) {
      return null;
    }

    // Get top 3 matches
    const topMatches = scoredMatches.slice(0, 3).map((match) => {
      const scholarship = scholarships.find((s) => s.id === match.scholarshipId)!;
      return {
        score: match.overallScore,
        scholarship: {
          name: scholarship.name,
          provider: scholarship.provider,
          amount: scholarship.amount || 0,
          country: scholarship.country || "Unknown",
          deadline: scholarship.deadline?.toLocaleDateString() || "N/A",
          description: scholarship.description || ""
        }
      };
    });

    // Get hidden gems (good matches with low views)
    const hiddenGems = scoredMatches
      .filter((match) => {
        const scholarship = scholarships.find((s) => s.id === match.scholarshipId);
        return (scholarship?.views || 0) < 50 && match.overallScore >= 70;
      })
      .slice(0, 2)
      .map((match) => {
        const scholarship = scholarships.find((s) => s.id === match.scholarshipId)!;
        return {
          score: match.overallScore,
          scholarship: {
            name: scholarship.name,
            provider: scholarship.provider,
            amount: scholarship.amount || 0,
            country: scholarship.country || "Unknown"
          }
        };
      });

    return {
      userEmail: user.email,
      userName: user.name || "Scholar",
      topMatches,
      hiddenGems,
      recommendationLink: `${process.env.NEXT_PUBLIC_APP_URL || "https://ailes-platform.com"}/recommendations`
    };
  } catch (error) {
    console.error("Error generating digest:", error);
    return null;
  }
}

/**
 * Send digest email
 */
export async function sendDigestEmail(digest: DigestEmail): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const topMatchesHTML = digest.topMatches
      .map(
        (match) => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 16px;">
          <strong>${match.scholarship.name}</strong><br/>
          <small style="color: #666;">${match.scholarship.provider}</small><br/>
          <small style="color: #999;">${match.scholarship.country} • ${match.scholarship.deadline}</small>
        </td>
        <td style="padding: 16px; text-align: center;">
          <span style="background-color: #4f46e5; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;">
            ${match.score}% Match
          </span>
        </td>
      </tr>
    `
      )
      .join("");

    const hiddenGemsHTML =
      digest.hiddenGems.length > 0
        ? digest.hiddenGems
            .map(
              (gem) => `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px;">
              <strong>${gem.scholarship.name}</strong><br/>
              <small style="color: #666;">${gem.scholarship.provider}</small><br/>
              <small style="color: #999;">${gem.scholarship.country} • $${gem.scholarship.amount.toLocaleString()}</small>
            </td>
            <td style="padding: 12px; text-align: center;">
              <span style="background-color: #8b5cf6; color: white; padding: 3px 6px; border-radius: 3px; font-size: 12px; font-weight: bold;">
                ${gem.score}% Match
              </span>
            </td>
          </tr>
        `
            )
            .join("")
        : "";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 4px 4px 0 0; }
          .content { background-color: #f9fafb; padding: 20px; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 12px; color: #1f2937; }
          table { width: 100%; border-collapse: collapse; }
          .cta-button { 
            display: inline-block; 
            background-color: #4f46e5; 
            color: white; 
            padding: 10px 20px; 
            text-decoration: none; 
            border-radius: 4px;
            margin-top: 12px;
          }
          .footer { background-color: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">⚡ Your Weekly Scholarship Matches</h1>
            <p style="margin: 8px 0 0 0;">Personalized for you based on your profile</p>
          </div>
          
          <div class="content">
            <p>Hi ${digest.userName},</p>
            <p>We found ${digest.topMatches.length + digest.hiddenGems.length} new scholarship opportunities that match your profile this week!</p>
            
            <div class="section">
              <div class="section-title">🎯 Top Matches for You</div>
              <table>
                ${topMatchesHTML}
              </table>
            </div>

            ${hiddenGemsHTML ? `
              <div class="section">
                <div class="section-title">💎 Hidden Gems</div>
                <p style="font-size: 14px; color: #666; margin-bottom: 12px;">Lesser-known scholarships with excellent matches for you</p>
                <table>
                  ${hiddenGemsHTML}
                </table>
              </div>
            ` : ""}

            <div class="section" style="text-align: center;">
              <a href="${digest.recommendationLink}" class="cta-button">
                View All Recommendations
              </a>
            </div>

            <p style="font-size: 14px; color: #666; margin-top: 24px;">
              Want to update your preferences? Visit your profile to adjust which scholarships we recommend.
            </p>
          </div>

          <div class="footer">
            <p style="margin: 0;">
              © 2024 AILES Platform. We help African students find study abroad opportunities.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"AILES Platform" <${process.env.EMAIL_USER}>`,
      to: digest.userEmail,
      subject: `⚡ Your ${digest.topMatches.length} Best Scholarship Matches This Week`,
      html: htmlContent
    });

    return true;
  } catch (error) {
    console.error("Error sending digest email:", error);
    return false;
  }
}

/**
 * Send weekly digests to all users with notifications enabled
 * (Run via cron job)
 */
export async function sendWeeklyDigests() {
  try {
    const users = await prisma.user.findMany({
      where: {
        emailPreferences: {
          matchNotifications: true
        }
      },
      select: { id: true }
    });

    let successCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        const digest = await generateWeeklyDigest(user.id);
        if (digest) {
          const sent = await sendDigestEmail(digest);
          if (sent) {
            successCount++;
          } else {
            errorCount++;
          }
        }
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
        errorCount++;
      }
    }

    console.log(`Weekly digests sent: ${successCount} success, ${errorCount} errors`);
    return { successCount, errorCount };
  } catch (error) {
    console.error("Error sending weekly digests:", error);
    return { successCount: 0, errorCount: 0 };
  }
}
