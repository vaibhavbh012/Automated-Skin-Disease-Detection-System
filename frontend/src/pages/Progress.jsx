import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Activity,
    Calendar,
    AlertCircle,
    CheckCircle2,
    ChevronRight
} from 'lucide-react';
import api from '../services/api';

const Progress = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const response = await api.get('/progress');
            setHistory(response.data);
        } catch (error) {
            console.error('Failed to fetch progress', error);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityStyle = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'high': return { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/30' };
            case 'medium': return { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/30' };
            case 'low': return { bg: 'bg-green-500', text: 'text-green-400', border: 'border-green-500/30' };
            default: return { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500/30' };
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Progress Tracking</h1>
                <p className="text-slate-400">Monitor your skin condition improvements over time</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-10 h-10 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Analytics Overview */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Top Stat Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="glass-card p-6 flex items-center justify-between"
                            >
                                <div>
                                    <h4 className="text-slate-400 text-sm font-semibold uppercase tracking-wide mb-1">Overall Health Trend</h4>
                                    <p className="text-2xl font-bold text-white flex items-center gap-2">
                                        Improving <TrendingUp className="w-6 h-6 text-green-400" />
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="glass-card p-6 flex items-center justify-between"
                            >
                                <div>
                                    <h4 className="text-slate-400 text-sm font-semibold uppercase tracking-wide mb-1">Total Scans</h4>
                                    <p className="text-2xl font-bold text-white tracking-widest">{history.length}</p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-cyan-400" />
                                </div>
                            </motion.div>
                        </div>

                        {/* Fake Chart Area */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="glass-card p-6 min-h-[300px] flex flex-col"
                        >
                            <h3 className="text-lg font-bold text-white mb-6">Severity History</h3>
                            <div className="flex-1 flex items-end gap-6 pb-6 border-b border-slate-700/50 mt-auto px-4 relative">
                                {/* Y Axis Guides */}
                                <div className="absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between pointer-events-none opacity-20">
                                    <div className="w-full border-t border-slate-500 border-dashed hidden sm:block"></div>
                                    <div className="w-full border-t border-slate-500 border-dashed hidden sm:block"></div>
                                    <div className="w-full border-t border-slate-500 border-dashed hidden sm:block"></div>
                                </div>

                                {/* Bars - Mock visualization based on history data */}
                                {history.map((item, idx) => {
                                    const style = getSeverityStyle(item.severity);
                                    // Mock height calculation based on severity
                                    const height = item.severity === 'High' ? 'h-48' : item.severity === 'Medium' ? 'h-32' : 'h-16';

                                    return (
                                        <div key={item.id} className="flex-1 flex flex-col justify-end items-center group/chart relative">
                                            <div className={`w-full max-w-[48px] ${height} rounded-t-lg ${style.bg} transition-all duration-500 hover:brightness-125 relative shadow-[0_0_15px_rgba(0,0,0,0.2)]`}>
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover/chart:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
                                                    {item.severity} severity
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-400 font-medium mt-4 whitespace-nowrap">
                                                {item.date.split(' ')[0]} {item.date.split(' ')[1]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Timeline List */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="glass-card p-6 h-full"
                        >
                            <h3 className="text-lg font-bold text-white mb-6">Recent Reports</h3>

                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">

                                {history.map((record, index) => {
                                    const style = getSeverityStyle(record.severity);

                                    return (
                                        <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            {/* Timeline Dot */}
                                            <div className={`flex items-center justify-center w-4 h-4 rounded-full border-2 border-slate-900 ${style.bg} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}></div>

                                            {/* Item Content */}
                                            <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    <time className="text-xs font-semibold text-slate-400 uppercase">{record.date}</time>
                                                </div>
                                                <h4 className="text-base font-bold text-white mb-2">{record.disease}</h4>
                                                <span className={`inline-flex items-center text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-opacity-20 ${style.bg} ${style.text} bg-slate-900 border ${style.border}`}>
                                                    {record.severity}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        </motion.div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Progress;
