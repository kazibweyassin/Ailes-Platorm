import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Send copilot documents via email with ZIP attachment
 */
export async function sendCopilotDocumentsEmail(data: {
  email: string;
  name: string;
  zipBuffer: Buffer;
  zipFileName: string;
  copilotRequestId: string;
}) {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🎓 Your Scholarship Applications Are Ready!</h1>
      </div>
      
      <div style="padding: 30px; background: white;">
        <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
          Hi ${data.name},
        </p>
        
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          Great news! Your Scholarship Copilot has generated your personalized application package. 
          Everything you need to apply to multiple scholarships is included in the attached ZIP file.
        </p>
        
        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 8px;">
          <h2 style="color: #1e40af; margin-top: 0; font-size: 20px;">📦 What's Included:</h2>
          <ul style="color: #1e3a8a; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li><strong>Motivation Letter</strong> - Personalized and ready to use</li>
            <li><strong>Personal Statement</strong> - Tailored to your profile</li>
            <li><strong>Form Mappings</strong> - Automated form field mappings</li>
            <li><strong>Form Preview</strong> - Pre-filled application data</li>
            <li><strong>Profile Summary</strong> - Complete profile overview</li>
          </ul>
        </div>
        
        <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; margin: 25px 0; border-radius: 8px;">
          <h3 style="color: #166534; margin-top: 0; font-size: 18px;">✅ Next Steps:</h3>
          <ol style="color: #166534; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Download and extract the ZIP file</li>
            <li>Review all documents and customize as needed</li>
            <li>Use the form mappings to pre-fill applications</li>
            <li>Submit your applications before deadlines</li>
          </ol>
        </div>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 8px;">
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            <strong>💡 Tip:</strong> Always review and personalize documents before submitting. 
            Each scholarship may have specific requirements.
          </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://ailesglobal.com'}/copilot/review" 
             style="display: inline-block; background: #667eea; color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            View in Dashboard →
          </a>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
            <strong>Need Help?</strong>
          </p>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Reply to this email or contact us at 
            <a href="mailto:support@ailesglobal.com" style="color: #667eea;">support@ailesglobal.com</a>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Ailes Global. Empowering African students through education.
          </p>
        </div>
      </div>
    </div>
  `;

  // If Resend is configured, send actual email
  if (resend) {
    try {
      const result = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'AILES Global <noreply@ailesglobal.com>',
        to: data.email,
        subject: '🎓 Your Scholarship Application Package is Ready!',
        html: emailContent,
        attachments: [
          {
            filename: data.zipFileName,
            content: data.zipBuffer,
          },
        ],
      });
      
      console.log('✅ Copilot documents email sent successfully:', result);
      return { success: true, messageId: result.data?.id || 'sent' };
    } catch (error: any) {
      console.error('❌ Error sending copilot email:', error);
      // Fall through to console log
    }
  }

  // Fallback: Log email details (for development/testing)
  console.log('=== COPILOT DOCUMENTS EMAIL ===');
  console.log('To:', data.email);
  console.log('Subject: 🎓 Your Scholarship Application Package is Ready!');
  console.log('ZIP File:', data.zipFileName, `(${(data.zipBuffer.length / 1024).toFixed(2)} KB)`);
  console.log('Content:', emailContent.substring(0, 200) + '...');
  console.log('================================');
  console.log('⚠️  Email service not configured. Set RESEND_API_KEY to send actual emails.');

  return { success: true, messageId: 'logged-only' };
}

/**
 * Send copilot processing notification
 */
export async function sendCopilotProcessingEmail(data: {
  email: string;
  name: string;
  copilotRequestId: string;
}) {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">⏳ Processing Your Request</h1>
      </div>
      
      <div style="padding: 30px; background: #f9fafb;">
        <p style="font-size: 16px; color: #374151;">
          Hi ${data.name},
        </p>
        
        <p style="font-size: 16px; color: #374151; line-height: 1.6;">
          We've received your Scholarship Copilot request and are processing it now. 
          Our AI is generating your personalized application documents.
        </p>
        
        <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border: 2px solid #667eea;">
          <h2 style="color: #667eea; margin-top: 0;">What We're Creating:</h2>
          <ul style="color: #374151; line-height: 1.8;">
            <li>25+ personalized motivation letters</li>
            <li>Pre-filled application forms</li>
            <li>Complete application package</li>
          </ul>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          You'll receive an email with your complete package within 24 hours.
        </p>
      </div>
    </div>
  `;

  if (resend) {
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'AILES Global <noreply@ailesglobal.com>',
        to: data.email,
        subject: '⏳ Processing Your Scholarship Copilot Request',
        html: emailContent,
      });
      return { success: true };
    } catch (error) {
      console.error('Error sending processing email:', error);
    }
  }

  console.log('=== COPILOT PROCESSING EMAIL ===');
  console.log('To:', data.email);
  console.log('================================');
  
  return { success: true };
}

