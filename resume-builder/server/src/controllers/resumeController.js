const Resume = require("../models/Resume");
const User = require("../models/User");

// @desc    Get all resumes for logged in user
// @route   GET /api/resumes
// @access  Private
exports.getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({
      updatedAt: -1,
    });

    res.json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
exports.getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Make sure user is resume owner
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this resume",
      });
    }

    // Increment view count
    resume.viewCount += 1;
    await resume.save();

    res.json({
      success: true,
      resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new resume
// @route   POST /api/resumes
// @access  Private
exports.createResume = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(user);
    // Check if user can create resume
    if (!user.canCreateResume()) {
      return res.status(403).json({
        success: false,
        message:
          "Free plan allows only 3 resumes. Upgrade to Premium for unlimited resumes.",
        upgradeRequired: true,
      });
    }

    // Add user to req.body
    req.body.user = req.user.id;

    const resume = await Resume.create(req.body);

    // Update user's resume count and add resume reference
    user.resumeCount += 1;
    user.resumes.push(resume._id);
    await user.save();

    res.status(201).json({
      success: true,
      resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
// @access  Private
exports.updateResume = async (req, res, next) => {
  try {
    let resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Make sure user is resume owner
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this resume",
      });
    }

    resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Make sure user is resume owner
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this resume",
      });
    }

    await resume.deleteOne();

    // Update user's resume count
    const user = await User.findById(req.user.id);
    user.resumeCount = Math.max(0, user.resumeCount - 1);
    user.resumes = user.resumes.filter((r) => r.toString() !== req.params.id);
    await user.save();

    res.json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
// @access  Private
exports.duplicateResume = async (req, res, next) => {
  try {
    const originalResume = await Resume.findById(req.params.id);

    if (!originalResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Make sure user is resume owner
    if (originalResume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to duplicate this resume",
      });
    }

    const user = await User.findById(req.user.id);

    // Check if user can create resume
    if (!user.canCreateResume()) {
      return res.status(403).json({
        success: false,
        message: "Upgrade to Premium to create more resumes",
        upgradeRequired: true,
      });
    }

    // Create duplicate
    const resumeData = originalResume.toObject();
    delete resumeData._id;
    delete resumeData.createdAt;
    delete resumeData.updatedAt;
    resumeData.title = `${resumeData.title} (Copy)`;
    resumeData.pdfUrl = null;
    resumeData.viewCount = 0;

    const newResume = await Resume.create(resumeData);

    // Update user
    user.resumeCount += 1;
    user.resumes.push(newResume._id);
    await user.save();

    res.status(201).json({
      success: true,
      resume: newResume,
    });
  } catch (error) {
    next(error);
  }
};
