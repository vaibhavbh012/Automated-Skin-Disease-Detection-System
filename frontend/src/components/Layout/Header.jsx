import React from 'react';
import { Bell, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { user } = useAuth();

    // Get time of day for greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between p-4 lg:px-8 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
            <div className="flex-1 lg:ml-0 ml-12">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 hidden lg:block">
                    {greeting}, {user?.name?.split(' ')[0] || 'User'}
                </h2>
                <h2 className="text-xl font-bold text-white lg:hidden">Dashboard</h2>
            </div>

            <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <button className="relative p-2 text-slate-400 hover:text-white transition-colors group">
                    <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></div>
                    <Bell className="w-6 h-6 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                </button>

                {/* User Profile */}
                <Link to="/profile" className="flex items-center gap-3 pl-4 border-l border-slate-700 hover:bg-slate-800/50 p-2 rounded-xl transition-colors cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-white leading-tight group-hover:text-cyan-400 transition-colors">{user?.name || 'Demo User'}</p>
                        <p className="text-xs text-cyan-400">Patient Profile</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                        <UserCircle className="w-6 h-6 text-white" />
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default Header;
