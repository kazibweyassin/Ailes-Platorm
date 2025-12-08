// Email utility functions
// TODO: Replace with actual email service (SendGrid, Resend, etc.)

export async function sendSponsorConfirmationEmail(data: {
  name: string;
  email: string;
  tierName: string;
  amount: number;
  type: string;
}) {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Thank You for Sponsoring!</h1>
      </div>
      
      <div style="padding: 30px; background: #f9fafb;">
        <p style="font-size: 16px; color: #374151;">Dear ${data.name},</p>
        
        <p style="font-size: 16px; color: #374151;">
          Thank you for your generous sponsorship! Your support will directly impact a talented 
          African woman's education journey.
        </p>
        
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 2px solid #667eea;">
          <h2 style="color: #667eea; margin-top: 0;">Your Sponsorship Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #6b7280;">Tier:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #111827;">${data.tierName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b7280;">Amount:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #667eea; font-size: 18px;">$${data.amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #6b7280;">Type:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #111827;">${data.type}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">Payment Instructions</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 5px 0; color: #1e40af; font-weight: 600;">Bank Name:</td>
              <td style="padding: 5px 0; color: #1e3a8a;">Equity Bank Kenya</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #1e40af; font-weight: 600;">Account Number:</td>
              <td style="padding: 5px 0; color: #1e3a8a; font-family: monospace;">1001103192251</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #1e40af; font-weight: 600;">SWIFT Code:</td>
              <td style="padding: 5px 0; color: #1e3a8a; font-family: monospace;">EQBLKENA</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #1e40af; font-weight: 600;">Reference:</td>
              <td style="padding: 5px 0; color: #1e3a8a; font-weight: bold;">${data.email}</td>
            </tr>
          </table>
          <p style="color: #1e40af; margin: 10px 0 0 0; font-size: 14px;">
            ⚠️ Please use your email address as the payment reference
          </p>
        </div>
        
        <div style="margin: 30px 0;">
          <h3 style="color: #374151;">What Happens Next?</h3>
          <ol style="color: #6b7280; line-height: 1.8;">
            <li>Make payment to the bank account above</li>
            <li>We'll verify your payment within 24 hours</li>
            <li>We'll match you with a scholar based on your preferences</li>
            <li>You'll receive the scholar's profile and introduction</li>
            <li>Start your journey of making a real impact!</li>
          </ol>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Questions? Reply to this email or contact us at support@ailesglobal.com
        </p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px;">
            © 2025 Ailes Global. Empowering African women through education.
          </p>
        </div>
      </div>
    </div>
  `;

  // For now, just log the email (replace with actual email service)
  console.log('=== SPONSOR CONFIRMATION EMAIL ===');
  console.log('To:', data.email);
  console.log('Subject: Thank You for Your Sponsorship!');
  console.log('Content:', emailContent);
  console.log('===================================');

  // TODO: Replace with actual email service
  // Example with Resend:
  // await resend.emails.send({
  //   from: 'AILES Global <noreply@ailesglobal.com>',
  //   to: data.email,
  //   subject: 'Thank You for Your Sponsorship!',
  //   html: emailContent,
  // });

  return true;
}

export async function sendAdminNotification(data: {
  sponsorName: string;
  sponsorEmail: string;
  tierName: string;
  amount: number;
  type: string;
}) {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #667eea;">New Sponsorship Application</h2>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Sponsor Details</h3>
        <p><strong>Name:</strong> ${data.sponsorName}</p>
        <p><strong>Email:</strong> ${data.sponsorEmail}</p>
        <p><strong>Type:</strong> ${data.type}</p>
        <p><strong>Tier:</strong> ${data.tierName}</p>
        <p><strong>Amount:</strong> $${data.amount.toLocaleString()}</p>
      </div>
      
      <p>Log in to the admin panel to review and process this sponsorship.</p>
      
      <a href="http://localhost:3000/admin/sponsors" 
         style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 6px; margin: 20px 0;">
        View in Admin Panel
      </a>
    </div>
  `;

  console.log('=== ADMIN NOTIFICATION EMAIL ===');
  console.log('To: admin@ailesglobal.com');
  console.log('Subject: New Sponsorship Application');
  console.log('Content:', emailContent);
  console.log('================================');

  return true;
}
