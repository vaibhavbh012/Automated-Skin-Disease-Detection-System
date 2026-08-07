import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Activity,
    Home,
    UploadCloud,
    Mic,
    Stethoscope,
    LineChart,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { logout } = useAuth();

    const navItems = [
        { path: '/dashboard', label: 'Skin Analysis', icon: Home },
        { path: '/dashboard#upload-dataset', label: 'Upload Dataset', icon: UploadCloud },
        { path: '/dashboard#problem', label: 'Voice / Text Input', icon: Mic },
        { path: '/consult', label: 'Doctor Consult', icon: Stethoscope },
        { path: '/progress', label: 'Progress Tracking', icon: LineChart },
        { path: '/about', label: 'About DermoAI', icon: Activity },
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    // Close sidebar on mobile after clicking a link
    const handleNavClick = () => {
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 glass-card text-white shadow-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Overlay (Mobile) */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar Content */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: isOpen ? 0 : (window.innerWidth >= 1024 ? 0 : -300) }}
                transition={{ duration: 0.3 }}
                className={`fixed lg:static inset-y-0 left-0 z-40 w-72 glass-card border-l-0 border-y-0 border-r border-slate-700/50 flex flex-col transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Logo Area */}
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white leading-tight">DermoAI</h1>
                        <p className="text-xs text-cyan-400 font-medium">Smart Skin Analysis</p>
                    </div>
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        // Logic to highlight base path ignoring hash for simple links
                        const isActive = location.pathname === item.path.split('#')[0];
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                onClick={handleNavClick}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? 'bg-gradient-primary text-white shadow-lg shadow-cyan-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* User / Logout Area */}
                <div className="p-4 mt-auto">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
