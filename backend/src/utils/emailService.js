const nodemailer = require('nodemailer');

// Email configuration
const createTransporter = async () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  console.log('🔍 Email config check:');
  console.log('   EMAIL_USER:', emailUser ? `${emailUser}` : 'NOT SET');
  console.log('   EMAIL_PASS:', emailPass ? `${emailPass.substring(0, 10)}...` : 'NOT SET');

  // If a real Gmail address is configured (not placeholder), MUST use Gmail
  if (emailUser && emailUser !== 'your-email@gmail.com') {
    console.log('✅ Real Gmail configured, using Gmail SMTP...');
    
    // Check if password is also real (not placeholder)
    if (!emailPass || emailPass === 'your-app-password') {
      console.error('❌ CRITICAL: Gmail email set (' + emailUser + ') but APP PASSWORD not configured!');
      console.error('❌ Please add your Gmail App Password to .env EMAIL_PASS field');
      throw new Error('Gmail email configured but app password not set. Add to .env: EMAIL_PASS=your-16-char-app-password');
    }
    
    try {
      console.log('🔐 Creating Gmail transporter...');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });
      
      // Test connection
      console.log('🧪 Testing Gmail connection...');
      await transporter.verify();
      console.log('✅ Gmail connection successful!');
      return transporter;
    } catch (error) {
      console.error('❌ Gmail SMTP connection failed:');
      console.error('   Error:', error.message);
      console.error('   This usually means:');
      console.error('   - Invalid Gmail app password (get it from myaccount.google.com/apppasswords)');
      console.error('   - Email/password mismatch');
      console.error('   - Gmail security settings blocking access');
      throw error;
    }
  }

  // If in production without real credentials, fail
  if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️ Email credentials not configured for production.');
    return null;
  }

  // For development with no credentials: use Ethereal test account
  try {
    console.log('📧 No real credentials - using Ethereal test email for development');
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch (error) {
    console.warn('Could not create test email account:', error.message);
    return null;
  }
};

// Send product purchase notification email
const sendPurchaseNotification = async (customerEmail, productDetails) => {
  try {
    console.log('📧 Attempting to send purchase notification to:', customerEmail);
    const transporter = await createTransporter();
    
    // If email is not configured, skip sending but log it
    if (!transporter) {
      console.log('📧 Email notifications are disabled. Skipping purchase notification.');
      return { success: false, error: 'Email service not configured', skipped: true };
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@kstoreltd.com',
      to: customerEmail,
      subject: 'Product Purchase Confirmation - KstoreLtd',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 8px;">
            <h1 style="color: #7c3aed; margin-bottom: 10px;">Thank You for Your Purchase!</h1>
            <p style="color: #666; font-size: 16px;">Dear ${productDetails.customerName || 'Valued Customer'},</p>
            <p style="color: #666; font-size: 16px;">Your order has been successfully processed.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; margin-top: 0;">Order Details:</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Product Name:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${productDetails.name}</td>
                </tr>
                ${productDetails.description ? `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Description:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${productDetails.description}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Quantity:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${productDetails.quantity || 1}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Unit Price:</strong></td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">$${productDetails.price}</td>
                </tr>
                <tr style="background: #7c3aed;">
                  <td style="padding: 10px; color: white;"><strong>Total:</strong></td>
                  <td style="padding: 10px; color: white;"><strong>$${(productDetails.price * (productDetails.quantity || 1)).toFixed(2)}</strong></td>
                </tr>
              </table>
            </div>
            
            <p style="color: #666; font-size: 16px;">Order Date: ${new Date().toLocaleString()}</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 14px; margin: 5px 0;">Thank you for shopping with KstoreLtd!</p>
              <p style="color: #999; font-size: 12px; margin: 5px 0;">If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </div>
      `
    };

    console.log('📧 Sending email from:', mailOptions.from);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully: ', info.messageId);
    
    // Log preview URL for Ethereal test emails in development
    if (process.env.NODE_ENV === 'development' || process.env.EMAIL_USER === 'your-email@gmail.com') {
      try {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
          console.log('📧 Preview URL:', previewUrl);
        }
      } catch (e) {
        // Not an Ethereal email, that's fine
      }
    }
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('❌ Full error:', error);
    return { success: false, error: error.message };
  }
};

// Send low stock alert email to admin
const sendLowStockAlert = async (adminEmail, productDetails) => {
  try {
    const transporter = await createTransporter();
    
    // If email is not configured, skip sending but log it
    if (!transporter) {
      console.log('📧 Email notifications are disabled. Skipping low stock alert.');
      return { success: true, skipped: true, message: 'Email disabled' };
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@kstoreltd.com',
      to: adminEmail || process.env.ADMIN_EMAIL || 'admin@kstoreltd.com',
      subject: '⚠️ Low Stock Alert - KstoreLtd',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #f97316;">⚠️ Low Stock Alert</h1>
          <p>The following product is running low on stock:</p>
          
          <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #f97316; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">${productDetails.name}</h3>
            <p><strong>Current Stock:</strong> ${productDetails.quantity} units</p>
            <p><strong>Minimum Stock Level:</strong> ${productDetails.minStock} units</p>
            <p style="color: #d32f2f;"><strong>Action Required:</strong> Please reorder this product soon.</p>
          </div>
          
          <p style="color: #666; font-size: 14px;">Alert sent: ${new Date().toLocaleString()}</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Low stock alert sent:', info.messageId);
    // Log preview URL for Ethereal test emails in development
    if (process.env.NODE_ENV === 'development' || process.env.EMAIL_USER === 'your-email@gmail.com') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('📧 Preview URL:', previewUrl);
      }
    }
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Low stock alert failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPurchaseNotification,
  sendLowStockAlert
};
