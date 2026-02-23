/**
 * Optivra - Google Apps Script for Form Submissions
 * Handles quote requests and callback requests via email
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Copy this entire code
 * 4. Deploy as Web App (Execute as: Me, Access: Anyone)
 * 5. Copy the deployment URL and use it in the form submission
 * 6. Update the email address below to your preferred email
 */

// Configuration
const CONFIG = {
  recipientEmail: 'hello@optivra.com', // Change this to your email
  sheetName: 'Form Submissions'
};

/**
 * Main POST handler for form submissions
 */
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Route to appropriate handler based on form type
    if (data.type === 'quote_request') {
      handleQuoteRequest(sheet, data);
    } else if (data.type === 'callback_request') {
      handleCallbackRequest(sheet, data);
    } else if (data.type === 'contact_form') {
      handleContactForm(sheet, data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Your request has been received successfully!'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'An error occurred. Please try again or contact us directly.'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Get or create the submissions sheet
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.sheetName);
    // Add headers
    sheet.appendRow([
      'Timestamp',
      'Type',
      'Name',
      'Email',
      'Phone',
      'Company',
      'Service Interest',
      'Project Budget',
      'Timeline',
      'Message',
      'Preferred Contact Time',
      'Status'
    ]);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, 12);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#0A2540');
    headerRange.setFontColor('#FFFFFF');
  }
  
  return sheet;
}

/**
 * Handle Quote Request submissions
 */
function handleQuoteRequest(sheet, data) {
  // Add to spreadsheet
  sheet.appendRow([
    new Date(),
    'Quote Request',
    data.name || '',
    data.email || '',
    data.phone || '',
    data.company || '',
    data.service || '',
    data.budget || '',
    data.timeline || '',
    data.message || '',
    '',
    'New'
  ]);
  
  // Send email notification
  const emailSubject = `🎯 New Quote Request - ${data.name} (${data.service})`;
  const emailBody = `
═══════════════════════════════════════════════════════
NEW QUOTE REQUEST - OPTIVRA
═══════════════════════════════════════════════════════

📋 CLIENT INFORMATION
───────────────────────────────────────────────────────
Name:           ${data.name}
Email:          ${data.email}
Phone:          ${data.phone || 'Not provided'}
Company:        ${data.company || 'Not provided'}

💼 PROJECT DETAILS
───────────────────────────────────────────────────────
Service:        ${data.service}
Budget Range:   ${data.budget}
Timeline:       ${data.timeline}

📝 MESSAGE
───────────────────────────────────────────────────────
${data.message || 'No additional message provided'}

⏰ SUBMISSION TIME
───────────────────────────────────────────────────────
${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

═══════════════════════════════════════════════════════
ACTION REQUIRED: Follow up within 2 hours
═══════════════════════════════════════════════════════

Best regards,
Optivra Automated System
  `;
  
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: emailSubject,
    body: emailBody
  });
  
  // Send confirmation email to client
  sendClientConfirmation(data.email, data.name, 'quote');
}

/**
 * Handle Callback Request submissions
 */
function handleCallbackRequest(sheet, data) {
  // Add to spreadsheet
  sheet.appendRow([
    new Date(),
    'Callback Request',
    data.name || '',
    data.email || '',
    data.phone || '',
    data.company || '',
    data.interest || 'General Inquiry',
    '',
    '',
    data.message || '',
    data.preferredTime || 'Anytime',
    'New'
  ]);
  
  // Send email notification
  const emailSubject = `📞 New Callback Request - ${data.name}`;
  const emailBody = `
═══════════════════════════════════════════════════════
NEW CALLBACK REQUEST - OPTIVRA
═══════════════════════════════════════════════════════

📋 CLIENT INFORMATION
───────────────────────────────────────────────────────
Name:           ${data.name}
Email:          ${data.email}
Phone:          ${data.phone}
Company:        ${data.company || 'Not provided'}

📞 CALLBACK DETAILS
───────────────────────────────────────────────────────
Interest Area:  ${data.interest || 'General Inquiry'}
Preferred Time: ${data.preferredTime || 'Anytime'}

📝 MESSAGE
───────────────────────────────────────────────────────
${data.message || 'No additional message provided'}

⏰ SUBMISSION TIME
───────────────────────────────────────────────────────
${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

═══════════════════════════════════════════════════════
ACTION REQUIRED: Call back within 1 hour
═══════════════════════════════════════════════════════

Best regards,
Optivra Automated System
  `;
  
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: emailSubject,
    body: emailBody
  });
  
  // Send confirmation email to client
  sendClientConfirmation(data.email, data.name, 'callback');
}

