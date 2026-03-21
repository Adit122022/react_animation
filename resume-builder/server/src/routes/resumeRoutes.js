const express = require('express');
const {
    getResumes,
    getResume,
    createResume,
    updateResume,
    deleteResume,
    duplicateResume
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');
const { validateResume } = require('../middleware/validation');

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/')
    .get(getResumes)
    .post(validateResume, createResume);

router.route('/:id')
    .get(getResume)
    .put(updateResume)
    .delete(deleteResume);

router.post('/:id/duplicate', duplicateResume);

module.exports = router;