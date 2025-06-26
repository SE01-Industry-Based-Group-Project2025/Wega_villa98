package com.example.wega_villa.service;

import com.example.wega_villa.model.Contact;
import com.example.wega_villa.model.User;
import com.example.wega_villa.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private UserRepository userRepository;
    
    @Value("${app.email.from:jayodya2002@gmail.com}")
    private String fromEmail;
    
    @Value("${app.email.admin:admin@wegavilla.com}")
    private String adminEmail;
    
    @Value("${app.email.enabled:true}")
    private boolean emailEnabled;
    
    // Send notification to admins and managers when a new contact is submitted
    public void sendContactNotification(Contact contact) {
        if (!emailEnabled) {
            System.out.println("Email notifications are disabled");
            return;
        }
        
        try {
            System.out.println("=== SENDING CONTACT NOTIFICATION EMAILS ===");
            
            // Get all admins and managers
            List<User> admins = userRepository.findByRoleName("ADMIN");
            List<User> managers = userRepository.findByRoleName("MANAGER");
            
            System.out.println("Found " + admins.size() + " admins and " + managers.size() + " managers");
            
            // Create email content
            String subject = "New Contact Form Submission - Wega Villa";
            String htmlContent = createContactNotificationHtml(contact);
            
            // Send to admins
            for (User admin : admins) {
                sendHtmlEmail(admin.getEmail(), subject, htmlContent);
                System.out.println("Notification sent to admin: " + admin.getEmail());
            }
            
            // Send to managers
            for (User manager : managers) {
                sendHtmlEmail(manager.getEmail(), subject, htmlContent);
                System.out.println("Notification sent to manager: " + manager.getEmail());
            }
            
            // Also send to configured admin email if different
            if (!adminEmail.equals("admin@wegavilla.com")) {
                sendHtmlEmail(adminEmail, subject, htmlContent);
                System.out.println("Notification sent to configured admin: " + adminEmail);
            }
            
            System.out.println("All contact notification emails sent successfully");
            
        } catch (Exception e) {
            System.out.println("Error sending contact notification emails: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // Send confirmation email to the person who submitted the contact form
    public void sendContactConfirmation(Contact contact) {
        if (!emailEnabled) {
            System.out.println("Email notifications are disabled");
            return;
        }
        
        try {
            System.out.println("=== SENDING CONTACT CONFIRMATION EMAIL ===");
            
            String subject = "Thank you for contacting Wega Villa";
            String htmlContent = createContactConfirmationHtml(contact);
            
            sendHtmlEmail(contact.getEmail(), subject, htmlContent);
            System.out.println("Confirmation email sent to: " + contact.getEmail());
            
        } catch (Exception e) {
            System.out.println("Error sending confirmation email: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // Send HTML email
    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        
        mailSender.send(message);
    }
    
    // Send simple text email
    public void sendSimpleEmail(String to, String subject, String text) {
        if (!emailEnabled) {
            System.out.println("Email notifications are disabled");
            return;
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            mailSender.send(message);
            System.out.println("Simple email sent to: " + to);
            
        } catch (Exception e) {
            System.out.println("Error sending simple email: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    // Create HTML content for contact notification email
    private String createContactNotificationHtml(Contact contact) {
        String formattedDate = contact.getCreatedAt().format(DateTimeFormatter.ofPattern("EEEE, MMMM dd, yyyy 'at' HH:mm"));
        
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 20px; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #555; }
                    .value { margin-left: 10px; }
                    .message-box { background-color: white; padding: 15px; border-left: 4px solid #007bff; margin-top: 15px; }
                    .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏨 New Contact Form Submission</h1>
                        <p>Wega Villa - Admin Notification</p>
                    </div>
                    <div class="content">
                        <h2>Contact Details:</h2>
                        <div class="field">
                            <span class="label">📝 Contact ID:</span>
                            <span class="value">#%d</span>
                        </div>
                        <div class="field">
                            <span class="label">👤 Name:</span>
                            <span class="value">%s %s</span>
                        </div>
                        <div class="field">
                            <span class="label">📧 Email:</span>
                            <span class="value">%s</span>
                        </div>
                        <div class="field">
                            <span class="label">📅 Submitted:</span>
                            <span class="value">%s</span>
                        </div>
                        <div class="message-box">
                            <div class="label">💬 Message:</div>
                            <div style="margin-top: 10px;">%s</div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is an automated notification from Wega Villa Contact Management System</p>
                        <p>Please respond to the customer's inquiry as soon as possible.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                contact.getId(),
                contact.getFirstName(),
                contact.getLastName(),
                contact.getEmail(),
                formattedDate,
                contact.getMessage().replace("\n", "<br>")
            );
    }
    
    // Create HTML content for contact confirmation email
    private String createContactConfirmationHtml(Contact contact) {
        String formattedDate = contact.getCreatedAt().format(DateTimeFormatter.ofPattern("EEEE, MMMM dd, yyyy 'at' HH:mm"));
        
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
                    .content { background-color: #f9f9f9; padding: 20px; }
                    .highlight { background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
                    .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏨 Thank You for Contacting Us!</h1>
                        <p>Wega Villa</p>
                    </div>
                    <div class="content">
                        <h2>Dear %s,</h2>
                        <p>Thank you for reaching out to Wega Villa! We have successfully received your message and our team will review it shortly.</p>
                        
                        <div class="highlight">
                            <h3>📋 Your Submission Details:</h3>
                            <p><strong>Reference ID:</strong> #%d</p>
                            <p><strong>Name:</strong> %s %s</p>
                            <p><strong>Email:</strong> %s</p>
                            <p><strong>Submitted:</strong> %s</p>
                        </div>
                        
                        <p>🕐 <strong>Response Time:</strong> We typically respond to inquiries within 24-48 hours during business days.</p>
                        <p>📞 <strong>Urgent Matters:</strong> If your inquiry is urgent, please feel free to call us directly.</p>
                        
                        <div class="highlight">
                            <h3>📩 Your Message:</h3>
                            <p>%s</p>
                        </div>
                        
                        <p>We appreciate your interest in Wega Villa and look forward to assisting you!</p>
                        
                        <p>Best regards,<br>
                        <strong>The Wega Villa Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>This is an automated confirmation email from Wega Villa</p>
                        <p>Please do not reply directly to this email</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                contact.getFirstName(),
                contact.getId(),
                contact.getFirstName(),
                contact.getLastName(),
                contact.getEmail(),
                formattedDate,
                contact.getMessage().replace("\n", "<br>")
            );
    }
    
    // Test email functionality
    public boolean testEmailConnection() {
        try {
            sendSimpleEmail(adminEmail, "Test Email - Wega Villa", 
                "This is a test email to verify the email configuration is working correctly.");
            return true;
        } catch (Exception e) {
            System.out.println("Email test failed: " + e.getMessage());
            return false;
        }
    }
}