/**
 * Handle general Contact Form submissions
 */
function handleContactForm(sheet, data) {
  // Add to spreadsheet
  sheet.appendRow([
    new Date(),
    'Contact Form',
    data.name || '',
    data.email || '',
    data.phone || '',
    data.company || '',
    data.subject || 'General Inquiry',
    '',
    '',
    data.message || '',
    '',
    'New'
  ]);
  
  // Send email notification
  const emailSubject = `✉️ New Contact Form - ${data.name}`;
  const emailBody = `
═══════════════════════════════════════════════════════
NEW CONTACT FORM SUBMISSION - OPTIVRA
═══════════════════════════════════════════════════════

📋 CONTACT INFORMATION
───────────────────────────────────────────────────────
Name:           ${data.name}
Email:          ${data.email}
Phone:          ${data.phone || 'Not provided'}
Company:        ${data.company || 'Not provided'}
Subject:        ${data.subject || 'General Inquiry'}

📝 MESSAGE
───────────────────────────────────────────────────────
${data.message || 'No message provided'}

⏰ SUBMISSION TIME
───────────────────────────────────────────────────────
${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST

═══════════════════════════════════════════════════════
ACTION REQUIRED: Respond within 24 hours
═══════════════════════════════════════════════════════

Best regards,
Optivra Automated System
  `;
  
  MailApp.sendEmail({
    to: CONFIG.recipientEmail,
    subject: emailSubject,
    body: emailBody
  });
  
  // Send confirmation email to client
  sendClientConfirmation(data.email, data.name, 'contact');
}

/**
 * Send confirmation email to client
 */
function sendClientConfirmation(clientEmail, clientName, formType) {
  let subject = '';
  let body = '';
  
  if (formType === 'quote') {
    subject = 'Thank you for your quote request - Optivra';
    body = `
Dear ${clientName},

Thank you for requesting a quote from Optivra!

We have received your request and our team will review it carefully. One of our consultants will reach out to you within the next 2 hours to discuss your project requirements in detail.

In the meantime, feel free to explore our portfolio and case studies on our website.

If you have any urgent questions, please don't hesitate to contact us directly at:
📧 hello@optivra.com
📞 +91 74390-71619

Best regards,
The Optivra Team

---
Optivra - AI & Full-Stack Technology Consultancy
Bangalore, India
www.optivra.com
    `;
  } else if (formType === 'callback') {
    subject = 'We\'ll call you back soon - Optivra';
    body = `
Dear ${clientName},

Thank you for requesting a callback from Optivra!

We have received your request and one of our team members will call you back at your preferred time. We typically respond within 1 hour during business hours.

If you need immediate assistance, please feel free to contact us directly at:
📧 hello@optivra.com
📞 +91 74390-71619

Best regards,
The Optivra Team

---
Optivra - AI & Full-Stack Technology Consultancy
Bangalore, India
www.optivra.com
    `;
  } else {
    subject = 'Thank you for contacting Optivra';
    body = `
Dear ${clientName},

Thank you for reaching out to Optivra!

We have received your message and our team will get back to you within 24 hours. We appreciate your interest in our services.

If you have any urgent questions, please don't hesitate to contact us directly at:
📧 hello@optivra.com
📞 +91 74390-71619

Best regards,
The Optivra Team

---
Optivra - AI & Full-Stack Technology Consultancy
Bangalore, India
www.optivra.com
    `;
  }
  
  try {
    MailApp.sendEmail({
      to: clientEmail,
      subject: subject,
      body: body
    });
  } catch (error) {
    Logger.log('Error sending confirmation email: ' + error.toString());
  }
}

/**
 * Test function - Run this to test the script
 */
function testQuoteRequest() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        type: 'quote_request',
        name: 'Test User',
        email: 'test@example.com',
        phone: '+91 9876543210',
        company: 'Test Company',
        service: 'AI & Machine Learning',
        budget: '₹5-10 Lakhs',
        timeline: '2-3 months',
        message: 'This is a test quote request'
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}

function testCallbackRequest() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        type: 'callback_request',
        name: 'Test User',
        email: 'test@example.com',
        phone: '+91 9876543210',
        company: 'Test Company',
        interest: 'Full-Stack Development',
        preferredTime: 'Morning (9 AM - 12 PM)',
        message: 'This is a test callback request'
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}

// Made with Bob
