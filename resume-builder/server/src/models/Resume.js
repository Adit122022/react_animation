const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    startDate: { type: Date, required: true },
    endDate: Date,
    current: { type: Boolean, default: false },
    description: String,
    achievements: [String]
});

const educationSchema = new mongoose.Schema({
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    location: String,
    startDate: { type: Date, required: true },
    endDate: Date,
    gpa: String,
    achievements: [String]
});

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    technologies: [String],
    url: String,
    startDate: Date,
    endDate: Date
});

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        default: 'Untitled Resume'
    },
    template: {
        type: String,
        required: true,
        enum: ['modern', 'classic', 'creative', 'minimal'],
        default: 'modern'
    },
    personalInfo: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        location: String,
        linkedin: String,
        github: String,
        portfolio: String,
        summary: String
    },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: {
        technical: [String],
        soft: [String],
        languages: [String]
    },
    projects: [projectSchema],
    certifications: [{
        name: String,
        issuer: String,
        date: Date,
        url: String
    }],
    customSections: [{
        title: String,
        content: String
    }],
    theme: {
        primaryColor: { type: String, default: '#2563eb' },
        secondaryColor: { type: String, default: '#64748b' },
        fontFamily: { type: String, default: 'Inter' },
        fontSize: { type: String, default: 'medium' }
    },
    pdfUrl: String,
    isPublic: {
        type: Boolean,
        default: false
    },
    viewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
resumeSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);