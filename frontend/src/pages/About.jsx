import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Zap, Stethoscope, ChevronLeft } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen relative overflow-y-auto bg-slate-900 selection:bg-cyan-500/30 pb-20">

            {/* Navigation Bar */}
            <nav className="relative z-20 flex items-center justify-between px-6 py-4 lg:px-12 backdrop-blur-md border-b border-white/5 bg-slate-900/80 sticky top-0">
                <div className="flex items-center gap-3">
                    <Link to="/" className="text-slate-400 hover:text-white transition-colors mr-4 p-2 rounded-full hover:bg-slate-800">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="w-8 h-8 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-wide">DermoAI</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-white hover:text-cyan-400 font-medium transition-colors text-sm">Log In</Link>
                    <Link to="/signup" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-all backdrop-blur-md">Sign Up</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 px-6">
                {/* Background Image */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-fixed opacity-40 mix-blend-luminosity"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=2070&auto=format&fit=crop")',
                    }}
                ></div>
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900"></div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-xs tracking-wider uppercase mb-6"
                    >
                        <ShieldCheck className="w-4 h-4" /> Our Mission
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
                    >
                        Democratizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Dermatological Care</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                    >
                        We believe everyone should have access to rapid, deeply accurate skin health insights. DermoAI combines cutting-edge computer vision with localized speech recognition to deliver instant severity assessments directly to your device.
                    </motion.p>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl font-bold text-white mb-6">How DermoAI Learns</h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-1 shadow-inner shadow-cyan-500/20">
                                <Zap className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Advanced Neural Networks</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">Our primary diagnostic engine relies on a ResNet-based convolutional neural network fine-tuned on diverse skin tones and over 50+ unique dermatological conditions.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1 shadow-inner shadow-blue-500/20">
                                <Stethoscope className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white mb-2">Doctor Verified Pipelines</h3>
                                <p className="text-slate-400 leading-relaxed text-sm">Every prediction algorithm passes through a secondary verification layer designed with certified dermatologists to ensure precision limits and mitigate hallucination risks.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    {/* Decorative image container */}
                    <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl shadow-cyan-500/10 aspect-video md:aspect-[4/3]">
                        <img
                            src="https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1964&auto=format&fit=crop"
                            alt="AI Laboratory Code"
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                    </div>
                </motion.div>
            </div>

        </div>
    );
};

export default About;
