// server.js
const express = require('express');
const multer  = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// ----------------------
// MySQL connection
// ----------------------
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // your DB username
  password: 'MY2025sql**',       // your DB password
  database: 'job_portal'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});


// Middleware
// ----------------------

// Serve static files
app.use(express.static(__dirname));

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Automatically create uploads folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });
const cpUpload = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'eduCertificate', maxCount: 1 },
  { name: 'expLetter', maxCount: 1 }
]);

// ----------------------
// Routes
// ----------------------

// GET / -> serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// POST /submit -> handle form
app.post('/submit', cpUpload, (req, res) => {
  const files = req.files;
  const body = req.body;

  const resumePath = files.resume ? files.resume[0].path : null;
  const eduPath = files.eduCertificate ? files.eduCertificate[0].path : null;
  const expPath = files.expLetter ? files.expLetter[0].path : null;

  const sql = `INSERT INTO applications 
    (fullname, email, phone, cgpa, entryYear, gradYear, university, workExperience, gender, birthdate, coverLetter, resume_path, eduCertificate_path, expLetter_path) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    body.fullname,
    body.email,
    body.phone,
    body.cgpa,
    body.entryYear,
    body.gradYear,
    body.university,
    body.workExperience,
    body.gender,
    body.birthdate,
    body.coverLetter,
    resumePath,
    eduPath,
    expPath
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.send('Application submitted successfully!');
  });
});

// ----------------------
// Start server
// ----------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
