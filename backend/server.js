/**
 * @file server.js
 * @description Mock API Backend Server for the Automated Skin Disease Detection System.
 * Connects the React client to the TensorFlow ML inference script.
 * @author Vaibhav Bhardwaj
 * @license MIT
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// Middleware Configuration
// ==========================================
app.use(cors({ origin: '*' }));
app.use(express.json());

// Ensure the local uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ==========================================
// Multer File Storage Engine
// ==========================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Unique names using Timestamp + original filename
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// ==========================================
// Authentication Routes (Demo Only)
// ==========================================

/**
 * @route   POST /api/login
 * @desc    Simulate developer/patient login authentication
 * @access  Public
 */
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        res.status(200).json({ 
            success: true, 
            user: { name: 'Demo User', email }, 
            token: 'dummy_token_123' 
        });
    } else {
        res.status(400).json({ error: 'Email and password are required' });
    }
});

/**
 * @route   POST /api/signup
 * @desc    Simulate account registration
 * @access  Public
 */
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (name && email && password) {
        res.status(201).json({ 
            success: true, 
            user: { name, email }, 
            token: 'dummy_token_123' 
        });
    } else {
        res.status(400).json({ error: 'Name, email, and password are required' });
    }
});

// ==========================================
// Deep Learning Analysis Core Route
// ==========================================

/**
 * @route   POST /api/analyze-skin
 * @desc    Upload skin lesion image and spawn ML script for classification
 * @access  Public (Token required in production)
 */
app.post('/api/analyze-skin', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    const imagePath = req.file.path;
    const predictScript = path.join(__dirname, 'predict.py');

    console.log(`[API] Spawn process: python3 ${predictScript} ${imagePath}`);
    const pythonProcess = spawn('python3', [predictScript, imagePath]);

    let outputData = '';
    let errorData = '';

    // Collect process standard output
    pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
    });

    // Collect process errors
    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        // Safe asynchronous removal of temp file
        fs.unlink(imagePath, (err) => {
            if (err) console.error(`[API ERROR] Temp file cleanup failed: ${err.message}`);
        });

        if (code !== 0) {
            console.error(`[AI ENGINE ERROR] Process exited with code ${code}: ${errorData}`);
            return res.status(500).json({ error: 'Failed to analyze image' });
        }

        try {
            const result = JSON.parse(outputData.trim());
            res.status(200).json(result);
        } catch (parseError) {
            console.error(`[API ERROR] Output parsing failure: ${parseError.message}`);
            res.status(500).json({ error: 'Invalid response from analysis engine' });
        }
    });
});

// ==========================================
// Extended Demo Features
// ==========================================

/**
 * @route   POST /api/upload-dataset
 * @desc    Simulate custom dataset uploading for personalization
 * @access  Public
 */
app.post('/api/upload-dataset', upload.array('files'), (req, res) => {
    setTimeout(() => {
        res.status(200).json({ 
            message: 'Dataset uploaded successfully (Demo Mode). This will enhance personalized AI analysis in future.' 
        });
    }, 1500);
});

/**
 * @route   GET /api/doctors
 * @desc    Retrieve mock localized specialists list
 * @access  Public
 */
app.get('/api/doctors', (req, res) => {
    res.status(200).json([
        { id: 1, name: 'Dr. Sharma', city: 'Dehradun', rating: 4.5 },
        { id: 2, name: 'Dr. Mehta', city: 'Delhi', rating: 4.2 },
        { id: 3, name: 'Dr. Kaur', city: 'Chandigarh', rating: 4.7 }
    ]);
});

/**
 * @route   POST /api/book-appointment
 * @desc    Simulate appointment booking with a specialist
 * @access  Public
 */
app.post('/api/book-appointment', (req, res) => {
    res.status(201).json({ message: 'Appointment booked successfully (Demo Mode)' });
});

/**
 * @route   GET /api/progress
 * @desc    Retrieve scanning progression logs over time
 * @access  Public
 */
app.get('/api/progress', (req, res) => {
    res.status(200).json([
        { id: 1, date: '10 Feb 2026', disease: 'Acne', severity: 'High' },
        { id: 2, date: '20 Feb 2026', disease: 'Acne', severity: 'Medium' }
    ]);
});

// ==========================================
// Start Server Listener
// ==========================================
app.listen(PORT, () => {
    console.log(`\n==========================================`);
    console.log(`  Mock Backend Server running on port ${PORT}`);
    console.log(`  Access Base URL: http://localhost:${PORT}`);
    console.log(`==========================================\n`);
});
