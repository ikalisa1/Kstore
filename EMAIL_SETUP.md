# Email Configuration Guide for KstoreLtd

## Overview
The KstoreLtd application now includes email notification functionality. When a customer purchases a product, they will automatically receive a confirmation email with order details.

## Features
✅ Purchase confirmation emails sent to customers
✅ Low stock alert emails sent to admin
✅ Professional HTML email templates
✅ Product details and pricing in emails
✅ Order timestamps

## Setup Instructions

### 1. For Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate an App Password**:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Enter "KstoreLtd" as the name
   - Click "Generate"
   - Copy the 16-character password

3. **Update `.env` file** in the backend folder:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   ADMIN_EMAIL=admin@kstoreltd.com
   ```

### 2. For Other Email Providers

Update the `.env` file with your provider's settings:

**Outlook/Hotmail:**
```env
EMAIL_SERVICE=outlook
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
ADMIN_EMAIL=admin@kstoreltd.com
```

**Yahoo:**
```env
EMAIL_SERVICE=yahoo
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@kstoreltd.com
```

**Custom SMTP (Advanced):**
```env
EMAIL_SERVICE=
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-password
ADMIN_EMAIL=admin@kstoreltd.com
```

## How to Use

### Making a Purchase
1. Navigate to the **Products** page
2. Click the **"Purchase"** button on any product
3. Fill in the purchase form:
   - Customer Name (optional)
   - Customer Email (required)
   - Quantity
4. Click **"Complete Purchase & Send Email"**
5. The customer will receive an email confirmation

### Email Content
The email includes:
- Purchase confirmation message
- Product name and description
- Quantity purchased
- Unit price and total price
- Order date and time
- Professional KstoreLtd branding

### Low Stock Alerts
When a product's stock falls below the minimum level after a purchase, an automatic alert email is sent to the admin email address.

## Testing

To test the email functionality:

1. **Set up email credentials** (see setup instructions above)

2. **Restart the backend server**:
   ```bash
   cd backend
   npm start
   ```

3. **Make a test purchase**:
   - Use your own email address as the customer email
   - Select a product with sufficient stock
   - Complete the purchase
   - Check your inbox for the confirmation email

4. **Check the backend console** for email status:
   - Success: "Email sent: [message-id]"
   - Failure: "Email sending failed: [error]"

## Troubleshooting

### Email Not Sending

1. **Check credentials**:
   - Verify EMAIL_USER and EMAIL_PASS are correct
   - For Gmail, ensure you're using an App Password, not your regular password

2. **Check console logs**:
   - Look for error messages in the backend terminal
   - Common errors: "Invalid login", "Connection timeout"

3. **Firewall/Antivirus**:
   - Some security software blocks SMTP connections
   - Temporarily disable to test

4. **Test without purchase**:
   - You can test the email service directly in the backend console

### Gmail-Specific Issues

- **"Less secure app access"**: This is deprecated. Use App Passwords instead.
- **"Invalid credentials"**: Make sure 2FA is enabled and you're using an App Password.
- **"Daily limit exceeded"**: Gmail limits emails per day. Wait 24 hours or use a different account.

## API Endpoint

The purchase endpoint is available at:
```
POST /api/sales
```

Request body:
```json
{
  "productId": "product-id-here",
  "quantity": 1,
  "customerEmail": "customer@example.com",
  "customerName": "Customer Name"
}
```

Response:
```json
{
  "message": "Purchase completed successfully",
  "sale": {
    "productId": "...",
    "productName": "...",
    "quantity": 1,
    "totalPrice": 99.99,
    "customerEmail": "customer@example.com",
    "emailSent": true,
    "remainingStock": 45,
    "timestamp": "2025-01-13T..."
  }
}
```

## Security Notes

⚠️ **Important Security Considerations:**

1. Never commit the `.env` file to version control
2. Use App Passwords instead of regular passwords
3. Keep EMAIL_PASS secret and secure
4. Consider using environment-specific email accounts for development/production
5. Implement rate limiting in production to prevent email abuse

## Production Recommendations

For production environments:

1. **Use a dedicated email service**:
   - SendGrid
   - Amazon SES
   - Mailgun
   - Postmark

2. **Implement email queuing**:
   - Use a job queue (Bull, Bee-Queue)
   - Handle failures and retries
   - Track email delivery status

3. **Add email templates**:
   - Separate template files
   - Support for multiple languages
   - Customizable branding

4. **Monitor email delivery**:
   - Log all email attempts
   - Track bounce rates
   - Handle unsubscribes

## Support

If you encounter issues:
1. Check the backend console for error messages
2. Verify all environment variables are set correctly
3. Test with a simple email client first
4. Review the email service documentation

---

**KstoreLtd Email System** - Professional email notifications for your store management needs.
