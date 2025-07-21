# 📧 Email Notification Feature - Wega Villa

## Overview
The Wega Villa backend now includes automatic email notifications for contact form submissions. When someone submits a contact form, the system will:

1. **Send notifications to Admins and Managers** - All users with ADMIN or MANAGER roles receive email notifications
2. **Send confirmation to the contact submitter** - The person who submitted the form receives a confirmation email
3. **Store contact details in database** - All submissions are saved for admin review

## 🔧 Email Configuration Setup

### Step 1: Configure Email Settings
Copy the `.env.example` file to `.env` and update with your email credentials:

```bash
# Gmail Configuration (Recommended)

```

### Step 2: Gmail Setup (Recommended)
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Use the App Password** (16 characters) in the `EMAIL_PASSWORD` field

### Step 3: Alternative Email Providers
Update `application.properties` for other providers:

**Outlook/Hotmail:**
```properties
spring.mail.host=smtp.outlook.com
spring.mail.port=587
```

**Yahoo Mail:**
```properties
spring.mail.host=smtp.mail.yahoo.com
spring.mail.port=587
```

## 📱 Available API Endpoints

### Contact Form Endpoints
- `POST /api/contact/submit` - Submit contact form (sends emails automatically)
- `GET /api/contact/all` - Get all contacts
- `GET /api/contact/{id}` - Get specific contact
- `DELETE /api/contact/{id}` - Delete contact

### Admin Email Management
- `GET /api/admin/contacts` - View all contacts
- `GET /api/admin/contacts/stats` - Get contact statistics
- `POST /api/admin/test-email` - Send test email
- `GET /api/admin/email-settings` - View email recipients
- `POST /api/admin/contacts/{id}/notify` - Resend notification for specific contact
- `DELETE /api/admin/contacts/{id}` - Delete contact

## 🌐 Web Interfaces

### For Testing Contact Form:
Visit: `http://localhost:8080/contact.html`

### For Admin Email Management:
Visit: `http://localhost:8080/admin-email.html`

## 📧 Email Templates

### Notification Email (to Admins/Managers)
- **Subject:** "New Contact Form Submission - Wega Villa"
- **Contains:** Contact details, message, submission time, reference ID
- **Recipients:** All users with ADMIN or MANAGER roles

### Confirmation Email (to Contact Submitter)
- **Subject:** "Thank you for contacting Wega Villa"
- **Contains:** Confirmation message, reference ID, response timeframe
- **Recipient:** The email address from the contact form

## 🔍 Testing Email Functionality

### Test Email Configuration:
```bash
curl -X POST http://localhost:8080/api/admin/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Submit Test Contact:
```bash
curl -X POST http://localhost:8080/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john@example.com",
    "message": "Test message"
  }'
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Email not sending:**
   - Check email credentials in `application.properties`
   - Verify Gmail App Password (not regular password)
   - Check firewall/antivirus blocking SMTP

2. **Recipients not receiving emails:**
   - Verify users have ADMIN or MANAGER roles
   - Check spam/junk folders
   - Test with `POST /api/admin/test-email`

3. **Gmail authentication failed:**
   - Enable 2-Factor Authentication
   - Generate new App Password
   - Use 16-character App Password (not regular password)

### Enable Debug Logging:
Add to `application.properties`:
```properties
logging.level.org.springframework.mail=DEBUG
spring.mail.debug=true
```

## 📊 Features Included

- ✅ Automatic email notifications to admins/managers
- ✅ Confirmation emails to contact submitters  
- ✅ HTML email templates with professional formatting
- ✅ Contact form with validation
- ✅ Admin panel for email management
- ✅ Email testing functionality
- ✅ Contact statistics and management
- ✅ Resend notification capability
- ✅ Contact deletion (admin only)
- ✅ No edit functionality (as requested)

## 🚀 Quick Start

1. **Configure email settings** in `application.properties`
2. **Start the application:** `./mvnw spring-boot:run`
3. **Test contact form:** Visit `http://localhost:8080/contact.html`
4. **Admin management:** Visit `http://localhost:8080/admin-email.html`
5. **Check email notifications** in your configured admin/manager emails

The system will automatically handle all email notifications when contact forms are submitted!
