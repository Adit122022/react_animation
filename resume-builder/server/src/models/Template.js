const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    thumbnail: String,
    isPremium: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        enum: ['modern', 'classic', 'creative', 'minimal'],
        required: true
    },
    config: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    usageCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Template', templateSchema);