import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getResume, updateResume } from '@redux/slices/resumeSlice';
import { showToast } from '@redux/slices/uiSlice';
import { Save, Download, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import PersonalInfo from './FormFields/PersonalInfo';
import Experience from './FormFields/Experience';
import Education from './FormFields/Education';
import Skills from './FormFields/Skills';
import Projects from './FormFields/Projects';
import ResumePreview from './ResumePreview';
import TemplateSelector from './TemplateSelector';
import Loader from '@components/common/Loader';

const ResumeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentResume, isLoading } = useSelector((state) => state.resume);
  
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(null);

  // Fetch resume on mount
  useEffect(() => {
    if (id) {
      dispatch(getResume(id));
    }
  }, [id, dispatch]);

  // Set form data when resume loads
  useEffect(() => {
    if (currentResume) {
      setFormData(currentResume);
    }
  }, [currentResume]);

  // Auto-save functionality
  useEffect(() => {
    if (!formData || !id) return;

    const timer = setTimeout(() => {
      handleSave(true);
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(timer);
  }, [formData]);

  const handleSave = async (isAutoSave = false) => {
    if (!formData || !id) return;

    setIsSaving(true);
    
    try {
      await dispatch(updateResume({ id, data: formData })).unwrap();
      
      if (!isAutoSave) {
        dispatch(showToast({
          message: 'Resume saved successfully!',
          type: 'success',
        }));
      }
    } catch (error) {
      dispatch(showToast({
        message: 'Failed to save resume',
        type: 'error',
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/pdf/download/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData?.title || 'resume'}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        dispatch(showToast({
          message: 'Resume downloaded successfully!',
          type: 'success',
        }));
      }
    } catch (error) {
      dispatch(showToast({
        message: 'Failed to download resume',
        type: 'error',
      }));
    }
  };

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'template', label: 'Template', icon: '🎨' },
  ];

  if (isLoading || !formData) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary btn-sm"
              >
                <ChevronLeft size={18} />
                Back
              </button>
              
              <div>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  className="text-xl font-semibold border-none focus:ring-0 px-0"
                  placeholder="Untitled Resume"
                />
                <p className="text-sm text-gray-500">
                  {isSaving ? 'Saving...' : 'All changes saved'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="btn btn-secondary btn-sm md:hidden"
              >
                {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

              <button
                onClick={() => handleSave(false)}
                className="btn btn-outline btn-sm"
                disabled={isSaving}
              >
                <Save size={18} />
                Save
              </button>

              <button
                onClick={handleDownload}
                className="btn btn-primary btn-sm"
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="space-y-6">
            {/* Section Navigation */}
            <div className="card">
              <div className="flex flex-wrap gap-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === section.id
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Sections */}
            <div className="card">
              {activeSection === 'personal' && (
                <PersonalInfo
                  data={formData.personalInfo || {}}
                  onChange={(data) => updateFormData('personalInfo', data)}
                />
              )}

              {activeSection === 'experience' && (
                <Experience
                  data={formData.experience || []}
                  onChange={(data) => updateFormData('experience', data)}
                />
              )}

              {activeSection === 'education' && (
                <Education
                  data={formData.education || []}
                  onChange={(data) => updateFormData('education', data)}
                />
              )}

              {activeSection === 'skills' && (
                <Skills
                  data={formData.skills || {}}
                  onChange={(data) => updateFormData('skills', data)}
                />
              )}

              {activeSection === 'projects' && (
                <Projects
                  data={formData.projects || []}
                  onChange={(data) => updateFormData('projects', data)}
                />
              )}

              {activeSection === 'template' && (
                <TemplateSelector
                  selectedTemplate={formData.template}
                  onSelect={(template) => updateFormData('template', template)}
                />
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className={`${showPreview ? 'block' : 'hidden'} lg:block sticky top-24 h-fit`}>
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden shadow-inner">
                <ResumePreview resume={formData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;