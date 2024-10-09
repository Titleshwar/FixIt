const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan'); // For logging

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
}));

// Handle preflight requests
app.options('*', cors());

// Use body-parser middleware
app.use(bodyParser.json());

// Use morgan for logging
app.use(morgan('dev'));

// Endpoint to save email
app.post('/save-email', (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  const filePath = path.join(__dirname, 'emails.txt');
  fs.appendFile(filePath, ${email}\n, (err) => {
    if (err) {
      console.error('Error saving email:', err);
      return res.status(500).json({ message: 'Error saving email' });
    }
    console.log(Email saved: ${email});
    res.status(200).json({ message: 'Email successfully saved!' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(Local server running at http://localhost:${PORT});
});