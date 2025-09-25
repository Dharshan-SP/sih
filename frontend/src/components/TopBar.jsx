import React from 'react';
import { Link } from 'react-router-dom';
export default function Topbar({ onToggleSidebar }) {
    return (
        <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b">
            <div className="flex items-center space-x-3">
                <button className="md:hidden p-2 rounded hover:bg-gray-100" onClick={onToggleSidebar} aria-label="toggle sidebar">☰</button>
                <Link to="/" className="text-xl font-semibold text-slate-800">VulnSight</Link>
                <span className="text-sm text-slate-500">Centralized Vulnerability Detection</span>
            </div>
            <div className="flex items-center space-x-4">
                <input placeholder="Search targets or CVE" className="hidden md:block border rounded px-3 py-2 text-sm w-72" />
                <button className="px-3 py-2 rounded bg-slate-800 text-white text-sm">New Scan</button>
                <div className="p-2 rounded-full bg-gray-100">U</div>
            </div>
        </header>
    );
}