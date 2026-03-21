const express = require('express');
const {
    getTemplates,
    getTemplate,
    createTemplate,
    incrementUsage
} = require('../controllers/templateController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getTemplates);
router.get('/:id', getTemplate);
router.post('/', protect, createTemplate); // Admin only in production
router.put('/:id/use', protect, incrementUsage);

module.exports = router;