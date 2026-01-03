import { Resend } from 'resend';

// Initialize Resend client
const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface ScholarshipAlert {
  to: string;
  userName: string;
  scholarships: Array<{
    name: string;
    provider: string;
    amount: number;
    currency: string;
    deadline: string;
    url: string;
  }>;
}

interface DeadlineReminder {
  to: string;
  userName: string;
  scholarshipName: string;
  deadline: string;
  daysLeft: number;
  url: string;
}

interface ApplicationStatusUpdate {
  to: string;
  userName: string;
  scholarshipName: string;
  status: string;
  message?: string;
}

/**
 * Send new scholarship matches to user
 */
export async function sendScholarshipAlert(data: ScholarshipAlert) {
  if (!resend) {
    console.warn('Resend not configured. Skipping email.');
    return { success: false, error: 'Email service not configured' };
  }

  const { to, userName, scholarships } = data;

  try {
    const result = await resend.emails.send({
      from: 'Ailes Global <scholarships@ailesglobal.com>', // Update with your verified domain
      to: [to],
      subject: `🎓 ${scholarships.length} New Scholarship${scholarships.length > 1 ? 's' : ''} Match Your Profile!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .scholarship-card { background: white; border-radius: 8px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #667eea; }
            .scholarship-title { font-size: 18px; font-weight: bold; color: #1f2937; margin-bottom: 8px; }
            .scholarship-provider { color: #6b7280; margin-bottom: 12px; }
            .scholarship-details { font-size: 14px; color: #4b5563; margin-bottom: 12px; }
            .deadline { color: #ef4444; font-weight: 600; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 New Scholarship Matches!</h1>
              <p>Hi ${userName}, we found scholarships perfect for you</p>
            </div>
            <div class="content">
              <p>Great news! We've found ${scholarships.length} scholarship${scholarships.length > 1 ? 's' : ''} that match your profile:</p>
              
              ${scholarships.map(sch => `
                <div class="scholarship-card">
                  <div class="scholarship-title">${sch.name}</div>
                  <div class="scholarship-provider">by ${sch.provider}</div>
                  <div class="scholarship-details">
                    💰 <strong>${sch.currency} $${sch.amount.toLocaleString()}</strong><br>
                    📅 Deadline: <span class="deadline">${new Date(sch.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <a href="${sch.url}" class="button">View Details & Apply</a>
                </div>
              `).join('')}
              
              <p style="margin-top: 30px;">Don't wait! Scholarship deadlines approach quickly. Click the links above to start your applications today.</p>
            </div>
            <div class="footer">
              <p>You're receiving this because you signed up for scholarship alerts at Ailes Global.</p>
              <p><a href="${process.env.NEXTAUTH_URL}/dashboard/settings">Manage your email preferences</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Scholarship alert sent:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Failed to send scholarship alert:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send deadline reminder
 */
export async function sendDeadlineReminder(data: DeadlineReminder) {
  if (!resend) {
    console.warn('Resend not configured. Skipping email.');
    return { success: false, error: 'Email service not configured' };
  }

  const { to, userName, scholarshipName, deadline, daysLeft, url } = data;

  const urgencyLevel = daysLeft <= 3 ? 'URGENT' : daysLeft <= 7 ? 'SOON' : 'REMINDER';
  const urgencyColor = daysLeft <= 3 ? '#dc2626' : daysLeft <= 7 ? '#f59e0b' : '#667eea';

  try {
    const result = await resend.emails.send({
      from: 'Ailes Global <scholarships@ailesglobal.com>',
      to: [to],
      subject: `⏰ ${urgencyLevel}: ${scholarshipName} deadline in ${daysLeft} day${daysLeft > 1 ? 's' : ''}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${urgencyColor}; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .alert-box { background: #fef2f2; border-left: 4px solid ${urgencyColor}; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .button { display: inline-block; background: ${urgencyColor}; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; }
            .countdown { font-size: 48px; font-weight: bold; color: ${urgencyColor}; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Deadline Approaching!</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              
              <div class="alert-box">
                <h2 style="margin-top: 0; color: ${urgencyColor};">${scholarshipName}</h2>
                <p><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              
              <div class="countdown">${daysLeft}</div>
              <p style="text-align: center; font-size: 18px; color: #6b7280;">day${daysLeft > 1 ? 's' : ''} remaining</p>
              
              ${daysLeft <= 3 ? `
                <p style="color: #dc2626; font-weight: bold;">⚠️ URGENT: This deadline is approaching fast! Don't miss this opportunity.</p>
              ` : ''}
              
              <p>Make sure you have:</p>
              <ul>
                <li>✅ Completed all required documents</li>
                <li>✅ Reviewed your application</li>
                <li>✅ Checked eligibility requirements</li>
                <li>✅ Prepared for submission</li>
              </ul>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${url}" class="button">Complete Application Now</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Deadline reminder sent:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Failed to send deadline reminder:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send application status update
 */
export async function sendApplicationStatusUpdate(data: ApplicationStatusUpdate) {
  if (!resend) {
    console.warn('Resend not configured. Skipping email.');
    return { success: false, error: 'Email service not configured' };
  }

  const { to, userName, scholarshipName, status, message } = data;

  const statusConfig: Record<string, { emoji: string; color: string; title: string }> = {
    SUBMITTED: { emoji: '📨', color: '#3b82f6', title: 'Application Submitted' },
    UNDER_REVIEW: { emoji: '👀', color: '#f59e0b', title: 'Under Review' },
    ACCEPTED: { emoji: '🎉', color: '#10b981', title: 'Congratulations!' },
    REJECTED: { emoji: '📋', color: '#6b7280', title: 'Application Update' },
  };

  const config = statusConfig[status] || statusConfig.SUBMITTED;

  try {
    const result = await resend.emails.send({
      from: 'Ailes Global <scholarships@ailesglobal.com>',
      to: [to],
      subject: `${config.emoji} ${config.title} - ${scholarshipName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${config.color}; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; }
            .status-badge { background: ${config.color}; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${config.emoji} ${config.title}</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              
              <p>We have an update about your application for <strong>${scholarshipName}</strong>:</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <span class="status-badge">${status.replace('_', ' ')}</span>
              </p>
              
              ${message ? `<p>${message}</p>` : ''}
              
              ${status === 'ACCEPTED' ? `
                <p style="background: #d1fae5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
                  🎊 <strong>Congratulations!</strong> Your hard work has paid off. Check your dashboard for next steps.
                </p>
              ` : ''}
              
              <p style="margin-top: 30px;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; background: ${config.color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                  View Dashboard
                </a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Status update sent:', result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('❌ Failed to send status update:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send weekly digest of new scholarships
 */
export async function sendWeeklyDigest(to: string, userName: string, scholarships: any[]) {
  if (!resend || scholarships.length === 0) {
    return { success: false };
  }

  try {
    const result = await resend.emails.send({
      from: 'Ailes Global <scholarships@ailesglobal.com>',
      to: [to],
      subject: `📬 Your Weekly Scholarship Digest - ${scholarships.length} New Opportunities`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; }
            .content { padding: 30px 0; }
            .scholarship-item { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 Your Weekly Digest</h1>
              <p>${scholarships.length} new scholarships this week</p>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Here are the latest scholarships added this week:</p>
              
              ${scholarships.slice(0, 10).map(sch => `
                <div class="scholarship-item">
                  <h3 style="margin: 0 0 8px 0;">${sch.name}</h3>
                  <p style="color: #6b7280; margin: 0 0 8px 0;">${sch.provider}</p>
                  <p style="margin: 0;">💰 ${sch.currency} $${sch.amount?.toLocaleString()} | 📅 Deadline: ${new Date(sch.deadline).toLocaleDateString()}</p>
                  <a href="${process.env.NEXTAUTH_URL}/scholarships/${sch.id}" style="color: #667eea;">View Details →</a>
                </div>
              `).join('')}
              
              ${scholarships.length > 10 ? `
                <p style="text-align: center;">
                  <a href="${process.env.NEXTAUTH_URL}/scholarships" style="color: #667eea;">View all ${scholarships.length} scholarships →</a>
                </p>
              ` : ''}
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return { success: true, data: result };
  } catch (error: any) {
    console.error('Failed to send weekly digest:', error);
    return { success: false, error: error.message };
  }
}
