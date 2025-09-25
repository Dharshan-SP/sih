import React from 'react';
import { Link } from 'react-router-dom';
import IconScan from './IconScan';
export default function Sidebar({ open }){
return (
<aside className={`bg-white/80 backdrop-blur-sm border-r w-64 p-4 ${open ? "block" : "hidden md:block"}`}>
<nav className="space-y-2">
<Link to="/" className="flex items-center p-2 rounded hover:bg-gray-50"> <IconScan/> Dashboard</Link>
<Link to="/scan" className="flex items-center p-2 rounded hover:bg-gray-50">Scan Setup</Link>
<Link to="/progress" className="flex items-center p-2 rounded hover:bg-gray-50">Scan Progress</Link>
<Link to="/results" className="flex items-center p-2 rounded hover:bg-gray-50">Results</Link>
<Link to="/history" className="flex items-center p-2 rounded hover:bg-gray-50">History</Link>
<Link to="/reports" className="flex items-center p-2 rounded hover:bg-gray-50">Generate Report</Link>
<Link to="/settings" className="flex items-center p-2 rounded hover:bg-gray-50">Settings</Link>
<Link to="/help" className="flex items-center p-2 rounded hover:bg-gray-50">Help & Docs</Link>
</nav>
</aside>
);
}