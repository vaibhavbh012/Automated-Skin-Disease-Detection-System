import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Zap, Stethoscope } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-900 selection:bg-cyan-500/30">

            {/* Realistic Background Image with Dark Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop")',
                }}
            >
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
                {/* Animated Gradient Accents */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow"></div>
            </div>

            {/* Navigation Bar */}
            <nav className="relative z-20 flex items-center justify-between px-6 py-4 lg:px-12 backdrop-blur-md border-b border-white/5 bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-wide">DermoAI</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/about" className="text-slate-300 hover:text-white font-medium transition-colors hidden sm:block mr-4">About Us</Link>
                    <Link to="/login" className="text-white hover:text-cyan-400 font-medium transition-colors">Log In</Link>
                    <Link to="/signup" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-5 py-2 rounded-full font-medium transition-all backdrop-blur-md">Sign Up</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold text-sm mb-6 tracking-wide uppercase">
                        Next-Generation Dermatological AI
                    </span>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                        Clearer Skin Through <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            Intelligent Analysis
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Upload a photo or take a live picture of your skin concern. Describe your symptoms using voice or text. Get instant, highly accurate AI severity assessments and treatment recommendations.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/signup"
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-primary rounded-full text-white font-bold text-lg shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all hover:-translate-y-1"
                        >
                            Start Free Analysis
                        </Link>
                        <Link
                            to="/about"
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-md flex items-center justify-center gap-2"
                        >
                            <Stethoscope className="w-5 h-5 text-cyan-400" />
                            How It Works
                        </Link>
                    </div>
                </motion.div>

                {/* Feature Highlights */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20"
                >
                    <div className="glass p-6 rounded-2xl flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Instant Results</h3>
                        <p className="text-slate-400 text-sm">Real-time analysis powered by advanced convolutional neural networks.</p>
                    </div>

                    <div className="glass p-6 rounded-2xl flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Clinical Accuracy</h3>
                        <p className="text-slate-400 text-sm">Trained on thousands of dermatologist-verified skin condition images.</p>
                    </div>

                    <div className="glass p-6 rounded-2xl flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
                            <Activity className="w-6 h-6" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Progress Tracking</h3>
                        <p className="text-slate-400 text-sm">Monitor your skin's healing journey with historical severity timelines.</p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Landing;
