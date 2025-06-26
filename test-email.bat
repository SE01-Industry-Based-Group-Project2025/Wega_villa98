@echo off
echo Testing Wega Villa Email Configuration
echo =====================================
echo.
echo Your email configuration:
echo - Email: jayodya2002@gmail.com
echo - Admin notifications will be sent to: admin@wegavilla.com
echo - Sender: jayodya2002@gmail.com
echo.
echo Testing email endpoints...
echo.

echo 1. Testing email configuration...
curl -X POST "http://localhost:8080/api/admin/test-email" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"jayodya2002@gmail.com\"}"
echo.
echo.

echo 2. Testing contact form submission (this will send emails)...
curl -X POST "http://localhost:8080/api/contact/submit" ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\": \"Test\", \"lastName\": \"User\", \"email\": \"jayodya2002@gmail.com\", \"message\": \"This is a test message to verify email notifications are working.\"}"
echo.
echo.

echo 3. Getting email settings...
curl -X GET "http://localhost:8080/api/admin/email-settings"
echo.
echo.

echo Test completed! Check your email (jayodya2002@gmail.com) for:
echo - Test email notification
echo - Contact form notification (to admins/managers)
echo - Contact form confirmation (to the submitter)
echo.
pause
