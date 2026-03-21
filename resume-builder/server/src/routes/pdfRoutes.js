const express = require('express');
const {
    generatePDF,
    downloadPDF
} = require('../controllers/pdfController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/generate/:resumeId', generatePDF);
router.get('/download/:resumeId', downloadPDF);

module.exports = router;