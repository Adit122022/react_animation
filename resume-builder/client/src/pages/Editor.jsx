import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getResume, updateResume } from '../store/slices/resume';
import { showToast } from '../store/slices/uiSlices';
import {
    Save, Download, Eye, EyeOff, ChevronLeft, Settings,
    Palette, Undo, Redo, Share2, MoreVertical, Check
} from 'lucide-react';
import PersonalInfo from '@components/resume/FormFields/PersonalInfo';
import Experience from '@components/resume/FormFields/Experience';
import Education from '@components/resume/FormFields/Education';
import Skills from '@components/resume/FormFields/Skills';
import Projects from '@components/resume/FormFields/Projects';
import TemplateSelector from '@components/resume/TemplateSelector';
import ModernTemplate from '@components/templates/ModernTemplate';
import ClassicTemplate from '@components/templates/ClassicTemplate';
import CreativeTemplate from '@components/templates/CreativeTemplate';
import Loader from '@components/common/Loader';

const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentResume, isLoading } = useSelector((state) => state.resume);

    const [activeSection, setActiveSection] = useState('personal');
    const [showPreview, setShowPreview] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [formData, setFormData] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(75);

    // Sections configuration
    const sections = [
        { id: 'personal', label: 'Personal Info', icon: '👤', color: 'bg-blue-500' },
        { id: 'experience', label: 'Experience', icon: '💼', color: 'bg-green-500' },
        { id: 'education', label: 'Education', icon: '🎓', color: 'bg-purple-500' },
        { id: 'skills', label: 'Skills', icon: '⚡', color: 'bg-yellow-500' },
        { id: 'projects', label: 'Projects', icon: '🚀', color: 'bg-red-500' },
        { id: 'template', label: 'Template', icon: '🎨', color: 'bg-pink-500' },
    ];

    // Template components mapping
    const templateComponents = {
        modern: ModernTemplate,
        classic: ClassicTemplate,
        creative: CreativeTemplate,
    };

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

    // Auto-save functionality with debounce
    useEffect(() => {
        if (!formData || !id) return;

        const timer = setTimeout(() => {
            handleAutoSave();
        }, 3000);

        return () => clearTimeout(timer);
    }, [formData]);

    // Handle auto-save
    const handleAutoSave = async () => {
        if (!formData || !id) return;

        setIsSaving(true);

        try {
            await dispatch(updateResume({ id, data: formData })).unwrap();
            setLastSaved(new Date());
        } catch (error) {
            console.error('Auto-save failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle manual save
    const handleSave = async () => {
        if (!formData || !id) return;

        setIsSaving(true);

        try {
            await dispatch(updateResume({ id, data: formData })).unwrap();
            setLastSaved(new Date());

            dispatch(showToast({
                message: 'Resume saved successfully!',
                type: 'success',
            }));
        } catch (error) {
            dispatch(showToast({
                message: 'Failed to save resume',
                type: 'error',
            }));
        } finally {
            setIsSaving(false);
        }
    };

    // Handle PDF download
    const handleDownload = async () => {
        try {
            dispatch(showToast({
                message: 'Generating PDF...',
                type: 'info',
            }));

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
            } else {
                throw new Error('Download failed');
            }
        } catch (error) {
            dispatch(showToast({
                message: 'Failed to download resume',
                type: 'error',
            }));
        }
    };

    // Update form data
    const updateFormData = useCallback((section, data) => {
        setFormData(prev => ({
            ...prev,
            [section]: data,
        }));
    }, []);

    // Format last saved time
    const formatLastSaved = () => {
        if (!lastSaved) return 'Not saved yet';

        const now = new Date();
        const diff = Math.floor((now - lastSaved) / 1000);

        if (diff < 60) return 'Saved just now';
        if (diff < 3600) return `Saved ${Math.floor(diff / 60)} min ago`;
        return `Saved at ${lastSaved.toLocaleTimeString()}`;
    };

    // Get active template component
    const TemplateComponent = templateComponents[formData?.template] || ModernTemplate;

    if (isLoading || !formData) {
        return <Loader fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Left Section */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="btn btn-secondary btn-sm"
                        >
                            <ChevronLeft size={18} />
                            <span className="hidden sm:inline">Back</span>
                        </button>

                        <div className="flex flex-col">
                            <input
                                type="text"
                                value={formData.title || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                className="text-lg font-semibold border-none focus:ring-0 p-0 bg-transparent"
                                placeholder="Untitled Resume"
                            />
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                {isSaving ? (
                                    <>
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>{formatLastSaved()}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                        {/* Preview Toggle (Mobile) */}
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="btn btn-secondary btn-sm lg:hidden"
                            title={showPreview ? 'Hide Preview' : 'Show Preview'}
                        >
                            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>

                        {/* Zoom Control */}
                        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                            <button
                                onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                -
                            </button>
                            <span className="text-sm font-medium w-12 text-center">{zoomLevel}%</span>
                            <button
                                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                +
                            </button>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn btn-outline btn-sm"
                        >
                            <Save size={18} />
                            <span className="hidden sm:inline">Save</span>
                        </button>

                        {/* Download Button */}
                        <button
                            onClick={handleDownload}
                            className="btn btn-primary btn-sm"
                        >
                            <Download size={18} />
                            <span className="hidden sm:inline">Download PDF</span>
                        </button>

                        {/* More Options */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="btn btn-secondary btn-sm"
                            >
                                <MoreVertical size={18} />
                            </button>

                            {showSettings && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50">
                                    <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left">
                                        <Share2 size={16} />
                                        Share Resume
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left">
                                        <Palette size={16} />
                                        Customize Colors
                                    </button>
                                    <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left">
                                        <Settings size={16} />
                                        Settings
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Sections */}
                <aside className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center transition-all ${activeSection === section.id
                                ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-600'
                                : 'hover:bg-gray-100 text-gray-600'
                                }`}
                            title={section.label}
                        >
                            <span className="text-xl">{section.icon}</span>
                            <span className="text-[10px] mt-1 font-medium truncate w-12 text-center">
                                {section.label.split(' ')[0]}
                            </span>
                        </button>
                    ))}
                </aside>

                {/* Editor Panel */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
                    <div className="max-w-3xl mx-auto">
                        {/* Section Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${sections.find(s => s.id === activeSection)?.color} flex items-center justify-center text-white text-xl`}>
                                    {sections.find(s => s.id === activeSection)?.icon}
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {sections.find(s => s.id === activeSection)?.label}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Fill in the details below
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Content */}
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
                                    onSelect={(template) => setFormData(prev => ({ ...prev, template }))}
                                />
                            )}
                        </div>

                        {/* Section Navigation */}
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => {
                                    const currentIndex = sections.findIndex(s => s.id === activeSection);
                                    if (currentIndex > 0) {
                                        setActiveSection(sections[currentIndex - 1].id);
                                    }
                                }}
                                disabled={activeSection === sections[0].id}
                                className="btn btn-outline disabled:opacity-50"
                            >
                                ← Previous
                            </button>

                            <button
                                onClick={() => {
                                    const currentIndex = sections.findIndex(s => s.id === activeSection);
                                    if (currentIndex < sections.length - 1) {
                                        setActiveSection(sections[currentIndex + 1].id);
                                    }
                                }}
                                disabled={activeSection === sections[sections.length - 1].id}
                                className="btn btn-primary disabled:opacity-50"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </main>

                {/* Preview Panel */}
                {showPreview && (
                    <aside className="hidden lg:block w-1/2 bg-gray-200 border-l border-gray-300 overflow-hidden">
                        <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-700">Live Preview</h3>
                            <span className="text-sm text-gray-500">
                                {formData.template?.charAt(0).toUpperCase() + formData.template?.slice(1)} Template
                            </span>
                        </div>

                        <div className="p-6 overflow-auto h-[calc(100vh-140px)]">
                            <div
                                className="bg-white shadow-xl mx-auto transition-transform origin-top"
                                style={{
                                    transform: `scale(${zoomLevel / 100})`,
                                    transformOrigin: 'top center'
                                }}
                            >
                                <TemplateComponent data={formData} />
                            </div>
                        </div>
                    </aside>
                )}
            </div>

            {/* Click outside to close settings */}
            {showSettings && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSettings(false)}
                ></div>
            )}
        </div>
    );
};

export default Editor;