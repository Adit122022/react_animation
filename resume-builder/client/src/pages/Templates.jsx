import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createResume } from '../store/slices/resume';
import { showToast } from '../store/slices/uiSlices';
import { useAuth } from '@hooks/useAuth';
import { Search, Filter, Eye, Crown, Check, Star, Users } from 'lucide-react';

const Templates = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, isPremium, user, canCreateResume } = useAuth();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [previewTemplate, setPreviewTemplate] = useState(null);

    const categories = [
        { id: 'all', label: 'All Templates', count: 12 },
        { id: 'modern', label: 'Modern', count: 4 },
        { id: 'classic', label: 'Classic', count: 3 },
        { id: 'creative', label: 'Creative', count: 3 },
        { id: 'minimal', label: 'Minimal', count: 2 },
    ];

    const templates = [
        {
            id: 'modern',
            name: 'Modern Professional',
            category: 'modern',
            description: 'Clean and contemporary design perfect for tech and corporate roles',
            thumbnail: '📄',
            isPremium: false,
            rating: 4.9,
            users: 12500,
            colors: ['#2563eb', '#7c3aed', '#0891b2'],
            features: ['ATS-Friendly', 'Clean Layout', 'Professional'],
        },
        {
            id: 'classic',
            name: 'Classic Elegant',
            category: 'classic',
            description: 'Traditional design that works for any industry',
            thumbnail: '📋',
            isPremium: false,
            rating: 4.8,
            users: 9800,
            colors: ['#1f2937', '#374151', '#6b7280'],
            features: ['ATS-Friendly', 'Traditional', 'Formal'],
        },
        {
            id: 'creative',
            name: 'Creative Bold',
            category: 'creative',
            description: 'Stand out with this colorful and unique design',
            thumbnail: '🎨',
            isPremium: true,
            rating: 4.7,
            users: 5600,
            colors: ['#7c3aed', '#ec4899', '#f97316'],
            features: ['Eye-catching', 'Colorful', 'Unique'],
        },
        {
            id: 'minimal',
            name: 'Minimal Clean',
            category: 'minimal',
            description: 'Simple and elegant with focus on content',
            thumbnail: '📝',
            isPremium: true,
            rating: 4.9,
            users: 7200,
            colors: ['#000000', '#ffffff', '#e5e7eb'],
            features: ['ATS-Friendly', 'Minimalist', 'Elegant'],
        },
        {
            id: 'executive',
            name: 'Executive Pro',
            category: 'modern',
            description: 'Perfect for senior positions and leadership roles',
            thumbnail: '👔',
            isPremium: true,
            rating: 4.8,
            users: 4300,
            colors: ['#0f172a', '#1e40af', '#3b82f6'],
            features: ['Professional', 'Executive', 'Premium'],
        },
        {
            id: 'developer',
            name: 'Developer Portfolio',
            category: 'creative',
            description: 'Showcase your technical skills with style',
            thumbnail: '💻',
            isPremium: true,
            rating: 4.9,
            users: 8900,
            colors: ['#10b981', '#06b6d4', '#8b5cf6'],
            features: ['Tech-focused', 'GitHub Ready', 'Skills Display'],
        },
        {
            id: 'academic',
            name: 'Academic CV',
            category: 'classic',
            description: 'Ideal for researchers, professors, and students',
            thumbnail: '🎓',
            isPremium: false,
            rating: 4.6,
            users: 3200,
            colors: ['#1e3a8a', '#1e40af', '#3b82f6'],
            features: ['Publications', 'Research', 'Academic'],
        },
        {
            id: 'startup',
            name: 'Startup Ready',
            category: 'modern',
            description: 'Dynamic design for startup enthusiasts',
            thumbnail: '🚀',
            isPremium: true,
            rating: 4.7,
            users: 6100,
            colors: ['#f97316', '#ea580c', '#dc2626'],
            features: ['Dynamic', 'Bold', 'Innovative'],
        },
    ];

    const filteredTemplates = templates.filter((template) => {
        const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleUseTemplate = async (templateId) => {
        if (!isAuthenticated) {
            navigate('/register');
            return;
        }

        const template = templates.find(t => t.id === templateId);

        if (template.isPremium && !isPremium) {
            dispatch(showToast({
                message: 'This template requires Premium subscription',
                type: 'warning',
            }));
            navigate('/pricing');
            return;
        }

        if (!canCreateResume) {
            dispatch(showToast({
                message: 'Free plan allows only 3 resumes. Upgrade to Premium!',
                type: 'warning',
            }));
            navigate('/pricing');
            return;
        }

        try {
            const newResume = await dispatch(createResume({
                title: `My ${template.name} Resume`,
                template: templateId,
                personalInfo: {
                    fullName: user?.name || '',
                    email: user?.email || '',
                },
            })).unwrap();

            dispatch(showToast({
                message: 'Resume created successfully!',
                type: 'success',
            }));

            navigate(`/editor/${newResume._id}`);
        } catch (error) {
            dispatch(showToast({
                message: error.message || 'Failed to create resume',
                type: 'error',
            }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Professional Resume Templates
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choose from our collection of ATS-optimized, professionally designed templates
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-10"
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeCategory === category.id
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {category.label}
                                <span className={`ml-2 text-xs ${activeCategory === category.id ? 'text-primary-100' : 'text-gray-500'
                                    }`}>
                                    ({category.count})
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTemplates.map((template) => (
                        <div
                            key={template.id}
                            className="card card-hover group relative overflow-hidden"
                        >
                            {/* Premium Badge */}
                            {template.isPremium && (
                                <div className="absolute top-4 right-4 z-10">
                                    <span className="badge badge-warning flex items-center gap-1">
                                        <Crown size={12} />
                                        PRO
                                    </span>
                                </div>
                            )}

                            {/* Thumbnail */}
                            <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center text-6xl relative overflow-hidden">
                                {template.thumbnail}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        onClick={() => setPreviewTemplate(template)}
                                        className="btn bg-white text-gray-900 btn-sm"
                                    >
                                        <Eye size={16} />
                                        Preview
                                    </button>
                                    <button
                                        onClick={() => handleUseTemplate(template.id)}
                                        className="btn btn-primary btn-sm"
                                    >
                                        <Check size={16} />
                                        Use
                                    </button>
                                </div>

                                {/* Color Palette */}
                                <div className="absolute bottom-2 left-2 flex gap-1">
                                    {template.colors.map((color, idx) => (
                                        <div
                                            key={idx}
                                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Info */}
                            <div>
                                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {template.description}
                                </p>

                                {/* Features */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {template.features.slice(0, 3).map((feature, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                {/* Stats */}
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <Star size={14} className="text-yellow-500" fill="currentColor" />
                                        {template.rating}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users size={14} />
                                        {(template.users / 1000).toFixed(1)}K users
                                    </span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => handleUseTemplate(template.id)}
                                className={`w-full btn mt-4 ${template.isPremium && !isPremium
                                    ? 'btn-outline'
                                    : 'btn-primary'
                                    }`}
                            >
                                {template.isPremium && !isPremium ? 'Upgrade to Use' : 'Use This Template'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredTemplates.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No templates found
                        </h3>
                        <p className="text-gray-600">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}

                {/* CTA */}
                {!isPremium && (
                    <div className="mt-16 card gradient-bg text-white text-center py-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Unlock All Premium Templates
                        </h2>
                        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                            Get access to exclusive templates, unlimited resumes, and more with Premium
                        </p>
                        <button
                            onClick={() => navigate('/pricing')}
                            className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg"
                        >
                            <Crown size={20} />
                            Upgrade to Premium
                        </button>
                    </div>
                )}
            </div>

            {/* Template Preview Modal */}
            {previewTemplate && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div>
                                <h3 className="text-xl font-bold">{previewTemplate.name}</h3>
                                <p className="text-sm text-gray-600">{previewTemplate.description}</p>
                            </div>
                            <button
                                onClick={() => setPreviewTemplate(null)}
                                className="btn btn-secondary btn-sm"
                            >
                                Close
                            </button>
                        </div>

                        <div className="p-6 overflow-auto max-h-[70vh] bg-gray-100">
                            <div className="bg-white shadow-xl mx-auto aspect-[210/297] max-w-lg flex items-center justify-center text-8xl">
                                {previewTemplate.thumbnail}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setPreviewTemplate(null)}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleUseTemplate(previewTemplate.id);
                                    setPreviewTemplate(null);
                                }}
                                className="btn btn-primary"
                            >
                                Use This Template
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Templates;