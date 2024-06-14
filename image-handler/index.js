const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5001;

const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 6
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, uuidv4() + path.extname(file.originalname));
        }
    })
});

app.post('/image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        res.json({ imageId: req.file.filename });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/image/:id', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'uploads', req.params.id);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.status(200).sendFile(filePath);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.delete('/image/:id', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'uploads', req.params.id);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Image not found' });
        }

        fs.unlinkSync(filePath);
        res.status(200).json({ message: 'Image deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(PORT, () => {
    console.log(`Image server is running on port ${PORT}`);
});