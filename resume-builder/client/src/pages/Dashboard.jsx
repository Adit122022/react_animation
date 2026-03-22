import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getResumes, createResume, deleteResume, duplicateResume } from '../store/slices/resume';
import { useAuth } from '@hooks/useAuth';
import { showToast } from '../store/slices/uiSlices';
import {
    Plus, FileText, Calendar, Eye, Edit, Trash2, Copy,
    Download, Crown, TrendingUp, Clock, CheckCircle
} from 'lucide-react';
import Loader from '@components/common/Loader';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isPremium, canCreateResume } = useAuth();
    const { resumes, isLoading } = useSelector((state) => state.resume);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    useEffect(() => {
        dispatch(getResumes());
    }, [dispatch]);

    const handleCreateResume = async () => {
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
                title: 'Untitled Resume',
                template: 'modern',
                personalInfo: {
                    fullName: user.name,
                    email: user.email,
                },
            })).unwrap();

            navigate(`/editor/${newResume._id}`);
        } catch (error) {
            dispatch(showToast({
                message: 'Failed to create resume',
                type: 'error',
            }));
        }
    };

    const handleDuplicate = async (id) => {
        try {
            await dispatch(duplicateResume(id)).unwrap();
            dispatch(showToast({
                message: 'Resume duplicated successfully',
                type: 'success',
            }));
        } catch (error) {
            dispatch(showToast({
                message: error.message || 'Failed to duplicate resume',
                type: 'error',
            }));
        }
    };

    const handleDelete = async (id) => {
        try {
            await dispatch(deleteResume(id)).unwrap();
            dispatch(showToast({
                message: 'Resume deleted successfully',
                type: 'success',
            }));
            setShowDeleteConfirm(null);
        } catch (error) {
            dispatch(showToast({
                message: 'Failed to delete resume',
                type: 'error',
            }));
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (isLoading && !resumes.length) {
        return <Loader fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Welcome back, {user?.name}! 👋
                            </h1>
                            <p className="text-gray-600">
                                Manage your resumes and track your job applications
                            </p>
                        </div>

                        <button
                            onClick={handleCreateResume}
                            className="btn btn-primary btn-lg flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Create New Resume
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Total Resumes</span>
                            <FileText className="text-primary-600" size={24} />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{resumes.length}</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {isPremium ? 'Unlimited' : `${1 - resumes.length} remaining`}
                        </p>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Plan</span>
                            <Crown className={isPremium ? 'text-yellow-500' : 'text-gray-400'} size={24} />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                            {isPremium ? 'Premium' : 'Free'}
                        </p>
                        {!isPremium && (
                            <button
                                onClick={() => navigate('/pricing')}
                                className="text-sm text-primary-600 hover:underline mt-1"
                            >
                                Upgrade Now →
                            </button>
                        )}
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Total Views</span>
                            <Eye className="text-green-600" size={24} />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                            {resumes.reduce((sum, r) => sum + (r.viewCount || 0), 0)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Across all resumes</p>
                    </div>

                    <div className="card">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Success Rate</span>
                            <TrendingUp className="text-purple-600" size={24} />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">92%</p>
                        <p className="text-sm text-gray-500 mt-1">Users get interviews</p>
                    </div>
                </div>

                {/* Resumes Grid */}
                {resumes.length === 0 ? (
                    <div className="card text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                            <FileText size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No resumes yet
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Create your first professional resume in minutes. Choose from our ATS-optimized templates.
                        </p>
                        <button
                            onClick={handleCreateResume}
                            className="btn btn-primary btn-lg"
                        >
                            <Plus size={20} />
                            Create Your First Resume
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Your Resumes ({resumes.length})
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resumes.map((resume) => (
                                <div
                                    key={resume._id}
                                    className="card card-hover group"
                                >
                                    {/* Resume Preview */}
                                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-6xl">
                                            📄
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => navigate(`/editor/${resume._id}`)}
                                                className="btn bg-white text-gray-900 btn-sm"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => window.open(`/preview/${resume._id}`, '_blank')}
                                                className="btn bg-white text-gray-900 btn-sm"
                                                title="Preview"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </div>

                                        {/* Premium Badge */}
                                        {resume.template !== 'modern' && resume.template !== 'classic' && (
                                            <span className="absolute top-2 right-2 badge badge-warning">
                                                PRO
                                            </span>
                                        )}
                                    </div>

                                    {/* Resume Info */}
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
                                            {resume.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {formatDate(resume.updatedAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye size={14} />
                                                {resume.viewCount || 0}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Template Badge */}
                                    <div className="mb-4">
                                        <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs font-medium capitalize">
                                            {resume.template} Template
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/editor/${resume._id}`)}
                                            className="btn btn-primary flex-1 btn-sm"
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDuplicate(resume._id)}
                                            className="btn btn-outline btn-sm"
                                            title="Duplicate"
                                        >
                                            <Copy size={16} />
                                        </button>

                                        <button
                                            onClick={() => setShowDeleteConfirm(resume._id)}
                                            className="btn btn-outline text-red-600 hover:bg-red-50 btn-sm"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Create New Card */}
                            {canCreateResume && (
                                <button
                                    onClick={handleCreateResume}
                                    className="card border-2 border-dashed border-gray-300 hover:border-primary-600 hover:bg-primary-50 transition-all cursor-pointer aspect-[3/4] flex flex-col items-center justify-center text-gray-600 hover:text-primary-600"
                                >
                                    <Plus size={48} className="mb-4" />
                                    <p className="font-semibold">Create New Resume</p>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Delete Resume?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this resume? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="btn btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(showDeleteConfirm)}
                                    className="btn btn-danger flex-1"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upgrade CTA */}
                {!isPremium && (
                    <div className="card gradient-bg text-white mt-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">
                                    Unlock Premium Features
                                </h3>
                                <p className="opacity-90">
                                    Create unlimited resumes, access premium templates, and get priority support
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/pricing')}
                                className="btn bg-white text-primary-600 hover:bg-gray-100 whitespace-nowrap"
                            >
                                <Crown size={20} />
                                Upgrade to Premium
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;