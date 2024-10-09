const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Define the CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',  // Allow requests from any origin
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' }),
    };
  }

  // Handle the actual POST request
  if (event.httpMethod === 'POST') {
    const { email } = JSON.parse(event.body);

    // Validate the email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic regex for email validation
    if (!email || !emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Invalid email format' }),
      };
    }

    try {
      // Define the file path for storing emails
      const filePath = path.join(__dirname, 'emails.txt');

      // Read existing emails to check for duplicates
      const existingEmails = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8').split('\n') : [];

      // Check if the email already exists
      if (existingEmails.includes(email)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Email already subscribed' }),
        };
      }

      // Save the email to the local file
      fs.appendFileSync(filePath, `${email}\n`); // Synchronously append the email to the file

      console.log(`Email subscribed: ${email}`);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Successfully subscribed!' }),
      };
    } catch (error) {
      console.error('Error saving email:', error.message);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ message: 'Internal Server Error' }),
      };
    }
  }

  // If the method is not allowed
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ message: 'Method Not Allowed' }),
  };
};
