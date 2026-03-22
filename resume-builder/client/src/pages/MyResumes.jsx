import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getResumes, deleteResume, duplicateResume } from '../store/slices/resume';
import { showToast } from '../store/slices/uiSlices';
import { useAuth } from '../hooks/useAuth';
import {
    Plus, FileText, Calendar, Eye, Edit, Trash2, Copy,
    Download, MoreVertical, Search, Filter, Grid, List,
    SortAsc, SortDesc
} from 'lucide-react';
import Loader from '@components/common/Loader';

const MyResumes = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { canCreateResume } = useAuth();
    const { resumes, isLoading } = useSelector((state) => state.resume);

    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('updatedAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);

    useEffect(() => {
        dispatch(getResumes());
    }, [dispatch]);

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

    const handleDuplicate = async (id) => {
        try {
            await dispatch(duplicateResume(id)).unwrap();
            dispatch(showToast({
                message: 'Resume duplicated successfully',
                type: 'success',
            }));
            setActiveDropdown(null);
        } catch (error) {
            dispatch(showToast({
                message: error.message || 'Failed to duplicate resume',
                type: 'error',
            }));
        }
    };

    const handleDownload = async (id, title) => {
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
                a.download = `${title}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                dispatch(showToast({
                    message: 'Resume downloaded!',
                    type: 'success',
                }));
            }
        } catch (error) {
            dispatch(showToast({
                message: 'Failed to download',
                type: 'error',
            }));
        }
        setActiveDropdown(null);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Filter and sort resumes
    const filteredResumes = resumes
        .filter((resume) =>
            resume.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortOrder === 'asc') {
                return new Date(a[sortBy]) - new Date(b[sortBy]);
            }
            return new Date(b[sortBy]) - new Date(a[sortBy]);
        });

    if (isLoading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Resumes</h1>
                        <p className="text-gray-600">
                            {resumes.length} resume{resumes.length !== 1 ? 's' : ''} total
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/templates')}
                        disabled={!canCreateResume}
                        className="btn btn-primary btn-lg"
                    >
                        <Plus size={20} />
                        Create New Resume
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="card mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search resumes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input pl-10"
                            />
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="input py-2"
                            >
                                <option value="updatedAt">Last Modified</option>
                                <option value="createdAt">Date Created</option>
                                <option value="title">Name</option>
                            </select>

                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="btn btn-secondary"
                            >
                                {sortOrder === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
                            </button>
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Resumes */}
                {filteredResumes.length === 0 ? (
                    <div className="card text-center py-16">
                        <div className="text-6xl mb-4">📄</div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {searchQuery ? 'No resumes found' : 'No resumes yet'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchQuery
                                ? 'Try a different search term'
                                : 'Create your first professional resume'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => navigate('/templates')}
                                className="btn btn-primary"
                            >
                                <Plus size={20} />
                                Create Resume
                            </button>
                        )}
                    </div>
                ) : viewMode === 'grid' ? (
                    // Grid View
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResumes.map((resume) => (
                            <div
                                key={resume._id}
                                className="card card-hover group relative"
                            >
                                {/* Thumbnail */}
                                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center text-6xl">
                                        📄
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => navigate(`/editor/${resume._id}`)}
                                            className="btn bg-white text-gray-900 btn-sm"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDownload(resume._id, resume.title)}
                                            className="btn bg-white text-gray-900 btn-sm"
                                        >
                                            <Download size={16} />
                                        </button>
                                    </div>

                                    {/* Template Badge */}
                                    <span className="absolute top-2 left-2 badge badge-primary text-xs capitalize">
                                        {resume.template}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 truncate">{resume.title}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {formatDate(resume.updatedAt)}
                                        </p>
                                    </div>

                                    {/* More Options */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === resume._id ? null : resume._id)}
                                            className="p-1 rounded hover:bg-gray-100"
                                        >
                                            <MoreVertical size={18} className="text-gray-500" />
                                        </button>

                                        {activeDropdown === resume._id && (
                                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-10">
                                                <button
                                                    onClick={() => {
                                                        navigate(`/editor/${resume._id}`);
                                                        setActiveDropdown(null);
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                                                >
                                                    <Edit size={16} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDuplicate(resume._id)}
                                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                                                >
                                                    <Copy size={16} />
                                                    Duplicate
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(resume._id, resume.title)}
                                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                                                >
                                                    <Download size={16} />
                                                    Download PDF
                                                </button>
                                                <hr className="my-2" />
                                                <button
                                                    onClick={() => {
                                                        setShowDeleteConfirm(resume._id);
                                                        setActiveDropdown(null);
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Views */}
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Eye size={14} />
                                    {resume.viewCount || 0} views
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // List View
                    <div className="card overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Resume
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Template
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Last Modified
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Views
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredResumes.map((resume) => (
                                    <tr key={resume._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                                    📄
                                                </div>
                                                <span className="font-medium text-gray-900">{resume.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="badge badge-primary capitalize">{resume.template}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {formatDate(resume.updatedAt)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {resume.viewCount || 0}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/editor/${resume._id}`)}
                                                    className="btn btn-outline btn-sm"
                                                >
                                                    <Edit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDownload(resume._id, resume.title)}
                                                    className="btn btn-outline btn-sm"
                                                >
                                                    <Download size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(resume._id)}
                                                    className="btn btn-outline text-red-600 hover:bg-red-50 btn-sm"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Resume?</h3>
                            <p className="text-gray-600 mb-6">
                                This action cannot be undone. The resume will be permanently deleted.
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
            </div>

            {/* Click outside to close dropdown */}
            {activeDropdown && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setActiveDropdown(null)}
                ></div>
            )}
        </div>
    );
};

export default MyResumes;