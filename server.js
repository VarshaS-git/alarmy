const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./db'); // PostgreSQL connection

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the Index Page (default)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the QR Alarm Page
app.get('/qr-alarm.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'qr-alarm.html'));
});

// Serve the alarm sound file
app.get('/iphone_alarm.mp3', (req, res) => {
    res.setHeader('Content-Type', 'audio/mpeg');
    res.sendFile(path.join(__dirname, 'public', 'iphone_alarm.mp3'));
});

// Store QR code in the qrcodes table
app.post('/store-qrcode', async (req, res) => {
    const { qrCode } = req.body;

    try {
        const qrCodeCheckQuery = 'SELECT * FROM qrcodes WHERE code = $1';
        const qrCodeCheckResult = await pool.query(qrCodeCheckQuery, [qrCode]);

        if (qrCodeCheckResult.rows.length === 0) {
            const insertQrCodeQuery = 'INSERT INTO qrcodes (code) VALUES ($1)';
            await pool.query(insertQrCodeQuery, [qrCode]);
            console.log('QR code inserted into qrcodes table');
            res.status(200).json({ message: 'QR code stored successfully!' });
        } else {
            console.log('QR code already exists in the qrcodes table');
            res.status(200).json({ message: 'QR code already exists!' });
        }
    } catch (err) {
        console.error('Error storing QR code:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Verify QR code to stop the alarm
app.post('/verify-qrcode', async (req, res) => {
    const { qrCode } = req.body;

    try {
        const qrCodeCheckQuery = 'SELECT * FROM qrcodes WHERE code = $1';
        const qrCodeCheckResult = await pool.query(qrCodeCheckQuery, [qrCode]);

        if (qrCodeCheckResult.rows.length > 0) {
            console.log('QR code verified successfully');
            res.status(200).json({ message: 'QR code verified successfully!' });
        } else {
            console.log('Invalid QR code');
            res.status(400).json({ message: 'Invalid QR code' });
        }
    } catch (err) {
        console.error('Error verifying QR code:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
