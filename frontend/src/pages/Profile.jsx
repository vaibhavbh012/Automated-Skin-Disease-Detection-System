import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Activity, ShieldCheck, CreditCard, Stethoscope } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-slate-400">Manage your personal information and subscription details.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column: ID Card */}
                <div
                    className="col-span-1"
                >
                    <div className="glass-card p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
                        {/* Background flourish */}
                        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-cyan-500/20 to-transparent"></div>

                        <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-900 shadow-xl flex items-center justify-center relative z-10 mt-4 mb-4 text-cyan-400">
                            <User className="w-12 h-12" />
                        </div>

                        <h2 className="text-2xl font-bold text-white relative z-10">{user?.name || 'Guest User'}</h2>
                        <p className="text-slate-400 text-sm mb-6 relative z-10 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {user?.email || 'guest@dermoai.com'}</p>

                        <div className="w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                            <div className="flex justify-between items-center text-sm mb-2">
                                <span className="text-slate-400">Member Since</span>
                                <span className="text-white font-medium flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> May 2026</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Status</span>
                                <span className="text-cyan-400 font-medium flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Verified</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Details & Settings */}
                <div
                    className="col-span-1 md:col-span-2 space-y-6"
                >
                    {/* Subscription Tier */}
                    <div className="glass-card p-6 rounded-2xl border-l-4 border-cyan-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl"></div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2"><CreditCard className="w-5 h-5 text-cyan-400" /> Subscription Plan</h3>
                            <span className="bg-gradient-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.3)]">PRO PLAN</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-4">You have unlimited access to AI analysis, historical tracking, and priority doctor consultations.</p>
                        <button className="text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors decoration-cyan-400/30 hover:underline underline-offset-4">Manage Subscription →</button>
                    </div>

                    {/* Activity Overvew */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-400" /> Account Activity</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm">Total Scans Performed</h4>
                                        <p className="text-xs text-slate-500">Lifetime usage</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-white">12</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <Stethoscope className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm">Consultations Booked</h4>
                                        <p className="text-xs text-slate-500">Lifetime usage</p>
                                    </div>
                                </div>
                                <span className="text-2xl font-bold text-white">3</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
