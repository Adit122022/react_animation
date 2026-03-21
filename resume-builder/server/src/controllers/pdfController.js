const Resume = require('../models/Resume');
const { generatePDF } = require('../services/pdfService');
const { uploadToCloudinary } = require('../services/storageService');

// @desc    Generate PDF from resume
// @route   POST /api/pdf/generate/:resumeId
// @access  Private
exports.generatePDF = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.resumeId);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Check ownership
        if (resume.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Generate PDF
        const pdfBuffer = await generatePDF(resume);

        // Upload to Cloudinary (or store locally)
        const pdfUrl = await uploadToCloudinary(
            pdfBuffer,
            `resumes/${req.user.id}/${resume._id}.pdf`
        );

        // Update resume with PDF URL
        resume.pdfUrl = pdfUrl;
        await resume.save();

        res.json({
            success: true,
            pdfUrl,
            message: 'PDF generated successfully'
        });
    } catch (error) {
        console.error('PDF generation error:', error);
        next(error);
    }
};

// @desc    Download PDF
// @route   GET /api/pdf/download/:resumeId
// @access  Private
exports.downloadPDF = async (req, res, next) => {
    try {
        const resume = await Resume.findById(req.params.resumeId);

        if (!resume) {
            return res.status(404).json({
                success: false,
                message: 'Resume not found'
            });
        }

        // Check ownership
        if (resume.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Generate PDF on-the-fly
        const pdfBuffer = await generatePDF(resume);

        // Set headers for download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${resume.title}.pdf"`
        );

        res.send(pdfBuffer);
    } catch (error) {
        next(error);
    }
};