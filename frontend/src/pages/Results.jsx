import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Stethoscope,
    ChevronLeft,
    Activity
} from 'lucide-react';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { result, imageUrl } = location.state || {};

    useEffect(() => {
        if (!result) {
            navigate('/dashboard');
        }
    }, [result, navigate]);

    if (!result) return null;

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'medium': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
            default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        }
    };

    const confidenceValue = parseInt(result.confidence) || 0;

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Analysis Results</h1>
                    <p className="text-slate-400">AI-generated dermatological assessment</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Image & Core Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="glass-card p-6 overflow-hidden relative"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-primary"></div>
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Analyzed Region</h3>
                        {imageUrl ? (
                            <div className="rounded-xl overflow-hidden border border-slate-700 aspect-square relative group">
                                <img src={imageUrl} alt="Analyzed Skin" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay"></div>
                                {/* AI Scanner overlay effect */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)] animate-scan"></div>
                            </div>
                        ) : (
                            <div className="rounded-xl bg-slate-800 p-8 text-center text-slate-500 border border-slate-700 aspect-square flex items-center justify-center">
                                No Image Provided
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="glass-card p-6 flex flex-col items-center justify-center text-center"
                    >
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6 w-full text-left">Confidence Score</h3>

                        {/* Circular Progress Indicator */}
                        <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="70" className="text-slate-800 stroke-current" strokeWidth="12" fill="transparent" />
                                <motion.circle
                                    initial={{ strokeDashoffset: 440 }}
                                    animate={{ strokeDashoffset: 440 - (440 * confidenceValue) / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                    cx="80" cy="80" r="70" className="text-cyan-500 stroke-current" strokeWidth="12" fill="transparent"
                                    strokeDasharray="440"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                    {result.confidence}
                                </span>
                                <span className="text-xs text-slate-400 mt-1">Match Rate</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Details & Recommendations */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="glass-card p-8 relative overflow-hidden"
                    >
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Detected Condition</h3>
                                <h2 className="text-4xl font-bold text-white flex items-center gap-3">
                                    {result.disease}
                                    <Activity className="w-6 h-6 text-cyan-400" />
                                </h2>
                            </div>

                            <div className="text-left sm:text-right">
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 sm:mb-1">Severity Assessment</h3>
                                <span className={`px-4 py-1.5 rounded-full border text-sm font-bold tracking-wide uppercase inline-block ${getSeverityColor(result.severity)}`}>
                                    {result.severity} Level
                                </span>
                            </div>
                        </div>

                        {/* Warning Box */}
                        {result.recommendations?.warning && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-4 mb-8">
                                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-red-400 font-bold mb-1">Medical Disclaimer</h4>
                                    <p className="text-red-300/80 text-sm leading-relaxed">{result.recommendations.warning}</p>
                                </div>
                            </div>
                        )}

                        {/* Dos and Donts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Do's List */}
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                                <h4 className="text-green-400 font-bold flex items-center gap-2 mb-4">
                                    <CheckCircle2 className="w-5 h-5" /> Recommended Actions
                                </h4>
                                <ul className="space-y-3">
                                    {result.recommendations?.dos.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Don'ts List */}
                            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
                                <h4 className="text-red-400 font-bold flex items-center gap-2 mb-4">
                                    <XCircle className="w-5 h-5" /> Actions to Avoid
                                </h4>
                                <ul className="space-y-3">
                                    {result.recommendations?.donts.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link
                            to="/consult"
                            className="flex-1 bg-gradient-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:-translate-y-1 hover:shadow-cyan-500/40 transition-all border border-white/10"
                        >
                            <Stethoscope className="w-5 h-5" />
                            Consult Dermatologist Now
                        </Link>
                        <Link
                            to="/dashboard"
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all"
                        >
                            Analyze Another Condition
                        </Link>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Results;
