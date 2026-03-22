import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { FileText, Zap, Shield, Download, Star, Users } from 'lucide-react';

const Home = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const features = [
        {
            icon: <Zap className="text-yellow-500" size={32} />,
            title: 'Lightning Fast',
            description: 'Create professional resumes in minutes, not hours',
        },
        {
            icon: <FileText className="text-blue-500" size={32} />,
            title: 'ATS-Friendly',
            description: 'All templates are optimized to pass Applicant Tracking Systems',
        },
        {
            icon: <Shield className="text-green-500" size={32} />,
            title: 'Secure & Private',
            description: 'Your data is encrypted and never shared with third parties',
        },
        {
            icon: <Download className="text-purple-500" size={32} />,
            title: 'PDF Download',
            description: 'Export your resume as a high-quality PDF instantly',
        },
    ];

    const templates = [
        { name: 'Modern', image: '📄', users: '10K+' },
        { name: 'Classic', image: '📋', users: '8K+' },
        { name: 'Creative', image: '🎨', users: '5K+' },
        { name: 'Minimal', image: '📝', users: '7K+' },
    ];

    const stats = [
        { number: '50K+', label: 'Resumes Created' },
        { number: '20K+', label: 'Happy Users' },
        { number: '95%', label: 'Success Rate' },
        { number: '4.8/5', label: 'User Rating' },
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="gradient-bg text-white py-20">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                            Build Your Dream Resume in Minutes
                        </h1>
                        <p className="text-xl mb-8 opacity-90 animate-slide-up">
                            Professional, ATS-friendly resume templates trusted by thousands of job seekers
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                            {isAuthenticated ? (
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg shadow-lg"
                                >
                                    Go to Dashboard
                                </button>
                            ) : (
                                <>
                                    <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg shadow-lg">
                                        Create Free Resume
                                    </Link>
                                    <Link to="/templates" className="btn btn-outline border-white text-white hover:bg-white/10 btn-lg">
                                        Browse Templates
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl font-bold mb-1">{stat.number}</div>
                                    <div className="text-sm opacity-80">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section bg-white">
                <div className="container-custom">
                    <h2 className="section-title">Why Choose ResumeForge?</h2>
                    <p className="section-subtitle">
                        Everything you need to create a standout resume
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card card-hover text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Templates Preview */}
            <section className="section bg-gray-50">
                <div className="container-custom">
                    <h2 className="section-title">Professional Templates</h2>
                    <p className="section-subtitle">
                        Choose from our collection of beautiful, ATS-optimized templates
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {templates.map((template, index) => (
                            <div
                                key={index}
                                className="card card-hover cursor-pointer group"
                            >
                                <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                                    {template.image}
                                </div>
                                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <Users size={16} />
                                        {template.users} users
                                    </span>
                                    <span className="flex items-center gap-1 text-yellow-600">
                                        <Star size={16} fill="currentColor" />
                                        4.8
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link to="/templates" className="btn btn-primary btn-lg">
                            View All Templates
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="section bg-white">
                <div className="container-custom">
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-subtitle">
                        Three simple steps to your perfect resume
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '1',
                                title: 'Choose Template',
                                description: 'Select from our collection of professional templates',
                            },
                            {
                                step: '2',
                                title: 'Fill Details',
                                description: 'Add your information using our intuitive editor',
                            },
                            {
                                step: '3',
                                title: 'Download PDF',
                                description: 'Get your polished resume ready to send',
                            },
                        ].map((item, index) => (
                            <div key={index} className="text-center relative">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>

                                {index < 2 && (
                                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gray-300"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section bg-gray-50">
                <div className="container-custom">
                    <h2 className="section-title">What Our Users Say</h2>
                    <p className="section-subtitle">
                        Join thousands of satisfied job seekers
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                name: 'Priya Sharma',
                                role: 'Software Engineer',
                                avatar: '👩‍💻',
                                text: 'Got my dream job at Google! The ATS-friendly templates really work.',
                                rating: 5,
                            },
                            {
                                name: 'Rahul Verma',
                                role: 'Marketing Manager',
                                avatar: '👨‍💼',
                                text: 'Super easy to use. Created my resume in 10 minutes and it looks amazing!',
                                rating: 5,
                            },
                            {
                                name: 'Anjali Patel',
                                role: 'Data Analyst',
                                avatar: '👩‍🔬',
                                text: 'The explanations and tips helped me highlight my best achievements.',
                                rating: 5,
                            },
                        ].map((testimonial, index) => (
                            <div key={index} className="card">
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} size={16} fill="#fbbf24" className="text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{testimonial.avatar}</div>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section gradient-bg text-white">
                <div className="container-custom text-center">
                    <h2 className="text-4xl font-bold mb-4">
                        Ready to Land Your Dream Job?
                    </h2>
                    <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                        Join 20,000+ job seekers who have created winning resumes with ResumeForge
                    </p>
                    <Link
                        to="/register"
                        className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg shadow-lg"
                    >
                        Get Started for Free
                    </Link>
                    <p className="text-sm mt-4 opacity-80">
                        No credit card required • Free forever
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;