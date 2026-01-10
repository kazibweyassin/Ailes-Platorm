import { EmailType } from "@prisma/client";

export interface EmailTemplateData {
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  type: EmailType;
  variables: string[];
}

/**
 * Email Templates Library
 * All templates support {{variable}} substitution
 */

export const emailTemplates: Record<string, EmailTemplateData> = {
  // Welcome Series
  "welcome-1": {
    name: "welcome-1",
    type: EmailType.WELCOME,
    subject: "🎓 Welcome to Ailes Global - Your Scholarship Journey Starts Here",
    variables: ["userName", "scholarshipCount"],
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Ailes Global! 🚀</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your Scholarship Journey Starts Here</p>
        </div>
        
        <div style="padding: 30px 20px; background: #f9fafb;">
          <p style="font-size: 16px; color: #374151;">Hi {{userName}},</p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Welcome to Ailes Global! We're thrilled to have you on board. We've already found 
            <strong>{{scholarshipCount}} scholarships</strong> that match your profile.
          </p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #667eea; margin-top: 0;">Here's What You Can Do Now:</h3>
            <ul style="color: #374151; line-height: 1.8;">
              <li><strong>Browse Scholarships:</strong> View all opportunities matching your profile</li>
              <li><strong>Save Favorites:</strong> Keep track of scholarships you're interested in</li>
              <li><strong>Get AI Assistance:</strong> Our Copilot can help with applications</li>
              <li><strong>Track Applications:</strong> Monitor your application status</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{appUrl}}/dashboard" style="background: #667eea; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              View Your Matches →
            </a>
          </div>
          
          <div style="background: #eff6ff; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="color: #1e40af; margin: 0; font-size: 14px;">
              💡 <strong>Pro Tip:</strong> Check your email preferences to customize what updates you receive
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Need help? Reply to this email or visit our <a href="{{appUrl}}/help" style="color: #667eea; text-decoration: none;">help center</a>.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #f3f4f6; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">© 2025 Ailes Global. Empowering African women through education.</p>
          <p style="margin: 5px 0 0 0;">
            <a href="{{appUrl}}/unsubscribe/{{userId}}" style="color: #667eea; text-decoration: none;">Unsubscribe</a> | 
            <a href="{{appUrl}}/email-preferences" style="color: #667eea; text-decoration: none;">Preferences</a>
          </p>
        </div>
      </div>
    `,
  },

  // Deadline Reminder
  "deadline-reminder": {
    name: "deadline-reminder",
    type: EmailType.DEADLINE_REMINDER,
    subject: "⏰ {{scholarshipName}} - Only {{daysLeft}} Days Left!",
    variables: ["userName", "scholarshipName", "daysLeft", "scholarshipUrl", "scholarshipAmount"],
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ff6b6b; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0;">⏰ Deadline Reminder</h2>
        </div>
        
        <div style="padding: 30px 20px; background: #fff5f5;">
          <p style="font-size: 16px; color: #374151;">Hi {{userName}},</p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #ff6b6b;">
            <h3 style="color: #ff6b6b; margin-top: 0;">{{scholarshipName}}</h3>
            <p style="font-size: 14px; color: #6b7280; margin: 10px 0;">
              <strong>Only {{daysLeft}} days left to apply!</strong>
            </p>
            <p style="font-size: 20px; color: #667eea; margin: 10px 0;">
              {{scholarshipAmount}}
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{scholarshipUrl}}" style="background: #ff6b6b; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              Apply Now →
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            Don't miss this opportunity! Click the button above to view the scholarship and start your application.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #f3f4f6; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">© 2025 Ailes Global</p>
        </div>
      </div>
    `,
  },

  // Weekly Newsletter
  "weekly-newsletter": {
    name: "weekly-newsletter",
    type: EmailType.WEEKLY_NEWSLETTER,
    subject: "📰 {{weekNumber}} New Scholarships Just Added - {{scholarshipCount}} Matches For You",
    variables: ["userName", "weekNumber", "scholarshipCount", "topScholarships", "appUrl"],
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">📰 This Week's Opportunities</h1>
          <p style="margin: 10px 0 0 0;">{{scholarshipCount}} scholarships matching your profile</p>
        </div>
        
        <div style="padding: 30px 20px; background: #f9fafb;">
          <p style="font-size: 16px; color: #374151;">Hi {{userName}},</p>
          
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            We've found {{scholarshipCount}} new scholarships this week that match your profile. 
            Here are our top picks:
          </p>
          
          {{topScholarships}}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{appUrl}}/dashboard" style="background: #667eea; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              View All Matches →
            </a>
          </div>
          
          <div style="background: #eff6ff; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <p style="color: #1e40af; margin: 0; font-size: 14px;">
              💡 <strong>Did you know?</strong> Students who apply within 7 days of finding a scholarship have a 2.5x higher success rate!
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #f3f4f6; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">© 2025 Ailes Global. Empowering African women through education.</p>
          <p style="margin: 5px 0 0 0;">
            <a href="{{appUrl}}/unsubscribe/{{userId}}" style="color: #667eea; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      </div>
    `,
  },

  // New Scholarship Match
  "scholarship-match": {
    name: "scholarship-match",
    type: EmailType.SCHOLARSHIP_MATCH,
    subject: "🎯 Perfect Match Found: {{scholarshipName}} ({{matchPercentage}}% Match)",
    variables: ["userName", "scholarshipName", "matchPercentage", "scholarshipUrl", "matchReasons"],
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">🎯 We Found A Perfect Match For You!</h1>
        </div>
        
        <div style="padding: 30px 20px; background: #f9fafb;">
          <p style="font-size: 16px; color: #374151;">Hi {{userName}},</p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="color: #10b981; margin-top: 0;">{{scholarshipName}}</h3>
            <div style="text-align: center; margin: 15px 0;">
              <div style="display: inline-block; background: #10b981; color: white; border-radius: 50%; width: 80px; height: 80px; line-height: 80px; text-align: center; font-size: 32px; font-weight: bold;">
                {{matchPercentage}}%
              </div>
            </div>
            <p style="text-align: center; color: #6b7280; margin: 10px 0;">Match Score</p>
            
            <div style="margin: 20px 0; padding: 15px; background: #f0fdf4; border-radius: 6px;">
              <p style="color: #15803d; margin: 0; font-size: 14px;"><strong>Why this match is perfect:</strong></p>
              <ul style="color: #15803d; font-size: 14px; margin: 10px 0 0 0; padding-left: 20px;">
                {{matchReasons}}
              </ul>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{scholarshipUrl}}" style="background: #10b981; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">
              View & Apply →
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px;">
            This scholarship matches your academic profile, interests, and background. 
            Don't miss this opportunity!
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #f3f4f6; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">© 2025 Ailes Global</p>
        </div>
      </div>
    `,
  },

  // Payment Receipt
  "payment-receipt": {
    name: "payment-receipt",
    type: EmailType.PAYMENT_RECEIPT,
    subject: "💳 Payment Received - Thank You {{userName}}!",
    variables: ["userName", "planName", "amount", "currency", "transactionId", "features"],
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">💳 Payment Received!</h1>
        </div>
        
        <div style="padding: 30px 20px; background: #f9fafb;">
          <p style="font-size: 16px; color: #374151;">Hi {{userName}},</p>
          
          <p style="font-size: 16px; color: #374151;">Thank you for your purchase! Your payment has been received and processed.</p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #667eea; margin-top: 0;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #6b7280;">Plan:</td>
                <td style="padding: 10px 0; font-weight: bold; color: #111827;">{{planName}}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280;">Amount:</td>
                <td style="padding: 10px 0; font-weight: bold; color: #667eea; font-size: 18px;">{{amount}} {{currency}}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280;">Transaction ID:</td>
                <td style="padding: 10px 0; font-family: monospace; color: #111827;">{{transactionId}}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #eff6ff; border-radius: 8px; padding: 15px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <p style="color: #1e40af; margin: 0 0 10px 0; font-weight: bold;">✅ You Now Have Access To:</p>
            <ul style="color: #1e40af; margin: 0; padding-left: 20px; font-size: 14px;">
              {{features}}
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #f3f4f6; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">© 2025 Ailes Global. Empowering African women through education.</p>
        </div>
      </div>
    `,
  },

  // Promotional Email (50% Off)
  "promotional-50-off": {
    name: "promotional-50-off",
    type: EmailType.PROMOTIONAL,
    subject: "🎉 Special Offer: 50% Off Your First Month!",
    variables: ["userName", "discount", "expiresAt", "ctaUrl"],
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Special Limited-Time Offer</h1>
        </div>
        
        <div style="padding: 30px 20px; background: #f9fafb;">
          <p style="font-size: 16px; color: #374151;">Hi {{userName}},</p>
          
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 2px solid #f59e0b; text-align: center;">
            <p style="color: #d97706; font-size: 14px; margin: 0 0 10px 0;">Limited Time Only</p>
            <h2 style="color: #d97706; margin: 0; font-size: 40px;">{{discount}}% OFF</h2>
            <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">Your First Month</p>
          </div>
          
          <p style="font-size: 16px; color: #374151; text-align: center; margin: 20px 0;">
            Unlock premium features to maximize your scholarship chances:
          </p>
          
          <ul style="color: #374151; line-height: 2; font-size: 15px; margin: 20px 0;">
            <li>✅ Unlimited scholarship matches</li>
            <li>✅ AI-powered application assistance</li>
            <li>✅ Deadline reminders & alerts</li>
            <li>✅ Dedicated expert support</li>
            <li>✅ Document templates & guides</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{ctaUrl}}" style="background: #f59e0b; color: white; padding: 14px 40px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
              Claim Your Discount →
            </a>
          </div>
          
          <p style="text-align: center; color: #ef4444; font-weight: bold; font-size: 14px;">
            Offer expires on {{expiresAt}} - Don't miss out!
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; background: #f3f4f6; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">© 2025 Ailes Global. Empowering African women through education.</p>
        </div>
      </div>
    `,
  },

  // Custom Email
  "custom": {
    name: "custom",
    type: EmailType.CUSTOM,
    subject: "{{subject}}",
    variables: ["content"],
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="padding: 30px 20px; background: #f9fafb;">
          {{content}}
        </div>
      </div>
    `,
  },
};

/**
 * Get template by name
 */
export function getEmailTemplate(templateName: string): EmailTemplateData | null {
  return emailTemplates[templateName] || null;
}

/**
 * Get all templates
 */
export function getAllEmailTemplates(): EmailTemplateData[] {
  return Object.values(emailTemplates);
}

/**
 * Replace variables in template
 */
export function replaceVariables(
  content: string,
  variables: Record<string, any>
): string {
  let result = content;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, "g"), String(value));
  }
  return result;
}

/**
 * Render template with variables
 */
export function renderTemplate(
  templateName: string,
  variables: Record<string, any>
): { subject: string; htmlContent: string } | null {
  const template = getEmailTemplate(templateName);
  if (!template) return null;

  return {
    subject: replaceVariables(template.subject, variables),
    htmlContent: replaceVariables(template.htmlContent, variables),
  };
}
