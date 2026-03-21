const Template = require('../models/Template');

// @desc    Get all templates
// @route   GET /api/templates
// @access  Public
exports.getTemplates = async (req, res, next) => {
    try {
        const { category, premium } = req.query;

        let query = { isActive: true };

        if (category) {
            query.category = category;
        }

        if (premium !== undefined) {
            query.isPremium = premium === 'true';
        }

        const templates = await Template.find(query).sort({ usageCount: -1 });

        res.json({
            success: true,
            count: templates.length,
            templates
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single template
// @route   GET /api/templates/:id
// @access  Public
exports.getTemplate = async (req, res, next) => {
    try {
        const template = await Template.findById(req.params.id);

        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template not found'
            });
        }

        res.json({
            success: true,
            template
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create template (Admin only)
// @route   POST /api/templates
// @access  Private/Admin
exports.createTemplate = async (req, res, next) => {
    try {
        const template = await Template.create(req.body);

        res.status(201).json({
            success: true,
            template
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update template usage count
// @route   PUT /api/templates/:id/use
// @access  Private
exports.incrementUsage = async (req, res, next) => {
    try {
        const template = await Template.findById(req.params.id);

        if (!template) {
            return res.status(404).json({
                success: false,
                message: 'Template not found'
            });
        }

        template.usageCount += 1;
        await template.save();

        res.json({
            success: true,
            message: 'Template usage updated'
        });
    } catch (error) {
        next(error);
    }
};